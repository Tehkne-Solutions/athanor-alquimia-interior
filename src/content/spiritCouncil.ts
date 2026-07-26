import type { BiblicalUnit, SymbolicNode } from '../domain/types';
import type {
  SpiritCouncilBasis,
  SpiritCouncilCategory,
  SpiritCouncilDecision,
  SpiritCouncilDisagreement,
  SpiritCouncilVoiceState
} from '../domain/spiritCouncil';
import type { SpiritDimension } from '../domain/spiritThread';

export interface SpiritCouncilEntry {
  id: string;
  text: string;
  suggestedCategory: SpiritCouncilCategory;
  explanation: string;
}

export interface SpiritCouncilScenario {
  id: string;
  title: string;
  description: string;
  prompts: Record<SpiritDimension, string>;
}

export const spiritCouncilBiblicalUnit: BiblicalUnit = {
  id: 'proverb_open_council_01',
  reference: 'Provérbios 15:22',
  title: 'Conselho sem coerção',
  principle: 'Consultar diferentes perspectivas pode ampliar discernimento sem transformar quantidade de vozes em verdade automática.',
  context: 'Provérbios apresenta o valor do conselho. O Athanor aplica esse princípio a personagens e situações fictícias, preservando silêncio, discordância e adiamento; não presume orientação divina específica nem garante uma decisão correta.',
  themes: ['conselho', 'discernimento', 'discordância', 'escuta', 'decisão provisória'],
  application: 'Permitir que cinco dimensões falem, passem ou permaneçam desconhecidas, sem votação obrigatória e sem apagar diferenças.',
  provenance: [{
    id: 'spirit_proverb_15_22_bib',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'Referência bíblica que inicia a missão. O conselho interno, os cenários e o Selo são adaptações editoriais e de gameplay.',
    sourceLabel: 'Provérbios 15:22'
  }]
};

export const spiritCouncilEntries: SpiritCouncilEntry[] = [
  { id: 'council-entry-01', text: 'As cinco partes apontam para o mesmo próximo passo provisório.', suggestedCategory: 'agreement', explanation: 'Registra convergência sem afirmar certeza ou verdade final.' },
  { id: 'council-entry-02', text: 'Palavra e ação reduzem o escopo para que o corpo possa acompanhar.', suggestedCategory: 'negotiation', explanation: 'As partes ajustam a proposta sem desaparecer.' },
  { id: 'council-entry-03', text: 'A emoção passa nesta rodada e continua registrada no conselho.', suggestedCategory: 'silence', explanation: 'Passar não apaga nem invalida a dimensão.' },
  { id: 'council-entry-04', text: 'O impulso ameaça expulsar qualquer parte que discorde.', suggestedCategory: 'coercion', explanation: 'Usa pressão e exclusão para fabricar concordância.' },
  { id: 'council-entry-05', text: 'Nenhuma parte apresenta objeção ao adiamento fictício.', suggestedCategory: 'agreement', explanation: 'Há concordância possível, ainda limitada ao cenário.' },
  { id: 'council-entry-06', text: 'O corpo pede pausa e a ação aceita diminuir o ritmo.', suggestedCategory: 'negotiation', explanation: 'Duas partes alteram a proposta para manter ambas presentes.' },
  { id: 'council-entry-07', text: 'A palavra permanece desconhecida e o conselho não inventa uma fala para ela.', suggestedCategory: 'silence', explanation: 'O desconhecimento é preservado sem interpretação.' },
  { id: 'council-entry-08', text: 'A maioria obriga a parte minoritária a declarar acordo.', suggestedCategory: 'coercion', explanation: 'A votação é usada para apagar discordância.' }
];

