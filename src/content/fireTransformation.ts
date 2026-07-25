import type { BiblicalUnit, SymbolicNode } from '../domain/types';
import type {
  FireTransformationAction,
  FireTransformationDecision,
  FireTransformationObject,
  FireTransformationReview,
  FireTransformationSafeguard,
  FireTransformationStatementCategory
} from '../domain/fireTransformation';

export interface FireTransformationStatement {
  id: string;
  text: string;
  suggestedCategory: FireTransformationStatementCategory;
  explanation: string;
}

export const fireTransformationBiblicalUnit: BiblicalUnit = {
  id: 'proverb_transform_with_wisdom_v1',
  reference: 'Provérbios 24:3–4',
  title: 'Observar a forma antes de alterá-la',
  principle: 'Transformação responsável considera finalidade, recursos, consequências e possibilidade de revisão antes de modificar uma forma.',
  context: 'O texto trata da construção orientada por sabedoria e entendimento. No Athanor, essa referência não autoriza decisões pessoais irreversíveis, abandono de tratamento, ruptura de vínculos ou mudanças financeiras de alto risco.',
  themes: ['transformação', 'sabedoria', 'forma', 'revisão'],
  application: 'Distinguir preservar, reparar, transformar, encerrar e arquivar usando somente objetos e situações fictícias.',
  provenance: [{
    id: 'prov-fire-transformation-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia a missão; os destinos, salvaguardas e o Metal Transformado são adaptações editoriais e de gameplay do Athanor.',
    sourceLabel: 'Provérbios 24:3–4'
  }]
};

export const fireTransformationStatements: FireTransformationStatement[] = [
  { id: 'preserve-1', text: 'Uma peça íntegra ainda cumpre sua função e será mantida como referência.', suggestedCategory: 'preserve', explanation: 'Preservar mantém uma forma que continua útil sem exigir alteração.' },
  { id: 'repair-1', text: 'Uma dobradiça removível quebrou, mas o restante do objeto permanece funcional.', suggestedCategory: 'repair', explanation: 'Reparar corrige uma parte limitada sem reconstruir todo o objeto.' },
  { id: 'transform-1', text: 'Uma caixa sem uso pode receber uma etiqueta removível e servir como organizador.', suggestedCategory: 'transform', explanation: 'Transformar atribui uma nova função com intervenção pequena e reversível.' },
  { id: 'close-1', text: 'Um modelo de teste já entregou a informação necessária e pode ter o ciclo documentado.', suggestedCategory: 'close', explanation: 'Encerrar reconhece que a função do ciclo foi cumprida.' },
  { id: 'archive-1', text: 'Uma versão antiga precisa permanecer disponível para comparação histórica.', suggestedCategory: 'archive', explanation: 'Arquivar retira do uso ativo sem apagar a referência.' },
  { id: 'preserve-2', text: 'Um mapa antigo está estável e será guardado sem restauração estética.', suggestedCategory: 'preserve', explanation: 'A integridade e a função de memória justificam não intervir.' },
  { id: 'repair-2', text: 'O cabo substituível de uma ferramenta fictícia está gasto.', suggestedCategory: 'repair', explanation: 'A troca de um componente destacável é uma reparação limitada.' },
  { id: 'transform-2', text: 'Uma luminária cenográfica pode receber uma capa removível para outra exposição.', suggestedCategory: 'transform', explanation: 'A mudança cria uso novo sem destruir a forma anterior.' },
  { id: 'close-2', text: 'Um experimento fictício foi concluído e não precisa permanecer em execução.', suggestedCategory: 'close', explanation: 'Documentar e finalizar evita manter um ciclo sem função.' },
  { id: 'archive-2', text: 'Uma caixa duplicada de documentos cenográficos será movida para o arquivo.', suggestedCategory: 'archive', explanation: 'O conteúdo permanece acessível, mas deixa o espaço ativo.' }
];

export const fireTransformationObjectOptions: Array<{ id: FireTransformationObject; label: string; description: string }> = [
  { id: 'cracked_lantern', label: 'Luminária cenográfica', description: 'Objeto fictício com uma peça removível danificada.' },
  { id: 'outdated_map', label: 'Mapa de oficina', description: 'Versão antiga que pode ser preservada, copiada ou arquivada.' },
  { id: 'worn_tool', label: 'Ferramenta de treinamento', description: 'Objeto fictício com componente substituível.' },
  { id: 'unfinished_model', label: 'Modelo de teste', description: 'Protótipo fictício que pode ser concluído, documentado ou mantido.' },
  { id: 'duplicate_box', label: 'Caixa duplicada', description: 'Material cenográfico sem uso ativo imediato.' }
];

export const fireTransformationDecisionOptions: Array<{ id: FireTransformationDecision; label: string; description: string }> = [
  { id: 'preserve', label: 'Preservar', description: 'Manter a forma atual porque ela ainda possui função.' },
  { id: 'repair', label: 'Reparar', description: 'Corrigir uma parte limitada e substituível.' },
  { id: 'transform', label: 'Transformar', description: 'Criar uma nova função com intervenção reversível.' },
  { id: 'close', label: 'Encerrar', description: 'Documentar que o ciclo cumpriu sua finalidade.' },
  { id: 'archive', label: 'Arquivar', description: 'Retirar do uso ativo sem apagar a referência.' }
];

