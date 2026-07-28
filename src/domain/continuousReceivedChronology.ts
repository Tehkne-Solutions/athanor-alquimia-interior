import { continuousReceivedChronologyPolicy } from '../content/continuousReceivedChronology';
import { isCanonicalContinuousUtcInstant } from './continuousExactTime';
import type { ContinuousReceivedCollection, ContinuousReceivedRegistry } from './continuousReceive';

export interface ContinuousReceivedChronologySuccess {
  ok: true;
  message: string;
}

export interface ContinuousReceivedChronologyFailure {
  ok: false;
  errors: string[];
}

export type ContinuousReceivedChronologyResult =
  | ContinuousReceivedChronologySuccess
  | ContinuousReceivedChronologyFailure;

export type ContinuousReceivedActionTimeStatus = 'valid' | 'invalid' | 'stale';

export interface ContinuousReceivedActionTimeResult {
  status: ContinuousReceivedActionTimeStatus;
  message: string;
}

function epoch(value: string): number {
  return Date.parse(value);
}

function push(errors: string[], message: string): void {
  if (errors.length < continuousReceivedChronologyPolicy.maxReportedIssues) errors.push(message);
}

function validateInstant(errors: string[], value: string, path: string): boolean {
  if (isCanonicalContinuousUtcInstant(value)) return true;
  push(errors, `${path}: instante local não canônico; use YYYY-MM-DDTHH:mm:ss.sssZ.`);
  return false;
}

function validateRecord(
  registry: ContinuousReceivedRegistry,
  record: ContinuousReceivedCollection,
  index: number,
  errors: string[]
): void {
  const base = `$.records[${index}]`;
  const receivedValid = validateInstant(errors, record.receivedAt, `${base}.receivedAt`);
  const updatedValid = validateInstant(errors, record.updatedAt, `${base}.updatedAt`);
  const archivedValid = record.archivedAt === undefined
    ? false
    : validateInstant(errors, record.archivedAt, `${base}.archivedAt`);

  if (receivedValid && epoch(record.receivedAt) < epoch(registry.createdAt)) {
    push(errors, `${base}.receivedAt: recebimento anterior à criação da biblioteca local.`);
  }
  if (receivedValid && updatedValid && epoch(record.updatedAt) < epoch(record.receivedAt)) {
    push(errors, `${base}.updatedAt: atualização anterior ao recebimento.`);
  }
  if (updatedValid && epoch(record.updatedAt) > epoch(registry.updatedAt)) {
    push(errors, `${base}.updatedAt: estado posterior ao updatedAt da biblioteca.`);
  }

  if (record.status === 'active' && record.archivedAt !== undefined) {
    push(errors, `${base}.archivedAt: cópia ativa não pode manter instante de arquivamento.`);
  }
  if (record.status === 'archived') {
    if (record.archivedAt === undefined) {
      push(errors, `${base}.archivedAt: cópia arquivada exige instante de arquivamento.`);
    } else if (archivedValid && updatedValid && record.archivedAt !== record.updatedAt) {
      push(errors, `${base}.archivedAt: arquivamento precisa coincidir com o updatedAt da cópia.`);
    }
  }
}

export function validateContinuousReceivedRegistryChronology(
  registry: ContinuousReceivedRegistry
): ContinuousReceivedChronologyResult {
  const errors: string[] = [];
  const createdValid = validateInstant(errors, registry.createdAt, '$.createdAt');
  const updatedValid = validateInstant(errors, registry.updatedAt, '$.updatedAt');

  if (createdValid && updatedValid && epoch(registry.updatedAt) < epoch(registry.createdAt)) {
    push(errors, '$.updatedAt: atualização da biblioteca anterior à própria criação.');
  }

  registry.records.forEach((record, index) => validateRecord(registry, record, index, errors));

  return errors.length > 0
    ? { ok: false, errors }
    : { ok: true, message: 'A cronologia local permanece UTC, canônica e monotônica.' };
}

export function validateContinuousReceivedActionTime(
  registry: ContinuousReceivedRegistry,
  actionAt: string,
  record?: ContinuousReceivedCollection
): ContinuousReceivedActionTimeResult {
  const registryResult = validateContinuousReceivedRegistryChronology(registry);
  if (!registryResult.ok) {
    return {
      status: 'invalid',
      message: `A biblioteca local possui cronologia incoerente: ${registryResult.errors[0]}`
    };
  }
  if (!isCanonicalContinuousUtcInstant(actionAt)) {
    return {
      status: 'invalid',
      message: 'O instante da ação precisa usar YYYY-MM-DDTHH:mm:ss.sssZ em UTC.'
    };
  }

  const floor = record && epoch(record.updatedAt) > epoch(registry.updatedAt)
    ? record.updatedAt
    : registry.updatedAt;
  if (epoch(actionAt) < epoch(floor)) {
    return {
      status: 'stale',
      message: 'O instante da ação é anterior ao último estado local; nenhuma alteração foi aplicada.'
    };
  }

  return {
    status: 'valid',
    message: 'O instante da ação preserva a sequência local.'
  };
}
