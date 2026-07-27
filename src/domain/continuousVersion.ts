export interface ContinuousSemanticVersion {
  major: number;
  minor: number;
  patch: number;
  normalized: string;
}

export type ContinuousVersionStatus =
  | 'current'
  | 'supported-legacy'
  | 'future'
  | 'unsupported-older'
  | 'malformed';

export interface ContinuousVersionPolicy {
  currentVersion: string;
  supportedLegacyVersions: readonly string[];
  label: string;
}

export interface ContinuousVersionAssessment {
  ok: boolean;
  status: ContinuousVersionStatus;
  received?: string;
  current: string;
  message: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parseContinuousSemanticVersion(value: unknown): ContinuousSemanticVersion | undefined {
  if (typeof value !== 'string') return undefined;
  const match = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.exec(value);
  if (!match) return undefined;
  const major = Number(match[1]);
  const minor = Number(match[2]);
  const patch = Number(match[3]);
  if (![major, minor, patch].every(Number.isSafeInteger)) return undefined;
  return { major, minor, patch, normalized: `${major}.${minor}.${patch}` };
}

export function compareContinuousSemanticVersions(
  left: ContinuousSemanticVersion,
  right: ContinuousSemanticVersion
): -1 | 0 | 1 {
  if (left.major !== right.major) return left.major < right.major ? -1 : 1;
  if (left.minor !== right.minor) return left.minor < right.minor ? -1 : 1;
  if (left.patch !== right.patch) return left.patch < right.patch ? -1 : 1;
  return 0;
}

export function readContinuousCatalogVersion(input: unknown): unknown {
  return isRecord(input) ? input.catalogVersion : undefined;
}

export function assessContinuousCatalogVersion(
  receivedValue: unknown,
  policy: ContinuousVersionPolicy
): ContinuousVersionAssessment {
  const current = parseContinuousSemanticVersion(policy.currentVersion);
  if (!current) {
    return {
      ok: false,
      status: 'malformed',
      current: policy.currentVersion,
      message: `A matriz interna de ${policy.label} possui versão atual inválida.`
    };
  }

  const received = parseContinuousSemanticVersion(receivedValue);
  if (!received) {
    return {
      ok: false,
      status: 'malformed',
      received: typeof receivedValue === 'string' ? receivedValue : undefined,
      current: current.normalized,
      message: `A versão declarada de ${policy.label} não usa SemVer estrito X.Y.Z.`
    };
  }

  if (received.normalized === current.normalized) {
    return {
      ok: true,
      status: 'current',
      received: received.normalized,
      current: current.normalized,
      message: `${policy.label} usa a versão atual ${current.normalized}.`
    };
  }

  if (policy.supportedLegacyVersions.includes(received.normalized)) {
    return {
      ok: true,
      status: 'supported-legacy',
      received: received.normalized,
      current: current.normalized,
      message: `${policy.label} usa a versão legada ${received.normalized}, aceita por regra explícita sem reescrever o arquivo original.`
    };
  }

  const comparison = compareContinuousSemanticVersions(received, current);
  if (comparison > 0) {
    return {
      ok: false,
      status: 'future',
      received: received.normalized,
      current: current.normalized,
      message: `${policy.label} usa a versão futura ${received.normalized}; o Athanor atual reconhece ${current.normalized} e não executa downgrade.`
    };
  }

  return {
    ok: false,
    status: 'unsupported-older',
    received: received.normalized,
    current: current.normalized,
    message: `${policy.label} usa a versão antiga ${received.normalized}, mas não existe migração explícita e testada para ela.`
  };
}
