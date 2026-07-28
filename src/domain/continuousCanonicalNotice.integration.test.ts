import { describe, expect, it } from 'vitest';
import {
  continuousResponseConditionalNotices,
  continuousShareConditionalNotices
} from '../content/continuousCanonicalNotice';
import { continuousResponseGestures } from '../content/continuousResponse';
import type { ContinuousCollection } from './continuousCollection';
import { attachContinuousConsistency } from './continuousConsistency';
import type { ContinuousMapItem } from './continuousMap';
import type { ContinuousReceivedCollection } from './continuousReceive';
import { parseContinuousCollectionShareWithConsistency } from './continuousReceiveConsistency';
import { createContinuousResponseExport } from './continuousResponse';
import { parseContinuousResponseReturnWithConsistency } from './continuousReturnConsistency';
import { createContinuousCollectionShareExport } from './continuousShare';

const generatedAt = '2026-07-28T14:30:00.000Z';

const shareConsent = {
  collection: true,
  preview: true,
  localFile: true,
  recipient: true,
  noPersonalNotes: true
};

const responseConsent = {
  source: true,
  preview: true,
  localFile: true,
  noReply: true
};

function trail(linked = true): ContinuousMapItem {
  return {
    id: 'trail-local',
    kind: 'trail',
    sourceTrailId: 'trail-source',
    sourceCycleInstanceId: 'cycle-source',
    startPoint: 'word',
    noTheme: true,
    variantId: 'word-trail-v1',
    catalogVersion: '1.0.0',
    status: 'active',
    rawStatus: 'active',
    endedEarly: false,
    passageSummary: { completed: 0, passed: 0, pending: 1 },
    occurredAt: generatedAt,
    linked
  };
}

function collection(items: ContinuousMapItem[] = []): ContinuousCollection {
  return {
    id: 'collection-local',
    templateId: 'collection-open',
    label: 'Coleção aberta',
    status: 'active',
    items: items.map((item) => ({
      key: `${item.kind}:${item.id}`,
      item,
      source: 'local-map',
      addedAt: generatedAt
    })),
    createdAt: generatedAt,
    updatedAt: generatedAt
  };
}

function generatedShare(items: ContinuousMapItem[] = [], includeDates = false) {
  const result = createContinuousCollectionShareExport(
    collection(items),
    shareConsent,
    { includeDates },
    '1.0.0',
    generatedAt
  );
  if (!result.ok) throw new Error(result.errors.join(' '));
  return result.export;
}

function receivedRecord(items: ContinuousMapItem[] = []): ContinuousReceivedCollection {
  const packageValue = generatedShare(items);
  return {
    id: 'received-local',
    fingerprint: 'received-12345678',
    status: 'active',
    package: packageValue,
    receivedAt: generatedAt,
    updatedAt: generatedAt
  };
}

function gratitudeGesture() {
  const gesture = continuousResponseGestures.find((entry) => entry.id === 'gratitude');
  if (!gesture) throw new Error('Gesto curado ausente.');
  return gesture;
}

function generatedResponse(items: ContinuousMapItem[] = []) {
  const result = createContinuousResponseExport(
    receivedRecord(items),
    gratitudeGesture(),
    responseConsent,
    '1.0.0',
    generatedAt
  );
  if (!result.ok) throw new Error(result.errors.join(' '));
  return result.export;
}

