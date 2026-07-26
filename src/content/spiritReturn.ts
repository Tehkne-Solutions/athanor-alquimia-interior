import type { BiblicalUnit, SymbolicNode } from '../domain/types';
import type {
  SpiritReturnCategory,
  SpiritReturnContext,
  SpiritReturnDisposition,
  SpiritReturnObservation,
  SpiritReturnResources,
  SpiritReturnReviewBasis
} from '../domain/spiritReturn';

export interface SpiritReturnEntry {
  id: string;
  text: string;
  suggestedCategory: SpiritReturnCategory;
  explanation: string;
}

export interface SpiritReturnScenario {
  id: string;
  title: string;
  decision: string;
  observed: string;
  context: string;
  resources: string;
}

export const spiritReturnBiblicalUnit: BiblicalUnit = {
  id: 'proverb_return_without_condemnation_01',
  reference: 'Provérbios 4:26',
  title: 'Rever o caminho sem condenar o passo anterior',
  principle: 'Ponderar o caminho inclui observar o que ocorreu, reconhecer mudanças e ajustar a direção sem transformar revisão em punição.',
  context: 'O provérbio convida à atenção sobre a vereda. O Athanor usa esse princípio editorial em cenários fictícios e reversíveis; não oferece julgamento espiritual, previsão ou obrigação de continuidade.',
  themes: ['caminho', 'revisão', 'observação', 'mudança', 'retorno'],
  application: 'Comparar decisão e observação fictícias, preservando desconhecimento e permitindo manter, reduzir, refazer, arquivar ou não retomar.',
  provenance: [{
    id: 'spirit_proverb_4_26_bib',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'Referência bíblica que inicia a missão. Cenários, opções e a Chave são adaptações editoriais e de gameplay.',
    sourceLabel: 'Provérbios 4:26'
  }]
};

export const spiritReturnEntries: SpiritReturnEntry[] = [
  { id: 'return-entry-01', text: 'O grupo compara o passo escolhido com o que conseguiu observar.', suggestedCategory: 'review', explanation: 'Reúne escolha e observação sem atribuir culpa.' },
  { id: 'return-entry-02', text: 'A peça ficou diferente, então alguém deve pagar pelo erro.', suggestedCategory: 'punishment', explanation: 'Transforma resultado em culpa e sanção.' },
  { id: 'return-entry-03', text: 'A instrução estava incompleta; a maquete pode ser ajustada antes de outro teste.', suggestedCategory: 'correction', explanation: 'Corrige uma condição específica e verificável.' },
  { id: 'return-entry-04', text: 'Repitam exatamente o mesmo movimento, mesmo sem recurso disponível.', suggestedCategory: 'repetition', explanation: 'Exige repetição sem considerar contexto ou recurso.' },
  { id: 'return-entry-05', text: 'O resultado ainda é desconhecido e pode permanecer assim nesta rodada.', suggestedCategory: 'review', explanation: 'Preserva desconhecimento como dado válido.' },
  { id: 'return-entry-06', text: 'A marcação saiu torta; vamos reposicionar apenas a régua.', suggestedCategory: 'correction', explanation: 'Ajusta uma parte pequena e reversível.' },
  { id: 'return-entry-07', text: 'Como funcionou uma vez, deve ser repetido para sempre.', suggestedCategory: 'repetition', explanation: 'Converte um evento em obrigação de continuidade.' },
  { id: 'return-entry-08', text: 'Quem interrompeu o ensaio precisa compensar dobrando o próximo ciclo.', suggestedCategory: 'punishment', explanation: 'Usa cobrança e compensação como sanção.' }
];

