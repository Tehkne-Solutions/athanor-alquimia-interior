# Fase 8.11 — A Conferência que Não Promete Autenticidade

**Assinatura:** Tehkné Solutions

## Objetivo

Adicionar um selo local e determinístico aos arquivos de partilha e resposta para detectar alterações posteriores à geração, sem afirmar identidade, autoria humana, intenção, veracidade narrativa ou segurança criptográfica.

## Núcleo bíblico

- **Provérbios 14:15** inicia a reflexão sobre prudência e atenção aos passos.
- A referência não transforma verificação técnica em julgamento moral ou prova de verdade pessoal.
- Canonicalização, checksum, compatibilidade e rejeição são estruturas autorais do Athanor.

## Catálogo

- ID: `continuous-consistency-catalog`;
- versão: `1.0.0`;
- algoritmo: `fnv1a-32`;
- escopo: `top-level-without-consistency`;
- modo: `deterministic-local-checksum`;
- criptográfico: não;
- autentica identidade: não;
- aceita arquivo legado: sim, com aviso;
- aceita selo inválido: não.

## Selo

Novos arquivos podem incluir:

```json
{
  "consistency": {
    "version": "1.0.0",
    "algorithm": "fnv1a-32",
    "scope": "top-level-without-consistency",
    "checksum": "fnv1a32-00000000",
    "cryptographic": false,
    "authenticatesIdentity": false
  }
}
```

O checksum ilustrativo acima não representa um arquivo real.

## Canonicalização

Antes do cálculo:

- o campo `consistency` do nível superior é removido;
- chaves de objetos são ordenadas alfabeticamente;
- propriedades `undefined` de objetos são omitidas;
- valores `undefined` em listas são representados como `null`;
- a ordem das listas é preservada;
- números não finitos são tratados como `null`;
- strings e booleanos seguem serialização JSON.

Essa canonicalização permite que objetos equivalentes com chaves em ordens diferentes produzam o mesmo checksum.

## Limites técnicos

FNV-1a de 32 bits foi escolhido somente como checksum pequeno e determinístico para consistência local.

O selo não oferece:

- resistência criptográfica a colisões;
- assinatura digital;
- prova de identidade;
- prova de autoria humana;
- prova de data;
- prova de origem do dispositivo;
- prova de intenção;
- prova de que o conteúdo é verdadeiro;
- confidencialidade ou criptografia.

A interface e os avisos devem preservar esses limites.

## Geração

A Fase 8.11 integra o selo em:

- `createContinuousCollectionShareExport`;
- `createContinuousResponseExport`.

O selo é anexado somente depois que o payload final foi criado.

## Recepção

A entrada de partilhas usa uma camada adicional:

```text
verificar selo
→ validar schema e política
→ sanitizar conteúdo
→ anexar novo selo à cópia sanitizada
→ permitir prévia e consentimentos
```

Resultados possíveis:

- **válido:** conteúdo corresponde ao checksum;
- **ausente:** arquivo legado aceito com aviso;
- **inválido:** conteúdo alterado, arquivo recusado;
- **incompatível:** versão, algoritmo, escopo ou declarações não suportadas, arquivo recusado.

## Retorno

A leitura de respostas usa o mesmo princípio:

```text
verificar selo
→ validar resposta curada
→ sanitizar prévia transitória
→ anexar selo local à cópia em memória
→ concluir ou descartar sem persistência
```

O selo recalculado existe somente na prévia transitória e não cria histórico.

## Compatibilidade

Arquivos gerados antes da Fase 8.11 não possuem selo. Eles continuam válidos quando passam pelas validações anteriores de schema, política, autoria declarada e conteúdo curado.

A ausência gera aviso explícito:

- partilha legada é selada novamente na cópia local sanitizada;
- resposta legada é aceita somente na prévia transitória.

Compatibilidade não transforma arquivo antigo em autenticado.

## Alterações detectadas

Qualquer mudança em campos cobertos pelo payload altera o checksum, incluindo:

- rótulo;
- quantidade;
- estado;
- itens;
- ordem dos itens;
- datas incluídas;
- gesto;
- declaração curada;
- avisos;
- proveniência declarada.

Quando o checksum não corresponde, o Athanor recusa o arquivo e não tenta repará-lo.

## Sanitização e novo selo

Depois que um pacote válido ou legado passa pelo parser existente:

- campos desconhecidos são removidos;
- strings previstas são normalizadas conforme o domínio;
- apenas estruturas oficiais permanecem;
- um novo selo é calculado sobre a cópia sanitizada.

Esse novo selo descreve apenas consistência da cópia local, não reconfirma a origem.

## Persistência

A Fase 8.11 não cria store, chave IndexedDB, log ou histórico próprios.

- partilhas recebidas continuam usando a biblioteca separada da Fase 8.8;
- respostas continuam transitórias na Fase 8.10;
- resultados de verificação não são enviados;
- recusas não são registradas.

## Interface

Não existe rota exclusiva para a Fase 8.11. A conferência aparece nos fluxos existentes:

- preparação de partilha;
- recepção de partilha;
- preparação de resposta;
- leitura de retorno.

Os avisos informam sempre que consistência não equivale a identidade ou autoria.

## Segurança e autonomia

- nenhuma chave secreta;
- nenhum certificado;
- nenhuma conta;
- nenhum contato;
- nenhuma rede;
- nenhum upload;
- nenhum reparo automático;
- nenhum bloqueio de arquivos legados válidos;
- nenhum histórico de verificação;
- nenhum efeito em progresso, mérito ou recomendação.

## Critérios de validação

- Provérbios 14:15 registrado como referência editorial;
- canonicalização determinística;
- chaves de objetos independentes de ordem;
- listas sensíveis à ordem;
- campo `consistency` excluído do cálculo;
- checksum FNV-1a 32 estável;
- declarações `cryptographic: false` e `authenticatesIdentity: false` obrigatórias;
- novas partilhas seladas;
- novas respostas seladas;
- selo válido aceito;
- alteração posterior recusada;
- algoritmo incompatível recusado;
- arquivo legado aceito com aviso;
- cópia sanitizada novamente selada;
- nenhuma persistência própria;
- assinatura exclusiva da Tehkné Solutions.
