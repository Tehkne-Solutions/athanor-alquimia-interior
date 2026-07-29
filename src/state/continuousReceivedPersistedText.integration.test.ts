import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createContinuousReceivedRegistry } from '../domain/continuousReceive';

const storageMocks = vi.hoisted(() => ({
  getItem: vi.fn<() => Promise<string | null>>(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  compareAndSet: vi.fn()
}));

vi.mock('../storage/idbStorage', () => ({
  idbStateStorage: {
    getItem: storageMocks.getItem,
    setItem: storageMocks.setItem,
    removeItem: storageMocks.removeItem
  },
  compareAndSetIdbState: storageMocks.compareAndSet
}));

import {
  inspectContinuousReceivedPersistedValueForExplicitRehydration
} from './continuousReceivedExplicitRehydration';
import {
  CONTINUOUS_RECEIVED_STORAGE_KEY,
  continuousReceivedHydrationOnlyStorage,
  serializeContinuousReceivedPersistedState
} from './continuousReceivedPersistenceStorage';
import { useContinuousReceivedHydrationRuntimeStore } from './useContinuousReceivedHydrationRuntimeStore';
import { useContinuousReceivedPersistenceRuntimeStore } from './useContinuousReceivedPersistenceRuntimeStore';

const t0 = '2026-07-28T23:10:00.000Z';

function registry() {
  return createContinuousReceivedRegistry('1.0.0', t0);
}

function duplicatedVersionText(): string {
  return serializeContinuousReceivedPersistedState(registry())
    .replace('"version":0', '"version":0,"version":1');
}

beforeEach(() => {
  storageMocks.getItem.mockReset();
  useContinuousReceivedHydrationRuntimeStore.setState({
    status: 'initial',
    message: 'Examinando.',
    issues: []
  });
  useContinuousReceivedPersistenceRuntimeStore.setState({
    status: 'idle',
    operation: undefined,
    message: undefined,
    issues: [],
    expectedPersistedValue: null
  });
});

describe('inspeção bruta na hidratação inicial', () => {
  it('impede que chave repetida chegue ao parser do Zustand', async () => {
    const raw = duplicatedVersionText();
    storageMocks.getItem.mockResolvedValue(raw);

    const value = await continuousReceivedHydrationOnlyStorage.getItem(CONTINUOUS_RECEIVED_STORAGE_KEY);

    expect(value).toBeNull();
    expect(useContinuousReceivedPersistenceRuntimeStore.getState().expectedPersistedValue).toBe(raw);
    expect(useContinuousReceivedHydrationRuntimeStore.getState()).toMatchObject({
      status: 'rejected'
    });
    expect(useContinuousReceivedHydrationRuntimeStore.getState().issues.join(' ')).toMatch(/version.*repetida/i);
  });

  it('devolve texto válido sem reserializar', async () => {
    const raw = serializeContinuousReceivedPersistedState(registry());
    storageMocks.getItem.mockResolvedValue(raw);

    const value = await continuousReceivedHydrationOnlyStorage.getItem(CONTINUOUS_RECEIVED_STORAGE_KEY);

    expect(value).toBe(raw);
    expect(useContinuousReceivedPersistenceRuntimeStore.getState().expectedPersistedValue).toBe(raw);
    expect(useContinuousReceivedHydrationRuntimeStore.getState().status).toBe('initial');
  });
});

describe('inspeção bruta na releitura explícita', () => {
  it('recusa chave repetida preservando o snapshot atual', () => {
    const current = registry();
    const result = inspectContinuousReceivedPersistedValueForExplicitRehydration(
      duplicatedVersionText(),
      current,
      registry
    );
    expect(result.status).toBe('rejected');
    expect(result.registry).toBe(current);
    expect(result.issues.join(' ')).toMatch(/version.*repetida/i);
  });

  it('recusa número que perderia medida antes do envelope', () => {
    const current = registry();
    const raw = serializeContinuousReceivedPersistedState(current)
      .replace('"version":0', '"diagnostic":0.10000000000000001,"version":0');
    const result = inspectContinuousReceivedPersistedValueForExplicitRehydration(raw, current, registry);
    expect(result.status).toBe('rejected');
    expect(result.registry).toBe(current);
    expect(result.issues.join(' ')).toMatch(/mudaria silenciosamente de medida/i);
  });
});
