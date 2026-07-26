import type { BiblicalUnit, SymbolicNode } from '../domain/types';
import type {
  SpiritOrbDecision,
  SpiritOrbDisagreement,
  SpiritOrbFunction,
  SpiritOrbReturn,
  SpiritOrbReviewWindow,
  SpiritOrbVisibleDimension
} from '../domain/spiritOrb';

export const spiritOrbBiblicalUnit: BiblicalUnit = {
  id: 'psalm_possible_integration_orb_v1',
  reference: 'Salmos 133:1',
  title: 'Partes reunidas sem unidade forçada',
  principle: 'Reunir partes em um mesmo espaço pode preservar diferenças, pausas e discordâncias sem exigir harmonia total.',
  context: 'O salmo celebra a convivência em unidade. O Athanor usa essa imagem editorialmente para um item fictício que mantém partes juntas sem afirmar consenso, pureza, iluminação ou aprovação espiritual.',
  themes: ['reunião', 'diferença', 'presença', 'revisão', 'retorno'],
  application: 'Reunir os cinco componentes do Espírito em uma fórmula temporária, revisável e sem coerência obrigatória.',
  provenance: [{
    id: 'spirit-orb-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia a receita. O Orbe, seus componentes e seu ciclo são adaptações editoriais e de gameplay.',
    sourceLabel: 'Salmos 133:1'
  }]
};

export const spiritOrbRecipe = {
  id: 'recipe_possible_integration_orb_v1',
  name: 'Orbe da Integração Possível',
  componentIds: [
    'possible_synthesis_thread_v1',
    'provisional_center_knot_v1',
    'open_council_seal_v1',
    'revisable_decision_mark_v1',
    'possible_return_key_v1'
  ],
  principle: 'Reunir síntese, centro provisório, conselho aberto, decisão revisável e retorno possível sem apagar diferenças ou criar obrigação.',
  restrictions: [
    'Não mede coerência, maturidade, pureza ou elevação espiritual',
    'Não transforma uma dimensão em autoridade permanente',
    'Não exige consenso, decisão, retorno ou ação externa',
    'Não produz diagnóstico, leitura oculta, oráculo ou previsão',
    'Não executa mensagens, tarefas, compromissos ou revisões externas',
    'Não conclui o capítulo sem revisão própria'
  ],
  version: '1.0.0'
};

export const spiritOrbFunctions: Array<{ id: SpiritOrbFunction; label: string; description: string }> = [
  { id: 'hold_parts_together', label: 'Manter as partes reunidas', description: 'Preservar as cinco dimensões no mesmo campo sem exigir concordância.' },
  { id: 'keep_center_provisional', label: 'Guardar um centro provisório', description: 'Manter um foco temporário que pode ser trocado ou removido.' },
  { id: 'preserve_open_council', label: 'Preservar o conselho aberto', description: 'Registrar vozes, passagens, silêncios e discordâncias sem maioria.' },
  { id: 'carry_revisable_decision', label: 'Carregar uma decisão revisável', description: 'Manter uma decisão limitada, retirada ou ausente sem promessa.' },
  { id: 'keep_return_possible', label: 'Guardar a possibilidade de retorno', description: 'Permitir revisão futura, arquivo ou não retomada.' },
  { id: 'no_external_action', label: 'Nenhuma ação externa', description: 'Usar o Orbe apenas como registro de gameplay.' }
];

export const spiritOrbVisibleDimensions: Array<{ id: SpiritOrbVisibleDimension; label: string; description: string }> = [
  { id: 'word', label: 'Palavra inicialmente visível', description: 'A linguagem recebe atenção temporária sem se tornar autoridade.' },
  { id: 'emotion', label: 'Emoção inicialmente visível', description: 'A emoção é reconhecida sem definir todo o conjunto.' },
  { id: 'impulse', label: 'Impulso inicialmente visível', description: 'O impulso permanece informação, não ordem.' },
  { id: 'body', label: 'Corpo percebido inicialmente visível', description: 'A percepção corporal é registrada sem diagnóstico.' },
  { id: 'action', label: 'Ação inicialmente visível', description: 'Uma possibilidade de ação aparece sem obrigação de execução.' },
  { id: 'none_visible', label: 'Nenhuma dimensão visível agora', description: 'O Orbe pode existir sem centro ou destaque inicial.' }
];

export const spiritOrbDisagreements: Array<{ id: SpiritOrbDisagreement; label: string; description: string }> = [
  { id: 'preserved', label: 'Discordância preservada', description: 'As diferenças permanecem registradas no item.' },
  { id: 'not_identified', label: 'Nenhuma discordância identificada', description: 'Ausência observada sem afirmar consenso total.' },
  { id: 'unknown', label: 'Discordância desconhecida', description: 'Nenhuma interpretação é inventada.' }
];

export const spiritOrbDecisions: Array<{ id: SpiritOrbDecision; label: string; description: string }> = [
  { id: 'provisional', label: 'Decisão provisória', description: 'Uma decisão limitada continua aberta à revisão.' },
  { id: 'withdrawn', label: 'Decisão retirada', description: 'A retirada permanece válida e não é tratada como falha.' },
  { id: 'none', label: 'Nenhuma decisão', description: 'O item não exige compromisso.' },
  { id: 'unknown', label: 'Estado da decisão desconhecido', description: 'A incerteza permanece explícita.' }
];

