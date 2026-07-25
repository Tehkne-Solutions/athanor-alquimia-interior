# Fase 4.8 — Cálice da Memória Serena

**Produto:** Athanor — Alquimia Interior  
**Capítulo:** Água  
**Entrega:** Crafting, revisão, integração e posicionamento do item central  
**Assinatura:** Tehkné Solutions

## Objetivo

Concluir o primeiro ciclo funcional da Câmara dos Salmos reunindo:

- Gota Nomeada;
- Fragmento do Lamento;
- Espelho das Águas;
- Ponte da Confiança;
- intenção;
- ação de cuidado;
- limite;
- revisão.

## Regra central

Criar o Cálice não conclui a jornada. O item passa pelos estados:

```text
RECEITA
→ ATIVO
→ AGUARDANDO REVISÃO
→ AJUSTADO, INTEGRADO OU EM REPOUSO
→ POSICIONADO
```

Somente o Cálice integrado pode ser posicionado na Câmara dos Salmos.

## Autonomia

A receita aceita **Nenhuma ação agora** como escolha válida. O usuário ainda define:

- uma intenção;
- um limite;
- uma forma de retorno à revisão.

A escolha de repousar:

- não apaga componentes;
- não reduz progresso;
- não cria prazo obrigatório;
- permite retomada futura.

## Crafting

A fórmula possui quatro decisões:

1. intenção;
2. ação de cuidado;
3. limite;
4. janela de revisão.

A receita não utiliza intensidade emocional, quantidade de texto ou coincidências em mini-games como requisitos ou multiplicadores.

## Revisão

Após a criação, o item pode ser enviado para revisão. Os resultados são:

- **integrar:** conclui o ciclo e libera posicionamento;
- **ajustar:** reabre intenção, ação, limite e revisão;
- **repousar:** preserva a receita sem progressão forçada.

O registro textual da revisão é opcional.

## Posicionamento

Depois da integração, o usuário pode posicionar o item na Câmara. O estado visual passa a reconhecer:

- capítulo concluído;
- Cálice integrado;
- item presente na sala.

O posicionamento não representa proteção, cura, serenidade automática ou efeito externo.

## Persistência

O estado é mantido em IndexedDB separado pelo identificador temporal da jornada da Água.

São persistidos:

- IDs das escolhas;
- estado do ciclo;
- registro opcional de revisão;
- timestamps;
- estado de posicionamento.

## Segurança

O Cálice:

- não apaga emoções ou memórias;
- não garante serenidade;
- não prevê desfechos;
- não confirma interpretações espirituais ou psicológicas;
- não substitui apoio humano ou profissional;
- não executa ações externas.

## Arquivos principais

- `src/domain/waterChalice.ts`;
- `src/domain/waterChalice.test.ts`;
- `src/content/waterChalice.ts`;
- `src/state/useWaterChaliceStore.ts`;
- `src/pages/WaterChalicePage.tsx`;
- `src/styles/water-chalice.css`.

## Critérios de aceite

- quatro componentes são exigidos;
- ação “Nenhuma ação agora” é válida;
- crafting exige intenção, ação, limite e revisão;
- criação não integra automaticamente;
- revisão pode integrar, ajustar ou repousar;
- somente item integrado pode ser posicionado;
- inventário exibe o Cálice;
- reset remove o estado da jornada;
- conteúdo e testes passam no CI.

**Tehkné Solutions**
