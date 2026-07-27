import type { BiblicalUnit } from '../domain/types';
import { defaultContinuousResourceLimits } from '../domain/continuousResource';

export const continuousResourceBiblicalUnit: BiblicalUnit = {
  id: 'proverb_continuous_resource_v1',
  reference: 'Provérbios 25:16',
  title: 'Uma medida pode proteger sem declarar valor',
  principle: 'Estabelecer limite técnico para uma leitura não define a importância, a verdade ou o valor do conteúdo interrompido.',
  context: 'O provérbio usa a imagem da medida diante do mel. O Athanor aplica essa imagem somente à proteção do dispositivo: tamanho, profundidade e complexidade recebem fronteiras explícitas, sem diagnosticar, classificar ou censurar a experiência representada no arquivo.',
  themes: ['medida', 'limite', 'proteção', 'prudência', 'dispositivo'],
  application: 'Interromper localmente arquivos que excedam um orçamento técnico antes de checksum, versão, prévia ou persistência.',
  provenance: [{
    id: 'prov-continuous-resource-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia a reflexão; orçamento de recursos, inspeção estrutural e mensagens de recusa são estruturas autorais do Athanor.',
    sourceLabel: 'Provérbios 25:16'
  }]
};

export const continuousResourceCatalog = {
  id: 'continuous-resource-catalog',
  version: '1.0.0',
  policy: 'bounded-local-reading-no-content-judgment-v1',
  mode: 'pre-parse-envelope-and-iterative-structure-budget',
  ...defaultContinuousResourceLimits,
  recordsRefusal: false,
  repairsAutomatically: false,
  judgesContent: false
} as const;

export const continuousResourceRestrictions = [
  'O limite protege o dispositivo e não avalia o valor do conteúdo',
  'Arquivos acima do limite de bytes não são lidos',
  'Textos acima do limite de caracteres não são interpretados como JSON',
  'Profundidade excessiva é interrompida antes do checksum',
  'Quantidade excessiva de nós, campos ou itens é recusada sem truncamento',
  'Textos longos são recusados sem resumo automático',
  'Nenhum campo é removido para fazer um arquivo caber',
  'Nenhum arquivo externo é alterado, comprimido ou sobrescrito',
  'Nenhuma recusa é persistida ou enviada',
  'Nenhum contador de arquivos recusados é criado',
  'O usuário pode revisar o arquivo fora do Athanor sem penalidade',
  'Os mesmos limites se aplicam a partilhas e respostas'
];
