export interface ContinuousNumericLexemeOptions {
  maxDepth: number;
  maxTokens: number;
  maxLexemeCharacters: number;
}

export interface ContinuousNumericLexemeStats {
  numbers: number;
  integers: number;
  decimals: number;
  exponentials: number;
  maxLexemeCharacters: number;
  maxDepth: number;
}

export interface ContinuousNumericLexemeSuccess {
  ok: true;
  stats: ContinuousNumericLexemeStats;
  message: string;
}

export interface ContinuousNumericLexemeFailure {
  ok: false;
  kind: 'syntax' | 'limit' | 'range' | 'precision';
  errors: string[];
}

export type ContinuousNumericLexemeResult = ContinuousNumericLexemeSuccess | ContinuousNumericLexemeFailure;

export const defaultContinuousNumericLexemeOptions: ContinuousNumericLexemeOptions = {
  maxDepth: 128,
  maxTokens: 300_000,
  maxLexemeCharacters: 128
};

interface NormalizedDecimal {
  sign: 1 | -1;
  digits: string;
  exponent: bigint;
  zero: boolean;
}

function safeLexemeLabel(value: string): string {
  return value.length <= 80 ? value : `${value.slice(0, 77)}...`;
}

function normalizeExponent(value: string | undefined): bigint {
  if (!value) return 0n;
  return BigInt(value.startsWith('+') ? value.slice(1) : value);
}

