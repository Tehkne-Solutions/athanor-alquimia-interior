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
    clear: vi.fn()
  };
}

describe('commit confirmado da biblioteca recebida', () => {
  it('não chama a ação nem a escrita durante outra gravação', async () => {
    const action = vi.fn(() => ({ changed: true, registry: registry(t1), message: 'Alterado.' }));
    const write = vi.fn(async () => undefined);
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

  it('não inicia transação quando o domínio não mudou', async () => {
    const current = registry();
    const action = vi.fn(() => ({ changed: false, registry: current, message: 'Sem mudança.' }));
    const write = vi.fn(async () => undefined);
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
      clear: vi.fn(() => events.push('clear'))
    };
    const write = vi.fn(async () => { events.push('write'); });
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
  });

  it('aguarda uma escrita pendente antes de aplicar', async () => {
    let release!: () => void;
    const pending = new Promise<void>((resolve) => { release = resolve; });
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
    expect(hooks.confirm).not.toHaveBeenCalled();
  });

  it('permite nova tentativa depois de um estado failed', async () => {
    const apply = vi.fn();
    const result = await executeContinuousReceivedConfirmedPersistence(
      'failed',
      'guardar cópia',
      () => ({ changed: true, registry: registry(t1), message: 'Cópia guardada.' }),
      async () => undefined,
      apply,
      lifecycle()
    );
    expect(result.executed).toBe(true);
    if (!result.executed) return;
    expect(result.persistence).toBe('confirmed');
    expect(apply).toHaveBeenCalledTimes(1);
  });
});
