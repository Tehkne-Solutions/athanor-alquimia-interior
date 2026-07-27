import type { NewWorkStartPoint } from '../domain/continuousJourney';
import type { BiblicalUnit } from '../domain/types';

export interface ContinuousThemeOption {
  id: string;
  label: string;
  description: string;
  startPoints: NewWorkStartPoint[];
  orientationLens: string;
  observationLens: string;
  reviewLens: string;
}

export const continuousThemeBiblicalUnit: BiblicalUnit = {
  id: 'proverb_continuous_theme_v1',
  reference: 'Provérbios 4:25',
  title: 'Direcionar a atenção não determina o caminho inteiro',
  principle: 'Um foco provisório pode orientar a observação sem se tornar diagnóstico, obrigação, previsão ou resposta definitiva.',
  context: 'O provérbio usa a imagem do olhar dirigido. O Athanor aplica essa imagem editorialmente à escolha explícita de um tema curado, sem afirmar que o tema revela o estado do usuário ou indica uma direção divina específica.',
  themes: ['atenção', 'foco', 'limite', 'orientação', 'revisão'],
  application: 'Escolher um tema, permanecer sem tema, manter a escolha ou solicitar outra opção sem alterar o valor da jornada.',
  provenance: [{
    id: 'prov-continuous-theme-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia a reflexão; catálogo, temas, lentes e rotação são estruturas autorais do Athanor.',
    sourceLabel: 'Provérbios 4:25'
  }]
};

export const continuousThemeCatalog = {
  id: 'continuous-theme-catalog',
  version: '1.0.0',
  policy: 'explicit-curated-no-sensitive-inference-v1',
  mode: 'curated-only',
  themeCount: 8,
  stageKeys: ['orientationLens', 'observationLens', 'reviewLens']
} as const;

export const continuousThemes: ContinuousThemeOption[] = [
  {
    id: 'theme-clarity',
    label: 'Clareza provisória',
    description: 'Observar o que está explícito antes de preencher lacunas.',
    startPoints: ['word', 'earth', 'spirit'],
    orientationLens: 'Procure apenas o elemento mais concreto da cena fictícia.',
    observationLens: 'Separe informação disponível, interpretação e parte desconhecida.',
    reviewLens: 'Revise se algo ficou mais claro ou se continua aberto.'
  },
  {
    id: 'theme-proportion',
    label: 'Proporção possível',
    description: 'Comparar tamanho da ação, contexto e reversibilidade.',
    startPoints: ['word', 'fire', 'earth', 'spirit'],
    orientationLens: 'Observe qual parte merece uma resposta menor e revisável.',
    observationLens: 'Compare intensidade, limite e possibilidade de retorno.',
    reviewLens: 'Revise se o passo permaneceu proporcional ao cenário fictício.'
  },
  {
    id: 'theme-support',
    label: 'Apoio disponível',
    description: 'Reconhecer recursos curados sem consultar pessoas ou contas reais.',
    startPoints: ['water', 'earth', 'spirit'],
    orientationLens: 'Identifique se a cena fictícia oferece algum apoio explícito.',
    observationLens: 'Diferencie apoio presente, possível, ausente e desconhecido.',
    reviewLens: 'Revise sem transformar ausência de apoio em falha.'
  },
  {
    id: 'theme-transition',
    label: 'Transição reversível',
    description: 'Observar mudanças pequenas, temporárias e passíveis de revisão.',
    startPoints: ['water', 'fire', 'spirit'],
    orientationLens: 'Localize uma passagem entre dois estados da cena fictícia.',
    observationLens: 'Note o que muda e o que permanece preservado.',
    reviewLens: 'Revise se a transição pode ser mantida, reduzida ou retirada.'
  },
  {
    id: 'theme-boundary',
    label: 'Limite em primeira pessoa',
    description: 'Distinguir delimitação, controle e ausência de ação.',
    startPoints: ['word', 'fire', 'spirit'],
    orientationLens: 'Observe uma formulação que descreva o próprio limite.',
    observationLens: 'Compare delimitar a própria ação e tentar controlar outra parte.',
    reviewLens: 'Revise se o limite continua claro, proporcional e reversível.'
  },
  {
    id: 'theme-resources',
    label: 'Recursos possíveis',
    description: 'Considerar somente recursos apresentados no cenário curado.',
    startPoints: ['water', 'fire', 'earth'],
    orientationLens: 'Liste mentalmente apenas os recursos que a cena já apresenta.',
    observationLens: 'Observe disponibilidade atual, futura, ausente ou desconhecida.',
    reviewLens: 'Revise se o escopo precisa ser reduzido, pausado ou arquivado.'
  },
  {
    id: 'theme-rhythm',
    label: 'Ritmo sustentável',
    description: 'Alternar ação e pausa sem streak, dívida ou compensação.',
    startPoints: ['water', 'earth', 'rest'],
    orientationLens: 'Observe a menor cadência apresentada pela cena fictícia.',
    observationLens: 'Note onde existe pausa, interrupção ou ausência de frequência.',
    reviewLens: 'Revise sem cobrar continuidade ou repetição.'
  },
  {
    id: 'theme-rest',
    label: 'Repouso completo',
    description: 'Preservar pausa, silêncio e ausência de prática como resultados válidos.',
    startPoints: ['water', 'earth', 'spirit', 'rest'],
    orientationLens: 'Considere que nenhum novo passo pode ser necessário agora.',
    observationLens: 'Observe a pausa sem convertê-la em tarefa ou preparação obrigatória.',
    reviewLens: 'Preserve o repouso sem dívida futura, justificativa ou promessa de retorno.'
  }
];

export const continuousThemeRestrictions = [
  'A escolha do tema é explícita; o sistema não deduz um tema a partir de respostas anteriores',
  'Permanecer sem tema é uma escolha completa e não reduz progresso',
  'Tema, elemento, variante e prática permanecem campos independentes',
  'Manter, trocar ou remover um tema não altera recompensa, nível ou restauração',
  'Nenhum texto pessoal, emoção, diagnóstico, nota ou decisão participa da seleção',
  'A rotação utiliza somente semente curada, versão, contador e temas compatíveis',
  'Nenhum tema produz previsão, leitura oculta ou direção espiritual específica',
  'Todo o histórico temático permanece local e auditável'
];

export function getContinuousThemes(startPoint: NewWorkStartPoint): ContinuousThemeOption[] {
  return continuousThemes.filter((theme) => theme.startPoints.includes(startPoint));
}
