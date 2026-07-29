# Fase 8.37 — O Texto Persistido que Não Perde um Valor Antes da Hidratação em Silêncio

## Intenção

A biblioteca recebida já revalidava objetos hidratados, mas um parser JSON comum pode descartar valores anteriores de chaves repetidas e converter números antes de o domínio examinar o resultado.

A Fase 8.37 protege o texto bruto da própria IndexedDB antes dessa interpretação.

## Regra principal

```text
texto persistido
→ inspeção bruta
→ somente depois JSON.parse
```

## Recusas

A memória é recusada quando contém:

- chave repetida no mesmo objeto;
- chave escapada equivalente a outra;
- número fora da faixa inteira segura;
- arredondamento decimal silencioso;
- overflow, underflow ou zero negativo;
- JSON malformado;
- texto acima dos limites locais;
- forma não inerte, estrutura excessiva ou Unicode invisível.

## Resultado

Na hidratação inicial:

- a biblioteca nova da sessão permanece ativa;
- os bytes anteriores permanecem na IndexedDB;
- a interface mostra diagnóstico transitório;
- nenhuma escrita ou migração é iniciada.

Na releitura explícita:

- o snapshot anterior permanece ativo;
- o conflito permanece;
- a memória recusada não é adotada;
- a ação interrompida não é repetida.

## Limites

A inspeção não decide qual valor repetido era o correto e não converte o texto para uma forma canônica. Ela também não comprova autoria, identidade, origem ou autenticidade.

**Tehkné Solutions**
