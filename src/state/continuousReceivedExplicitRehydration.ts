import type { ContinuousReceivedRegistry } from '../domain/continuousReceive';
import type { ContinuousReceivedPersistenceRuntimeStatus } from './useContinuousReceivedPersistenceRuntimeStore';
import {
  hydrateContinuousReceivedPersistedState,
  type ContinuousReceivedHydrationResult
} from './continuousReceivedHydration';
import {
  CONTINUOUS_RECEIVED_PERSIST_VERSION,
  CONTINUOUS_RECEIVED_SCHEMA_VERSION
} from './continuousReceivedPersistenceStorage';

export type ContinuousReceivedExplicitRehydrationStatus =
  | 'accepted'
  | 'empty'
  | 'rejected'
  | 'unavailable'
  | 'writing'
  | 'not-conflicted';

export interface ContinuousReceivedExplicitRehydrationResult {
  executed: boolean;
  adopted: boolean;
  status: ContinuousReceivedExplicitRehydrationStatus;
  message: string;
  issues: string[];
}

export interface ContinuousReceivedExplicitRehydrationLifecycle {
  begin: () => void;
  accept: (result: ContinuousReceivedHydrationResult) => void;
  fail: (error: unknown) => void;
  adoptPersistedValue: (value: string | null) => void;
}

interface PersistEnvelope {
  state: unknown;
  version: number;
}

function rejected(
  current: ContinuousReceivedRegistry,
  issue: string
): ContinuousReceivedHydrationResult {
  return {
    schemaVersion: CONTINUOUS_RECEIVED_SCHEMA_VERSION,
    registry: current,
    status: 'rejected',
    message: issue,
    issues: [issue]
  };
}

function decodePersistEnvelope(
  raw: string,
  current: ContinuousReceivedRegistry
): ContinuousReceivedHydrationResult | PersistEnvelope {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return rejected(current, 'A memória atual não contém um envelope JSON persistido interpretável.');
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return rejected(current, 'A memória atual não possui o envelope persistido esperado.');
  }

  const record = parsed as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  if (keys.length !== 2 || keys[0] !== 'state' || keys[1] !== 'version') {
    return rejected(current, 'O envelope persistido atual possui campos ausentes ou desconhecidos.');
  }
  if (record.version !== CONTINUOUS_RECEIVED_PERSIST_VERSION) {
    return rejected(current, 'A versão do envelope persistido atual não é reconhecida para releitura explícita.');
  }

  return { state: record.state, version: record.version as number };
}

export function inspectContinuousReceivedPersistedValueForExplicitRehydration(
  raw: string | null,
  current: ContinuousReceivedRegistry,
  createEmpty: () => ContinuousReceivedRegistry
): ContinuousReceivedHydrationResult {
  if (raw === null) {
    return hydrateContinuousReceivedPersistedState(null, createEmpty());
  }

  const envelope = decodePersistEnvelope(raw, current);
  if ('status' in envelope) return envelope;
  return hydrateContinuousReceivedPersistedState(envelope.state, current);
}

export async function executeContinuousReceivedExplicitRehydration(
  persistenceStatus: ContinuousReceivedPersistenceRuntimeStatus,
  current: ContinuousReceivedRegistry,
  createEmpty: () => ContinuousReceivedRegistry,
  readPersistedValue: () => string | null | Promise<string | null>,
  apply: (registry: ContinuousReceivedRegistry) => void,
  lifecycle: ContinuousReceivedExplicitRehydrationLifecycle
): Promise<ContinuousReceivedExplicitRehydrationResult> {
  if (persistenceStatus === 'writing') {
    return {
      executed: false,
      adopted: false,
      status: 'writing',
      message: 'Uma escrita ainda está em andamento. A releitura não foi iniciada nem enfileirada.',
      issues: []
    };
  }

  if (persistenceStatus !== 'conflict') {
    return {
      executed: false,
      adopted: false,
      status: 'not-conflicted',
      message: 'A releitura de conflito não foi executada porque a sessão não está em conflito de persistência.',
      issues: []
    };
  }

  lifecycle.begin();

  let raw: string | null;
  try {
    raw = await readPersistedValue();
  } catch (error) {
    lifecycle.fail(error);
    return {
      executed: true,
      adopted: false,
      status: 'unavailable',
      message: 'A memória atual não pôde ser relida. O snapshot anterior e o bloqueio de conflito foram preservados.',
      issues: [error instanceof Error ? error.message : 'Falha ao reler a memória persistida.']
    };
  }

  const hydration = inspectContinuousReceivedPersistedValueForExplicitRehydration(
    raw,
    current,
    createEmpty
  );

  if (hydration.status === 'accepted' || hydration.status === 'empty') {
    apply(hydration.registry);
    lifecycle.adoptPersistedValue(raw);
    lifecycle.accept(hydration);
    return {
      executed: true,
      adopted: true,
      status: hydration.status,
      message: hydration.status === 'accepted'
        ? 'A memória mais recente foi relida, validada e adotada. A ação interrompida não foi repetida.'
        : 'A ausência atual da memória foi confirmada e uma biblioteca local nova foi adotada. A ação interrompida não foi repetida.',
      issues: []
    };
  }

  lifecycle.accept(hydration);
  return {
    executed: true,
    adopted: false,
    status: 'rejected',
    message: 'A memória mais recente foi relida, mas não passou pelas barreiras de hidratação. O snapshot anterior e o conflito permanecem.',
    issues: [...hydration.issues]
  };
}
