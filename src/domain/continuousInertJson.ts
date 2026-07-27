export interface ContinuousInertJsonSuccess {
  ok: true;
  inspectedNodes: number;
  message: string;
}

export interface ContinuousInertJsonFailure {
  ok: false;
  errors: string[];
}

export type ContinuousInertJsonResult = ContinuousInertJsonSuccess | ContinuousInertJsonFailure;

export interface ContinuousInertJsonOptions {
  maxInspectionNodes: number;
  dangerousKeys: readonly string[];
}

export const defaultContinuousInertJsonOptions: ContinuousInertJsonOptions = {
  maxInspectionNodes: 10_000,
  dangerousKeys: ['__proto__', 'prototype', 'constructor']
};

interface PendingValue {
  value: unknown;
  path: string;
}

function fail(message: string): ContinuousInertJsonFailure {
  return { ok: false, errors: [message] };
}

function inspectOwnDescriptors(value: object): PropertyDescriptorMap | ContinuousInertJsonFailure {
  try {
    return Object.getOwnPropertyDescriptors(value);
  } catch {
    return fail('A estrutura impediu a leitura segura de seus descritores próprios.');
  }
}

function inspectPrototype(value: object): object | null | ContinuousInertJsonFailure {
  try {
    return Object.getPrototypeOf(value);
  } catch {
    return fail('A estrutura impediu a conferência segura de seu protótipo.');
  }
}

function inspectOwnKeys(value: object): PropertyKey[] | ContinuousInertJsonFailure {
  try {
    return Reflect.ownKeys(value);
  } catch {
    return fail('A estrutura impediu a conferência segura de suas chaves próprias.');
  }
}

function isFailure<T extends object>(value: T | ContinuousInertJsonFailure): value is ContinuousInertJsonFailure {
  return 'ok' in value && value.ok === false;
}

function isCanonicalArrayIndex(key: string, length: number): boolean {
  if (!/^(0|[1-9]\d*)$/.test(key)) return false;
  const index = Number(key);
  return Number.isSafeInteger(index) && index >= 0 && index < length && String(index) === key;
}

export function validateContinuousInertJson(
  input: unknown,
  options: ContinuousInertJsonOptions = defaultContinuousInertJsonOptions
): ContinuousInertJsonResult {
  const pending: PendingValue[] = [{ value: input, path: '$' }];
  const seen = new WeakSet<object>();
  let inspectedNodes = 0;

  while (pending.length > 0) {
    const current = pending.pop();
    if (!current) break;
    inspectedNodes += 1;
    if (inspectedNodes > options.maxInspectionNodes) {
      return fail(`A conferência de forma excedeu ${options.maxInspectionNodes} nós.`);
    }

    if (current.value === null) continue;

    switch (typeof current.value) {
      case 'string':
      case 'boolean':
        continue;
      case 'number':
        if (!Number.isFinite(current.value)) {
          return fail(`Um número não finito foi recusado em ${current.path}.`);
        }
        continue;
      case 'undefined':
        return fail(`Um valor undefined foi recusado em ${current.path}.`);
      case 'bigint':
        return fail(`Um valor bigint foi recusado em ${current.path}.`);
      case 'symbol':
        return fail(`Um símbolo foi recusado em ${current.path}.`);
      case 'function':
        return fail(`Uma função foi recusada em ${current.path}.`);
      case 'object':
        break;
      default:
        return fail(`Um valor não reconhecido foi recusado em ${current.path}.`);
    }

    const objectValue = current.value as object;
    if (seen.has(objectValue)) {
      return fail(`Uma referência repetida ou circular foi recusada em ${current.path}.`);
    }
    seen.add(objectValue);

    const prototype = inspectPrototype(objectValue);
    if (isFailure(prototype)) return prototype;

    const ownKeys = inspectOwnKeys(objectValue);
    if (isFailure(ownKeys)) return ownKeys;
    if (ownKeys.some((key) => typeof key === 'symbol')) {
      return fail(`Uma propriedade simbólica foi recusada em ${current.path}.`);
    }

    const descriptors = inspectOwnDescriptors(objectValue);
    if (isFailure(descriptors)) return descriptors;

    if (Array.isArray(objectValue)) {
      if (prototype !== Array.prototype) {
        return fail(`Um array com protótipo especial foi recusado em ${current.path}.`);
      }

      for (let index = 0; index < objectValue.length; index += 1) {
        if (!Object.prototype.hasOwnProperty.call(objectValue, index)) {
          return fail(`Um espaço vazio de array foi recusado em ${current.path}[${index}].`);
        }
      }

      for (const key of ownKeys) {
        if (typeof key !== 'string' || key === 'length') continue;
        if (!isCanonicalArrayIndex(key, objectValue.length)) {
          return fail(`Uma propriedade extra de array foi recusada em ${current.path}.${key}.`);
        }
        const descriptor = descriptors[key];
        if (!descriptor || !('value' in descriptor) || !descriptor.enumerable) {
          return fail(`Uma propriedade de array não é dado enumerável em ${current.path}[${key}].`);
        }
        pending.push({ value: descriptor.value, path: `${current.path}[${key}]` });
      }
      continue;
    }

    if (prototype !== Object.prototype && prototype !== null) {
      const label = prototype?.constructor?.name ?? 'desconhecido';
      return fail(`Um objeto com protótipo especial (${label}) foi recusado em ${current.path}.`);
    }

    for (const key of ownKeys) {
      if (typeof key !== 'string') continue;
      if (options.dangerousKeys.includes(key)) {
        return fail(`A chave reservada ${key} foi recusada em ${current.path}.`);
      }
      const descriptor = descriptors[key];
      if (!descriptor || !('value' in descriptor)) {
        return fail(`Um getter ou setter foi recusado em ${current.path}.${key}.`);
      }
      if (!descriptor.enumerable) {
        return fail(`Uma propriedade não enumerável foi recusada em ${current.path}.${key}.`);
      }
      pending.push({ value: descriptor.value, path: `${current.path}.${key}` });
    }
  }

  return {
    ok: true,
    inspectedNodes,
    message: `Forma JSON inerte confirmada em ${inspectedNodes} nós, sem autenticar conteúdo ou origem.`
  };
}
