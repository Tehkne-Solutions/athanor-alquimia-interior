export interface ContinuousConsistencySeal {
  version: '1.0.0';
  algorithm: 'fnv1a-32';
  scope: 'top-level-without-consistency';
  checksum: string;
  cryptographic: false;
  authenticatesIdentity: false;
}

export type ContinuousConsistencyStatus = 'valid' | 'missing' | 'invalid' | 'unsupported';

export interface ContinuousConsistencyVerification {
  status: ContinuousConsistencyStatus;
  expected?: string;
  received?: string;
  message: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function canonicalize(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) {
    return `[${value.map((entry) => entry === undefined ? 'null' : canonicalize(entry)).join(',')}]`;
  }

  switch (typeof value) {
    case 'string':
    case 'boolean':
      return JSON.stringify(value);
    case 'number':
      return Number.isFinite(value) ? JSON.stringify(value) : 'null';
    case 'object': {
      const record = value as Record<string, unknown>;
      const entries = Object.keys(record)
        .filter((key) => record[key] !== undefined)
        .sort()
        .map((key) => `${JSON.stringify(key)}:${canonicalize(record[key])}`);
      return `{${entries.join(',')}}`;
    }
    default:
      return 'null';
  }
}

function withoutTopLevelConsistency(value: object): Record<string, unknown> {
  const record = value as Record<string, unknown>;
  return Object.fromEntries(Object.entries(record).filter(([key]) => key !== 'consistency'));
}

export function canonicalizeContinuousPayload(value: object): string {
  return canonicalize(withoutTopLevelConsistency(value));
}

export function computeContinuousConsistencyChecksum(value: object): string {
  const input = canonicalizeContinuousPayload(value);
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a32-${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

export function createContinuousConsistencySeal(value: object): ContinuousConsistencySeal {
  return {
    version: '1.0.0',
    algorithm: 'fnv1a-32',
    scope: 'top-level-without-consistency',
    checksum: computeContinuousConsistencyChecksum(value),
    cryptographic: false,
    authenticatesIdentity: false
  };
}

export function attachContinuousConsistency<T extends object>(value: T): T & { consistency: ContinuousConsistencySeal } {
  const payload = withoutTopLevelConsistency(value);
  return {
    ...value,
    consistency: createContinuousConsistencySeal(payload)
  };
}

export function verifyContinuousConsistency(value: unknown): ContinuousConsistencyVerification {
  if (!isRecord(value)) {
    return { status: 'invalid', message: 'O conteúdo não possui formato de objeto verificável.' };
  }
  if (value.consistency === undefined) {
    return {
      status: 'missing',
      message: 'Arquivo legado sem selo local de consistência.'
    };
  }
  if (!isRecord(value.consistency)) {
    return { status: 'invalid', message: 'O selo local de consistência possui formato inválido.' };
  }

  const seal = value.consistency;
  if (
    seal.version !== '1.0.0'
    || seal.algorithm !== 'fnv1a-32'
    || seal.scope !== 'top-level-without-consistency'
    || seal.cryptographic !== false
    || seal.authenticatesIdentity !== false
    || typeof seal.checksum !== 'string'
  ) {
    return {
      status: 'unsupported',
      received: typeof seal.checksum === 'string' ? seal.checksum : undefined,
      message: 'O selo usa versão, algoritmo ou declarações incompatíveis.'
    };
  }

  const expected = computeContinuousConsistencyChecksum(value);
  if (seal.checksum !== expected) {
    return {
      status: 'invalid',
      expected,
      received: seal.checksum,
      message: 'O conteúdo mudou depois da geração do selo local.'
    };
  }

  return {
    status: 'valid',
    expected,
    received: seal.checksum,
    message: 'O conteúdo corresponde ao selo local, sem autenticar identidade ou autoria.'
  };
}
