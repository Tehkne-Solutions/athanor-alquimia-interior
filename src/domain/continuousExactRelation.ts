export interface ContinuousExactRelationSuccess {
  ok: true;
  message: string;
}

export interface ContinuousExactRelationFailure {
  ok: false;
  errors: string[];
}

export type ContinuousExactRelationResult = ContinuousExactRelationSuccess | ContinuousExactRelationFailure;

const maxReportedIssues = 20;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function report(errors: string[], message: string): void {
  if (errors.length < maxReportedIssues) errors.push(message);
}

function epoch(value: unknown): number | undefined {
  if (typeof value !== 'string') return undefined;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function validateContinuousShareExactRelation(input: unknown): ContinuousExactRelationResult {
  const errors: string[] = [];
  if (!isRecord(input)) return { ok: true, message: 'Relações da partilha serão avaliadas após a estrutura ser reconhecida.' };

  const items = Array.isArray(input.items) ? input.items : undefined;
  const collection = isRecord(input.collection) ? input.collection : undefined;
  const options = isRecord(input.options) ? input.options : undefined;
  const generatedAt = epoch(input.generatedAt);

  if (items && collection && typeof collection.itemCount === 'number' && collection.itemCount !== items.length) {
    report(errors, '$.collection.itemCount: quantidade declarada não corresponde à lista de itens.');
  }

  if (items) {
    items.forEach((item, index) => {
      if (!isRecord(item)) return;
      const path = `$.items[${index}]`;
      if (typeof item.position === 'number' && item.position !== index + 1) {
        report(errors, `${path}.position: posição precisa corresponder à ordem sequencial iniciada em 1.`);
      }

      const hasOccurredAt = item.occurredAt !== undefined;
      const hasCompletedAt = item.completedAt !== undefined;
      if (options?.includeDates === false && (hasOccurredAt || hasCompletedAt)) {
        report(errors, `${path}: datas não podem existir quando includeDates é false.`);
      }
      if (hasCompletedAt && !hasOccurredAt) {
        report(errors, `${path}.completedAt: conclusão temporal exige occurredAt no mesmo item.`);
      }

      const occurredAt = epoch(item.occurredAt);
      const completedAt = epoch(item.completedAt);
      if (occurredAt !== undefined && completedAt !== undefined && completedAt < occurredAt) {
        report(errors, `${path}: completedAt não pode anteceder occurredAt.`);
      }
      if (generatedAt !== undefined && occurredAt !== undefined && occurredAt > generatedAt) {
        report(errors, `${path}.occurredAt: instante não pode ser posterior à geração do pacote.`);
      }
      if (generatedAt !== undefined && completedAt !== undefined && completedAt > generatedAt) {
        report(errors, `${path}.completedAt: instante não pode ser posterior à geração do pacote.`);
      }
    });
  }

  return errors.length > 0
    ? { ok: false, errors }
    : { ok: true, message: 'Quantidade, posições, política de datas e cronologia interna permanecem coerentes entre si.' };
}

export function validateContinuousResponseExactRelation(_input: unknown): ContinuousExactRelationResult {
  return {
    ok: true,
    message: 'O pacote de resposta não possui relações temporais adicionais além do instante canônico de geração.'
  };
}
