import { describe, expect, it, vi } from 'vitest';
import { createContinuousReceivedRegistry } from '../domain/continuousReceive';
import {
  executeContinuousReceivedExplicitRehydration,
  inspectContinuousReceivedPersistedValueForExplicitRehydration
} from './continuousReceivedExplicitRehydration';
import { serializeContinuousReceivedPersistedState } from './continuousReceivedPersistenceStorage';

const t0 = '2026-07-28T21:00:00.000Z';
const t1 = '2026-07-28T21:01:00.000Z';

function registry(at = t0) {
  return createContinuousReceivedRegistry('1.0.0', at);
}

function lifecycle() {
  return {
    begin: vi.fn(),
    accept: vi.fn(),
    fail: vi.fn(),
    adoptPersistedValue: vi.fn()
  };
}

describe('inspeção da memória para releitura explícita', () => {
  it('aceita o envelope persistido atual', () => {
    const stored = registry(t1);
    const result = inspectContinuousReceivedPersistedValueForExplicitRehydration(
      serializeContinuousReceivedPersistedState(stored),
      registry(),
      () => registry()
    );
    expect(result.status).toBe('accepted');
    expect(result.registry).toEqual(stored);
    expect(result.registry).not.toBe(stored);
  });

  it('trata ausência física como biblioteca nova, não como snapshot obsoleto', () => {
    const current = registry(t1);
    const fresh = registry(t0);
    const result = inspectContinuousReceivedPersistedValueForExplicitRehydration(
      null,
      current,
      () => fresh
    );
    expect(result.status).toBe('empty');
    expect(result.registry).toBe(fresh);
    expect(result.registry).not.toBe(current);
  });

  it('recusa JSON malformado e preserva o snapshot atual', () => {
    const current = registry();
    const result = inspectContinuousReceivedPersistedValueForExplicitRehydration(
      '{bad',
      current,
      () => registry(t1)
    );
    expect(result.status).toBe('rejected');
    expect(result.registry).toBe(current);
  });

  it('recusa versão desconhecida do envelope', () => {
    const current = registry();
    const result = inspectContinuousReceivedPersistedValueForExplicitRehydration(
      JSON.stringify({ state: { schemaVersion: 1, registry: current }, version: 1 }),
      current,
      () => registry(t1)
    );
    expect(result.status).toBe('rejected');
    expect(result.message).toMatch(/versão do envelope/i);
  });

  it('recusa campos desconhecidos no envelope de recuperação', () => {
    const current = registry();
    const result = inspectContinuousReceivedPersistedValueForExplicitRehydration(
      JSON.stringify({ state: { schemaVersion: 1, registry: current }, version: 0, extra: true }),
      current,
      () => registry(t1)
    );
    expect(result.status).toBe('rejected');
    expect(result.message).toMatch(/campos ausentes ou desconhecidos/i);
  });
});

describe('releitura explícita depois de conflito', () => {
  it('não inicia durante uma escrita', async () => {
    const read = vi.fn(async () => null);
    const hooks = lifecycle();
    const result = await executeContinuousReceivedExplicitRehydration(
      'writing', registry(), () => registry(t1), read, vi.fn(), hooks
    );
    expect(result).toMatchObject({ executed: false, status: 'writing', adopted: false });
    expect(read).not.toHaveBeenCalled();
    expect(hooks.begin).not.toHaveBeenCalled();
  });

  it('não inicia fora de um conflito', async () => {
    const read = vi.fn(async () => null);
    const hooks = lifecycle();
    const result = await executeContinuousReceivedExplicitRehydration(
      'idle', registry(), () => registry(t1), read, vi.fn(), hooks
    );
    expect(result).toMatchObject({ executed: false, status: 'not-conflicted' });
    expect(read).not.toHaveBeenCalled();
  });

  it('adota uma memória aceita e atualiza a referência somente depois da aplicação', async () => {
    const events: string[] = [];
    const stored = registry(t1);
    const raw = serializeContinuousReceivedPersistedState(stored);
    const hooks = {
      begin: vi.fn(() => events.push('begin')),
      accept: vi.fn(() => events.push('accept')),
      fail: vi.fn(() => events.push('fail')),
      adoptPersistedValue: vi.fn(() => events.push('adopt-reference'))
    };
    const apply = vi.fn(() => events.push('apply'));
    const result = await executeContinuousReceivedExplicitRehydration(
      'conflict', registry(), () => registry(), async () => raw, apply, hooks
    );
    expect(result).toMatchObject({ executed: true, adopted: true, status: 'accepted' });
    expect(events).toEqual(['begin', 'apply', 'adopt-reference', 'accept']);
    expect(apply).toHaveBeenCalledWith(expect.objectContaining({ updatedAt: t1 }));
    expect(hooks.adoptPersistedValue).toHaveBeenCalledWith(raw);
    expect(result.message).toMatch(/não foi repetida/i);
  });

  it('adota ausência confirmada como uma biblioteca nova', async () => {
    const current = registry(t1);
    const fresh = registry(t0);
    const apply = vi.fn();
    const hooks = lifecycle();
    const result = await executeContinuousReceivedExplicitRehydration(
      'conflict', current, () => fresh, async () => null, apply, hooks
    );
    expect(result).toMatchObject({ adopted: true, status: 'empty' });
    expect(apply).toHaveBeenCalledWith(fresh);
    expect(hooks.adoptPersistedValue).toHaveBeenCalledWith(null);
  });

  it('mantém o conflito e não aplica memória recusada', async () => {
    const apply = vi.fn();
    const hooks = lifecycle();
    const result = await executeContinuousReceivedExplicitRehydration(
      'conflict', registry(), () => registry(t1), async () => '{bad', apply, hooks
    );
    expect(result).toMatchObject({ adopted: false, status: 'rejected' });
    expect(apply).not.toHaveBeenCalled();
    expect(hooks.adoptPersistedValue).not.toHaveBeenCalled();
    expect(hooks.accept).toHaveBeenCalledWith(expect.objectContaining({ status: 'rejected' }));
  });

  it('preserva o conflito quando a leitura falha', async () => {
    const apply = vi.fn();
    const hooks = lifecycle();
    const result = await executeContinuousReceivedExplicitRehydration(
      'conflict', registry(), () => registry(t1), async () => { throw new Error('IndexedDB indisponível'); }, apply, hooks
    );
    expect(result).toMatchObject({ adopted: false, status: 'unavailable' });
    expect(apply).not.toHaveBeenCalled();
    expect(hooks.fail).toHaveBeenCalledTimes(1);
    expect(hooks.adoptPersistedValue).not.toHaveBeenCalled();
  });
});
