import { AlertTriangle, ArrowRight, CheckCircle2, Clock3, Pause, Play, RefreshCw, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import {
  earthRhythmActionUnitOptions,
  earthRhythmBiblicalUnit,
  earthRhythmDecisionOptions,
  earthRhythmEntries,
  earthRhythmFrequencyOptions,
  earthRhythmResourceModeOptions,
  earthRhythmRestOptions,
  earthRhythmResumeOptions
} from '../content/earthRhythm';
import { canCompleteEarthRhythm, type EarthRhythmCategory } from '../domain/earthRhythm';
import { useEarthResourcesStore } from '../state/useEarthResourcesStore';
import { useEarthRhythmStore } from '../state/useEarthRhythmStore';

const categoryLabels: Record<EarthRhythmCategory, string> = {
  rhythm: 'Ritmo',
  rush: 'Pressa',
  repetition: 'Repetição',
  pressure: 'Cobrança'
};

export function EarthRhythmPage() {
  const navigate = useNavigate();
  const resourceProgress = useEarthResourcesStore((state) => state.progress);
  const storedProgress = useEarthRhythmStore((state) => state.progress);
  const start = useEarthRhythmStore((state) => state.start);
  const classify = useEarthRhythmStore((state) => state.classify);
  const skipClassification = useEarthRhythmStore((state) => state.skipClassification);
  const setFrequency = useEarthRhythmStore((state) => state.setFrequency);
  const setActionUnit = useEarthRhythmStore((state) => state.setActionUnit);
  const setRest = useEarthRhythmStore((state) => state.setRest);
  const setResourceMode = useEarthRhythmStore((state) => state.setResourceMode);
  const setResume = useEarthRhythmStore((state) => state.setResume);
  const setDecision = useEarthRhythmStore((state) => state.setDecision);
  const complete = useEarthRhythmStore((state) => state.complete);

  const sourceResourceBasketId = resourceProgress?.status === 'completed' && resourceProgress.possibleResourcesBasketCreated
    ? resourceProgress.completedAt ?? `${resourceProgress.sourceFirstStepSeedId}:resource-basket`
    : undefined;
  const progress = sourceResourceBasketId && storedProgress?.sourceResourceBasketId === sourceResourceBasketId
    ? storedProgress
    : undefined;

  if (!sourceResourceBasketId) {
    return <div className="page page--earth"><PageHeader eyebrow="Capítulo da Terra" title="O ritmo ainda não pode ser organizado." description="Conclua primeiro A Casa dos Recursos."/><Card title="Dependência da jornada"><Button onClick={() => navigate('/mission/house-of-resources')}>Abrir A Casa dos Recursos</Button></Card></div>;
  }

  if (!progress) {
    return <div className="page page--earth page--earth-rhythm"><PageHeader eyebrow="Capítulo da Terra · Quarta missão" title="O Ritmo que Pode Ser Mantido" description="Organize uma cadência fictícia sem sequência obrigatória, cobrança ou compensação por pausa."/><div className="earth-work-grid"><Card title={earthRhythmBiblicalUnit.title} eyebrow={earthRhythmBiblicalUnit.reference}><blockquote>{earthRhythmBiblicalUnit.principle}</blockquote><p>{earthRhythmBiblicalUnit.context}</p></Card><Card title="Antes de começar" eyebrow="Autonomia"><ul className="simple-list"><li>nenhum streak ou sequência diária;</li><li>pausas não apagam progresso;</li><li>retomar não exige compensar o tempo parado;</li><li>nenhuma frequência também é válida.</li></ul><Button onClick={() => start(sourceResourceBasketId)}>Iniciar missão <ArrowRight size={18}/></Button></Card></div></div>;
  }

  if (progress.status === 'completed') {
    const frequency = earthRhythmFrequencyOptions.find((option) => option.id === progress.frequency);
    const actionUnit = earthRhythmActionUnitOptions.find((option) => option.id === progress.actionUnit);
    const decision = earthRhythmDecisionOptions.find((option) => option.id === progress.decision);
    return <div className="page page--earth page--earth-rhythm"><PageHeader eyebrow="Componente criado" title="Um Compasso foi registrado sem criar cobrança." description="Ele representa somente uma cadência fictícia, pausável e revisável."/><div className="earth-work-grid"><Card className="earth-rhythm-compass-card"><div className="earth-rhythm-compass" aria-hidden="true"><Clock3/></div><p className="eyebrow">Quarto componente da Terra</p><h2>Compasso do Ritmo Sustentável</h2><span className="item-status item-status--active">Criado</span></Card><Card title="Fórmula local" eyebrow="Sem streak"><ul className="simple-list"><li><strong>Frequência:</strong> {frequency?.label}</li><li><strong>Unidade:</strong> {actionUnit?.label}</li><li><strong>Decisão:</strong> {decision?.label}</li><li><strong>Retomada:</strong> sem sequência obrigatória</li></ul></Card></div><Card title="Próximo passo" eyebrow="Sem integração automática"><p>O Compasso não conclui o capítulo e não transforma a cadência em obrigação.</p><div className="earth-work-actions"><Button onClick={() => navigate('/temple/garden')}>Voltar ao Jardim</Button><Button variant="ghost" onClick={() => navigate('/temple')}>Abrir o Átrio</Button></div></Card></div>;
  }

  const completeReady = canCompleteEarthRhythm(progress, earthRhythmEntries.length);
  const tryDisabled = progress.frequency === 'no_frequency'
    || progress.actionUnit === 'no_action_unit'
    || progress.rest === 'no_rest_plan'
    || progress.resume === 'no_resume'
    || progress.resourceMode === 'wait_resource'
    || progress.resourceMode === 'pause_cycle';

  return <div className="page page--earth page--earth-rhythm"><PageHeader eyebrow="O Ritmo que Pode Ser Mantido" title="Cadência não é pressa, repetição ou prova de valor." description="A missão usa somente exemplos fictícios e pode terminar em espera, pausa, arquivo ou nenhuma ação." action={<Button variant="ghost" onClick={() => navigate('/safety?source=earth')}><AlertTriangle size={18}/> Apoio direto</Button>}/>
    <Card title="1. Distinguir ritmo, pressa, repetição e cobrança" eyebrow="Exemplos fictícios"><div className="earth-work-entry-list">{earthRhythmEntries.map((entry) => { const selected = progress.classifications[entry.id]; return <article key={entry.id} className="earth-work-entry"><p>{entry.text}</p><div className="classification-actions">{(Object.keys(categoryLabels) as EarthRhythmCategory[]).map((category) => <button key={category} type="button" aria-pressed={selected === category} onClick={() => classify(entry.id, category)}>{categoryLabels[category]}</button>)}</div>{selected && <p className="classification-feedback" data-match={selected === entry.suggestedCategory}>Sugestão editorial: {categoryLabels[entry.suggestedCategory]}. {entry.explanation}</p>}</article>; })}</div><Button variant="ghost" onClick={skipClassification}>Concluir sem classificar</Button>{progress.classificationSkipped && <p className="field-help"><CheckCircle2 size={16}/> Classificação recusada sem perda de progresso.</p>}</Card>
    <div className="earth-work-grid"><Card title="2. Frequência mínima" eyebrow="Sem dias fixos"><div className="earth-option-list">{earthRhythmFrequencyOptions.map((option) => <button key={option.id} type="button" aria-pressed={progress.frequency === option.id} onClick={() => setFrequency(option.id)}><strong>{option.label}</strong><span>{option.description}</span></button>)}</div></Card><Card title="3. Unidade de ação" eyebrow="Pequena ou nenhuma"><div className="earth-chip-grid">{earthRhythmActionUnitOptions.map((option) => <button key={option.id} type="button" aria-pressed={progress.actionUnit === option.id} onClick={() => setActionUnit(option.id)}>{option.label}</button>)}</div></Card></div>
    <div className="earth-work-grid"><Card title="4. Pausa do ciclo" eyebrow="Interrupção sem perda"><div className="earth-chip-grid">{earthRhythmRestOptions.map((option) => <button key={option.id} type="button" aria-pressed={progress.rest === option.id} onClick={() => setRest(option.id)}><Pause size={16}/>{option.label}</button>)}</div></Card><Card title="5. Ajustar aos recursos" eyebrow="Cesto da jornada atual"><div className="earth-option-list">{earthRhythmResourceModeOptions.map((option) => <button key={option.id} type="button" aria-pressed={progress.resourceMode === option.id} onClick={() => setResourceMode(option.id)}><strong>{option.label}</strong><span>{option.description}</span></button>)}</div></Card></div>
    <Card title="6. Regra de retomada" eyebrow="Sem sequência obrigatória"><div className="earth-chip-grid">{earthRhythmResumeOptions.map((option) => <button key={option.id} type="button" aria-pressed={progress.resume === option.id} onClick={() => setResume(option.id)}><RefreshCw size={16}/>{option.label}</button>)}</div></Card>
    <Card title="7. Escolher o destino" eyebrow="Todos os resultados são completos"><div className="earth-option-list">{earthRhythmDecisionOptions.map((option) => <button key={option.id} type="button" disabled={option.id === 'try_one_cycle' && tryDisabled} aria-pressed={progress.decision === option.id} onClick={() => setDecision(option.id)}>{option.id === 'try_one_cycle' ? <Play size={17}/> : option.id === 'pause' ? <Pause size={17}/> : <Clock3 size={17}/>}<strong>{option.label}</strong><span>{option.description}</span></button>)}</div></Card>
    <Card title="Criar o Compasso do Ritmo Sustentável" eyebrow="Sem cobrança de continuidade"><div className="safety-summary"><ShieldCheck/><p>O Athanor não envia lembretes, não inicia cronômetros, não mede frequência e não pune interrupções.</p></div><div className="earth-work-actions"><Button disabled={!completeReady} onClick={complete}>Criar Compasso <Clock3 size={18}/></Button><Button variant="ghost" onClick={() => navigate('/temple/garden')}>Voltar ao Jardim</Button></div></Card>
  </div>;
}
