import type { StateStorage } from 'zustand/middleware';

const DB_NAME = 'athanor-db';
const STORE_NAME = 'app-state';
const DB_VERSION = 1;

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
