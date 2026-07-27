import { continuousResponseCatalog } from '../content/continuousResponse';
import { continuousVersionCatalog } from '../content/continuousVersion';
import { attachContinuousConsistency, verifyContinuousConsistency } from './continuousConsistency';
import {
  parseContinuousResponseReturn,
  type ContinuousReturnResult
} from './continuousReturn';
import {
  assessContinuousCatalogVersion,
  readContinuousCatalogVersion
} from './continuousVersion';

export function parseContinuousResponseReturnWithConsistency(input: unknown): ContinuousReturnResult {
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

  const parsed = parseContinuousResponseReturn(input);
  if (!parsed.ok) return parsed;

  const warnings = [...parsed.warnings, compatibility.message];
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