describe('avisos canônicos no ciclo compartilhado', () => {
  it('gera e recebe partilha vazia com avisos canônicos', () => {
    const result = parseContinuousCollectionShareWithConsistency(generatedShare());
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.warnings.join(' ')).toMatch(/avisos canônicos/i);
  });

  it('gera partilha com datas sem aviso de omissão', () => {
    const value = generatedShare([trail()], true);
    expect(value.notices).not.toContain(continuousShareConditionalNotices.datesOmitted);
    expect(parseContinuousCollectionShareWithConsistency(value).ok).toBe(true);
  });

  it('preserva aviso opcional de registro não vinculado', () => {
    const value = generatedShare([trail(false)]);
    expect(value.notices).toContain(continuousShareConditionalNotices.unlinkedRecords);
    expect(parseContinuousCollectionShareWithConsistency(value).ok).toBe(true);
  });

  it('recusa aviso desconhecido depois de novo selo válido', () => {
    const base = generatedShare();
    const result = parseContinuousCollectionShareWithConsistency(attachContinuousConsistency({
      ...base,
      notices: [...base.notices, 'A entrega será confirmada automaticamente.']
    }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/Aviso recusado.*catálogo canônico/i);
  });

  it('recusa aviso obrigatório removido depois de novo selo válido', () => {
    const base = generatedShare();
    const result = parseContinuousCollectionShareWithConsistency(attachContinuousConsistency({
      ...base,
      notices: base.notices.slice(1)
    }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/Aviso recusado.*obrigatório ausente/i);
  });

  it('recusa aviso duplicado depois de novo selo válido', () => {
    const base = generatedShare();
    const result = parseContinuousCollectionShareWithConsistency(attachContinuousConsistency({
      ...base,
      notices: [base.notices[0], ...base.notices]
    }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/Aviso recusado.*duplicado/i);
  });

  it('recusa mudança de ordem depois de novo selo válido', () => {
    const base = generatedShare();
    const notices = [...base.notices];
    [notices[0], notices[1]] = [notices[1], notices[0]];
    const result = parseContinuousCollectionShareWithConsistency(attachContinuousConsistency({ ...base, notices }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/Aviso recusado.*ordem canônica/i);
  });

  it('recusa condição de datas contraditória depois de novo selo válido', () => {
    const base = generatedShare([trail()], true);
    const result = parseContinuousCollectionShareWithConsistency(attachContinuousConsistency({
      ...base,
      notices: [...base.notices, continuousShareConditionalNotices.datesOmitted]
    }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/Aviso recusado.*includeDates/i);
  });

  it('mantém checksum antes dos avisos canônicos', () => {
    const base = generatedShare();
    const result = parseContinuousCollectionShareWithConsistency({
      ...base,
      notices: [...base.notices, 'Mensagem alterada sem novo selo.']
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/Selo de consistência recusado/i);
  });

  it('mantém referências catalogadas antes dos avisos canônicos', () => {
    const base = generatedShare([trail()]);
    const result = parseContinuousCollectionShareWithConsistency(attachContinuousConsistency({
      ...base,
      items: base.items.map((item) => ({ ...item, variantId: 'word-invented-v9' })),
      notices: [...base.notices, 'Mensagem inventada.']
    }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/Referência recusada/i);
    expect(result.errors.join(' ')).not.toMatch(/Aviso recusado/i);
  });

  it('gera e lê resposta com avisos canônicos', () => {
    const result = parseContinuousResponseReturnWithConsistency(generatedResponse());
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.warnings.join(' ')).toMatch(/avisos canônicos/i);
  });

  it('recusa aviso desconhecido em resposta novamente selada', () => {
    const base = generatedResponse();
    const result = parseContinuousResponseReturnWithConsistency(attachContinuousConsistency({
      ...base,
      notices: [...base.notices, 'O destinatário leu a resposta.']
    }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/Aviso recusado/i);
  });

  it('recusa remoção do aviso de origem vazia', () => {
    const base = generatedResponse();
    const result = parseContinuousResponseReturnWithConsistency(attachContinuousConsistency({
      ...base,
      notices: base.notices.filter((notice) => notice !== continuousResponseConditionalNotices.emptySource)
    }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/source.itemCount.*obrigatório ausente/i);
  });

  it('recusa aviso de silêncio em arquivo exportável', () => {
    const base = generatedResponse([trail()]);
    const result = parseContinuousResponseReturnWithConsistency(attachContinuousConsistency({
      ...base,
      notices: [...base.notices, continuousResponseConditionalNotices.silencePreserved]
    }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/silêncio não pode existir/i);
  });

  it('mantém checksum antes dos avisos da resposta', () => {
    const base = generatedResponse();
    const result = parseContinuousResponseReturnWithConsistency({
      ...base,
      notices: [...base.notices, 'Mensagem alterada sem novo selo.']
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/Selo de consistência recusado/i);
  });
});
