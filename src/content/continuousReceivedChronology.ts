import type { BiblicalUnit, ContentRestriction } from '../domain/types';

export const continuousReceivedChronologyBiblicalUnit: BiblicalUnit = {
  id: 'proverb_continuous_received_chronology_v1',
  reference: 'Eclesiastes 3:11',
  title: 'O tempo local não apaga o passo anterior',
  principle: 'Cada ação local preserva a sequência já registrada, sem fingir que aconteceu antes.',
  context: 'A ordem temporal protege o sentido das ações sem transformar relógios externos em prova de verdade.',
  themes: ['tempo', 'sequência', 'memória local', 'recusa explícita', 'integridade'],
  application: 'Validar instantes UTC canônicos e impedir que inserções ou mutações locais façam o registro andar para trás.',
  provenance: [{
    id: 'provenance_continuous_received_chronology_v1',
    label: 'Referência bíblica explícita',
    class: 'BIB',
    explanation: 'Eclesiastes 3:11 sustenta a atenção ao tempo sem prometer domínio sobre sua totalidade.',
    sourceLabel: 'Eclesiastes 3:11'
  }]
};

export const continuousReceivedChronologyPolicy = {
  id: 'continuous-received-chronology-policy',
  version: '1.0.0',
  policy: 'canonical-local-time-never-regresses-v1',
  canonicalPattern: 'YYYY-MM-DDTHH:mm:ss.sssZ',
  equalInstantsAllowed: true,
  compareExternalPackageClock: false,
  autoCorrectTime: false,
  maxReportedIssues: 20
} as const;

export const continuousReceivedChronologyRestrictions: ContentRestriction[] = [
  'createdAt, receivedAt, updatedAt e archivedAt precisam usar UTC canônico com milissegundos.',
  'updatedAt do registro nunca pode anteceder createdAt.',
  'receivedAt nunca pode anteceder a criação da biblioteca local.',
  'updatedAt de uma cópia nunca pode anteceder receivedAt.',
  'updatedAt da biblioteca precisa ser igual ou posterior ao estado de todas as cópias.',
  'Cópia ativa não pode manter archivedAt.',
  'Cópia arquivada precisa manter archivedAt igual ao próprio updatedAt.',
  'Inserção local precisa ocorrer em instante igual ou posterior ao updatedAt da biblioteca.',
  'Arquivamento, reativação e remoção precisam ocorrer em instante igual ou posterior ao último estado local.',
  'Instantes iguais são permitidos para operações determinísticas no mesmo marco temporal.',
  'O relógio declarado dentro do pacote compartilhado não é comparado ao relógio local de recebimento.',
  'Nenhum horário é arredondado, convertido, substituído ou promovido automaticamente.',
  'Registro legado cronologicamente incoerente permanece intacto e bloqueia novas mutações até decisão explícita.',
  'A recusa não cria histórico, telemetria, analytics ou sincronização.',
  'A cronologia local não comprova autoria, identidade, verdade do evento ou correção do relógio do dispositivo.'
];
