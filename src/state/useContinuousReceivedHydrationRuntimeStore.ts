import { create } from 'zustand';
import type { ContinuousReceivedHydrationResult } from './continuousReceivedHydration';
import type { ContinuousReceivedHydrationRuntimeStatus } from './continuousReceivedHydrationGate';

interface ContinuousReceivedHydrationRuntimeState {
  status: ContinuousReceivedHydrationRuntimeStatus;
  message?: string;
  issues: string[];
  beginExplicitReread: () => void;
  accept: (result: ContinuousReceivedHydrationResult) => void;
  fail: (error: unknown) => void;
  markEmpty: (message: string) => void;
}

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message.length > 0) return error.message;
  return 'A IndexedDB não concluiu a leitura da biblioteca recebida.';
}

export const useContinuousReceivedHydrationRuntimeStore = create<ContinuousReceivedHydrationRuntimeState>()((set) => ({
  status: 'initial',
  message: 'A memória local da biblioteca recebida está sendo examinada.',
  issues: [],
  beginExplicitReread: () => set({
    status: 'initial',
    message: 'A memória local mais recente está sendo relida por uma escolha explícita.',
    issues: []
  }),
  accept: (result) => set({
    status: result.status,
    message: result.message,
    issues: [...result.issues]
  }),
  fail: (error) => {
    const detail = errorMessage(error);
    set({
      status: 'unavailable',
      message: 'A memória local não pôde ser lida. As ações da biblioteca permanecem bloqueadas para evitar sobrescrita silenciosa.',
      issues: [detail]
    });
  },
  markEmpty: (message) => set({
    status: 'empty',
    message,
    issues: []
  })
}));
