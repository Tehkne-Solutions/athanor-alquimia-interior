import type { BiblicalUnit, SymbolicNode } from '../domain/types';
import type {
  FireExitChoice,
  FireIntervalChoice,
  FireTimelinePhase,
  FireUrgencyCategory
} from '../domain/fireInterval';

export interface FireTimelineEntry {
  id: string;
  text: string;
  suggestedPhase: FireTimelinePhase;
  explanation: string;
}

export interface FireUrgencyEntry {
  id: string;
  text: string;
  suggestedCategory: FireUrgencyCategory;
  explanation: string;
}

export const fireIntervalBiblicalUnit: BiblicalUnit = {
  id: 'proverb_interval_before_gesture_v1',
  reference: 'Provérbios 19:11',
  title: 'O intervalo pode mudar a forma da resposta',
  principle: 'Discernimento pode ampliar o intervalo entre intensidade e gesto, permitindo uma resposta mais proporcional.',
  context: 'O provérbio relaciona prudência, paciência e resposta. No Athanor, ele não exige tolerar violência, permanecer em risco ou ignorar limites necessários.',
  themes: ['prudência', 'intervalo', 'proporcionalidade', 'limite'],
  application: 'Observar uma sequência fictícia, distinguir tipos de urgência e escolher uma saída segura e reversível.',
  provenance: [{
    id: 'prov-fire-interval-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência bíblica inicia a missão; a formulação do princípio e o exercício são adaptações editoriais do Athanor.',
    sourceLabel: 'Provérbios 19:11'
  }]
};

export const fireTimelineEntries: FireTimelineEntry[] = [
  { id: 'timeline-trigger-1', text: 'Uma mensagem chega com uma cobrança inesperada.', suggestedPhase: 'trigger', explanation: 'O acontecimento inicia a sequência, mas ainda não determina a resposta.' },
  { id: 'timeline-body-1', text: 'Os ombros ficam tensos e a respiração parece mais curta.', suggestedPhase: 'body_signal', explanation: 'É uma descrição corporal fictícia, sem diagnóstico ou interpretação clínica.' },
  { id: 'timeline-impulse-1', text: 'Surge vontade de responder imediatamente em letras maiúsculas.', suggestedPhase: 'impulse', explanation: 'Vontade e gesto são etapas diferentes; reconhecer o impulso não obriga a executá-lo.' },
  { id: 'timeline-gesture-1', text: 'A pessoa envia uma resposta curta depois de pedir alguns minutos.', suggestedPhase: 'gesture', explanation: 'É uma ação observável realizada após um intervalo.' },
  { id: 'timeline-trigger-2', text: 'Uma tarefa é alterada pouco antes do prazo.', suggestedPhase: 'trigger', explanation: 'A mudança externa funciona como gatilho narrativo.' },
  { id: 'timeline-body-2', text: 'As mãos apertam o objeto que estava sobre a mesa.', suggestedPhase: 'body_signal', explanation: 'O exercício nomeia um sinal fictício sem concluir sua causa.' },
  { id: 'timeline-impulse-2', text: 'A primeira vontade é abandonar tudo e sair sem explicar.', suggestedPhase: 'impulse', explanation: 'Um impulso pode ser reconhecido, pausado ou substituído por uma saída mais segura.' },
  { id: 'timeline-gesture-2', text: 'A pessoa informa que precisa revisar o novo prazo antes de responder.', suggestedPhase: 'gesture', explanation: 'A ação cria tempo e comunica um limite próprio.' }
];

export const fireUrgencyEntries: FireUrgencyEntry[] = [
  { id: 'urgency-safety-1', text: 'Há risco físico imediato e uma saída segura está disponível.', suggestedCategory: 'immediate_safety', explanation: 'Segurança imediata tem prioridade sobre o exercício simbólico.' },
  { id: 'urgency-time-1', text: 'Um documento precisa ser enviado até o fim do expediente.', suggestedCategory: 'time_sensitive', explanation: 'Existe um prazo verificável, mas ainda pode haver espaço para organizar a resposta.' },
  { id: 'urgency-pressure-1', text: 'A mensagem diz “responda agora”, mas não apresenta prazo nem consequência verificável.', suggestedCategory: 'perceived_pressure', explanation: 'A linguagem produz pressão, porém não comprova urgência objetiva.' },
  { id: 'urgency-unknown-1', text: 'Não está claro se a decisão precisa ser tomada hoje.', suggestedCategory: 'insufficient_information', explanation: 'Pedir informação pode ser mais adequado do que presumir urgência.' },
  { id: 'urgency-safety-2', text: 'Uma pessoa está em emergência médica e o serviço de urgência pode ser acionado.', suggestedCategory: 'immediate_safety', explanation: 'O fluxo direto de ajuda deve substituir o simbolismo.' },
  { id: 'urgency-time-2', text: 'Uma reunião começa em quinze minutos e precisa de uma confirmação simples.', suggestedCategory: 'time_sensitive', explanation: 'O tempo é limitado e verificável; a resposta pode continuar breve e proporcional.' },
  { id: 'urgency-pressure-2', text: 'O pensamento “se eu não resolver tudo agora, tudo dará errado” aparece sem evidência suficiente.', suggestedCategory: 'perceived_pressure', explanation: 'O exercício não confirma a previsão e permite escolher um intervalo.' },
  { id: 'urgency-unknown-2', text: 'A solicitação usa palavras vagas e não informa quem será afetado.', suggestedCategory: 'insufficient_information', explanation: 'Faltam dados para classificar a situação como urgente.' }
];

