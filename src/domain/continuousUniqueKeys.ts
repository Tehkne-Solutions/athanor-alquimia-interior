export interface ContinuousUniqueKeyStats {
  objects: number;
  arrays: number;
  keys: number;
  values: number;
  maxDepth: number;
}

export interface ContinuousUniqueKeyOptions {
  maxDepth: number;
  maxTokens: number;
}

export interface ContinuousUniqueKeySuccess {
  ok: true;
  stats: ContinuousUniqueKeyStats;
  message: string;
}

export interface ContinuousUniqueKeyFailure {
  ok: false;
  kind: 'duplicate' | 'syntax' | 'limit';
  errors: string[];
}

export type ContinuousUniqueKeyResult = ContinuousUniqueKeySuccess | ContinuousUniqueKeyFailure;

export const defaultContinuousUniqueKeyOptions: ContinuousUniqueKeyOptions = {
  maxDepth: 128,
  maxTokens: 300_000
};

interface ParsedString {
  value: string;
  offset: number;
}

function safeKeyLabel(value: string): string {
  const pieces: string[] = [];
  let count = 0;
  for (const character of value) {
    if (count >= 48) {
      pieces.push('…');
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

function appendPath(path: string, key: string): string {
  return `${path}[${safeKeyLabel(key)}]`;
}

class JsonUniqueKeyScanner {
  private index = 0;
  private tokens = 0;
  private failure?: ContinuousUniqueKeyFailure;
  private readonly stats: ContinuousUniqueKeyStats = {
    objects: 0,
    arrays: 0,
    keys: 0,
    values: 0,
    maxDepth: 0
  };

  constructor(
    private readonly text: string,
    private readonly options: ContinuousUniqueKeyOptions
  ) {}

  scan(): ContinuousUniqueKeyResult {
    this.skipWhitespace();
    if (!this.parseValue('$', 0)) return this.failure ?? this.syntax('Não foi possível inspecionar o JSON.');
    this.skipWhitespace();
    if (this.index !== this.text.length) {
      return this.syntax(`O JSON contém conteúdo adicional depois da posição ${this.index + 1}.`);
    }
    return {
      ok: true,
      stats: { ...this.stats },
      message: `Chaves JSON únicas confirmadas em ${this.stats.objects} objetos e ${this.stats.keys} nomes de campos.`
    };
  }

  private fail(kind: ContinuousUniqueKeyFailure['kind'], message: string): false {
    if (!this.failure) this.failure = { ok: false, kind, errors: [message] };
    return false;
  }

  private syntax(message: string): ContinuousUniqueKeyFailure {
    return { ok: false, kind: 'syntax', errors: [message] };
  }

  private consumeToken(): boolean {
    this.tokens += 1;
    if (this.tokens > this.options.maxTokens) {
      return this.fail('limit', `A inspeção de chaves excedeu ${this.options.maxTokens} tokens.`);
    }
    return true;
  }

  private parseValue(path: string, depth: number): boolean {
    if (!this.consumeToken()) return false;
    if (depth > this.options.maxDepth) {
      return this.fail('limit', `A inspeção de chaves excedeu ${this.options.maxDepth} níveis em ${path}.`);
    }
    this.stats.values += 1;
    this.stats.maxDepth = Math.max(this.stats.maxDepth, depth);
    this.skipWhitespace();
    const character = this.text[this.index];
    if (character === '{') return this.parseObject(path, depth);
    if (character === '[') return this.parseArray(path, depth);
    if (character === '"') return this.parseString() !== undefined;
    if (character === 't') return this.consumeLiteral('true');
    if (character === 'f') return this.consumeLiteral('false');
    if (character === 'n') return this.consumeLiteral('null');
    if (character === '-' || (character >= '0' && character <= '9')) return this.parseNumber();
    return this.fail('syntax', `Valor JSON inválido na posição ${this.index + 1}.`);
  }

  private parseObject(path: string, depth: number): boolean {
    this.index += 1;
    this.stats.objects += 1;
    const seen = new Map<string, number>();
    this.skipWhitespace();
    if (this.text[this.index] === '}') {
      this.index += 1;
      return true;
    }

    while (this.index < this.text.length) {
      this.skipWhitespace();
      if (this.text[this.index] !== '"') {
        return this.fail('syntax', `Era esperado um nome de campo na posição ${this.index + 1}.`);
      }
      if (!this.consumeToken()) return false;
      const parsedKey = this.parseString();
      if (!parsedKey) return false;
      this.stats.keys += 1;
      const firstOffset = seen.get(parsedKey.value);
      if (firstOffset !== undefined) {
        return this.fail(
          'duplicate',
          `A chave ${safeKeyLabel(parsedKey.value)} foi repetida no objeto ${path}; primeira declaração na posição ${firstOffset + 1} e nova declaração na posição ${parsedKey.offset + 1}.`
        );
      }
      seen.set(parsedKey.value, parsedKey.offset);

      this.skipWhitespace();
      if (this.text[this.index] !== ':') {
        return this.fail('syntax', `Era esperado ':' depois de uma chave na posição ${this.index + 1}.`);
      }
      this.index += 1;
      if (!this.parseValue(appendPath(path, parsedKey.value), depth + 1)) return false;
      this.skipWhitespace();
      const separator = this.text[this.index];
      if (separator === '}') {
        this.index += 1;
        return true;
      }
      if (separator !== ',') {
        return this.fail('syntax', `Era esperado ',' ou '}' na posição ${this.index + 1}.`);
      }
      this.index += 1;
    }
    return this.fail('syntax', 'O objeto JSON não foi encerrado.');
  }

  private parseArray(path: string, depth: number): boolean {
    this.index += 1;
    this.stats.arrays += 1;
    this.skipWhitespace();
    if (this.text[this.index] === ']') {
      this.index += 1;
      return true;
    }

    let itemIndex = 0;
    while (this.index < this.text.length) {
      if (!this.parseValue(`${path}[${itemIndex}]`, depth + 1)) return false;
      itemIndex += 1;
      this.skipWhitespace();
      const separator = this.text[this.index];
      if (separator === ']') {
        this.index += 1;
        return true;
      }
      if (separator !== ',') {
        return this.fail('syntax', `Era esperado ',' ou ']' na posição ${this.index + 1}.`);
      }
      this.index += 1;
    }
    return this.fail('syntax', 'A lista JSON não foi encerrada.');
  }

  private parseString(): ParsedString | undefined {
    const offset = this.index;
    this.index += 1;
    while (this.index < this.text.length) {
      const code = this.text.charCodeAt(this.index);
      if (code === 0x22) {
        this.index += 1;
        const raw = this.text.slice(offset, this.index);
        try {
          const decoded: unknown = JSON.parse(raw);
          if (typeof decoded !== 'string') {
            this.fail('syntax', `String JSON inválida na posição ${offset + 1}.`);
            return undefined;
          }
          return { value: decoded, offset };
        } catch {
          this.fail('syntax', `String JSON inválida na posição ${offset + 1}.`);
          return undefined;
        }
      }
      if (code === 0x5C) {
        this.index += 1;
        if (this.index >= this.text.length) {
          this.fail('syntax', `Escape incompleto na posição ${this.index + 1}.`);
          return undefined;
        }
        const escaped = this.text[this.index];
        if (escaped === 'u') {
          const hexadecimal = this.text.slice(this.index + 1, this.index + 5);
          if (!/^[0-9A-Fa-f]{4}$/.test(hexadecimal)) {
            this.fail('syntax', `Escape Unicode inválido na posição ${this.index + 1}.`);
            return undefined;
          }
          this.index += 5;
          continue;
        }
        if (!['"', '\\', '/', 'b', 'f', 'n', 'r', 't'].includes(escaped)) {
          this.fail('syntax', `Escape JSON inválido na posição ${this.index + 1}.`);
          return undefined;
        }
        this.index += 1;
        continue;
      }
      if (code <= 0x1F) {
        this.fail('syntax', `Controle não escapado dentro de string na posição ${this.index + 1}.`);
        return undefined;
      }
      this.index += 1;
    }
    this.fail('syntax', `String JSON não encerrada na posição ${offset + 1}.`);
    return undefined;
  }

  private consumeLiteral(literal: string): boolean {
    if (this.text.slice(this.index, this.index + literal.length) !== literal) {
      return this.fail('syntax', `Literal JSON inválido na posição ${this.index + 1}.`);
    }
    this.index += literal.length;
    return true;
  }

  private parseNumber(): boolean {
    const start = this.index;
    if (this.text[this.index] === '-') this.index += 1;
    if (this.text[this.index] === '0') {
      this.index += 1;
    } else {
      const first = this.text[this.index];
      if (!(first >= '1' && first <= '9')) {
        return this.fail('syntax', `Número JSON inválido na posição ${start + 1}.`);
      }
      while (this.text[this.index] >= '0' && this.text[this.index] <= '9') this.index += 1;
    }
    if (this.text[this.index] === '.') {
      this.index += 1;
      const decimalStart = this.index;
      while (this.text[this.index] >= '0' && this.text[this.index] <= '9') this.index += 1;
      if (this.index === decimalStart) return this.fail('syntax', `Número JSON inválido na posição ${start + 1}.`);
    }
    if (this.text[this.index] === 'e' || this.text[this.index] === 'E') {
      this.index += 1;
      if (this.text[this.index] === '+' || this.text[this.index] === '-') this.index += 1;
      const exponentStart = this.index;
      while (this.text[this.index] >= '0' && this.text[this.index] <= '9') this.index += 1;
      if (this.index === exponentStart) return this.fail('syntax', `Número JSON inválido na posição ${start + 1}.`);
    }
    return true;
  }

  private skipWhitespace(): void {
    while (
      this.text[this.index] === ' '
      || this.text[this.index] === '\t'
      || this.text[this.index] === '\n'
      || this.text[this.index] === '\r'
    ) {
      this.index += 1;
    }
  }
}

export function inspectContinuousJsonUniqueKeys(
  text: string,
  options: ContinuousUniqueKeyOptions = defaultContinuousUniqueKeyOptions
): ContinuousUniqueKeyResult {
  if (text.length === 0) return { ok: false, kind: 'syntax', errors: ['O texto JSON está vazio.'] };
  return new JsonUniqueKeyScanner(text, options).scan();
}
