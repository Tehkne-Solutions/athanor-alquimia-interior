import { describe, expect, it } from 'vitest';
import {
  assessContinuousCatalogVersion,
  compareContinuousSemanticVersions,
  parseContinuousSemanticVersion,
  readContinuousCatalogVersion
} from './continuousVersion';

const policy = {
  currentVersion: '1.2.3',
  supportedLegacyVersions: ['1.1.0'],
  label: 'Pacote de teste'
} as const;

describe('versionamento explícito do ciclo compartilhado', () => {
  it('aceita SemVer estrito', () => {
    expect(parseContinuousSemanticVersion('0.0.0')).toEqual({ major: 0, minor: 0, patch: 0, normalized: '0.0.0' });
    expect(parseContinuousSemanticVersion('12.34.56')?.normalized).toBe('12.34.56');
  });

  it('recusa versões incompletas, prefixadas ou com zeros à esquerda', () => {
    expect(parseContinuousSemanticVersion('1.0')).toBeUndefined();
    expect(parseContinuousSemanticVersion('v1.0.0')).toBeUndefined();
    expect(parseContinuousSemanticVersion('01.0.0')).toBeUndefined();
    expect(parseContinuousSemanticVersion('1.0.0-beta')).toBeUndefined();
  });

  it('recusa números fora do intervalo seguro', () => {
    expect(parseContinuousSemanticVersion('9007199254740992.0.0')).toBeUndefined();
  });

  it('compara major, minor e patch', () => {
    const v100 = parseContinuousSemanticVersion('1.0.0')!;
    const v101 = parseContinuousSemanticVersion('1.0.1')!;
    const v110 = parseContinuousSemanticVersion('1.1.0')!;
    const v200 = parseContinuousSemanticVersion('2.0.0')!;
    expect(compareContinuousSemanticVersions(v100, v101)).toBe(-1);
    expect(compareContinuousSemanticVersions(v110, v101)).toBe(1);
    expect(compareContinuousSemanticVersions(v200, v200)).toBe(0);
  });

  it('aceita somente a versão atual por coincidência exata', () => {
    const result = assessContinuousCatalogVersion('1.2.3', policy);
    expect(result.ok).toBe(true);
    expect(result.status).toBe('current');
  });

  it('aceita legado somente quando listado explicitamente', () => {
    const result = assessContinuousCatalogVersion('1.1.0', policy);
    expect(result.ok).toBe(true);
    expect(result.status).toBe('supported-legacy');
    expect(result.message).toMatch(/regra explícita/i);
  });

  it('recusa versão futura sem downgrade', () => {
    const result = assessContinuousCatalogVersion('1.2.4', policy);
    expect(result.ok).toBe(false);
    expect(result.status).toBe('future');
    expect(result.message).toMatch(/não executa downgrade/i);
  });

  it('recusa versão antiga desconhecida sem migração silenciosa', () => {
    const result = assessContinuousCatalogVersion('1.0.0', policy);
    expect(result.ok).toBe(false);
    expect(result.status).toBe('unsupported-older');
    expect(result.message).toMatch(/não existe migração explícita/i);
  });

  it('recusa versão malformada', () => {
    const result = assessContinuousCatalogVersion('latest', policy);
    expect(result.ok).toBe(false);
    expect(result.status).toBe('malformed');
  });

  it('recusa matriz interna com versão inválida', () => {
    const result = assessContinuousCatalogVersion('1.0.0', {
      currentVersion: 'current',
      supportedLegacyVersions: [],
      label: 'Pacote'
    });
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/matriz interna/i);
  });

  it('lê catalogVersion somente de objetos', () => {
    expect(readContinuousCatalogVersion({ catalogVersion: '1.0.0' })).toBe('1.0.0');
    expect(readContinuousCatalogVersion('1.0.0')).toBeUndefined();
    expect(readContinuousCatalogVersion(null)).toBeUndefined();
  });
});
