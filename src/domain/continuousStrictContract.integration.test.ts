import { describe, expect, it } from 'vitest';
import { continuousResponseGestures } from '../content/continuousResponse';
import type { ContinuousCollection } from './continuousCollection';
import { attachContinuousConsistency } from './continuousConsistency';
import type { ContinuousReceivedCollection } from './continuousReceive';
import { parseContinuousCollectionShareWithConsistency } from './continuousReceiveConsistency';
import { createContinuousResponseExport } from './continuousResponse';
import { parseContinuousResponseReturnWithConsistency } from './continuousReturnConsistency';
import { createContinuousCollectionShareExport } from './continuousShare';

const generatedAt = '2026-07-27T20:30:00.000Z';

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

function collection(): ContinuousCollection {
  return {
    id: 'collection-local',
    templateId: 'collection-open',
    label: 'Coleção aberta',
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

function receivedRecord(): ContinuousReceivedCollection {
  return {
    id: 'received-local',
    fingerprint: 'received-12345678',
    status: 'active',
    package: shareExport(),
    receivedAt: generatedAt,
    updatedAt: generatedAt
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

describe('contrato estrito no ciclo compartilhado', () => {
  it('aceita partilha oficial sem sobras', () => {
    const result = parseContinuousCollectionShareWithConsistency(shareExport());
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.warnings.join(' ')).toMatch(/contrato estrito confirmado/i);
  });

  it('recusa campo superior desconhecido mesmo com checksum válido', () => {
    const { consistency: _consistency, ...payload } = shareExport();
    const changed = attachContinuousConsistency({ ...payload, analyticsId: 'externo' });
    const result = parseContinuousCollectionShareWithConsistency(changed);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/contrato recusado.*analyticsId/i);
    expect(result.errors.join(' ')).not.toMatch(/selo de consistência recusado/i);
  });

  it('recusa campo desconhecido em coleção antes da sanitização', () => {
    const { consistency: _consistency, ...payload } = shareExport();
    const changed = attachContinuousConsistency({
      ...payload,
      collection: { ...payload.collection, owner: 'não suportado' }
    });
    const result = parseContinuousCollectionShareWithConsistency(changed);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/collection.*owner/i);
  });

  it('recusa campo desconhecido em consistência', () => {
    const original = shareExport();
    const changed = {
      ...original,
      consistency: { ...original.consistency, certificate: 'inventado' }
    };
    const result = parseContinuousCollectionShareWithConsistency(changed);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/consistency.*certificate/i);
  });

  it('mantém erro de checksum anterior ao contrato', () => {
    const original = shareExport();
    const changed = { ...original, unknown: true };
    const result = parseContinuousCollectionShareWithConsistency(changed);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/selo de consistência recusado/i);
  });

  it('mantém versão incompatível anterior ao contrato', () => {
    const { consistency: _consistency, ...payload } = shareExport();
    const changed = attachContinuousConsistency({ ...payload, catalogVersion: '2.0.0', unknown: true });
    const result = parseContinuousCollectionShareWithConsistency(changed);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/versão recusada/i);
  });

  it('aceita resposta oficial sem sobras', () => {
    const result = parseContinuousResponseReturnWithConsistency(responseExport());
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.warnings.join(' ')).toMatch(/contrato estrito confirmado/i);
  });

  it('recusa identidade adicional na resposta', () => {
    const { consistency: _consistency, ...payload } = responseExport();
    const changed = attachContinuousConsistency({
      ...payload,
      source: { ...payload.source, senderName: 'não suportado' }
    });
    const result = parseContinuousResponseReturnWithConsistency(changed);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/source.*senderName/i);
  });

  it('recusa texto livre adicional no gesto', () => {
    const { consistency: _consistency, ...payload } = responseExport();
    const changed = attachContinuousConsistency({
      ...payload,
      gesture: { ...payload.gesture, freeText: 'conteúdo adicional' }
    });
    const result = parseContinuousResponseReturnWithConsistency(changed);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/gesture.*freeText/i);
  });

  it('recusa lembrete adicional na expectativa', () => {
    const { consistency: _consistency, ...payload } = responseExport();
    const changed = attachContinuousConsistency({
      ...payload,
      expectation: { ...payload.expectation, reminderAt: generatedAt }
    });
    const result = parseContinuousResponseReturnWithConsistency(changed);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/expectation.*reminderAt/i);
  });

  it('mantém schema e conteúdo curado depois do contrato', () => {
    const { consistency: _consistency, ...payload } = responseExport();
    const changed = attachContinuousConsistency({ ...payload, schema: 'desconhecido' });
    const result = parseContinuousResponseReturnWithConsistency(changed);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/schema de resposta não reconhecido/i);
    expect(result.errors.join(' ')).not.toMatch(/contrato recusado/i);
  });
});
