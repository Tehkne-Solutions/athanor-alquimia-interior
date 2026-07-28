import { continuousReceivedCatalogVersionPolicy } from '../content/continuousReceivedCatalogVersion';
import type { ContinuousReceivedRegistry } from './continuousReceive';
import type { ContinuousCollectionShareExport } from './continuousShare';
import { parseContinuousSemanticVersion } from './continuousVersion';

export interface ContinuousReceivedCatalogVersionSuccess {
  ok: true;
  checkedRecords: number;
  message: string;
}

export interface ContinuousReceivedCatalogVersionFailure {
  ok: false;
  errors: string[];
}

export type ContinuousReceivedCatalogVersionResult =
  | ContinuousReceivedCatalogVersionSuccess
  | ContinuousReceivedCatalogVersionFailure;

function push(errors: string[], message: string): void {
  if (errors.length < continuousReceivedCatalogVersionPolicy.maxReportedIssues) errors.push(message);
}

export function validateContinuousReceivedCatalogVersion(
  registry: ContinuousReceivedRegistry
): ContinuousReceivedCatalogVersionResult {
  const errors: string[] = [];

  if (registry.id !== continuousReceivedCatalogVersionPolicy.expectedRegistryId) {
    push(errors, `$.id: identidade da biblioteca incompatível; esperado ${continuousReceivedCatalogVersionPolicy.expectedRegistryId}.`);
  }

  const registryVersion = parseContinuousSemanticVersion(registry.catalogVersion);
  if (!registryVersion) {
    push(errors, '$.catalogVersion: a versão da biblioteca precisa usar SemVer estrito X.Y.Z.');
  } else if (registryVersion.normalized !== continuousReceivedCatalogVersionPolicy.currentCatalogVersion) {
    push(errors, `$.catalogVersion: a biblioteca declara ${registryVersion.normalized}, mas esta versão do Athanor reconhece ${continuousReceivedCatalogVersionPolicy.currentCatalogVersion}.`);
  }

  registry.records.forEach((record, index) => {
    const packageVersion = parseContinuousSemanticVersion(record.package.catalogVersion);
    if (!packageVersion) {
      push(errors, `$.records[${index}].package.catalogVersion: versão do pacote não usa SemVer estrito.`);
      return;
    }
    if (registryVersion && packageVersion.normalized !== registryVersion.normalized) {
      push(errors, `$.records[${index}].package.catalogVersion: ${packageVersion.normalized} não corresponde à versão ${registryVersion.normalized} da biblioteca.`);
    }
  });

  return errors.length > 0
    ? { ok: false, errors }
    : {
      ok: true,
      checkedRecords: registry.records.length,
      message: 'A biblioteca usa a identidade oficial e todos os pacotes pertencem ao mesmo catálogo atual.'
    };
}

export function validateContinuousIncomingReceivedCatalogVersion(
  registry: ContinuousReceivedRegistry,
  packageValue: ContinuousCollectionShareExport
): ContinuousReceivedCatalogVersionResult {
  const registryResult = validateContinuousReceivedCatalogVersion(registry);
  if (!registryResult.ok) return registryResult;

  const packageVersion = parseContinuousSemanticVersion(packageValue.catalogVersion);
  if (!packageVersion) {
    return { ok: false, errors: ['$.package.catalogVersion: a versão recebida precisa usar SemVer estrito X.Y.Z.'] };
  }
  if (packageVersion.normalized !== registry.catalogVersion) {
    return {
      ok: false,
      errors: [`$.package.catalogVersion: ${packageVersion.normalized} não corresponde à versão ${registry.catalogVersion} da biblioteca.`]
    };
  }

  return {
    ok: true,
    checkedRecords: registry.records.length,
    message: 'O pacote recebido pertence ao mesmo catálogo atual da biblioteca.'
  };
}
