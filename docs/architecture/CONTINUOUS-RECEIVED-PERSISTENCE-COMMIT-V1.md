# Contrato de escrita confirmada v1

## Política

`confirm-indexeddb-write-before-runtime-commit-v1`

## Objetivo

Impedir que a interface anuncie uma alteração da biblioteca recebida antes de a IndexedDB confirmar a transação correspondente.

## Fluxo anterior

```text
domínio calcula próximo registro
→ Zustand aplica set
→ interface recebe sucesso
→ persist middleware inicia setItem assíncrono
```

Uma falha na última etapa deixava o runtime diferente da memória persistida.

## Fluxo atual

```text
hidratação concluída
→ nenhuma escrita concorrente
→ domínio calcula próximo snapshot
→ serializar envelope conhecido
→ aguardar transação IndexedDB
→ aplicar snapshot no Zustand
→ anunciar confirmação
```

## Envelope

A escrita explícita mantém o formato já usado pelo middleware:

```json
{
  "state": {
    "schemaVersion": 1,
    "registry": {}
  },
  "version": 0
}
```

A chave permanece `athanor-continuous-received-state`.

## Separação do middleware

O `persist` continua responsável por:

- ler a chave;
- interpretar o envelope JSON;
- executar o merge defensivo da hidratação;
- informar falhas de leitura.

A escrita automática posterior a `set` é um no-op. Todas as mutações da biblioteca usam a escrita explícita antes do commit em runtime.

## Estados transitórios

```text
idle
writing
confirmed
failed
```

Esses estados vivem em uma store sem `persist`.

## Concorrência

Durante `writing`:

- a segunda ação não chama o domínio;
- nenhum ID ou horário é criado;
- nenhuma nova transação é iniciada;
- a ação não entra em fila;
- a ação não é repetida depois.

## Falha

Quando `setItem` ou a transação IndexedDB falha:

- o próximo snapshot não é aplicado ao Zustand;
- a biblioteca anterior mantém a mesma referência;
- a seleção e a prévia permanecem disponíveis;
- um diagnóstico transitório é exibido;
- uma nova tentativa exige nova decisão explícita.

Nenhum rollback por segunda escrita é necessário, porque o runtime ainda não foi alterado.

## Sem mudança

Resultados `equivalent`, `unchanged`, `missing`, `ambiguous`, `stale` ou `invalid` que não modificam a biblioteca não iniciam escrita. Um diagnóstico antigo de falha é limpo quando uma nova decisão termina validamente sem alteração.

## Limites

A conclusão da transação confirma que a API IndexedDB aceitou a escrita. Ela não comprova:

- durabilidade física permanente;
- ausência de falha futura do dispositivo;
- identidade, autoria ou origem;
- autenticidade criptográfica;
- sincronização externa.

## Persistência adicional

Nenhuma nova chave, store IndexedDB, fila, retry, histórico, analytics ou telemetria é criada.

**Tehkné Solutions**