export const fireIntervalOptions: Array<{ id: FireIntervalChoice; label: string; description: string }> = [
  { id: 'one_minute', label: 'Criar um minuto de intervalo', description: 'Pausar brevemente antes de selecionar qualquer resposta.' },
  { id: 'ask_for_time', label: 'Pedir tempo para responder', description: 'Comunicar que a resposta virá depois de uma verificação.' },
  { id: 'step_away', label: 'Afastar-se com segurança', description: 'Mudar de ambiente quando isso for seguro e possível.' },
  { id: 'write_without_sending', label: 'Escrever sem enviar', description: 'Organizar a primeira reação sem transformá-la em mensagem.' },
  { id: 'no_interval', label: 'Nenhum intervalo agora', description: 'Seguir sem registrar uma prática de pausa, sem perder progresso.' }
];

export const fireExitOptions: Array<{ id: FireExitChoice; label: string; description: string }> = [
  { id: 'leave_safely', label: 'Sair do ambiente com segurança', description: 'Priorizar distância física quando existe risco ou escalada.' },
  { id: 'contact_trusted_person', label: 'Contatar uma pessoa de confiança', description: 'Buscar presença ou apoio sem prometer resultado.' },
  { id: 'seek_emergency_support', label: 'Procurar apoio de emergência', description: 'Usar recursos diretos quando houver risco imediato.' },
  { id: 'delay_response', label: 'Adiar a resposta', description: 'Escolher não responder até haver mais contexto ou estabilidade.' },
  { id: 'no_action', label: 'Nenhuma ação agora', description: 'Concluir a prática sem executar uma ação externa.' }
];

export const fireIntervalNodes: SymbolicNode[] = [
  {
    id: 'gevurah_interval_v1', name: 'Gevurah', category: 'sefirah', layer: 'kabbalah', fallbackNodeId: 'limit_chamber_interval_v1',
    description: 'Camada opcional de limite, contenção e responsabilidade sobre a própria ação.',
    provenance: { id: 'prov-gevurah-interval-v1', label: 'Comparação temática', class: 'CMP', explanation: 'Aplicação comparativa do Athanor; não é conteúdo do texto de Provérbios.' }
  },
  {
    id: 'limit_chamber_interval_v1', name: 'Câmara do Instante', category: 'athanor',
    description: 'Fallback autoral para o espaço entre intensidade, escolha e gesto.',
    provenance: { id: 'prov-limit-chamber-interval-v1', label: 'Síntese Athanor', class: 'ATH', explanation: 'Estrutura de gameplay criada pela Tehkné Solutions.' }
  },
  {
    id: 'gen_interval_v1', name: 'Gen · Montanha', category: 'trigram', layer: 'iching', fallbackNodeId: 'stillness_movement_interval_v1',
    description: 'Comparação opcional com pausa, quietude e limite de movimento.',
    provenance: { id: 'prov-gen-interval-v1', label: 'Comparação temática', class: 'CMP', explanation: 'O uso no intervalo da missão é uma comparação de gameplay, não uma previsão.' }
  },
  {
    id: 'stillness_movement_interval_v1', name: 'Movimento da Pausa', category: 'athanor',
    description: 'Fallback autoral para interromper uma sequência antes do gesto.',
    provenance: { id: 'prov-stillness-interval-v1', label: 'Síntese Athanor', class: 'ATH', explanation: 'Movimento autoral sem função oracular.' }
  },
  {
    id: 'temperance_interval_v1', name: 'A Temperança', category: 'archetype', layer: 'tarot', fallbackNodeId: 'keeper_measure_interval_v1',
    description: 'Arquétipo opcional de proporção, mistura e ajuste de intensidade.',
    provenance: { id: 'prov-temperance-interval-v1', label: 'Comparação arquetípica', class: 'CMP', explanation: 'A carta não determina identidade, decisão ou resultado.' }
  },
  {
    id: 'keeper_measure_interval_v1', name: 'Guardiã da Medida', category: 'athanor',
    description: 'Fallback autoral para escolher forma, limite e momento da ação.',
    provenance: { id: 'prov-keeper-measure-interval-v1', label: 'Síntese Athanor', class: 'ATH', explanation: 'Arquétipo autoral do Athanor.' }
  },
  {
    id: 'interval_ember_v1', name: 'Brasa do Intervalo', category: 'athanor',
    description: 'Componente que registra a conclusão didática da linha temporal, do intervalo e da saída segura.',
    provenance: { id: 'prov-interval-ember-v1', label: 'Componente Athanor', class: 'ATH', explanation: 'Não prova autocontrole, calma, coragem ou melhora clínica.' }
  }
];
