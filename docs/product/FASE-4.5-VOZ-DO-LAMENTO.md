# Fase 4.5 — A Voz do Lamento

**Produto:** Athanor — Alquimia Interior  
**Capítulo:** Água  
**Missão:** A Voz do Lamento  
**Componente:** Fragmento do Lamento  
**Assinatura:** Tehkné Solutions

## Objetivo

Adicionar uma segunda missão funcional à Câmara dos Salmos, permitindo expressão opcional sem transformar sofrimento em pontuação, diagnóstico, identidade ou recompensa proporcional à intensidade.

## Fluxo

```text
GOTA NOMEADA
→ ALERTA DE CONTEÚDO
→ ESCREVER, SILENCIAR, PAUSAR OU PEDIR APOIO
→ VERIFICAÇÃO LOCAL LIMITADA
→ FRAGMENTO DO LAMENTO OU INTERRUPÇÃO DE SEGURANÇA
```

## Estrutura do registro

Os quatro campos são opcionais:

1. o que aconteceu;
2. o que está sentindo;
3. o que deseja;
4. de que apoio precisa.

A pessoa pode concluir a missão sem escrever. Nesse caso, o Fragmento representa apenas a prática concluída em silêncio.

## Segurança

A tela oferece um botão explícito de apoio direto antes do formulário.

Ao concluir um registro escrito, uma verificação determinística e local procura apenas frases críticas explícitas relacionadas a:

- suicídio;
- autolesão;
- violência imediata;
- interrupção de medicação;
- emergência médica;
- comandos ou perseguição percebida.

A verificação é limitada, pode falhar e não é apresentada como diagnóstico. Quando acionada:

- o texto é removido do estado da missão;
- nenhum componente é criado;
- nenhuma recompensa é concedida;
- o fluxo simbólico é interrompido;
- a interface segue para a tela direta de apoio.

## Privacidade

- armazenamento local em IndexedDB;
- store separada do progresso principal;
- vínculo com a jornada atual por `startedAt`;
- nenhuma leitura pelo relatório de homologação;
- nenhum texto exibido no Fragmento;
- nenhum conteúdo enviado para analytics;
- reset de QA remove o estado da missão.

## Conteúdo editorial

A missão utiliza o **Salmo 13** como referência de forma literária de lamento.

A interface separa:

- fonte bíblica;
- contexto;
- princípio editorial;
- aplicação;
- componente de gameplay.

Nenhum versículo integral protegido foi incorporado.

## Entregas

- domínio `waterLament`;
- store local persistida;
- página da missão;
- alerta de conteúdo;
- formulário acessível;
- conclusão silenciosa;
- detector local limitado;
- fluxo direto de segurança ampliado;
- integração com a Câmara dos Salmos;
- validação editorial dos Salmos;
- estilos responsivos;
- testes Vitest;
- documentação.

## Fora do escopo

- interpretação de lamento;
- resumo por IA;
- análise clínica;
- gravação de áudio;
- sincronização do texto;
- crafting completo do Cálice;
- missão de memória;
- missão de confiança.

## Próxima fase

**Fase 4.6 — O Espelho das Memórias**

Deverá implementar a distinção entre:

- memória;
- sensação atual;
- previsão;
- necessidade;
- ação;

além de criar o **Espelho das Águas**, sem verificar a veracidade ou interpretar a origem das memórias.
