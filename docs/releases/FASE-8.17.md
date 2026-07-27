# Release Notes — Fase 8.17

## O Número que Não Muda em Silêncio

A Fase 8.17 adiciona inspeção de lexemas numéricos antes do `JSON.parse`.

### Entregas

- normalização decimal determinística;
- validação da faixa inteira segura;
- detecção de arredondamento silencioso;
- recusa de overflow e underflow;
- recusa de `-0`;
- aceitação de notações decimalmente equivalentes;
- proteção das entradas de partilha e resposta;
- verificação das exportações reais;
- validação editorial e documentação de arquitetura e QA.

### Limites

A fase não implementa aritmética decimal arbitrária e não modifica o arquivo recebido. Sua garantia se limita à preservação da medida decimal durante a conversão inicial para `Number`.

### Compatibilidade

Pacotes atuais continuam válidos porque seus campos numéricos são contagens, posições e profundidades dentro da faixa segura.

**Tehkné Solutions**
