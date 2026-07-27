import { attachContinuousConsistency, verifyContinuousConsistency } from './continuousConsistency';
import {
  parseContinuousResponseReturn,
  type ContinuousReturnResult
} from './continuousReturn';

export function parseContinuousResponseReturnWithConsistency(input: unknown): ContinuousReturnResult {
  const verification = verifyContinuousConsistency(input);
  if (verification.status === 'invalid' || verification.status === 'unsupported') {
    return { ok: false, errors: [`Selo de consistência recusado: ${verification.message}`] };
  }

  const parsed = parseContinuousResponseReturn(input);
  if (!parsed.ok) return parsed;

  const warnings = [...parsed.warnings];
  if (verification.status === 'missing') {
    warnings.push('Arquivo legado sem selo: aceito por compatibilidade somente nesta prévia transitória.');
  } else {
    warnings.push('Selo local válido: o conteúdo não mudou desde sua geração, sem autenticar identidade ou autoria.');
  }

  return {
    ok: true,
    package: attachContinuousConsistency(parsed.package),
    warnings
  };
}