export const fireTransformationActionOptions: Array<{ id: FireTransformationAction; label: string; description: string }> = [
  { id: 'inspect_without_changing', label: 'Inspecionar sem alterar', description: 'Observar a forma e registrar o estado antes de decidir.' },
  { id: 'replace_removable_part', label: 'Substituir uma peça removível', description: 'Reparar somente um componente destacável do objeto fictício.' },
  { id: 'create_copy_before_change', label: 'Criar uma cópia antes da mudança', description: 'Preservar uma versão de referência antes de qualquer intervenção.' },
  { id: 'relabel_for_new_use', label: 'Aplicar uma etiqueta removível', description: 'Indicar uma nova função sem alterar permanentemente o objeto.' },
  { id: 'document_and_close', label: 'Documentar e encerrar', description: 'Registrar o resultado e finalizar o ciclo fictício.' },
  { id: 'move_to_archive', label: 'Mover para o arquivo', description: 'Retirar do uso ativo mantendo acesso futuro.' },
  { id: 'no_change_now', label: 'Nenhuma mudança agora', description: 'Concluir a prática sem alterar o objeto fictício.' }
];

export const fireTransformationSafeguardOptions: Array<{ id: FireTransformationSafeguard; label: string; description: string }> = [
  { id: 'fictional_object_only', label: 'Apenas objeto fictício', description: 'Confirmo que a escolha se limita ao cenário de oficina apresentado.' },
  { id: 'need_more_context', label: 'Ainda preciso de contexto', description: 'Somente observar, copiar ou não alterar até haver mais informação.' },
  { id: 'no_change_now', label: 'Não farei mudança agora', description: 'A prática termina sem intervenção no objeto.' }
];

export const fireTransformationReviewOptions: Array<{ id: FireTransformationReview; label: string; description: string }> = [
  { id: 'after_one_step', label: 'Revisar após um passo', description: 'Observar o resultado depois da primeira intervenção pequena.' },
  { id: 'review_in_3d', label: 'Revisar em três dias', description: 'Criar uma janela curta de observação sem obrigação.' },
  { id: 'review_when_context_changes', label: 'Revisar quando o contexto mudar', description: 'Retomar somente quando houver nova informação.' },
  { id: 'no_scheduled_review', label: 'Sem revisão agendada', description: 'Registrar a prática sem criar compromisso de retorno.' }
];

export const fireTransformationNodes: SymbolicNode[] = [
  {
    id: 'tiferet_transformation_v1', name: 'Tiferet', category: 'sefirah', layer: 'kabbalah', fallbackNodeId: 'transformation_workshop_v1',
    description: 'Camada opcional de integração, proporção e relação entre partes.',
    provenance: { id: 'prov-tiferet-transformation-v1', label: 'Comparação temática', class: 'CMP', explanation: 'Comparação do Athanor; não é conteúdo de Provérbios.' }
  },
  {
    id: 'transformation_workshop_v1', name: 'Oficina da Transformação', category: 'athanor',
    description: 'Fallback autoral para comparar destinos e intervenções reversíveis.',
    provenance: { id: 'prov-transformation-workshop-v1', label: 'Síntese Athanor', class: 'ATH', explanation: 'Estrutura de gameplay criada pela Tehkné Solutions.' }
  },
  {
    id: 'li_transformation_v1', name: 'Li · Fogo', category: 'trigram', layer: 'iching', fallbackNodeId: 'refusion_movement_v1',
    description: 'Comparação opcional com clareza de forma e transformação limitada.',
    provenance: { id: 'prov-li-transformation-v1', label: 'Comparação temática', class: 'CMP', explanation: 'O uso é comparativo e não possui função de previsão.' }
  },
  {
    id: 'refusion_movement_v1', name: 'Movimento da Refusão', category: 'athanor',
    description: 'Fallback autoral para mudar apenas o necessário e preservar referência.',
    provenance: { id: 'prov-refusion-movement-v1', label: 'Síntese Athanor', class: 'ATH', explanation: 'Movimento criado para o gameplay.' }
  },
  {
    id: 'temperance_transformation_v1', name: 'A Temperança', category: 'archetype', layer: 'tarot', fallbackNodeId: 'renewed_form_artisan_v1',
    description: 'Arquétipo opcional de combinação, proporção e revisão.',
    provenance: { id: 'prov-temperance-transformation-v1', label: 'Comparação arquetípica', class: 'CMP', explanation: 'A carta não define identidade, destino ou decisão.' }
  },
  {
    id: 'renewed_form_artisan_v1', name: 'Artesã da Forma Renovada', category: 'athanor',
    description: 'Fallback autoral para preservar, reparar, transformar, encerrar ou arquivar.',
    provenance: { id: 'prov-renewed-form-v1', label: 'Síntese Athanor', class: 'ATH', explanation: 'Arquétipo autoral do Athanor.' }
  },
  {
    id: 'transformed_metal_v1', name: 'Metal Transformado', category: 'athanor',
    description: 'Componente que registra uma decisão fictícia, uma intervenção limitada e uma revisão.',
    provenance: { id: 'prov-transformed-metal-v1', label: 'Componente Athanor', class: 'ATH', explanation: 'Não representa decisão pessoal, ruptura, cura ou transformação real garantida.' }
  }
];
