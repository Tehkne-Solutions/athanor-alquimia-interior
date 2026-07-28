# Athanor — Alquimia Interior

RPG contemplativo local-first criado pela **Tehkné Solutions**.

Este repositório contém a experiência funcional do Athanor, iniciada pelo vertical slice **A Palavra Antes da Resposta** e expandida pelos ciclos da Água, Fogo, Terra, Espírito e pela Nova Obra contínua.

## Funcionalidades implementadas

### Fundação

- onboarding e limites do produto;
- criação de personagem com origem e classe;
- fundação do Templo Astral em três temas;
- configuração bíblica e camadas simbólicas opcionais;
- Átrio da Presença e mapa do Templo;
- Biblioteca dos Provérbios;
- armazenamento local em IndexedDB;
- alto contraste e redução de movimento;
- PWA com application shell offline;
- configuração de deploy SPA para Vercel;
- Design System responsivo;
- fluxo de segurança sem simbolismo;
- painel de QA em `/dev` durante desenvolvimento.

### Jornadas elementais

- Palavra: fato, interpretação, previsão e intenção;
- Água: nomeação, lamento, memória, confiança, crafting e revisão;
- Fogo: chama, intervalo, limite, coragem, transformação, crafting e revisão;
- Terra: corpo, trabalho possível, recursos, ritmo, ordem, crafting e revisão;
- Espírito: síntese, centro provisório, conselho, decisão revisável, retorno, crafting e revisão;
- cadeias simbólicas com proveniência e fallbacks autorais;
- integração, ajuste, repouso ou arquivo sem perda de progresso.

### Nova Obra contínua

- **8.0 — O Ciclo que Retorna ao Templo:** instâncias contínuas separadas e reversíveis;
- **8.1 — A Jornada que se Desdobra:** conteúdo curado determinístico por semente;
- **8.2 — A Variação que Preserva o Núcleo:** variantes versionadas sem penalidade;
- **8.3 — O Tema que Orienta sem Determinar:** temas curados ou ausência explícita;
- **8.4 — O Ciclo Temático que se Expande:** pacotes curados e profundidade explícita;
- **8.5 — O Mapa dos Ciclos que Não Hierarquiza:** mapa descritivo, filtros e exportação local;
- **8.6 — A Coleção que Cresce sem Acumular Valor:** coleções locais sem ranking ou valor por quantidade;
- **8.7 — A Partilha que Exige Consentimento:** prévia minimizada e arquivo local somente após cinco consentimentos explícitos;
- **8.8 — A Recepção que Não se Apropria:** validação, sanitização e biblioteca recebida separada, sem mescla com progresso próprio;
- **8.9 — A Resposta que Não Cobra Retorno:** gestos curados ou silêncio, arquivo local opcional e nenhuma expectativa de continuidade;
- **8.10 — O Retorno que Não Reabre o Ciclo:** leitura transitória de respostas, sem histórico, confirmação, lembrete ou reabertura da origem;
- **8.11 — A Conferência que Não Promete Autenticidade:** selo local de consistência para detectar alterações sem afirmar identidade, autoria ou segurança criptográfica;
- **8.12 — A Versão que Não Reescreve o Passado:** matriz SemVer explícita, sem downgrade ou migração silenciosa de formatos desconhecidos;
- **8.13 — A Medida que Protege sem Julgar o Conteúdo:** orçamento local de bytes, texto, profundidade e complexidade antes de checksum, versão e sanitização;
- **8.14 — A Forma que Não Esconde Comportamento:** validação de JSON inerte, sem funções, acessores, protótipos especiais, arrays esparsos ou chaves reservadas;
- **8.15 — A Palavra que Não se Disfarça:** Unicode NFC obrigatório e recusa de controles invisíveis ou bidirecionais, sem reescrita silenciosa;
- **8.16 — A Chave que Não se Repete em Silêncio:** detecção de nomes duplicados no texto JSON antes que o parser descarte valores anteriores;
- **8.17 — O Número que Não Muda em Silêncio:** preservação da medida decimal antes do parse, sem inteiros inseguros, overflow, underflow ou arredondamento oculto;
- **8.18 — O Campo que Não Some em Silêncio:** contratos recursivos de campos, sem propriedades extras descartadas durante a sanitização;
- **8.19 — A Margem que Não se Apaga em Silêncio:** espaços e quebras nas extremidades são recusados, sem `trim()` ou correção automática dos textos;
- **8.20 — O Tempo que Não se Converte em Silêncio:** instantes UTC canônicos, sem offset, fuso implícito, data impossível ou normalização silenciosa;
- **8.21 — A Sequência que Não se Inverte em Silêncio:** quantidades, posições, política de datas e cronologia interna precisam concordar antes do domínio;
- **8.22 — A Natureza que Não Troca de Lugar em Silêncio:** tema, pacote, tipo, estado e encerramento precisam permanecer compatíveis entre si;
- **8.23 — A Referência que Não Aponta para o Vazio em Silêncio:** modelos, temas, variantes, pacotes e gestos precisam existir nos catálogos locais compatíveis;
- **8.24 — O Aviso que Não Troca de Sentido em Silêncio:** avisos obrigatórios, condições, unicidade e ordem precisam corresponder ao catálogo editorial local;
- **8.25 — A Impressão que Não Decide Sozinha em Silêncio:** a impressão agrupa candidatos, mas somente a equivalência canônica decide duplicação; colisões preservam todas as cópias;
- **8.26 — O Identificador que Não Alcança Duas Cópias em Silêncio:** IDs locais são únicos e ações por identificador ambíguo não alteram nenhuma cópia;
- **8.27 — O Relógio que Não Anda para Trás em Silêncio:** criação, recebimento e mutações locais usam UTC canônico e nunca regridem o último estado conhecido;
- **8.28 — A Cópia que Não Continua Presa ao Original em Silêncio:** entradas, consultas, resultados e versões sucessivas usam snapshots defensivos sem referências mutáveis compartilhadas.

