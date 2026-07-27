# QA — Fase 8.21

**Produto:** Athanor — Alquimia Interior  
**Assinatura:** Tehkné Solutions

## Validação editorial

- Eclesiastes 3:11 registrado;
- política `reject-cross-field-contradictions-before-domain-v1`;
- seis relações de partilha declaradas;
- ausência de comparação com o relógio atual;
- ausência de reparo automático;
- doze restrições editoriais.

## Domínio

- quantidade igual ao tamanho da lista;
- coleção vazia com quantidade zero;
- posições sequenciais iniciadas em 1;
- várias posições sequenciais;
- datas ausentes quando `includeDates` é falso;
- conclusão exige ocorrência;
- conclusão não antecede ocorrência;
- ocorrência não ultrapassa geração;
- conclusão não ultrapassa geração;
- igualdade entre instantes aceita;
- relógio atual não consultado;
- tipos desconhecidos deixados para o parser;
- objeto original não alterado;
- resposta sem relação adicional.

## Integração

- partilha oficial coerente aceita;
- quantidade contraditória recusada após selo válido;
- posição contraditória recusada após selo válido;
- datas com `includeDates: false` recusadas;
- conclusão sem ocorrência recusada;
- instante posterior à geração recusado;
- checksum mantém precedência;
- formato temporal mantém precedência;
- geração incoerente impedida;
- geração coerente preservada;
- resposta exportável permanece válida.

## Pipeline

```bash
npm ci
npm run validate:content
npm test
npm run build
```

## Persistência

Confirmar ausência de:

- store novo;
- chave IndexedDB nova;
- histórico de recusas;
- contador;
- analytics;
- telemetria;
- comunicação de rede.
