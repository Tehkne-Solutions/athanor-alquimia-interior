# Release Notes — Fase 8.20

## O Tempo que Não se Converte em Silêncio

A Fase 8.20 exige representação temporal UTC canônica em todos os campos de data compartilhados.

### Entregas

- formato `YYYY-MM-DDTHH:mm:ss.sssZ`;
- round-trip idêntico com `Date.toISOString`;
- recusa de offsets e fuso implícito;
- recusa de datas impossíveis e segundos intercalares;
- validação da ordem entre ocorrência e conclusão;
- proteção de geração, recepção e retorno;
- integração editorial, testes, QA e documentação.

### Limites

A fase não corrige o arquivo, não converte fuso, não comprova que o relógio de origem estava correto e não cria histórico de recusas.

**Tehkné Solutions**
