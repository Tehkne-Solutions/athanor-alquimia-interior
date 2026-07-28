import type { ContinuousMapItemKind, ContinuousMapStatus } from './continuousMap';
import type { NewWorkStartPoint } from './continuousJourney';
import {
  areContinuousSharePackagesEquivalent,
  fingerprintContinuousSharePackage
} from './continuousFingerprintEquivalence';
import type {
  ContinuousCollectionShareExport,
  ContinuousShareItem,
  ContinuousShareOptions
} from './continuousShare';

export { fingerprintContinuousSharePackage } from './continuousFingerprintEquivalence';

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

function parsePassageSummary(value: unknown, index: number): { value?: ContinuousShareItem['passageSummary']; errors: string[] } {
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
  if (errors.length > 0 || !isRecord(input.collection) || !isRecord(input.options) || !Array.isArray(input.items) || !isRecord(input.provenance)) {
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
  return {
    id: 'continuous_received_registry_v1',
    catalogVersion,
    records: [],
    createdAt,
    updatedAt: createdAt
  };
}

export function findReceivedCollection(
  registry: ContinuousReceivedRegistry,
  recordId: string
): ContinuousReceivedCollection | undefined {
  return registry.records.find((record) => record.id === recordId);
}

export function findReceivedAllByFingerprint(
  registry: ContinuousReceivedRegistry,
  fingerprint: string
): ContinuousReceivedCollection[] {
  return registry.records.filter((record) => record.fingerprint === fingerprint);
}

export function findReceivedByFingerprint(
  registry: ContinuousReceivedRegistry,
  fingerprint: string
): ContinuousReceivedCollection | undefined {
  return findReceivedAllByFingerprint(registry, fingerprint)[0];
}

export function findEquivalentReceivedCollection(
  registry: ContinuousReceivedRegistry,
  packageValue: ContinuousCollectionShareExport
): ContinuousReceivedCollection | undefined {
  const fingerprint = fingerprintContinuousSharePackage(packageValue);
  return findReceivedAllByFingerprint(registry, fingerprint)
    .find((record) => areContinuousSharePackagesEquivalent(record.package, packageValue));
}

export function keepReceivedCollection(
  registry: ContinuousReceivedRegistry,
  input: { id: string; package: ContinuousCollectionShareExport },
  receivedAt: string
): ContinuousReceivedRegistry {
  if (!input.id || !receivedAt) return registry;
  const fingerprint = fingerprintContinuousSharePackage(input.package);
  if (findEquivalentReceivedCollection(registry, input.package)) return registry;
  const record: ContinuousReceivedCollection = {
    id: input.id,
    fingerprint,
    status: 'active',
    package: {
      ...input.package,
      provenance: { ...input.package.provenance },
      collection: { ...input.package.collection },
      options: { ...input.package.options },
      items: input.package.items.map((item) => ({
        ...item,
        passageSummary: { ...item.passageSummary }
      })),
      notices: [...input.package.notices]
    },
    receivedAt,
    updatedAt: receivedAt
  };
  return {
    ...registry,
    records: [...registry.records, record],
    updatedAt: receivedAt
  };
}

function updateReceived(
  registry: ContinuousReceivedRegistry,
  recordId: string,
  updatedAt: string,
  updater: (record: ContinuousReceivedCollection) => ContinuousReceivedCollection
): ContinuousReceivedRegistry {
  if (!findReceivedCollection(registry, recordId)) return registry;
  return {
    ...registry,
    records: registry.records.map((record) => record.id === recordId ? updater(record) : record),
    updatedAt
  };
}

export function archiveReceivedCollection(
  registry: ContinuousReceivedRegistry,
  recordId: string,
  archivedAt: string
): ContinuousReceivedRegistry {
  return updateReceived(registry, recordId, archivedAt, (record) => record.status === 'archived'
    ? record
    : { ...record, status: 'archived', archivedAt, updatedAt: archivedAt });
}

export function reactivateReceivedCollection(
  registry: ContinuousReceivedRegistry,
  recordId: string,
  updatedAt: string
): ContinuousReceivedRegistry {
  return updateReceived(registry, recordId, updatedAt, (record) => record.status === 'active'
    ? record
    : { ...record, status: 'active', archivedAt: undefined, updatedAt });
}

export function removeReceivedCollection(
  registry: ContinuousReceivedRegistry,
  recordId: string,
  updatedAt: string
): ContinuousReceivedRegistry {
  if (!findReceivedCollection(registry, recordId)) return registry;
  return {
    ...registry,
    records: registry.records.filter((record) => record.id !== recordId),
    updatedAt
  };
}