## Ciclo validável

```text
Fonte bíblica
→ missão
→ classificação ou prática
→ cadeia simbólica
→ crafting
→ ação
→ retorno
→ revisão
→ transformação do Templo
→ Nova Obra contínua
```

A progressão não mede valor pessoal, espiritual ou emocional. Recusar, pausar, encerrar cedo, manter vazio, preservar desconhecido, permanecer em silêncio, descartar um retorno, usar arquivo legado, interromper uma versão incompatível, recusar uma estrutura acima do orçamento técnico, rejeitar uma forma não inerte, interromper texto Unicode ambíguo, recusar chaves repetidas, impedir uma mudança numérica silenciosa, interromper campos desconhecidos, recusar margens textuais externas, interromper um instante temporal não canônico, rejeitar campos relacionados contraditórios, impedir a mistura de naturezas incompatíveis, recusar uma referência inexistente, interromper um aviso divergente, preservar duas cópias com a mesma impressão, interromper uma ação sobre ID local ambíguo, recusar um relógio local regressivo ou manter uma cópia desvinculada de sua entrada são estados válidos quando previstos pelo fluxo.

## Stack

- React 19
- TypeScript
- Vite
- React Router
- Zustand
- Zod
- IndexedDB
- Vitest
- PWA sem dependência de runtime externo

## Executar

```bash
npm install
npm run dev
```

## Validar

```bash
npm run validate:content
npm run test
npm run build
```

## Deploy

O projeto inclui `vercel.json` com fallback para rotas SPA e cabeçalhos específicos para o service worker e o manifesto.

## Privacidade

A versão atual funciona sem conta e persiste o progresso no próprio dispositivo. Não há IA, sincronização ou analytics ativos.

Registros de revisão permanecem locais e opcionais. Exportações de mapas, coleções ou partilhas são iniciadas manualmente. A partilha de coleções gera somente um arquivo local minimizado; o Athanor não envia, publica ou registra o destinatário.

Pacotes recebidos são validados e guardados, quando explicitamente escolhidos, em uma biblioteca local separada. Eles não criam jornadas, não alteram coleções próprias, não confirmam leitura e não registram a identidade de origem.

Respostas são opcionais e usam somente gestos curados. O silêncio não cria registro. Quando escolhido, o arquivo de resposta é gerado localmente, não inclui o conteúdo recebido e declara que nenhum retorno adicional é necessário.

Retornos de resposta são apenas validados e exibidos em prévia transitória. O Athanor não os armazena, não confirma leitura, não cria lembrete e não reabre a coleção ou a partilha original.

Novas partilhas e respostas recebem um checksum local determinístico. Ele detecta alterações de conteúdo, mas não é assinatura digital, não é criptográfico e não autentica identidade ou autoria. Arquivos legados continuam aceitos com aviso quando passam pelas demais validações.

A versão declarada de cada pacote também precisa coincidir com uma matriz SemVer explícita. Versões futuras ou antigas sem migração documentada são recusadas sem alterar o arquivo, criar histórico ou tentar conversão aproximada.

