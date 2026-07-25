import type { BiblicalUnit, SymbolicNode } from '../domain/types';
import type {
  FireCourageAction,
  FireCourageContext,
  FireCourageReadiness,
  FireCourageResource,
  FireCourageStatementCategory
} from '../domain/fireCourage';

export interface FireCourageStatement {
  id: string;
  text: string;
  suggestedCategory: FireCourageStatementCategory;
  explanation: string;
}

export interface FireCourageActionOption {
  id: FireCourageAction;
  label: string;
  description: string;
  scale: 0 | 1 | 2 | 3;
}

export const fireCourageBiblicalUnit: BiblicalUnit = {
  id: 'proverb_proportional_courage_v1',
  reference: 'Provérbios 14:15',
  title: 'Considerar os passos antes de avançar',
  principle: 'Coragem proporcional considera contexto, recursos e consequências antes de escolher a menor ação suficiente.',
  context: 'O provérbio diferencia credulidade de atenção aos próprios passos. No Athanor, essa referência não exige exposição ao perigo, confronto imediato ou prova pública de coragem.',
  themes: ['coragem', 'prudência', 'proporcionalidade', 'apoio'],
  application: 'Distinguir coragem, exposição imprudente, evasão e pressão externa e escolher uma ação segura e reversível.',
  provenance: [{
    id: 'prov-fire-courage-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia a missão; a escala de ações e a Marca são adaptações editoriais e de gameplay do Athanor.',
    sourceLabel: 'Provérbios 14:15'
  }]
};

export const fireCourageStatements: FireCourageStatement[] = [
  { id: 'courage-1', text: 'Preparar dois pontos e pedir um horário para conversar.', suggestedCategory: 'proportional_courage', explanation: 'A ação possui preparação, limite e possibilidade de revisão.' },
  { id: 'exposure-1', text: 'Entrar sozinho em um local de risco para provar que não sente medo.', suggestedCategory: 'imprudent_exposure', explanation: 'Exposição ao risco não é requisito de coragem.' },
  { id: 'avoidance-1', text: 'Cancelar toda conversa difícil sem observar contexto ou alternativas.', suggestedCategory: 'avoidance', explanation: 'Evitar sempre pode impedir escolhas graduais e apoiadas.' },
  { id: 'pressure-1', text: 'Se você fosse realmente corajoso, responderia agora.', suggestedCategory: 'external_pressure', explanation: 'A frase usa julgamento externo para pressionar uma ação imediata.' },
  { id: 'courage-2', text: 'Pedir informação antes de decidir se aceita uma nova tarefa.', suggestedCategory: 'proportional_courage', explanation: 'Buscar contexto pode ser a menor ação suficiente.' },
  { id: 'exposure-2', text: 'Confrontar uma pessoa agressiva sem apoio porque recuar pareceria fraqueza.', suggestedCategory: 'imprudent_exposure', explanation: 'Segurança e apoio têm prioridade sobre a aparência de bravura.' },
  { id: 'avoidance-2', text: 'Adiar indefinidamente uma resposta simples mesmo com tempo e apoio disponíveis.', suggestedCategory: 'avoidance', explanation: 'A frase descreve adiamento contínuo, não uma pausa deliberada.' },
  { id: 'pressure-2', text: 'Todos esperam que você faça isso, então não pode recusar.', suggestedCategory: 'external_pressure', explanation: 'Expectativa externa não elimina autonomia ou necessidade de limite.' }
];

export const fireCourageContextOptions: Array<{ id: FireCourageContext; label: string; description: string }> = [
  { id: 'clarify_request', label: 'Esclarecer uma solicitação', description: 'Buscar contexto antes de aceitar, responder ou agir.' },
  { id: 'communicate_boundary', label: 'Comunicar um limite', description: 'Apresentar uma ação própria já estruturada na missão anterior.' },
  { id: 'decline_commitment', label: 'Recusar um compromisso', description: 'Não assumir algo que não cabe ou não é seguro agora.' },
  { id: 'request_support', label: 'Pedir apoio', description: 'Solicitar presença, informação ou acompanhamento apropriado.' },
  { id: 'leave_risk', label: 'Sair de uma situação de risco', description: 'Priorizar distância e ajuda direta quando necessário.' }
];

export const fireCourageActionOptions: FireCourageActionOption[] = [
  { id: 'delay_action', label: 'Adiar a ação', description: 'Criar tempo para obter contexto ou reduzir pressão.', scale: 0 },
  { id: 'no_action', label: 'Nenhuma ação agora', description: 'Concluir a prática sem executar uma ação externa.', scale: 0 },
  { id: 'prepare_points', label: 'Preparar os pontos principais', description: 'Organizar o que precisa ser comunicado antes do contato.', scale: 1 },
  { id: 'ask_for_information', label: 'Pedir uma informação', description: 'Buscar um dado verificável antes de decidir.', scale: 1 },
  { id: 'request_time', label: 'Pedir tempo', description: 'Comunicar que a resposta será dada depois.', scale: 1 },
  { id: 'send_brief_message', label: 'Enviar uma mensagem breve', description: 'Dar um primeiro passo limitado e reversível.', scale: 2 },
  { id: 'decline_request', label: 'Recusar a solicitação', description: 'Comunicar que o compromisso não será assumido.', scale: 2 },
  { id: 'supported_conversation', label: 'Realizar uma conversa com apoio', description: 'Conversar com preparação, local adequado ou presença de apoio.', scale: 3 },
  { id: 'leave_safely', label: 'Sair com segurança', description: 'Priorizar distância e apoio direto diante de risco.', scale: 1 }
];

