# 🎤 Roteiro de Apresentação — Librica (Parte de Programação)

> **Como usar este roteiro**
> - 🎤 **Falar** = texto pronto para você dizer (pode adaptar para o seu jeito de falar).
> - 🖥️ **Mostrar** = o que exibir no slide, no app ou no código nesse momento.
> - ⏱️ **Tempo** = duração sugerida do bloco (total da parte técnica: **~18 min**, com versão de corte para **~10 min** indicada em cada bloco).
> - 🔁 **Transição** = frase de amarração para o próximo bloco, para a apresentação nunca "morrer".

---

## 🗺️ Mapa da apresentação (ordem dos blocos)

| # | Bloco | Tempo | Tema central |
|---|-------|-------|--------------|
| 1 | Abertura + problema | 2 min | Por que o app existe |
| 2 | O app em 1 minuto | 2 min | Demo guiada das telas |
| 3 | Requisitos e regras | 1,5 min | O combinado do sistema |
| 4 | Arquitetura | 3 min | Cliente-Servidor + BaaS + camadas |
| 5 | Banco de dados | 3 min | Firestore, nicknames, cache local |
| 6 | Progresso do aluno | 2 min | Regra 50/50 e o bug que resolvemos |
| 7 | Stack tecnológico | 1,5 min | Ferramentas e por quê |
| 8 | Padrões de código | 1,5 min | TypeScript estrito e organização |
| 9 | Testes (QA) | 2 min | Como garantimos qualidade |
| 10 | Implantação | 1,5 min | Do código ao APK |
| 11 | Limitações e futuro | 1,5 min | Visão crítica do grupo |
| 12 | Fechamento | 1 min | Mensagem final |

**⏱️ Versão curta (~10 min):** blocos 1, 2, 4, 5, 6 e 9 (corte os blocos 3, 7, 8, 10, 11 ou funda 7+8 em um slide único).

---

## Bloco 1 — Abertura + problema (⏱️ 2 min)

🎤 **Falar:**

> "O Librica nasceu de um número do IBGE: apenas **25,6% das pessoas com deficiência** concluem o Ensino Médio, contra **57,3%** das pessoas sem deficiência. A escola não foi desenhada para o aluno surdo — e a gente decidiu fazer um pedaço dela que fosse.
>
> O Librica é um aplicativo mobile que ensina **química em Libras**, com videoaulas, exercícios de arrastar-e-soltar e um dicionário de sinais. Tudo pelo celular, de qualquer lugar.
>
> Eu vou apresentar a parte técnica: como o aplicativo foi construído, arquitetura, banco de dados, testes e implantação."

🖥️ **Mostrar:** slide com os dois números do IBGE destacados + logo do app.

🔁 **Transição:** *"Mas antes de falar de código, deixa eu mostrar o resultado na tela."*

---

## Bloco 2 — O app em 1 minuto (⏱️ 2 min)

🎤 **Falar (narrando a demo, nessa ordem):**

> "O fluxo do usuário tem só **6 telas**, e é isso que o torna intuitivo:
> 1. **Login** → e-mail e senha; quem não tem conta, cria ali mesmo.
> 2. **Tela inicial** → os módulos da trilha, do átomo até reações mais avançadas.
> 3. **Módulo** → videoaula em Libras + exercícios.
> 4. **Exercício** → arrastar elementos visuais, sem depender de texto.
> 5. **Dicionário** → todos os sinais, separados por categoria, filtráveis.
> 6. **Perfil** → progresso em cada módulo, foto, nome editáveis.
>
> Um detalhe de acessibilidade que eu gosto de destacar: **segurar o dedo** sobre um sinal mostra o vídeo dele em loop, e soltar fecha. Sem clique acidental, sem som, sem distração."

🖥️ **Mostrar:** app rodando no celular ou prints das 6 telas (Figuras 2–6 do documento). Se possível, **viva**: mostrar o "segurar para ver".

