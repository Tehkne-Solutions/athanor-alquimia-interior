import type { BiblicalUnit, SymbolicNode } from '../domain/types';
import type {
  WaterCareActionId,
  WaterSupportResourceId,
  WaterTrustStatement,
  WaterTrustStatementCategory
} from '../domain/waterTrust';

export const waterTrustBiblicalUnit: BiblicalUnit = {
  id: 'psalm_space_of_trust_01',
  reference: 'Salmo 46',
  title: 'Presença, apoio e confiança sem garantia',
  principle: 'Confiança pode ser praticada por meio de presença, recursos e um próximo passo, sem prometer ausência de dificuldade ou um resultado específico.',
  context: 'O Salmo 46 articula ameaça, instabilidade, presença e refúgio. O Athanor utiliza essa composição como núcleo editorial para mapear apoio possível, mantendo separados fé, recurso concreto, previsão e garantia.',
  themes: ['confiança', 'presença', 'apoio', 'instabilidade'],
  application: 'Distinguir apoio de promessa e selecionar, apenas quando fizer sentido, recursos e uma ação de cuidado disponíveis agora.',
  provenance: [
    {
      id: 'bib-psalm-46',
      label: 'Fonte bíblica',
      class: 'BIB',
      explanation: 'Referência dos Salmos usada como núcleo editorial da quarta missão da Água.',
      sourceLabel: 'Salmo 46'
    }
  ]
};

export const waterTrustStatementCategoryLabels: Record<WaterTrustStatementCategory, string> = {
  support: 'Apoio possível',
  guarantee: 'Garantia',
  prediction: 'Previsão'
};

export const waterTrustStatements: WaterTrustStatement[] = [
  {
    id: 'water-trust-01',
    text: 'Posso pedir a uma pessoa de confiança que me acompanhe nesta conversa.',
    suggestedCategory: 'support',
    explanation: 'A frase identifica um recurso relacional possível sem assegurar o resultado da conversa.'
  },
  {
    id: 'water-trust-02',
    text: 'Nada ruim acontecerá se eu seguir este caminho.',
    suggestedCategory: 'guarantee',
    explanation: 'A frase promete ausência de dano, algo que o aplicativo não pode assegurar.'
  },
  {
    id: 'water-trust-03',
    text: 'Esta decisão certamente terminará bem.',
    suggestedCategory: 'prediction',
    explanation: 'A frase afirma um desfecho futuro que ainda não pode ser conhecido.'
  },
  {
    id: 'water-trust-04',
    text: 'Posso confirmar as informações antes de agir.',
    suggestedCategory: 'support',
    explanation: 'Informação verificável pode apoiar uma decisão sem garantir seu resultado.'
  },
  {
    id: 'water-trust-05',
    text: 'A presença desta pessoa impedirá qualquer problema.',
    suggestedCategory: 'guarantee',
    explanation: 'Apoio humano pode ser valioso, mas não elimina todos os riscos.'
  },
  {
    id: 'water-trust-06',
    text: 'A outra pessoa aceitará meu pedido sem resistência.',
    suggestedCategory: 'prediction',
    explanation: 'A frase presume uma reação futura de outra pessoa.'
  },
  {
    id: 'water-trust-07',
    text: 'Posso reorganizar o prazo e revisar o próximo passo.',
    suggestedCategory: 'support',
    explanation: 'Tempo e planejamento são recursos práticos, não promessas de sucesso.'
  },
  {
    id: 'water-trust-08',
    text: 'Esta prática me protegerá de qualquer acontecimento.',
    suggestedCategory: 'guarantee',
    explanation: 'Uma prática simbólica não oferece proteção física ou controle sobre acontecimentos.'
  },
  {
    id: 'water-trust-09',
    text: 'Tudo voltará ao normal amanhã.',
    suggestedCategory: 'prediction',
    explanation: 'A frase fixa um prazo e um resultado que não podem ser confirmados.'
  }
];

export const waterSupportResources: {
  id: WaterSupportResourceId;
  label: string;
  description: string;
  group: 'relational' | 'practical' | 'personal' | 'professional';
}[] = [
  {
    id: 'trusted_person',
    label: 'Pessoa de confiança',
    description: 'Alguém com quem seja possível conversar ou pedir companhia.',
    group: 'relational'
  },
  {
    id: 'time',
    label: 'Tempo disponível',
    description: 'Espaço para pausar, preparar ou revisar antes de decidir.',
    group: 'practical'
  },
  {
    id: 'information',
    label: 'Informação verificável',
    description: 'Dados, documentos ou orientações que podem reduzir incerteza.',
    group: 'practical'
  },
  {
    id: 'safe_place',
    label: 'Lugar mais seguro',
    description: 'Um ambiente conhecido ou apropriado para a próxima ação.',
    group: 'practical'
  },
  {
    id: 'rest',
    label: 'Repouso',
    description: 'Uma pausa possível antes de continuar, quando a situação permitir.',
    group: 'personal'
  },
  {
    id: 'professional_support',
    label: 'Apoio profissional',
    description: 'Atendimento médico, psicológico, jurídico ou outro suporte adequado ao contexto.',
    group: 'professional'
  },
  {
    id: 'prior_experience',
    label: 'Experiência anterior',
    description: 'Algo já aprendido que pode informar o próximo passo sem determinar o resultado.',
    group: 'personal'
  }
];

