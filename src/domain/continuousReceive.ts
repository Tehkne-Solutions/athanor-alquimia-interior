import { continuousReceivedIdentityPolicy } from '../content/continuousReceivedIdentity';
import type { ContinuousMapItemKind, ContinuousMapStatus } from './continuousMap';
import type { NewWorkStartPoint } from './continuousJourney';
import { isCanonicalContinuousUtcInstant } from './continuousExactTime';
import {
  areContinuousSharePackagesEquivalent,
  fingerprintContinuousSharePackage
} from './continuousFingerprintEquivalence';
import {
  validateContinuousReceivedActionTime,
  validateContinuousReceivedRegistryChronology
} from './continuousReceivedChronology';
import {
  validateContinuousIncomingReceivedCatalogVersion,
  validateContinuousReceivedCatalogVersion
} from './continuousReceivedCatalogVersion';
import {
  cloneContinuousReceivedPackage,
  cloneContinuousReceivedRecord
} from './continuousReceivedSnapshot';
import type {
  ContinuousCollectionShareExport,
  ContinuousShareItem,
  ContinuousShareOptions
} from './continuousShare';

export { fingerprintContinuousSharePackage } from './continuousFingerprintEquivalence';
export { validateContinuousReceivedRegistryChronology } from './continuousReceivedChronology';
export { validateContinuousReceivedCatalogVersion } from './continuousReceivedCatalogVersion';
export {
  cloneContinuousReceivedPackage,
  cloneContinuousReceivedRecord,
  cloneContinuousReceivedRegistry
} from './continuousReceivedSnapshot';

export type ContinuousReceivedStatus = 'active' | 'archived';

