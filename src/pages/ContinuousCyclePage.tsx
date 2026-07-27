import { Archive, ArrowRight, BookOpenText, CheckCircle2, Circle, Clock3, History, Layers3, MoonStar, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import {
  continuousCycleBiblicalUnit,
  continuousCycleComparisonOptions,
  continuousCycleProceduralPolicy,
  continuousCycleRestrictions,
  continuousCycleStatusOptions
} from '../content/continuousCycle';
import { hasOpenInstanceForRecord, summarizeContinuousCycles } from '../domain/continuousCycle';
import { findTrailByCycleInstance } from '../domain/continuousTrail';
import { newWorkModes, newWorkStartPoints } from '../content/newWork';
import { useContinuousCycleStore } from '../state/useContinuousCycleStore';
import { useContinuousJourneyStore } from '../state/useContinuousJourneyStore';
import { useContinuousTrailStore } from '../state/useContinuousTrailStore';

export function ContinuousCyclePage() {
  const navigate = useNavigate();
  const newWork = useContinuousJourneyStore((state) => state.progress);
  const cycleProgress = useContinuousCycleStore((state) => state.progress);
  const trailProgress = useContinuousTrailStore((state) => state.progress);
  const activate = useContinuousCycleStore((state) => state.activate);
  const compare = useContinuousCycleStore((state) => state.compare);
  const pause = useContinuousCycleStore((state) => state.pause);
  const resume = useContinuousCycleStore((state) => state.resume);
  const close = useContinuousCycleStore((state) => state.close);
  const archive = useContinuousCycleStore((state) => state.archive);

  const records = newWork?.records ?? [];
  const summary = summarizeContinuousCycles(cycleProgress);

  if (records.length === 0) {
    return <div className="page page--continuous-cycle"><PageHeader eyebrow="Fase 8.0" title="Nenhuma Nova Obra foi registrada." description="Registre primeiro um ponto possível. A jornada contínua não pode inventar uma origem nem reutilizar automaticamente um ciclo anterior."/><Card title="Registro de origem necessário" eyebrow="Ativação explícita"><p>A instância contínua sempre referencia uma Nova Obra já registrada e nunca copia respostas, notas ou componentes.</p><Button onClick={() => navigate('/temple/new-work')}>Abrir Nova Obra</Button></Card></div>;
  }

  return <div className="page page--continuous-cycle"><PageHeader eyebrow="O Ciclo que Retorna ao Templo" title="Ative uma jornada sem reiniciar o caminho." description="Cada instância referencia uma Nova Obra registrada, mantém seu próprio estado e pode ser pausada, encerrada ou arquivada sem afetar ciclos anteriores."/>
    <div className="continuous-cycle-summary">
      <Card title={continuousCycleBiblicalUnit.title} eyebrow={continuousCycleBiblicalUnit.reference}><blockquote>{continuousCycleBiblicalUnit.principle}</blockquote><p>{continuousCycleBiblicalUnit.context}</p><div className="provenance-inline"><BookOpenText size={17}/><span>A Bíblia inicia a reflexão; o registro de instâncias é uma estrutura autoral da Tehkné Solutions.</span></div></Card>
      <Card title="Estado das jornadas" eyebrow={`${cycleProgress.instances.length} instâncias`}><ul className="simple-list"><li><strong>{summary.active}</strong> ativas</li><li><strong>{summary.paused}</strong> pausadas</li><li><strong>{summary.closed}</strong> encerradas</li><li><strong>{summary.archived}</strong> arquivadas</li></ul></Card>
    </div>

    <Card title="1. Ativar um registro" eyebrow="Sem cópia do ciclo anterior"><div className="continuous-record-grid">{records.slice().reverse().map((record) => { const point = newWorkStartPoints.find((item) => item.id === record.startPoint); const mode = newWorkModes.find((item) => item.id === record.mode); const blocked = hasOpenInstanceForRecord(cycleProgress, record.id); return <article key={record.id} className="continuous-record-card"><div className="continuous-record-icon" aria-hidden="true">{record.startPoint === 'rest' ? <MoonStar/> : <Circle/>}</div><div><strong>{point?.label}</strong><p>{mode?.label}</p><small>{new Date(record.createdAt).toLocaleString('pt-BR')}</small></div><Button variant="secondary" disabled={blocked} onClick={() => activate(record)}>{blocked ? 'Jornada já aberta' : record.startPoint === 'rest' ? 'Registrar repouso' : 'Ativar jornada'}</Button></article>; })}</div></Card>

    {cycleProgress.instances.length > 0 && <Card title="2. Jornadas e histórico" eyebrow="Estados independentes"><div className="continuous-instance-list">{cycleProgress.instances.slice().reverse().map((instance) => { const record = records.find((item) => item.id === instance.sourceRecordId); const point = newWorkStartPoints.find((item) => item.id === instance.startPoint); const mode = newWorkModes.find((item) => item.id === instance.sourceMode); const status = continuousCycleStatusOptions.find((item) => item.id === instance.status); const trail = findTrailByCycleInstance(trailProgress, instance.id); return <article key={instance.id} className={`continuous-instance continuous-instance--${instance.status}`}><header><div className="continuous-record-icon" aria-hidden="true">{instance.status === 'active' ? <Sparkles/> : instance.status === 'paused' ? <Clock3/> : instance.status === 'closed' ? <CheckCircle2/> : <Archive/>}</div><div><p className="eyebrow">{status?.label}</p><h3>{point?.label}</h3><p>{mode?.label}</p></div></header><p>{status?.description}</p><dl className="continuous-instance-meta"><div><dt>Registro de origem</dt><dd><code>{record?.id ?? instance.sourceRecordId}</code></dd></div><div><dt>Ciclo do Espírito</dt><dd><code>{instance.sourceSpiritCycleId}</code></dd></div><div><dt>Semente curada</dt><dd><code>{instance.contentSeed}</code></dd></div><div><dt>Rastro</dt><dd>{trail ? trail.continuousTrailTraceCreated ? 'criado' : trail.status : 'não iniciado'}</dd></div></dl><div className="continuous-comparison" role="group" aria-label={`Comparação da jornada ${point?.label}`}>{continuousCycleComparisonOptions.map((option) => <button key={option.id} type="button" aria-pressed={instance.comparison === option.id} onClick={() => compare(instance.id, option.id)}><strong>{option.label}</strong><small>{option.description}</small></button>)}</div><div className="continuous-instance-actions">{instance.startPoint !== 'rest' && ['active', 'paused'].includes(instance.status) && <Button variant="secondary" onClick={() => navigate(point?.route ?? '/temple')}>Abrir ambiente <ArrowRight size={17}/></Button>}{(trail || instance.status === 'active') && instance.startPoint !== 'rest' && <Button variant="secondary" onClick={() => navigate(`/temple/continuous-cycles/${instance.id}/trail`)}>{trail ? trail.continuousTrailTraceCreated ? 'Abrir Rastro' : 'Continuar Rastro' : 'Desdobrar jornada'}</Button>}{trail?.continuousTrailTraceCreated && <Button variant="secondary" onClick={() => navigate(`/temple/continuous-cycles/${instance.id}/trail/theme-cycle`)}><Layers3 size={17}/> Ciclo temático</Button>}{instance.status === 'active' && <Button variant="ghost" onClick={() => pause(instance.id)}>Pausar</Button>}{instance.status === 'paused' && instance.startPoint !== 'rest' && <Button variant="ghost" onClick={() => resume(instance.id)}><RefreshCw size={17}/> Retomar</Button>}{['active', 'paused'].includes(instance.status) && <Button variant="ghost" onClick={() => close(instance.id)}>Encerrar</Button>}{instance.status !== 'archived' && <Button variant="ghost" onClick={() => archive(instance.id)}><Archive size={17}/> Arquivar</Button>}</div></article>; })}</div></Card>}

    <Card title="Fundação procedural futura" eyebrow="Conteúdo curado"><div className="safety-summary"><History/><p>{continuousCycleProceduralPolicy.description}</p></div><ul className="simple-list"><li>Política: <code>{continuousCycleProceduralPolicy.source}</code></li><li>Etapas permitidas: {continuousCycleProceduralPolicy.allowedStages.join(', ')}</li><li>Cópia do ciclo anterior: não</li></ul></Card>
    <Card title="Limites do ciclo contínuo" eyebrow="Sem progressão por repetição"><div className="safety-summary"><ShieldCheck/><p>Nenhum número de ativações, retomadas ou ciclos aumenta nível, restauração ou recompensa.</p></div><ul className="simple-list">{continuousCycleRestrictions.map((restriction) => <li key={restriction}>{restriction}</li>)}</ul><div className="continuous-instance-actions"><Button variant="secondary" onClick={() => navigate('/temple/new-work')}>Registrar outra Nova Obra</Button><Button variant="ghost" onClick={() => navigate('/temple')}>Voltar ao Átrio</Button></div></Card>
  </div>;
}
