import { doc, getDoc, runTransaction } from 'firebase/firestore';
import { db } from '@/src/services/firebase';

export const NICKNAME_KEY_REGEX = /^[a-z0-9_.]+$/;
const NICKNAME_RESERVA_FALLBACK_MSG = 'Nickname já está em uso. Escolha outro.';

export class NicknameEmUsoError extends Error {
  constructor() {
    super(NICKNAME_RESERVA_FALLBACK_MSG);
    this.name = 'NicknameEmUsoError';
  }
}

/** Chave canônica: trim + minúsculas. "Leo" e "leo" disputam a mesma reserva. */
export function nicknameKey(nickname: string): string {
  return nickname.trim().toLowerCase();
}

export function validarFormatoNickname(nickname: string): string | null {
  const valor = nickname.trim();
  if (valor.length < 3) return 'Nickname precisa ter pelo menos 3 caracteres.';
  if (valor.length > 20) return 'Nickname muito longo (máx. 20 caracteres).';
  if (!NICKNAME_KEY_REGEX.test(valor.toLowerCase())) {
    return 'Nickname só pode ter letras, números, ponto e underline (sem espaços).';
  }
  return null;
}

interface ReservaNicknameDoc {
  uid: string;
  nickname: string;
}

/** Leitura barata (1 doc) para checar disponibilidade antes de tentar a transação. */
export async function isNicknameDisponivel(
  nickname: string,
  currentUid?: string | null,
): Promise<boolean> {
  const key = nicknameKey(nickname);
  if (!key) return false;
  const snap = await getDoc(doc(db, 'nicknames', key));
  if (!snap.exists()) return true;
  const data = snap.data() as Partial<ReservaNicknameDoc>;
  return data.uid === currentUid;
}

/**
 * Reserva o nickname para um cadastro novo, de forma atômica.
 * Deve rodar DEPOIS de criar o usuário no Auth, dentro do register.
 * Se perder a corrida, lança NicknameEmUsoError.
 */
export async function reservarNicknameCadastro(
  uid: string,
  nickname: string,
): Promise<void> {
  const key = nicknameKey(nickname);
  const userRef = doc(db, 'users', uid);
  const reservaRef = doc(db, 'nicknames', key);
  await runTransaction(db, async (tx) => {
    const reserva = await tx.get(reservaRef);
    if (reserva.exists()) {
      throw new NicknameEmUsoError();
    }
    tx.set(reservaRef, {
      uid,
      nickname: nickname.trim(),
      createdAt: new Date().toISOString(),
    });
    tx.set(
      userRef,
      {
        uid,
        nickname: nickname.trim(),
        nicknameLower: key,
      },
      { merge: true },
    );
  });
}

/**
 * Troca o nickname de quem já tem conta, de forma atômica:
 * libera a reserva antiga (se pertencer ao uid) e ocupa a nova.
 * Mesma chave (só mudou maiúscula/minúscula ou espaços) só atualiza o display.
 */
export async function trocarNickname(
  uid: string,
  nicknameAntigo: string,
  nicknameNovo: string,
  email: string | null,
): Promise<void> {
  const chaveAntiga = nicknameKey(nicknameAntigo);
  const chaveNova = nicknameKey(nicknameNovo);
  const userRef = doc(db, 'users', uid);

  if (chaveAntiga === chaveNova) {
    const { setDoc } = await import('firebase/firestore');
    await setDoc(
      userRef,
      {
        uid,
        email: email ?? '',
        nickname: nicknameNovo.trim(),
        nicknameLower: chaveNova,
      },
      { merge: true },
    );
    return;
  }

  const reservaAntigaRef = chaveAntiga ? doc(db, 'nicknames', chaveAntiga) : null;
  const reservaNovaRef = doc(db, 'nicknames', chaveNova);

  await runTransaction(db, async (tx) => {
    const reservaNova = await tx.get(reservaNovaRef);
    if (reservaNova.exists()) {
      const dados = reservaNova.data() as Partial<ReservaNicknameDoc>;
      if (dados.uid !== uid) {
        throw new NicknameEmUsoError();
      }
    }
    if (reservaAntigaRef) {
      const reservaAntiga = await tx.get(reservaAntigaRef);
      if (reservaAntiga.exists()) {
        const dados = reservaAntiga.data() as Partial<ReservaNicknameDoc>;
        if (dados.uid === uid) {
          tx.delete(reservaAntigaRef);
        }
      }
    }
    tx.set(reservaNovaRef, {
      uid,
      nickname: nicknameNovo.trim(),
      createdAt: new Date().toISOString(),
    });
    tx.set(
      userRef,
      {
        uid,
        email: email ?? '',
        nickname: nicknameNovo.trim(),
        nicknameLower: chaveNova,
      },
      { merge: true },
    );
  });
}