🔁 **Transição:** *"Tela limpa por fora significa decisão técnica por dentro. A primeira delas foi definir o contrato do sistema: os requisitos."*

---

## Bloco 3 — Requisitos e regras de negócio (⏱️ 1,5 min)

🎤 **Falar:**

> "Trabalhamos com **12 requisitos funcionais**, que resumo em três grupos:
> - **Aprender:** arrastar elementos nos exercícios, fácil acesso às videoaulas, dicionário com categorias.
> - **Identidade:** cadastro, login, esqueci-a-senha por e-mail, perfil editável — e regras que garantem **um e-mail = uma conta** e **nicknames únicos**.
> - **Progresso:** salvo por login e visível módulo a módulo.
>
> E as regras não funcionais são o coração do projeto: **nenhuma informação só por som** (sempre visual ou vibração), interface limpa, e uma regra de ouro — **o elemento vai direto para o sinal em Libras, sem passar pelo texto**."

🖥️ **Mostrar:** slide com os 3 grupos de requisitos + destaque para a RNF004 ("sem passar pelo texto").

🔁 **Transição:** *"Com o contrato definido, a pergunta seguinte foi: onde o cérebro do aplicativo mora? Na arquitetura."*

---

## Bloco 4 — Arquitetura (⏱️ 3 min) ⭐ *bloco mais importante*

🎤 **Falar:**

