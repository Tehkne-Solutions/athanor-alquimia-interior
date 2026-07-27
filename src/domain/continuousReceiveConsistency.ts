import { continuousShareCatalog } from '../content/continuousShare';
import { continuousVersionCatalog } from '../content/continuousVersion';
import {
  attachContinuousConsistency,
  verifyContinuousConsistency
} from './continuousConsistency';
import { validateContinuousShareExactRelation } from './continuousExactRelation';
import { validateContinuousShareExactTime } from './continuousExactTime';
import { validateContinuousExactText } from './continuousExactText';
import { validateContinuousInertJson } from './continuousInertJson';
import {
  fingerprintContinuousSharePackage,
  parseContinuousCollectionShare,
  type ContinuousReceiveResult
} from './continuousReceive';
import { inspectContinuousResourceBudget } from './continuousResource';
import { validateContinuousShareStrictContract } from './continuousStrictContract';
import { validateContinuousTextVisibility } from './continuousTextVisibility';
import {
  assessContinuousCatalogVersion,
  readContinuousCatalogVersion
} from './continuousVersion';

export function parseContinuousCollectionShareWithConsistency(input: unknown): ContinuousReceiveResult {
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
    currentVersion: continuousVersionCatalog.shareCurrentVersion,
    supportedLegacyVersions: continuousVersionCatalog.shareSupportedLegacyVersions,
    label: 'Pacote de partilha'
  });
  if (!compatibility.ok) {
    return { ok: false, errors: [`Versão recusada: ${compatibility.message}`] };
  }

  const strictContract = validateContinuousShareStrictContract(input);
  if (!strictContract.ok) {
    return { ok: false, errors: strictContract.errors.map((error) => `Contrato recusado: ${error}`) };
  }

  const exactText = validateContinuousExactText(input, 'Pacote de partilha');
  if (!exactText.ok) {
    return { ok: false, errors: exactText.errors.map((error) => `Margem textual recusada: ${error}`) };
  }

  const exactTime = validateContinuousShareExactTime(input);
  if (!exactTime.ok) {
    return { ok: false, errors: exactTime.errors.map((error) => `Tempo recusado: ${error}`) };
  }

  const exactRelation = validateContinuousShareExactRelation(input);
  if (!exactRelation.ok) {
    return { ok: false, errors: exactRelation.errors.map((error) => `Relação recusada: ${error}`) };
  }

  const parsed = parseContinuousCollectionShare(input);
  if (!parsed.ok) return parsed;

  const sanitized = attachContinuousConsistency({
    ...parsed.package,
    catalogVersion: continuousShareCatalog.version
  });
  const warnings = [
    ...parsed.warnings,
    inert.message,
    resource.message,
    visibleText.message,
    compatibility.message,
    strictContract.message,
    exactText.message,
    exactTime.message,
    exactRelation.message
  ];
  if (compatibility.status === 'supported-legacy') {
    warnings.push('A cópia sanitizada usa a versão atual, sem alterar ou sobrescrever o arquivo recebido.');
  }
  if (verification.status === 'missing') {
    warnings.push('Arquivo legado sem selo: aceito por compatibilidade e selado novamente na cópia local.');
  } else {
    warnings.push('Selo local válido: o conteúdo não mudou desde sua geração, sem autenticar identidade ou autoria.');
  }

  return {
    ok: true,
    package: sanitized,
    fingerprint: fingerprintContinuousSharePackage(sanitized),
    warnings
  };
}