export const waterCareActions: {
  id: WaterCareActionId;
  label: string;
  description: string;
}[] = [
  {
    id: 'ask_for_company',
    label: 'Pedir companhia',
    description: 'Convidar alguém de confiança para acompanhar uma conversa ou tarefa.'
  },
  {
    id: 'confirm_information',
    label: 'Confirmar uma informação',
    description: 'Verificar um dado antes de tomar uma decisão.'
  },
  {
    id: 'reorganize_deadline',
    label: 'Reorganizar o prazo',
    description: 'Reduzir a etapa ou negociar mais tempo quando isso for possível.'
  },
  {
    id: 'rest',
    label: 'Fazer uma pausa',
    description: 'Interromper temporariamente a atividade, quando não houver risco imediato.'
  },
  {
    id: 'seek_professional_support',
    label: 'Procurar apoio profissional',
    description: 'Buscar um serviço ou profissional adequado à situação.'
  },
  {
    id: 'none_now',
    label: 'Nenhuma ação agora',
    description: 'Concluir a missão sem assumir um compromisso externo.'
  }
];

export const waterTrustNodes: SymbolicNode[] = [
  {
    id: 'chesed_support_v1',
    name: 'Chesed',
    category: 'sefirah',
    description: 'No Athanor, Chesed organiza comparativamente generosidade, apoio e expansão de recursos. Não é apresentado como conteúdo do Salmo.',
    layer: 'kabbalah',
    fallbackNodeId: 'support_fountain_v1',
    provenance: {
      id: 'cmp-chesed-support',
      label: 'Comparação temática',
      class: 'CMP',
      explanation: 'Aplicação comparativa do Athanor para representar apoio e disponibilidade.',
      sourceLabel: 'Síntese Athanor'
    }
  },
  {
    id: 'support_fountain_v1',
    name: 'Fonte do Apoio',
    category: 'athanor',
    description: 'Fallback autoral para organizar recursos possíveis quando a camada cabalística estiver desativada.',
    provenance: {
      id: 'ath-support-fountain',
      label: 'Criação Athanor',
      class: 'ATH',
      explanation: 'Ambiente autoral de gameplay.',
      sourceLabel: 'Tehkné Solutions'
    }
  },
  {
    id: 'kun_support_v1',
    name: 'Kun',
    category: 'trigram',
    description: 'Kun é utilizado comparativamente como movimento de receptividade e sustentação. Não prevê o resultado da ação.',
    layer: 'iching',
    fallbackNodeId: 'sustaining_movement_v1',
    provenance: {
      id: 'cmp-kun-support',
      label: 'Comparação temática',
      class: 'CMP',
      explanation: 'Uso comparativo de receptividade e sustentação na missão.',
      sourceLabel: 'Yi Jing · Kun'
    }
  },
  {
    id: 'sustaining_movement_v1',
    name: 'Movimento da Sustentação',
    category: 'athanor',
    description: 'Fallback autoral para reconhecer apoio sem convertê-lo em garantia.',
    provenance: {
      id: 'ath-sustaining-movement',
      label: 'Criação Athanor',
      class: 'ATH',
      explanation: 'Movimento autoral de gameplay.',
      sourceLabel: 'Tehkné Solutions'
    }
  },
  {
    id: 'star_trust_v1',
    name: 'A Estrela',
    category: 'archetype',
    description: 'Arquétipo opcional de orientação, esperança e continuidade. Não promete melhora, proteção ou resultado favorável.',
    layer: 'tarot',
    fallbackNodeId: 'hope_bearer_v1',
    provenance: {
      id: 'cmp-star-trust',
      label: 'Comparação arquetípica',
      class: 'CMP',
      explanation: 'Uso arquetípico secundário criado para a missão.',
      sourceLabel: 'Síntese Athanor'
    }
  },
  {
    id: 'hope_bearer_v1',
    name: 'Portadora da Esperança',
    category: 'athanor',
    description: 'Fallback autoral para representar orientação sem promessa de desfecho.',
    provenance: {
      id: 'ath-hope-bearer',
      label: 'Criação Athanor',
      class: 'ATH',
      explanation: 'Arquétipo autoral de gameplay.',
      sourceLabel: 'Tehkné Solutions'
    }
  },
  {
    id: 'trust_bridge_v1',
    name: 'Ponte da Confiança',
    category: 'athanor',
    description: 'Componente de gameplay que registra a prática de mapear apoio possível sem oferecer garantia ou previsão.',
    provenance: {
      id: 'ath-trust-bridge',
      label: 'Criação Athanor',
      class: 'ATH',
      explanation: 'Quarto componente da futura receita do Cálice da Memória Serena.',
      sourceLabel: 'Tehkné Solutions'
    }
  }
];
