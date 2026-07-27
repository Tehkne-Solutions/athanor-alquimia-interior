export interface ContinuousTextVisibilityStats {
  nodes: number;
  strings: number;
  objectKeys: number;
  codePoints: number;
}

export interface ContinuousTextVisibilitySuccess {
  ok: true;
  stats: ContinuousTextVisibilityStats;
  message: string;
}

export interface ContinuousTextVisibilityFailure {
  ok: false;
  errors: string[];
}

export type ContinuousTextVisibilityResult = ContinuousTextVisibilitySuccess | ContinuousTextVisibilityFailure;

export interface ContinuousTextVisibilityOptions {
  normalization: 'NFC';
  maxInspectionNodes: number;
}

export const defaultContinuousTextVisibilityOptions: ContinuousTextVisibilityOptions = {
  normalization: 'NFC',
  maxInspectionNodes: 20_000
};

interface PendingValue {
  value: unknown;
  path: string;
}

function fail(message: string): ContinuousTextVisibilityFailure {
  return { ok: false, errors: [message] };
}

function formatCodePoint(codePoint: number): string {
  return `U+${codePoint.toString(16).toUpperCase().padStart(codePoint <= 0xFFFF ? 4 : 6, '0')}`;
}

function isNonCharacter(codePoint: number): boolean {
  return (codePoint >= 0xFDD0 && codePoint <= 0xFDEF)
    || (codePoint & 0xFFFF) === 0xFFFE
    || (codePoint & 0xFFFF) === 0xFFFF;
}

function prohibitedReason(codePoint: number): string | undefined {
  if ((codePoint >= 0x00 && codePoint <= 0x1F) && ![0x09, 0x0A, 0x0D].includes(codePoint)) {
    return 'controle C0 não permitido';
  }
  if (codePoint >= 0x7F && codePoint <= 0x9F) return 'controle DEL ou C1 não permitido';
  if (codePoint === 0x00AD) return 'soft hyphen invisível';
  if (codePoint === 0x034F) return 'juntor de grafemas invisível';
  if (codePoint === 0x061C) return 'marca árabe de direção';
  if (codePoint === 0x180E) return 'separador mongol invisível';
  if (codePoint >= 0x200B && codePoint <= 0x200F) return 'controle de largura zero ou direção';
  if (codePoint === 0x2028 || codePoint === 0x2029) return 'separador Unicode não permitido';
  if (codePoint >= 0x202A && codePoint <= 0x202E) return 'controle bidirecional de incorporação ou sobrescrita';
  if (codePoint >= 0x2060 && codePoint <= 0x2064) return 'operador ou juntor invisível';
  if (codePoint >= 0x2066 && codePoint <= 0x2069) return 'isolador bidirecional';
  if (codePoint === 0xFEFF) return 'BOM ou espaço sem quebra de largura zero';
  if (codePoint === 0xFFFD) return 'caractere de substituição de decodificação';
  if (codePoint >= 0xFFF9 && codePoint <= 0xFFFB) return 'anotação interlinear invisível';
  if (codePoint >= 0xE0000 && codePoint <= 0xE007F) return 'caractere de tag invisível';
  if (isNonCharacter(codePoint)) return 'não caractere Unicode';
  return undefined;
}

function inspectString(
  value: string,
  location: string,
  options: ContinuousTextVisibilityOptions
): { ok: true; codePoints: number } | ContinuousTextVisibilityFailure {
  for (let index = 0; index < value.length; index += 1) {
    const unit = value.charCodeAt(index);
    if (unit >= 0xD800 && unit <= 0xDBFF) {
      const next = value.charCodeAt(index + 1);
      if (!(next >= 0xDC00 && next <= 0xDFFF)) {
        return fail(`O texto em ${location} contém um substituto Unicode alto sem par.`);
      }
      index += 1;
      continue;
    }
    if (unit >= 0xDC00 && unit <= 0xDFFF) {
      return fail(`O texto em ${location} contém um substituto Unicode baixo sem par.`);
    }
  }

  if (value !== value.normalize(options.normalization)) {
    return fail(`O texto em ${location} não está normalizado em Unicode ${options.normalization} e não foi reescrito.`);
  }

  let codePoints = 0;
  for (const character of value) {
    const codePoint = character.codePointAt(0);
    if (codePoint === undefined) continue;
    codePoints += 1;
    const reason = prohibitedReason(codePoint);
    if (reason) {
      return fail(`O texto em ${location} contém ${formatCodePoint(codePoint)}: ${reason}.`);
    }
  }

  return { ok: true, codePoints };
}

