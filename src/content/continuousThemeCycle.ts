import type { NewWorkStartPoint } from '../domain/continuousJourney';
import type { ContinuousTrailStage } from '../domain/continuousTrail';

export type ContinuousThemeCycleThemeId =
  | 'theme-clarity'
  | 'theme-proportion'
  | 'theme-support'
  | 'theme-transition'
  | 'theme-boundary'
  | 'theme-resources'
  | 'theme-rhythm'
  | 'theme-rest'
  | 'no-theme';

export interface ContinuousThemeCyclePassage {
  id: string;
  stage: ContinuousTrailStage;
  label: string;
  prompt: string;
}

export interface ContinuousThemeCyclePackage {
  id: string;
  themeId: ContinuousThemeCycleThemeId;
  label: string;
  description: string;
  startPoints: NewWorkStartPoint[];
  passages: [ContinuousThemeCyclePassage, ContinuousThemeCyclePassage, ContinuousThemeCyclePassage];
}

export const continuousThemeCycleBiblicalUnit = {
  id: 'proverb_thematic_cycle_v1',
  reference: 'Provérbios 15:23',
  title: 'A passagem que encontra medida',
  principle: 'Uma resposta pode ser considerada em relação ao momento e à medida, sem transformar ocasião em previsão ou obrigação.',
  context: 'A referência inicia uma reflexão sobre forma e ocasião. O Athanor não afirma que um pacote seja espiritualmente correto, nem interpreta o momento pessoal do usuário.',
  themes: ['medida', 'ocasião', 'resposta', 'revisão'],
  application: 'Abrir uma sequência curta, curada e reversível, com profundidade escolhida explicitamente.',
  provenance: [{
    id: 'bible-proverbs-15-23',
    label: 'Provérbios 15:23',
    class: 'biblical_primary' as const,
    explanation: 'Referência bíblica principal da fase, aplicada editorialmente sem promessa, previsão ou leitura pessoal.',
    sourceLabel: 'Bíblia'
  }]
};

export const continuousThemeCycleCatalog = {
  id: 'continuous-theme-cycle-catalog',
  version: '1.0.0',
  policy: 'explicit-curated-depth-no-sensitive-inference-v1',
  mode: 'curated-only' as const,
  supportedDepths: [1, 2, 3] as const,
  rewardPolicy: 'Profundidade, conclusão, passagem e encerramento antecipado possuem o mesmo valor de gameplay.'
};

