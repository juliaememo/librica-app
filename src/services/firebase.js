import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// As suas credenciais do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDcGYfOswoffjYHZe2ByCtTDrbk2k49zQ4",
  authDomain: "librica-app.firebaseapp.com",
  projectId: "librica-app",
  storageBucket: "librica-app.firebasestorage.app",
  messagingSenderId: "1009349115208",
  appId: "1:1009349115208:web:0f30d89000c2d3e32ac77d",
  measurementId: "G-YDKJ70QL8T"
};

// Inicializa o Firebase (evitando duplicar instâncias)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Inicializa a Autenticação com AsyncStorage de forma segura para o React Native
let auth;
try {
  // Tenta buscar se o auth já foi inicializado para evitar o erro de re-inicialização
  auth = getAuth(app);
} catch (e) {
  // Se não foi, inicializa com a persistência do AsyncStorage
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

// Inicializa o Banco de Dados (Firestore)
const db = getFirestore(app);

export { db, auth };