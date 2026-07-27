# Release Notes — Fase 8.16

## A Chave que Não se Repete em Silêncio

A Fase 8.16 adiciona uma inspeção do texto JSON antes do `JSON.parse` para impedir que membros repetidos sejam sobrescritos silenciosamente.

### Entregas

- scanner lexical da gramática JSON;
- conjunto independente de chaves para cada objeto;
- comparação dos nomes depois da decodificação dos escapes;
- detecção de chaves literais e escapadas equivalentes;
- diagnósticos seguros sem controles invisíveis diretos;
- fusíveis de profundidade e tokens;
- integração em toda leitura local de partilhas e respostas;
- preservação do erro genérico para sintaxe malformada;
- testes de precedência sobre checksum, versão e conteúdo curado;
- testes dos arquivos gerados pelo Athanor;
- documentação de produto, arquitetura, QA e rastreabilidade.

### Ordem atualizada

```text
text.length
→ unique decoded keys
→ JSON.parse
→ inert JSON
→ structural budget
→ visible Unicode text
→ checksum
→ version
→ schema
```

### Limites

A inspeção não normaliza Unicode, não escolhe um valor vencedor, não repara o arquivo e não comprova autenticidade ou veracidade.

**Tehkné Solutions**
