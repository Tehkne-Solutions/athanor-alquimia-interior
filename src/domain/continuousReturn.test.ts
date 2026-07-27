import { describe, expect, it } from 'vitest';
import type { ContinuousResponseExport } from './continuousResponse';
import {
  completeContinuousReturnReview,
  emptyContinuousReturnConsent,
  hasExplicitContinuousReturnConsent,
  parseContinuousResponseReturn,
  type ContinuousReturnConsent
} from './continuousReturn';

const responsePackage: ContinuousResponseExport = {
  schema: 'athanor-continuous-response-v1',
  policy: 'optional-curated-no-tracking-v1',
  catalogVersion: '1.0.0',
  generatedAt: '2026-07-27T16:00:00.000Z',
  provenance: {
    product: 'Athanor — Alquimia Interior',
    author: 'Tehkné Solutions',
    transmission: 'manual-local-file'
  },
  source: {
    fingerprint: 'received-12345678',
    collectionLabel: 'Coleção aberta',
    itemCount: 2,
    status: 'active'
  },
  gesture: {
    id: 'gratitude',
    label: 'Agradecimento simples',
    statement: 'Agradeço a partilha. Nenhuma resposta adicional é necessária.'
  },
  expectation: {
    replyRequired: false,
    deliveryTracked: false,
    recipientStored: false
  },
  notices: [
    'A resposta não inclui os itens nem as datas da coleção recebida.',
    'Nenhuma resposta adicional é necessária.'
  ]
};

const consent: ContinuousReturnConsent = {
  file: true,
  preview: true,
  noReopen: true
};

describe('retorno que não reabre o ciclo', () => {
  it('exige três confirmações explícitas', () => {
    expect(hasExplicitContinuousReturnConsent(emptyContinuousReturnConsent())).toBe(false);
    expect(hasExplicitContinuousReturnConsent(consent)).toBe(true);
  });

  it('aceita e sanitiza pacote oficial de resposta', () => {
    const result = parseContinuousResponseReturn({ ...responsePackage, ignored: 'removido' });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.package).toEqual(responsePackage);
    expect(JSON.stringify(result.package)).not.toContain('ignored');
  });

  it('rejeita schema e política incompatíveis', () => {
    const result = parseContinuousResponseReturn({ ...responsePackage, schema: 'outro', policy: 'outra' });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/schema/i);
    expect(result.errors.join(' ')).toMatch(/política/i);
  });

  it('rejeita autoria, produto ou transmissão incompatíveis', () => {
    const result = parseContinuousResponseReturn({
      ...responsePackage,
      provenance: { product: 'Outro', author: 'Outra', transmission: 'network' }
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/produto/i);
    expect(result.errors.join(' ')).toMatch(/autoria/i);
    expect(result.errors.join(' ')).toMatch(/transmissão/i);
  });

  it('rejeita gesto adulterado ou texto livre', () => {
    const result = parseContinuousResponseReturn({
      ...responsePackage,
      gesture: { ...responsePackage.gesture, statement: 'Mensagem livre adicionada.' }
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/catálogo curado/i);
  });

  it('rejeita arquivo de silêncio preservado', () => {
    const result = parseContinuousResponseReturn({
      ...responsePackage,
      gesture: {
        id: 'silence',
        label: 'Silêncio preservado',
        statement: 'Nenhum arquivo de resposta será criado.'
      }
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/não reconhecido|não exportável/i);
  });

  it('rejeita exigência de nova resposta ou rastreamento', () => {
    const result = parseContinuousResponseReturn({
      ...responsePackage,
      expectation: { replyRequired: true, deliveryTracked: true, recipientStored: true }
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/novo retorno/i);
    expect(result.errors.join(' ')).toMatch(/rastrear entrega/i);
    expect(result.errors.join(' ')).toMatch(/destinatário/i);
  });

  it('preserva coleção vazia sem tratá-la como falha', () => {
    const result = parseContinuousResponseReturn({
      ...responsePackage,
      source: { ...responsePackage.source, itemCount: 0 }
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.warnings.join(' ')).toMatch(/coleção vazia/i);
  });

  it('avisa quando a origem estava arquivada sem reativá-la', () => {
    const result = parseContinuousResponseReturn({
      ...responsePackage,
      source: { ...responsePackage.source, status: 'archived' }
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.package.source.status).toBe('archived');
    expect(result.warnings.join(' ')).toMatch(/arquivada/i);
  });

  it('conclui leitura sem criar registro, resposta ou lembrete', () => {
    const result = completeContinuousReturnReview(responsePackage, consent);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.conclusion).toEqual({
      recordCreated: false,
      sourceReopened: false,
      replyRequired: false,
      reminderCreated: false
    });
  });

  it('recusa conclusão sem consentimento completo', () => {
    const result = completeContinuousReturnReview(responsePackage, { ...consent, noReopen: false });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/três confirmações/i);
  });

  it('não inclui campos de identidade, contato, prazo, progresso ou histórico', () => {
    const result = parseContinuousResponseReturn(responsePackage);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(JSON.stringify(result.package)).not.toMatch(/email|phone|contact|recipientName|deadline|reminder|progress|history|followUp/i);
  });
});
