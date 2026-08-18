import React, { createContext, useContext, useState, useEffect } from 'react'; 
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../src/services/firebase'; // Ajuste o caminho se necessário

const AuthContext = createContext({
  user: null as any,
  isNewUser: true,
  login: async (email: string, password: string) => {},
  register: async (email: string, password: string, displayName: string) => {},
  loginWithGoogle: async (idToken: string) => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isNewUser, setIsNewUser] = useState(true);

  // Monitora o estado de autenticação do Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Busca dados adicionais no Firestore se necessário
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || userDoc.data()?.displayName,
        });
        setIsNewUser(false);
      } else {
        setUser(null);
        setIsNewUser(true);
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, displayName: string) => {
    const response = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = response.user;

    // Salva informações extras do usuário no Firestore
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      uid: firebaseUser.uid,
      email,
      displayName,
      createdAt: new Date(),
    });
  };

  const loginWithGoogle = async (idToken: string) => {
    const credential = GoogleAuthProvider.credential(idToken);
    const response = await signInWithCredential(auth, credential);
    const firebaseUser = response.user;

    // Verifica se o usuário já existe no Firestore; se não, cria
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        createdAt: new Date(),
      });
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, isNewUser, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);