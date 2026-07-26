import { AlertTriangle, ArrowDown, ArrowRight, ArrowUp, CheckCircle2, Layers3, Map, Pause, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import {
  earthOrderActiveLimitOptions,
  earthOrderBiblicalUnit,
  earthOrderDecisionOptions,
  earthOrderEntries,
  earthOrderItems,
  earthOrderReviewRuleOptions,
  earthOrderStateOptions
} from '../content/earthOrder';
import { canCompleteEarthOrder, type EarthOrderCategory, type EarthOrderItemId } from '../domain/earthOrder';
import { useEarthOrderStore } from '../state/useEarthOrderStore';
import { useEarthRhythmStore } from '../state/useEarthRhythmStore';

const categoryLabels: Record<EarthOrderCategory, string> = {
  order: 'Ordem',
  priority: 'Prioridade',
  rigidity: 'Rigidez',
  accumulation: 'Acúmulo'
};

export function EarthOrderPage() {
  const navigate = useNavigate();
  const rhythmProgress = useEarthRhythmStore((state) => state.progress);
  const storedProgress = useEarthOrderStore((state) => state.progress);
  const start = useEarthOrderStore((state) => state.start);
  const classify = useEarthOrderStore((state) => state.classify);
  const skipClassification = useEarthOrderStore((state) => state.skipClassification);
  const setActiveLimit = useEarthOrderStore((state) => state.setActiveLimit);
  const setItemState = useEarthOrderStore((state) => state.setItemState);
  const moveVisibleItem = useEarthOrderStore((state) => state.moveVisibleItem);
  const setPriority = useEarthOrderStore((state) => state.setPriority);
  const setReviewRule = useEarthOrderStore((state) => state.setReviewRule);
  const setDecision = useEarthOrderStore((state) => state.setDecision);
  const complete = useEarthOrderStore((state) => state.complete);

  const sourceRhythmCompassId = rhythmProgress?.status === 'completed' && rhythmProgress.rhythmCompassCreated
    ? rhythmProgress.completedAt ?? `${rhythmProgress.sourceResourceBasketId}:rhythm-compass`
    : undefined;
  const progress = sourceRhythmCompassId && storedProgress?.sourceRhythmCompassId === sourceRhythmCompassId
    ? storedProgress
    : undefined;

  if (!sourceRhythmCompassId) {
    return <div className="page page--earth"><PageHeader eyebrow="Capítulo da Terra" title="A ordem ainda não pode ser organizada." description="Conclua primeiro O Ritmo que Pode Ser Mantido."/><Card title="Dependência da jornada"><Button onClick={() => navigate('/mission/sustainable-rhythm')}>Abrir O Ritmo que Pode Ser Mantido</Button></Card></div>;
  }

  if (!progress) {
    return <div className="page page--earth page--earth-order"><PageHeader eyebrow="Capítulo da Terra · Quinta missão" title="A Ordem que Serve" description="Organize objetos fictícios com limite visível, estados reversíveis e prioridade sem urgência."/><div className="earth-work-grid"><Card title={earthOrderBiblicalUnit.title} eyebrow={earthOrderBiblicalUnit.reference}><blockquote>{earthOrderBiblicalUnit.principle}</blockquote><p>{earthOrderBiblicalUnit.context}</p></Card><Card title="Antes de começar" eyebrow="Autonomia"><ul className="simple-list"><li>nenhuma tarefa ou lista real;</li><li>prioridade não cria prazo;</li><li>guardar, pausar e arquivar não apagam progresso;</li><li>a ordem pode mudar sem punição.</li></ul><Button onClick={() => start(sourceRhythmCompassId)}>Iniciar missão <ArrowRight size={18}/></Button></Card></div></div>;
  }

  if (progress.status === 'completed') {
    const priority = progress.priority === 'no_priority' ? undefined : earthOrderItems.find((item) => item.id === progress.priority);
    const decision = earthOrderDecisionOptions.find((option) => option.id === progress.decision);
    return <div className="page page--earth page--earth-order"><PageHeader eyebrow="Componente criado" title="Um Mapa foi registrado sem fixar uma ordem definitiva." description="Ele representa somente uma distribuição fictícia, limitada e revisável."/><div className="earth-work-grid"><Card className="earth-order-map-card"><div className="earth-order-map" aria-hidden="true"><Map/></div><p className="eyebrow">Quinto componente da Terra</p><h2>Mapa da Ordem Possível</h2><span className="item-status item-status--active">Criado</span></Card><Card title="Fórmula local" eyebrow="Sem urgência automática"><ul className="simple-list"><li><strong>Limite visível:</strong> {progress.activeLimit}</li><li><strong>Itens visíveis:</strong> {progress.visibleOrder.length}</li><li><strong>Prioridade:</strong> {priority?.label ?? 'Nenhuma prioridade'}</li><li><strong>Decisão:</strong> {decision?.label}</li></ul></Card></div><Card title="Próximo passo" eyebrow="Sem integração automática"><p>O Mapa não conclui o capítulo e não transforma organização em obrigação ou medida de valor.</p><div className="earth-work-actions"><Button onClick={() => navigate('/temple/garden')}>Voltar ao Jardim</Button><Button variant="ghost" onClick={() => navigate('/temple')}>Abrir o Átrio</Button></div></Card></div>;
  }

  const completeReady = canCompleteEarthOrder(progress, earthOrderEntries.length);
  const visibleCount = progress.visibleOrder.length;
  const activeLimit = progress.activeLimit ?? 0;
  const applyDisabled = !progress.priority || progress.priority === 'no_priority' || visibleCount === 0;
  const eligiblePriorityItems = earthOrderItems.filter((item) => progress.itemStates[item.id] && progress.itemStates[item.id] !== 'archived');

  return <div className="page page--earth page--earth-order"><PageHeader eyebrow="A Ordem que Serve" title="Ordem não é rigidez, prioridade não é urgência." description="A missão usa somente objetos fictícios e pode terminar em pausa, arquivo ou nenhuma ação." action={<Button variant="ghost" onClick={() => navigate('/safety?source=earth')}><AlertTriangle size={18}/> Apoio direto</Button>}/>
    <Card title="1. Distinguir ordem, prioridade, rigidez e acúmulo" eyebrow="Exemplos fictícios"><div className="earth-work-entry-list">{earthOrderEntries.map((entry) => { const selected = progress.classifications[entry.id]; return <article key={entry.id} className="earth-work-entry"><p>{entry.text}</p><div className="classification-actions">{(Object.keys(categoryLabels) as EarthOrderCategory[]).map((category) => <button key={category} type="button" aria-pressed={selected === category} onClick={() => classify(entry.id, category)}>{categoryLabels[category]}</button>)}</div>{selected && <p className="classification-feedback" data-match={selected === entry.suggestedCategory}>Sugestão editorial: {categoryLabels[entry.suggestedCategory]}. {entry.explanation}</p>}</article>; })}</div><Button variant="ghost" onClick={skipClassification}>Concluir sem classificar</Button>{progress.classificationSkipped && <p className="field-help"><CheckCircle2 size={16}/> Classificação recusada sem perda de progresso.</p>}</Card>
    <Card title="2. Limite de itens visíveis" eyebrow="Máximo de três"><div className="earth-option-list">{earthOrderActiveLimitOptions.map((option) => <button key={option.id} type="button" disabled={visibleCount > option.id} aria-pressed={progress.activeLimit === option.id} onClick={() => setActiveLimit(option.id)}><strong>{option.label}</strong><span>{option.description}</span></button>)}</div></Card>
    <Card title="3. Distribuir os objetos fictícios" eyebrow={progress.activeLimit ? `${visibleCount} de ${progress.activeLimit} visíveis` : 'Defina primeiro o limite'}><div className="earth-order-item-list">{earthOrderItems.map((item) => <article key={item.id} className="earth-order-item"><div><strong>{item.label}</strong><p>{item.description}</p></div><div className="earth-order-state-grid">{earthOrderStateOptions.map((option) => { const visibleBlocked = option.id === 'visible' && progress.itemStates[item.id] !== 'visible' && visibleCount >= activeLimit; return <button key={option.id} type="button" disabled={!progress.activeLimit || visibleBlocked} aria-pressed={progress.itemStates[item.id] === option.id} onClick={() => setItemState(item.id, option.id)}><strong>{option.label}</strong><span>{option.description}</span></button>; })}</div></article>)}</div></Card>
    <Card title="4. Ordem dos itens visíveis" eyebrow="Alterável sem perda"><div className="earth-order-visible-list">{progress.visibleOrder.length ? progress.visibleOrder.map((itemId, index) => { const item = earthOrderItems.find((candidate) => candidate.id === itemId); return <div key={itemId} className="earth-order-visible-row"><span><strong>{index + 1}.</strong> {item?.label}</span><div><button type="button" aria-label={`Mover ${item?.label} para cima`} disabled={index === 0} onClick={() => moveVisibleItem(itemId, 'up')}><ArrowUp size={17}/></button><button type="button" aria-label={`Mover ${item?.label} para baixo`} disabled={index === progress.visibleOrder.length - 1} onClick={() => moveVisibleItem(itemId, 'down')}><ArrowDown size={17}/></button></div></div>; }) : <p className="muted">Nenhum item está visível. Isso é permitido para pausa, arquivo ou nenhuma ação.</p>}</div></Card>
    <div className="earth-work-grid"><Card title="5. Prioridade sem urgência" eyebrow="Primeiro para revisar"><div className="earth-chip-grid"><button type="button" aria-pressed={progress.priority === 'no_priority'} onClick={() => setPriority('no_priority')}>Nenhuma prioridade</button>{eligiblePriorityItems.map((item) => <button key={item.id} type="button" aria-pressed={progress.priority === item.id} onClick={() => setPriority(item.id)}>{item.label}</button>)}</div></Card><Card title="6. Regra de revisão" eyebrow="Sem data obrigatória"><div className="earth-option-list">{earthOrderReviewRuleOptions.map((option) => <button key={option.id} type="button" aria-pressed={progress.reviewRule === option.id} onClick={() => setReviewRule(option.id)}><strong>{option.label}</strong><span>{option.description}</span></button>)}</div></Card></div>
    <Card title="7. Escolher o destino" eyebrow="Todos os resultados são completos"><div className="earth-option-list">{earthOrderDecisionOptions.map((option) => <button key={option.id} type="button" disabled={option.id === 'apply_once' && applyDisabled} aria-pressed={progress.decision === option.id} onClick={() => setDecision(option.id)}>{option.id === 'pause' ? <Pause size={17}/> : option.id === 'save_layout' ? <Layers3 size={17}/> : <Map size={17}/>}<strong>{option.label}</strong><span>{option.description}</span></button>)}</div></Card>
    <Card title="Criar o Mapa da Ordem Possível" eyebrow="Sem produtividade ou urgência"><div className="safety-summary"><ShieldCheck/><p>O Athanor não importa listas, não cria prazos, não mede organização e não executa nenhuma ação externa.</p></div><div className="earth-work-actions"><Button disabled={!completeReady} onClick={complete}>Criar Mapa <Map size={18}/></Button><Button variant="ghost" onClick={() => navigate('/temple/garden')}>Voltar ao Jardim</Button></div></Card>
  </div>;
}
