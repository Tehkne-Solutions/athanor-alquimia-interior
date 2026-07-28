import {
  archiveReceivedCollectionWithIdentity,
  keepReceivedCollectionWithIdentity,
  reactivateReceivedCollectionWithIdentity,
  removeReceivedCollectionWithIdentity,
  type ContinuousReceivedKeepStatus,
  type ContinuousReceivedMutationStatus,
  type ContinuousReceivedRegistry
} from '../domain/continuousReceive';
import type { ContinuousCollectionShareExport } from '../domain/continuousShare';

export interface ContinuousReceivedStoreKeepResult {
  registry: ContinuousReceivedRegistry;
  status: ContinuousReceivedKeepStatus;
  id?: string;
  duplicate: boolean;
  changed: boolean;
  message: string;
}

export interface ContinuousReceivedStoreMutationResult {
  registry: ContinuousReceivedRegistry;
  status: ContinuousReceivedMutationStatus;
  matchedRecords: number;
  changed: boolean;
  message: string;
}

function keepMessage(status: ContinuousReceivedKeepStatus, storedId: string | undefined, domainMessage: string): string {
  if (status === 'kept') {
    return 'Cópia recebida guardada na biblioteca separada. Nenhuma jornada ou coleção própria foi alterada.';
  }
  if (status === 'equivalent') {
    return 'Este mesmo conteúdo já estava guardado. A cópia existente foi aberta sem duplicação.';
  }
  if (status === 'disambiguated') {
    return `A cópia é distinta e foi preservada com o identificador local ${storedId ?? 'desambiguado'}.`;
  }
  return domainMessage;
}

export function keepContinuousReceivedPackageFromStore(
  registry: ContinuousReceivedRegistry,
  packageValue: ContinuousCollectionShareExport,
  requestedId: string,
  receivedAt: string
): ContinuousReceivedStoreKeepResult {
  const result = keepReceivedCollectionWithIdentity(
    registry,
    { id: requestedId, package: packageValue },
    receivedAt
  );
  return {
    registry: result.registry,
    status: result.status,
    id: result.storedId,
    duplicate: result.status === 'equivalent',
    changed: result.registry !== registry,
    message: keepMessage(result.status, result.storedId, result.message)
  };
}

function mutationResult(
  previous: ContinuousReceivedRegistry,
  result: {
    registry: ContinuousReceivedRegistry;
    status: ContinuousReceivedMutationStatus;
    matchedRecords: number;
    message: string;
  }
): ContinuousReceivedStoreMutationResult {
  return {
    registry: result.registry,
    status: result.status,
    matchedRecords: result.matchedRecords,
    changed: result.registry !== previous,
    message: result.message
  };
}

export function archiveContinuousReceivedRecordFromStore(
  registry: ContinuousReceivedRegistry,
  recordId: string,
  archivedAt: string
): ContinuousReceivedStoreMutationResult {
  return mutationResult(registry, archiveReceivedCollectionWithIdentity(registry, recordId, archivedAt));
}

export function reactivateContinuousReceivedRecordFromStore(
  registry: ContinuousReceivedRegistry,
  recordId: string,
  updatedAt: string
): ContinuousReceivedStoreMutationResult {
  return mutationResult(registry, reactivateReceivedCollectionWithIdentity(registry, recordId, updatedAt));
}

export function removeContinuousReceivedRecordFromStore(
  registry: ContinuousReceivedRegistry,
  recordId: string,
  updatedAt: string
): ContinuousReceivedStoreMutationResult {
  return mutationResult(registry, removeReceivedCollectionWithIdentity(registry, recordId, updatedAt));
}
