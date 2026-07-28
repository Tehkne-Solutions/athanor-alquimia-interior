import { continuousCatalogReferenceCatalog } from '../content/continuousCatalogReference';
import { continuousCollectionTemplates } from '../content/continuousCollection';
import { continuousResponseGestures } from '../content/continuousResponse';
import { continuousThemes } from '../content/continuousTheme';
import { continuousThemeCyclePackages } from '../content/continuousThemeCycle';
import { continuousTrailVariants } from '../content/continuousTrail';
import type { NewWorkStartPoint } from './continuousJourney';

export interface ContinuousCatalogReferenceSuccess {
  ok: true;
  checkedReferences: number;
  message: string;
}

export interface ContinuousCatalogReferenceFailure {
  ok: false;
  errors: string[];
  truncated: boolean;
}

export type ContinuousCatalogReferenceResult = ContinuousCatalogReferenceSuccess | ContinuousCatalogReferenceFailure;

const knownStartPoints: NewWorkStartPoint[] = ['word', 'water', 'fire', 'earth', 'spirit', 'rest'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readStartPoint(value: unknown): NewWorkStartPoint | undefined {
  if (typeof value !== 'string') return undefined;
  return knownStartPoints.includes(value as NewWorkStartPoint) ? value as NewWorkStartPoint : undefined;
}

function report(errors: string[], message: string): void {
  if (errors.length < continuousCatalogReferenceCatalog.maxReportedIssues) errors.push(message);
}

function finish(errors: string[], checkedReferences: number): ContinuousCatalogReferenceResult {
  if (errors.length > 0) {
    return {
      ok: false,
      errors,
      truncated: errors.length >= continuousCatalogReferenceCatalog.maxReportedIssues
    };
  }
  return {
    ok: true,
    checkedReferences,
    message: `${checkedReferences} referências reconhecidas permanecem ligadas aos catálogos locais compatíveis.`
  };
}

export function validateContinuousShareCatalogReferences(input: unknown): ContinuousCatalogReferenceResult {
  if (!isRecord(input)) {
    return { ok: true, checkedReferences: 0, message: 'Referências serão avaliadas depois que o pacote for reconhecido.' };
  }

  const errors: string[] = [];
  let checkedReferences = 0;
  const collection = isRecord(input.collection) ? input.collection : undefined;
  if (typeof collection?.templateId === 'string') {
    checkedReferences += 1;
    if (!continuousCollectionTemplates.some((template) => template.id === collection.templateId)) {
      report(errors, '$.collection.templateId: modelo não existe no catálogo local atual.');
    }
  }

  if (!Array.isArray(input.items)) return finish(errors, checkedReferences);

  input.items.forEach((candidate, index) => {
    if (!isRecord(candidate)) return;
    const path = `$.items[${index}]`;
    const startPoint = readStartPoint(candidate.startPoint);
    const kind = typeof candidate.kind === 'string' ? candidate.kind : undefined;
    const themeId = typeof candidate.themeId === 'string' ? candidate.themeId : undefined;
    const noTheme = candidate.noTheme === true;

    let knownTheme = false;
    if (themeId !== undefined) {
      checkedReferences += 1;
      const theme = continuousThemes.find((entry) => entry.id === themeId);
      if (!theme) {
        report(errors, `${path}.themeId: tema informado não existe no catálogo local atual.`);
      } else {
        knownTheme = true;
        if (startPoint !== undefined && !theme.startPoints.includes(startPoint)) {
          report(errors, `${path}.themeId: tema não aceita o elemento declarado.`);
        }
      }
    }

    if (typeof candidate.variantId === 'string') {
      checkedReferences += 1;
      const variant = continuousTrailVariants.find((entry) => entry.id === candidate.variantId);
      if (!variant) {
        report(errors, `${path}.variantId: variante não existe no catálogo local atual.`);
      } else if (startPoint !== undefined && variant.startPoint !== startPoint) {
        report(errors, `${path}.variantId: variante pertence a outro elemento.`);
      }
    }

    if (kind === 'theme-cycle' && typeof candidate.packageId === 'string') {
      checkedReferences += 1;
      const cyclePackage = continuousThemeCyclePackages.find((entry) => entry.id === candidate.packageId);
      if (!cyclePackage) {
        report(errors, `${path}.packageId: pacote não existe no catálogo local atual.`);
      } else {
        if (typeof candidate.packageLabel === 'string' && candidate.packageLabel !== cyclePackage.label) {
          report(errors, `${path}.packageLabel: rótulo não corresponde ao pacote catalogado.`);
        }
        if (startPoint !== undefined && !cyclePackage.startPoints.includes(startPoint)) {
          report(errors, `${path}.packageId: pacote não aceita o elemento declarado.`);
        }
        const expectedTheme = noTheme || themeId === undefined ? 'no-theme' : themeId;
        if ((themeId === undefined || knownTheme) && cyclePackage.themeId !== expectedTheme) {
          report(errors, `${path}.packageId: pacote não corresponde ao tema ou à ausência de tema declarada.`);
        }
      }
    }
  });

  return finish(errors, checkedReferences);
}

export function validateContinuousResponseCatalogReferences(input: unknown): ContinuousCatalogReferenceResult {
  if (!isRecord(input)) {
    return { ok: true, checkedReferences: 0, message: 'Referências serão avaliadas depois que o pacote for reconhecido.' };
  }
  const errors: string[] = [];
  let checkedReferences = 0;
  const gesture = isRecord(input.gesture) ? input.gesture : undefined;
  if (typeof gesture?.id === 'string') {
    checkedReferences += 1;
    const curated = continuousResponseGestures.find((entry) => entry.id === gesture.id);
    if (!curated || !curated.createsFile) {
      report(errors, '$.gesture.id: gesto não existe entre as respostas exportáveis do catálogo atual.');
    } else {
      if (typeof gesture.label === 'string' && gesture.label !== curated.label) {
        report(errors, '$.gesture.label: rótulo não corresponde ao gesto catalogado.');
      }
      if (typeof gesture.statement === 'string' && gesture.statement !== curated.statement) {
        report(errors, '$.gesture.statement: declaração não corresponde ao gesto catalogado.');
      }
    }
  }
  return finish(errors, checkedReferences);
}
