import type { NewWorkStartPoint } from '../domain/continuousJourney';
import { deriveContinuousTrailVariantIndex } from '../domain/continuousTrail';
import type { BiblicalUnit } from '../domain/types';

export interface ContinuousTrailPracticeOption {
  id: string;
  startPoint: NewWorkStartPoint;
  label: string;
  description: string;
}

export interface ContinuousTrailVariant {
  id: string;
  startPoint: NewWorkStartPoint;
  orientation: string;
  observation: string;
  review: string;
}

export const continuousTrailBiblicalUnit: BiblicalUnit = {
  id: 'psalm_continuous_trail_v1',
  reference: 'Salmos 119:105',
  title: 'Uma luz para o passo não precisa revelar o caminho inteiro',
  principle: 'A atenção pode alcançar um passo de cada vez sem transformar a jornada em previsão, obrigação ou certeza total.',
  context: 'O salmo usa a imagem da luz para o caminho. O Athanor aplica essa imagem editorialmente a etapas curtas e revisáveis, sem afirmar direção divina específica, promessa de acerto ou leitura do futuro.',
  themes: ['passo', 'atenção', 'orientação', 'limite', 'continuidade'],
  application: 'Percorrer orientação, observação e revisão com conteúdo curado, podendo passar, pausar ou permanecer sem prática.',
  provenance: [{
    id: 'prov-continuous-trail-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia a reflexão; práticas, variantes e estados são estruturas autorais do Athanor.',
    sourceLabel: 'Salmos 119:105'
  }]
};

export const continuousTrailPractices: ContinuousTrailPracticeOption[] = [
  { id: 'word-observe-terms', startPoint: 'word', label: 'Observar termos de uma frase fictícia', description: 'Distinguir palavras centrais sem decidir uma aplicação pessoal.' },
  { id: 'word-rephrase-fiction', startPoint: 'word', label: 'Reformular uma fala fictícia', description: 'Criar uma versão mais clara sem enviar mensagem ou assumir compromisso.' },
  { id: 'water-name-tone', startPoint: 'water', label: 'Nomear o tom de uma cena fictícia', description: 'Selecionar uma tonalidade emocional entre opções curadas.' },
  { id: 'water-notice-support', startPoint: 'water', label: 'Observar um recurso de apoio fictício', description: 'Reconhecer apoio possível sem consultar contatos ou situações reais.' },
  { id: 'fire-notice-interval', startPoint: 'fire', label: 'Observar o intervalo antes de um gesto', description: 'Distinguir impulso e ação em um cenário inteiramente fictício.' },
  { id: 'fire-compare-boundary', startPoint: 'fire', label: 'Comparar limite e controle', description: 'Classificar duas formulações fictícias sem orientar confronto.' },
  { id: 'earth-scan-resource', startPoint: 'earth', label: 'Verificar um recurso fictício', description: 'Observar tempo, espaço ou material sem medir produtividade.' },
  { id: 'earth-small-unit', startPoint: 'earth', label: 'Escolher uma unidade pequena', description: 'Selecionar o menor passo reversível em uma oficina fictícia.' },
  { id: 'spirit-view-dimensions', startPoint: 'spirit', label: 'Observar cinco dimensões fictícias', description: 'Ver Palavra, Emoção, Impulso, Corpo e Ação sem pontuar coerência.' },
  { id: 'spirit-preserve-difference', startPoint: 'spirit', label: 'Preservar uma diferença', description: 'Registrar que duas partes fictícias não precisam concordar.' },
  { id: 'rest-remain-without-practice', startPoint: 'rest', label: 'Permanecer sem prática', description: 'Manter repouso sem converter pausa em tarefa ou produtividade.' }
];

