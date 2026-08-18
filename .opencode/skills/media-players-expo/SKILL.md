---
name: media-players-expo
description: Padrões para reprodução de vídeos internos/locais e vídeos do YouTube em aplicações Expo.
---

## Regras para Players de Vídeo
- **Vídeos Internos (Locais):** Utilize o componente `Video` do pacote `expo-av`. Sempre gerencie o ciclo de vida para pausar ou descarregar o player (`unloadAsync`) quando o usuário sair da tela, prevenindo vazamento de memória.
- **Vídeos do YouTube:** Utilize o pacote `react-native-youtube-iframe`. Garanta que o player seja encapsulado em um container responsivo e trate os estados de carregamento da API do YouTube.