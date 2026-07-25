import type { BiblicalUnit, SymbolicNode } from '../domain/types';
import type {
  FireShieldDuration,
  FireShieldFunction,
  FireShieldIntensity,
  FireShieldReviewWindow,
  FireShieldSupport
} from '../domain/fireShield';

export const fireShieldBiblicalUnit: BiblicalUnit = {
  id: 'proverb_just_boundary_shield_v1',
  reference: 'Provérbios 25:28',
  title: 'Estrutura para a resposta',
  principle: 'Limites podem organizar a própria resposta sem controlar terceiros ou prometer proteção absoluta.',
  context: 'O provérbio utiliza a imagem de uma cidade sem muros. No Athanor, a metáfora é aplicada somente a escolhas próprias, pausas, apoio e revisão; não representa proteção espiritual, física ou clínica.',
  themes: ['limite', 'estrutura', 'autogoverno', 'revisão'],
  application: 'Reunir os cinco componentes do Fogo em uma função limitada, apoiada e revisável.',
  provenance: [{
    id: 'prov-fire-shield-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia a receita; as opções, estados e o Escudo são adaptações editoriais e de gameplay do Athanor.',
    sourceLabel: 'Provérbios 25:28'
  }]
};

export const fireShieldRecipe = {
  id: 'recipe_just_boundary_shield_v1',
  name: 'Escudo do Limite Justo',
  componentIds: [
    'named_flame_v1',
    'interval_ember_v1',
    'boundary_plate_v1',
    'proportional_courage_mark_v1',
    'transformed_metal_v1'
  ],
  principle: 'Reunir intensidade, intervalo, limite, coragem proporcional e transformação em uma estrutura revisável.',
  restrictions: [
    'Não oferece proteção física, espiritual ou clínica',
    'Não controla ou pune terceiros',
    'Não autoriza confronto ou permanência em risco',
    'Não comprova autocontrole, coragem ou melhora',
    'Não executa ações externas'
  ],
  version: '1.0.0'
};

export const fireShieldFunctions: Array<{ id: FireShieldFunction; label: string; description: string }> = [
  { id: 'protect_pause', label: 'Proteger uma pausa', description: 'Reservar um intervalo antes de responder ou decidir.' },
  { id: 'support_boundary', label: 'Sustentar um limite', description: 'Manter uma ação própria já definida sem controlar terceiros.' },
  { id: 'organize_response', label: 'Organizar uma resposta', description: 'Reunir contexto, medida e possibilidade de revisão.' },
  { id: 'hold_transformation', label: 'Conter uma transformação', description: 'Manter uma mudança pequena dentro das salvaguardas escolhidas.' },
  { id: 'no_external_action', label: 'Nenhuma ação externa', description: 'Usar a receita somente como registro de gameplay.' }
];

export const fireShieldIntensities: Array<{ id: FireShieldIntensity; label: string; description: string }> = [
  { id: 'low', label: 'Baixa intensidade', description: 'Aplicação discreta, curta e facilmente reversível.' },
  { id: 'moderate', label: 'Intensidade moderada', description: 'Aplicação limitada com pausa, apoio ou revisão definidos.' },
  { id: 'high', label: 'Intensidade alta percebida', description: 'Exige mais cautela e não autoriza exposição, confronto ou ação imediata.' }
];

export const fireShieldSupports: Array<{ id: FireShieldSupport; label: string; description: string }> = [
  { id: 'trusted_person', label: 'Pessoa de confiança', description: 'Presença ou contato real disponível para apoio.' },
  { id: 'verified_information', label: 'Informação verificável', description: 'Contexto suficiente para reduzir suposições.' },
  { id: 'safe_place', label: 'Lugar mais seguro', description: 'Ambiente que facilite pausa ou saída.' },
  { id: 'professional_support', label: 'Apoio profissional', description: 'Recurso especializado apropriado ao contexto.' },
  { id: 'time', label: 'Tempo disponível', description: 'Uma janela para preparar ou revisar.' },
  { id: 'none_available', label: 'Nenhum apoio disponível agora', description: 'A ausência de apoio não reduz progresso e pode justificar não agir.' }
];

