# Fase 8.12 — A Versão que Não Reescreve o Passado

**Assinatura:** Tehkné Solutions

## Objetivo

Impedir que arquivos compartilhados sejam reinterpretados silenciosamente quando declaram uma versão futura, antiga desconhecida ou malformada. Toda compatibilidade precisa existir em uma matriz explícita, versionada e testada.

## Núcleo bíblico

- **Eclesiastes 3:1** inicia a reflexão sobre tempos distintos.
- A referência não transforma versionamento em destino, julgamento ou obrigação de atualização.
- SemVer estrito, matriz de compatibilidade e regras de recusa são estruturas autorais do Athanor.

## Catálogo

- ID: `continuous-version-catalog`;
- versão: `1.0.0`;
- política: `explicit-compatibility-no-silent-migration-v1`;
- modo: `strict-semver-explicit-matrix`;
- versão atual de partilha: `1.0.0`;
- versões legadas de partilha aceitas: nenhuma nesta release;
- versão atual de resposta: `1.0.0`;
- versões legadas de resposta aceitas: nenhuma nesta release;
- versões futuras aceitas: não;
- versões antigas desconhecidas aceitas: não;
- migração silenciosa: não.

## Problema corrigido

Antes desta fase, os parsers de domínio verificavam se `catalogVersion` era uma string não vazia. Isso permitia que um arquivo estruturalmente parecido declarasse, por exemplo, `2.0.0` ou `99.0.0` e ainda chegasse à sanitização.

A Fase 8.12 adiciona uma barreira anterior à sanitização:

```text
verificar selo quando presente
→ avaliar versão por matriz explícita
→ validar schema, política e conteúdo
→ sanitizar
→ permitir prévia ou persistência prevista
```

## SemVer estrito

A versão precisa usar exatamente:

```text
X.Y.Z
```

Cada parte:

- é um inteiro não negativo;
- não possui prefixo `v`;
- não possui zeros à esquerda, exceto o próprio zero;
- não possui sufixo, prerelease ou metadata;
- precisa estar dentro do intervalo seguro de inteiros JavaScript.

Exemplos aceitos:

- `0.0.0`;
- `1.0.0`;
- `12.34.56`.

Exemplos recusados:

- `1.0`;
- `v1.0.0`;
- `01.0.0`;
- `1.0.0-beta`;
- `latest`.

## Estados de compatibilidade

### Atual

A versão recebida coincide exatamente com a versão atual da matriz.

Resultado:

- arquivo pode continuar para o parser;
- a prévia mostra aviso de versão atual;
- nenhum campo é migrado.

### Legada explicitamente suportada

A versão aparece em `supportedLegacyVersions`.

Resultado:

- arquivo pode continuar para o parser;
- o arquivo original não é alterado;
- a cópia sanitizada pode usar a versão atual;
- a mudança é informada em aviso explícito;
- uma futura entrada nessa lista exige testes de migração próprios.

Nesta release não existem versões legadas listadas.

### Futura

A versão é maior que a atual em major, minor ou patch.

Resultado:

- arquivo recusado;
- nenhum downgrade é tentado;
- nenhuma prévia é criada;
- nenhum dado é persistido;
- o Athanor informa a versão recebida e a versão atual reconhecida.

### Antiga desconhecida

A versão é menor que a atual, mas não aparece na lista explícita de legados.

Resultado:

- arquivo recusado;
- nenhum preenchimento aproximado é realizado;
- nenhuma migração silenciosa é presumida.

### Malformada

A versão não usa SemVer estrito.

Resultado:

- arquivo recusado antes do parser de conteúdo.

## Relação com o selo de consistência

Versão e consistência respondem a perguntas diferentes:

- **consistência:** o conteúdo mudou depois da geração do checksum?
- **compatibilidade:** esta versão é conhecida e suportada por este Athanor?

Um arquivo pode:

- ter selo válido e versão futura — deve ser recusado;
- não ter selo e usar versão atual — pode ser aceito como arquivo legado da Fase 8.11;
- ter versão alterada depois do selo — deve ser recusado primeiro por inconsistência;
- ter versão atual e schema inválido — deve ser recusado pelo parser de domínio.

O selo nunca substitui a matriz de versão.

## Partilhas

A recepção de partilhas usa:

- versão atual definida pelo catálogo da Fase 8.7;
- lista explícita de versões legadas da Fase 8.12;
- rótulo de diagnóstico `Pacote de partilha`.

Quando aceita, a cópia sanitizada recebe:

- versão atual oficial;
- novo selo local;
- nova impressão descritiva baseada na cópia sanitizada.

O arquivo externo permanece intacto.

## Respostas

A leitura de retornos usa:

- versão atual definida pelo catálogo da Fase 8.9;
- lista explícita de versões legadas da Fase 8.12;
- rótulo de diagnóstico `Pacote de resposta`.

Quando aceita, a prévia sanitizada em memória recebe a versão atual e novo selo. Nada é persistido pela Fase 8.10.

## Migrações futuras

Adicionar uma versão à lista de legados não deve ser apenas alteração de configuração. Exige:

1. documentar diferenças do formato;
2. criar função de migração explícita;
3. testar todos os campos alterados;
4. preservar o arquivo original;
5. exibir aviso de transformação;
6. versionar a política;
7. passar por validação editorial, testes e build.

Sem esses passos, a versão permanece recusada.

## Segurança e autonomia

- nenhuma atualização automática de arquivo externo;
- nenhum downgrade;
- nenhuma migração aproximada;
- nenhuma invenção de campo ausente;
- nenhum upload;
- nenhuma consulta de versão em rede;
- nenhum histórico de recusas;
- nenhuma falha pessoal associada à incompatibilidade;
- nenhuma alteração de progresso;
- nenhuma promessa de autenticidade.

## Persistência

A Fase 8.12 não cria:

- store Zustand;
- chave IndexedDB;
- histórico de versões recebidas;
- log de incompatibilidade;
- contador de arquivos recusados;
- cache de migração.

## Interface

Não existe rota própria. Mensagens de compatibilidade aparecem nos fluxos de:

- recepção de partilha;
- leitura de retorno.

Versões aceitas geram aviso na prévia. Versões recusadas impedem a prévia e exibem o motivo técnico em linguagem direta.

## Critérios de validação

- Eclesiastes 3:1 registrado como referência editorial;
- SemVer estrito;
- comparação correta de major, minor e patch;
- versão atual aceita;
- legado aceito somente por lista explícita;
- versão futura recusada sem downgrade;
- versão antiga desconhecida recusada sem migração;
- versão malformada recusada;
- versão alterada depois do selo recusada por inconsistência;
- partilha atual selada aceita;
- partilha atual sem selo aceita por compatibilidade anterior;
- resposta atual selada aceita;
- cópia sanitizada usa versão atual;
- nenhuma persistência própria;
- assinatura exclusiva da Tehkné Solutions.
