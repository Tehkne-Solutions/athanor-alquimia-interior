import { continuousReceivedFingerprintIntegrityPolicy } from '../content/continuousReceivedFingerprintIntegrity';
import {
  fingerprintContinuousSharePackage,
  isCanonicalContinuousFingerprint
} from './continuousFingerprintEquivalence';
import type { ContinuousReceivedRegistry } from './continuousReceive';

export interface ContinuousReceivedFingerprintIntegritySuccess {
  ok: true;
  checkedRecords: number;
  message: string;
}

export interface ContinuousReceivedFingerprintIntegrityFailure {
  ok: false;
  checkedRecords: number;
  errors: string[];
}

export type ContinuousReceivedFingerprintIntegrityResult =
  | ContinuousReceivedFingerprintIntegritySuccess
  | ContinuousReceivedFingerprintIntegrityFailure;

function push(errors: string[], message: string): void {
  if (errors.length < continuousReceivedFingerprintIntegrityPolicy.maxReportedIssues) errors.push(message);
}

export function validateContinuousReceivedFingerprintIntegrity(
  registry: ContinuousReceivedRegistry
): ContinuousReceivedFingerprintIntegrityResult {
  const errors: string[] = [];
  let checkedRecords = 0;

  registry.records.forEach((record, index) => {
    const path = `$.records[${index}].fingerprint`;
    if (!isCanonicalContinuousFingerprint(record.fingerprint)) {
      push(errors, `${path}: impressão armazenada fora do formato received-xxxxxxxx.`);
      return;
    }

    try {
      const expected = fingerprintContinuousSharePackage(record.package);
      checkedRecords += 1;
      if (record.fingerprint !== expected) {
        push(errors, `${path}: impressão armazenada não corresponde ao pacote pelo escopo histórico da biblioteca.`);
      }
    } catch {
      push(errors, `${path}: o pacote não pôde ser medido de forma determinística; nenhuma impressão foi reparada.`);
    }
  });

  return errors.length > 0
    ? { ok: false, checkedRecords, errors }
    : {
      ok: true,
      checkedRecords,
      message: 'As impressões armazenadas correspondem ao escopo histórico dos próprios pacotes.'
    };
}
