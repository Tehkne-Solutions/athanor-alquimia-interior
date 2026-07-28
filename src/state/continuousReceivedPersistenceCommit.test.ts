import { describe, expect, it, vi } from 'vitest';
import { createContinuousReceivedRegistry, type ContinuousReceivedRegistry } from '../domain/continuousReceive';
import { executeContinuousReceivedConfirmedPersistence } from './continuousReceivedPersistenceCommit';

const t0 = '2026-07-28T20:00:00.000Z';
const t1 = '2026-07-28T20:01:00.000Z';

function registry(updatedAt = t0): ContinuousReceivedRegistry {
  return createContinuousReceivedRegistry('1.0.0', updatedAt);
}

function lifecycle() {
  return {
    begin: vi.fn(),
    confirm: vi.fn(),
    fail: vi.fn(),
    conflict: vi.fn(),
    clear: vi.fn()
  };
}

const confirmedWrite = async () => ({ status: 'confirmed' as const, persistedValue: '{"confirmed":true}' });

describe('commit confirmado da biblioteca recebida', () => {
  it('não chama a ação nem a escrita durante outra gravação', async () => {
    const action = vi.fn(() => ({ changed: true, registry: registry(t1), message: 'Alterado.' }));
    const write = vi.fn(confirmedWrite);
    const apply = vi.fn();
    const result = await executeContinuousReceivedConfirmedPersistence(
      'writing',
      'guardar cópia',
      action,
      write,
      apply,
      lifecycle()
    );
    expect(result.executed).toBe(false);
    expect(result).toMatchObject({ status: 'writing', changed: false });
    expect(action).not.toHaveBeenCalled();
    expect(write).not.toHaveBeenCalled();
    expect(apply).not.toHaveBeenCalled();
  });

  it('bloqueia nova ação depois de conflito sem chamar o domínio', async () => {
    const action = vi.fn(() => ({ changed: true, registry: registry(t1), message: 'Alterado.' }));
    const write = vi.fn(confirmedWrite);
    const result = await executeContinuousReceivedConfirmedPersistence(
      'conflict',
      'guardar cópia',
      action,
      write,
      vi.fn(),
      lifecycle()
    );
    expect(result).toMatchObject({ executed: false, status: 'persistence-conflict' });
    expect(action).not.toHaveBeenCalled();
    expect(write).not.toHaveBeenCalled();
  });

  it('não inicia transação quando o domínio não mudou', async () => {
    const current = registry();
    const action = vi.fn(() => ({ changed: false, registry: current, message: 'Sem mudança.' }));
    const write = vi.fn(confirmedWrite);
    const apply = vi.fn();
    const hooks = lifecycle();
    const result = await executeContinuousReceivedConfirmedPersistence(
      'failed',
      'arquivar cópia',
      action,
      write,
      apply,
      hooks
    );
    expect(result.executed).toBe(true);
    if (!result.executed) return;
    expect(result.persistence).toBe('not-needed');
    expect(write).not.toHaveBeenCalled();
    expect(apply).not.toHaveBeenCalled();
    expect(hooks.begin).not.toHaveBeenCalled();
    expect(hooks.clear).toHaveBeenCalledTimes(1);
  });

  it('grava antes de aplicar o próximo snapshot no runtime', async () => {
    const events: string[] = [];
    const next = registry(t1);
    const hooks = {
      begin: vi.fn(() => events.push('begin')),
      confirm: vi.fn(() => events.push('confirm')),
      fail: vi.fn(() => events.push('fail')),
      conflict: vi.fn(() => events.push('conflict')),
      clear: vi.fn(() => events.push('clear'))
    };
    const write = vi.fn(async () => {
      events.push('write');
      return { status: 'confirmed' as const, persistedValue: 'next-envelope' };
    });
    const apply = vi.fn(() => events.push('apply'));
    const result = await executeContinuousReceivedConfirmedPersistence(
      'idle',
      'guardar cópia',
      () => ({ changed: true, registry: next, message: 'Cópia guardada.' }),
      write,
      apply,
      hooks
    );
    expect(result.executed).toBe(true);
    if (!result.executed) return;
    expect(result.persistence).toBe('confirmed');
    expect(events).toEqual(['begin', 'write', 'apply', 'confirm']);
    expect(write).toHaveBeenCalledWith(next);
    expect(apply).toHaveBeenCalledWith(next);
    expect(hooks.confirm).toHaveBeenCalledWith(expect.stringMatching(/confirmada/i), 'next-envelope');
  });

  it('aguarda uma escrita pendente antes de aplicar', async () => {
    let release!: () => void;
    const pending = new Promise<{ status: 'confirmed'; persistedValue: string }>((resolve) => {
      release = () => resolve({ status: 'confirmed', persistedValue: 'next-envelope' });
    });
    const apply = vi.fn();
    const execution = executeContinuousReceivedConfirmedPersistence(
      'idle',
      'guardar cópia',
      () => ({ changed: true, registry: registry(t1), message: 'Cópia guardada.' }),
      () => pending,
      apply,
      lifecycle()
    );
    await Promise.resolve();
    expect(apply).not.toHaveBeenCalled();
    release();
    await execution;
    expect(apply).toHaveBeenCalledTimes(1);
  });

  it('preserva runtime e memória externa quando detecta conflito', async () => {
    const apply = vi.fn();
    const hooks = lifecycle();
    const result = await executeContinuousReceivedConfirmedPersistence(
      'idle',
      'remover cópia',
      () => ({ changed: true, registry: registry(t1), message: 'Cópia removida.' }),
      async () => ({ status: 'conflict' as const }),
      apply,
      hooks
    );
    expect(result).toMatchObject({ executed: false, status: 'persistence-conflict', changed: false });
    expect(apply).not.toHaveBeenCalled();
    expect(hooks.conflict).toHaveBeenCalledTimes(1);
    expect(hooks.fail).not.toHaveBeenCalled();
    expect(hooks.confirm).not.toHaveBeenCalled();
  });

  it('preserva o runtime quando a IndexedDB recusa a escrita', async () => {
    const apply = vi.fn();
    const hooks = lifecycle();
    const result = await executeContinuousReceivedConfirmedPersistence(
      'idle',
      'remover cópia',
      () => ({ changed: true, registry: registry(t1), message: 'Cópia removida.' }),
      async () => { throw new Error('QuotaExceededError'); },
      apply,
      hooks
    );
    expect(result.executed).toBe(false);
    expect(result).toMatchObject({ status: 'persistence-failed', changed: false });
    expect(apply).not.toHaveBeenCalled();
    expect(hooks.fail).toHaveBeenCalledTimes(1);
    expect(hooks.conflict).not.toHaveBeenCalled();
  });

  it('permite nova tentativa depois de falha comum', async () => {
    const apply = vi.fn();
    const result = await executeContinuousReceivedConfirmedPersistence(
      'failed',
      'guardar cópia',
      () => ({ changed: true, registry: registry(t1), message: 'Cópia guardada.' }),
      confirmedWrite,
      apply,
      lifecycle()
    );
    expect(result.executed).toBe(true);
    if (!result.executed) return;
    expect(result.persistence).toBe('confirmed');
    expect(apply).toHaveBeenCalledTimes(1);
  });
});
