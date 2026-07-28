# Fase 8.35 — A Escrita que Não Apaga Outra Aba em Silêncio

## Princípio

Uma transação local concluída não autoriza uma sessão a substituir uma memória que mudou depois da hidratação.

## Referência editorial

**Provérbios 27:12** inicia a reflexão sobre perceber um risco antes de avançar. A prevenção de sobrescrita concorrente é uma estrutura autoral da Tehkné Solutions.

## Situação protegida

Duas abas podem abrir a mesma biblioteca:

```text
aba A vê X
aba B vê X
```

Depois, cada uma toma uma decisão diferente:

```text
aba A produz Y
aba B produz Z
```

Sem conferência atômica:

```text
Y é gravado
Z é gravado depois
→ Y desaparece
```

## Novo comportamento

Cada sessão mantém somente em memória o texto bruto que recebeu durante a hidratação.

Ao tentar alterar a biblioteca:

```text
valor atual ainda é o valor hidratado
→ gravação permitida

valor atual mudou
→ conflito
→ nenhuma gravação
```

## Conflito explícito

A interface apresenta:

```text
Memória alterada em outra aba
```

E informa que:

- a decisão desta sessão não foi aplicada;
- a versão externa não foi sobrescrita;
- nenhuma versão foi escolhida como vencedora;
- nenhum merge foi tentado;
- a página precisa ser recarregada para uma nova hidratação.

## Ações bloqueadas

Depois do conflito, permanecem bloqueados:

- guardar cópia;
- arquivar;
- reativar;
- remover;
- reiniciar biblioteca.

Ler um arquivo ou descartar uma prévia continua sendo uma ação transitória e não altera a memória persistida.

## Sem repetição

A ação recusada não é:

- guardada em fila;
- reaplicada depois do reload;
- convertida em intenção pendente;
- fundida com a versão externa;
- repetida automaticamente.

O usuário decide novamente depois de examinar o estado mais recente.

## Estado vazio e memória recusada

A referência esperada também cobre:

- ausência física da chave, representada por `null`;
- envelope recusado pela hidratação;
- memória legada válida;
- memória com campos desconhecidos.

Assim, uma ação explícita pode substituir uma memória recusada somente se os bytes continuarem exatamente iguais aos examinados naquela sessão.

## Persistência preservada

Não houve mudança em:

```text
chave: athanor-continuous-received-state
schemaVersion: 1
persist version: 0
object store: app-state
```

A referência de comparação não aparece no envelope.

## Limites honestos

A fase não oferece sincronização entre abas. Uma aba não recebe automaticamente o conteúdo gravado pela outra.

Compare-and-set garante somente que uma escrita obsoleta não substitua uma alteração detectável. Não comprova identidade da outra aba, autoria, intenção, correção semântica ou durabilidade física permanente.

## Assinatura

**Tehkné Solutions**