function readDescriptors(value: object): PropertyDescriptorMap | ContinuousTextVisibilityFailure {
  try {
    return Object.getOwnPropertyDescriptors(value);
  } catch {
    return fail('A estrutura impediu a inspeção segura dos textos.');
  }
}

function readKeys(value: object): PropertyKey[] | ContinuousTextVisibilityFailure {
  try {
    return Reflect.ownKeys(value);
  } catch {
    return fail('A estrutura impediu a inspeção segura dos nomes de campos.');
  }
}

function isFailure<T extends object>(value: T | ContinuousTextVisibilityFailure): value is ContinuousTextVisibilityFailure {
  return 'ok' in value && value.ok === false;
}

function appendPath(path: string, key: string): string {
  return /^[A-Za-z_$][A-Za-z0-9_$-]*$/.test(key)
    ? `${path}.${key}`
    : `${path}[${JSON.stringify(key)}]`;
}

export function validateContinuousTextVisibility(
  input: unknown,
  options: ContinuousTextVisibilityOptions = defaultContinuousTextVisibilityOptions
): ContinuousTextVisibilityResult {
  const pending: PendingValue[] = [{ value: input, path: '$' }];
  const visited = new WeakSet<object>();
  const stats: ContinuousTextVisibilityStats = { nodes: 0, strings: 0, objectKeys: 0, codePoints: 0 };

  while (pending.length > 0) {
    const current = pending.pop();
    if (!current) break;
    stats.nodes += 1;
    if (stats.nodes > options.maxInspectionNodes) {
      return fail(`A inspeção textual excedeu ${options.maxInspectionNodes} nós.`);
    }

    if (typeof current.value === 'string') {
      const inspected = inspectString(current.value, current.path, options);
      if (!inspected.ok) return inspected;
      stats.strings += 1;
      stats.codePoints += inspected.codePoints;
      continue;
    }

    if (typeof current.value !== 'object' || current.value === null) continue;
    if (visited.has(current.value)) {
      return fail(`A inspeção textual encontrou uma referência repetida ou circular em ${current.path}.`);
    }
    visited.add(current.value);

    const keys = readKeys(current.value);
    if (isFailure(keys)) return keys;
    const descriptors = readDescriptors(current.value);
    if (isFailure(descriptors)) return descriptors;

    for (const propertyKey of keys) {
      if (typeof propertyKey !== 'string') {
        const kind = typeof propertyKey === 'symbol' ? 'simbólica' : 'não textual';
        return fail(`A inspeção textual encontrou uma chave ${kind} em ${current.path}.`);
      }
      if (Array.isArray(current.value) && propertyKey === 'length') continue;

      const keyInspection = inspectString(propertyKey, `nome de campo em ${current.path}`, options);
      if (!keyInspection.ok) return keyInspection;
      stats.objectKeys += 1;
      stats.codePoints += keyInspection.codePoints;

      const descriptor = descriptors[propertyKey];
      if (!descriptor || !('value' in descriptor)) {
        return fail(`A inspeção textual recusou um acessor em ${appendPath(current.path, propertyKey)}.`);
      }
      pending.push({ value: descriptor.value, path: appendPath(current.path, propertyKey) });
    }
  }

  return {
    ok: true,
    stats,
    message: `Texto visível e Unicode NFC confirmado em ${stats.strings} valores e ${stats.objectKeys} nomes de campos, sem reescrita.`
  };
}
