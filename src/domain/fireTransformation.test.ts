import { describe, expect, it } from 'vitest';
import {
  canCompleteFireTransformation,
  classifyTransformationStatement,
  completeFireTransformation,
  createFireTransformationProgress,
  isCompatibleTransformationChoice
} from './fireTransformation';

const completedBase = () => ({
  ...createFireTransformationProgress('courage-mark-1', '2026-07-25T10:00:00.000Z'),
  classificationSkipped: true,
  object: 'cracked_lantern' as const,
  decision: 'repair' as const,
  action: 'replace_removable_part' as const,
  safeguard: 'fictional_object_only' as const,
  review: 'after_one_step' as const
});

describe('fireTransformation', () => {
  it('inicia a missão vinculada à Marca atual', () => {
    const progress = createFireTransformationProgress('courage-mark-1', '2026-07-25T10:00:00.000Z');
    expect(progress.sourceCourageMarkId).toBe('courage-mark-1');
    expect(progress.transformedMetalCreated).toBe(false);
  });

  it('classifica frases fictícias sem bloquear o progresso por divergência', () => {
    const progress = createFireTransformationProgress('courage-mark-1', '2026-07-25T10:00:00.000Z');
    const next = classifyTransformationStatement(progress, 'repair-1', 'archive', '2026-07-25T10:01:00.000Z');
    expect(next.classifications['repair-1']).toBe('archive');
  });

  it('aceita recusa integral do classificador', () => {
    const progress = completedBase();
    expect(canCompleteFireTransformation(progress, 10)).toBe(true);
  });

  it('bloqueia intervenção incompatível quando falta contexto', () => {
    const progress = { ...completedBase(), safeguard: 'need_more_context' as const, action: 'replace_removable_part' as const };
    expect(isCompatibleTransformationChoice(progress)).toBe(false);
    expect(canCompleteFireTransformation(progress, 10)).toBe(false);
  });

  it('aceita nenhuma mudança agora como resultado completo', () => {
    const progress = {
      ...completedBase(),
      decision: 'preserve' as const,
      action: 'no_change_now' as const,
      safeguard: 'no_change_now' as const
    };
    expect(canCompleteFireTransformation(progress, 10)).toBe(true);
  });

  it('cria o Metal Transformado somente após escolha compatível', () => {
    const progress = completedBase();
    const completed = completeFireTransformation(progress, 10, '2026-07-25T10:10:00.000Z');
    expect(completed.status).toBe('completed');
    expect(completed.transformedMetalCreated).toBe(true);
  });
});
