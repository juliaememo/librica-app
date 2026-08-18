import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { auth } from './firebase'; // Certifique-se de que o caminho aponta para o seu firebase.js

// Cadastro comum
export const cadastrarUsuario = (email, senha) => {
  return createUserWithEmailAndPassword(auth, email, senha);
};

// Login comum
export const logarUsuario = (email, senha) => {
  return signInWithEmailAndPassword(auth, email, senha);
};