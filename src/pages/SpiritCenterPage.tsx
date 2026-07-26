import { AlertTriangle, ArrowRight, BookOpenText, CheckCircle2, Circle, GitBranch, Pause, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import {
  spiritCenterBiblicalUnit,
  spiritCenterDecisionOptions,
  spiritCenterDimensionLabels,
  spiritCenterDurationOptions,
  spiritCenterEntries,
  spiritCenterNodes,
  spiritCenterReviewOptions,
  spiritCenterScenarios
} from '../content/spiritCenter';
import { spiritFoundationNodes } from '../content/spiritFoundation';
import {
  canCompleteSpiritCenter,
  type SpiritCenterCategory
} from '../domain/spiritCenter';
import { spiritDimensions } from '../domain/spiritThread';
import type { SymbolicNode } from '../domain/types';
import { useAthanorStore } from '../state/useAthanorStore';
import { useSpiritCenterStore } from '../state/useSpiritCenterStore';
import { useSpiritThreadStore } from '../state/useSpiritThreadStore';

const categoryLabels: Record<SpiritCenterCategory, string> = {
  centrality: 'Centralidade',
  superiority: 'Superioridade',
  exclusion: 'Exclusão',
  integration: 'Integração'
};

const allSpiritNodes = [...spiritFoundationNodes, ...spiritCenterNodes];
const chainNodeIds = [
  'spirit_tiferet_center_v1',
  'spirit_ruach_shift_v1',
  'spirit_gen_center_v1',
  'spirit_justice_center_v1',
  'spirit_provisional_center_knot_v1'
];

function resolveNode(node: SymbolicNode, enabledLayers: string[]): SymbolicNode {
  if (!node.layer || enabledLayers.includes(node.layer)) return node;
  return allSpiritNodes.find((candidate) => candidate.id === node.fallbackNodeId) ?? node;
}

export function SpiritCenterPage() {
  const navigate = useNavigate();
  const enabledLayers = useAthanorStore((state) => state.preferences.enabledLayers);
  const rawThread = useSpiritThreadStore((state) => state.progress);
  const storedProgress = useSpiritCenterStore((state) => state.progress);
  const start = useSpiritCenterStore((state) => state.start);
  const classify = useSpiritCenterStore((state) => state.classify);
  const skipClassification = useSpiritCenterStore((state) => state.skipClassification);
  const selectScenario = useSpiritCenterStore((state) => state.selectScenario);
  const setCenter = useSpiritCenterStore((state) => state.setCenter);
  const chooseNoCenter = useSpiritCenterStore((state) => state.chooseNoCenter);
  const setDuration = useSpiritCenterStore((state) => state.setDuration);
  const setReview = useSpiritCenterStore((state) => state.setReview);
  const setDecision = useSpiritCenterStore((state) => state.setDecision);
  const declineCenter = useSpiritCenterStore((state) => state.declineCenter);
  const complete = useSpiritCenterStore((state) => state.complete);

  const threadCompleted = rawThread?.status === 'completed' && rawThread.possibleSynthesisThreadCreated;
  const sourceThreadId = threadCompleted && rawThread
    ? rawThread.completedAt ?? `${rawThread.sourceEarthCycleId}:possible-synthesis-thread`
    : undefined;
  const progress = sourceThreadId && storedProgress?.sourceThreadId === sourceThreadId
    ? storedProgress
    : undefined;

  if (!sourceThreadId) {
    return <div className="page page--spirit"><PageHeader eyebrow="Capítulo do Espírito · Segunda missão" title="O centro ainda não pode ser escolhido." description="Conclua primeiro O Fio que Reúne na jornada atual."/><Card title="Dependência do Fio" eyebrow="Caminho ainda fechado"><Button onClick={() => navigate('/mission/thread-that-gathers')}>Voltar ao Fio</Button></Card></div>;
  }

  if (!progress) {
    return <div className="page page--spirit page--spirit-center"><PageHeader eyebrow="Capítulo do Espírito · Segunda missão" title="O Centro que Não Apaga as Partes" description="Escolha, alterne ou recuse um centro temporário sem transformar foco em superioridade."/><div className="spirit-center-intro-grid"><Card title={spiritCenterBiblicalUnit.title} eyebrow={spiritCenterBiblicalUnit.reference}><blockquote>{spiritCenterBiblicalUnit.principle}</blockquote><p>{spiritCenterBiblicalUnit.context}</p><div className="provenance-inline"><BookOpenText size={17}/><span>A fonte bíblica inicia a missão. As demais relações são comparações opcionais e identificadas.</span></div></Card><Card title="Antes de começar" eyebrow="Autonomia"><ul className="simple-list"><li>o centro é temporário e revisável;</li><li>nenhuma dimensão se torna superior;</li><li>trocar o centro preserva o histórico;</li><li>nenhum centro e recusa integral são conclusões completas.</li></ul><div className="spirit-actions"><Button onClick={() => start(sourceThreadId)}>Iniciar a missão <ArrowRight size={18}/></Button><Button variant="ghost" onClick={() => navigate('/safety?source=spirit-center')}><ShieldCheck size={18}/> Apoio direto</Button></div></Card></div></div>;
  }

  if (progress.status === 'completed') {
    const nodes = chainNodeIds
      .map((id) => allSpiritNodes.find((node) => node.id === id))
      .filter((node): node is SymbolicNode => Boolean(node))
      .map((node) => resolveNode(node, enabledLayers));
    const centerLabel = progress.centerDeclined
      ? 'Centralidade recusada'
      : progress.noCenter
        ? 'Nenhuma dimensão central'
        : progress.centralDimension
          ? spiritCenterDimensionLabels[progress.centralDimension]
          : 'Não registrado';

    return <div className="page page--spirit page--spirit-center"><PageHeader eyebrow="Componente criado" title="O centro permaneceu provisório." description="O Nó registra escolhas curadas da missão. Ele não mede equilíbrio, maturidade ou integração espiritual."/><div className="spirit-center-result-grid"><Card className="spirit-center-knot-card"><div className="spirit-center-knot" aria-hidden="true"><GitBranch/></div><p className="eyebrow">Segundo componente do Espírito</p><h2>Nó do Centro Provisório</h2><span className="item-status item-status--active">Criado</span></Card><Card title="Fórmula registrada" eyebrow="Sem hierarquia"><ul className="simple-list"><li><strong>Centro final:</strong> {centerLabel}</li><li><strong>Passagens registradas:</strong> {progress.focusHistory.length}</li><li><strong>Duração:</strong> {spiritCenterDurationOptions.find((item) => item.id === progress.duration)?.label}</li><li><strong>Revisão:</strong> {spiritCenterReviewOptions.find((item) => item.id === progress.review)?.label}</li></ul></Card></div><Card title="Cadeia opcional" eyebrow="Proveniência por camada"><div className="spirit-chain-grid">{nodes.map((node) => <article key={node.id} className="spirit-chain-node"><span className={`provenance-badge provenance-badge--${node.provenance.class.toLowerCase()}`}>{node.provenance.class}</span><h3>{node.name}</h3><p>{node.description}</p><small>{node.provenance.label}</small></article>)}</div></Card><Card title="Próximo passo" eyebrow="Sem conclusão automática"><p>O Nó é o segundo componente do Espírito. Ele não apaga o Fio, não conclui o capítulo e não transforma centralidade em autoridade.</p><div className="spirit-actions"><Button onClick={() => navigate('/temple/spirit-sanctuary')}>Voltar ao Santuário</Button><Button variant="ghost" onClick={() => navigate('/temple')}>Abrir o Átrio</Button></div></Card></div>;
  }

  const completeReady = canCompleteSpiritCenter(progress, spiritCenterEntries.length);

  return <div className="page page--spirit page--spirit-center"><PageHeader eyebrow="O Centro que Não Apaga as Partes" title="Atenção pode mudar sem apagar o que veio antes." description="Todos os exemplos são fictícios. Nenhuma escolha recebe pontuação de harmonia ou coerência." action={<Button variant="ghost" onClick={() => navigate('/safety?source=spirit-center')}><AlertTriangle size={18}/> Apoio direto</Button>}/>
    <Card title="1. Distinguir quatro ideias" eyebrow="Exemplos fictícios"><div className="spirit-center-classification-list">{spiritCenterEntries.map((entry) => { const selected = progress.classifications[entry.id]; return <article key={entry.id} className="spirit-center-entry"><p>{entry.text}</p><div className="classification-actions">{(Object.keys(categoryLabels) as SpiritCenterCategory[]).map((category) => <button key={category} type="button" aria-pressed={selected === category} onClick={() => classify(entry.id, category)}>{categoryLabels[category]}</button>)}</div>{selected && <p className="classification-feedback" data-match={selected === entry.suggestedCategory}>Sugestão editorial: {categoryLabels[entry.suggestedCategory]}. {entry.explanation}</p>}</article>; })}</div><Button variant="ghost" onClick={skipClassification}>Concluir sem classificar</Button>{progress.classificationSkipped && <p className="field-help"><CheckCircle2 size={16}/> Classificação recusada sem perda de progresso.</p>}</Card>
    <Card title="2. Escolher um cenário fictício" eyebrow="Partes concorrentes"><div className="spirit-center-scenario-grid">{spiritCenterScenarios.map((scenario) => <button key={scenario.id} type="button" aria-pressed={progress.scenarioId === scenario.id} onClick={() => selectScenario(scenario.id)}><strong>{scenario.title}</strong><span>{scenario.description}</span><small>{scenario.competingParts.join(' · ')}</small></button>)}</div></Card>
    <Card title="3. Definir ou alternar um centro" eyebrow="Histórico preservado"><div className="spirit-center-dimension-grid">{spiritDimensions.map((dimension) => <button key={dimension} type="button" aria-pressed={progress.centralDimension === dimension && !progress.noCenter} onClick={() => setCenter(dimension)}><Circle size={17}/>{spiritCenterDimensionLabels[dimension]}</button>)}<button type="button" aria-pressed={progress.noCenter} onClick={chooseNoCenter}><Pause size={17}/> Nenhuma dimensão central</button></div><div className="spirit-center-history"><strong>Histórico de foco</strong>{progress.focusHistory.length ? <ol>{progress.focusHistory.map((dimension, index) => <li key={`${dimension}-${index}`}>{spiritCenterDimensionLabels[dimension]}</li>)}</ol> : <p>Nenhuma passagem registrada.</p>}</div></Card>
    <Card title="4. Limitar duração e revisão" eyebrow="Centro temporário"><div className="spirit-center-option-grid">{spiritCenterDurationOptions.map((option) => <button key={option.id} type="button" aria-pressed={progress.duration === option.id} onClick={() => setDuration(option.id)}><strong>{option.label}</strong><small>{option.description}</small></button>)}</div><div className="spirit-center-option-grid">{spiritCenterReviewOptions.map((option) => <button key={option.id} type="button" aria-pressed={progress.review === option.id} onClick={() => setReview(option.id)}><strong>{option.label}</strong><small>{option.description}</small></button>)}</div></Card>
    <Card title="5. Escolher um encerramento" eyebrow="Alternar não vale mais pontos"><div className="spirit-center-option-grid">{spiritCenterDecisionOptions.filter((option) => option.id !== 'decline').map((option) => <button key={option.id} type="button" aria-pressed={progress.decision === option.id} onClick={() => setDecision(option.id)}><strong>{option.label}</strong><small>{option.description}</small></button>)}</div><Button variant="ghost" onClick={declineCenter}>Recusar integralmente a centralidade</Button>{progress.centerDeclined && <p className="field-help"><CheckCircle2 size={16}/> Recusa registrada como conclusão completa.</p>}</Card>
    <Card title="Criar o Nó do Centro Provisório" eyebrow="Sem superioridade"><div className="safety-summary"><ShieldCheck/><p>Centralidade é apenas foco temporário de gameplay. Não determina verdade, autoridade, identidade ou valor espiritual.</p></div><div className="spirit-actions"><Button disabled={!completeReady} onClick={complete}>Criar o Nó <Sparkles size={18}/></Button><Button variant="ghost" onClick={() => navigate('/temple/spirit-sanctuary')}>Pausar e voltar</Button></div>{!completeReady && <p className="field-help">Conclua ou recuse a classificação; depois escolha um cenário, um centro ou nenhum centro, duração, revisão e decisão — ou recuse toda a centralidade.</p>}</Card>
  </div>;
}
