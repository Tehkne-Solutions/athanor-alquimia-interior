import type { BiblicalUnit } from '../domain/types';

export const continuousConsistencyBiblicalUnit: BiblicalUnit = {
  id: 'proverb_continuous_consistency_v1',
  reference: 'Provérbios 14:15',
  title: 'Conferir um passo não é conhecer toda a origem',
  principle: 'A prudência pode verificar se um arquivo mudou sem afirmar quem o criou, quem o enviou ou se sua história é verdadeira.',
  context: 'Provérbios contrapõe credulidade e atenção aos passos. O Athanor aplica essa imagem a uma conferência técnica limitada: um selo local detecta mudanças no conteúdo, mas não autentica identidade, intenção, autoria humana ou segurança criptográfica.',
  themes: ['prudência', 'conferência', 'limite', 'consistência', 'verdade'],
  application: 'Gerar e verificar um selo determinístico sobre arquivos locais de partilha e resposta, mantendo explícitos seus limites.',
  provenance: [{
    id: 'prov-continuous-consistency-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia a reflexão; canonicalização, checksum e regras de compatibilidade são estruturas autorais do Athanor.',
    sourceLabel: 'Provérbios 14:15'
  }]
};

export const continuousConsistencyCatalog = {
  id: 'continuous-consistency-catalog',
  version: '1.0.0',
  algorithm: 'fnv1a-32',
  scope: 'top-level-without-consistency',
  mode: 'deterministic-local-checksum',
  cryptographic: false,
  authenticatesIdentity: false,
  legacyAccepted: true,
  invalidSealAccepted: false
} as const;

export const continuousConsistencyRestrictions = [
  'O selo detecta alterações de conteúdo, mas não prova identidade',
  'O selo não é assinatura digital nem mecanismo criptográfico',
  'O selo não confirma autoria humana, intenção ou veracidade narrativa',
  'Nenhuma chave, conta, contato ou certificado é criado',
  'Arquivos antigos sem selo continuam aceitos com aviso explícito',
  'Arquivos com selo inválido são recusados sem reparo automático',
  'A canonicalização ordena chaves, mas preserva a ordem das listas',
  'O campo de consistência é excluído do próprio cálculo',
  'A verificação acontece somente no dispositivo',
  'Nenhum resultado de verificação é enviado ou persistido',
  'Pacotes sanitizados recebem um novo selo local coerente com a cópia guardada',
  'Verificação válida não transforma o conteúdo em progresso, mérito ou recomendação'
];
