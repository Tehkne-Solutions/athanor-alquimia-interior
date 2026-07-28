import { create } from 'zustand';

export type ContinuousReceivedPersistenceRuntimeStatus =
  | 'idle'
  | 'writing'
  | 'confirmed'
  | 'failed'
  | 'conflict';

interface ContinuousReceivedPersistenceRuntimeState {
  status: ContinuousReceivedPersistenceRuntimeStatus;
  operation?: string;
  message?: string;
  issues: string[];
  expectedPersistedValue: string | null;
  hydrate: (persistedValue: string | null) => void;
  begin: (operation: string) => void;
  confirm: (message: string, persistedValue: string) => void;
  fail: (error: unknown) => void;
  conflict: () => void;
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
  expectedPersistedValue: null,
  hydrate: (persistedValue) => set({
    status: 'idle',
    operation: undefined,
    message: undefined,
    issues: [],
    expectedPersistedValue: persistedValue
  }),
  begin: (operation) => set({
    status: 'writing',
    operation,
    message: 'A alteração está sendo conferida e gravada na memória local.',
    issues: []
  }),
  confirm: (message, persistedValue) => set({
    status: 'confirmed',
    operation: undefined,
    message,
    issues: [],
    expectedPersistedValue: persistedValue
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
  conflict: () => set({
    status: 'conflict',
    operation: undefined,
    message: 'A memória persistida mudou em outra aba ou sessão. A alteração local não foi aplicada nem mesclada.',
    issues: ['Examine explicitamente a memória atual antes de decidir outra ação. A ação interrompida não será repetida.']
  }),
  clear: () => set((state) => ({
    status: 'idle',
    operation: undefined,
    message: undefined,
    issues: [],
    expectedPersistedValue: state.expectedPersistedValue
  }))
}));
