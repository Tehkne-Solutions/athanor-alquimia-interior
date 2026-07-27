import type { ContinuousReceivedCollection } from './continuousReceive';
import type { ContinuousResponseGesture } from '../content/continuousResponse';

export interface ContinuousResponseConsent {
  source: boolean;
  preview: boolean;
  localFile: boolean;
  noReply: boolean;
}

export interface ContinuousResponsePreview {
  source: {
    fingerprint: string;
    collectionLabel: string;
    itemCount: number;
    status: 'active' | 'archived';
  };
  gesture: {
    id: ContinuousResponseGesture['id'];
    label: string;
    statement: string;
  };
  expectation: {
    replyRequired: false;
    deliveryTracked: false;
    recipientStored: false;
  };
  notices: string[];
}

export interface ContinuousResponseExport extends ContinuousResponsePreview {
  schema: 'athanor-continuous-response-v1';
  policy: 'optional-curated-no-tracking-v1';
  catalogVersion: string;
  generatedAt: string;
  provenance: {
    product: 'Athanor — Alquimia Interior';
    author: 'Tehkné Solutions';
    transmission: 'manual-local-file';
  };
}

export interface ContinuousResponseSuccess {
  ok: true;
  export: ContinuousResponseExport;
}

export interface ContinuousResponseFailure {
  ok: false;
  errors: string[];
}

export type ContinuousResponseResult = ContinuousResponseSuccess | ContinuousResponseFailure;

export const emptyContinuousResponseConsent = (): ContinuousResponseConsent => ({
  source: false,
  preview: false,
  localFile: false,
  noReply: false
});

export function hasExplicitContinuousResponseConsent(consent: ContinuousResponseConsent): boolean {
  return consent.source && consent.preview && consent.localFile && consent.noReply;
}

export function buildContinuousResponsePreview(
  record: ContinuousReceivedCollection,
  gesture: ContinuousResponseGesture
): ContinuousResponsePreview {
  const notices = [
    'A resposta não inclui os itens nem as datas da coleção recebida.',
    'A impressão descritiva permite reconhecer manualmente o pacote sem identificar pessoas.',
    'Nenhuma resposta adicional é necessária.'
  ];
  if (record.package.collection.itemCount === 0) {
    notices.push('A origem é uma coleção vazia e permanece válida.');
  }
  if (!gesture.createsFile) {
    notices.push('Silêncio preservado: nenhum arquivo ou histórico será criado.');
  }

  return {
    source: {
      fingerprint: record.fingerprint,
      collectionLabel: record.package.collection.label,
      itemCount: record.package.collection.itemCount,
      status: record.status
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
    notices
  };
}

export function createContinuousResponseExport(
  record: ContinuousReceivedCollection,
  gesture: ContinuousResponseGesture,
  consent: ContinuousResponseConsent,
  catalogVersion: string,
  generatedAt: string
): ContinuousResponseResult {
  const errors: string[] = [];
  if (!record.fingerprint.trim()) errors.push('A impressão da cópia recebida é obrigatória.');
  if (!record.package.collection.label.trim()) errors.push('O rótulo da coleção recebida é obrigatório.');
  if (!gesture.createsFile) errors.push('O silêncio preservado não gera arquivo de resposta.');
  if (!hasExplicitContinuousResponseConsent(consent)) errors.push('As quatro confirmações explícitas são obrigatórias.');
  if (!catalogVersion.trim()) errors.push('A versão do catálogo de resposta é obrigatória.');
  if (!generatedAt.trim()) errors.push('A data local de geração é obrigatória.');
  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    export: {
      schema: 'athanor-continuous-response-v1',
      policy: 'optional-curated-no-tracking-v1',
      catalogVersion,
      generatedAt,
      provenance: {
        product: 'Athanor — Alquimia Interior',
        author: 'Tehkné Solutions',
        transmission: 'manual-local-file'
      },
      ...buildContinuousResponsePreview(record, gesture)
    }
  };
}
