import type { ContinuousReceivedRegistry } from '../domain/continuousReceive';
import type { ContinuousReceivedPersistenceRuntimeStatus } from './useContinuousReceivedPersistenceRuntimeStore';

export type ContinuousReceivedPersistenceBlockStatus =
  | 'writing'
  | 'persistence-failed'
  | 'persistence-conflict';

export interface ContinuousReceivedRegistryChange {
  changed: boolean;
  registry: ContinuousReceivedRegistry;
  message: string;
}

export type ContinuousReceivedPersistenceWriteResult =
  | { status: 'confirmed'; persistedValue: string }
  | { status: 'conflict' };

export interface ContinuousReceivedPersistenceLifecycle {
  begin: (operation: string) => void;
  confirm: (message: string, persistedValue: string) => void;
  fail: (error: unknown) => void;
  conflict: () => void;
  clear: () => void;
}

export interface ContinuousReceivedPersistenceBlocked {
  executed: false;
  status: 'writing' | 'persistence-conflict';
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
  write: (registry: ContinuousReceivedRegistry) => Promise<ContinuousReceivedPersistenceWriteResult>,
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

  if (runtimeStatus === 'conflict') {
    return {
      executed: false,
      status: 'persistence-conflict',
      changed: false,
      message: 'A memória persistida mudou desde a hidratação. Recarregue a página antes de decidir outra alteração.'
    };
  }

  const value = action();
  if (!value.changed) {
    lifecycle.clear();
    return {
      executed: true,
      persistence: 'not-needed',
      changed: false,
      value
    };
  }

  lifecycle.begin(operation);
  try {
    const written = await write(value.registry);
    if (written.status === 'conflict') {
      lifecycle.conflict();
      return {
        executed: false,
        status: 'persistence-conflict',
        changed: false,
        message: 'Outra aba ou sessão alterou a memória local. A biblioteca desta sessão foi preservada e nenhuma versão foi escolhida ou mesclada automaticamente.'
      };
    }

    apply(value.registry);
    lifecycle.confirm(`${value.message} Gravação local confirmada.`, written.persistedValue);
  } catch (error) {
    lifecycle.fail(error);
    return {
      executed: false,
      status: 'persistence-failed',
      changed: false,
      message: 'A IndexedDB não confirmou a gravação. A biblioteca anterior foi preservada e a alteração não foi aplicada.'
    };
  }

  return {
    executed: true,
    persistence: 'confirmed',
    changed: true,
    value
  };
}
