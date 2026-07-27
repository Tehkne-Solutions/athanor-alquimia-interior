import {
  attachContinuousConsistency,
  verifyContinuousConsistency
} from './continuousConsistency';
import {
  fingerprintContinuousSharePackage,
  parseContinuousCollectionShare,
  type ContinuousReceiveResult
} from './continuousReceive';

export function parseContinuousCollectionShareWithConsistency(input: unknown): ContinuousReceiveResult {
  const verification = verifyContinuousConsistency(input);
  if (verification.status === 'invalid' || verification.status === 'unsupported') {
    return { ok: false, errors: [`Selo de consistência recusado: ${verification.message}`] };
  }

  const parsed = parseContinuousCollectionShare(input);
  if (!parsed.ok) return parsed;

  const sanitized = attachContinuousConsistency(parsed.package);
  const warnings = [...parsed.warnings];
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
