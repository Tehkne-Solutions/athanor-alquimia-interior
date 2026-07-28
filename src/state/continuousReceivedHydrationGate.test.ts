import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  executeContinuousReceivedHydrationGatedAction,
  inspectContinuousReceivedHydrationGate
} from './continuousReceivedHydrationGate';
import { useContinuousReceivedHydrationRuntimeStore } from './useContinuousReceivedHydrationRuntimeStore';

beforeEach(() => {
  useContinuousReceivedHydrationRuntimeStore.setState({
    status: 'initial',
    message: 'A memória local da biblioteca recebida está sendo examinada.',
    issues: []
  });
});

describe('portão de ações durante hidratação', () => {
  it('bloqueia initial sem executar nem enfileirar a ação', () => {
    const action = vi.fn(() => 'executado');
    const result = executeContinuousReceivedHydrationGatedAction('initial', action);
    expect(result.executed).toBe(false);
    expect(action).not.toHaveBeenCalled();
    if (result.executed) return;
    expect(result.gate.status).toBe('hydrating');
    expect(result.gate.message).toMatch(/não foi executada nem enfileirada/i);
  });

  it('bloqueia unavailable sem executar a ação', () => {
    const action = vi.fn(() => 'executado');
    const result = executeContinuousReceivedHydrationGatedAction('unavailable', action);
    expect(result.executed).toBe(false);
    expect(action).not.toHaveBeenCalled();
    if (result.executed) return;
    expect(result.gate.status).toBe('unavailable');
    expect(result.gate.message).toMatch(/não sobrescrever/i);
  });

  it.each(['empty', 'accepted', 'rejected'] as const)(
    'permite ação explícita depois do estado %s',
    (status) => {
      const action = vi.fn(() => `${status}-ok`);
      const result = executeContinuousReceivedHydrationGatedAction(status, action);
      expect(result.executed).toBe(true);
      expect(action).toHaveBeenCalledTimes(1);
      if (!result.executed) return;
      expect(result.value).toBe(`${status}-ok`);
    }
  );

  it('não confunde initial com biblioteca vazia', () => {
    expect(inspectContinuousReceivedHydrationGate('initial').ready).toBe(false);
    expect(inspectContinuousReceivedHydrationGate('empty').ready).toBe(true);
  });
});

describe('ciclo transitório de hidratação', () => {
  it('aceita o resultado de hidratação e copia a lista de problemas', () => {
    const issues = ['diagnóstico original'];
    useContinuousReceivedHydrationRuntimeStore.getState().accept({
      schemaVersion: 1,
      registry: {} as never,
      status: 'rejected',
      message: 'Memória recusada.',
      issues
    });
    issues[0] = 'alterado fora';
    const state = useContinuousReceivedHydrationRuntimeStore.getState();
    expect(state.status).toBe('rejected');
    expect(state.issues).toEqual(['diagnóstico original']);
  });

  it('marca falha de IndexedDB como unavailable', () => {
    useContinuousReceivedHydrationRuntimeStore.getState().fail(new Error('Abertura recusada'));
    const state = useContinuousReceivedHydrationRuntimeStore.getState();
    expect(state.status).toBe('unavailable');
    expect(state.message).toMatch(/não pôde ser lida/i);
    expect(state.issues).toEqual(['Abertura recusada']);
  });

  it('usa diagnóstico genérico quando a falha não é Error', () => {
    useContinuousReceivedHydrationRuntimeStore.getState().fail(null);
    expect(useContinuousReceivedHydrationRuntimeStore.getState().issues[0]).toMatch(/não concluiu a leitura/i);
  });

  it('marca reinicialização explícita como empty', () => {
    useContinuousReceivedHydrationRuntimeStore.getState().markEmpty('Reiniciada explicitamente.');
    const state = useContinuousReceivedHydrationRuntimeStore.getState();
    expect(state.status).toBe('empty');
    expect(state.message).toBe('Reiniciada explicitamente.');
    expect(state.issues).toEqual([]);
  });
});
