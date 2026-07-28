import type { ContinuousReceivedHydrationStatus } from './continuousReceivedHydration';

export type ContinuousReceivedHydrationRuntimeStatus =
  | 'initial'
  | 'unavailable'
  | ContinuousReceivedHydrationStatus;

export type ContinuousReceivedHydrationBlockStatus = 'hydrating' | 'unavailable';

export interface ContinuousReceivedHydrationGateReady {
  ready: true;
  status: 'ready';
  message: string;
}

export interface ContinuousReceivedHydrationGateBlocked {
  ready: false;
  status: ContinuousReceivedHydrationBlockStatus;
  message: string;
}

export type ContinuousReceivedHydrationGateResult =
  | ContinuousReceivedHydrationGateReady
  | ContinuousReceivedHydrationGateBlocked;

export type ContinuousReceivedHydrationExecution<T> =
  | { executed: true; gate: ContinuousReceivedHydrationGateReady; value: T }
  | { executed: false; gate: ContinuousReceivedHydrationGateBlocked };

export function inspectContinuousReceivedHydrationGate(
  status: ContinuousReceivedHydrationRuntimeStatus
): ContinuousReceivedHydrationGateResult {
  if (status === 'initial') {
    return {
      ready: false,
      status: 'hydrating',
      message: 'A biblioteca recebida ainda está examinando a memória local. A ação não foi executada nem enfileirada.'
    };
  }

  if (status === 'unavailable') {
    return {
      ready: false,
      status: 'unavailable',
      message: 'A memória local não pôde ser lida. A ação foi bloqueada para não sobrescrever um estado persistido desconhecido.'
    };
  }

  return {
    ready: true,
    status: 'ready',
    message: 'A hidratação foi concluída e a biblioteca pode receber uma decisão explícita.'
  };
}

export function executeContinuousReceivedHydrationGatedAction<T>(
  status: ContinuousReceivedHydrationRuntimeStatus,
  action: () => T
): ContinuousReceivedHydrationExecution<T> {
  const gate = inspectContinuousReceivedHydrationGate(status);
  if (!gate.ready) return { executed: false, gate };
  return { executed: true, gate, value: action() };
}
