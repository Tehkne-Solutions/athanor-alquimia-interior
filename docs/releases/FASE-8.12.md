# Release Notes — Fase 8.12

## A Versão que Não Reescreve o Passado

A Fase 8.12 torna explícita a compatibilidade dos formatos compartilhados do Athanor.

### Entregas

- parser SemVer estrito;
- comparação de major, minor e patch;
- matriz de versões atuais e legadas;
- versão atual de partilha fixada em 1.0.0;
- versão atual de resposta fixada em 1.0.0;
- recusa de versões futuras;
- recusa de versões antigas sem migração declarada;
- recusa de versões malformadas;
- integração com a verificação de consistência;
- normalização da cópia sanitizada para a versão atual;
- avisos de compatibilidade nas prévias;
- testes unitários e de integração;
- validação editorial, QA e documentação de produto.

### Garantias

- nenhum downgrade automático;
- nenhuma migração silenciosa;
- nenhum preenchimento aproximado de campos;
- nenhum arquivo externo alterado;
- nenhum log de incompatibilidade;
- nenhum efeito em progresso ou jornadas;
- nenhuma consulta de versão em rede.

### Compatibilidade atual

Somente `1.0.0` é aceita para os schemas de partilha e resposta. As listas de versões legadas permanecem vazias até que exista uma migração explícita, documentada e testada.

**Tehkné Solutions**
