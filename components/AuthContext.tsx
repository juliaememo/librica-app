import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  deleteUser,
  reload,
  User,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/src/services/firebase';
import { limparCachesLegadosExercicios } from '@/src/services/progresso';
import {
  NicknameEmUsoError,
  isNicknameDisponivel,
  nicknameKey,
  reservarNicknameCadastro,
  validarFormatoNickname,
} from '@/src/services/nickname';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isEmailFormatoValido(email: string): boolean {
  return EMAIL_REGEX.test(email.trim().toLowerCase());
}

function traduzErroFirebase(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Este e-mail já está cadastrado. Tente fazer login.';
    case 'auth/invalid-email':
      return 'E-mail inválido. Confira a digitação.';
    case 'auth/weak-password':
      return 'A senha deve ter pelo menos 6 caracteres.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'E-mail ou senha incorretos.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Aguarde um pouco e tente de novo.';
    default:
      return 'Não foi possível concluir. Tente novamente.';
  }
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  /** Compat: _layout antigo lia `initializing`; manter alias para não quebrar. */
  initializing: boolean;
  register: (email: string, password: string, displayName: string, surname: string, username: string) => Promise<void>;
  login: (email: string, password: string) => Promise<{ emailVerified: boolean }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  refreshUser: () => Promise<boolean>;
  markEmailVerified: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (email: string, password: string, displayName: string, surname: string, username: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!isEmailFormatoValido(normalizedEmail)) {
      throw new Error('E-mail inválido. Confira a digitação.');
    }
    const nicknameLimpo = username.trim();
    const erroNickname = validarFormatoNickname(nicknameLimpo);
    if (erroNickname) {
      throw new Error(erroNickname);
    }
    // Checagem rápida ANTES de criar o usuário no Auth: evita criar conta
    // com e-mail válido para depois descobrir que o nickname está ocupado.
    try {
      const livre = await isNicknameDisponivel(nicknameLimpo);
      if (!livre) {
        throw new NicknameEmUsoError();
      }
    } catch (error: unknown) {
      if (error instanceof NicknameEmUsoError) throw error;
      // Sem leitura (offline/regras): segue e a transação decide no final.
    }
    let firebaseUser: User | null = null;
    try {
      // Conta nova nunca herda cache local de outra conta no mesmo aparelho.
      await limparCachesLegadosExercicios();
      // 1. Cria o usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
      firebaseUser = userCredential.user;

      // 2. Salva os dados detalhados no Firestore na coleção 'users'
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        uid: firebaseUser.uid,
        nome: displayName, // Salvo como 'nome' para compatibilidade com a tela de perfil
        displayName: displayName,
        sobrenome: surname,
        nickname: nicknameLimpo,
        nicknameLower: nicknameKey(nicknameLimpo),
        email: normalizedEmail,
        fotoPerfil: '',
        emailVerified: false,
        createdAt: new Date().toISOString(),
      });

      // 2b. Reserva atômica do nickname em 'nicknames/{minusculo}'.
      // Se outra pessoa registrou o mesmo nickname entre a checagem e agora,
      // a transação falha e desfazemos a conta para liberar o e-mail.
      // Se as regras ainda não foram publicadas (permission-denied), segue
      // sem reservar para não travar o cadastro; a unicidade passa a valer
      // após `firebase deploy --only firestore:rules`.
      try {
        await reservarNicknameCadastro(firebaseUser.uid, nicknameLimpo);
      } catch (reservaError: unknown) {
        if (reservaError instanceof NicknameEmUsoError) {
          await deleteUser(firebaseUser).catch(() => undefined);
          throw reservaError;
        }
        const firestoreCode = (reservaError as { code?: string }).code ?? '';
        if (firestoreCode === 'permission-denied') {
          console.warn(
            'Regras do Firestore sem coleção nicknames; cadastro segue sem reserva. Publique firestore.rules.',
          );
        } else {
          throw reservaError;
        }
      }

      // 3. Envia o e-mail de confirmação UMA única vez (só no cadastro).
      // O link do Firebase prova que o endereço existe e pertence ao usuário.
      await sendEmailVerification(firebaseUser);

      setUser(firebaseUser);
    } catch (error: unknown) {
      if (error instanceof NicknameEmUsoError) throw error;
      const code = (error as { code?: string }).code ?? '';
      if (!code && error instanceof Error) throw error;
      throw new Error(traduzErroFirebase(code));
    }
  };

  const login = async (email: string, password: string): Promise<{ emailVerified: boolean }> => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!isEmailFormatoValido(normalizedEmail)) {
      throw new Error('E-mail inválido. Confira a digitação.');
    }
    try {
      // Troca de conta: remove o cache legado global para não vazar entre usuários.
      await limparCachesLegadosExercicios();
      const credential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      // Recarrega para ler o status real de verificação (usuário pode ter
      // clicado no link fora do app e voltado para o login).
      await reload(credential.user);
      const verified = credential.user.emailVerified;
      if (verified) {
        // setDoc com merge cria o doc de contas antigas sem documento em 'users'.
        await setDoc(
          doc(db, 'users', credential.user.uid),
          {
            uid: credential.user.uid,
            email: credential.user.email ?? normalizedEmail,
            emailVerified: true,
          },
          { merge: true },
        ).catch(() => undefined);
      }
      return { emailVerified: verified };
    } catch (error: unknown) {
      const code = (error as { code?: string }).code ?? '';
      if (!code && error instanceof Error) throw error;
      throw new Error(traduzErroFirebase(code));
    }
  };

  const logout = async () => {
    await signOut(auth);
    // Remove o cache legado global ao sair.
    await limparCachesLegadosExercicios();
  };

  const resetPassword = async (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!isEmailFormatoValido(normalizedEmail)) {
      throw new Error('E-mail inválido. Confira a digitação.');
    }
    try {
      await sendPasswordResetEmail(auth, normalizedEmail);
    } catch (error: unknown) {
      const code = (error as { code?: string }).code ?? '';
      if (!code && error instanceof Error) throw error;
      throw new Error(traduzErroFirebase(code));
    }
  };

  const sendVerificationEmail = async () => {
    const current = auth.currentUser;
    if (!current) {
      throw new Error('Nenhum usuário logado para verificar.');
    }
    try {
      await sendEmailVerification(current);
    } catch (error: unknown) {
      const code = (error as { code?: string }).code ?? '';
      throw new Error(traduzErroFirebase(code));
    }
  };

  /** Recarrega o usuário e retorna se o e-mail já foi verificado. */
  const refreshUser = async (): Promise<boolean> => {
    const current = auth.currentUser;
    if (!current) return false;
    await reload(current);
    const verified = auth.currentUser?.emailVerified ?? false;
    setUser(auth.currentUser);
    if (verified) {
      await setDoc(
        doc(db, 'users', current.uid),
        {
          uid: current.uid,
          email: current.email ?? '',
          emailVerified: true,
        },
        { merge: true },
      ).catch(() => undefined);
    }
    return verified;
  };

  const markEmailVerified = async () => {
    const current = auth.currentUser;
    if (!current) return;
    await setDoc(
      doc(db, 'users', current.uid),
      {
        uid: current.uid,
        email: current.email ?? '',
        emailVerified: true,
      },
      { merge: true },
    ).catch(() => undefined);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, initializing: loading, register, login, logout, resetPassword, sendVerificationEmail, refreshUser, markEmailVerified }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);