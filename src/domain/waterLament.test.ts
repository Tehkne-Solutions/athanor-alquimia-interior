import { describe, expect, it } from 'vitest';
import {
  canCompleteWaterLament,
  completeWaterLament,
  createEmptyWaterLamentDraft,
  createWaterLamentProgress,
  detectWaterSafetySignal,
  updateWaterLamentField
} from './waterLament';

const startedAt = '2026-07-25T12:00:00.000Z';
const completedAt = '2026-07-25T12:10:00.000Z';

describe('water lament domain', () => {
  it('não conclui um registro vazio por acidente', () => {
    expect(canCompleteWaterLament(createEmptyWaterLamentDraft())).toBe(false);
  });

  it('permite concluir em silêncio sem conteúdo', () => {
    const progress = createWaterLamentProgress(startedAt);
    progress.draft.skipped = true;

    const result = completeWaterLament(progress, completedAt);

    expect(result.outcome).toBe('completed');
    expect(result.progress.status).toBe('completed');
    expect(result.progress.fragmentCreated).toBe(true);
    expect(result.progress.draft.skipped).toBe(true);
  });

  it('cria o fragmento pela prática, sem usar quantidade de texto como pontuação', () => {
    const progress = updateWaterLamentField(
      createWaterLamentProgress(startedAt),
      'feeling',
      'Estou triste e gostaria de um pouco de tempo.',
      completedAt
    );

    const result = completeWaterLament(progress, completedAt);

    expect(result.outcome).toBe('completed');
    expect(result.progress.fragmentCreated).toBe(true);
    expect(result.progress.status).toBe('completed');
  });

  it('identifica frase crítica explícita de forma local', () => {
    const draft = createEmptyWaterLamentDraft();
    draft.desire = 'Eu vou me matar hoje.';

    expect(detectWaterSafetySignal(draft)).toBe('suicide');
  });

  it('interrompe o simbolismo, não cria recompensa e remove o texto crítico', () => {
    let progress = createWaterLamentProgress(startedAt);
    progress = updateWaterLamentField(progress, 'desire', 'Quero me machucar.', completedAt);

    const result = completeWaterLament(progress, completedAt);

    expect(result.outcome).toBe('safety');
    expect(result.progress.status).toBe('safety_interrupted');
    expect(result.progress.fragmentCreated).toBe(false);
    expect(result.progress.draft.desire).toBe('');
    expect(result.progress.safetySignal?.category).toBe('self_harm');
  });

  it('não trata tristeza ou pedido de apoio como sinal crítico', () => {
    const draft = createEmptyWaterLamentDraft();
    draft.feeling = 'Estou triste e confuso.';
    draft.support = 'Gostaria de conversar com alguém de confiança.';

    expect(detectWaterSafetySignal(draft)).toBeUndefined();
  });
});
