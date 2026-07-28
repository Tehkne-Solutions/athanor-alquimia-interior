import type { ContinuousCollectionShareExport } from './continuousShare';
import type { ContinuousReceivedCollection, ContinuousReceivedRegistry } from './continuousReceive';

export function cloneContinuousReceivedPackage(
  packageValue: ContinuousCollectionShareExport
): ContinuousCollectionShareExport {
  return {
    ...packageValue,
    provenance: { ...packageValue.provenance },
    collection: { ...packageValue.collection },
    options: { ...packageValue.options },
    items: packageValue.items.map((item) => ({
      ...item,
      passageSummary: { ...item.passageSummary }
    })),
    notices: [...packageValue.notices],
    ...(packageValue.consistency !== undefined
      ? { consistency: { ...packageValue.consistency } }
      : {})
  };
}

export function cloneContinuousReceivedRecord(
  record: ContinuousReceivedCollection
): ContinuousReceivedCollection {
  return {
    ...record,
    package: cloneContinuousReceivedPackage(record.package)
  };
}

export function cloneContinuousReceivedRegistry(
  registry: ContinuousReceivedRegistry
): ContinuousReceivedRegistry {
  return {
    ...registry,
    records: registry.records.map(cloneContinuousReceivedRecord)
  };
}
