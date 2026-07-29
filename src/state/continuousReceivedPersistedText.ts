import { continuousReceivedPersistedTextPolicy } from '../content/continuousReceivedPersistedText';
import { validateContinuousInertJson } from '../domain/continuousInertJson';
import { inspectContinuousJsonNumbers } from '../domain/continuousNumericLexeme';
import {
  defaultContinuousResourceLimits,
  inspectContinuousResourceBudget,
  validateContinuousRawText
} from '../domain/continuousResource';
import { validateContinuousTextVisibility } from '../domain/continuousTextVisibility';
import { inspectContinuousJsonUniqueKeys } from '../domain/continuousUniqueKeys';

export type ContinuousReceivedPersistedTextFailureKind =
  | 'bytes'
  | 'text'
  | 'keys'
  | 'numbers'
  | 'syntax'
  | 'inert'
  | 'budget'
  | 'visibility';

export interface ContinuousReceivedPersistedTextSuccess {
  ok: true;
  value: unknown;
  bytes: number;
  characters: number;
  message: string;
}

export interface ContinuousReceivedPersistedTextFailure {
  ok: false;
  kind: ContinuousReceivedPersistedTextFailureKind;
  errors: string[];
}

export type ContinuousReceivedPersistedTextResult =
  | ContinuousReceivedPersistedTextSuccess
  | ContinuousReceivedPersistedTextFailure;

function failure(
  kind: ContinuousReceivedPersistedTextFailureKind,
  errors: string[]
): ContinuousReceivedPersistedTextFailure {
  return { ok: false, kind, errors };
}

export function inspectContinuousReceivedPersistedText(
  text: string
): ContinuousReceivedPersistedTextResult {
  const bytes = new TextEncoder().encode(text).length;
  if (bytes > continuousReceivedPersistedTextPolicy.maxUtf8Bytes) {
    return failure('bytes', [
      `A memória persistida excede o limite local de ${continuousReceivedPersistedTextPolicy.maxUtf8Bytes.toLocaleString('pt-BR')} bytes UTF-8 e não foi interpretada.`
    ]);
  }

  const rawText = validateContinuousRawText(text, defaultContinuousResourceLimits);
  if (!rawText.ok) {
    return failure('text', rawText.errors.map((error) => `Texto persistido recusado: ${error}`));
  }

  const uniqueKeys = inspectContinuousJsonUniqueKeys(text);
  if (!uniqueKeys.ok) {
    if (uniqueKeys.kind === 'syntax') {
      return failure('syntax', ['A memória persistida não contém um texto JSON interpretável.']);
    }
    return failure('keys', uniqueKeys.errors.map((error) => `Chave persistida recusada: ${error}`));
  }

  const numbers = inspectContinuousJsonNumbers(text);
  if (!numbers.ok) {
    if (numbers.kind === 'syntax') {
      return failure('syntax', ['A memória persistida não contém um texto JSON interpretável.']);
    }
    return failure('numbers', numbers.errors.map((error) => `Número persistido recusado: ${error}`));
  }

  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return failure('syntax', ['A memória persistida não contém um texto JSON interpretável.']);
  }

  const inert = validateContinuousInertJson(value);
  if (!inert.ok) {
    return failure('inert', inert.errors.map((error) => `Forma persistida recusada: ${error}`));
  }

  const budget = inspectContinuousResourceBudget(value, defaultContinuousResourceLimits);
  if (!budget.ok) return failure('budget', budget.errors);

  const visible = validateContinuousTextVisibility(value);
  if (!visible.ok) {
    return failure('visibility', visible.errors.map((error) => `Texto persistido recusado: ${error}`));
  }

  return {
    ok: true,
    value,
    bytes,
    characters: text.length,
    message: `Texto persistido preservado antes do parse: ${bytes.toLocaleString('pt-BR')} bytes UTF-8 e ${text.length.toLocaleString('pt-BR')} caracteres.`
  };
}
