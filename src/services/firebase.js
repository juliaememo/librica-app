// Importe as funções do SDK do Firebase
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, getReactNativePersistence } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence as getAuthPersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// As suas credenciais que vieram direto da imagem do Firebase:
const firebaseConfig = {
  apiKey: "AIzaSyALbSI__XTTJftLRIOMJfav6xOU1ulk9M",
  authDomain: "librica-app.firebaseapp.com",
  projectId: "librica-app",
  storageBucket: "librica-app.appfirebasestorage.app",
  messagingSenderId: "1009349115208",
  appId: "1:1009349115208:web:0f30d89000c2d3e32ac77d",
  measurementId: "G-YDKJ70QL8T"
};

// Inicializa o Firebase (evitando duplicar instâncias)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Inicializa o Banco de Dados (Firestore) otimizado para React Native
const db = initializeFirestore(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Inicializa a Autenticação otimizada para React Native
const auth = initializeAuth(app, {
  persistence: getAuthPersistence(AsyncStorage)
});

// Exporta para usar nas suas telas de login, cadastro e banco
export { db, auth };