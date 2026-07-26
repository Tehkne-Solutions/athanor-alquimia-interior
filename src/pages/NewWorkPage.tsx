import { BookOpenText, CheckCircle2, Circle, History, MoonStar, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { newWorkBiblicalUnit, newWorkModes, newWorkRestrictions, newWorkStartPoints } from '../content/newWork';
import { canRegisterNewWork } from '../domain/continuousJourney';
import { useContinuousJourneyStore } from '../state/useContinuousJourneyStore';
import { useSpiritChapterStore } from '../state/useSpiritChapterStore';

export function NewWorkPage() {
  const navigate = useNavigate();
  const spiritChapter = useSpiritChapterStore((state) => state.progress);
  const storedProgress = useContinuousJourneyStore((state) => state.progress);
  const start = useContinuousJourneyStore((state) => state.start);
  const selectStartPoint = useContinuousJourneyStore((state) => state.selectStartPoint);
  const selectMode = useContinuousJourneyStore((state) => state.selectMode);
  const register = useContinuousJourneyStore((state) => state.register);

  const sourceSpiritCycleId = spiritChapter?.status === 'completed'
    ? spiritChapter.cycleId ?? spiritChapter.completedAt
    : undefined;
  const progress = sourceSpiritCycleId && storedProgress?.sourceSpiritCycleId === sourceSpiritCycleId
    ? storedProgress
    : undefined;

  if (!sourceSpiritCycleId) {
    return <div className="page page--new-work"><PageHeader eyebrow="Nova Obra" title="O modo contínuo ainda está fechado." description="Conclua a revisão geral do Espírito depois de integrar e posicionar o Orbe."/><Card title="Dependência da jornada" eyebrow="Primeiro ciclo do Espírito"><Button onClick={() => navigate('/review/spirit-chapter')}>Abrir revisão do Espírito</Button></Card></div>;
  }

  if (!progress) {
    return <div className="page page--new-work"><PageHeader eyebrow="Nova Obra" title="O Templo pode continuar sem apagar o caminho." description="Escolha novos pontos de partida somente quando fizer sentido. Nenhuma missão será reiniciada automaticamente."/><div className="new-work-intro-grid"><Card title={newWorkBiblicalUnit.title} eyebrow={newWorkBiblicalUnit.reference}><blockquote>{newWorkBiblicalUnit.principle}</blockquote><p>{newWorkBiblicalUnit.context}</p><div className="provenance-inline"><BookOpenText size={17}/><span>A Bíblia inicia esta fundação; o modo contínuo é uma estrutura autoral da Tehkné Solutions.</span></div></Card><Card title="Abrir o modo contínuo" eyebrow="Histórico preservado"><div className="new-work-symbol" aria-hidden="true"><History/></div><p>O Templo manterá ciclos, itens e destinos anteriores. A seleção registra apenas um próximo ponto possível.</p><Button onClick={() => start(sourceSpiritCycleId)}>Abrir a Nova Obra</Button></Card></div></div>;
  }

  const selectedPoint = newWorkStartPoints.find((item) => item.id === progress.selectedStartPoint);
  const latestRecord = progress.records.at(-1);
  const latestPoint = latestRecord ? newWorkStartPoints.find((item) => item.id === latestRecord.startPoint) : undefined;
  const ready = canRegisterNewWork(progress);

  return <div className="page page--new-work"><PageHeader eyebrow="Modo contínuo do Templo Astral" title="Escolha um novo ponto possível." description="Revisitar, observar, preparar um novo ciclo ou repousar são escolhas igualmente válidas."/>
    <Card title="1. Ponto de partida" eyebrow="Nenhum reinício automático"><div className="new-work-option-grid">{newWorkStartPoints.map((option) => <button key={option.id} type="button" aria-pressed={progress.selectedStartPoint === option.id} onClick={() => selectStartPoint(option.id)}>{option.id === 'rest' ? <MoonStar/> : <Circle/>}<span><strong>{option.label}</strong><small>{option.description}</small></span></button>)}</div></Card>
    <Card title="2. Forma de retorno" eyebrow="Escolha revisável"><div className="new-work-option-grid">{newWorkModes.map((option) => { const blocked = progress.selectedStartPoint === 'rest' ? option.id !== 'rest_without_start' : option.id === 'rest_without_start'; return <button key={option.id} type="button" disabled={blocked} aria-pressed={progress.selectedMode === option.id} onClick={() => selectMode(option.id)}><CheckCircle2/><span><strong>{option.label}</strong><small>{option.description}</small></span></button>; })}</div></Card>
    <Card title="Registrar a Nova Obra" eyebrow="Sem apagar ciclos"><div className="safety-summary"><ShieldCheck/><p>O registro não inicia cronômetro, missão, mensagem ou ação externa. Ele apenas preserva uma escolha local.</p></div><div className="new-work-actions"><Button disabled={!ready} onClick={register}>Registrar ponto possível</Button><Button variant="ghost" onClick={() => navigate('/temple')}>Voltar ao Átrio</Button></div>{!ready && <p className="field-help">Escolha um ponto e uma forma compatível de retorno.</p>}</Card>
    {latestRecord && latestPoint && <Card title="Última Nova Obra registrada" eyebrow="Histórico local preservado"><div className="new-work-latest"><CheckCircle2/><div><strong>{latestPoint.label}</strong><p>{newWorkModes.find((mode) => mode.id === latestRecord.mode)?.label}</p><small>{new Date(latestRecord.createdAt).toLocaleString('pt-BR')}</small></div></div><Button variant="secondary" onClick={() => navigate(latestPoint.route)}>Abrir {latestPoint.label}</Button></Card>}
    {progress.records.length > 0 && <Card title="Histórico de pontos" eyebrow={`${progress.records.length} registros`}><ul className="simple-list">{progress.records.slice().reverse().map((record) => { const point = newWorkStartPoints.find((item) => item.id === record.startPoint); const mode = newWorkModes.find((item) => item.id === record.mode); return <li key={record.id}><strong>{point?.label}</strong> · {mode?.label}</li>; })}</ul></Card>}
    <Card title="Limites do modo contínuo" eyebrow="Autonomia"><ul className="simple-list">{newWorkRestrictions.map((restriction) => <li key={restriction}>{restriction}</li>)}</ul>{selectedPoint && <p className="muted">Seleção atual: {selectedPoint.label}. Ela ainda não foi registrada.</p>}</Card>
  </div>;
}
