import type { ProvenanceClass } from '../domain/types';

const labels: Record<ProvenanceClass, string> = {
  BIB: 'Bíblia', SRC: 'Fonte', TRD: 'Tradição', HIS: 'Histórico', HER: 'Hermético', CMP: 'Comparação', ATH: 'Athanor', USR: 'Pessoal'
};

export function ProvenanceBadge({ type }: { type: ProvenanceClass }) {
  return <span className={`provenance provenance--${type.toLowerCase()}`}>{labels[type]}</span>;
}
