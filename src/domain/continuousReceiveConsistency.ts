import { continuousShareCatalog } from '../content/continuousShare';
import { continuousVersionCatalog } from '../content/continuousVersion';
import {
  attachContinuousConsistency,
  verifyContinuousConsistency
} from './continuousConsistency';
import {
  fingerprintContinuousSharePackage,
  parseContinuousCollectionShare,
  type ContinuousReceiveResult
} from './continuousReceive';
import {
  assessContinuousCatalogVersion,
  readContinuousCatalogVersion
} from './continuousVersion';

export function parseContinuousCollectionShareWithConsistency(input: unknown): ContinuousReceiveResult {
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

  const parsed = parseContinuousCollectionShare(input);
  if (!parsed.ok) return parsed;

  const sanitized = attachContinuousConsistency({
    ...parsed.package,
    catalogVersion: continuousShareCatalog.version
  });
  const warnings = [...parsed.warnings, compatibility.message];
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
