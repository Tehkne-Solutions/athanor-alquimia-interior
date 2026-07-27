export interface ContinuousExactTimeSuccess {
  ok: true;
  message: string;
}

export interface ContinuousExactTimeFailure {
  ok: false;
  errors: string[];
}

export type ContinuousExactTimeResult = ContinuousExactTimeSuccess | ContinuousExactTimeFailure;

const canonicalUtcInstantPattern = /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d\.\d{3}Z$/;
const maxReportedIssues = 20;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function safeIndexPath(base: string, index: number): string {
  return `${base}[${index}]`;
}

export function isCanonicalContinuousUtcInstant(value: string): boolean {
  if (!canonicalUtcInstantPattern.test(value)) return false;
  const epoch = Date.parse(value);
  if (!Number.isFinite(epoch)) return false;
  try {
    return new Date(epoch).toISOString() === value;
  } catch {
    return false;
  }
}

function validateInstant(value: unknown, path: string, errors: string[]): number | undefined {
  if (typeof value !== 'string') return undefined;
  if (!isCanonicalContinuousUtcInstant(value)) {
    if (errors.length < maxReportedIssues) {
      errors.push(`${path}: instante temporal não canônico; use YYYY-MM-DDTHH:mm:ss.sssZ em UTC.`);
    }
    return undefined;
  }
  return Date.parse(value);
}

function validateGeneratedAt(input: unknown, errors: string[]): void {
  if (!isRecord(input)) return;
  validateInstant(input.generatedAt, '$.generatedAt', errors);
}

export function validateContinuousShareExactTime(input: unknown): ContinuousExactTimeResult {
  const errors: string[] = [];
  validateGeneratedAt(input, errors);

  if (isRecord(input) && Array.isArray(input.items)) {
    input.items.forEach((item, index) => {
      if (!isRecord(item)) return;
      const base = safeIndexPath('$.items', index);
      const occurred = item.occurredAt === undefined
        ? undefined
        : validateInstant(item.occurredAt, `${base}.occurredAt`, errors);
      const completed = item.completedAt === undefined
        ? undefined
        : validateInstant(item.completedAt, `${base}.completedAt`, errors);
      if (occurred !== undefined && completed !== undefined && completed < occurred && errors.length < maxReportedIssues) {
        errors.push(`${base}: completedAt não pode anteceder occurredAt.`);
      }
    });
  }

  return errors.length > 0
    ? { ok: false, errors }
    : { ok: true, message: 'Instantes temporais conhecidos permanecem UTC, canônicos e sem conversão silenciosa.' };
}

export function validateContinuousResponseExactTime(input: unknown): ContinuousExactTimeResult {
  const errors: string[] = [];
  validateGeneratedAt(input, errors);
  return errors.length > 0
    ? { ok: false, errors }
    : { ok: true, message: 'O instante de geração permanece UTC, canônico e sem conversão silenciosa.' };
}
