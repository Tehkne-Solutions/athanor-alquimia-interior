import { describe, expect, it } from 'vitest';
import { continuousResponseGestures } from '../content/continuousResponse';
import { canonicalResponseNotices, canonicalShareNotices } from './continuousCanonicalNotice.testFixtures';
import type { ContinuousCollection } from './continuousCollection';
import { attachContinuousConsistency, verifyContinuousConsistency } from './continuousConsistency';
import type { ContinuousReceivedCollection } from './continuousReceive';
import { parseContinuousCollectionShareWithConsistency } from './continuousReceiveConsistency';
import { readContinuousJsonFile } from './continuousResource';
import { createContinuousResponseExport } from './continuousResponse';
import { parseContinuousResponseReturnWithConsistency } from './continuousReturnConsistency';
import { createContinuousCollectionShareExport } from './continuousShare';
import { validateContinuousTextVisibility } from './continuousTextVisibility';

const generatedAt = '2026-07-27T19:00:00.000Z';

function sharePayload(label = 'Coleção aberta') {
  return {
    schema: 'athanor-continuous-collection-share-v1',
    policy: 'explicit-consent-minimized-local-export-v1',
    catalogVersion: '1.0.0',
    generatedAt,
    provenance: {
      product: 'Athanor — Alquimia Interior',
      author: 'Tehkné Solutions',
      transmission: 'manual-local-file'
    },
    collection: {
      templateId: 'collection-open',
      label,
      status: 'active',
      itemCount: 0
    },
    options: { includeDates: false },
    items: [],
    notices: canonicalShareNotices(false, 0)
  };
}

function responsePayload(label = 'Coleção aberta') {
  const gesture = continuousResponseGestures.find((entry) => entry.id === 'gratitude');
  if (!gesture) throw new Error('Gesto curado ausente.');
  return {
    schema: 'athanor-continuous-response-v1',
    policy: 'optional-curated-no-tracking-v1',
    catalogVersion: '1.0.0',
    generatedAt,
    provenance: {
      product: 'Athanor — Alquimia Interior',
      author: 'Tehkné Solutions',
      transmission: 'manual-local-file'
    },
    source: {
      fingerprint: 'received-12345678',
      collectionLabel: label,
      itemCount: 0,
      status: 'active'
    },
    gesture: {
      id: gesture.id,
      label: gesture.label,
      statement: gesture.statement
    },
    expectation: {
      replyRequired: false,
      deliveryTracked: false,
      recipientStored: false
    },
    notices: canonicalResponseNotices(0)
  };
}

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

function receivedRecord(label = 'Coleção aberta'): ContinuousReceivedCollection {
  return {
    id: 'received-local',
    fingerprint: 'received-12345678',
    status: 'active',
    package: sharePayload(label) as ContinuousReceivedCollection['package'],
    receivedAt: generatedAt,
    updatedAt: generatedAt
  };
}

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

describe('visibilidade textual no ciclo compartilhado', () => {
  it('aceita partilha NFC selada e registra aviso de texto visível', () => {
    const result = parseContinuousCollectionShareWithConsistency(
      attachContinuousConsistency(sharePayload('Memória e ação'))
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.warnings.join(' ')).toMatch(/texto visível e Unicode NFC confirmado/i);
  });

  it('recusa partilha não NFC antes do checksum e da versão', () => {
    const input = {
      ...sharePayload('Cafe\u0301'),
      catalogVersion: '99.0.0'
    };
    const result = parseContinuousCollectionShareWithConsistency(input);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/texto recusado.*não está normalizado.*NFC/i);
    expect(result.errors.join(' ')).not.toMatch(/selo de consistência|versão recusada/i);
  });

  it('recusa controle bidirecional mesmo quando o checksum corresponde', () => {
    const sealed = attachContinuousConsistency(sharePayload('Relato\u202Etxt'));
    expect(verifyContinuousConsistency(sealed).status).toBe('valid');
    const result = parseContinuousCollectionShareWithConsistency(sealed);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/texto recusado.*U\+202E/i);
  });

  it('recusa nome de campo invisível antes do parser de domínio', () => {
    const input = {
      ...sharePayload(),
      ['extra\u200Bcampo']: true
    };
    const result = parseContinuousCollectionShareWithConsistency(input);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/texto recusado.*nome de campo.*U\+200B/i);
  });

  it('recusa retorno com caractere de substituição antes da prévia', () => {
    const result = parseContinuousResponseReturnWithConsistency(
      responsePayload('Coleção\uFFFD aberta')
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/texto recusado.*U\+FFFD/i);
  });

  it('recusa controle invisível durante leitura local do arquivo', async () => {
    const text = JSON.stringify(sharePayload('Coleção\u200B aberta'));
    const result = await readContinuousJsonFile({
      size: new TextEncoder().encode(text).length,
      text: async () => text
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/texto recusado.*U\+200B/i);
  });

  it('mantém orçamento anterior como barreira precedente', () => {
    const result = parseContinuousCollectionShareWithConsistency({
      ...sharePayload('Coleção\u202E'),
      items: Array.from({ length: 1_001 }, () => null)
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/limite local recusado.*lista/i);
    expect(result.errors.join(' ')).not.toMatch(/texto recusado/i);
  });

  it('impede gerar partilha com rótulo não NFC sem normalizar', () => {
    const result = createContinuousCollectionShareExport(
      collection('Cafe\u0301'),
      shareConsent,
      { includeDates: false },
      '1.0.0',
      generatedAt
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/gerar texto visível.*não está normalizado/i);
  });

  it('impede gerar resposta com controle direcional na referência', () => {
    const gesture = continuousResponseGestures.find((entry) => entry.id === 'gratitude');
    if (!gesture) throw new Error('Gesto curado ausente.');
    const result = createContinuousResponseExport(
      receivedRecord('Coleção\u2067 aberta'),
      gesture,
      responseConsent,
      '1.0.0',
      generatedAt
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/gerar texto visível.*U\+2067/i);
  });

  it('gera partilha válida, visível e com selo consistente', () => {
    const result = createContinuousCollectionShareExport(
      collection('Água, memória e apoio'),
      shareConsent,
      { includeDates: false },
      '1.0.0',
      generatedAt
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(validateContinuousTextVisibility(result.export).ok).toBe(true);
    expect(verifyContinuousConsistency(result.export).status).toBe('valid');
  });

  it('gera resposta válida, visível e com selo consistente', () => {
    const gesture = continuousResponseGestures.find((entry) => entry.id === 'gratitude');
    if (!gesture) throw new Error('Gesto curado ausente.');
    const result = createContinuousResponseExport(
      receivedRecord('Espírito e síntese possível'),
      gesture,
      responseConsent,
      '1.0.0',
      generatedAt
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(validateContinuousTextVisibility(result.export).ok).toBe(true);
    expect(verifyContinuousConsistency(result.export).status).toBe('valid');
  });
});
