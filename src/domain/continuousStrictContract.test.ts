import { describe, expect, it } from 'vitest';
import {
  continuousResponseContractV1,
  continuousShareContractV1,
  validateContinuousResponseStrictContract,
  validateContinuousShareStrictContract,
  validateContinuousStrictContract
} from './continuousStrictContract';

function sharePayload(): Record<string, unknown> {
  return {
    schema: 'athanor-continuous-collection-share-v1',
    policy: 'explicit-consent-minimized-local-export-v1',
    catalogVersion: '1.0.0',
    generatedAt: '2026-07-27T20:00:00.000Z',
    provenance: {
      product: 'Athanor — Alquimia Interior',
      author: 'Tehkné Solutions',
      transmission: 'manual-local-file'
    },
    collection: {
      templateId: 'collection-open',
      label: 'Coleção aberta',
      status: 'active',
      itemCount: 1
    },
    options: { includeDates: false },
    items: [{
      position: 1,
      kind: 'trail',
      startPoint: 'word',
      noTheme: true,
      variantId: 'word-v1',
      status: 'completed',
      endedEarly: false,
      passageSummary: { completed: 1, passed: 0, pending: 0 }
    }],
    notices: ['Arquivo local minimizado.'],
    consistency: {
      version: '1.0.0',
      algorithm: 'fnv1a-32',
      scope: 'top-level-without-consistency',
      checksum: 'fnv1a32-00000000',
      cryptographic: false,
      authenticatesIdentity: false
    }
  };
}

function responsePayload(): Record<string, unknown> {
  return {
    schema: 'athanor-continuous-response-v1',
    policy: 'optional-curated-no-tracking-v1',
    catalogVersion: '1.0.0',
    generatedAt: '2026-07-27T20:00:00.000Z',
    provenance: {
      product: 'Athanor — Alquimia Interior',
      author: 'Tehkné Solutions',
      transmission: 'manual-local-file'
    },
    source: {
      fingerprint: 'received-12345678',
      collectionLabel: 'Coleção aberta',
      itemCount: 1,
      status: 'active'
    },
    gesture: {
      id: 'gratitude',
      label: 'Agradecimento simples',
      statement: 'Recebi sua partilha com gratidão.'
    },
    expectation: {
      replyRequired: false,
      deliveryTracked: false,
      recipientStored: false
    },
    notices: ['Nenhuma resposta adicional é necessária.']
  };
}

describe('contrato estrito de campos', () => {
  it('aceita todos os campos oficiais de uma partilha', () => {
    const result = validateContinuousShareStrictContract(sharePayload());
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.stats.unknownFields).toBe(0);
    expect(result.message).toMatch(/contrato estrito confirmado/i);
  });

  it('aceita campos opcionais ausentes', () => {
    const payload = sharePayload();
    delete (payload as { consistency?: unknown }).consistency;
    const item = (payload.items as Array<Record<string, unknown>>)[0];
    delete item.themeId;
    delete item.packageId;
    delete item.packageLabel;
    delete item.depth;
    delete item.occurredAt;
    delete item.completedAt;
    expect(validateContinuousShareStrictContract(payload).ok).toBe(true);
  });

  it('recusa campo desconhecido no nível superior', () => {
    const result = validateContinuousShareStrictContract({ ...sharePayload(), hidden: true });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.unknownPaths).toContain('$["hidden"]');
  });

  it('recusa campo desconhecido na proveniência', () => {
    const payload = sharePayload();
    payload.provenance = { ...(payload.provenance as object), certificate: 'inventado' };
    const result = validateContinuousShareStrictContract(payload);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/provenance.*certificate/i);
  });

  it('recusa campo desconhecido em item de lista', () => {
    const payload = sharePayload();
    (payload.items as Array<Record<string, unknown>>)[0].score = 99;
    const result = validateContinuousShareStrictContract(payload);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/items.*score/i);
  });

  it('recusa campo desconhecido no resumo de passagens', () => {
    const payload = sharePayload();
    const item = (payload.items as Array<Record<string, unknown>>)[0];
    item.passageSummary = { ...(item.passageSummary as object), total: 1 };
    const result = validateContinuousShareStrictContract(payload);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/passageSummary.*total/i);
  });

  it('aceita todos os campos oficiais de uma resposta', () => {
    expect(validateContinuousResponseStrictContract(responsePayload()).ok).toBe(true);
  });

  it('recusa campo desconhecido na origem da resposta', () => {
    const payload = responsePayload();
    payload.source = { ...(payload.source as object), sender: 'alguém' };
    const result = validateContinuousResponseStrictContract(payload);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/source.*sender/i);
  });

  it('recusa campo desconhecido no gesto', () => {
    const payload = responsePayload();
    payload.gesture = { ...(payload.gesture as object), freeText: 'extra' };
    expect(validateContinuousResponseStrictContract(payload).ok).toBe(false);
  });

  it('recusa campo desconhecido na expectativa', () => {
    const payload = responsePayload();
    payload.expectation = { ...(payload.expectation as object), reminderAt: 'amanhã' };
    expect(validateContinuousResponseStrictContract(payload).ok).toBe(false);
  });

  it('não trata propriedades herdadas do manifesto como campos conhecidos', () => {
    const result = validateContinuousShareStrictContract({ ...sharePayload(), toString: 'extra' });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.unknownPaths).toContain('$["toString"]');
  });

  it('não executa getter durante inspeção', () => {
    let executed = false;
    const payload = sharePayload();
    Object.defineProperty(payload, 'generatedAt', {
      enumerable: true,
      get() {
        executed = true;
        return '2026-07-27T20:00:00.000Z';
      }
    });
    validateContinuousShareStrictContract(payload);
    expect(executed).toBe(false);
  });

  it('recusa propriedade simbólica sem imprimir sua descrição', () => {
    const payload = sharePayload();
    Object.defineProperty(payload, Symbol('segredo'), { enumerable: true, value: 1 });
    const result = validateContinuousShareStrictContract(payload);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.unknownPaths).toContain('$[[symbol]]');
    expect(result.errors.join(' ')).not.toContain('segredo');
  });

  it('não confunde tipo inválido com campo desconhecido', () => {
    const payload = sharePayload();
    payload.collection = 'inválida';
    const result = validateContinuousShareStrictContract(payload);
    expect(result.ok).toBe(true);
  });

  it('não depende da ordem dos campos', () => {
    const payload = sharePayload();
    const reordered = Object.fromEntries(Object.entries(payload).reverse());
    expect(validateContinuousShareStrictContract(reordered).ok).toBe(true);
  });

  it('limita diagnósticos a vinte caminhos', () => {
    const extras = Object.fromEntries(Array.from({ length: 25 }, (_, index) => [`extra${index}`, index]));
    const result = validateContinuousShareStrictContract({ ...sharePayload(), ...extras });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.unknownPaths).toHaveLength(20);
    expect(result.truncated).toBe(true);
    expect(result.errors.at(-1)).toMatch(/outros 5 campos/i);
  });

  it('permite usar o validador com manifesto explícito', () => {
    expect(validateContinuousStrictContract(sharePayload(), continuousShareContractV1, 'Partilha').ok).toBe(true);
    expect(validateContinuousStrictContract(responsePayload(), continuousResponseContractV1, 'Resposta').ok).toBe(true);
  });
});
