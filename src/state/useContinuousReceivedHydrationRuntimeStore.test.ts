import { beforeEach, describe, expect, it } from 'vitest';
import { createContinuousReceivedRegistry } from '../domain/continuousReceive';
import { useContinuousReceivedHydrationRuntimeStore } from './useContinuousReceivedHydrationRuntimeStore';

beforeEach(() => {
  useContinuousReceivedHydrationRuntimeStore.setState({
    status: 'accepted',
    message: 'Memória anterior aceita.',
    issues: []
  });
});

describe('runtime transitório da hidratação recebida', () => {
  it('marca a releitura explícita como exame em andamento', () => {
    useContinuousReceivedHydrationRuntimeStore.getState().beginExplicitReread();
    expect(useContinuousReceivedHydrationRuntimeStore.getState()).toMatchObject({
      status: 'initial',
      issues: []
    });
    expect(useContinuousReceivedHydrationRuntimeStore.getState().message).toMatch(/relida.*escolha explícita/i);
  });

  it('aceita o resultado final da releitura', () => {
    useContinuousReceivedHydrationRuntimeStore.getState().beginExplicitReread();
    useContinuousReceivedHydrationRuntimeStore.getState().accept({
      schemaVersion: 1,
      registry: createContinuousReceivedRegistry('1.0.0', '2026-07-28T22:00:00.000Z'),
      status: 'accepted',
      message: 'Memória aceita.',
      issues: []
    });
    expect(useContinuousReceivedHydrationRuntimeStore.getState()).toMatchObject({
      status: 'accepted',
      message: 'Memória aceita.',
      issues: []
    });
  });

  it('mantém diagnóstico transitório quando a releitura falha', () => {
    useContinuousReceivedHydrationRuntimeStore.getState().beginExplicitReread();
    useContinuousReceivedHydrationRuntimeStore.getState().fail(new Error('IndexedDB bloqueada'));
    expect(useContinuousReceivedHydrationRuntimeStore.getState()).toMatchObject({
      status: 'unavailable',
      issues: ['IndexedDB bloqueada']
    });
  });
});
