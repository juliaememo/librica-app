import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { auth } from './firebase'; // Certifique-se de que o caminho relativo aponta corretamente para o seu firebase.js

// Cadastro comum (E-mail e Senha)
export const cadastrarUsuario = (email, senha) => {
  return createUserWithEmailAndPassword(auth, email, senha);
};

// Login comum (E-mail e Senha)
export const logarUsuario = (email, senha) => {
  return signInWithEmailAndPassword(auth, email, senha);
};