export const spiritOrbReturns: Array<{ id: SpiritOrbReturn; label: string; description: string }> = [
  { id: 'available', label: 'Retorno disponível', description: 'A revisão pode ocorrer, mas não é obrigatória.' },
  { id: 'conditional', label: 'Retorno condicionado ao contexto', description: 'Retornar somente se uma condição percebida mudar.' },
  { id: 'archived', label: 'Retorno arquivado', description: 'O registro permanece sem retomada prevista.' },
  { id: 'none', label: 'Nenhum retorno agora', description: 'Encerrar sem criar obrigação futura.' },
  { id: 'unknown', label: 'Possibilidade de retorno desconhecida', description: 'Nenhuma previsão é criada.' }
];

export const spiritOrbReviewWindows: Array<{ id: SpiritOrbReviewWindow; label: string; description: string }> = [
  { id: 'after_one_step', label: 'Após um passo fictício', description: 'Revisar depois de uma única unidade, sem execução automática.' },
  { id: 'when_context_changes', label: 'Quando o contexto mudar', description: 'Retornar somente diante de mudança percebida.' },
  { id: 'three_days', label: 'Em três dias', description: 'Janela narrativa sem lembrete ou calendário externo.' },
  { id: 'when_ready', label: 'Quando eu decidir retornar', description: 'Sem prazo obrigatório.' }
];

export const spiritOrbComponentLabels: Record<string, string> = {
  possible_synthesis_thread_v1: 'Fio da Síntese Possível',
  provisional_center_knot_v1: 'Nó do Centro Provisório',
  open_council_seal_v1: 'Selo do Conselho Aberto',
  revisable_decision_mark_v1: 'Marca da Decisão Revisável',
  possible_return_key_v1: 'Chave do Retorno Possível'
};

export const spiritOrbNodes: SymbolicNode[] = [
  {
    id: 'spirit_tiferet_orb_v1', name: 'Tiferet · Relação entre partes', category: 'sefirah', layer: 'kabbalah', fallbackNodeId: 'spirit_orb_center_v1',
    description: 'Comparação opcional com relação e proporção, sem medir equilíbrio espiritual.',
    provenance: { id: 'spirit-tiferet-orb-cmp', label: 'Comparação temática', class: 'CMP', explanation: 'Arquitetura comparativa; não é conteúdo do Salmo.' }
  },
  {
    id: 'spirit_orb_center_v1', name: 'Centro do Orbe', category: 'athanor',
    description: 'Fallback autoral para manter as partes reunidas sem centro obrigatório.',
    provenance: { id: 'spirit-orb-center-ath', label: 'Fallback Athanor', class: 'ATH', explanation: 'Estrutura criada pela Tehkné Solutions.' }
  },
  {
    id: 'spirit_ruach_orb_v1', name: 'Ruach · Sopro entre partes', category: 'element', layer: 'sefer', fallbackNodeId: 'spirit_orb_breath_v1',
    description: 'Comparação opcional com movimento e transição, sem atribuir identidade espiritual.',
    provenance: { id: 'spirit-ruach-orb-cmp', label: 'Comparação textual', class: 'CMP', explanation: 'Uso comparativo para circulação entre estados.' }
  },
  {
    id: 'spirit_orb_breath_v1', name: 'Sopro do Conjunto', category: 'athanor',
    description: 'Fallback autoral para alternar atenção, decisão e retorno.',
    provenance: { id: 'spirit-orb-breath-ath', label: 'Fallback Athanor', class: 'ATH', explanation: 'Movimento criado para o gameplay.' }
  },
  {
    id: 'spirit_li_orb_v1', name: 'Li · Fogo', category: 'trigram', layer: 'iching', fallbackNodeId: 'spirit_orb_visibility_v1',
    description: 'Comparação opcional com visibilidade temporária, sem consulta oracular ou previsão.',
    provenance: { id: 'spirit-li-orb-cmp', label: 'Comparação temática', class: 'CMP', explanation: 'Li é usado como metáfora de visibilidade, não como oráculo.' }
  },
  {
    id: 'spirit_orb_visibility_v1', name: 'Luz Provisória', category: 'athanor',
    description: 'Fallback autoral para destacar uma dimensão sem apagar as demais.',
    provenance: { id: 'spirit-orb-visibility-ath', label: 'Fallback Athanor', class: 'ATH', explanation: 'Estrutura autoral de atenção temporária.' }
  },
  {
    id: 'spirit_world_orb_v1', name: 'O Mundo', category: 'archetype', layer: 'tarot', fallbackNodeId: 'spirit_orb_keeper_v1',
    description: 'Arquétipo opcional de conjunto e fechamento, sem representar completude pessoal.',
    provenance: { id: 'spirit-world-orb-cmp', label: 'Comparação arquetípica', class: 'CMP', explanation: 'A carta não produz leitura, destino ou estágio espiritual.' }
  },
  {
    id: 'spirit_orb_keeper_v1', name: 'Guardiã do Conjunto Possível', category: 'athanor',
    description: 'Fallback autoral para preservar partes, discordâncias e revisão.',
    provenance: { id: 'spirit-orb-keeper-ath', label: 'Fallback Athanor', class: 'ATH', explanation: 'Arquétipo autoral do Athanor.' }
  },
  {
    id: 'possible_integration_orb_v1', name: 'Orbe da Integração Possível', category: 'athanor',
    description: 'Item de gameplay que reúne os cinco componentes do Espírito sem exigir coerência ou conclusão.',
    provenance: { id: 'spirit-orb-item-ath', label: 'Item Athanor', class: 'ATH', explanation: 'Não representa iluminação, cura, pureza ou integração espiritual alcançada.' }
  }
];
