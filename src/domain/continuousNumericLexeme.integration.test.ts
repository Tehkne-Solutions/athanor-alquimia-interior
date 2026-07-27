import { describe, expect, it } from 'vitest';
import { continuousResponseGestures } from '../content/continuousResponse';
import type { ContinuousCollection } from './continuousCollection';
import { inspectContinuousJsonNumbers } from './continuousNumericLexeme';
import type { ContinuousReceivedCollection } from './continuousReceive';
import { parseContinuousCollectionShareWithConsistency } from './continuousReceiveConsistency';
import { readContinuousJsonFile } from './continuousResource';
import { createContinuousResponseExport } from './continuousResponse';
import { parseContinuousResponseReturnWithConsistency } from './continuousReturnConsistency';
import { createContinuousCollectionShareExport } from './continuousShare';

const generatedAt = '2026-07-27T21:00:00.000Z';

function sharePayload() {
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
      label: 'Coleção aberta',
      status: 'active',
      itemCount: 0
    },
    options: { includeDates: false },
    items: [],
    notices: ['Coleção vazia preservada.']
  };
}

function responsePayload() {
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
      collectionLabel: 'Coleção aberta',
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
    notices: ['Nenhuma resposta adicional é necessária.']
  };
}

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

function receivedRecord(): ContinuousReceivedCollection {
  return {
    id: 'received-local',
    fingerprint: 'received-12345678',
    status: 'active',
    package: sharePayload() as ContinuousReceivedCollection['package'],
    receivedAt: generatedAt,
    updatedAt: generatedAt
  };
}

async function read(text: string) {
  return readContinuousJsonFile({
    size: new TextEncoder().encode(text).length,
    text: async () => text
  });
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

describe('medida numérica no ciclo compartilhado', () => {
  it('recusa itemCount fora da faixa segura antes do schema', async () => {
    const text = JSON.stringify(sharePayload()).replace('"itemCount":0', '"itemCount":9007199254740992');
    const result = await read(text);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/Número JSON recusado.*faixa inteira segura/i);
  });

  it('recusa decimal arredondado mesmo em campo desconhecido', async () => {
    const text = JSON.stringify({ ...sharePayload(), diagnostic: 0.1 }).replace('"diagnostic":0.1', '"diagnostic":0.10000000000000001');
    const result = await read(text);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/mudaria silenciosamente de medida/i);
  });

  it('recusa overflow antes do checksum e da versão', async () => {
    const text = JSON.stringify({ ...sharePayload(), diagnostic: 1 }).replace('"diagnostic":1', '"diagnostic":1e400');
    const result = await read(text);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/não permanece finito/i);
    expect(result.errors.join(' ')).not.toMatch(/selo|versão/i);
  });

  it('recusa underflow para zero antes da sanitização', async () => {
    const text = JSON.stringify({ ...sharePayload(), diagnostic: 1 }).replace('"diagnostic":1', '"diagnostic":1e-400');
    const result = await read(text);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/mudaria silenciosamente de medida/i);
  });

  it('recusa zero negativo antes do parser de domínio', async () => {
    const text = JSON.stringify(sharePayload()).replace('"itemCount":0', '"itemCount":-0');
    const result = await read(text);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/perderia o sinal/i);
  });

  it('não interpreta números contidos em textos', async () => {
    const result = await read(JSON.stringify({ ...sharePayload(), note: '9007199254740993 1e400 -0' }));
    expect(result.ok).toBe(true);
  });

  it('aceita partilha válida e segue para as demais barreiras', async () => {
    const result = await read(JSON.stringify(sharePayload()));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(parseContinuousCollectionShareWithConsistency(result.value).ok).toBe(true);
  });

  it('aceita resposta válida e segue para a prévia transitória', async () => {
    const result = await read(JSON.stringify(responsePayload()));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(parseContinuousResponseReturnWithConsistency(result.value).ok).toBe(true);
  });

  it('confirma medida preservada na partilha gerada', () => {
    const result = createContinuousCollectionShareExport(collection(), shareConsent, { includeDates: false }, '1.0.0', generatedAt);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(inspectContinuousJsonNumbers(JSON.stringify(result.export)).ok).toBe(true);
  });

  it('confirma medida preservada na resposta gerada', () => {
    const gesture = continuousResponseGestures.find((entry) => entry.id === 'gratitude');
    if (!gesture) throw new Error('Gesto curado ausente.');
    const result = createContinuousResponseExport(receivedRecord(), gesture, responseConsent, '1.0.0', generatedAt);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(inspectContinuousJsonNumbers(JSON.stringify(result.export)).ok).toBe(true);
  });
});
