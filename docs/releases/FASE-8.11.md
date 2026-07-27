# Release Notes — Fase 8.11

## A Conferência que Não Promete Autenticidade

A Fase 8.11 adiciona um selo local de consistência aos arquivos gerados pelo ciclo compartilhado do Athanor.

### Entregas

- canonicalização determinística do payload;
- checksum FNV-1a de 32 bits;
- selo anexado a novas partilhas;
- selo anexado a novas respostas;
- verificação antes da recepção de partilhas;
- verificação antes da leitura de retornos;
- rejeição de conteúdo alterado depois do selo;
- compatibilidade com arquivos legados sem selo;
- novo selo aplicado à cópia sanitizada;
- testes de domínio e integração;
- validação editorial e documentação de QA.

### Limites explícitos

O selo:

- não é criptográfico;
- não é assinatura digital;
- não autentica identidade;
- não comprova autoria humana;
- não comprova data, intenção ou veracidade;
- não cria certificado, conta ou contato;
- não usa rede;
- não persiste histórico de verificação.

### Compatibilidade

Arquivos das Fases 8.7 e 8.9 gerados antes desta atualização continuam aceitos quando passam pelos parsers anteriores. A ausência do selo é exibida como compatibilidade legada, nunca como autenticação.

**Tehkné Solutions**