export const continuousTrailVariants: ContinuousTrailVariant[] = [
  { id: 'word-trail-v1', startPoint: 'word', orientation: 'Observe uma placa fictícia com duas palavras centrais e escolha apenas o que merece atenção inicial.', observation: 'Note como a ordem das palavras altera a leitura, sem decidir qual versão é correta.', review: 'Registre se a formulação ficou mais clara, permaneceu aberta ou não foi observada.' },
  { id: 'word-trail-v2', startPoint: 'word', orientation: 'Considere uma fala curta de personagem fictício e identifique seu termo mais concreto.', observation: 'Compare uma versão direta e outra ambígua sem interpretar intenção oculta.', review: 'Revise se vale preservar, reformular ou simplesmente passar pela frase.' },
  { id: 'water-trail-v1', startPoint: 'water', orientation: 'Observe uma cena fictícia de espera e escolha uma tonalidade emocional possível.', observation: 'Note se existe recurso de apoio na própria cena ou se ele permanece desconhecido.', review: 'Revise o que foi percebido sem transformar emoção em diagnóstico ou identidade.' },
  { id: 'water-trail-v2', startPoint: 'water', orientation: 'Considere um personagem fictício diante de uma lembrança incompleta.', observation: 'Diferencie o que aparece na cena, o que é interpretação e o que continua desconhecido.', review: 'Escolha preservar a observação, passar ou deixar a memória sem conclusão.' },
  { id: 'fire-trail-v1', startPoint: 'fire', orientation: 'Observe um instante fictício entre impulso e gesto.', observation: 'Compare uma pausa curta, um limite em primeira pessoa e nenhuma ação agora.', review: 'Revise qual opção foi proporcional ao cenário, sem transformar intensidade em coragem.' },
  { id: 'fire-trail-v2', startPoint: 'fire', orientation: 'Considere uma oficina fictícia onde uma mudança pode ser reversível.', observation: 'Diferencie reparar, transformar e não alterar antes de escolher qualquer intervenção.', review: 'Registre se a mudança pequena continua adequada ou se deve repousar.' },
  { id: 'earth-trail-v1', startPoint: 'earth', orientation: 'Observe uma bancada fictícia com tempo, espaço e materiais limitados.', observation: 'Escolha uma unidade pequena ou reconheça que nenhum passo cabe agora.', review: 'Revise o recurso disponível e o limite ativo sem medir desempenho.' },
  { id: 'earth-trail-v2', startPoint: 'earth', orientation: 'Considere cinco objetos fictícios e deixe no máximo dois visíveis.', observation: 'Note se guardar, pausar ou arquivar reduz o acúmulo sem apagar o histórico.', review: 'Revise a ordem como provisória e alterável, não como disciplina pessoal.' },
  { id: 'spirit-trail-v1', startPoint: 'spirit', orientation: 'Observe cinco partes fictícias que oferecem informações diferentes.', observation: 'Escolha um centro provisório ou mantenha todas sem centro.', review: 'Revise se a discordância continua preservada e se nenhuma decisão é necessária.' },
  { id: 'spirit-trail-v2', startPoint: 'spirit', orientation: 'Considere um conselho fictício em que algumas partes falam e outras passam.', observation: 'Note um mínimo compartilhado sem usar maioria como autoridade.', review: 'Revise a decisão como provisória, retirável ou ausente.' },
  { id: 'rest-trail-v1', startPoint: 'rest', orientation: 'Reconheça que o repouso pode permanecer sem prática.', observation: 'Observe apenas que nenhuma retomada foi iniciada.', review: 'Preserve a pausa sem exigir conclusão, produtividade ou explicação.' },
  { id: 'rest-trail-v2', startPoint: 'rest', orientation: 'Considere o Templo disponível sem escolher um novo ambiente.', observation: 'Note que ausência de prática também mantém o histórico intacto.', review: 'Revise o repouso como resultado completo, sem dívida futura.' }
];

export const continuousTrailTraceDefinition = {
  id: 'continuous-trail-trace-v1',
  label: 'Rastro da Jornada Contínua',
  description: 'Registro local de que orientação, observação e revisão foram percorridas, passadas ou pausadas em uma instância específica.',
  rewardPolicy: 'Nenhuma repetição, etapa concluída ou prática escolhida concede nível, restauração ou recompensa.'
} as const;

export const continuousTrailRestrictions = [
  'Não reutiliza respostas, notas, classificações ou destinos anteriores',
  'Não exige prática para concluir a jornada',
  'Passar uma etapa tem o mesmo valor de conclusão',
  'Pausar preserva a etapa e a escolha atual',
  'Nenhuma variante produz diagnóstico, previsão ou direção espiritual específica',
  'Todo o progresso permanece separado por instância e armazenado localmente'
];

export function getContinuousTrailPractices(startPoint: NewWorkStartPoint): ContinuousTrailPracticeOption[] {
  return continuousTrailPractices.filter((practice) => practice.startPoint === startPoint);
}

export function selectContinuousTrailVariant(seed: string, startPoint: NewWorkStartPoint): ContinuousTrailVariant {
  const candidates = continuousTrailVariants.filter((variant) => variant.startPoint === startPoint);
  return candidates[deriveContinuousTrailVariantIndex(seed, candidates.length)];
}