export const continuousThemeCyclePackages: ContinuousThemeCyclePackage[] = [
  {
    id: 'package-clarity-window',
    themeId: 'theme-clarity',
    label: 'Janela da Clareza Provisória',
    description: 'Três passagens para separar o que está visível do que ainda permanece desconhecido.',
    startPoints: ['word', 'earth', 'spirit'],
    passages: [
      { id: 'clarity-name-visible', stage: 'orientation', label: 'Nomear o visível', prompt: 'Observe somente o elemento fictício que está claramente disponível na cena. O restante pode permanecer desconhecido.' },
      { id: 'clarity-separate-inference', stage: 'observation', label: 'Separar inferência', prompt: 'Diferencie um dado apresentado de uma interpretação possível, sem decidir qual é a correta.' },
      { id: 'clarity-review-limit', stage: 'review', label: 'Revisar o limite', prompt: 'Registre se a clareza atual é suficiente para observar, pausar ou encerrar a passagem.' }
    ]
  },
  {
    id: 'package-proportion-measure',
    themeId: 'theme-proportion',
    label: 'Câmara da Proporção Possível',
    description: 'Uma sequência para comparar tamanhos e intensidades sem criar uma medida moral.',
    startPoints: ['word', 'fire', 'earth', 'spirit'],
    passages: [
      { id: 'proportion-identify-parts', stage: 'orientation', label: 'Identificar partes', prompt: 'Observe duas partes fictícias da cena sem declarar que uma deveria dominar a outra.' },
      { id: 'proportion-reduce-scale', stage: 'observation', label: 'Reduzir a escala', prompt: 'Considere como a cena ficaria se apenas uma unidade pequena permanecesse ativa.' },
      { id: 'proportion-review-balance', stage: 'review', label: 'Revisar a medida', prompt: 'Verifique se a proporção continua útil, precisa ser reduzida ou pode ser deixada sem conclusão.' }
    ]
  },
  {
    id: 'package-support-bridge',
    themeId: 'theme-support',
    label: 'Ponte do Apoio Disponível',
    description: 'Passagens para reconhecer apoio presente, ausente ou desconhecido sem atribuir culpa.',
    startPoints: ['water', 'earth', 'spirit'],
    passages: [
      { id: 'support-map-present', stage: 'orientation', label: 'Mapear o presente', prompt: 'Identifique um apoio fictício disponível agora ou marque que nenhum apoio está visível.' },
      { id: 'support-allow-absence', stage: 'observation', label: 'Permitir ausência', prompt: 'Observe a cena sem preencher automaticamente a falta de apoio com promessa, cobrança ou inferência.' },
      { id: 'support-review-access', stage: 'review', label: 'Revisar acesso', prompt: 'Considere se o apoio permanece acessível, ficou condicionado ou deve ser retirado do ciclo.' }
    ]
  },
  {
    id: 'package-transition-crossing',
    themeId: 'theme-transition',
    label: 'Travessia da Transição Reversível',
    description: 'Uma sequência curta para observar mudança sem exigir chegada ou fechamento.',
    startPoints: ['water', 'fire', 'spirit'],
    passages: [
      { id: 'transition-mark-before', stage: 'orientation', label: 'Marcar o antes', prompt: 'Observe o estado fictício anterior sem transformá-lo em erro ou etapa inferior.' },
      { id: 'transition-notice-crossing', stage: 'observation', label: 'Notar a travessia', prompt: 'Identifique uma mudança pequena e reversível entre dois estados da cena.' },
      { id: 'transition-review-open', stage: 'review', label: 'Manter abertura', prompt: 'Revise se a passagem deve continuar, pausar ou terminar sem definir um destino final.' }
    ]
  },
  {
    id: 'package-boundary-outline',
    themeId: 'theme-boundary',
    label: 'Contorno do Limite em Primeira Pessoa',
    description: 'Passagens para observar contorno, pausa e revisão sem controlar outras partes.',
    startPoints: ['word', 'fire', 'spirit'],
    passages: [
      { id: 'boundary-name-line', stage: 'orientation', label: 'Nomear o contorno', prompt: 'Identifique um limite fictício formulado em primeira pessoa e sem ameaça.' },
      { id: 'boundary-observe-space', stage: 'observation', label: 'Observar o espaço', prompt: 'Considere o espaço preservado pelo limite sem avaliar obediência de terceiros.' },
      { id: 'boundary-review-flex', stage: 'review', label: 'Revisar flexibilidade', prompt: 'Verifique se o contorno pode ser mantido, reduzido, pausado ou retirado.' }
    ]
  },
  {
    id: 'package-resources-basket',
    themeId: 'theme-resources',
    label: 'Cesto dos Recursos do Ciclo',
    description: 'Uma sequência para trabalhar somente com recursos fictícios e disponibilidade declarada.',
    startPoints: ['water', 'fire', 'earth'],
    passages: [
      { id: 'resources-list-available', stage: 'orientation', label: 'Listar o disponível', prompt: 'Observe apenas recursos fictícios disponíveis, futuros, ausentes ou desconhecidos.' },
      { id: 'resources-adjust-scope', stage: 'observation', label: 'Ajustar o escopo', prompt: 'Reduza a passagem para caber nos recursos apresentados, sem criar obrigação de continuar.' },
      { id: 'resources-review-change', stage: 'review', label: 'Revisar mudança', prompt: 'Verifique se a disponibilidade mudou e escolha continuar, pausar ou encerrar.' }
    ]
  },
  {
    id: 'package-rhythm-breath',
    themeId: 'theme-rhythm',
    label: 'Compasso do Ritmo Curto',
    description: 'Passagens para alternar ação fictícia e repouso sem sequência obrigatória.',
    startPoints: ['water', 'earth', 'rest'],
    passages: [
      { id: 'rhythm-choose-unit', stage: 'orientation', label: 'Escolher uma unidade', prompt: 'Defina uma unidade fictícia pequena ou marque que nenhuma unidade será usada.' },
      { id: 'rhythm-place-pause', stage: 'observation', label: 'Colocar uma pausa', prompt: 'Insira uma pausa igual ou maior que a unidade, sem cronômetro ou sequência obrigatória.' },
      { id: 'rhythm-review-cadence', stage: 'review', label: 'Revisar a cadência', prompt: 'Considere manter, reduzir, interromper ou não retomar o compasso.' }
    ]
  },
  {
    id: 'package-rest-stillness',
    themeId: 'theme-rest',
    label: 'Sala do Repouso Completo',
    description: 'Uma sequência em que observar e encerrar sem prática são resultados integrais.',
    startPoints: ['water', 'earth', 'spirit', 'rest'],
    passages: [
      { id: 'rest-remove-demand', stage: 'orientation', label: 'Retirar a demanda', prompt: 'Observe a cena fictícia sem adicionar tarefa, meta ou compensação futura.' },
      { id: 'rest-allow-stillness', stage: 'observation', label: 'Permitir quietude', prompt: 'Mantenha a passagem sem prática e sem converter repouso em preparação produtiva.' },
      { id: 'rest-review-no-return', stage: 'review', label: 'Revisar sem retorno', prompt: 'Considere concluir o ciclo sem definir retomada, prazo ou próximo passo.' }
    ]
  },
  {
    id: 'package-open-no-theme',
    themeId: 'no-theme',
    label: 'Passagem Aberta sem Tema',
    description: 'Um pacote neutro para quem escolheu permanecer sem lente temática adicional.',
    startPoints: ['word', 'water', 'fire', 'earth', 'spirit', 'rest'],
    passages: [
      { id: 'open-notice-stage', stage: 'orientation', label: 'Notar a etapa', prompt: 'Observe a etapa curada da variante sem acrescentar uma lente temática.' },
      { id: 'open-preserve-unknown', stage: 'observation', label: 'Preservar o desconhecido', prompt: 'Mantenha informações ausentes como desconhecidas e evite completar a cena por inferência.' },
      { id: 'open-review-choice', stage: 'review', label: 'Revisar a escolha', prompt: 'Considere continuar, passar, pausar ou encerrar sem tema e sem penalidade.' }
    ]
  }
];

export const continuousThemeCycleRestrictions = [
  'O ciclo utiliza somente pacotes e passagens curadas.',
  'A profundidade de uma a três passagens é escolhida explicitamente.',
  'Nenhuma passagem é repetida dentro do mesmo ciclo.',
  'Pausar ou encerrar antecipadamente preserva o histórico.',
  'Permanecer sem ciclo adicional é uma conclusão completa.',
  'Tema, elemento, variante e etapa não produzem diagnóstico, previsão ou direção espiritual.',
  'Nenhum texto, emoção, nota, decisão ou perfil psicológico participa da seleção.',
  'Profundidade e repetição não concedem nível, restauração ou recompensa adicional.'
];

export function getContinuousThemeCyclePackages(
  startPoint: NewWorkStartPoint,
  themeId?: string,
  noTheme = false
): ContinuousThemeCyclePackage[] {
  const resolvedTheme = noTheme || !themeId ? 'no-theme' : themeId;
  return continuousThemeCyclePackages.filter(
    (item) => item.themeId === resolvedTheme && item.startPoints.includes(startPoint)
  );
}
