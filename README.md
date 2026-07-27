# Athanor — Alquimia Interior

RPG contemplativo local-first criado pela **Tehkné Solutions**.

Este repositório contém a experiência funcional do Athanor, iniciada pelo vertical slice **A Palavra Antes da Resposta** e expandida pelos ciclos da Água, Fogo, Terra, Espírito e pela Nova Obra contínua.

## Funcionalidades implementadas

### Fundação

- onboarding e limites do produto;
- criação de personagem com origem e classe;
- fundação do Templo Astral em três temas;
- configuração bíblica e camadas simbólicas opcionais;
- Átrio da Presença e mapa do Templo;
- Biblioteca dos Provérbios;
- armazenamento local em IndexedDB;
- alto contraste e redução de movimento;
- PWA com application shell offline;
- configuração de deploy SPA para Vercel;
- Design System responsivo;
- fluxo de segurança sem simbolismo;
- painel de QA em `/dev` durante desenvolvimento.

### Jornadas elementais

- Palavra: fato, interpretação, previsão e intenção;
- Água: nomeação, lamento, memória, confiança, crafting e revisão;
- Fogo: chama, intervalo, limite, coragem, transformação, crafting e revisão;
- Terra: corpo, trabalho possível, recursos, ritmo, ordem, crafting e revisão;
- Espírito: síntese, centro provisório, conselho, decisão revisável, retorno, crafting e revisão;
- cadeias simbólicas com proveniência e fallbacks autorais;
- integração, ajuste, repouso ou arquivo sem perda de progresso.

### Nova Obra contínua

- **8.0 — O Ciclo que Retorna ao Templo:** instâncias contínuas separadas e reversíveis;
- **8.1 — A Jornada que se Desdobra:** conteúdo curado determinístico por semente;
- **8.2 — A Variação que Preserva o Núcleo:** variantes versionadas sem penalidade;
- **8.3 — O Tema que Orienta sem Determinar:** temas curados ou ausência explícita;
- **8.4 — O Ciclo Temático que se Expande:** pacotes curados e profundidade explícita;
- **8.5 — O Mapa dos Ciclos que Não Hierarquiza:** mapa descritivo, filtros e exportação local;
- **8.6 — A Coleção que Cresce sem Acumular Valor:** coleções locais sem ranking ou valor por quantidade;
- **8.7 — A Partilha que Exige Consentimento:** prévia minimizada e arquivo local somente após cinco consentimentos explícitos;
- **8.8 — A Recepção que Não se Apropria:** validação, sanitização e biblioteca recebida separada, sem mescla com progresso próprio.

## Ciclo validável

```text
Fonte bíblica
→ missão
→ classificação ou prática
→ cadeia simbólica
→ crafting
→ ação
→ retorno
→ revisão
→ transformação do Templo
→ Nova Obra contínua
```

A progressão não mede valor pessoal, espiritual ou emocional. Recusar, pausar, encerrar cedo, manter vazio e preservar desconhecido são estados válidos quando previstos pelo fluxo.

## Stack

- React 19
- TypeScript
- Vite
- React Router
- Zustand
- Zod
- IndexedDB
- Vitest
- PWA sem dependência de runtime externo

## Executar

```bash
npm install
npm run dev
```

## Validar

```bash
npm run validate:content
npm run test
npm run build
```

## Deploy

O projeto inclui `vercel.json` com fallback para rotas SPA e cabeçalhos específicos para o service worker e o manifesto.

## Privacidade

A versão atual funciona sem conta e persiste o progresso no próprio dispositivo. Não há IA, sincronização ou analytics ativos.

Registros de revisão permanecem locais e opcionais. Exportações de mapas, coleções ou partilhas são iniciadas manualmente. A partilha de coleções gera somente um arquivo local minimizado; o Athanor não envia, publica ou registra o destinatário.

Pacotes recebidos são validados e guardados, quando explicitamente escolhidos, em uma biblioteca local separada. Eles não criam jornadas, não alteram coleções próprias, não confirmam leitura e não registram a identidade de origem.

## Assinatura

**Tehkné Solutions**
