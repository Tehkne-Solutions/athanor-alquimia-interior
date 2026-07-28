import { create } from 'zustand';

export type ContinuousReceivedPersistenceRuntimeStatus =
  | 'idle'
  | 'writing'
  | 'confirmed'
  | 'failed';

interface ContinuousReceivedPersistenceRuntimeState {
  status: ContinuousReceivedPersistenceRuntimeStatus;
  operation?: string;
  message?: string;
  issues: string[];
  begin: (operation: string) => void;
  confirm: (message: string) => void;
  fail: (error: unknown) => void;
  clear: () => void;
}

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message.length > 0) return error.message;
  return 'A IndexedDB não confirmou a gravação da biblioteca recebida.';
}

export const useContinuousReceivedPersistenceRuntimeStore = create<ContinuousReceivedPersistenceRuntimeState>()((set) => ({
  status: 'idle',
  operation: undefined,
  message: undefined,
  issues: [],
  begin: (operation) => set({
    status: 'writing',
    operation,
    message: 'A alteração está sendo gravada na memória local.',
    issues: []
  }),
  confirm: (message) => set({
    status: 'confirmed',
    operation: undefined,
    message,
    issues: []
  }),
  fail: (error) => {
    const detail = errorMessage(error);
    set({
      status: 'failed',
      operation: undefined,
      message: 'A gravação local falhou. A biblioteca ativa anterior foi preservada e a alteração não foi aplicada.',
      issues: [detail]
    });
  },
  clear: () => set({
    status: 'idle',
    operation: undefined,
    message: undefined,
    issues: []
  })
}));
