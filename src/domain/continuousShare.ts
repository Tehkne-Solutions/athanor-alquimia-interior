import type { ContinuousCollection, ContinuousCollectionItemReference } from './continuousCollection';
import type { ContinuousMapItemKind, ContinuousMapStatus } from './continuousMap';
import type { NewWorkStartPoint } from './continuousJourney';
import {
  attachContinuousConsistency,
  type ContinuousConsistencySeal
} from './continuousConsistency';

export interface ContinuousShareConsent {
  collection: boolean;
  preview: boolean;
  localFile: boolean;
  recipient: boolean;
  noPersonalNotes: boolean;
}

export interface ContinuousShareOptions {
  includeDates: boolean;
}

export interface ContinuousShareItem {
  position: number;
  kind: ContinuousMapItemKind;
  startPoint: NewWorkStartPoint;
  themeId?: string;
  noTheme: boolean;
  variantId: string;
  packageId?: string;
  packageLabel?: string;
  status: ContinuousMapStatus;
  depth?: number;
  endedEarly: boolean;
  passageSummary: {
    completed: number;
    passed: number;
    pending: number;
  };
  occurredAt?: string;
  completedAt?: string;
}

export interface ContinuousSharePreview {
  collection: {
    templateId: string;
    label: string;
    status: 'active' | 'archived';
    itemCount: number;
  };
  options: ContinuousShareOptions;
  items: ContinuousShareItem[];
  notices: string[];
}

export interface ContinuousCollectionShareExport extends ContinuousSharePreview {
  schema: 'athanor-continuous-collection-share-v1';
  policy: 'explicit-consent-minimized-local-export-v1';
  catalogVersion: string;
  generatedAt: string;
  provenance: {
    product: 'Athanor — Alquimia Interior';
    author: 'Tehkné Solutions';
    transmission: 'manual-local-file';
  };
  consistency?: ContinuousConsistencySeal;
}

export interface ContinuousShareSuccess {
  ok: true;
  export: ContinuousCollectionShareExport;
}

export interface ContinuousShareFailure {
  ok: false;
  errors: string[];
}

export type ContinuousShareResult = ContinuousShareSuccess | ContinuousShareFailure;

export const emptyContinuousShareConsent = (): ContinuousShareConsent => ({
  collection: false,
  preview: false,
  localFile: false,
  recipient: false,
  noPersonalNotes: false
});

export function hasExplicitContinuousShareConsent(consent: ContinuousShareConsent): boolean {
  return consent.collection
    && consent.preview
    && consent.localFile
    && consent.recipient
    && consent.noPersonalNotes;
}

function minimizeReference(
  reference: ContinuousCollectionItemReference,
  position: number,
  options: ContinuousShareOptions
): ContinuousShareItem {
  const item = reference.item;
  return {
    position,
    kind: item.kind,
    startPoint: item.startPoint,
    themeId: item.themeId,
    noTheme: item.noTheme,
    variantId: item.variantId,
    packageId: item.packageId,
    packageLabel: item.packageLabel,
    status: item.status,
    depth: item.depth,
    endedEarly: item.endedEarly,
    passageSummary: { ...item.passageSummary },
    occurredAt: options.includeDates ? item.occurredAt : undefined,
    completedAt: options.includeDates ? item.completedAt : undefined
  };
}

export function buildContinuousSharePreview(
  collection: ContinuousCollection,
  options: ContinuousShareOptions
): ContinuousSharePreview {
  const notices = [
    'A ordem é preservada somente como organização manual, sem prioridade implícita.',
    'O pacote não contém IDs internos de jornadas, Rastros, ciclos ou coleções.',
    'O arquivo final recebe um selo local de consistência que não autentica identidade ou autoria.'
  ];
  if (!options.includeDates) notices.push('Datas foram omitidas.');
  if (collection.items.length === 0) notices.push('Esta coleção está vazia e continua válida para exportação.');
  if (collection.items.some((reference) => !reference.item.linked)) {
    notices.push('Registros não vinculados permanecem descritivos e não são interpretados.');
  }

  return {
    collection: {
      templateId: collection.templateId,
      label: collection.label,
      status: collection.status,
      itemCount: collection.items.length
    },
    options: { ...options },
    items: collection.items.map((reference, index) => minimizeReference(reference, index + 1, options)),
    notices
  };
}

export function createContinuousCollectionShareExport(
  collection: ContinuousCollection,
  consent: ContinuousShareConsent,
  options: ContinuousShareOptions,
  catalogVersion: string,
  generatedAt: string
): ContinuousShareResult {
  const errors: string[] = [];
  if (!collection.label.trim()) errors.push('A coleção selecionada não possui rótulo válido.');
  if (!hasExplicitContinuousShareConsent(consent)) errors.push('Todas as confirmações explícitas são obrigatórias.');
  if (!catalogVersion.trim()) errors.push('A versão do catálogo de partilha é obrigatória.');
  if (!generatedAt.trim()) errors.push('A data local de geração é obrigatória.');
  if (errors.length > 0) return { ok: false, errors };

  const payload: ContinuousCollectionShareExport = {
    schema: 'athanor-continuous-collection-share-v1',
    policy: 'explicit-consent-minimized-local-export-v1',
    catalogVersion,
    generatedAt,
    provenance: {
      product: 'Athanor — Alquimia Interior',
      author: 'Tehkné Solutions',
      transmission: 'manual-local-file'
    },
    ...buildContinuousSharePreview(collection, options)
  };

  return {
    ok: true,
    export: attachContinuousConsistency(payload)
  };
}
