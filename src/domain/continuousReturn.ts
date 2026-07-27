import {
  continuousResponseGestures,
  type ContinuousResponseGestureId
} from '../content/continuousResponse';
import type { ContinuousResponseExport } from './continuousResponse';

export interface ContinuousReturnConsent {
  file: boolean;
  preview: boolean;
  noReopen: boolean;
}

export interface ContinuousReturnSuccess {
  ok: true;
  package: ContinuousResponseExport;
  warnings: string[];
}

export interface ContinuousReturnFailure {
  ok: false;
  errors: string[];
}

export type ContinuousReturnResult = ContinuousReturnSuccess | ContinuousReturnFailure;

export interface ContinuousReturnCompletion {
  ok: true;
  conclusion: {
    recordCreated: false;
    sourceReopened: false;
    replyRequired: false;
    reminderCreated: false;
  };
}

export interface ContinuousReturnCompletionFailure {
  ok: false;
  errors: string[];
}

export type ContinuousReturnCompletionResult = ContinuousReturnCompletion | ContinuousReturnCompletionFailure;

const exportableGestureIds: ContinuousResponseGestureId[] = ['gratitude', 'received', 'time', 'boundary'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

export const emptyContinuousReturnConsent = (): ContinuousReturnConsent => ({
  file: false,
  preview: false,
  noReopen: false
});

export function hasExplicitContinuousReturnConsent(consent: ContinuousReturnConsent): boolean {
  return consent.file && consent.preview && consent.noReopen;
}

export function parseContinuousResponseReturn(input: unknown): ContinuousReturnResult {
  if (!isRecord(input)) return { ok: false, errors: ['Arquivo JSON inválido.'] };
  const errors: string[] = [];

  if (input.schema !== 'athanor-continuous-response-v1') errors.push('Schema de resposta não reconhecido.');
  if (input.policy !== 'optional-curated-no-tracking-v1') errors.push('Política de resposta incompatível.');
  if (!isString(input.catalogVersion)) errors.push('Versão do catálogo inválida.');
  if (!isString(input.generatedAt)) errors.push('Data de geração inválida.');

  if (!isRecord(input.provenance)) {
    errors.push('Proveniência ausente ou inválida.');
  } else {
    if (input.provenance.product !== 'Athanor — Alquimia Interior') errors.push('Produto de origem incompatível.');
    if (input.provenance.author !== 'Tehkné Solutions') errors.push('Autoria de origem incompatível.');
    if (input.provenance.transmission !== 'manual-local-file') errors.push('Modo de transmissão incompatível.');
  }

  if (!isRecord(input.source)) {
    errors.push('Referência de origem ausente ou inválida.');
  } else {
    if (!isString(input.source.fingerprint)) errors.push('Impressão da origem inválida.');
    if (!isString(input.source.collectionLabel)) errors.push('Rótulo da origem inválido.');
    if (!isNonNegativeInteger(input.source.itemCount)) errors.push('Quantidade descritiva inválida.');
    if (!['active', 'archived'].includes(String(input.source.status))) errors.push('Estado da origem inválido.');
  }

  if (!isRecord(input.gesture)) {
    errors.push('Gesto de resposta ausente ou inválido.');
  } else {
    const gesture = input.gesture;
    if (!exportableGestureIds.includes(gesture.id as ContinuousResponseGestureId)) {
      errors.push('Gesto de resposta não reconhecido ou não exportável.');
    } else {
      const catalogGesture = continuousResponseGestures.find((entry) => entry.id === gesture.id);
      if (!catalogGesture || gesture.label !== catalogGesture.label || gesture.statement !== catalogGesture.statement) {
        errors.push('O gesto recebido não corresponde ao catálogo curado.');
      }
    }
  }

  if (!isRecord(input.expectation)) {
    errors.push('Limites de expectativa ausentes ou inválidos.');
  } else {
    if (input.expectation.replyRequired !== false) errors.push('A resposta não pode exigir novo retorno.');
    if (input.expectation.deliveryTracked !== false) errors.push('A resposta não pode rastrear entrega.');
    if (input.expectation.recipientStored !== false) errors.push('A resposta não pode armazenar destinatário.');
  }

  if (!Array.isArray(input.notices) || !input.notices.every((notice) => isString(notice))) {
    errors.push('Avisos de segurança ausentes ou inválidos.');
  }

  if (
    errors.length > 0
    || !isRecord(input.provenance)
    || !isRecord(input.source)
    || !isRecord(input.gesture)
    || !isRecord(input.expectation)
    || !Array.isArray(input.notices)
  ) {
    return { ok: false, errors };
  }

  const gestureId = input.gesture.id as ContinuousResponseGestureId;
  const catalogGesture = continuousResponseGestures.find((gesture) => gesture.id === gestureId);
  if (!catalogGesture || !catalogGesture.createsFile) {
    return { ok: false, errors: ['O gesto recebido não pode existir como arquivo de retorno.'] };
  }

  const sanitized: ContinuousResponseExport = {
    schema: 'athanor-continuous-response-v1',
    policy: 'optional-curated-no-tracking-v1',
    catalogVersion: input.catalogVersion as string,
    generatedAt: input.generatedAt as string,
    provenance: {
      product: 'Athanor — Alquimia Interior',
      author: 'Tehkné Solutions',
      transmission: 'manual-local-file'
    },
    source: {
      fingerprint: input.source.fingerprint as string,
      collectionLabel: input.source.collectionLabel as string,
      itemCount: input.source.itemCount as number,
      status: input.source.status as 'active' | 'archived'
    },
    gesture: {
      id: catalogGesture.id,
      label: catalogGesture.label,
      statement: catalogGesture.statement
    },
    expectation: {
      replyRequired: false,
      deliveryTracked: false,
      recipientStored: false
    },
    notices: [...input.notices as string[]]
  };

  const warnings: string[] = [];
  if (sanitized.source.itemCount === 0) warnings.push('O retorno referencia uma coleção vazia e permanece válido.');
  if (sanitized.source.status === 'archived') warnings.push('O retorno referencia uma coleção que estava arquivada no momento da resposta.');
  warnings.push('A leitura não confirma entrega e não reabre a origem.');

  return { ok: true, package: sanitized, warnings };
}

export function completeContinuousReturnReview(
  response: ContinuousResponseExport,
  consent: ContinuousReturnConsent
): ContinuousReturnCompletionResult {
  const errors: string[] = [];
  if (!response.source.fingerprint.trim()) errors.push('A impressão da origem é obrigatória.');
  if (!hasExplicitContinuousReturnConsent(consent)) errors.push('As três confirmações explícitas são obrigatórias.');
  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    conclusion: {
      recordCreated: false,
      sourceReopened: false,
      replyRequired: false,
      reminderCreated: false
    }
  };
}
