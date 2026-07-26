import { BookOpenText, CheckCircle2, Circle, Clock3, Pause, Play, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import {
  continuousTrailBiblicalUnit,
  continuousTrailRestrictions,
  continuousTrailTraceDefinition,
  continuousTrailVariants,
  getContinuousTrailPractices,
  selectContinuousTrailVariant
} from '../content/continuousTrail';
import {
  canCompleteContinuousTrailStage,
  findTrailByCycleInstance,
  summarizeContinuousTrail,
  type ContinuousTrailStage
} from '../domain/continuousTrail';
import { newWorkModes, newWorkStartPoints } from '../content/newWork';
import { useContinuousCycleStore } from '../state/useContinuousCycleStore';
import { useContinuousTrailStore } from '../state/useContinuousTrailStore';

const stageLabels: Record<ContinuousTrailStage, string> = {
  orientation: 'Orientação',
  observation: 'Observação',
  review: 'Revisão'
};

export function ContinuousTrailPage() {
  const navigate = useNavigate();
  const { instanceId } = useParams<{ instanceId: string }>();
  const cycleProgress = useContinuousCycleStore((state) => state.progress);
  const trailProgress = useContinuousTrailStore((state) => state.progress);
  const start = useContinuousTrailStore((state) => state.start);
  const selectPractice = useContinuousTrailStore((state) => state.selectPractice);
  const chooseNoPractice = useContinuousTrailStore((state) => state.chooseNoPractice);
  const advance = useContinuousTrailStore((state) => state.advance);
  const pause = useContinuousTrailStore((state) => state.pause);
  const resume = useContinuousTrailStore((state) => state.resume);

  const cycle = cycleProgress.instances.find((instance) => instance.id === instanceId);

  if (!cycle) {
    return <div className="page page--continuous-trail"><PageHeader eyebrow="Fase 8.1" title="A instância contínua não foi encontrada." description="O Rastro precisa de uma jornada registrada. Nenhum ciclo anterior será escolhido ou copiado automaticamente."/><Card title="Origem necessária" eyebrow="Instância separada"><p>Volte ao registro de jornadas contínuas para ativar ou selecionar uma instância existente.</p><Button onClick={() => navigate('/temple/continuous-cycles')}>Abrir jornadas contínuas</Button></Card></div>;
  }

  const point = newWorkStartPoints.find((item) => item.id === cycle.startPoint);
  const mode = newWorkModes.find((item) => item.id === cycle.sourceMode);
  const trail = findTrailByCycleInstance(trailProgress, cycle.id);
  const selectedVariant = trail
    ? continuousTrailVariants.find((variant) => variant.id === trail.contentVariantId) ?? selectContinuousTrailVariant(cycle.contentSeed, cycle.startPoint)
    : selectContinuousTrailVariant(cycle.contentSeed, cycle.startPoint);

  if (!trail) {
    const canStart = cycle.status === 'active';
    return <div className="page page--continuous-trail"><PageHeader eyebrow="A Jornada que se Desdobra" title={`${point?.label ?? 'Jornada'} · conteúdo curado por semente`} description="Orientação, observação e revisão permanecem separadas por instância. Nenhuma resposta anterior é reutilizada."/>
      <div className="continuous-trail-intro-grid">
        <Card title={continuousTrailBiblicalUnit.title} eyebrow={continuousTrailBiblicalUnit.reference}><blockquote>{continuousTrailBiblicalUnit.principle}</blockquote><p>{continuousTrailBiblicalUnit.context}</p><div className="provenance-inline"><BookOpenText size={17}/><span>A Bíblia inicia a reflexão; as variantes e práticas são estruturas autorais da Tehkné Solutions.</span></div></Card>
        <Card title="Variante selecionada" eyebrow={selectedVariant.id}><ul className="simple-list"><li><strong>Orientação:</strong> {selectedVariant.orientation}</li><li><strong>Observação:</strong> {selectedVariant.observation}</li><li><strong>Revisão:</strong> {selectedVariant.review}</li></ul><p className="muted">Origem: {point?.label} · {mode?.label}. A semente utiliza somente metadados curados da instância.</p></Card>
      </div>
      <Card title="Abrir o desdobramento" eyebrow="Ativação explícita"><div className="safety-summary"><ShieldCheck/><p>Iniciar não reinicia a missão do elemento e não copia respostas, notas ou destinos anteriores.</p></div><Button disabled={!canStart} onClick={() => start(cycle, selectedVariant.id)}>{canStart ? 'Iniciar orientação' : 'A jornada de origem precisa estar ativa'}</Button>{!canStart && <p className="field-help">Retome a instância na tela de jornadas contínuas ou mantenha-a pausada sem perda.</p>}</Card>
    </div>;
  }

  const practices = getContinuousTrailPractices(cycle.startPoint);
  const summary = summarizeContinuousTrail(trail);
  const stagePrompt = selectedVariant[trail.currentStage];
  const cycleAllowsProgress = cycle.status === 'active';
  const canAct = cycleAllowsProgress && trail.status === 'active';
  const canComplete = canAct && canCompleteContinuousTrailStage(trail);

  return <div className="page page--continuous-trail"><PageHeader eyebrow="Rastro da Jornada Contínua" title={`${point?.label ?? 'Jornada'} · ${stageLabels[trail.currentStage]}`} description="Escolher uma prática, passar, pausar ou permanecer sem prática são caminhos completos e sem pontuação diferente."/>
    <Card title="Progresso desta instância" eyebrow={`${summary.completed} concluídas · ${summary.passed} passadas`}><div className="continuous-trail-stage-grid">{(['orientation', 'observation', 'review'] as ContinuousTrailStage[]).map((stage) => { const state = trail.stages[stage]; const active = trail.currentStage === stage && trail.status !== 'completed'; return <article key={stage} className={active ? 'continuous-trail-stage continuous-trail-stage--active' : 'continuous-trail-stage'}>{state.result === 'completed' ? <CheckCircle2/> : state.result === 'passed' ? <Sparkles/> : state.result === 'paused' ? <Clock3/> : <Circle/>}<div><strong>{stageLabels[stage]}</strong><small>{state.result}</small></div></article>; })}</div><p className="muted">Instância: <code>{trail.sourceCycleInstanceId}</code></p></Card>

    {trail.status !== 'completed' && <Card title={stageLabels[trail.currentStage]} eyebrow={selectedVariant.id}><p className="continuous-trail-prompt">{stagePrompt}</p>{trail.currentStage === 'orientation' && <div className="continuous-trail-practice-grid" role="group" aria-label="Práticas curadas disponíveis">{practices.map((practice) => <button key={practice.id} type="button" disabled={!canAct} aria-pressed={trail.practiceId === practice.id} onClick={() => selectPractice(trail.id, practice.id)}><Circle/><span><strong>{practice.label}</strong><small>{practice.description}</small></span></button>)}<button type="button" disabled={!canAct} aria-pressed={trail.noPractice} onClick={() => chooseNoPractice(trail.id)}><Pause/><span><strong>Permanecer sem prática</strong><small>Continuar ou passar sem escolher uma atividade.</small></span></button></div>}
      {!cycleAllowsProgress && <div className="safety-summary"><Clock3/><p>A instância de origem está {cycle.status}. O Rastro permanece preservado e não pode avançar até uma retomada explícita.</p></div>}
      {trail.status === 'paused' && <div className="continuous-trail-actions"><Button disabled={!cycleAllowsProgress} onClick={() => resume(trail.id)}><Play size={17}/> Retomar etapa</Button><Button variant="ghost" onClick={() => navigate('/temple/continuous-cycles')}>Voltar às jornadas</Button></div>}
      {trail.status === 'active' && <div className="continuous-trail-actions"><Button disabled={!canComplete} onClick={() => advance(trail.id, 'completed')}>Concluir etapa</Button><Button variant="secondary" disabled={!canAct} onClick={() => advance(trail.id, 'passed')}>Passar etapa</Button><Button variant="ghost" disabled={!canAct} onClick={() => pause(trail.id)}><Pause size={17}/> Pausar</Button></div>}
      {trail.currentStage === 'orientation' && trail.status === 'active' && !canComplete && <p className="field-help">Escolha uma prática curada, marque ausência de prática ou passe a etapa.</p>}</Card>}

    {trail.status === 'completed' && <Card title={continuousTrailTraceDefinition.label} eyebrow="Componente contínuo criado"><div className="continuous-trail-complete"><CheckCircle2/><div><strong>Orientação, observação e revisão foram encerradas nesta instância.</strong><p>{continuousTrailTraceDefinition.description}</p></div></div><p>{continuousTrailTraceDefinition.rewardPolicy}</p><div className="continuous-trail-actions"><Button variant="secondary" onClick={() => navigate('/temple/continuous-cycles')}>Voltar às jornadas</Button><Button variant="ghost" onClick={() => navigate(point?.route ?? '/temple')}>Abrir {point?.label ?? 'ambiente'}</Button></div></Card>}

    <Card title="Limites do desdobramento" eyebrow="Conteúdo curado"><ul className="simple-list">{continuousTrailRestrictions.map((restriction) => <li key={restriction}>{restriction}</li>)}</ul><div className="safety-summary"><ShieldCheck/><p>O Rastro registra somente o percurso desta instância. Não representa evolução, coerência, cura ou direção espiritual.</p></div></Card>
  </div>;
}
