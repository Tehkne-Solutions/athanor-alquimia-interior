import type { BiblicalUnit, WaterEmotionId, WaterNeedId } from '../domain/types';

export const waterBiblicalUnit: BiblicalUnit = {
  id: 'psalm_name_present_state_01',
  reference: 'Salmo 42',
  title: 'Nomear o movimento presente',
  principle: 'Uma experiência pode ser reconhecida e expressa sem se tornar a identidade inteira da pessoa.',
  context: 'O Salmo 42 articula memória, desejo, abatimento e esperança em uma mesma composição. A missão utiliza essa complexidade como base editorial, sem reduzir o Salmo a uma única emoção ou oferecer interpretação clínica.',
  themes: ['memória', 'lamento', 'esperança', 'presença'],
  application: 'Selecionar um ou mais movimentos percebidos agora, ou seguir sem registrar quando não desejar nomeá-los.',
  provenance: [
    {
      id: 'bib-psalm-42',
      label: 'Fonte bíblica',
      class: 'BIB',
      explanation: 'Referência dos Salmos usada como núcleo editorial da missão.',
      sourceLabel: 'Salmo 42'
    }
  ]
};

export const waterEmotions: { id: WaterEmotionId; label: string; description: string }[] = [
  { id: 'fear', label: 'Medo', description: 'Percepção de ameaça, risco ou incerteza.' },
  { id: 'hope', label: 'Esperança', description: 'Abertura para uma possibilidade desejada.' },
  { id: 'sadness', label: 'Tristeza', description: 'Movimento ligado a perda, ausência ou recolhimento.' },
  { id: 'gratitude', label: 'Gratidão', description: 'Reconhecimento voluntário de algo valioso.' },
  { id: 'anger', label: 'Ira', description: 'Energia ligada a limite, dano percebido ou frustração.' },
  { id: 'loneliness', label: 'Solidão', description: 'Percepção de distância, ausência ou desconexão.' },
  { id: 'trust', label: 'Confiança', description: 'Percepção de apoio, vínculo ou recurso disponível.' },
  { id: 'confusion', label: 'Confusão', description: 'Dificuldade atual de organizar sentidos ou escolhas.' }
];

export const waterNeeds: { id: WaterNeedId; label: string }[] = [
  { id: 'expression', label: 'Expressão' },
  { id: 'silence', label: 'Silêncio' },
  { id: 'rest', label: 'Repouso' },
  { id: 'support', label: 'Apoio' },
  { id: 'clarity', label: 'Clareza' },
  { id: 'time', label: 'Tempo' },
  { id: 'unknown', label: 'Não sei' }
];