export const spiritCouncilScenarios: SpiritCouncilScenario[] = [
  {
    id: 'council-scenario-01',
    title: 'A ponte de papel',
    description: 'Cinco personagens fictícios avaliam se uma ponte de papel deve receber mais uma peça, ser pausada ou permanecer incompleta.',
    prompts: {
      word: 'A palavra pode nomear o estado da ponte.',
      emotion: 'A emoção pode falar, passar ou permanecer desconhecida.',
      impulse: 'O impulso pode propor velocidade sem comandar o grupo.',
      body: 'O corpo percebido pode registrar conforto, pausa ou desconhecimento.',
      action: 'A ação pode sugerir um passo reversível ou nenhuma decisão.'
    }
  },
  {
    id: 'council-scenario-02',
    title: 'O mapa incompleto',
    description: 'Um grupo fictício encontra um mapa com trechos ausentes e decide apenas como continuar a observação.',
    prompts: {
      word: 'A palavra pode descrever o que está legível.',
      emotion: 'A emoção pode participar sem definir o caminho.',
      impulse: 'O impulso pode querer avançar ou passar.',
      body: 'O corpo percebido pode indicar pausa, presença ou desconhecimento.',
      action: 'A ação pode propor copiar, esperar ou não decidir.'
    }
  },
  {
    id: 'council-scenario-03',
    title: 'A música sem final',
    description: 'Uma composição fictícia termina em cinco notas diferentes e o conselho decide se cria um encerramento provisório.',
    prompts: {
      word: 'A palavra pode nomear a intenção da música.',
      emotion: 'A emoção pode oferecer uma tonalidade ou passar.',
      impulse: 'O impulso pode pedir conclusão imediata.',
      body: 'O corpo percebido pode registrar ritmo ou incerteza.',
      action: 'A ação pode testar uma nota, adiar ou não decidir.'
    }
  },
  {
    id: 'council-scenario-04',
    title: 'A sala com cinco janelas',
    description: 'Cada janela fictícia mostra uma paisagem diferente e nenhuma precisa vencer as outras.',
    prompts: {
      word: 'A palavra pode descrever uma paisagem.',
      emotion: 'A emoção pode responder ou permanecer desconhecida.',
      impulse: 'O impulso pode querer escolher rapidamente.',
      body: 'O corpo percebido pode preferir distância ou proximidade.',
      action: 'A ação pode manter todas abertas, fechar uma provisoriamente ou não decidir.'
    }
  }
];

export const spiritCouncilDimensionLabels: Record<SpiritDimension, string> = {
  word: 'Palavra',
  emotion: 'Emoção',
  impulse: 'Impulso',
  body: 'Corpo percebido',
  action: 'Ação'
};

export const spiritCouncilVoiceOptions: { id: SpiritCouncilVoiceState; label: string; description: string }[] = [
  { id: 'speak', label: 'Falar', description: 'A dimensão participa com a frase fictícia apresentada.' },
  { id: 'pass', label: 'Passar', description: 'A dimensão não fala nesta rodada e continua presente.' },
  { id: 'unknown', label: 'Desconhecida', description: 'Nenhuma fala é inventada para a dimensão.' }
];

export const spiritCouncilDisagreementOptions: { id: SpiritCouncilDisagreement; label: string; description: string }[] = [
  { id: 'preserved', label: 'Discordância preservada', description: 'As diferenças permanecem registradas sem bloqueio ou punição.' },
  { id: 'none_identified', label: 'Nenhuma discordância identificada', description: 'O cenário parece convergir, sem garantia de certeza.' },
  { id: 'unknown', label: 'Não sei se há discordância', description: 'A incerteza permanece explícita.' }
];

export const spiritCouncilBasisOptions: { id: SpiritCouncilBasis; label: string; description: string }[] = [
  { id: 'shared_minimum', label: 'Mínimo compartilhado', description: 'Usar somente o menor ponto compatível entre as partes.' },
  { id: 'temporary_center', label: 'Centro temporário', description: 'Usar provisoriamente o centro criado na missão anterior.' },
  { id: 'none', label: 'Nenhuma base decisória', description: 'Adequado para adiar ou não decidir.' },
  { id: 'unknown', label: 'Base desconhecida', description: 'Registrar que ainda não existe fundamento suficiente.' }
];

export const spiritCouncilDecisionOptions: { id: SpiritCouncilDecision; label: string; description: string }[] = [
  { id: 'provisional', label: 'Decisão provisória', description: 'Escolher um passo fictício revisável, sem votação majoritária.' },
  { id: 'postpone', label: 'Adiar a decisão', description: 'Preservar todas as partes e retornar depois.' },
  { id: 'no_decision', label: 'Nenhuma decisão', description: 'Encerrar o conselho sem produzir uma orientação.' },
  { id: 'decline', label: 'Recusar o conselho', description: 'Concluir sem cenário, falas ou decisão.' }
];

