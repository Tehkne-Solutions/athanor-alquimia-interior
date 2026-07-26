import { AlertTriangle, ArrowRight, BookOpenText, CheckCircle2, Circle, GitBranch, Pause, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { spiritCenterNodes } from '../content/spiritCenter';
import { spiritCouncilNodes } from '../content/spiritCouncil';
import {
  spiritDecisionBiblicalUnit,
  spiritDecisionChoiceOptions,
  spiritDecisionConditionOptions,
  spiritDecisionDimensionLabels,
  spiritDecisionEntries,
  spiritDecisionNodes,
  spiritDecisionPositionOptions,
  spiritDecisionRevisionOptions,
  spiritDecisionScenarios,
  spiritDecisionWindowOptions
} from '../content/spiritDecision';
import { spiritFoundationNodes } from '../content/spiritFoundation';
import { canCompleteSpiritDecision, spiritDecisionDimensions, type SpiritDecisionCategory } from '../domain/spiritDecision';
import type { SymbolicNode } from '../domain/types';
import { useAthanorStore } from '../state/useAthanorStore';
import { useSpiritCouncilStore } from '../state/useSpiritCouncilStore';
import { useSpiritDecisionStore } from '../state/useSpiritDecisionStore';

const categoryLabels: Record<SpiritDecisionCategory, string> = {
  provisional_decision: 'Decisão provisória',
  promise: 'Promessa',
  prediction: 'Previsão',
  obedience: 'Obediência'
};

const allSpiritNodes = [...spiritFoundationNodes, ...spiritCenterNodes, ...spiritCouncilNodes, ...spiritDecisionNodes];
const chainNodeIds = ['spirit_hod_revision_v1', 'spirit_ruach_return_v1', 'spirit_xun_revision_v1', 'spirit_hanged_revision_v1', 'spirit_revisable_decision_mark_v1'];

function resolveNode(node: SymbolicNode, enabledLayers: string[]): SymbolicNode {
  if (!node.layer || enabledLayers.includes(node.layer)) return node;
  return allSpiritNodes.find((candidate) => candidate.id === node.fallbackNodeId) ?? node;
}

export function SpiritDecisionPage() {
  const navigate = useNavigate();
  const enabledLayers = useAthanorStore((state) => state.preferences.enabledLayers);
  const rawCouncil = useSpiritCouncilStore((state) => state.progress);
  const storedProgress = useSpiritDecisionStore((state) => state.progress);
  const start = useSpiritDecisionStore((state) => state.start);
  const classify = useSpiritDecisionStore((state) => state.classify);
  const skipClassification = useSpiritDecisionStore((state) => state.skipClassification);
  const selectScenario = useSpiritDecisionStore((state) => state.selectScenario);
  const setPosition = useSpiritDecisionStore((state) => state.setPosition);
  const setChoice = useSpiritDecisionStore((state) => state.setChoice);
  const setRevision = useSpiritDecisionStore((state) => state.setRevision);
  const setReviewWindow = useSpiritDecisionStore((state) => state.setReviewWindow);
  const setReviewCondition = useSpiritDecisionStore((state) => state.setReviewCondition);
  const declineDecision = useSpiritDecisionStore((state) => state.declineDecision);
  const complete = useSpiritDecisionStore((state) => state.complete);

  const councilCompleted = rawCouncil?.status === 'completed' && rawCouncil.openCouncilSealCreated;
  const sourceCouncilId = councilCompleted && rawCouncil
    ? rawCouncil.completedAt ?? `${rawCouncil.sourceCenterId}:open-council-seal`
    : undefined;
  const progress = sourceCouncilId && storedProgress?.sourceCouncilId === sourceCouncilId ? storedProgress : undefined;

  if (!sourceCouncilId) {
    return <div className="page page--spirit"><PageHeader eyebrow="Capítulo do Espírito · Quarta missão" title="A decisão ainda não pode ser revisada." description="Conclua primeiro O Conselho das Partes na jornada atual."/><Card title="Dependência do Selo" eyebrow="Caminho ainda fechado"><Button onClick={() => navigate('/mission/council-of-parts')}>Voltar ao Conselho</Button></Card></div>;
  }

  if (!progress) {
    return <div className="page page--spirit page--spirit-decision"><PageHeader eyebrow="Capítulo do Espírito · Quarta missão" title="A Decisão que Permanece Aberta" description="Confirme, reduza, altere, retire ou não assuma uma decisão fictícia sem transformá-la em promessa."/><div className="spirit-decision-intro-grid"><Card title={spiritDecisionBiblicalUnit.title} eyebrow={spiritDecisionBiblicalUnit.reference}><blockquote>{spiritDecisionBiblicalUnit.principle}</blockquote><p>{spiritDecisionBiblicalUnit.context}</p><div className="provenance-inline"><BookOpenText size={17}/><span>A fonte bíblica inicia a missão. As demais relações são comparações opcionais e identificadas.</span></div></Card><Card title="Antes de começar" eyebrow="Autonomia"><ul className="simple-list"><li>nenhuma decisão é promessa ou previsão;</li><li>discordâncias permanecem registradas;</li><li>retirar e não assumir compromisso são conclusões completas;</li><li>nenhuma ação real será executada.</li></ul><div className="spirit-actions"><Button onClick={() => start(sourceCouncilId)}>Iniciar a revisão <ArrowRight size={18}/></Button><Button variant="ghost" onClick={() => navigate('/safety?source=spirit-decision')}><ShieldCheck size={18}/> Apoio direto</Button></div></Card></div></div>;
  }

  if (progress.status === 'completed') {
    const nodes = chainNodeIds.map((id) => allSpiritNodes.find((node) => node.id === id)).filter((node): node is SymbolicNode => Boolean(node)).map((node) => resolveNode(node, enabledLayers));
    const supporting = Object.values(progress.positions).filter((position) => position === 'supports').length;
    const dissenting = Object.values(progress.positions).filter((position) => position === 'disagrees').length;
    return <div className="page page--spirit page--spirit-decision"><PageHeader eyebrow="Componente criado" title="A decisão permaneceu revisável." description="A Marca registra escolhas curadas. Ela não mede firmeza, maturidade ou direção espiritual."/><div className="spirit-decision-result-grid"><Card className="spirit-decision-mark-card"><div className="spirit-decision-mark" aria-hidden="true"><GitBranch/></div><p className="eyebrow">Quarto componente do Espírito</p><h2>Marca da Decisão Revisável</h2><span className="item-status item-status--active">Criada</span></Card><Card title="Fórmula registrada" eyebrow="Sem promessa"><ul className="simple-list"><li><strong>Partes favoráveis:</strong> {supporting}</li><li><strong>Partes em desacordo:</strong> {dissenting}</li><li><strong>Decisão:</strong> {spiritDecisionChoiceOptions.find((item) => item.id === progress.choice)?.label}</li><li><strong>Revisão:</strong> {spiritDecisionRevisionOptions.find((item) => item.id === progress.revision)?.label}</li><li><strong>Janela:</strong> {spiritDecisionWindowOptions.find((item) => item.id === progress.reviewWindow)?.label}</li></ul></Card></div><Card title="Cadeia opcional" eyebrow="Proveniência por camada"><div className="spirit-chain-grid">{nodes.map((node) => <article key={node.id} className="spirit-chain-node"><span className={`provenance-badge provenance-badge--${node.provenance.class.toLowerCase()}`}>{node.provenance.class}</span><h3>{node.name}</h3><p>{node.description}</p><small>{node.provenance.label}</small></article>)}</div></Card><Card title="Próximo passo" eyebrow="Sem conclusão automática"><p>A Marca é o quarto componente do Espírito. Ela preserva Fio, Nó e Selo, não obriga compromisso e não conclui o capítulo.</p><div className="spirit-actions"><Button onClick={() => navigate('/temple/spirit-sanctuary')}>Voltar ao Santuário</Button><Button variant="ghost" onClick={() => navigate('/temple')}>Abrir o Átrio</Button></div></Card></div>;
  }

  const selectedScenario = spiritDecisionScenarios.find((scenario) => scenario.id === progress.scenarioId);
  const allowedRevisions = progress.choice === 'none'
    ? spiritDecisionRevisionOptions.filter((option) => option.id === 'withdraw' || option.id === 'no_commitment')
    : spiritDecisionRevisionOptions;
  const completeReady = canCompleteSpiritDecision(progress, spiritDecisionEntries.length);

  return <div className="page page--spirit page--spirit-decision"><PageHeader eyebrow="A Decisão que Permanece Aberta" title="Revisar não transforma mudança em falha." description="Todos os exemplos são fictícios. Nenhuma escolha recebe pontuação de firmeza, coerência ou obediência." action={<Button variant="ghost" onClick={() => navigate('/safety?source=spirit-decision')}><AlertTriangle size={18}/> Apoio direto</Button>}/>
    <Card title="1. Distinguir quatro ideias" eyebrow="Exemplos fictícios"><div className="spirit-decision-classification-list">{spiritDecisionEntries.map((entry) => { const selected = progress.classifications[entry.id]; return <article key={entry.id} className="spirit-decision-entry"><p>{entry.text}</p><div className="classification-actions">{(Object.keys(categoryLabels) as SpiritDecisionCategory[]).map((category) => <button key={category} type="button" aria-pressed={selected === category} onClick={() => classify(entry.id, category)}>{categoryLabels[category]}</button>)}</div>{selected && <p className="classification-feedback" data-match={selected === entry.suggestedCategory}>Sugestão editorial: {categoryLabels[entry.suggestedCategory]}. {entry.explanation}</p>}</article>; })}</div><Button variant="ghost" onClick={skipClassification}>Concluir sem classificar</Button>{progress.classificationSkipped && <p className="field-help"><CheckCircle2 size={16}/> Classificação recusada sem perda de progresso.</p>}</Card>
    <Card title="2. Escolher um cenário fictício" eyebrow="Decisão pequena e reversível"><div className="spirit-decision-scenario-grid">{spiritDecisionScenarios.map((scenario) => <button key={scenario.id} type="button" aria-pressed={progress.scenarioId === scenario.id} onClick={() => selectScenario(scenario.id)}><strong>{scenario.title}</strong><span>{scenario.description}</span></button>)}</div></Card>
    <Card title="3. Preservar a posição das cinco partes" eyebrow="Sem maioria"><div className="spirit-decision-positions">{spiritDecisionDimensions.map((dimension) => <article key={dimension} className="spirit-decision-position"><h3>{spiritDecisionDimensionLabels[dimension]}</h3><p>{selectedScenario?.positions[dimension] ?? 'Escolha primeiro um cenário fictício.'}</p><div className="spirit-decision-option-grid">{spiritDecisionPositionOptions.map((option) => <button key={option.id} type="button" disabled={!selectedScenario} aria-pressed={progress.positions[dimension] === option.id} onClick={() => setPosition(dimension, option.id)}><strong>{option.label}</strong><small>{option.description}</small></button>)}</div></article>)}</div></Card>
    <Card title="4. Escolher uma decisão provisória" eyebrow="Nenhum compromisso obrigatório"><div className="spirit-decision-option-grid">{spiritDecisionChoiceOptions.map((option) => <button key={option.id} type="button" aria-pressed={progress.choice === option.id} onClick={() => setChoice(option.id)}>{option.id === 'pause' ? <Pause size={17}/> : option.id === 'none' ? <Circle size={17}/> : <GitBranch size={17}/>}<strong>{option.label}</strong><small>{option.description}</small></button>)}</div></Card>
    <Card title="5. Definir revisão, janela e condição" eyebrow="Decisão aberta"><div className="spirit-decision-option-grid">{allowedRevisions.map((option) => <button key={option.id} type="button" aria-pressed={progress.revision === option.id} onClick={() => setRevision(option.id)}><strong>{option.label}</strong><small>{option.description}</small></button>)}</div><div className="spirit-decision-option-grid">{spiritDecisionWindowOptions.map((option) => <button key={option.id} type="button" aria-pressed={progress.reviewWindow === option.id} onClick={() => setReviewWindow(option.id)}><strong>{option.label}</strong><small>{option.description}</small></button>)}</div><div className="spirit-decision-option-grid">{spiritDecisionConditionOptions.map((option) => <button key={option.id} type="button" aria-pressed={progress.reviewCondition === option.id} onClick={() => setReviewCondition(option.id)}><strong>{option.label}</strong><small>{option.description}</small></button>)}</div><Button variant="ghost" onClick={declineDecision}>Recusar integralmente a decisão</Button>{progress.decisionDeclined && <p className="field-help"><CheckCircle2 size={16}/> Recusa registrada como conclusão completa.</p>}</Card>
    <Card title="Criar a Marca da Decisão Revisável" eyebrow="Sem promessa ou previsão"><div className="safety-summary"><ShieldCheck/><p>A decisão pertence somente ao cenário fictício. O aplicativo não executa ações, envia mensagens ou determina o que deve acontecer.</p></div><div className="spirit-actions"><Button disabled={!completeReady} onClick={() => complete(spiritDecisionEntries.length)}>Criar a Marca <Sparkles size={18}/></Button><Button variant="ghost" onClick={() => navigate('/temple/spirit-sanctuary')}>Pausar e voltar</Button></div>{!completeReady && <p className="field-help">Conclua ou recuse a classificação; depois escolha cenário, posição das cinco partes, decisão, revisão, janela e condição — ou recuse toda a decisão.</p>}</Card>
  </div>;
}
