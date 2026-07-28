import { describe, expect, it, vi } from 'vitest';
import {
  continuousResponseConditionalNotices,
  continuousResponseMandatoryNotices,
  continuousShareConditionalNotices,
  continuousShareMandatoryNotices
} from '../content/continuousCanonicalNotice';
import {
  validateContinuousResponseCanonicalNotices,
  validateContinuousShareCanonicalNotices
} from './continuousCanonicalNotice';

function share(
  notices: string[] = [...continuousShareMandatoryNotices, continuousShareConditionalNotices.datesOmitted],
  includeDates = false,
  itemCount = 1
) {
  return {
    collection: { itemCount },
    options: { includeDates },
    notices
  };
}

function response(
  notices: string[] = [...continuousResponseMandatoryNotices],
  itemCount = 1
) {
  return {
    source: { itemCount },
    notices
  };
}

describe('avisos canônicos da partilha', () => {
  it('aceita avisos obrigatórios e condição de datas omitidas', () => {
    expect(validateContinuousShareCanonicalNotices(share()).ok).toBe(true);
  });

  it('recusa aviso desconhecido', () => {
    const result = validateContinuousShareCanonicalNotices(share([
      ...continuousShareMandatoryNotices,
      continuousShareConditionalNotices.datesOmitted,
      'Mensagem inventada.'
    ]));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/não pertence ao catálogo/i);
  });

  it('recusa aviso obrigatório ausente', () => {
    const result = validateContinuousShareCanonicalNotices(share([
      ...continuousShareMandatoryNotices.slice(1),
      continuousShareConditionalNotices.datesOmitted
    ]));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/obrigatório ausente/i);
  });

  it('recusa aviso duplicado', () => {
    const result = validateContinuousShareCanonicalNotices(share([
      ...continuousShareMandatoryNotices,
      continuousShareMandatoryNotices[0],
      continuousShareConditionalNotices.datesOmitted
    ]));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/duplicado/i);
  });

  it('recusa mudança da ordem canônica', () => {
    const notices = [...continuousShareMandatoryNotices];
    [notices[0], notices[1]] = [notices[1], notices[0]];
    notices.push(continuousShareConditionalNotices.datesOmitted);
    const result = validateContinuousShareCanonicalNotices(share(notices));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/ordem canônica/i);
  });

  it('exige aviso de datas omitidas quando includeDates é false', () => {
    const result = validateContinuousShareCanonicalNotices(share([...continuousShareMandatoryNotices]));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/includeDates.*obrigatório ausente/i);
  });

  it('recusa aviso de datas omitidas quando includeDates é true', () => {
    const result = validateContinuousShareCanonicalNotices(share([
      ...continuousShareMandatoryNotices,
      continuousShareConditionalNotices.datesOmitted
    ], true));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/includeDates.*não corresponde/i);
  });

  it('exige aviso de coleção vazia quando itemCount é zero', () => {
    const result = validateContinuousShareCanonicalNotices(share([
      ...continuousShareMandatoryNotices,
      continuousShareConditionalNotices.datesOmitted
    ], false, 0));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/itemCount.*obrigatório ausente/i);
  });

  it('recusa aviso de coleção vazia quando há itens', () => {
    const result = validateContinuousShareCanonicalNotices(share([
      ...continuousShareMandatoryNotices,
      continuousShareConditionalNotices.datesOmitted,
      continuousShareConditionalNotices.emptyCollection
    ]));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/itemCount.*não corresponde/i);
  });

  it('aceita aviso opcional de registros não vinculados na posição canônica', () => {
    const result = validateContinuousShareCanonicalNotices(share([
      ...continuousShareMandatoryNotices,
      continuousShareConditionalNotices.datesOmitted,
      continuousShareConditionalNotices.unlinkedRecords
    ]));
    expect(result.ok).toBe(true);
  });

  it('não executa getter da lista de avisos', () => {
    const getter = vi.fn(() => [...continuousShareMandatoryNotices]);
    const input: Record<string, unknown> = { collection: { itemCount: 1 }, options: { includeDates: false } };
    Object.defineProperty(input, 'notices', { enumerable: true, get: getter });
    const result = validateContinuousShareCanonicalNotices(input);
    expect(result.ok).toBe(false);
    expect(getter).not.toHaveBeenCalled();
  });

  it('deixa lista de tipo inválido para o parser de schema', () => {
    const result = validateContinuousShareCanonicalNotices({ notices: 'não é lista' });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.checkedNotices).toBe(0);
  });
});

describe('avisos canônicos da resposta', () => {
  it('aceita avisos obrigatórios de resposta', () => {
    expect(validateContinuousResponseCanonicalNotices(response()).ok).toBe(true);
  });

  it('recusa aviso desconhecido na resposta', () => {
    const result = validateContinuousResponseCanonicalNotices(response([
      ...continuousResponseMandatoryNotices,
      'A entrega foi confirmada.'
    ]));
    expect(result.ok).toBe(false);
  });

  it('recusa aviso obrigatório ausente na resposta', () => {
    const result = validateContinuousResponseCanonicalNotices(response([
      ...continuousResponseMandatoryNotices.slice(1)
    ]));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/obrigatório ausente/i);
  });

  it('recusa aviso duplicado na resposta', () => {
    const result = validateContinuousResponseCanonicalNotices(response([
      ...continuousResponseMandatoryNotices,
      continuousResponseMandatoryNotices[0]
    ]));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/duplicado/i);
  });

  it('recusa ordem divergente na resposta', () => {
    const notices = [...continuousResponseMandatoryNotices];
    [notices[2], notices[3]] = [notices[3], notices[2]];
    const result = validateContinuousResponseCanonicalNotices(response(notices));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/ordem canônica/i);
  });

  it('exige aviso de origem vazia quando itemCount é zero', () => {
    const result = validateContinuousResponseCanonicalNotices(response([
      ...continuousResponseMandatoryNotices
    ], 0));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/source.itemCount.*obrigatório ausente/i);
  });

  it('aceita aviso de origem vazia quando itemCount é zero', () => {
    expect(validateContinuousResponseCanonicalNotices(response([
      ...continuousResponseMandatoryNotices,
      continuousResponseConditionalNotices.emptySource
    ], 0)).ok).toBe(true);
  });

  it('recusa aviso de origem vazia quando há itens', () => {
    const result = validateContinuousResponseCanonicalNotices(response([
      ...continuousResponseMandatoryNotices,
      continuousResponseConditionalNotices.emptySource
    ], 1));
    expect(result.ok).toBe(false);
  });

  it('recusa aviso de silêncio em arquivo exportável', () => {
    const result = validateContinuousResponseCanonicalNotices(response([
      ...continuousResponseMandatoryNotices,
      continuousResponseConditionalNotices.silencePreserved
    ]));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/silêncio não pode existir/i);
  });
});