Antes de qualquer checksum ou versão, o Athanor aplica um orçamento técnico local. Arquivos grandes demais não são lidos; estruturas profundas ou extensas são interrompidas sem truncamento, reparo automático, persistência da recusa ou julgamento do conteúdo.

Antes do `JSON.parse`, o texto bruto é inspecionado para impedir chaves repetidas no mesmo objeto. Escapes diferentes que representam o mesmo nome são tratados como duplicatas, e nenhum primeiro ou último valor é escolhido silenciosamente.

Ainda antes do parse, os lexemas numéricos precisam preservar a mesma medida decimal quando convertidos para `Number`. Inteiros fora da faixa segura, overflow, underflow, `-0` e arredondamentos silenciosos são recusados sem correção automática.

Depois do `JSON.parse` e antes do orçamento estrutural, os valores também precisam permanecer JSON inerte. Funções, getters, setters, símbolos, protótipos especiais, arrays esparsos e chaves reservadas são recusados sem execução, conversão automática ou registro da tentativa.

Depois do orçamento e antes do checksum, textos e nomes de campos precisam estar em Unicode NFC e não podem conter controles invisíveis, direção bidirecional, pares substitutos inválidos, não caracteres ou `U+FFFD`. O Athanor recusa sem normalizar, traduzir ou reescrever o arquivo.

Depois do checksum e da matriz de versão, cada propriedade presente precisa pertencer ao manifesto recursivo do formato conhecido. Campos extras são recusados antes da sanitização; nenhum dado desconhecido é apagado, migrado ou reinterpretado silenciosamente.

Depois do contrato estrito, cada string conhecida precisa coincidir com seu próprio `trim()`. Espaços e quebras nas extremidades são recusados sem alteração; whitespace interno permanece preservado, e os parsers copiam os textos aprovados exatamente.

Depois das margens exatas, campos temporais conhecidos precisam usar `YYYY-MM-DDTHH:mm:ss.sssZ` em UTC e sobreviver a um round-trip idêntico com `Date.toISOString()`. Offsets, fuso implícito, precisão diferente e datas impossíveis são recusados sem conversão ou correção.

Depois do formato temporal, a partilha precisa manter relações coerentes: `itemCount` corresponde à lista, posições são sequenciais, datas respeitam `includeDates`, conclusão exige ocorrência, conclusão não antecede ocorrência e nenhum instante interno pode ultrapassar `generatedAt`. O relógio atual não participa da validação.

Depois das relações gerais, os campos discriminados precisam respeitar sua natureza: tema explícito exclui `noTheme`, identificador e rótulo de pacote viajam juntos, Rastros não carregam campos exclusivos de ciclos, encerramento antecipado exige ciclo incompleto e estado concluído não mantém pendências.

Depois da compatibilidade dos campos, referências fornecidas precisam existir nos catálogos embarcados e aceitar o mesmo elemento, tema e tipo. IDs e rótulos divergentes são recusados sem aproximação, substituição ou busca externa; a ausência de `themeId` com `noTheme: false` continua sendo tema desconhecido válido.

Depois das referências catalogadas, a impressão descritiva das respostas precisa usar `received-` seguido de oito hexadecimais minúsculos. O formato não comprova origem e a impressão pode colidir; na biblioteca recebida, ela somente seleciona candidatos para uma comparação canônica do conteúdo.

Depois da impressão, a lista `notices` precisa conter somente avisos curados, obrigatórios, únicos e na ordem canônica. Condições deriváveis de datas e quantidade precisam concordar com o pacote; o aviso de registros não vinculados permanece opcional porque `linked` não atravessa a minimização.

A deduplicação da biblioteca nunca depende somente da impressão. `generatedAt` e o selo são ignorados na equivalência, enquanto coleção, itens, opções, proveniência e avisos permanecem significativos. Uma colisão preserva os dois registros sem sobrescrever nenhum deles.

Os IDs usados pela biblioteca recebida são apenas endereços locais. Uma cópia distinta que solicita um ID ocupado recebe o primeiro sufixo disponível, enquanto uma biblioteca legada com IDs duplicados permanece intacta e não aceita arquivamento, reativação ou remoção por um identificador ambíguo.

A cronologia da biblioteca recebida usa somente instantes UTC canônicos. Criação, recebimento, arquivamento, reativação e remoção não podem anteceder o último estado local; o relógio declarado dentro do pacote permanece separado e não é usado para julgar a origem.

A biblioteca recebida também cria snapshots defensivos. O pacote de entrada, o registro devolvido, as consultas e as novas versões não compartilham objetos aninhados mutáveis; operações recusadas continuam devolvendo exatamente a instância original.

## Assinatura

**Tehkné Solutions**
