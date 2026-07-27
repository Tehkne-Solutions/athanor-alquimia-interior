import { continuousResponseCatalog } from '../content/continuousResponse';
import { continuousVersionCatalog } from '../content/continuousVersion';
import { attachContinuousConsistency, verifyContinuousConsistency } from './continuousConsistency';
import { validateContinuousExactText } from './continuousExactText';
import { validateContinuousInertJson } from './continuousInertJson';
import { inspectContinuousResourceBudget } from './continuousResource';
import {
  parseContinuousResponseReturn,
  type ContinuousReturnResult
} from './continuousReturn';
import { validateContinuousResponseStrictContract } from './continuousStrictContract';
import { validateContinuousTextVisibility } from './continuousTextVisibility';
import {
  assessContinuousCatalogVersion,
  readContinuousCatalogVersion
} from './continuousVersion';

export function parseContinuousResponseReturnWithConsistency(input: unknown): ContinuousReturnResult {
  const inert = validateContinuousInertJson(input);
  if (!inert.ok) {
    return { ok: false, errors: inert.errors.map((error) => `Forma JSON recusada: ${error}`) };
  }

  const resource = inspectContinuousResourceBudget(input);
  if (!resource.ok) {
    return { ok: false, errors: resource.errors.map((error) => `Limite local recusado: ${error}`) };
  }

  const visibleText = validateContinuousTextVisibility(input);
  if (!visibleText.ok) {
    return { ok: false, errors: visibleText.errors.map((error) => `Texto recusado: ${error}`) };
  }

  const verification = verifyContinuousConsistency(input);
  if (verification.status === 'invalid' || verification.status === 'unsupported') {
    return { ok: false, errors: [`Selo de consistência recusado: ${verification.message}`] };
  }

  const compatibility = assessContinuousCatalogVersion(readContinuousCatalogVersion(input), {
    currentVersion: continuousVersionCatalog.responseCurrentVersion,
    supportedLegacyVersions: continuousVersionCatalog.responseSupportedLegacyVersions,
    label: 'Pacote de resposta'
  });
  if (!compatibility.ok) {
    return { ok: false, errors: [`Versão recusada: ${compatibility.message}`] };
  }

  const strictContract = validateContinuousResponseStrictContract(input);
  if (!strictContract.ok) {
    return { ok: false, errors: strictContract.errors.map((error) => `Contrato recusado: ${error}`) };
  }

  const exactText = validateContinuousExactText(input, 'Pacote de resposta');
  if (!exactText.ok) {
    return { ok: false, errors: exactText.errors.map((error) => `Margem textual recusada: ${error}`) };
  }

  const parsed = parseContinuousResponseReturn(input);
  if (!parsed.ok) return parsed;

  const warnings = [
    ...parsed.warnings,
    inert.message,
    resource.message,
    visibleText.message,
    compatibility.message,
    strictContract.message,
    exactText.message
  ];
  if (compatibility.status === 'supported-legacy') {
    warnings.push('A prévia sanitizada usa a versão atual, sem alterar ou sobrescrever o arquivo recebido.');
  }
  if (verification.status === 'missing') {
    warnings.push('Arquivo legado sem selo: aceito por compatibilidade somente nesta prévia transitória.');
  } else {
    warnings.push('Selo local válido: o conteúdo não mudou desde sua geração, sem autenticar identidade ou autoria.');
  }

  return {
    ok: true,
    package: attachContinuousConsistency({
      ...parsed.package,
      catalogVersion: continuousResponseCatalog.version
    }),
    warnings
  };
}
