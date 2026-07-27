import { describe, expect, it } from 'vitest';
import { continuousResponseGestures } from '../content/continuousResponse';
import type { ContinuousCollection } from './continuousCollection';
import { attachContinuousConsistency } from './continuousConsistency';
import type { ContinuousReceivedCollection } from './continuousReceive';
import { parseContinuousCollectionShare } from './continuousReceive';
import { parseContinuousCollectionShareWithConsistency } from './continuousReceiveConsistency';
import { createContinuousResponseExport } from './continuousResponse';
import { parseContinuousResponseReturn } from './continuousReturn';
import { parseContinuousResponseReturnWithConsistency } from './continuousReturnConsistency';
import { createContinuousCollectionShareExport } from './continuousShare';

const generatedAt = '2026-07-27T22:00:00.000Z';

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

function collection(label = 'Coleção aberta'): ContinuousCollection {
  return {
    id: 'collection-local',
    templateId: 'collection-open',
    label,
    status: 'active',
    items: [],
    createdAt: generatedAt,
    updatedAt: generatedAt
  };
}

function shareExport() {
  const result = createContinuousCollectionShareExport(
    collection(),
    shareConsent,
    { includeDates: false },
    '1.0.0',
    generatedAt
  );
  if (!result.ok) throw new Error(result.errors.join(' '));
  return result.export;
}

function receivedRecord(overrides: Partial<ContinuousReceivedCollection> = {}): ContinuousReceivedCollection {
  return {
    id: 'received-local',
    fingerprint: 'received-12345678',
    status: 'active',
    package: shareExport(),
    receivedAt: generatedAt,
    updatedAt: generatedAt,
    ...overrides
  };
}

function responseExport() {
  const gesture = continuousResponseGestures.find((entry) => entry.id === 'gratitude');
  if (!gesture) throw new Error('Gesto curado ausente.');
  const result = createContinuousResponseExport(
    receivedRecord(),
    gesture,
    responseConsent,
    '1.0.0',
    generatedAt
  );
  if (!result.ok) throw new Error(result.errors.join(' '));
  return result.export;
}

describe('margens textuais no ciclo compartilhado', () => {
  it('aceita partilha oficial e registra confirmação de margens', () => {
    const result = parseContinuousCollectionShareWithConsistency(shareExport());
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.warnings.join(' ')).toMatch(/preservam exatamente suas margens/i);
  });

  it('impede gerar partilha com margem no rótulo', () => {
    const result = createContinuousCollectionShareExport(
      collection(' Coleção aberta'),
      shareConsent,
      { includeDates: false },
      '1.0.0',
      generatedAt
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/margem textual.*collection.*label/i);
  });

  it('impede gerar partilha com margem na versão', () => {
    const result = createContinuousCollectionShareExport(
      collection(),
      shareConsent,
      { includeDates: false },
      '1.0.0 ',
      generatedAt
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/margem textual.*catalogVersion/i);
  });

  it('impede gerar resposta com margem na impressão', () => {
    const gesture = continuousResponseGestures.find((entry) => entry.id === 'gratitude');
    if (!gesture) throw new Error('Gesto curado ausente.');
    const result = createContinuousResponseExport(
      receivedRecord({ fingerprint: ' received-12345678' }),
      gesture,
      responseConsent,
      '1.0.0',
      generatedAt
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/margem textual.*fingerprint/i);
  });

  it('recusa partilha selada com margem antes da sanitização', () => {
    const { consistency: _consistency, ...payload } = shareExport();
    const changed = attachContinuousConsistency({
      ...payload,
      collection: { ...payload.collection, label: ' Coleção aberta ' }
    });
    const result = parseContinuousCollectionShareWithConsistency(changed);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/margem textual recusada.*collection.*label/i);
  });

  it('mantém checksum anterior à margem textual', () => {
    const original = shareExport();
    const changed = {
      ...original,
      collection: { ...original.collection, label: ' Coleção aberta' }
    };
    const result = parseContinuousCollectionShareWithConsistency(changed);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/selo de consistência recusado/i);
    expect(result.errors.join(' ')).not.toMatch(/margem textual recusada/i);
  });

  it('mantém contrato estrito anterior à margem textual', () => {
    const { consistency: _consistency, ...payload } = shareExport();
    const changed = attachContinuousConsistency({
      ...payload,
      collection: { ...payload.collection, label: ' Coleção aberta', extra: true }
    });
    const result = parseContinuousCollectionShareWithConsistency(changed);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/contrato recusado/i);
    expect(result.errors.join(' ')).not.toMatch(/margem textual recusada/i);
  });

  it('recusa resposta selada com margem na data', () => {
    const { consistency: _consistency, ...payload } = responseExport();
    const changed = attachContinuousConsistency({ ...payload, generatedAt: `${generatedAt} ` });
    const result = parseContinuousResponseReturnWithConsistency(changed);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/margem textual recusada.*generatedAt/i);
  });

  it('aceita espaços internos em uma partilha selada', () => {
    const { consistency: _consistency, ...payload } = shareExport();
    const changed = attachContinuousConsistency({
      ...payload,
      collection: { ...payload.collection, label: 'Coleção  com  espaços internos' }
    });
    const result = parseContinuousCollectionShareWithConsistency(changed);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.package.collection.label).toBe('Coleção  com  espaços internos');
  });

  it('parser de partilha preserva margens quando chamado diretamente', () => {
    const original = shareExport();
    const changed = {
      ...original,
      collection: { ...original.collection, label: ' Coleção direta ' },
      notices: [' Aviso direto ']
    };
    const result = parseContinuousCollectionShare(changed);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.package.collection.label).toBe(' Coleção direta ');
    expect(result.package.notices[0]).toBe(' Aviso direto ');
  });

  it('parser de retorno preserva margens quando chamado diretamente', () => {
    const original = responseExport();
    const changed = {
      ...original,
      generatedAt: ` ${generatedAt} `,
      source: {
        ...original.source,
        fingerprint: ' received-12345678 ',
        collectionLabel: ' Coleção direta '
      },
      notices: [' Aviso direto ']
    };
    const result = parseContinuousResponseReturn(changed);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.package.generatedAt).toBe(` ${generatedAt} `);
    expect(result.package.source.fingerprint).toBe(' received-12345678 ');
    expect(result.package.source.collectionLabel).toBe(' Coleção direta ');
    expect(result.package.notices[0]).toBe(' Aviso direto ');
  });

  it('aceita resposta oficial e registra confirmação de margens', () => {
    const result = parseContinuousResponseReturnWithConsistency(responseExport());
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.warnings.join(' ')).toMatch(/preservam exatamente suas margens/i);
  });
});