> "O Librica usa o estilo **Cliente-Servidor com Backend como Serviço — BaaS**. Na prática, três ideias combinadas:
>
> **1. Cliente-Servidor** — a interface roda no celular; autenticação, banco e mídia ficam na nuvem do Firebase. Escolhemos isso porque não precisamos configurar e manter um servidor próprio — a equipe inteira é de estudantes, e esse tempo foi investido no app.
>
> **2. Arquitetura em camadas no cliente** — o código é dividido em 5 camadas, cada uma com uma responsabilidade única: **app/** para telas e rotas, **components/** para a interface, **src/services/** para as regras de negócio e o Firebase, **src/data/** para o conteúdo didático, e **src/utils/** para funções auxiliares. Isso significa que, quando algo quebra, sabemos *exatamente onde mexer*.
>
> **3. Offline-first** — o app funciona sem internet. O AsyncStorage guarda o progresso no próprio celular e sincroniza com o Firestore quando a conexão volta."

🖥️ **Mostrar:** Figura 7 (diagrama da arquitetura) + Tabela 1 (camadas). Se quiser impressionar, mostre a árvore real do projeto (Figura 11) no slide.

🎤 **Falar (o fio que costura tudo):**

> "Do lado do Firebase, três pilares: o **Authentication** cuida do login e da verificação de e-mail; o **Cloud Firestore** guarda perfil e progresso; e o **Firebase Hosting** faz o streaming dos vídeos dos sinais — que ficam na nuvem justamente para o app não ficar pesado."

🔁 **Transição:** *"E toda essa arquitetura se apoia em um modelo de dados. Vamos entrar nele."*

---

## Bloco 5 — Banco de dados (⏱️ 3 min)

🎤 **Falar:**

> "Começamos desenhando um banco **relacional**, com o modelo entidade-relacionamento completo. Mas ao pensar melhor, migramos para o **Firestore**, um banco **NoSQL**, por três motivos:
> - Ele organiza os dados em **documentos flexíveis**, sem joins;
> - Quem garante a consistência é **o código + as regras de segurança**, e o app já faz os dois;
> - **Escala automática sem custo**, o que encaixa perfeitamente com o streaming de vídeos.

> Todo o modelo de dados cabe em **3 coleções**:
> - **users/{uid}** → nome, sobrenome, nickname, e-mail, foto e o mapa de progresso. O `uid` é gerado pelo Firebase Auth, e o `nicknameLower` existe para impedir que 'Lucas' e 'lucas' sejam contas diferentes.
> - **nicknames/{key}** → um diretório de unicidade: cada apelido é reservado uma única vez, numa **transação atômica**. Se duas pessoas tentarem o mesmo apelido ao mesmo tempo, uma recebe o erro 'apelido em uso'.
> - **config/geral** → guarda a **senha do módulo secreto**. Ela não está fixada no código: o administrador muda direto no Firebase, sem recompilar o app."

🖥️ **Mostrar:** Figura 9 (árvore do banco) + o exemplo JSON do `progresso` (módulo 100%, 50% e 13%).

🎤 **Falar (fechando com cache):**

> "E por baixo disso tudo, o **AsyncStorage** funciona como cache local. A fonte da verdade é sempre o Firestore — o cache existe para o app funcionar offline. As chaves do cache incluem o **uid do usuário**, e vou contar por quê no próximo bloco."

🔁 **Transição:** *"Porque justamente no progresso encontramos o bug mais interessante do projeto."*

---

## Bloco 6 — Progresso do aluno (⏱️ 2 min) ⭐ *melhor história para contar*

🎤 **Falar:**

> "A regra de progresso é simples de explicar: cada módulo vale **100%, dividido em 50% de vídeo assistido + 50% dos exercícios**. No banco, o progresso não é um número salvo — ele é **calculado em tempo real** pela função `calcularPorcentagemModulo`.
>
> E o progresso é **irreversível**: o vídeo marca `true` e nunca volta para `false`; as etapas concluídas entram via `arrayUnion`, que **não duplica** registro. Refazer o exercício não muda nada.
>
> Agora, o bug: na primeira versão, o cache do exercício usava uma **chave global**. Quando outra pessoa logava no mesmo celular... **herdava o progresso da conta anterior**. Resolvemos com duas mudanças:
> - a chave passou a incluir o **uid**: `librica:exercicio:{moduloId}:{uid}:etapasConcluidas`;
> - e criamos a função `limparCachesLegadosExercicios()`, executada no login, cadastro e logout, que apaga dados antigos do aparelho."

🖥️ **Mostrar:** exemplo JSON do progresso + a chave antiga vs. a nova lado a lado (Tabela 6).

🔁 **Transição:** *"Essa correção é um bom exemplo de como trabalhamos. E o trabalho todo se sustenta numa stack bem escolhida."*

---

## Bloco 7 — Stack tecnológico (⏱️ 1,5 min)

🎤 **Falar:**

> "A stack em quatro linhas:
> - **TypeScript 5.9** em modo estrito — erros de estrutura de dados aparecem **no compilador**, não com o app instalado no celular;
> - **Expo SDK 54 + React Native 0.81** — o app roda em Android e iOS sem código nativo complexo;
> - **Expo Router 6** — as rotas são criadas pela **estrutura de pastas**, eliminando arquivos de rota gigantes;
> - **Firebase** — Authentication, Firestore, Hosting e Crashlytics.
>
> Dois detalhes finos: as videoaulas vêm do **YouTube** via `react-native-youtube-iframe`, e os vídeos curtos de sinais do **Firebase Hosting** via `expo-video`, rodando em loop e sem controles na tela."

🖥️ **Mostrar:** Tabela 20 (stack) simplificada em 4 linhas — não leia a tabela inteira, ela já está no slide para consulta.

🔁 **Transição:** *"Ferramentas boas não bastam — precisa de padrão. E foi o que mantém o código vivo."*

---

## Bloco 8 — Padrões de código (⏱️ 1,5 min)

🎤 **Falar:**

> "Quatro padrões que seguimos:
> 1. **TypeScript estrito** (`strict: true`) e quase nenhum `any`: toda estrutura de dados é declarada com `interface` e `type`.
> 2. **Aliases de importação**: escrevemos `@/components/SinalCard` em vez de `../../components/SinalCard`.
> 3. **Erros centralizados**: a função `traduzErroFirebase(code)` traduz os erros técnicos do Firebase — que vêm em inglês — para mensagens claras em português, num lugar só.
> 4. **Estilos isolados por componente**, com só duas coisas globais: a paleta em `constants/Colors.ts` e a fonte **Gabarito**.
>
> E a nomenclatura é híbrida, bem comum no Brasil: **termo técnico em inglês, conceito educacional em português** — por isso o arquivo se chama `VidrariaCard.tsx`."

🖥️ **Mostrar:** trecho real de um arquivo (ex.: `components/VidrariaCard.tsx` ou `src/services/progresso.ts`) — mostra domínio do código.

🔁 **Transição:** *"Código com padrão é código testável. E testar este app tinha uma camada extra: acessibilidade."*

---

## Bloco 9 — Testes e QA (⏱️ 2 min)

🎤 **Falar:**

> "A validação tem três frentes:
> 1. **Verificação de tipos** — `npx tsc --noEmit` varre todo o código;
> 2. **Testes unitários** — com `react-test-renderer`, nas funções puras: `calcularPorcentagemModulo` (a matemática do 50/50, com trava de 100% e sem etapas duplicadas), `composicaoCorreta` e `contarAtomos` (os gabaritos dos exercícios);
> 3. **Testes manuais** — num Android físico via Dev Client, com **contas teste** criadas para não sujar dados reais.
>
> Os resultados que nos deixam tranquilos: **zero erros de compilador, zero crash no Crashlytics, progresso que nunca regride nem passa de 100%**.
>
> E os testes de acessibilidade, feitos com o **TalkBack**: rótulos e papéis semânticos (`accessibilityLabel`, `accessibilityHint`), alertas de erro anunciados, funcionamento com **fontes ampliadas de 120 a 200%** e contraste auditado conforme o padrão **WCAG AA**."

🖥️ **Mostrar:** Tabela 27 resumida (3 casos de A11Y) ou um vídeo de 10s do TalkBack lendo um card.

🔁 **Transição:** *"Com tudo validado, a última etapa: levar o app para o celular do usuário."*

---

## Bloco 10 — Implantação (⏱️ 1,5 min)

🎤 **Falar:**

> "O build é feito **na nuvem** pelo **EAS Build**, com três perfis no `eas.json`:
> - **development** → APK de depuração para o dia a dia;
> - **preview** → APK otimizado para testes internos;
> - **production** → **AAB** otimizado, com submissão automática à loja via `eas submit`.
>
> Os vídeos de sinais em `.mp4` ficam em `public/videos/sinais/` e vão para a nuvem com `firebase deploy --only hosting` — o usuário faz streaming, não download. Se um sinal ainda não tiver vídeo enviado, o app avisa com uma mensagem, **sem quebrar**. As regras de segurança do banco também sobem por deploy: `firebase deploy --only firestore:rules`.
>
> Importante: tudo isso cabe **dentro do plano gratuito do Firebase** — pensado para um projeto acadêmico, pronto para escalar."

🖥️ **Mostrar:** Tabela 29 (perfis de build) ou o terminal rodando um `eas build`.

🔁 **Transição:** *"E como todo projeto honesto, a gente também sabe dizer o que ainda não está pronto."*

---

## Bloco 11 — Limitações e trabalhos futuros (⏱️ 1,5 min)

🎤 **Falar:**

> "Mapeamos 8 limitações; destaco as três que julgamos mais importantes:
> 1. A senha do módulo secreto hoje é validada **no cliente** — o plano é migrar para **Cloud Functions**, blindada contra inspeção de pacotes;
> 2. O mapa de vídeos é **atualizado manualmente no código** — vamos criar um **painel administrativo**, para subir sinal novo sem tocar no código;
> 3. Os **testes no iOS** ainda não aconteceram, porque exigem conta paga de Desenvolvedor Apple.
>
> No backlog também entram **CI/CD com EAS Workflow**, Jest com `@testing-library` e variáveis de ambiente protegidas no EAS."

🖥️ **Mostrar:** Tabela 30 reduzida a 3 linhas.

🔁 **Transição:** *"Terminando com o que realmente importa."*

---

## Bloco 12 — Fechamento (⏱️ 1 min)

🎤 **Falar:**

> "O Librica não é só um trabalho escolar. É uma ferramenta para consolidar um futuro em que a educação é acessível a todos — onde um estudante surdo pode aprender química **em qualquer lugar, no seu próprio ritmo, na sua própria língua**.
>
> Para nós, como grupo, foi ver na prática o desenvolvimento real de um aplicativo: banco de dados, BaaS, React Native, TypeScript — e, principalmente, tecnologia com propósito.
>
> Obrigado! Ficamos à disposição para perguntas."

🖥️ **Mostrar:** slide final com logo + frase *"Aprendendo Química em Libras"* + QR code do repositório.

---

## 🛡️ Perguntas prováveis da banca (e respostas curtas)

| Pergunta provável | Resposta sugerida |
|---|---|
| "Por que NoSQL e não relacional, se vocês desenharam um MER?" | "O MER foi nosso ponto de partida e nos deu clareza sobre as entidades. Mas o Firestore dá flexibilidade de documentos, escala automática sem custo e encaixa com o streaming de vídeos. A consistência fica garantida pelo código + `firestore.rules`." |
| "O que acontece se o usuário perder a internet no meio de um exercício?" | "O progresso fica no cache local, com chave por uid, e sincroniza quando a conexão volta. O app não trava — testamos isso no PROG-06." |
| "Como vocês garantem que dois usuários não tenham o mesmo apelido?" | "Coleção `nicknames` com **transação atômica** no cadastro e normalização para minúsculas (`nicknameLower`), então 'Lucas' e 'lucas' colidem." |
| "A senha do módulo secreto fica segura?" | "Ela fica no documento `config/geral`, fora do código-fonte, e só administradores escrevem lá. Reconhecemos que a validação ainda acontece no cliente — é a nossa limitação nº 1, com plano definido: Cloud Functions." |
| "Por que Expo e não Android nativo?" | "Expo SDK 54 + React Native permitem Android e iOS sem código nativo pesado, builds na nuvem pelo EAS e roteamento pela estrutura de pastas. Compatível com o Dev Client que usamos." |
| "Como o app atende quem é surdo **e** cego?" | "Camada de acessibilidade para leitores de tela: `accessibilityRole`, `accessibilityLabel`, `accessibilityHint`, `accessibilityState`, testada com o TalkBack." |
| "Vocês usaram alguma ferramenta de automação?" | "Ainda não — ESLint, Prettier e `tsc --noEmit` no pipeline estão no backlog. O padrão de código hoje é seguido manualmente." |

---

## 💡 Dicas de apresentação

1. **Nunca leia o slide** — os slides carregam números e diagramas; você carrega a história.
2. **Os dois "momentos de ouro"** são o Bloco 6 (o bug do cache herdado) e o gesto de **segurar-para-ver** no app ao vivo. Ensaie esses dois.
3. **Se der erro na demo**, tenha os prints das 6 telas prontos num slide de reserva — e siga narrando.
4. **Divisão entre os 4 apresentadores:** quem fala de arquitetura (4–5), quem fala de dados (5–6), quem fala de stack/padrões (7–8) e quem fecha com QA/implantação (9–12). Cada um com o roteiro do próprio bloco em mãos.
5. **Frases de transição** estão em todos os blocos — decorar só elas já dá fluidez ao conjunto, mesmo com apresentadores diferentes.
6. Termine sempre com **tempo de sobra** para o bloco de perguntas — a tabela acima mostra que o grupo domina as fraquezas do projeto, e isso conta muito para a banca.
