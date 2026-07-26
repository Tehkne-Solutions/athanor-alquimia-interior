import { AlertTriangle, ArrowRight, BookOpenText, CheckCircle2, Footprints, Leaf, Pause, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import {
  earthActionOptions,
  earthBodyEntries,
  earthBodyNodes,
  earthPerceptionLabels,
  earthPerceptionLevelLabels,
  earthResourceOptions
} from '../content/earthBody';
import { earthFoundationBiblicalUnit, earthFoundationNodes } from '../content/earthFoundation';
import {
  canCompleteEarthBody,
  earthPerceptionDimensions,
  type EarthBodyCategory,
  type EarthPerceptionLevel
} from '../domain/earthBody';
import type { SymbolicNode } from '../domain/types';
import { useAthanorStore } from '../state/useAthanorStore';
import { useEarthBodyStore } from '../state/useEarthBodyStore';
import { useFireChapterStore } from '../state/useFireChapterStore';

const categoryLabels: Record<EarthBodyCategory, string> = {
  perceived_signal: 'Sinal percebido',
  interpretation: 'Interpretação',
  need: 'Necessidade',
  action: 'Ação'
};

const allEarthNodes = [...earthFoundationNodes, ...earthBodyNodes];
const chainNodeIds = ['earth_malkhut', 'earth_kun', 'earth_empress', 'earth_body_presence_mark_v1'];

function resolveNode(node: SymbolicNode, enabledLayers: string[]): SymbolicNode {
  if (!node.layer || enabledLayers.includes(node.layer)) return node;
  return allEarthNodes.find((candidate) => candidate.id === node.fallbackNodeId) ?? node;
}

export function EarthBodyPage() {
  const navigate = useNavigate();
  const garden = useAthanorStore((state) => state.temple?.rooms.find((room) => room.roomId === 'garden'));
  const enabledLayers = useAthanorStore((state) => state.preferences.enabledLayers);
  const fireChapter = useFireChapterStore((state) => state.progress);
  const storedProgress = useEarthBodyStore((state) => state.progress);
  const start = useEarthBodyStore((state) => state.start);
  const setPerception = useEarthBodyStore((state) => state.setPerception);
  const skipCheckIn = useEarthBodyStore((state) => state.skipCheckIn);
  const classify = useEarthBodyStore((state) => state.classify);
  const skipClassification = useEarthBodyStore((state) => state.skipClassification);
  const toggleResource = useEarthBodyStore((state) => state.toggleResource);
  const setAction = useEarthBodyStore((state) => state.setAction);
  const complete = useEarthBodyStore((state) => state.complete);

  const sourceFireCycleId = fireChapter?.cycleId ?? fireChapter?.completedAt;
  const available = Boolean(
    sourceFireCycleId
      && fireChapter?.status === 'completed'
      && garden
      && garden.status !== 'dormant'
      && garden.status !== 'hidden'
  );
  const progress = sourceFireCycleId && storedProgress?.sourceFireCycleId === sourceFireCycleId
    ? storedProgress
    : undefined;

  if (!available || !sourceFireCycleId) {
    return <div className="page page--earth"><PageHeader eyebrow="Capítulo da Terra" title="O corpo ainda não pode entrar na missão." description="Conclua primeiro o ciclo do Fogo e abra o Jardim pelo Templo."/><Card title="Caminho ainda fechado" eyebrow="Dependência da jornada"><Button onClick={() => navigate('/temple/garden')}>Voltar ao Jardim</Button></Card></div>;
  }

  if (!progress) {
    return <div className="page page--earth page--earth-body"><PageHeader eyebrow="Capítulo da Terra · Primeira missão" title="O Corpo Chega Primeiro" description="Observe condições percebidas antes de organizar tarefas. Todo o check-in pode ser recusado."/><div className="earth-body-intro-grid"><Card title={earthFoundationBiblicalUnit.title} eyebrow={earthFoundationBiblicalUnit.reference}><blockquote>{earthFoundationBiblicalUnit.principle}</blockquote><p>{earthFoundationBiblicalUnit.context}</p><div className="provenance-inline"><BookOpenText size={17}/><span>A fonte bíblica inicia a missão. As demais relações aparecem como comparações opcionais.</span></div></Card><Card title="Antes de começar" eyebrow="Autonomia e segurança"><ul className="simple-list"><li>nenhuma percepção recebe valor moral;</li><li>o check-in não mede saúde, sono ou desempenho;</li><li>o classificador usa somente frases fictícias;</li><li>repousar e não agir são resultados completos.</li></ul><div className="earth-body-actions"><Button onClick={() => start(sourceFireCycleId)}>Iniciar a missão <ArrowRight size={18}/></Button><Button variant="ghost" onClick={() => navigate('/safety?source=earth')}><ShieldCheck size={18}/> Preciso de apoio direto</Button></div></Card></div></div>;
  }

  if (progress.status === 'completed') {
    const selectedAction = earthActionOptions.find((option) => option.id === progress.action);
    const selectedResources = earthResourceOptions.filter((option) => progress.resources.includes(option.id));
    const resolvedNodes = chainNodeIds
      .map((id) => allEarthNodes.find((node) => node.id === id))
      .filter((node): node is SymbolicNode => Boolean(node))
      .map((node) => resolveNode(node, enabledLayers));

    return <div className="page page--earth page--earth-body"><PageHeader eyebrow="Componente criado" title="A presença foi registrada sem virar diagnóstico." description="A Marca registra escolhas curadas desta prática. Ela não mede saúde, disciplina ou valor pessoal."/><div className="earth-body-result-grid"><Card className="earth-body-mark-card"><div className="earth-body-mark-visual" aria-hidden="true"><Footprints/></div><p className="eyebrow">Primeiro componente da Terra</p><h2>Marca da Presença Corporal</h2><span className="item-status item-status--active">Criada</span></Card><Card title="Fórmula registrada" eyebrow="Somente categorias locais"><ul className="simple-list"><li><strong>Check-in:</strong> {progress.checkInSkipped ? 'Recusado' : 'Quatro dimensões percebidas'}</li><li><strong>Recursos:</strong> {selectedResources.map((item) => item.label).join(', ')}</li><li><strong>Ação:</strong> {selectedAction?.label}</li></ul></Card></div><Card title="Cadeia opcional" eyebrow="Proveniência por camada"><div className="earth-chain-grid">{resolvedNodes.map((node) => <article key={node.id} className="earth-chain-node"><span className={`provenance-badge provenance-badge--${node.provenance.class.toLowerCase()}`}>{node.provenance.class}</span><h3>{node.name}</h3><p>{node.description}</p><small>{node.provenance.label}</small></article>)}</div></Card><Card title="Próximo passo" eyebrow="Sem integração automática"><p>A Marca é o primeiro componente da Terra. Ela não obriga ação, não conclui o capítulo e não substitui avaliação profissional.</p><div className="earth-body-actions"><Button onClick={() => navigate('/temple/garden')}>Voltar ao Jardim</Button><Button variant="ghost" onClick={() => navigate('/temple')}>Abrir o Átrio</Button></div></Card></div>;
  }

  const completeReady = canCompleteEarthBody(progress, earthBodyEntries.length);

  return <div className="page page--earth page--earth-body"><PageHeader eyebrow="O Corpo Chega Primeiro" title="Percepção pode vir antes da interpretação." description="As escolhas permanecem somente neste dispositivo e podem ser recusadas." action={<Button variant="ghost" onClick={() => navigate('/safety?source=earth')}><AlertTriangle size={18}/> Apoio direto</Button>}/>
    <Card title="1. Observar quatro dimensões" eyebrow="Preencher ou recusar tudo"><div className="earth-perception-grid">{earthPerceptionDimensions.map((dimension) => { const meta = earthPerceptionLabels[dimension]; return <article key={dimension} className="earth-perception-card"><h3>{meta.title}</h3><p>{meta.description}</p><div className="earth-level-options" role="group" aria-label={meta.title}>{(Object.keys(earthPerceptionLevelLabels) as EarthPerceptionLevel[]).map((level) => <button key={level} type="button" aria-pressed={progress.perceptions[dimension] === level} onClick={() => setPerception(dimension, level)}>{earthPerceptionLevelLabels[level]}</button>)}</div></article>; })}</div><Button variant="ghost" onClick={skipCheckIn}>Prefiro não registrar o check-in</Button>{progress.checkInSkipped && <p className="field-help"><CheckCircle2 size={16}/> Check-in recusado. A missão continua sem perda de progresso.</p>}</Card>
    <Card title="2. Diferenciar antes de agir" eyebrow="Frases fictícias"><p>Classifique sinal percebido, interpretação, necessidade e ação. O feedback é didático e não gera nota.</p><div className="earth-classification-list">{earthBodyEntries.map((entry) => { const selected = progress.classifications[entry.id]; return <article key={entry.id} className="earth-classification-entry"><p>{entry.text}</p><div className="classification-actions">{(Object.keys(categoryLabels) as EarthBodyCategory[]).map((category) => <button key={category} type="button" aria-pressed={selected === category} onClick={() => classify(entry.id, category)}>{categoryLabels[category]}</button>)}</div>{selected && <p className="classification-feedback" data-match={selected === entry.suggestedCategory}>Sugestão editorial: {categoryLabels[entry.suggestedCategory]}. {entry.explanation}</p>}</article>; })}</div><Button variant="ghost" onClick={skipClassification}>Concluir sem classificar</Button>{progress.classificationSkipped && <p className="field-help"><CheckCircle2 size={16}/> Classificação recusada. Nenhuma pontuação foi perdida.</p>}</Card>
    <Card title="3. Inventariar recursos disponíveis" eyebrow="Seleção múltipla ou ausência"><div className="earth-resource-grid">{earthResourceOptions.map((option) => <button key={option.id} type="button" aria-pressed={progress.resources.includes(option.id)} onClick={() => toggleResource(option.id)}><Leaf size={17}/><span><strong>{option.label}</strong><small>{option.description}</small></span></button>)}</div></Card>
    <Card title="4. Escolher uma ação pequena" eyebrow="Repouso e não agir são válidos"><div className="earth-action-grid">{earthActionOptions.map((option) => <button key={option.id} type="button" aria-pressed={progress.action === option.id} onClick={() => setAction(option.id)}>{option.id === 'rest_now' || option.id === 'brief_pause' ? <Pause size={18}/> : <Footprints size={18}/>}<span><strong>{option.label}</strong><small>{option.description}</small></span></button>)}</div></Card>
    <Card title="Criar a Marca da Presença Corporal" eyebrow="Sem diagnóstico ou meta física"><div className="safety-summary"><ShieldCheck/><p>Em dor intensa, dificuldade para respirar, desmaio, confusão ou outra emergência, interrompa o simbolismo e procure ajuda adequada.</p></div><div className="earth-body-actions"><Button disabled={!completeReady} onClick={complete}>Criar a Marca <Footprints size={18}/></Button><Button variant="ghost" onClick={() => navigate('/temple/garden')}>Pausar e voltar ao Jardim</Button></div>{!completeReady && <p className="field-help">Conclua ou recuse o check-in e a classificação; depois escolha ao menos um estado de recurso e uma ação.</p>}</Card>
  </div>;
}
