# Athanor — Alquimia Interior

RPG contemplativo local-first criado pela **Tehkné Solutions**.

Este repositório contém o vertical slice funcional **A Palavra Antes da Resposta**, preparado para homologação como aplicação web instalável.

## Funcionalidades implementadas

- onboarding e limites do produto;
- criação de personagem com origem e classe;
- fundação do Templo Astral em três temas;
- configuração bíblica e camadas simbólicas opcionais;
- Átrio da Presença e mapa do Templo;
- Biblioteca dos Provérbios;
- missão de classificação entre fato, interpretação, previsão e intenção;
- cadeia simbólica com proveniência e fallbacks autorais;
- crafting da Lâmpada da Palavra Clara;
- inventário, posicionamento e restauração da Biblioteca;
- ciclo completo de retorno e revisão;
- integração, ajuste ou repouso sem perda de progresso;
- armazenamento local em IndexedDB;
- alto contraste e redução de movimento;
- PWA com application shell offline;
- configuração de deploy SPA para Vercel;
- Design System responsivo;
- fluxo de segurança sem simbolismo;
- painel de QA em `/dev` durante desenvolvimento.

## Ciclo validável

```text
Fonte bíblica
→ missão
→ classificação
→ cadeia simbólica
→ crafting
→ ação
→ retorno
→ revisão
→ transformação do Templo
```

A progressão para **Primeiro Fogo** ocorre somente após o retorno e a integração da revisão.

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

A versão atual funciona sem conta e persiste o progresso no próprio dispositivo. Não há IA, sincronização ou analytics ativos. Registros de revisão permanecem locais e opcionais.

## Assinatura

**Tehkné Solutions**
