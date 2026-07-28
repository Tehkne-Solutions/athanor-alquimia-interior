import { beforeEach, describe, expect, it } from 'vitest';
import { useContinuousReceivedPersistenceRuntimeStore } from './useContinuousReceivedPersistenceRuntimeStore';

beforeEach(() => {
  useContinuousReceivedPersistenceRuntimeStore.setState({
    status: 'idle',
    operation: undefined,
    message: undefined,
    issues: [],
    expectedPersistedValue: null
  });
});

describe('runtime transitório da persistência recebida', () => {
  it('captura exatamente o valor bruto hidratado', () => {
    useContinuousReceivedPersistenceRuntimeStore.getState().hydrate('envelope-original');
    expect(useContinuousReceivedPersistenceRuntimeStore.getState().expectedPersistedValue).toBe('envelope-original');
  });

  it('preserva referência nula quando a memória está vazia', () => {
    useContinuousReceivedPersistenceRuntimeStore.getState().hydrate(null);
    expect(useContinuousReceivedPersistenceRuntimeStore.getState().expectedPersistedValue).toBeNull();
  });

  it('substitui a referência somente depois da confirmação', () => {
    const runtime = useContinuousReceivedPersistenceRuntimeStore.getState();
    runtime.hydrate('anterior');
    runtime.begin('guardar cópia');
    expect(useContinuousReceivedPersistenceRuntimeStore.getState().expectedPersistedValue).toBe('anterior');
    useContinuousReceivedPersistenceRuntimeStore.getState().confirm('Confirmada.', 'novo-envelope');
    expect(useContinuousReceivedPersistenceRuntimeStore.getState()).toMatchObject({
      status: 'confirmed',
      expectedPersistedValue: 'novo-envelope'
    });
  });

  it('mantém a referência antiga e bloqueia o ciclo depois de conflito', () => {
    const runtime = useContinuousReceivedPersistenceRuntimeStore.getState();
    runtime.hydrate('anterior');
    runtime.conflict();
    expect(useContinuousReceivedPersistenceRuntimeStore.getState()).toMatchObject({
      status: 'conflict',
      expectedPersistedValue: 'anterior'
    });
  });

  it('limpa diagnóstico comum sem apagar a referência esperada', () => {
    const runtime = useContinuousReceivedPersistenceRuntimeStore.getState();
    runtime.hydrate('anterior');
    runtime.fail(new Error('quota'));
    useContinuousReceivedPersistenceRuntimeStore.getState().clear();
    expect(useContinuousReceivedPersistenceRuntimeStore.getState()).toMatchObject({
      status: 'idle',
      expectedPersistedValue: 'anterior',
      issues: []
    });
  });
});
