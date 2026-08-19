import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// As suas credenciais do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyALbSI__XTTJftLRIOMJfaFv6xOU1ulk9M",
  authDomain: "librica-app.firebaseapp.com",
  projectId: "librica-app",
  storageBucket: "librica-app.firebasestorage.app",
  messagingSenderId: "1009349115208",
  appId: "1:1009349115208:web:0f30d89000c2d3e32ac77d",
  measurementId: "G-YDKJ70QL8T"
};

// Inicializa o Firebase (evitando duplicar instâncias)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Inicializa a Autenticação com AsyncStorage de forma segura para o React Native/Expo
let authInstance;
try {
  // Tenta recuperar a instância se já existir
  authInstance = getAuth(app);
} catch (e) {
  // Se não existir, inicializa com a persistência do AsyncStorage
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

// Inicializa o Banco de Dados (Firestore)
const dbInstance = getFirestore(app);

// Exporta as instâncias corretamente
export const auth = authInstance;
export const db = dbInstance;