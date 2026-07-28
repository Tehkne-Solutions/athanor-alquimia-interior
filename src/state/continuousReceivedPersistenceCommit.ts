import type { ContinuousReceivedRegistry } from '../domain/continuousReceive';
import type { ContinuousReceivedPersistenceRuntimeStatus } from './useContinuousReceivedPersistenceRuntimeStore';

export type ContinuousReceivedPersistenceBlockStatus = 'writing' | 'persistence-failed';

export interface ContinuousReceivedRegistryChange {
  changed: boolean;
  registry: ContinuousReceivedRegistry;
  message: string;
}

export interface ContinuousReceivedPersistenceLifecycle {
  begin: (operation: string) => void;
  confirm: (message: string) => void;
  fail: (error: unknown) => void;
}

export interface ContinuousReceivedPersistenceBlocked {
  executed: false;
  status: 'writing';
  changed: false;
  message: string;
}

export interface ContinuousReceivedPersistenceNoChange<T> {
  executed: true;
  persistence: 'not-needed';
  changed: false;
  value: T;
}

export interface ContinuousReceivedPersistenceConfirmed<T> {
  executed: true;
  persistence: 'confirmed';
  changed: true;
  value: T;
}

export interface ContinuousReceivedPersistenceFailed {
  executed: false;
  status: 'persistence-failed';
  changed: false;
  message: string;
}

export type ContinuousReceivedPersistenceExecution<T> =
  | ContinuousReceivedPersistenceBlocked
  | ContinuousReceivedPersistenceNoChange<T>
  | ContinuousReceivedPersistenceConfirmed<T>
  | ContinuousReceivedPersistenceFailed;

export async function executeContinuousReceivedConfirmedPersistence<
  T extends ContinuousReceivedRegistryChange
>(
  runtimeStatus: ContinuousReceivedPersistenceRuntimeStatus,
  operation: string,
  action: () => T,
  write: (registry: ContinuousReceivedRegistry) => Promise<void>,
  apply: (registry: ContinuousReceivedRegistry) => void,
  lifecycle: ContinuousReceivedPersistenceLifecycle
): Promise<ContinuousReceivedPersistenceExecution<T>> {
  if (runtimeStatus === 'writing') {
    return {
      executed: false,
      status: 'writing',
      changed: false,
      message: 'Outra alteração da biblioteca ainda está sendo gravada. A nova ação não foi executada nem enfileirada.'
    };
  }

  const value = action();
  if (!value.changed) {
    return {
      executed: true,
      persistence: 'not-needed',
      changed: false,
      value
    };
  }

  lifecycle.begin(operation);
  try {
    await write(value.registry);
  } catch (error) {
    lifecycle.fail(error);
    return {
      executed: false,
      status: 'persistence-failed',
      changed: false,
      message: 'A IndexedDB não confirmou a gravação. A biblioteca anterior foi preservada e a alteração não foi aplicada.'
    };
  }

  apply(value.registry);
  lifecycle.confirm(`${value.message} Gravação local confirmada.`);
  return {
    executed: true,
    persistence: 'confirmed',
    changed: true,
    value
  };
}
