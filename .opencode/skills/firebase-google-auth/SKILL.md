---
name: firebase-google-auth
description: Configuração do Firebase Auth, Firestore e fluxo de Login com Google no Expo.
---

## Regras de Autenticação
- **SDK Modular:** Utilize sempre a sintaxe modular do Firebase (v10+), importando funções diretamente de `firebase/auth` e `firebase/firestore`.
- **Variáveis de Ambiente:** Nunca hardcode credenciais. Utilize variáveis públicas do Expo iniciadas com `EXPO_PUBLIC_` (ex: `EXPO_PUBLIC_FIREBASE_API_KEY`).
- **Google Sign-In:** Implemente o fluxo de login utilizando o `expo-auth-session` ou bibliotecas validadas para web/mobile com Firebase, garantindo tratamento de erros robusto (`try/catch`) e feedback visual de loading no botão.