export const spiritReturnScenarios: SpiritReturnScenario[] = [
  {
    id: 'return-scenario-01',
    title: 'A ponte testada uma vez',
    decision: 'Testar apenas uma tábua removível.',
    observed: 'A tábua sustentou a miniatura, mas outra parte da maquete se deslocou.',
    context: 'A base foi reposicionada depois do teste.',
    resources: 'Há menos peças de apoio disponíveis.'
  },
  {
    id: 'return-scenario-02',
    title: 'O mapa com marca parcial',
    decision: 'Marcar somente o ponto atual e esperar informação.',
    observed: 'A marca foi feita, mas a nova informação ainda não chegou.',
    context: 'O tabuleiro continua estável.',
    resources: 'Tempo disponível reduzido.'
  },
  {
    id: 'return-scenario-03',
    title: 'A cópia antes da alteração',
    decision: 'Criar uma cópia antes de mover uma peça.',
    observed: 'A cópia existe, mas o resultado da alteração não foi observado.',
    context: 'A oficina mudou de posição.',
    resources: 'A ferramenta principal está indisponível.'
  },
  {
    id: 'return-scenario-04',
    title: 'O ensaio que terminou cedo',
    decision: 'Pausar depois de um trecho curto.',
    observed: 'O trecho foi registrado parcialmente e o restante não foi retomado.',
    context: 'O grupo fictício decidiu encerrar o encontro.',
    resources: 'Não há outra janela disponível nesta cena.'
  }
];

export const spiritReturnObservationOptions: { id: SpiritReturnObservation; label: string; description: string }[] = [
  { id: 'as_expected', label: 'Como esperado', description: 'A observação fictícia corresponde ao que foi previsto para o passo.' },
  { id: 'partial', label: 'Parcial', description: 'Somente parte do resultado pôde ser observada.' },
  { id: 'different', label: 'Diferente', description: 'O resultado observado difere do esperado sem virar culpa.' },
  { id: 'not_observed', label: 'Não foi observado', description: 'O passo não gerou observação disponível.' },
  { id: 'unknown', label: 'Resultado desconhecido', description: 'Nenhuma conclusão é inventada.' }
];

export const spiritReturnContextOptions: { id: SpiritReturnContext; label: string; description: string }[] = [
  { id: 'unchanged', label: 'Contexto semelhante', description: 'Não foi identificada mudança relevante no cenário.' },
  { id: 'changed', label: 'Contexto mudou', description: 'Uma condição observável ficou diferente.' },
  { id: 'insufficient_information', label: 'Informação insuficiente', description: 'Faltam elementos para comparar o contexto.' },
  { id: 'unknown', label: 'Contexto desconhecido', description: 'O estado do contexto permanece sem interpretação.' }
];

export const spiritReturnResourceOptions: { id: SpiritReturnResources; label: string; description: string }[] = [
  { id: 'available', label: 'Recursos disponíveis', description: 'Os recursos fictícios continuam acessíveis.' },
  { id: 'reduced', label: 'Recursos reduzidos', description: 'A disponibilidade ficou menor e pode pedir redução.' },
  { id: 'unavailable', label: 'Recursos indisponíveis', description: 'Refazer ou manter imediatamente fica bloqueado.' },
  { id: 'unknown', label: 'Recursos desconhecidos', description: 'Nenhuma disponibilidade é presumida.' }
];

export const spiritReturnBasisOptions: { id: SpiritReturnReviewBasis; label: string; description: string }[] = [
  { id: 'observed_result', label: 'Resultado observado', description: 'A revisão parte do que foi efetivamente visto.' },
  { id: 'context_change', label: 'Mudança de contexto', description: 'A revisão considera uma condição que se alterou.' },
  { id: 'resource_change', label: 'Mudança de recurso', description: 'A disponibilidade fictícia orienta o ajuste.' },
  { id: 'unknown', label: 'Base desconhecida', description: 'A missão preserva incerteza sem inventar motivo.' },
  { id: 'none', label: 'Nenhuma base agora', description: 'Disponível para arquivar ou não retomar.' }
];

export const spiritReturnDispositionOptions: { id: SpiritReturnDisposition; label: string; description: string }[] = [
  { id: 'maintain', label: 'Manter', description: 'Preservar a decisão fictícia sem prometer continuidade.' },
  { id: 'reduce', label: 'Reduzir', description: 'Diminuir escopo, duração ou número de partes.' },
  { id: 'redo', label: 'Refazer uma vez', description: 'Novo teste pequeno, somente com observação e recurso disponíveis.' },
  { id: 'archive', label: 'Arquivar', description: 'Guardar o registro sem obrigação de retorno.' },
  { id: 'no_return', label: 'Não retomar', description: 'Encerrar esta decisão fictícia sem punição.' }
];

