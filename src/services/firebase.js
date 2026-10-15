import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
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

// Inicializa a Autenticação com persistência no AsyncStorage.
// ATENÇÃO: getAuth() nunca joga erro, então o try/catch antigo caía sempre
// no getAuth sem persistência (sessão só em memória = login perdido ao
// fechar o app). O correto no React Native/Expo é SEMPRE initializeAuth
// com getReactNativePersistence, caindo para getAuth só se já inicializado
// (hot reload).
let authInstance;
try {
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  // auth/already-initialized (ex: Fast Refresh): reutiliza a instância,
  // que já foi criada com persistência acima.
  authInstance = getAuth(app);
}

// Inicializa o Banco de Dados (Firestore)
const dbInstance = getFirestore(app);

// Inicializa o Storage (vídeos do Dicionário — streaming/download temporário, nada empacotado no app)
const storageInstance = getStorage(app);

// Exporta as instâncias corretamente
export const auth = authInstance;
export const db = dbInstance;
export const storage = storageInstance;