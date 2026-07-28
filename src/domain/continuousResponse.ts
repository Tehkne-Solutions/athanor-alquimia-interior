import type { ContinuousReceivedCollection } from './continuousReceive';
import type { ContinuousResponseGesture } from '../content/continuousResponse';
import { validateContinuousResponseCanonicalNotices } from './continuousCanonicalNotice';
import { validateContinuousResponseCatalogReferences } from './continuousCatalogReference';
import {
  attachContinuousConsistency,
  type ContinuousConsistencySeal
} from './continuousConsistency';
import { validateContinuousResponseExactRelation } from './continuousExactRelation';
import { validateContinuousResponseExactTime } from './continuousExactTime';
import { validateContinuousExactText } from './continuousExactText';
import { validateContinuousResponseFieldCompatibility } from './continuousFieldCompatibility';
import { validateContinuousResponseFingerprint } from './continuousFingerprintEquivalence';
import { validateContinuousInertJson } from './continuousInertJson';
import { inspectContinuousResourceBudget } from './continuousResource';
import { validateContinuousTextVisibility } from './continuousTextVisibility';

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
  consistency?: ContinuousConsistencySeal;
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
    'Nenhuma resposta adicional é necessária.',
    'O arquivo final recebe um selo local de consistência que não autentica identidade ou autoria.',
    'O arquivo final precisa permanecer dentro do orçamento local de tamanho e complexidade.',
    'O arquivo final contém somente JSON inerte, sem comportamento oculto.',
    'Textos e nomes de campos permanecem Unicode NFC e sem controles invisíveis, sem reescrita automática.',
    'Nenhuma margem textual externa é removida durante a geração ou a leitura.',
    'O instante de geração usa UTC canônico com milissegundos e nunca é convertido silenciosamente.',
    'A resposta não acrescenta relações temporais além do instante de geração canônico.',
    'O pacote de resposta atual não possui discriminantes opcionais adicionais a reconciliar.',
    'O gesto, o rótulo e a declaração precisam corresponder exatamente ao catálogo local exportável.'
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
  if (record.fingerprint.length === 0) errors.push('A impressão da cópia recebida é obrigatória.');
  if (record.package.collection.label.length === 0) errors.push('O rótulo da coleção recebida é obrigatório.');
  if (!gesture.createsFile) errors.push('O silêncio preservado não gera arquivo de resposta.');
  if (!hasExplicitContinuousResponseConsent(consent)) errors.push('As quatro confirmações explícitas são obrigatórias.');
  if (catalogVersion.length === 0) errors.push('A versão do catálogo de resposta é obrigatória.');
  if (generatedAt.length === 0) errors.push('A data local de geração é obrigatória.');
  if (errors.length > 0) return { ok: false, errors };

  const payload: ContinuousResponseExport = {
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
  };

  const inert = validateContinuousInertJson(payload);
  if (!inert.ok) {
    return { ok: false, errors: inert.errors.map((error) => `Não foi possível gerar JSON inerte: ${error}`) };
  }

  const resource = inspectContinuousResourceBudget(payload);
  if (!resource.ok) {
    return { ok: false, errors: resource.errors.map((error) => `Não foi possível gerar o arquivo: ${error}`) };
  }

  const visibleText = validateContinuousTextVisibility(payload);
  if (!visibleText.ok) {
    return { ok: false, errors: visibleText.errors.map((error) => `Não foi possível gerar texto visível: ${error}`) };
  }

  const exactText = validateContinuousExactText(payload, 'Resposta gerada');
  if (!exactText.ok) {
    return { ok: false, errors: exactText.errors.map((error) => `Não foi possível preservar a margem textual: ${error}`) };
  }

  const exactTime = validateContinuousResponseExactTime(payload);
  if (!exactTime.ok) {
    return { ok: false, errors: exactTime.errors.map((error) => `Não foi possível preservar o instante temporal: ${error}`) };
  }

  const exactRelation = validateContinuousResponseExactRelation(payload);
  if (!exactRelation.ok) {
    return { ok: false, errors: exactRelation.errors.map((error) => `Não foi possível preservar a relação interna: ${error}`) };
  }

  const fieldCompatibility = validateContinuousResponseFieldCompatibility(payload);
  if (!fieldCompatibility.ok) {
    return { ok: false, errors: fieldCompatibility.errors.map((error) => `Não foi possível preservar a natureza dos campos: ${error}`) };
  }

  const catalogReferences = validateContinuousResponseCatalogReferences(payload);
  if (!catalogReferences.ok) {
    return { ok: false, errors: catalogReferences.errors.map((error) => `Não foi possível preservar a referência catalogada: ${error}`) };
  }

  const fingerprint = validateContinuousResponseFingerprint(payload);
  if (!fingerprint.ok) {
    return { ok: false, errors: fingerprint.errors.map((error) => `Não foi possível preservar a impressão descritiva: ${error}`) };
  }

  const canonicalNotices = validateContinuousResponseCanonicalNotices(payload);
  if (!canonicalNotices.ok) {
    return { ok: false, errors: canonicalNotices.errors.map((error) => `Não foi possível preservar os avisos canônicos: ${error}`) };
  }

  return {
    ok: true,
    export: attachContinuousConsistency(payload)
  };
}