export interface ContinuousReceivedCollection {
  id: string;
  fingerprint: string;
  status: ContinuousReceivedStatus;
  package: ContinuousCollectionShareExport;
  receivedAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export interface ContinuousReceivedRegistry {
  id: 'continuous_received_registry_v1';
  catalogVersion: string;
  records: ContinuousReceivedCollection[];
  createdAt: string;
  updatedAt: string;
}

export interface ContinuousReceiveSuccess {
  ok: true;
  package: ContinuousCollectionShareExport;
  fingerprint: string;
  warnings: string[];
}

export interface ContinuousReceiveFailure {
  ok: false;
  errors: string[];
}

export type ContinuousReceiveResult = ContinuousReceiveSuccess | ContinuousReceiveFailure;

export type ContinuousReceivedKeepStatus = 'kept' | 'equivalent' | 'disambiguated' | 'stale' | 'invalid';

export interface ContinuousReceivedKeepResult {
  registry: ContinuousReceivedRegistry;
  status: ContinuousReceivedKeepStatus;
  requestedId: string;
  storedId?: string;
  record?: ContinuousReceivedCollection;
  message: string;
}

export type ContinuousReceivedMutationStatus =
  | 'updated'
  | 'unchanged'
  | 'missing'
  | 'ambiguous'
  | 'stale'
  | 'invalid';

export interface ContinuousReceivedMutationResult {
  registry: ContinuousReceivedRegistry;
  status: ContinuousReceivedMutationStatus;
  recordId: string;
  matchedRecords: number;
  message: string;
}

const startPoints: NewWorkStartPoint[] = ['word', 'water', 'fire', 'earth', 'spirit', 'rest'];
const itemKinds: ContinuousMapItemKind[] = ['trail', 'theme-cycle'];
const statuses: ContinuousMapStatus[] = ['active', 'paused', 'completed', 'declined', 'incomplete', 'unknown'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === 'string';
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

function parsePassageSummary(
  value: unknown,
  index: number
): { value?: ContinuousShareItem['passageSummary']; errors: string[] } {
  if (!isRecord(value)) return { errors: [`Item ${index + 1}: resumo de passagens inválido.`] };
  const errors: string[] = [];
  if (!isNonNegativeInteger(value.completed)) errors.push(`Item ${index + 1}: passagens concluídas inválidas.`);
  if (!isNonNegativeInteger(value.passed)) errors.push(`Item ${index + 1}: passagens passadas inválidas.`);
  if (!isNonNegativeInteger(value.pending)) errors.push(`Item ${index + 1}: passagens pendentes inválidas.`);
  if (errors.length > 0) return { errors };
  return {
    errors: [],
    value: {
      completed: value.completed as number,
      passed: value.passed as number,
      pending: value.pending as number
    }
  };
}

function parseShareItem(
  value: unknown,
  index: number,
  options: ContinuousShareOptions
): { item?: ContinuousShareItem; errors: string[] } {
  if (!isRecord(value)) return { errors: [`Item ${index + 1}: formato inválido.`] };
  const errors: string[] = [];
  if (!isPositiveInteger(value.position)) errors.push(`Item ${index + 1}: posição inválida.`);
  if (!itemKinds.includes(value.kind as ContinuousMapItemKind)) errors.push(`Item ${index + 1}: tipo inválido.`);
  if (!startPoints.includes(value.startPoint as NewWorkStartPoint)) errors.push(`Item ${index + 1}: elemento inválido.`);
  if (!isOptionalString(value.themeId)) errors.push(`Item ${index + 1}: tema inválido.`);
  if (typeof value.noTheme !== 'boolean') errors.push(`Item ${index + 1}: ausência de tema inválida.`);
  if (!isString(value.variantId)) errors.push(`Item ${index + 1}: variante inválida.`);
  if (!isOptionalString(value.packageId) || !isOptionalString(value.packageLabel)) {
    errors.push(`Item ${index + 1}: pacote curado inválido.`);
  }
  if (!statuses.includes(value.status as ContinuousMapStatus)) errors.push(`Item ${index + 1}: estado inválido.`);
  if (value.depth !== undefined && !isPositiveInteger(value.depth)) errors.push(`Item ${index + 1}: profundidade inválida.`);
  if (typeof value.endedEarly !== 'boolean') errors.push(`Item ${index + 1}: encerramento inválido.`);
  const passageSummary = parsePassageSummary(value.passageSummary, index);
  errors.push(...passageSummary.errors);
  if (!isOptionalString(value.occurredAt) || !isOptionalString(value.completedAt)) {
    errors.push(`Item ${index + 1}: datas inválidas.`);
  }
  if (!options.includeDates && (value.occurredAt !== undefined || value.completedAt !== undefined)) {
    errors.push(`Item ${index + 1}: o pacote declara datas omitidas, mas contém datas.`);
  }
  if (errors.length > 0 || !passageSummary.value) return { errors };

  return {
    errors: [],
    item: {
      position: value.position as number,
      kind: value.kind as ContinuousMapItemKind,
      startPoint: value.startPoint as NewWorkStartPoint,
      themeId: value.themeId as string | undefined,
      noTheme: value.noTheme as boolean,
      variantId: value.variantId as string,
      packageId: value.packageId as string | undefined,
      packageLabel: value.packageLabel as string | undefined,
      status: value.status as ContinuousMapStatus,
      depth: value.depth as number | undefined,
      endedEarly: value.endedEarly as boolean,
      passageSummary: passageSummary.value,
      occurredAt: options.includeDates ? value.occurredAt as string | undefined : undefined,
      completedAt: options.includeDates ? value.completedAt as string | undefined : undefined
    }
  };
}

export function parseContinuousCollectionShare(input: unknown): ContinuousReceiveResult {
  if (!isRecord(input)) return { ok: false, errors: ['Arquivo JSON inválido.'] };
  const errors: string[] = [];

  if (input.schema !== 'athanor-continuous-collection-share-v1') errors.push('Schema de partilha não reconhecido.');
  if (input.policy !== 'explicit-consent-minimized-local-export-v1') errors.push('Política de partilha incompatível.');
  if (!isString(input.catalogVersion)) errors.push('Versão do catálogo inválida.');
  if (!isString(input.generatedAt)) errors.push('Data de geração inválida.');

  if (!isRecord(input.provenance)) {
    errors.push('Proveniência ausente ou inválida.');
  } else {
    if (input.provenance.product !== 'Athanor — Alquimia Interior') errors.push('Produto de origem incompatível.');
    if (input.provenance.author !== 'Tehkné Solutions') errors.push('Autoria de origem incompatível.');
    if (input.provenance.transmission !== 'manual-local-file') errors.push('Modo de transmissão incompatível.');
  }

  if (!isRecord(input.collection)) {
    errors.push('Coleção recebida ausente ou inválida.');
  } else {
    if (!isString(input.collection.templateId)) errors.push('Modelo da coleção inválido.');
    if (!isString(input.collection.label)) errors.push('Rótulo da coleção inválido.');
    if (!['active', 'archived'].includes(String(input.collection.status))) errors.push('Estado da coleção inválido.');
    if (!isNonNegativeInteger(input.collection.itemCount)) errors.push('Quantidade descritiva inválida.');
  }

  if (!isRecord(input.options) || typeof input.options.includeDates !== 'boolean') {
    errors.push('Opções de minimização inválidas.');
  }
  if (!Array.isArray(input.items)) errors.push('Lista de itens ausente ou inválida.');
  if (!Array.isArray(input.notices) || !input.notices.every((notice) => isString(notice))) {
    errors.push('Avisos de segurança ausentes ou inválidos.');
  }
  if (
    errors.length > 0 ||
    !isRecord(input.collection) ||
    !isRecord(input.options) ||
    !Array.isArray(input.items) ||
    !isRecord(input.provenance)
  ) {
    return { ok: false, errors };
  }

  const options: ContinuousShareOptions = { includeDates: input.options.includeDates as boolean };
  const parsedItems = input.items.map((item, index) => parseShareItem(item, index, options));
  const itemErrors = parsedItems.flatMap((result) => result.errors);
  if (itemErrors.length > 0) return { ok: false, errors: itemErrors };
  const items = parsedItems.flatMap((result) => result.item ? [result.item] : []);

  if (input.collection.itemCount !== items.length) errors.push('A quantidade declarada não corresponde aos itens recebidos.');
  if (!items.every((item, index) => item.position === index + 1)) {
    errors.push('A ordem recebida precisa usar posições sequenciais iniciadas em 1.');
  }
  if (errors.length > 0) return { ok: false, errors };

  const sanitized: ContinuousCollectionShareExport = {
    schema: 'athanor-continuous-collection-share-v1',
    policy: 'explicit-consent-minimized-local-export-v1',
    catalogVersion: input.catalogVersion as string,
    generatedAt: input.generatedAt as string,
    provenance: {
      product: 'Athanor — Alquimia Interior',
      author: 'Tehkné Solutions',
      transmission: 'manual-local-file'
    },
    collection: {
      templateId: input.collection.templateId as string,
      label: input.collection.label as string,
      status: input.collection.status as 'active' | 'archived',
      itemCount: input.collection.itemCount as number
    },
    options,
    items,
    notices: [...input.notices as string[]]
  };

  const warnings: string[] = [];
  if (items.length === 0) warnings.push('A coleção recebida está vazia e permanece válida.');
  if (options.includeDates) warnings.push('O arquivo recebido inclui datas descritivas escolhidas na origem.');
  if (items.some((item) => item.status === 'unknown')) {
    warnings.push('O arquivo contém registros desconhecidos, preservados sem interpretação.');
  }

  return {
    ok: true,
    package: sanitized,
    fingerprint: fingerprintContinuousSharePackage(sanitized),
    warnings
  };
}

export function createContinuousReceivedRegistry(
  catalogVersion: string,
  createdAt: string
): ContinuousReceivedRegistry {
  if (!isCanonicalContinuousUtcInstant(createdAt)) {
    throw new RangeError('A criação da biblioteca exige instante UTC canônico YYYY-MM-DDTHH:mm:ss.sssZ.');
  }
  const registry: ContinuousReceivedRegistry = {
    id: 'continuous_received_registry_v1',
    catalogVersion,
    records: [],
    createdAt,
    updatedAt: createdAt
  };
  const catalog = validateContinuousReceivedCatalogVersion(registry);
  if (!catalog.ok) {
    throw new RangeError(`A criação da biblioteca exige o catálogo atual reconhecido: ${catalog.errors[0]}`);
  }
  return registry;
}

function findStoredAllById(
  registry: ContinuousReceivedRegistry,
  recordId: string
): ContinuousReceivedCollection[] {
  return registry.records.filter((record) => record.id === recordId);
}

function findStoredAllByFingerprint(
  registry: ContinuousReceivedRegistry,
  fingerprint: string
): ContinuousReceivedCollection[] {
  return registry.records.filter((record) => record.fingerprint === fingerprint);
}

function findStoredEquivalentReceivedCollection(
  registry: ContinuousReceivedRegistry,
  packageValue: ContinuousCollectionShareExport
): ContinuousReceivedCollection | undefined {
  const fingerprint = fingerprintContinuousSharePackage(packageValue);
  return findStoredAllByFingerprint(registry, fingerprint)
    .find((record) => areContinuousSharePackagesEquivalent(record.package, packageValue));
}

export function findReceivedAllById(
  registry: ContinuousReceivedRegistry,
  recordId: string
): ContinuousReceivedCollection[] {
  return findStoredAllById(registry, recordId).map(cloneContinuousReceivedRecord);
}

export function findReceivedCollection(
  registry: ContinuousReceivedRegistry,
  recordId: string
): ContinuousReceivedCollection | undefined {
  const matches = findStoredAllById(registry, recordId);
  return matches.length === 1 ? cloneContinuousReceivedRecord(matches[0]) : undefined;
}

export function findReceivedAllByFingerprint(
  registry: ContinuousReceivedRegistry,
  fingerprint: string
): ContinuousReceivedCollection[] {
  return findStoredAllByFingerprint(registry, fingerprint).map(cloneContinuousReceivedRecord);
}

export function findReceivedByFingerprint(
  registry: ContinuousReceivedRegistry,
  fingerprint: string
): ContinuousReceivedCollection | undefined {
  const match = findStoredAllByFingerprint(registry, fingerprint)[0];
  return match ? cloneContinuousReceivedRecord(match) : undefined;
}

export function findEquivalentReceivedCollection(
  registry: ContinuousReceivedRegistry,
  packageValue: ContinuousCollectionShareExport
): ContinuousReceivedCollection | undefined {
  const match = findStoredEquivalentReceivedCollection(registry, packageValue);
  return match ? cloneContinuousReceivedRecord(match) : undefined;
}

export function allocateContinuousReceivedRecordId(
  registry: ContinuousReceivedRegistry,
  requestedId: string
): string | undefined {
  if (!requestedId) return undefined;
  if (findStoredAllById(registry, requestedId).length === 0) return requestedId;

  for (
    let suffix = continuousReceivedIdentityPolicy.firstSuffix;
    suffix <= continuousReceivedIdentityPolicy.maxSuffix;
    suffix += 1
  ) {
    const candidate = `${requestedId}${continuousReceivedIdentityPolicy.separator}${suffix}`;
    if (findStoredAllById(registry, candidate).length === 0) return candidate;
  }

  return undefined;
}

function invalidKeepTime(
  registry: ContinuousReceivedRegistry,
  requestedId: string,
  receivedAt: string
): ContinuousReceivedKeepResult | undefined {
  const time = validateContinuousReceivedActionTime(registry, receivedAt);
  if (time.status === 'valid') return undefined;
  return {
    registry,
    status: time.status,
    requestedId,
    message: time.message
  };
}

export function keepReceivedCollectionWithIdentity(
  registry: ContinuousReceivedRegistry,
  input: { id: string; package: ContinuousCollectionShareExport },
  receivedAt: string
): ContinuousReceivedKeepResult {
  if (!input.id || !receivedAt) {
    return {
      registry,
      status: 'invalid',
      requestedId: input.id,
      message: 'Identificador candidato e instante de recebimento são obrigatórios.'
    };
  }

  const invalidTime = invalidKeepTime(registry, input.id, receivedAt);
  if (invalidTime) return invalidTime;

  const incomingCatalog = validateContinuousIncomingReceivedCatalogVersion(registry, input.package);
  if (!incomingCatalog.ok) {
    return {
      registry,
      status: 'invalid',
      requestedId: input.id,
      message: `O pacote recebido não pode entrar nesta biblioteca: ${incomingCatalog.errors[0]}`
    };
  }

  const detachedPackage = cloneContinuousReceivedPackage(input.package);
  const equivalent = findStoredEquivalentReceivedCollection(registry, detachedPackage);
  if (equivalent) {
    return {
      registry,
      status: 'equivalent',
      requestedId: input.id,
      storedId: equivalent.id,
      record: cloneContinuousReceivedRecord(equivalent),
      message: 'A cópia equivalente já existe e foi preservada sem duplicação.'
    };
  }

  const storedId = allocateContinuousReceivedRecordId(registry, input.id);
  if (!storedId) {
    return {
      registry,
      status: 'invalid',
      requestedId: input.id,
      message: 'Não foi possível alocar um identificador local único dentro do limite previsto.'
    };
  }

  const storedRecord: ContinuousReceivedCollection = {
    id: storedId,
    fingerprint: fingerprintContinuousSharePackage(detachedPackage),
    status: 'active',
    package: detachedPackage,
    receivedAt,
    updatedAt: receivedAt
  };
  const nextRegistry: ContinuousReceivedRegistry = {
    ...registry,
    records: [
      ...registry.records.map(cloneContinuousReceivedRecord),
      storedRecord
    ],
    updatedAt: receivedAt
  };
  const returnedRecord = cloneContinuousReceivedRecord(storedRecord);

  if (storedId === input.id) {
    return {
      registry: nextRegistry,
      status: 'kept',
      requestedId: input.id,
      storedId,
      record: returnedRecord,
      message: 'A cópia foi guardada com o identificador local solicitado.'
    };
  }

  return {
    registry: nextRegistry,
    status: 'disambiguated',
    requestedId: input.id,
    storedId,
    record: returnedRecord,
    message: `O identificador local já existia; a cópia foi preservada como ${storedId}.`
  };
}

export function keepReceivedCollection(
  registry: ContinuousReceivedRegistry,
  input: { id: string; package: ContinuousCollectionShareExport },
  receivedAt: string
): ContinuousReceivedRegistry {
  return keepReceivedCollectionWithIdentity(registry, input, receivedAt).registry;
}

function timeMutationFailure(
  registry: ContinuousReceivedRegistry,
  recordId: string,
  matchedRecords: number,
  updatedAt: string,
  record?: ContinuousReceivedCollection
): ContinuousReceivedMutationResult | undefined {
  const time = validateContinuousReceivedActionTime(registry, updatedAt, record);
  if (time.status === 'valid') return undefined;
  return {
    registry,
    status: time.status,
    recordId,
    matchedRecords,
    message: time.message
  };
}

function mutateReceivedCollectionWithIdentity(
  registry: ContinuousReceivedRegistry,
  recordId: string,
  updatedAt: string,
  updater: (record: ContinuousReceivedCollection) => ContinuousReceivedCollection
): ContinuousReceivedMutationResult {
  if (!recordId || !updatedAt) {
    return {
      registry,
      status: 'invalid',
      recordId,
      matchedRecords: 0,
      message: 'Identificador local e instante da ação são obrigatórios.'
    };
  }

  const registryTime = timeMutationFailure(registry, recordId, 0, updatedAt);
  if (registryTime?.status === 'invalid') return registryTime;

  const matches = findStoredAllById(registry, recordId);
  if (matches.length === 0) {
    return {
      registry,
      status: 'missing',
      recordId,
      matchedRecords: 0,
      message: 'Nenhuma cópia local corresponde ao identificador informado.'
    };
  }
  if (matches.length > 1) {
    return {
      registry,
      status: 'ambiguous',
      recordId,
      matchedRecords: matches.length,
      message: 'O identificador local é ambíguo; nenhuma cópia foi alterada.'
    };
  }

  const current = matches[0];
  const timeFailure = timeMutationFailure(registry, recordId, 1, updatedAt, current);
  if (timeFailure) return timeFailure;

  const updated = updater(current);
  if (updated === current) {
    return {
      registry,
      status: 'unchanged',
      recordId,
      matchedRecords: 1,
      message: 'A cópia já estava no estado solicitado.'
    };
  }

  return {
    registry: {
      ...registry,
      records: registry.records.map((record) => record === current
        ? cloneContinuousReceivedRecord(updated)
        : cloneContinuousReceivedRecord(record)),
      updatedAt
    },
    status: 'updated',
    recordId,
    matchedRecords: 1,
    message: 'A ação foi aplicada somente à cópia local identificada.'
  };
}

export function archiveReceivedCollectionWithIdentity(
  registry: ContinuousReceivedRegistry,
  recordId: string,
  archivedAt: string
): ContinuousReceivedMutationResult {
  return mutateReceivedCollectionWithIdentity(registry, recordId, archivedAt, (record) => record.status === 'archived'
    ? record
    : { ...record, status: 'archived', archivedAt, updatedAt: archivedAt });
}

export function archiveReceivedCollection(
  registry: ContinuousReceivedRegistry,
  recordId: string,
  archivedAt: string
): ContinuousReceivedRegistry {
  return archiveReceivedCollectionWithIdentity(registry, recordId, archivedAt).registry;
}

export function reactivateReceivedCollectionWithIdentity(
  registry: ContinuousReceivedRegistry,
  recordId: string,
  updatedAt: string
): ContinuousReceivedMutationResult {
  return mutateReceivedCollectionWithIdentity(registry, recordId, updatedAt, (record) => record.status === 'active'
    ? record
    : { ...record, status: 'active', archivedAt: undefined, updatedAt });
}

export function reactivateReceivedCollection(
  registry: ContinuousReceivedRegistry,
  recordId: string,
  updatedAt: string
): ContinuousReceivedRegistry {
  return reactivateReceivedCollectionWithIdentity(registry, recordId, updatedAt).registry;
}

export function removeReceivedCollectionWithIdentity(
  registry: ContinuousReceivedRegistry,
  recordId: string,
  updatedAt: string
): ContinuousReceivedMutationResult {
  if (!recordId || !updatedAt) {
    return {
      registry,
      status: 'invalid',
      recordId,
      matchedRecords: 0,
      message: 'Identificador local e instante da remoção são obrigatórios.'
    };
  }

  const registryChronology = validateContinuousReceivedRegistryChronology(registry);
  if (!registryChronology.ok) {
    return {
      registry,
      status: 'invalid',
      recordId,
      matchedRecords: 0,
      message: `A biblioteca local possui cronologia incoerente: ${registryChronology.errors[0]}`
    };
  }
  if (!isCanonicalContinuousUtcInstant(updatedAt)) {
    return {
      registry,
      status: 'invalid',
      recordId,
      matchedRecords: 0,
      message: 'O instante da remoção precisa usar YYYY-MM-DDTHH:mm:ss.sssZ em UTC.'
    };
  }

  const matches = findStoredAllById(registry, recordId);
  if (matches.length === 0) {
    return {
      registry,
      status: 'missing',
      recordId,
      matchedRecords: 0,
      message: 'Nenhuma cópia local corresponde ao identificador informado.'
    };
  }
  if (matches.length > 1) {
    return {
      registry,
      status: 'ambiguous',
      recordId,
      matchedRecords: matches.length,
      message: 'O identificador local é ambíguo; nenhuma cópia foi removida.'
    };
  }

  const target = matches[0];
  const timeFailure = timeMutationFailure(registry, recordId, 1, updatedAt, target);
  if (timeFailure) return timeFailure;

  return {
    registry: {
      ...registry,
      records: registry.records
        .filter((record) => record !== target)
        .map(cloneContinuousReceivedRecord),
      updatedAt
    },
    status: 'updated',
    recordId,
    matchedRecords: 1,
    message: 'Somente a cópia local identificada foi removida.'
  };
}

export function removeReceivedCollection(
  registry: ContinuousReceivedRegistry,
  recordId: string,
  updatedAt: string
): ContinuousReceivedRegistry {
  return removeReceivedCollectionWithIdentity(registry, recordId, updatedAt).registry;
}
