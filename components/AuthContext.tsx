import React, { createContext, useContext, useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

interface AuthContextData {
  user: any;
  isNewUser: boolean;
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isNewUser, setIsNewUser] = useState(true);
  const [initializing, setInitializing] = useState(true);

  // Monitora o estado de autenticação nativo
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // Busca dados adicionais no Firestore
        const userDoc = await firestore().collection('users').doc(firebaseUser.uid).get();
        
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
      
      if (initializing) {
        setInitializing(false);
      }
    });

    return subscriber; // unsubscribe ao desmontar
  }, []);

  const login = async (email: string, password: string) => {
    await auth().signInWithEmailAndPassword(email, password);
  };

  const register = async (email: string, password: string, displayName: string) => {
    const response = await auth().createUserWithEmailAndPassword(email, password);
    const firebaseUser = response.user;

    // Salva informações extras no Firestore
    await firestore().collection('users').doc(firebaseUser.uid).set({
      uid: firebaseUser.uid,
      email,
      displayName,
      createdAt: new Date(),
    });
  };

  const logout = async () => {
    await auth().signOut();
  };

  return (
    <AuthContext.Provider value={{ user, isNewUser, initializing, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);