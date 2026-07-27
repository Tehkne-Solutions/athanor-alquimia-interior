import { describe, expect, it } from 'vitest';
import { continuousResponseGestures } from '../content/continuousResponse';
import type { ContinuousReceivedCollection } from './continuousReceive';
import {
  buildContinuousResponsePreview,
  createContinuousResponseExport,
  emptyContinuousResponseConsent,
  hasExplicitContinuousResponseConsent,
  type ContinuousResponseConsent
} from './continuousResponse';

const generatedAt = '2026-07-27T16:00:00.000Z';

function record(overrides: Partial<ContinuousReceivedCollection> = {}): ContinuousReceivedCollection {
  return {
    id: 'received-private-id',
    fingerprint: 'received-a1b2c3d4',
    status: 'active',
    receivedAt: '2026-07-27T14:00:00.000Z',
    updatedAt: '2026-07-27T14:00:00.000Z',
    package: {
      schema: 'athanor-continuous-collection-share-v1',
      policy: 'explicit-consent-minimized-local-export-v1',
      catalogVersion: '1.0.0',
      generatedAt: '2026-07-27T13:00:00.000Z',
      provenance: {
        product: 'Athanor — Alquimia Interior',
        author: 'Tehkné Solutions',
        transmission: 'manual-local-file'
      },
      collection: {
        templateId: 'collection-spirit',
        label: 'Espírito e síntese possível',
        status: 'active',
        itemCount: 1
      },
      options: { includeDates: true },
      items: [{
        position: 1,
        kind: 'trail',
        startPoint: 'spirit',
        themeId: 'theme-trust',
        noTheme: false,
        variantId: 'private-variant-id',
        packageId: 'private-package-id',
        packageLabel: 'Pacote privado',
        status: 'completed',
        depth: 2,
        endedEarly: false,
        passageSummary: { completed: 2, passed: 0, pending: 0 },
        occurredAt: '2026-07-26T10:00:00.000Z',
        completedAt: '2026-07-26T11:00:00.000Z'
      }],
      notices: ['Aviso da origem']
    },
    ...overrides
  };
}

const consent: ContinuousResponseConsent = {
  source: true,
  preview: true,
  localFile: true,
  noReply: true
};

const gratitude = continuousResponseGestures.find((gesture) => gesture.id === 'gratitude')!;
const silence = continuousResponseGestures.find((gesture) => gesture.id === 'silence')!;

describe('resposta opcional sem cobrança', () => {
  it('exige quatro confirmações explícitas', () => {
    expect(hasExplicitContinuousResponseConsent(emptyContinuousResponseConsent())).toBe(false);
    expect(hasExplicitContinuousResponseConsent(consent)).toBe(true);
  });

  it('recusa arquivo quando uma confirmação estiver ausente', () => {
    const result = createContinuousResponseExport(record(), gratitude, { ...consent, noReply: false }, '1.0.0', generatedAt);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/quatro confirmações/i);
  });

  it('reconhece silêncio como conclusão sem arquivo', () => {
    const preview = buildContinuousResponsePreview(record(), silence);
    expect(preview.notices.join(' ')).toMatch(/nenhum arquivo ou histórico/i);
    const result = createContinuousResponseExport(record(), silence, consent, '1.0.0', generatedAt);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/silêncio preservado não gera arquivo/i);
  });

  it('gera schema e política oficiais para gesto com arquivo', () => {
    const result = createContinuousResponseExport(record(), gratitude, consent, '1.0.0', generatedAt);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.export.schema).toBe('athanor-continuous-response-v1');
    expect(result.export.policy).toBe('optional-curated-no-tracking-v1');
    expect(result.export.provenance.author).toBe('Tehkné Solutions');
  });

  it('declara ausência de cobrança, rastreamento e destinatário armazenado', () => {
    const preview = buildContinuousResponsePreview(record(), gratitude);
    expect(preview.expectation).toEqual({
      replyRequired: false,
      deliveryTracked: false,
      recipientStored: false
    });
  });

  it('não inclui id local, itens ou metadados internos da origem', () => {
    const result = createContinuousResponseExport(record(), gratitude, consent, '1.0.0', generatedAt);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const serialized = JSON.stringify(result.export);
    expect(serialized).not.toContain('received-private-id');
    expect(serialized).not.toContain('private-variant-id');
    expect(serialized).not.toContain('private-package-id');
    expect(serialized).not.toContain('Pacote privado');
    expect(serialized).not.toContain('theme-trust');
    expect(serialized).not.toContain('passageSummary');
  });

  it('não inclui datas recebidas nem histórico de recepção', () => {
    const result = createContinuousResponseExport(record(), gratitude, consent, '1.0.0', generatedAt);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const serialized = JSON.stringify(result.export);
    expect(serialized).not.toContain('2026-07-26T10:00:00.000Z');
    expect(serialized).not.toContain('2026-07-26T11:00:00.000Z');
    expect(serialized).not.toContain('2026-07-27T14:00:00.000Z');
  });

  it('referencia somente impressão, rótulo, quantidade e estado', () => {
    const preview = buildContinuousResponsePreview(record(), gratitude);
    expect(preview.source).toEqual({
      fingerprint: 'received-a1b2c3d4',
      collectionLabel: 'Espírito e síntese possível',
      itemCount: 1,
      status: 'active'
    });
  });

  it('preserva coleção vazia sem interpretar falta', () => {
    const empty = record({
      package: {
        ...record().package,
        collection: { ...record().package.collection, itemCount: 0 },
        items: []
      }
    });
    const preview = buildContinuousResponsePreview(empty, gratitude);
    expect(preview.source.itemCount).toBe(0);
    expect(preview.notices.join(' ')).toMatch(/coleção vazia e permanece válida/i);
  });

  it('permite referenciar cópia arquivada sem reativá-la', () => {
    const archived = record({ status: 'archived', archivedAt: generatedAt });
    const preview = buildContinuousResponsePreview(archived, gratitude);
    expect(preview.source.status).toBe('archived');
    expect(archived.status).toBe('archived');
  });

  it('não cria campos de identidade, contato, prazo ou progresso', () => {
    const result = createContinuousResponseExport(record(), gratitude, consent, '1.0.0', generatedAt);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(JSON.stringify(result.export)).not.toMatch(/sender|name|email|phone|contact|deadline|streak|score|rank|reward/i);
  });
});
