import { validateContinuousInertJson } from './continuousInertJson';
import { validateContinuousTextVisibility } from './continuousTextVisibility';

export interface ContinuousResourceLimits {
  maxFileBytes: number;
  maxTextCharacters: number;
  maxDepth: number;
  maxNodes: number;
  maxArrayLength: number;
  maxObjectKeys: number;
  maxStringLength: number;
  maxTotalStringCharacters: number;
}

export interface ContinuousResourceStats {
  nodes: number;
  maxDepth: number;
  totalStringCharacters: number;
}

export interface ContinuousResourceSuccess {
  ok: true;
  stats: ContinuousResourceStats;
  message: string;
}

export interface ContinuousResourceFailure {
  ok: false;
  errors: string[];
}

export type ContinuousResourceResult = ContinuousResourceSuccess | ContinuousResourceFailure;

export interface ContinuousReadableFile {
  size: number;
  text(): Promise<string>;
}

export interface ContinuousJsonReadSuccess {
  ok: true;
  value: unknown;
  stats: ContinuousResourceStats;
}

export interface ContinuousJsonReadFailure {
  ok: false;
  errors: string[];
}

export type ContinuousJsonReadResult = ContinuousJsonReadSuccess | ContinuousJsonReadFailure;

export const defaultContinuousResourceLimits: ContinuousResourceLimits = {
  maxFileBytes: 524_288,
  maxTextCharacters: 524_288,
  maxDepth: 16,
  maxNodes: 10_000,
  maxArrayLength: 1_000,
  maxObjectKeys: 64,
  maxStringLength: 8_192,
  maxTotalStringCharacters: 262_144
};

function formatLimit(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

export function validateContinuousFileSize(
  size: number,
  limits: ContinuousResourceLimits = defaultContinuousResourceLimits
): ContinuousResourceFailure | { ok: true } {
  if (!Number.isFinite(size) || size < 0) {
    return { ok: false, errors: ['O tamanho do arquivo é inválido.'] };
  }
  if (size > limits.maxFileBytes) {
    return {
      ok: false,
      errors: [`O arquivo excede o limite local de ${formatLimit(limits.maxFileBytes)} bytes e não foi lido.`]
    };
  }
  return { ok: true };
}

export function validateContinuousRawText(
  text: string,
  limits: ContinuousResourceLimits = defaultContinuousResourceLimits
): ContinuousResourceFailure | { ok: true } {
  if (text.length === 0) return { ok: false, errors: ['O arquivo JSON está vazio.'] };
  if (text.length > limits.maxTextCharacters) {
    return {
      ok: false,
      errors: [`O texto excede o limite local de ${formatLimit(limits.maxTextCharacters)} caracteres.`]
    };
  }
  return { ok: true };
}

export function inspectContinuousResourceBudget(
  input: unknown,
  limits: ContinuousResourceLimits = defaultContinuousResourceLimits
): ContinuousResourceResult {
  const stack: Array<{ value: unknown; depth: number; path: string }> = [{ value: input, depth: 0, path: '$' }];
  const visited = new WeakSet<object>();
  const stats: ContinuousResourceStats = { nodes: 0, maxDepth: 0, totalStringCharacters: 0 };

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) break;
    stats.nodes += 1;
    stats.maxDepth = Math.max(stats.maxDepth, current.depth);

    if (stats.nodes > limits.maxNodes) {
      return { ok: false, errors: [`A estrutura excede o limite de ${formatLimit(limits.maxNodes)} nós.`] };
    }
    if (current.depth > limits.maxDepth) {
      return { ok: false, errors: [`A estrutura excede a profundidade máxima de ${limits.maxDepth} níveis em ${current.path}.`] };
    }

    if (typeof current.value === 'string') {
      if (current.value.length > limits.maxStringLength) {
        return { ok: false, errors: [`Um texto em ${current.path} excede ${formatLimit(limits.maxStringLength)} caracteres.`] };
      }
      stats.totalStringCharacters += current.value.length;
      if (stats.totalStringCharacters > limits.maxTotalStringCharacters) {
        return { ok: false, errors: [`A soma dos textos excede ${formatLimit(limits.maxTotalStringCharacters)} caracteres.`] };
      }
      continue;
    }

    if (typeof current.value !== 'object' || current.value === null) continue;
    if (visited.has(current.value)) {
      return { ok: false, errors: [`A estrutura contém uma referência circular em ${current.path}.`] };
    }
    visited.add(current.value);

    if (Array.isArray(current.value)) {
      if (current.value.length > limits.maxArrayLength) {
        return { ok: false, errors: [`Uma lista em ${current.path} excede ${formatLimit(limits.maxArrayLength)} itens.`] };
      }
      for (let index = current.value.length - 1; index >= 0; index -= 1) {
        stack.push({ value: current.value[index], depth: current.depth + 1, path: `${current.path}[${index}]` });
      }
      continue;
    }

    const entries = Object.entries(current.value as Record<string, unknown>);
    if (entries.length > limits.maxObjectKeys) {
      return { ok: false, errors: [`Um objeto em ${current.path} excede ${limits.maxObjectKeys} campos.`] };
    }
    for (let index = entries.length - 1; index >= 0; index -= 1) {
      const [key, value] = entries[index];
      if (key.length > limits.maxStringLength) {
        return { ok: false, errors: [`Um nome de campo em ${current.path} excede o limite permitido.`] };
      }
      stack.push({ value, depth: current.depth + 1, path: `${current.path}.${key}` });
    }
  }

  return {
    ok: true,
    stats,
    message: `Estrutura dentro dos limites locais: ${stats.nodes} nós, profundidade ${stats.maxDepth} e ${stats.totalStringCharacters} caracteres de texto.`
  };
}

export async function readContinuousJsonFile(
  file: ContinuousReadableFile,
  limits: ContinuousResourceLimits = defaultContinuousResourceLimits
): Promise<ContinuousJsonReadResult> {
  const sizeResult = validateContinuousFileSize(file.size, limits);
  if (!sizeResult.ok) return sizeResult;

  let text: string;
  try {
    text = await file.text();
  } catch {
    return { ok: false, errors: ['Não foi possível ler o arquivo local.'] };
  }

  const textResult = validateContinuousRawText(text, limits);
  if (!textResult.ok) return textResult;

  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return { ok: false, errors: ['Não foi possível interpretar o arquivo como JSON.'] };
  }

  const inertResult = validateContinuousInertJson(value);
  if (!inertResult.ok) {
    return { ok: false, errors: inertResult.errors.map((error) => `Forma JSON recusada: ${error}`) };
  }

  const structureResult = inspectContinuousResourceBudget(value, limits);
  if (!structureResult.ok) return structureResult;

  const visibleText = validateContinuousTextVisibility(value);
  if (!visibleText.ok) {
    return { ok: false, errors: visibleText.errors.map((error) => `Texto recusado: ${error}`) };
  }

  return { ok: true, value, stats: structureResult.stats };
}
