---
name: expo-54-ts
description: Diretrizes de arquitetura, tipagem com TypeScript e compatibilidade com Expo Go 54.
---

## Regras de Desenvolvimento
- **TypeScript Obrigatório:** Utilize interfaces ou types para todas as props de componentes, estados complexos e retornos de API. Evite o uso de `any`.
- **Expo Go 54 Limits:** Como estamos rodando no Expo Go 54, não utilize bibliotecas que exijam modificações em arquivos nativos (`ios/` ou `android/` nativos customizados). Priorize bibliotecas Expo Modules puras ou JS-compatíveis.
- **Estrutura de Pastas:** Mantenha a organização usando path aliases configurados no `tsconfig.json` (ex: `@components`, `@screens`, `@services`).