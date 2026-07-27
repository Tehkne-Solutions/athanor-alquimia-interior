import { continuousStrictContractCatalog } from '../content/continuousStrictContract';

export type ContinuousContractNode =
  | { kind: 'scalar' }
  | { kind: 'array'; item: ContinuousContractNode }
  | { kind: 'object'; fields: Record<string, ContinuousContractNode> };

export interface ContinuousStrictContractStats {
  objects: number;
  arrays: number;
  knownFields: number;
  unknownFields: number;
  maxDepth: number;
}

export interface ContinuousStrictContractSuccess {
  ok: true;
  stats: ContinuousStrictContractStats;
  message: string;
}

export interface ContinuousStrictContractFailure {
  ok: false;
  errors: string[];
  unknownPaths: string[];
  truncated: boolean;
}

export type ContinuousStrictContractResult = ContinuousStrictContractSuccess | ContinuousStrictContractFailure;

const scalar: ContinuousContractNode = { kind: 'scalar' };
const consistency: ContinuousContractNode = {
  kind: 'object',
  fields: {
    version: scalar,
    algorithm: scalar,
    scope: scalar,
    checksum: scalar,
    cryptographic: scalar,
    authenticatesIdentity: scalar
  }
};

export const continuousShareContractV1: ContinuousContractNode = {
  kind: 'object',
  fields: {
    schema: scalar,
    policy: scalar,
    catalogVersion: scalar,
    generatedAt: scalar,
    provenance: {
      kind: 'object',
      fields: { product: scalar, author: scalar, transmission: scalar }
    },
    collection: {
      kind: 'object',
      fields: { templateId: scalar, label: scalar, status: scalar, itemCount: scalar }
    },
    options: {
      kind: 'object',
      fields: { includeDates: scalar }
    },
    items: {
      kind: 'array',
      item: {
        kind: 'object',
        fields: {
          position: scalar,
          kind: scalar,
          startPoint: scalar,
          themeId: scalar,
          noTheme: scalar,
          variantId: scalar,
          packageId: scalar,
          packageLabel: scalar,
          status: scalar,
          depth: scalar,
          endedEarly: scalar,
          passageSummary: {
            kind: 'object',
            fields: { completed: scalar, passed: scalar, pending: scalar }
          },
          occurredAt: scalar,
          completedAt: scalar
        }
      }
    },
    notices: { kind: 'array', item: scalar },
    consistency
  }
};

export const continuousResponseContractV1: ContinuousContractNode = {
  kind: 'object',
  fields: {
    schema: scalar,
    policy: scalar,
    catalogVersion: scalar,
    generatedAt: scalar,
    provenance: {
      kind: 'object',
      fields: { product: scalar, author: scalar, transmission: scalar }
    },
    source: {
      kind: 'object',
      fields: { fingerprint: scalar, collectionLabel: scalar, itemCount: scalar, status: scalar }
    },
    gesture: {
      kind: 'object',
      fields: { id: scalar, label: scalar, statement: scalar }
    },
    expectation: {
      kind: 'object',
      fields: { replyRequired: scalar, deliveryTracked: scalar, recipientStored: scalar }
    },
    notices: { kind: 'array', item: scalar },
    consistency
  }
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function safeKeyLabel(key: PropertyKey): string {
  if (typeof key === 'symbol') return '[symbol]';
  const text = String(key);
  const pieces: string[] = [];
  let count = 0;
  for (const character of text) {
    if (count >= 48) {
      pieces.push('...');
      break;
    }
    const codePoint = character.codePointAt(0) ?? 0;
    if (codePoint >= 0x20 && codePoint <= 0x7E && character !== '\\' && character !== '"') {
      pieces.push(character);
    } else if (character === '\\') {
      pieces.push('\\\\');
    } else if (character === '"') {
      pieces.push('\\"');
    } else {
      pieces.push(`\\u{${codePoint.toString(16).toUpperCase()}}`);
    }
    count += 1;
  }
  return `"${pieces.join('')}"`;
}

function appendObjectPath(path: string, key: PropertyKey): string {
  return `${path}[${safeKeyLabel(key)}]`;
}

export function validateContinuousStrictContract(
  input: unknown,
  contract: ContinuousContractNode,
  label: string
): ContinuousStrictContractResult {
  const maxReports = continuousStrictContractCatalog.maxReportedUnknownFields;
  const stack: Array<{ value: unknown; node: ContinuousContractNode; path: string; depth: number }> = [
    { value: input, node: contract, path: '$', depth: 0 }
  ];
  const unknownPaths: string[] = [];
  const stats: ContinuousStrictContractStats = {
    objects: 0,
    arrays: 0,
    knownFields: 0,
    unknownFields: 0,
    maxDepth: 0
  };

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) break;
    stats.maxDepth = Math.max(stats.maxDepth, current.depth);

    if (current.node.kind === 'scalar') continue;

    if (current.node.kind === 'array') {
      if (!Array.isArray(current.value)) continue;
      stats.arrays += 1;
      for (let index = current.value.length - 1; index >= 0; index -= 1) {
        stack.push({
          value: current.value[index],
          node: current.node.item,
          path: `${current.path}[${index}]`,
          depth: current.depth + 1
        });
      }
      continue;
    }

    if (!isRecord(current.value)) continue;
    stats.objects += 1;
    let keys: PropertyKey[];
    try {
      keys = Reflect.ownKeys(current.value);
    } catch {
      return {
        ok: false,
        errors: [`${label}: não foi possível inspecionar os campos em ${current.path}.`],
        unknownPaths: [],
        truncated: false
      };
    }

    for (let index = keys.length - 1; index >= 0; index -= 1) {
      const key = keys[index];
      const path = appendObjectPath(current.path, key);
      if (typeof key !== 'string' || !Object.prototype.hasOwnProperty.call(current.node.fields, key)) {
        stats.unknownFields += 1;
        if (unknownPaths.length < maxReports) unknownPaths.push(path);
        continue;
      }

      stats.knownFields += 1;
      let descriptor: PropertyDescriptor | undefined;
      try {
        descriptor = Object.getOwnPropertyDescriptor(current.value, key);
      } catch {
        return {
          ok: false,
          errors: [`${label}: não foi possível inspecionar o campo ${path}.`],
          unknownPaths,
          truncated: stats.unknownFields > unknownPaths.length
        };
      }
      if (!descriptor || !('value' in descriptor)) continue;
      stack.push({
        value: descriptor.value,
        node: current.node.fields[key],
        path,
        depth: current.depth + 1
      });
    }
  }

  if (stats.unknownFields > 0) {
    const truncated = stats.unknownFields > unknownPaths.length;
    const errors = unknownPaths.map((path) => `${label}: campo não reconhecido em ${path}.`);
    if (truncated) {
      errors.push(`${label}: outros ${stats.unknownFields - unknownPaths.length} campos desconhecidos foram omitidos do diagnóstico.`);
    }
    return { ok: false, errors, unknownPaths, truncated };
  }

  return {
    ok: true,
    stats,
    message: `${label}: contrato estrito confirmado em ${stats.objects} objetos e ${stats.knownFields} campos conhecidos.`
  };
}

export function validateContinuousShareStrictContract(input: unknown): ContinuousStrictContractResult {
  return validateContinuousStrictContract(input, continuousShareContractV1, 'Pacote de partilha');
}

export function validateContinuousResponseStrictContract(input: unknown): ContinuousStrictContractResult {
  return validateContinuousStrictContract(input, continuousResponseContractV1, 'Pacote de resposta');
}
