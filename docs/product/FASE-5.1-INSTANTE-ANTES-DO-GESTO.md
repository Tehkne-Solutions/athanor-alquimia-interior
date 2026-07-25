# Fase 5.1 — O Instante Antes do Gesto

**Produto:** Athanor — Alquimia Interior  
**Capítulo:** Fogo  
**Missão:** O Instante Antes do Gesto  
**Componente:** Brasa do Intervalo  
**Assinatura:** Tehkné Solutions

## Objetivo

Adicionar a segunda missão funcional do Fogo, ensinando de forma didática que uma sequência pode ser observada entre um acontecimento, sinais corporais, impulso e gesto.

A missão não solicita relatos pessoais, não avalia autocontrole e não substitui apoio em situações de risco.

## Fluxo

```text
CHAMA NOMEADA
→ LINHA TEMPORAL FICTÍCIA
→ CONTEXTO DE URGÊNCIA
→ INTERVALO OPCIONAL
→ SAÍDA SEGURA
→ BRASA DO INTERVALO
```

## Linha temporal

O mini-game utiliza oito frases fictícias classificáveis como:

- gatilho;
- sinal corporal;
- impulso;
- gesto.

A pessoa pode recusar integralmente a classificação sem perder progresso.

## Tipos de urgência

O segundo exercício diferencia:

- segurança imediata;
- prazo verificável;
- pressão percebida;
- informação insuficiente.

“Pressão percebida” não significa que uma experiência seja falsa ou irrelevante. A categoria apenas indica que o cenário fictício não fornece evidência suficiente de prazo ou risco objetivo.

## Intervalos disponíveis

- criar um minuto de intervalo;
- pedir tempo para responder;
- afastar-se com segurança;
- escrever sem enviar;
- nenhum intervalo agora.

## Saídas disponíveis

- sair do ambiente com segurança;
- contatar uma pessoa de confiança;
- procurar apoio de emergência;
- adiar a resposta;
- nenhuma ação agora.

Nenhuma ação é executada pelo aplicativo.

## Núcleo editorial

A missão começa em **Provérbios 19:11**, com um princípio editorial sobre discernimento, paciência e proporcionalidade.

A referência não é utilizada para exigir tolerância a violência, permanência em perigo ou ausência de limites.

## Camadas opcionais

- **Gevurah:** comparação temática de limite e responsabilidade;
- **Gen:** comparação temática de pausa e quietude;
- **A Temperança:** comparação arquetípica de proporção e ajuste;
- **Brasa do Intervalo:** síntese autoral do Athanor.

Fallbacks:

- Câmara do Instante;
- Movimento da Pausa;
- Guardiã da Medida.

## Estado persistido

A missão é armazenada separadamente em IndexedDB e vinculada ao identificador temporal da Chama Nomeada.

Um novo ciclo do Fogo não reutiliza uma Brasa criada em outra jornada.

## Segurança

- nenhuma situação pessoal é solicitada;
- nenhum campo de texto livre é utilizado;
- classificações podem ser recusadas;
- risco imediato direciona ao fluxo neutro de apoio;
- o aplicativo não orienta contenção física ou confronto;
- a Brasa não comprova calma, coragem, segurança ou melhora clínica;
- nenhuma saída se transforma em obrigação;
- o componente não conclui automaticamente o capítulo do Fogo.

## Testes

O domínio inclui cenários para:

1. criação de progresso limpo;
2. edição das classificações;
3. bloqueio sem escolhas essenciais;
4. recusa dos classificadores;
5. criação da Brasa após escolhas válidas;
6. aceitação de nenhuma ação agora.

## Próximo incremento

A próxima fase deverá implementar **O Limite que Protege**, com:

- arquitetura do limite em primeira pessoa;
- distinção entre limite, controle e punição;
- opções de comunicação segura;
- Placa do Limite;
- terceiro componente do Escudo do Limite Justo.