export function normalizeContinuousDecimalLexeme(lexeme: string): NormalizedDecimal | undefined {
  const match = /^(-)?(0|[1-9]\d*)(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/.exec(lexeme);
  if (!match) return undefined;

  const sign: 1 | -1 = match[1] ? -1 : 1;
  const integer = match[2];
  const fraction = match[3] ?? '';
  let exponent = normalizeExponent(match[4]) - BigInt(fraction.length);
  let digits = `${integer}${fraction}`.replace(/^0+/, '');

  if (digits.length === 0) {
    return { sign, digits: '0', exponent: 0n, zero: true };
  }

  while (digits.endsWith('0')) {
    digits = digits.slice(0, -1);
    exponent += 1n;
  }

  return { sign, digits, exponent, zero: false };
}

function normalizedDecimalKey(value: NormalizedDecimal): string {
  if (value.zero) return '0';
  return `${value.sign < 0 ? '-' : '+'}${value.digits}e${value.exponent.toString()}`;
}

function exceedsSafeInteger(value: NormalizedDecimal): boolean {
  if (value.zero || value.exponent < 0n) return false;
  const totalDigits = BigInt(value.digits.length) + value.exponent;
  if (totalDigits > 16n) return true;
  if (totalDigits < 16n) return false;
  const expanded = value.digits.padEnd(16, '0');
  return expanded > Number.MAX_SAFE_INTEGER.toString();
}

function isMathematicalInteger(value: NormalizedDecimal): boolean {
  return value.zero || value.exponent >= 0n;
}

class JsonNumericLexemeScanner {
  private index = 0;
  private tokens = 0;
  private failure?: ContinuousNumericLexemeFailure;
  private readonly stats: ContinuousNumericLexemeStats = {
    numbers: 0,
    integers: 0,
    decimals: 0,
    exponentials: 0,
    maxLexemeCharacters: 0,
    maxDepth: 0
  };

  constructor(
    private readonly text: string,
    private readonly options: ContinuousNumericLexemeOptions
  ) {}

  scan(): ContinuousNumericLexemeResult {
    this.skipWhitespace();
    if (!this.parseValue('$', 0)) return this.failure ?? this.syntax('Não foi possível inspecionar os números JSON.');
    this.skipWhitespace();
    if (this.index !== this.text.length) {
      return this.syntax(`O JSON contém conteúdo adicional depois da posição ${this.index + 1}.`);
    }
    return {
      ok: true,
      stats: { ...this.stats },
      message: `${this.stats.numbers} números JSON preservam a medida declarada sem arredondamento silencioso.`
    };
  }

  private fail(kind: ContinuousNumericLexemeFailure['kind'], message: string): false {
    if (!this.failure) this.failure = { ok: false, kind, errors: [message] };
    return false;
  }

  private syntax(message: string): ContinuousNumericLexemeFailure {
    return { ok: false, kind: 'syntax', errors: [message] };
  }

  private consumeToken(): boolean {
    this.tokens += 1;
    if (this.tokens > this.options.maxTokens) {
      return this.fail('limit', `A inspeção numérica excedeu ${this.options.maxTokens} tokens.`);
    }
    return true;
  }

  private parseValue(path: string, depth: number): boolean {
    if (!this.consumeToken()) return false;
    if (depth > this.options.maxDepth) {
      return this.fail('limit', `A inspeção numérica excedeu ${this.options.maxDepth} níveis em ${path}.`);
    }
    this.stats.maxDepth = Math.max(this.stats.maxDepth, depth);
    this.skipWhitespace();
    const character = this.text[this.index];
    if (character === '{') return this.parseObject(path, depth);
    if (character === '[') return this.parseArray(path, depth);
    if (character === '"') return this.parseString();
    if (character === 't') return this.consumeLiteral('true');
    if (character === 'f') return this.consumeLiteral('false');
    if (character === 'n') return this.consumeLiteral('null');
    if (character === '-' || (character >= '0' && character <= '9')) return this.parseNumber(path);
    return this.fail('syntax', `Valor JSON inválido na posição ${this.index + 1}.`);
  }

  private parseObject(path: string, depth: number): boolean {
    this.index += 1;
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
      const key = this.parseDecodedString();
      if (!key) return false;
      this.skipWhitespace();
      if (this.text[this.index] !== ':') {
        return this.fail('syntax', `Era esperado ':' depois de uma chave na posição ${this.index + 1}.`);
      }
      this.index += 1;
      if (!this.parseValue(`${path}[${JSON.stringify(key)}]`, depth + 1)) return false;
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

  private parseDecodedString(): string | undefined {
    const start = this.index;
    if (!this.parseString()) return undefined;
    try {
      const decoded: unknown = JSON.parse(this.text.slice(start, this.index));
      if (typeof decoded === 'string') return decoded;
    } catch {
      // A falha já é representada como sintaxe JSON inválida.
    }
    this.fail('syntax', `String JSON inválida na posição ${start + 1}.`);
    return undefined;
  }

  private parseString(): boolean {
    const start = this.index;
    this.index += 1;
    while (this.index < this.text.length) {
      const code = this.text.charCodeAt(this.index);
      if (code === 0x22) {
        this.index += 1;
        return true;
      }
      if (code === 0x5C) {
        this.index += 1;
        if (this.index >= this.text.length) {
          return this.fail('syntax', `Escape incompleto na posição ${this.index + 1}.`);
        }
        const escaped = this.text[this.index];
        if (escaped === 'u') {
          const hexadecimal = this.text.slice(this.index + 1, this.index + 5);
          if (!/^[0-9A-Fa-f]{4}$/.test(hexadecimal)) {
            return this.fail('syntax', `Escape Unicode inválido na posição ${this.index + 1}.`);
          }
          this.index += 5;
          continue;
        }
        if (!['"', '\\', '/', 'b', 'f', 'n', 'r', 't'].includes(escaped)) {
          return this.fail('syntax', `Escape JSON inválido na posição ${this.index + 1}.`);
        }
        this.index += 1;
        continue;
      }
      if (code <= 0x1F) {
        return this.fail('syntax', `Controle não escapado dentro de string na posição ${this.index + 1}.`);
      }
      this.index += 1;
    }
    return this.fail('syntax', `String JSON não encerrada na posição ${start + 1}.`);
  }

  private consumeLiteral(literal: string): boolean {
    if (this.text.slice(this.index, this.index + literal.length) !== literal) {
      return this.fail('syntax', `Literal JSON inválido na posição ${this.index + 1}.`);
    }
    this.index += literal.length;
    return true;
  }

  private parseNumber(path: string): boolean {
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

    let decimal = false;
    let exponential = false;
    if (this.text[this.index] === '.') {
      decimal = true;
      this.index += 1;
      const decimalStart = this.index;
      while (this.text[this.index] >= '0' && this.text[this.index] <= '9') this.index += 1;
      if (this.index === decimalStart) return this.fail('syntax', `Número JSON inválido na posição ${start + 1}.`);
    }
    if (this.text[this.index] === 'e' || this.text[this.index] === 'E') {
      exponential = true;
      this.index += 1;
      if (this.text[this.index] === '+' || this.text[this.index] === '-') this.index += 1;
      const exponentStart = this.index;
      while (this.text[this.index] >= '0' && this.text[this.index] <= '9') this.index += 1;
      if (this.index === exponentStart) return this.fail('syntax', `Número JSON inválido na posição ${start + 1}.`);
    }

    const lexeme = this.text.slice(start, this.index);
    this.stats.numbers += 1;
    if (decimal) this.stats.decimals += 1;
    if (exponential) this.stats.exponentials += 1;
    this.stats.maxLexemeCharacters = Math.max(this.stats.maxLexemeCharacters, lexeme.length);

    if (lexeme.length > this.options.maxLexemeCharacters) {
      return this.fail('limit', `Um número em ${path} excede ${this.options.maxLexemeCharacters} caracteres.`);
    }

    const normalized = normalizeContinuousDecimalLexeme(lexeme);
    if (!normalized) return this.fail('syntax', `Número JSON inválido na posição ${start + 1}.`);
    if (isMathematicalInteger(normalized)) {
      this.stats.integers += 1;
      if (exceedsSafeInteger(normalized)) {
        return this.fail(
          'range',
          `O número ${safeLexemeLabel(lexeme)} em ${path} excede a faixa inteira segura de ${Number.MAX_SAFE_INTEGER}.`
        );
      }
    }

    const parsed = Number(lexeme);
    if (!Number.isFinite(parsed)) {
      return this.fail('range', `O número ${safeLexemeLabel(lexeme)} em ${path} não permanece finito no JavaScript.`);
    }
    if (Object.is(parsed, -0)) {
      return this.fail('precision', `O número -0 em ${path} perderia o sinal em uma nova serialização JSON.`);
    }

    const parsedNormalized = normalizeContinuousDecimalLexeme(parsed.toString());
    if (!parsedNormalized || normalizedDecimalKey(normalized) !== normalizedDecimalKey(parsedNormalized)) {
      return this.fail(
        'precision',
        `O número ${safeLexemeLabel(lexeme)} em ${path} seria convertido para ${parsed.toString()} e mudaria silenciosamente de medida.`
      );
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

export function inspectContinuousJsonNumbers(
  text: string,
  options: ContinuousNumericLexemeOptions = defaultContinuousNumericLexemeOptions
): ContinuousNumericLexemeResult {
  if (text.length === 0) return { ok: false, kind: 'syntax', errors: ['O texto JSON está vazio.'] };
  return new JsonNumericLexemeScanner(text, options).scan();
}