export const fireCourageResourceOptions: Array<{ id: FireCourageResource; label: string; description: string }> = [
  { id: 'trusted_person', label: 'Pessoa de confiança', description: 'Presença ou contato que pode acompanhar a ação.' },
  { id: 'verified_information', label: 'Informação verificável', description: 'Contexto suficiente para reduzir suposições.' },
  { id: 'time', label: 'Tempo disponível', description: 'Uma janela que permite preparar ou revisar a ação.' },
  { id: 'safe_place', label: 'Lugar mais seguro', description: 'Ambiente que reduz exposição e facilita saída.' },
  { id: 'professional_support', label: 'Apoio profissional', description: 'Recurso especializado apropriado à situação.' },
  { id: 'previous_experience', label: 'Experiência anterior', description: 'Aprendizado prático já disponível para consulta.' },
  { id: 'none_available', label: 'Nenhum recurso disponível agora', description: 'A ausência de recurso não reduz progresso nem obriga ação.' }
];

export const fireCourageReadinessOptions: Array<{ id: FireCourageReadiness; label: string; description: string }> = [
  { id: 'smallest_sufficient', label: 'Esta é a menor ação suficiente', description: 'A escolha atual já atende ao objetivo sem ampliar exposição.' },
  { id: 'prepare_first', label: 'Preciso preparar antes', description: 'A ação pode esperar até existir mais recurso ou contexto.' },
  { id: 'delay', label: 'Vou adiar por enquanto', description: 'Adiar é uma decisão válida e revisável.' },
  { id: 'decline', label: 'Vou recusar esta ação', description: 'Recusar pode ser a escolha proporcional ao contexto.' }
];

export const fireCourageNodes: SymbolicNode[] = [
  {
    id: 'netzach_courage_v1', name: 'Netzach', category: 'sefirah', layer: 'kabbalah', fallbackNodeId: 'courage_arena_v1',
    description: 'Camada opcional de iniciativa, persistência e movimento orientado.',
    provenance: { id: 'prov-netzach-courage-v1', label: 'Comparação temática', class: 'CMP', explanation: 'Comparação do Athanor; não é conteúdo de Provérbios.' }
  },
  {
    id: 'courage_arena_v1', name: 'Arena da Coragem', category: 'athanor',
    description: 'Fallback autoral para comparar ações por segurança, apoio e reversibilidade.',
    provenance: { id: 'prov-courage-arena-v1', label: 'Síntese Athanor', class: 'ATH', explanation: 'Estrutura de gameplay criada pela Tehkné Solutions.' }
  },
  {
    id: 'zhen_courage_v1', name: 'Zhen · Trovão', category: 'trigram', layer: 'iching', fallbackNodeId: 'first_step_courage_v1',
    description: 'Comparação opcional com início de movimento após preparação.',
    provenance: { id: 'prov-zhen-courage-v1', label: 'Comparação temática', class: 'CMP', explanation: 'O uso é comparativo e não possui função de previsão.' }
  },
  {
    id: 'first_step_courage_v1', name: 'Movimento do Primeiro Passo', category: 'athanor',
    description: 'Fallback autoral para uma ação pequena, segura e revisável.',
    provenance: { id: 'prov-first-step-courage-v1', label: 'Síntese Athanor', class: 'ATH', explanation: 'Movimento criado para o gameplay.' }
  },
  {
    id: 'strength_courage_v1', name: 'A Força', category: 'archetype', layer: 'tarot', fallbackNodeId: 'serene_power_keeper_v1',
    description: 'Arquétipo opcional de potência orientada por medida, sem repressão ou exposição obrigatória.',
    provenance: { id: 'prov-strength-courage-v1', label: 'Comparação arquetípica', class: 'CMP', explanation: 'A carta não define identidade, coragem ou resultado.' }
  },
  {
    id: 'serene_power_keeper_v1', name: 'Guardião da Potência Serena', category: 'athanor',
    description: 'Fallback autoral para preparar, agir, recuar ou recusar proporcionalmente.',
    provenance: { id: 'prov-serene-power-v1', label: 'Síntese Athanor', class: 'ATH', explanation: 'Arquétipo autoral do Athanor.' }
  },
  {
    id: 'proportional_courage_mark_v1', name: 'Marca da Coragem Proporcional', category: 'athanor',
    description: 'Componente que registra contexto, menor ação suficiente e recursos considerados.',
    provenance: { id: 'prov-courage-mark-v1', label: 'Componente Athanor', class: 'ATH', explanation: 'Não prova bravura, superação, segurança ou melhora clínica.' }
  }
];
