import { continuousExactTextCatalog } from '../content/continuousExactText';

export interface ContinuousExactTextStats {
  strings: number;
  exactStrings: number;
  boundaryIssues: number;
  containers: number;
  maxDepth: number;
}

export interface ContinuousExactTextSuccess {
  ok: true;
  stats: ContinuousExactTextStats;
  message: string;
}

export interface ContinuousExactTextFailure {
  ok: false;
  errors: string[];
  issuePaths: string[];
  truncated: boolean;
  stats: ContinuousExactTextStats;
}

export type ContinuousExactTextResult = ContinuousExactTextSuccess | ContinuousExactTextFailure;

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

function appendPath(path: string, key: PropertyKey): string {
  return `${path}[${safeKeyLabel(key)}]`;
}

function describeBoundary(value: string): string | undefined {
  const leadingUnits = value.length - value.trimStart().length;
  const trailingUnits = value.length - value.trimEnd().length;
  if (leadingUnits === 0 && trailingUnits === 0) return undefined;
  if (leadingUnits > 0 && trailingUnits > 0) {
    return `possui margem inicial (${leadingUnits}) e final (${trailingUnits})`;
  }
  if (leadingUnits > 0) return `possui margem inicial (${leadingUnits})`;
  return `possui margem final (${trailingUnits})`;
}

export function validateContinuousExactText(
  input: unknown,
  label = 'Pacote'
): ContinuousExactTextResult {
  const maxReports = continuousExactTextCatalog.maxReportedIssues;
  const stack: Array<{ value: unknown; path: string; depth: number }> = [
    { value: input, path: '$', depth: 0 }
  ];
  const seen = new WeakSet<object>();
  const issuePaths: string[] = [];
  const errors: string[] = [];
  const stats: ContinuousExactTextStats = {
    strings: 0,
    exactStrings: 0,
    boundaryIssues: 0,
    containers: 0,
    maxDepth: 0
  };

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) break;
    stats.maxDepth = Math.max(stats.maxDepth, current.depth);

    if (typeof current.value === 'string') {
      stats.strings += 1;
      const boundary = describeBoundary(current.value);
      if (!boundary) {
        stats.exactStrings += 1;
        continue;
      }
      stats.boundaryIssues += 1;
      if (issuePaths.length < maxReports) {
        issuePaths.push(current.path);
        errors.push(`${label}: texto em ${current.path} ${boundary}; nenhuma margem foi removida.`);
      }
      continue;
    }

    if (typeof current.value !== 'object' || current.value === null) continue;
    if (seen.has(current.value)) continue;
    seen.add(current.value);
    stats.containers += 1;

    if (Array.isArray(current.value)) {
      for (let index = current.value.length - 1; index >= 0; index -= 1) {
        let descriptor: PropertyDescriptor | undefined;
        try {
          descriptor = Object.getOwnPropertyDescriptor(current.value, String(index));
        } catch {
          continue;
        }
        if (!descriptor || !('value' in descriptor)) continue;
        stack.push({ value: descriptor.value, path: `${current.path}[${index}]`, depth: current.depth + 1 });
      }
      continue;
    }

    let keys: PropertyKey[];
    try {
      keys = Reflect.ownKeys(current.value);
    } catch {
      continue;
    }
    for (let index = keys.length - 1; index >= 0; index -= 1) {
      const key = keys[index];
      let descriptor: PropertyDescriptor | undefined;
      try {
        descriptor = Object.getOwnPropertyDescriptor(current.value, key);
      } catch {
        continue;
      }
      if (!descriptor || !('value' in descriptor)) continue;
      stack.push({
        value: descriptor.value,
        path: appendPath(current.path, key),
        depth: current.depth + 1
      });
    }
  }

  if (stats.boundaryIssues > 0) {
    const truncated = stats.boundaryIssues > issuePaths.length;
    if (truncated) {
      errors.push(`${label}: outras ${stats.boundaryIssues - issuePaths.length} margens textuais foram omitidas do diagnóstico.`);
    }
    return { ok: false, errors, issuePaths, truncated, stats };
  }

  return {
    ok: true,
    stats,
    message: `${label}: ${stats.strings} textos preservam exatamente suas margens.`
  };
}
