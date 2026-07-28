import { describe, expect, it } from 'vitest';
import { continuousResponseGestures } from '../content/continuousResponse';
import { canonicalResponseNotices, canonicalShareNotices } from './continuousCanonicalNotice.testFixtures';
import type { ContinuousCollection } from './continuousCollection';
import type { ContinuousReceivedCollection } from './continuousReceive';
import { parseContinuousCollectionShareWithConsistency } from './continuousReceiveConsistency';
import { readContinuousJsonFile } from './continuousResource';
import { createContinuousResponseExport } from './continuousResponse';
import { parseContinuousResponseReturnWithConsistency } from './continuousReturnConsistency';
import { createContinuousCollectionShareExport } from './continuousShare';
import { inspectContinuousJsonUniqueKeys } from './continuousUniqueKeys';

const generatedAt = '2026-07-27T20:00:00.000Z';

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
    notices: canonicalShareNotices(false, 0)
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
    notices: canonicalResponseNotices(0)
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

async function read(text: string) {
  return readContinuousJsonFile({
    size: new TextEncoder().encode(text).length,
    text: async () => text
  });
}

describe('unicidade de chaves no ciclo compartilhado', () => {
  it('recusa catalogVersion repetido antes da matriz de versão', async () => {
    const text = JSON.stringify(sharePayload()).replace(
      '"catalogVersion":"1.0.0"',
      '"catalogVersion":"1.0.0","catalogVersion":"99.0.0"'
    );
    const result = await read(text);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/chave JSON recusada.*catalogVersion.*repetida/i);
    expect(result.errors.join(' ')).not.toMatch(/versão recusada/i);
  });

  it('recusa chave escapada equivalente antes do parse', async () => {
    const text = JSON.stringify(sharePayload()).replace(
      '"catalogVersion":"1.0.0"',
      String.raw`"catalogVersion":"1.0.0","\u0063atalogVersion":"2.0.0"`
    );
    const result = await read(text);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/catalogVersion/i);
  });

  it('recusa duplicata aninhada antes do conteúdo curado', async () => {
    const text = JSON.stringify(sharePayload()).replace(
      '"label":"Coleção aberta"',
      '"label":"Coleção aberta","label":"Outra coleção"'
    );
    const result = await read(text);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/chave JSON recusada.*label/i);
  });

  it('recusa campo de checksum duplicado antes da conferência', async () => {
    const text = JSON.stringify({
      ...sharePayload(),
      consistency: {
        version: '1.0.0',
        algorithm: 'fnv1a-32',
        scope: 'top-level-without-consistency',
        checksum: 'fnv1a32-00000000',
        cryptographic: false,
        authenticatesIdentity: false
      }
    }).replace(
      '"checksum":"fnv1a32-00000000"',
      '"checksum":"fnv1a32-00000000","checksum":"fnv1a32-ffffffff"'
    );
    const result = await read(text);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/chave JSON recusada.*checksum/i);
    expect(result.errors.join(' ')).not.toMatch(/selo de consistência/i);
  });

  it('mantém mensagem genérica para JSON malformado', async () => {
    const result = await read('{bad');
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/interpretar.*JSON/i);
  });

  it('aceita partilha válida e segue para as demais barreiras', async () => {
    const result = await read(JSON.stringify(sharePayload()));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const parsed = parseContinuousCollectionShareWithConsistency(result.value);
    expect(parsed.ok).toBe(true);
  });

  it('aceita resposta válida e segue para a prévia transitória', async () => {
    const result = await read(JSON.stringify(responsePayload()));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const parsed = parseContinuousResponseReturnWithConsistency(result.value);
    expect(parsed.ok).toBe(true);
  });

  it('confirma chaves únicas no JSON de partilha gerado', () => {
    const result = createContinuousCollectionShareExport(
      collection(),
      shareConsent,
      { includeDates: false },
      '1.0.0',
      generatedAt
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(inspectContinuousJsonUniqueKeys(JSON.stringify(result.export)).ok).toBe(true);
  });

  it('confirma chaves únicas no JSON de resposta gerado', () => {
    const gesture = continuousResponseGestures.find((entry) => entry.id === 'gratitude');
    if (!gesture) throw new Error('Gesto curado ausente.');
    const result = createContinuousResponseExport(
      receivedRecord(),
      gesture,
      responseConsent,
      '1.0.0',
      generatedAt
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(inspectContinuousJsonUniqueKeys(JSON.stringify(result.export)).ok).toBe(true);
  });

  it('permite nomes iguais em objetos irmãos', async () => {
    const text = '{"left":{"id":1},"right":{"id":2}}';
    const result = await read(text);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toEqual({ left: { id: 1 }, right: { id: 2 } });
  });
});
