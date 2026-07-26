import { BookOpenText, CheckCircle2, CircleDashed, Pause, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { spiritFoundationBiblicalUnit, spiritFoundationNodes } from '../content/spiritFoundation';
import {
  spiritDimensionLabels,
  spiritRelationOptions,
  spiritScenarios,
  spiritThreadCategoryLabels,
  spiritThreadDecisionOptions,
  spiritThreadEntries,
  spiritThreadNodes
} from '../content/spiritThread';
import {
  canCompleteSpiritThread,
  spiritDimensions,
  type SpiritDimensionState,
  type SpiritThreadCategory
} from '../domain/spiritThread';
import type { SymbolicNode } from '../domain/types';
import { useAthanorStore } from '../state/useAthanorStore';
import { useEarthChapterStore } from '../state/useEarthChapterStore';
import { useSpiritThreadStore } from '../state/useSpiritThreadStore';

const allSpiritNodes = [...spiritFoundationNodes, ...spiritThreadNodes];
const chainNodeIds = [
  'spirit_keter_v1',
  'spirit_ruach_v1',
  'spirit_qian_v1',
  'spirit_world_v1',
  'spirit_possible_synthesis_thread_v1'
];

function resolveNode(node: SymbolicNode, enabledLayers: string[]): SymbolicNode {
  if (!node.layer || enabledLayers.includes(node.layer)) return node;
  return allSpiritNodes.find((candidate) => candidate.id === node.fallbackNodeId) ?? node;
}

export function SpiritThreadPage() {
  const navigate = useNavigate();
  const sanctuary = useAthanorStore((state) => state.temple?.rooms.find((room) => room.roomId === 'central-tree'));
  const enabledLayers = useAthanorStore((state) => state.preferences.enabledLayers);
  const earthChapter = useEarthChapterStore((state) => state.progress);
  const storedProgress = useSpiritThreadStore((state) => state.progress);
  const start = useSpiritThreadStore((state) => state.start);
  const classify = useSpiritThreadStore((state) => state.classify);
  const skipClassification = useSpiritThreadStore((state) => state.skipClassification);
  const selectScenario = useSpiritThreadStore((state) => state.selectScenario);
  const setDimensionState = useSpiritThreadStore((state) => state.setDimensionState);
  const setRelation = useSpiritThreadStore((state) => state.setRelation);
  const setDecision = useSpiritThreadStore((state) => state.setDecision);
  const declineSynthesis = useSpiritThreadStore((state) => state.declineSynthesis);
  const complete = useSpiritThreadStore((state) => state.complete);

  const sourceEarthCycleId = earthChapter?.cycleId ?? earthChapter?.completedAt;
  const available = Boolean(
    sourceEarthCycleId
      && earthChapter?.status === 'completed'
      && sanctuary
      && sanctuary.status !== 'dormant'
      && sanctuary.status !== 'hidden'
  );
  const progress = sourceEarthCycleId && storedProgress?.sourceEarthCycleId === sourceEarthCycleId
    ? storedProgress
    : undefined;

  if (!available || !sourceEarthCycleId) {
    return <div className="page page--spirit"><PageHeader eyebrow="Capítulo do Espírito" title="O Fio ainda não pode ser iniciado." description="Conclua primeiro o ciclo da Terra e abra o Santuário pela Árvore Central."/><Card title="Caminho ainda fechado" eyebrow="Dependência da jornada"><Button onClick={() => navigate('/temple/spirit-sanctuary')}>Voltar ao Santuário</Button></Card></div>;
  }

  if (!progress) {
    return <div className="page page--spirit page--spirit-thread"><PageHeader eyebrow="Capítulo do Espírito · Primeira missão" title="O Fio que Reúne" description="Distinguir partes não exige que elas concordem. Toda classificação, síntese ou ação pode ser recusada."/><div className="spirit-thread-intro-grid"><Card title={spiritFoundationBiblicalUnit.title} eyebrow={spiritFoundationBiblicalUnit.reference}><blockquote>{spiritFoundationBiblicalUnit.principle}</blockquote><p>{spiritFoundationBiblicalUnit.context}</p><div className="provenance-inline"><BookOpenText size={17}/><span>A Bíblia permanece como núcleo. As demais relações são opcionais, comparativas e identificadas.</span></div></Card><Card title="Antes de começar" eyebrow="Autonomia e segurança"><ul className="simple-list"><li>todos os cenários são fictícios;</li><li>qualquer dimensão pode permanecer desconhecida;</li><li>não existe pontuação de coerência;</li><li>pausar, recusar e não agir são conclusões completas.</li></ul><div className="spirit-thread-actions"><Button onClick={() => start(sourceEarthCycleId)}>Iniciar a missão</Button><Button variant="ghost" onClick={() => navigate('/safety?source=spirit')}><ShieldCheck size={18}/> Preciso de apoio direto</Button></div></Card></div></div>;
  }

  if (progress.status === 'completed') {
    const selectedScenario = spiritScenarios.find((scenario) => scenario.id === progress.scenarioId);
    const selectedDecision = spiritThreadDecisionOptions.find((option) => option.id === progress.decision);
    const selectedRelation = spiritRelationOptions.find((option) => option.id === progress.relation);
    const resolvedNodes = chainNodeIds
      .map((id) => allSpiritNodes.find((node) => node.id === id))
      .filter((node): node is SymbolicNode => Boolean(node))
      .map((node) => resolveNode(node, enabledLayers));

    return <div className="page page--spirit page--spirit-thread"><PageHeader eyebrow="Componente criado" title="As partes foram registradas sem virar medida de coerência." description="O Fio representa somente a conclusão desta prática, incluindo recusa, pausa ou desconhecimento."/><div className="spirit-thread-result-grid"><Card className="spirit-thread-item-card"><div className="spirit-thread-item-visual" aria-hidden="true"><Sparkles/></div><p className="eyebrow">Primeiro componente do Espírito</p><h2>Fio da Síntese Possível</h2><span className="item-status item-status--active">Criado</span></Card><Card title="Fórmula registrada" eyebrow="Somente categorias locais"><ul className="simple-list"><li><strong>Classificação:</strong> {progress.classificationSkipped ? 'Recusada' : 'Concluída com frases fictícias'}</li><li><strong>Síntese:</strong> {progress.synthesisDeclined ? 'Recusada integralmente' : selectedScenario?.title}</li><li><strong>Relação:</strong> {progress.synthesisDeclined ? 'Não registrada' : selectedRelation?.label}</li><li><strong>Decisão:</strong> {selectedDecision?.label}</li></ul></Card></div><Card title="Cadeia opcional" eyebrow="Proveniência por camada"><div className="spirit-chain-grid">{resolvedNodes.map((node) => <article key={node.id} className="spirit-chain-node"><span className={`provenance-badge provenance-badge--${node.provenance.class.toLowerCase()}`}>{node.provenance.class}</span><h3>{node.name}</h3><p>{node.description}</p><small>{node.provenance.label}</small></article>)}</div></Card><Card title="Próximo passo" eyebrow="Sem integração automática"><p>O Fio é apenas o primeiro componente do Espírito. Ele não afirma completude, iluminação, coerência pessoal ou ausência de conflito.</p><div className="spirit-thread-actions"><Button onClick={() => navigate('/temple/spirit-sanctuary')}>Voltar ao Santuário</Button><Button variant="ghost" onClick={() => navigate('/temple')}>Abrir o Átrio</Button></div></Card></div>;
  }

  const selectedScenario = spiritScenarios.find((scenario) => scenario.id === progress.scenarioId);
  const completeReady = canCompleteSpiritThread(progress, spiritThreadEntries.length);
  const categories = Object.keys(spiritThreadCategoryLabels) as SpiritThreadCategory[];
  const dimensionStates: SpiritDimensionState[] = ['considered', 'unknown'];

  return <div className="page page--spirit page--spirit-thread"><PageHeader eyebrow="O Fio que Reúne" title="Distinguir antes de reunir." description="A missão trabalha somente com cenários fictícios e não interpreta sua vida, identidade ou condição espiritual." action={<Button variant="ghost" onClick={() => navigate('/safety?source=spirit')}><ShieldCheck size={18}/> Apoio direto</Button>}/>
    <Card title="1. Reconhecer cinco dimensões" eyebrow="Classificação fictícia e recusável"><p>Classifique palavra, emoção, impulso, corpo percebido e ação. “Não sei” é uma categoria completa, e o feedback não gera nota.</p><div className="spirit-classification-list">{spiritThreadEntries.map((entry) => { const selected = progress.classifications[entry.id]; return <article key={entry.id} className="spirit-classification-entry"><p>{entry.text}</p><div className="classification-actions">{categories.map((category) => <button key={category} type="button" aria-pressed={selected === category} onClick={() => classify(entry.id, category)}>{spiritThreadCategoryLabels[category]}</button>)}</div>{selected && <p className="classification-feedback" data-match={selected === entry.suggestedCategory}>Sugestão editorial: {spiritThreadCategoryLabels[entry.suggestedCategory]}. {entry.explanation}</p>}</article>; })}</div><Button variant="ghost" onClick={skipClassification}>Concluir sem classificar</Button>{progress.classificationSkipped && <p className="field-help"><CheckCircle2 size={16}/> Classificação recusada. Nenhuma pontuação foi perdida.</p>}</Card>
    <Card title="2. Escolher um cenário fictício" eyebrow="Nenhum relato pessoal"><div className="spirit-scenario-grid">{spiritScenarios.map((scenario) => <button key={scenario.id} type="button" aria-pressed={progress.scenarioId === scenario.id} onClick={() => selectScenario(scenario.id)}><CircleDashed size={18}/><span><strong>{scenario.title}</strong><small>{scenario.context}</small></span></button>)}</div><Button variant="ghost" onClick={declineSynthesis}>Prefiro recusar toda a síntese</Button>{progress.synthesisDeclined && <p className="field-help"><CheckCircle2 size={16}/> Síntese recusada. A missão pode ser concluída sem cenário ou interpretação.</p>}</Card>
    {selectedScenario && !progress.synthesisDeclined && <Card title="3. Ver as partes sem exigir concordância" eyebrow={selectedScenario.title}><p>{selectedScenario.context}</p><div className="spirit-dimension-state-grid">{spiritDimensions.map((dimension) => { const meta = spiritDimensionLabels[dimension]; return <article key={dimension}><p className="eyebrow">{meta.label}</p><h3>{selectedScenario.dimensions[dimension]}</h3><p>{meta.description}</p><div role="group" aria-label={`Estado de ${meta.label}`}>{dimensionStates.map((state) => <button key={state} type="button" aria-pressed={progress.dimensionStates[dimension] === state} onClick={() => setDimensionState(dimension, state)}>{state === 'considered' ? 'Considerar esta parte' : 'Marcar como desconhecida'}</button>)}</div></article>; })}</div></Card>}
    {selectedScenario && !progress.synthesisDeclined && <Card title="4. Como as partes parecem se relacionar?" eyebrow="Sem nota de coerência"><div className="spirit-relation-grid">{spiritRelationOptions.map((option) => <button key={option.id} type="button" aria-pressed={progress.relation === option.id} onClick={() => setRelation(option.id)}><span><strong>{option.label}</strong><small>{option.description}</small></span></button>)}</div></Card>}
    {!progress.synthesisDeclined && <Card title="5. Escolher uma conclusão" eyebrow="Pausa e não agir são válidos"><div className="spirit-decision-grid">{spiritThreadDecisionOptions.filter((option) => option.id !== 'decline').map((option) => <button key={option.id} type="button" aria-pressed={progress.decision === option.id} onClick={() => setDecision(option.id)}>{option.id === 'pause' ? <Pause size={18}/> : <Sparkles size={18}/>}<span><strong>{option.label}</strong><small>{option.description}</small></span></button>)}</div></Card>}
    <Card title="Criar o Fio da Síntese Possível" eyebrow="Sem diagnóstico, oráculo ou elevação"><div className="safety-summary"><ShieldCheck/><p>Se houver risco imediato ou sofrimento intenso, interrompa o simbolismo e procure apoio adequado. O Athanor não avalia coerência, saúde ou condição espiritual.</p></div><div className="spirit-thread-actions"><Button disabled={!completeReady} onClick={complete}>Criar o Fio <Sparkles size={18}/></Button><Button variant="ghost" onClick={() => navigate('/temple/spirit-sanctuary')}>Pausar e voltar ao Santuário</Button></div>{!completeReady && <p className="field-help">Conclua ou recuse a classificação. Depois realize a síntese fictícia ou recuse-a integralmente.</p>}</Card>
  </div>;
}