export const spiritCouncilNodes: SymbolicNode[] = [
  {
    id: 'spirit_open_council_v1',
    name: 'Conselho Aberto',
    category: 'principle',
    description: 'Princípio autoral que preserva fala, silêncio, desconhecimento e discordância sem maioria obrigatória.',
    provenance: { id: 'spirit_open_council_ath', label: 'Síntese Athanor', class: 'ATH', explanation: 'Estrutura didática criada pela Tehkné Solutions.' }
  },
  {
    id: 'spirit_binah_council_v1',
    name: 'Binah',
    category: 'sefirah',
    description: 'Comparação opcional com discernimento e sustentação de diferenças, sem medir entendimento espiritual.',
    layer: 'kabbalah',
    fallbackNodeId: 'spirit_council_chamber_v1',
    provenance: { id: 'spirit_binah_council_cmp', label: 'Comparação temática', class: 'CMP', explanation: 'Binah aparece como arquitetura comparativa, não como conteúdo bíblico ou estágio espiritual.' }
  },
  {
    id: 'spirit_council_chamber_v1',
    name: 'Câmara do Conselho',
    category: 'athanor',
    description: 'Fallback autoral para sustentar diferentes perspectivas sem hierarquia fixa.',
    provenance: { id: 'spirit_council_chamber_ath', label: 'Fallback Athanor', class: 'ATH', explanation: 'Usado quando Cabala está desativada.' }
  },
  {
    id: 'spirit_ruach_voices_v1',
    name: 'Ruach · Sopro das Vozes',
    category: 'element',
    description: 'Comparação opcional com passagem e circulação de voz, sem atribuir entidade ou identidade espiritual.',
    layer: 'sefer',
    fallbackNodeId: 'spirit_breath_of_voices_v1',
    provenance: { id: 'spirit_ruach_voices_cmp', label: 'Comparação textual', class: 'CMP', explanation: 'Uso comparativo para circulação entre partes, separado da fonte bíblica.' }
  },
  {
    id: 'spirit_breath_of_voices_v1',
    name: 'Sopro das Vozes',
    category: 'athanor',
    description: 'Fallback autoral para permitir fala, passagem e desconhecimento.',
    provenance: { id: 'spirit_breath_of_voices_ath', label: 'Fallback Athanor', class: 'ATH', explanation: 'Usado quando Sefer está desativado.' }
  },
  {
    id: 'spirit_dui_council_v1',
    name: 'Dui · Lago',
    category: 'trigram',
    description: 'Comparação opcional com troca e abertura entre perspectivas, sem consulta oracular.',
    layer: 'iching',
    fallbackNodeId: 'spirit_open_table_v1',
    provenance: { id: 'spirit_dui_council_cmp', label: 'Comparação temática', class: 'CMP', explanation: 'Dui é usado como imagem de intercâmbio, sem previsão.' }
  },
  {
    id: 'spirit_open_table_v1',
    name: 'Mesa Aberta',
    category: 'athanor',
    description: 'Fallback autoral para um espaço em que nenhuma parte vence por contagem.',
    provenance: { id: 'spirit_open_table_ath', label: 'Fallback Athanor', class: 'ATH', explanation: 'Usado quando I Ching está desativado.' }
  },
  {
    id: 'spirit_temperance_council_v1',
    name: 'A Temperança',
    category: 'archetype',
    description: 'Arquétipo opcional de negociação e medida, sem leitura divinatória ou promessa de harmonia.',
    layer: 'tarot',
    fallbackNodeId: 'spirit_keeper_negotiation_v1',
    provenance: { id: 'spirit_temperance_council_cmp', label: 'Comparação arquetípica', class: 'CMP', explanation: 'Postura narrativa de negociação, sem função oracular.' }
  },
  {
    id: 'spirit_keeper_negotiation_v1',
    name: 'Guardiã da Negociação',
    category: 'athanor',
    description: 'Fallback autoral para ajustar propostas sem apagar discordâncias.',
    provenance: { id: 'spirit_keeper_negotiation_ath', label: 'Fallback Athanor', class: 'ATH', explanation: 'Usado quando Tarot está desativado.' }
  },
  {
    id: 'spirit_open_council_seal_v1',
    name: 'Selo do Conselho Aberto',
    category: 'athanor',
    description: 'Componente de gameplay que registra fala, passagem, desconhecimento, discordância e decisão provisória ou ausente.',
    provenance: { id: 'spirit_open_council_seal_ath', label: 'Componente Athanor', class: 'ATH', explanation: 'Item autoral sem função clínica, oracular ou espiritual.' }
  }
];
