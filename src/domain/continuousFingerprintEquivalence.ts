import type { ContinuousCollectionShareExport, ContinuousShareItem } from './continuousShare';

export type ContinuousFingerprintComparison =
  | 'different-fingerprint'
  | 'equivalent-copy'
  | 'descriptive-collision';

export interface ContinuousFingerprintValidationSuccess {
  ok: true;
  checked: boolean;
  message: string;
}

export interface ContinuousFingerprintValidationFailure {
  ok: false;
  errors: string[];
}

export type ContinuousFingerprintValidationResult =
  | ContinuousFingerprintValidationSuccess
  | ContinuousFingerprintValidationFailure;

const canonicalFingerprintPattern = /^received-[0-9a-f]{8}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function ownDataValue(record: Record<string, unknown>, key: string): { found: boolean; accessor: boolean; value?: unknown } {
  const descriptor = Object.getOwnPropertyDescriptor(record, key);
  if (!descriptor) return { found: false, accessor: false };
  if (!('value' in descriptor)) return { found: true, accessor: true };
  return { found: true, accessor: false, value: descriptor.value };
}

export function isCanonicalContinuousFingerprint(value: unknown): value is string {
  return typeof value === 'string' && canonicalFingerprintPattern.test(value);
}

function canonicalItem(item: ContinuousShareItem) {
  return {
    position: item.position,
    kind: item.kind,
    startPoint: item.startPoint,
    themeId: item.themeId ?? null,
    noTheme: item.noTheme,
    variantId: item.variantId,
    packageId: item.packageId ?? null,
    packageLabel: item.packageLabel ?? null,
    status: item.status,
    depth: item.depth ?? null,
    endedEarly: item.endedEarly,
    passageSummary: {
      completed: item.passageSummary.completed,
      passed: item.passageSummary.passed,
      pending: item.passageSummary.pending
    },
    occurredAt: item.occurredAt ?? null,
    completedAt: item.completedAt ?? null
  };
}

function fingerprintPayload(value: ContinuousCollectionShareExport): string {
  return JSON.stringify({
    schema: value.schema,
    policy: value.policy,
    catalogVersion: value.catalogVersion,
    provenance: value.provenance,
    collection: value.collection,
    options: value.options,
    items: value.items
  });
}

export function fingerprintContinuousSharePackage(value: ContinuousCollectionShareExport): string {
  const input = fingerprintPayload(value);
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `received-${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

export function continuousShareEquivalenceKey(value: ContinuousCollectionShareExport): string {
  return JSON.stringify({
    schema: value.schema,
    policy: value.policy,
    catalogVersion: value.catalogVersion,
    provenance: {
      product: value.provenance.product,
      author: value.provenance.author,
      transmission: value.provenance.transmission
    },
    collection: {
      templateId: value.collection.templateId,
      label: value.collection.label,
      status: value.collection.status,
      itemCount: value.collection.itemCount
    },
    options: {
      includeDates: value.options.includeDates
    },
    items: value.items.map(canonicalItem),
    notices: [...value.notices]
  });
}

export function areContinuousSharePackagesEquivalent(
  left: ContinuousCollectionShareExport,
  right: ContinuousCollectionShareExport
): boolean {
  return continuousShareEquivalenceKey(left) === continuousShareEquivalenceKey(right);
}

export function compareContinuousSharePackages(
  left: ContinuousCollectionShareExport,
  right: ContinuousCollectionShareExport
): ContinuousFingerprintComparison {
  if (fingerprintContinuousSharePackage(left) !== fingerprintContinuousSharePackage(right)) {
    return 'different-fingerprint';
  }
  return areContinuousSharePackagesEquivalent(left, right)
    ? 'equivalent-copy'
    : 'descriptive-collision';
}

export function validateContinuousResponseFingerprint(input: unknown): ContinuousFingerprintValidationResult {
  if (!isRecord(input)) {
    return { ok: true, checked: false, message: 'Impressão descritiva será conferida após o formato básico.' };
  }

  const sourceDescriptor = ownDataValue(input, 'source');
  if (sourceDescriptor.accessor) {
    return { ok: false, errors: ['source usa um acessor e não pode ser lido como impressão inerte.'] };
  }
  if (!sourceDescriptor.found || !isRecord(sourceDescriptor.value)) {
    return { ok: true, checked: false, message: 'Impressão descritiva será conferida após a referência de origem.' };
  }

  const fingerprintDescriptor = ownDataValue(sourceDescriptor.value, 'fingerprint');
  if (fingerprintDescriptor.accessor) {
    return { ok: false, errors: ['source.fingerprint usa um acessor e não pode ser executado.'] };
  }
  if (!fingerprintDescriptor.found || typeof fingerprintDescriptor.value !== 'string') {
    return { ok: true, checked: false, message: 'Impressão descritiva será conferida pelo parser de domínio.' };
  }
  if (!isCanonicalContinuousFingerprint(fingerprintDescriptor.value)) {
    return {
      ok: false,
      errors: ['source.fingerprint precisa usar received- seguido de oito hexadecimais minúsculos.']
    };
  }

  return {
    ok: true,
    checked: true,
    message: 'Impressão descritiva em formato canônico confirmada; ela pode colidir e não autentica origem.'
  };
}
