import {
  continuousCanonicalNoticeCatalog,
  continuousResponseConditionalNotices,
  continuousShareConditionalNotices
} from '../content/continuousCanonicalNotice';

export interface ContinuousCanonicalNoticeSuccess {
  ok: true;
  checkedNotices: number;
  message: string;
}

export interface ContinuousCanonicalNoticeFailure {
  ok: false;
  errors: string[];
  truncated: boolean;
}

export type ContinuousCanonicalNoticeResult =
  | ContinuousCanonicalNoticeSuccess
  | ContinuousCanonicalNoticeFailure;

type NoticeCollection =
  | { status: 'deferred' }
  | { status: 'invalid'; error: string }
  | { status: 'ready'; notices: string[] };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readOwnData(value: Record<string, unknown>, key: string): unknown {
  const descriptor = Object.getOwnPropertyDescriptor(value, key);
  if (!descriptor || !('value' in descriptor)) return undefined;
  return descriptor.value;
}

function collectNotices(input: unknown): NoticeCollection {
  if (!isRecord(input)) return { status: 'deferred' };
  const descriptor = Object.getOwnPropertyDescriptor(input, 'notices');
  if (!descriptor) return { status: 'deferred' };
  if (!('value' in descriptor)) {
    return { status: 'invalid', error: '$.notices: acessores não são permitidos na lista de avisos.' };
  }
  if (!Array.isArray(descriptor.value)) return { status: 'deferred' };

  const notices: string[] = [];
  for (let index = 0; index < descriptor.value.length; index += 1) {
    const itemDescriptor = Object.getOwnPropertyDescriptor(descriptor.value, String(index));
    if (!itemDescriptor) return { status: 'deferred' };
    if (!('value' in itemDescriptor)) {
      return {
        status: 'invalid',
        error: `$.notices[${index}]: acessores não são permitidos em avisos.`
      };
    }
    if (typeof itemDescriptor.value !== 'string') return { status: 'deferred' };
    notices.push(itemDescriptor.value);
  }
  return { status: 'ready', notices };
}

function report(errors: string[], message: string): void {
  if (errors.length < continuousCanonicalNoticeCatalog.maxReportedIssues) errors.push(message);
}

function finish(errors: string[], checkedNotices: number): ContinuousCanonicalNoticeResult {
  if (errors.length > 0) {
    return {
      ok: false,
      errors,
      truncated: errors.length >= continuousCanonicalNoticeCatalog.maxReportedIssues
    };
  }
  return {
    ok: true,
    checkedNotices,
    message: `${checkedNotices} avisos canônicos permanecem únicos, ordenados e coerentes com o pacote.`
  };
}

function validateCatalog(
  notices: string[],
  mandatory: readonly string[],
  canonicalOrder: readonly string[],
  errors: string[]
): void {
  const allowed = new Set(canonicalOrder);
  const seen = new Set<string>();
  const order = new Map(canonicalOrder.map((notice, index) => [notice, index]));
  let previousIndex = -1;

  notices.forEach((notice, index) => {
    if (!allowed.has(notice)) {
      report(errors, `$.notices[${index}]: aviso não pertence ao catálogo canônico atual.`);
      return;
    }
    if (seen.has(notice)) {
      report(errors, `$.notices[${index}]: aviso canônico duplicado.`);
    }
    seen.add(notice);
    const currentIndex = order.get(notice);
    if (currentIndex !== undefined && currentIndex <= previousIndex) {
      report(errors, `$.notices[${index}]: aviso fora da ordem canônica.`);
    }
    if (currentIndex !== undefined) previousIndex = Math.max(previousIndex, currentIndex);
  });

  mandatory.forEach((notice) => {
    if (!seen.has(notice)) report(errors, '$.notices: aviso obrigatório ausente.');
  });
}

function enforceCondition(
  notices: Set<string>,
  notice: string,
  required: boolean,
  path: string,
  errors: string[]
): void {
  if (required && !notices.has(notice)) report(errors, `${path}: aviso condicional obrigatório ausente.`);
  if (!required && notices.has(notice)) report(errors, `${path}: aviso condicional não corresponde ao pacote.`);
}

export function validateContinuousShareCanonicalNotices(input: unknown): ContinuousCanonicalNoticeResult {
  const collected = collectNotices(input);
  if (collected.status === 'deferred') {
    return { ok: true, checkedNotices: 0, message: 'Avisos serão avaliados depois que a lista for reconhecida.' };
  }
  if (collected.status === 'invalid') return { ok: false, errors: [collected.error], truncated: false };

  const errors: string[] = [];
  validateCatalog(
    collected.notices,
    continuousCanonicalNoticeCatalog.share.mandatory,
    continuousCanonicalNoticeCatalog.share.order,
    errors
  );
  const present = new Set(collected.notices);

  if (isRecord(input)) {
    const options = readOwnData(input, 'options');
    if (isRecord(options)) {
      const includeDates = readOwnData(options, 'includeDates');
      if (typeof includeDates === 'boolean') {
        enforceCondition(
          present,
          continuousShareConditionalNotices.datesOmitted,
          includeDates === false,
          '$.notices (includeDates)',
          errors
        );
      }
    }

    const collection = readOwnData(input, 'collection');
    if (isRecord(collection)) {
      const itemCount = readOwnData(collection, 'itemCount');
      if (typeof itemCount === 'number' && Number.isInteger(itemCount) && itemCount >= 0) {
        enforceCondition(
          present,
          continuousShareConditionalNotices.emptyCollection,
          itemCount === 0,
          '$.notices (itemCount)',
          errors
        );
      }
    }
  }

  return finish(errors, collected.notices.length);
}

export function validateContinuousResponseCanonicalNotices(input: unknown): ContinuousCanonicalNoticeResult {
  const collected = collectNotices(input);
  if (collected.status === 'deferred') {
    return { ok: true, checkedNotices: 0, message: 'Avisos serão avaliados depois que a lista for reconhecida.' };
  }
  if (collected.status === 'invalid') return { ok: false, errors: [collected.error], truncated: false };

  const errors: string[] = [];
  validateCatalog(
    collected.notices,
    continuousCanonicalNoticeCatalog.response.mandatory,
    continuousCanonicalNoticeCatalog.response.order,
    errors
  );
  const present = new Set(collected.notices);

  if (isRecord(input)) {
    const source = readOwnData(input, 'source');
    if (isRecord(source)) {
      const itemCount = readOwnData(source, 'itemCount');
      if (typeof itemCount === 'number' && Number.isInteger(itemCount) && itemCount >= 0) {
        enforceCondition(
          present,
          continuousResponseConditionalNotices.emptySource,
          itemCount === 0,
          '$.notices (source.itemCount)',
          errors
        );
      }
    }
  }

  if (present.has(continuousResponseConditionalNotices.silencePreserved)) {
    report(errors, '$.notices: o aviso de silêncio não pode existir em arquivo de resposta exportável.');
  }

  return finish(errors, collected.notices.length);
}
