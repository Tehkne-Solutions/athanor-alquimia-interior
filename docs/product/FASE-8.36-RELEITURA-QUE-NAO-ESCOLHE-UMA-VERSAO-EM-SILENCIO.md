# Fase 8.36 — A Releitura que Não Escolhe uma Versão em Silêncio

## Contexto

Quando duas abas partem da mesma biblioteca, a Fase 8.35 impede que uma escrita obsoleta apague a outra. Depois desse conflito, porém, a sessão bloqueada precisa conhecer a versão atual antes de tomar outra decisão.

Antes desta fase, a única orientação era recarregar toda a página.

## Decisão de produto

O Athanor oferece **Examinar memória atual** somente depois de um conflito de persistência.

A releitura:

- parte de uma escolha explícita;
- usa a mesma chave local;
- não escreve nada;
- valida o envelope e a biblioteca novamente;
- adota somente memória aceita ou ausência confirmada;
- mantém o bloqueio quando a memória é recusada ou indisponível;
- não repete a ação que perdeu a corrida.

## Estados

### Memória aceita

A versão mais recente substitui o snapshot obsoleto em runtime. A pessoa pode então decidir uma nova ação com base na biblioteca atual.

### Memória ausente

A remoção externa da chave é tratada como uma biblioteca vazia confirmada. O snapshot antigo não é restaurado.

### Memória recusada

Os bytes permanecem intactos. O snapshot antigo continua somente para leitura da sessão e as mutações permanecem bloqueadas.

### Memória indisponível

A leitura falhou. Nenhum estado é escolhido e nenhuma escrita é tentada.

## Experiência

O card de conflito deixa de orientar apenas um reload completo e passa a oferecer:

```text
Examinar memória atual
```

Durante a releitura:

```text
Relendo a memória atual
```

A prévia de um arquivo selecionado continua transitória. Ela não é guardada nem descartada pela releitura e seus consentimentos não são reaplicados.

## O que não é criado

- sincronização em tempo real;
- merge automático;
- restauração da ação interrompida;
- fila de decisões;
- escolha de vencedor;
- escrita durante a releitura;
- histórico de conflitos;
- telemetria ou analytics.

## Assinatura

**Tehkné Solutions**