export const spiritReturnNodes: SymbolicNode[] = [
  {
    id: 'spirit_possible_return_v1',
    name: 'Retorno Possível',
    category: 'principle',
    description: 'Princípio autoral para rever, ajustar, arquivar ou não retomar sem cobrança de consistência.',
    provenance: { id: 'spirit_possible_return_ath', label: 'Síntese Athanor', class: 'ATH', explanation: 'Estrutura didática criada pela Tehkné Solutions.' }
  },
  {
    id: 'spirit_yesod_record_v1',
    name: 'Yesod · Registro e Continuidade',
    category: 'sefirah',
    description: 'Comparação opcional com registro e ligação entre momentos, sem medir estabilidade espiritual.',
    layer: 'kabbalah',
    fallbackNodeId: 'spirit_observation_archive_v1',
    provenance: { id: 'spirit_yesod_record_cmp', label: 'Comparação temática', class: 'CMP', explanation: 'Yesod é usado como arquitetura comparativa de registro, não como conteúdo bíblico.' }
  },
  {
    id: 'spirit_observation_archive_v1',
    name: 'Arquivo da Observação',
    category: 'athanor',
    description: 'Fallback autoral para preservar o que foi observado ou permaneceu desconhecido.',
    provenance: { id: 'spirit_observation_archive_ath', label: 'Fallback Athanor', class: 'ATH', explanation: 'Usado quando Cabala está desativada.' }
  },
  {
    id: 'spirit_ruach_revisit_v1',
    name: 'Ruach · Movimento de Revisita',
    category: 'element',
    description: 'Comparação opcional com revisita e deslocamento de atenção, sem leitura de identidade espiritual.',
    layer: 'sefer',
    fallbackNodeId: 'spirit_return_motion_v1',
    provenance: { id: 'spirit_ruach_revisit_cmp', label: 'Comparação textual', class: 'CMP', explanation: 'Uso comparativo para retorno narrativo, separado da fonte bíblica.' }
  },
  {
    id: 'spirit_return_motion_v1',
    name: 'Movimento do Retorno',
    category: 'athanor',
    description: 'Fallback autoral para voltar ao registro sem obrigação de repetir.',
    provenance: { id: 'spirit_return_motion_ath', label: 'Fallback Athanor', class: 'ATH', explanation: 'Usado quando Sefer está desativado.' }
  },
  {
    id: 'spirit_kan_return_v1',
    name: 'Kan · Água',
    category: 'trigram',
    description: 'Comparação opcional com atravessar incerteza mantendo atenção, sem consulta oracular.',
    layer: 'iching',
    fallbackNodeId: 'spirit_revision_path_v1',
    provenance: { id: 'spirit_kan_return_cmp', label: 'Comparação temática', class: 'CMP', explanation: 'Kan funciona como imagem narrativa de percurso incerto, sem previsão.' }
  },
  {
    id: 'spirit_revision_path_v1',
    name: 'Caminho da Revisão',
    category: 'athanor',
    description: 'Fallback autoral para comparar escolha, observação, contexto e recursos.',
    provenance: { id: 'spirit_revision_path_ath', label: 'Fallback Athanor', class: 'ATH', explanation: 'Usado quando I Ching está desativado.' }
  },
  {
    id: 'spirit_hermit_return_v1',
    name: 'O Eremita',
    category: 'archetype',
    description: 'Arquétipo opcional de observação e revisão sem condenação, isolamento obrigatório ou leitura de destino.',
    layer: 'tarot',
    fallbackNodeId: 'spirit_keeper_return_v1',
    provenance: { id: 'spirit_hermit_return_cmp', label: 'Comparação arquetípica', class: 'CMP', explanation: 'Usado como postura narrativa de revisão, sem função divinatória.' }
  },
  {
    id: 'spirit_keeper_return_v1',
    name: 'Guardiã do Retorno',
    category: 'athanor',
    description: 'Fallback autoral para manter aberta a possibilidade de voltar ou não voltar.',
    provenance: { id: 'spirit_keeper_return_ath', label: 'Fallback Athanor', class: 'ATH', explanation: 'Usado quando Tarot está desativado.' }
  },
  {
    id: 'spirit_possible_return_key_v1',
    name: 'Chave do Retorno Possível',
    category: 'athanor',
    description: 'Componente autoral que registra revisão, ajuste, arquivo, não retomada ou recusa sem atribuir valor pessoal.',
    provenance: { id: 'spirit_possible_return_key_ath', label: 'Componente Athanor', class: 'ATH', explanation: 'Item de gameplay criado pela Tehkné Solutions.' }
  }
];
