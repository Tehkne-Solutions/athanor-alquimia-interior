import type { StateStorage } from 'zustand/middleware';

const DB_NAME = 'athanor-db';
const STORE_NAME = 'app-state';
const DB_VERSION = 1;

export type IdbCompareAndSetResult =
  | { status: 'written' }
  | { status: 'conflict' };

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Falha ao abrir o banco local.'));
  });
}

async function withStore<T>(mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const request = operation(transaction.objectStore(STORE_NAME));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Falha ao acessar o armazenamento local.'));
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => reject(transaction.error ?? new Error('Falha na transação local.'));
  });
}

export function matchesIdbExpectedValue(currentValue: unknown, expectedValue: string | null): boolean {
  const normalized = currentValue === undefined ? null : currentValue;
  if (normalized !== null && typeof normalized !== 'string') return false;
  return normalized === expectedValue;
}

export async function compareAndSetIdbState(
  name: string,
  expectedValue: string | null,
  nextValue: string
): Promise<IdbCompareAndSetResult> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    let outcome: IdbCompareAndSetResult | undefined;
    let failure: unknown;
    let settled = false;

    const closeAndResolve = (value: IdbCompareAndSetResult) => {
      if (settled) return;
      settled = true;
      db.close();
      resolve(value);
    };
    const closeAndReject = (error: unknown) => {
      if (settled) return;
      settled = true;
      db.close();
      reject(error);
    };

    const readRequest = store.get(name);
    readRequest.onsuccess = () => {
      if (!matchesIdbExpectedValue(readRequest.result, expectedValue)) {
        outcome = { status: 'conflict' };
        return;
      }

      const writeRequest = store.put(nextValue, name);
      writeRequest.onsuccess = () => {
        outcome = { status: 'written' };
      };
      writeRequest.onerror = () => {
        failure = writeRequest.error ?? new Error('Falha ao gravar o estado local.');
      };
    };
    readRequest.onerror = () => {
      failure = readRequest.error ?? new Error('Falha ao conferir o estado local.');
    };

    transaction.oncomplete = () => {
      if (outcome) closeAndResolve(outcome);
      else closeAndReject(failure ?? new Error('A transação local terminou sem resultado.'));
    };
    transaction.onerror = () => {
      failure = failure ?? transaction.error ?? new Error('Falha na transação local.');
    };
    transaction.onabort = () => {
      closeAndReject(failure ?? transaction.error ?? new Error('A transação local foi interrompida.'));
    };
  });
}

export const idbStateStorage: StateStorage = {
  getItem: async (name) => {
    const value = await withStore<string | undefined>('readonly', (store) => store.get(name));
    return value ?? null;
  },
  setItem: async (name, value) => {
    await withStore<IDBValidKey>('readwrite', (store) => store.put(value, name));
  },
  removeItem: async (name) => {
    await withStore<undefined>('readwrite', (store) => store.delete(name));
  }
};