export const fireShieldDurations: Array<{ id: FireShieldDuration; label: string; description: string }> = [
  { id: 'one_interaction', label: 'Durante uma interação', description: 'Encerrar o uso quando a interação terminar.' },
  { id: 'until_tomorrow', label: 'Até amanhã', description: 'Manter a estrutura somente até o próximo dia.' },
  { id: 'three_days', label: 'Por três dias', description: 'Aplicar por um ciclo curto e revisar.' },
  { id: 'seven_days', label: 'Por sete dias', description: 'Definir um período limitado, sem renovação automática.' },
  { id: 'until_review', label: 'Até a revisão', description: 'Manter somente até uma revisão explícita.' }
];

export const fireShieldReviewWindows: Array<{ id: FireShieldReviewWindow; label: string; description: string }> = [
  { id: 'later_today', label: 'Mais tarde hoje', description: 'Revisar no mesmo dia.' },
  { id: 'tomorrow', label: 'Amanhã', description: 'Revisar depois de uma mudança de contexto.' },
  { id: 'three_days', label: 'Em três dias', description: 'Revisar após um ciclo curto.' },
  { id: 'seven_days', label: 'Em sete dias', description: 'Revisar antes de qualquer continuidade.' },
  { id: 'when_ready', label: 'Quando eu decidir retornar', description: 'Manter a revisão sem prazo obrigatório.' }
];

export const fireShieldComponentLabels: Record<string, string> = {
  named_flame_v1: 'Chama Nomeada',
  interval_ember_v1: 'Brasa do Intervalo',
  boundary_plate_v1: 'Placa do Limite',
  proportional_courage_mark_v1: 'Marca da Coragem Proporcional',
  transformed_metal_v1: 'Metal Transformado'
};

export const fireShieldNodes: SymbolicNode[] = [
  {
    id: 'gevurah_shield_v1', name: 'Gevurah', category: 'sefirah', layer: 'kabbalah', fallbackNodeId: 'shield_hall_v1',
    description: 'Camada opcional de limite, responsabilidade e contenção proporcional.',
    provenance: { id: 'prov-gevurah-shield-v1', label: 'Comparação temática', class: 'CMP', explanation: 'Comparação do Athanor; não é conteúdo de Provérbios.' }
  },
  {
    id: 'shield_hall_v1', name: 'Salão do Escudo', category: 'athanor',
    description: 'Fallback autoral para organizar função, apoio, duração e revisão.',
    provenance: { id: 'prov-shield-hall-v1', label: 'Síntese Athanor', class: 'ATH', explanation: 'Estrutura criada pela Tehkné Solutions.' }
  },
  {
    id: 'gen_shield_v1', name: 'Gen · Montanha', category: 'trigram', layer: 'iching', fallbackNodeId: 'measured_pause_shield_v1',
    description: 'Comparação opcional com pausa e delimitação, sem função de previsão.',
    provenance: { id: 'prov-gen-shield-v1', label: 'Comparação temática', class: 'CMP', explanation: 'Uso comparativo do Athanor.' }
  },
  {
    id: 'measured_pause_shield_v1', name: 'Movimento da Pausa Medida', category: 'athanor',
    description: 'Fallback autoral para interromper, observar e revisar.',
    provenance: { id: 'prov-measured-pause-shield-v1', label: 'Síntese Athanor', class: 'ATH', explanation: 'Movimento criado para o gameplay.' }
  },
  {
    id: 'temperance_shield_v1', name: 'A Temperança', category: 'archetype', layer: 'tarot', fallbackNodeId: 'guardian_measure_shield_v1',
    description: 'Arquétipo opcional de proporção e ajuste, sem garantir equilíbrio.',
    provenance: { id: 'prov-temperance-shield-v1', label: 'Comparação arquetípica', class: 'CMP', explanation: 'A carta não define identidade ou resultado.' }
  },
  {
    id: 'guardian_measure_shield_v1', name: 'Guardiã da Medida', category: 'athanor',
    description: 'Fallback autoral para sustentar limites revisáveis.',
    provenance: { id: 'prov-guardian-measure-shield-v1', label: 'Síntese Athanor', class: 'ATH', explanation: 'Arquétipo autoral do Athanor.' }
  },
  {
    id: 'just_boundary_shield_v1', name: 'Escudo do Limite Justo', category: 'athanor',
    description: 'Item de gameplay que reúne cinco componentes do Fogo em uma estrutura revisável.',
    provenance: { id: 'prov-just-boundary-shield-v1', label: 'Item Athanor', class: 'ATH', explanation: 'Não oferece proteção externa nem comprova autocontrole.' }
  }
];
