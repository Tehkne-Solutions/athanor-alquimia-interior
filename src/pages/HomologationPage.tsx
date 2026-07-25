import { ClipboardCheck, Download, ExternalLink, RotateCcw, ShieldCheck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import {
  buildHomologationReport,
  homologationTasks,
  type HomologationMetadata,
  type HomologationRatings,
  type HomologationStatus,
  type HomologationTaskResult
} from '../domain/homologation';

const storageKey = 'athanor-homologation-session-v1';

const statusOptions: { value: HomologationStatus; label: string }[] = [
  { value: 'not-tested', label: 'Não testada' },
  { value: 'passed', label: 'Concluída' },
  { value: 'friction', label: 'Com fricção' },
  { value: 'blocked', label: 'Bloqueada' }
];

const createInitialResults = (): Record<string, HomologationTaskResult> => Object.fromEntries(
  homologationTasks.map((task) => [task.id, { status: 'not-tested', notes: '' }])
);

interface SessionState {
  metadata: HomologationMetadata;
  results: Record<string, HomologationTaskResult>;
  ratings: HomologationRatings;
  finalNotes: string;
}

const defaultSession: SessionState = {
  metadata: {
    participantCode: '',
    deviceProfile: 'notebook 1366 × 768',
    assistiveTechnology: 'nenhuma informada',
    moderator: 'Tehkné Solutions'
  },
  results: createInitialResults(),
  ratings: { comprehension: 3, navigation: 3, visualComfort: 3, trust: 3 },
  finalNotes: ''
};

function readSession(): SessionState {
  try {
    const saved = sessionStorage.getItem(storageKey);
    if (!saved) return defaultSession;
    const parsed = JSON.parse(saved) as Partial<SessionState>;
    return {
      metadata: { ...defaultSession.metadata, ...parsed.metadata },
      results: { ...defaultSession.results, ...parsed.results },
      ratings: { ...defaultSession.ratings, ...parsed.ratings },
      finalNotes: parsed.finalNotes ?? ''
    };
  } catch {
    return defaultSession;
  }
}

export function HomologationPage() {
  const [session, setSession] = useState<SessionState>(readSession);

  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify(session));
  }, [session]);

  const report = useMemo(() => buildHomologationReport(session), [session]);

  const updateResult = (taskId: string, updates: Partial<HomologationTaskResult>) => {
    setSession((current) => ({
      ...current,
      results: {
        ...current.results,
        [taskId]: { ...current.results[taskId], ...updates }
      }
    }));
  };

  const exportReport = () => {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `athanor-homologacao-${session.metadata.participantCode || 'sessao'}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const resetSession = () => {
    sessionStorage.removeItem(storageKey);
    setSession({ ...defaultSession, results: createInitialResults() });
  };

  return (
    <div className="page page--homologation">
      <PageHeader
        eyebrow="Fase 4.3 · Pesquisa moderada"
        title="Modo de Homologação"
        description="Roteiro local para validar compreensão, navegação, acessibilidade, confiança e o ciclo completo do vertical slice."
        action={<span className="local-badge"><ShieldCheck size={16}/> Dados da sessão no navegador</span>}
      />

      <div className="homologation-summary" aria-label="Resumo da sessão">
        <span><strong>{report.summary.passed}</strong> concluídas</span>
        <span><strong>{report.summary.friction}</strong> com fricção</span>
        <span><strong>{report.summary.blocked}</strong> bloqueadas</span>
        <span><strong>{report.summary['not-tested']}</strong> não testadas</span>
      </div>

      <div className="homologation-layout">
        <Card title="Identificação da sessão" eyebrow="Não use nome completo do participante">
          <div className="homologation-form-grid">
            <label className="field"><span>Código do participante</span><input value={session.metadata.participantCode} onChange={(event) => setSession((current) => ({ ...current, metadata: { ...current.metadata, participantCode: event.target.value } }))} placeholder="Ex.: P-01" /></label>
            <label className="field"><span>Perfil de dispositivo</span><select value={session.metadata.deviceProfile} onChange={(event) => setSession((current) => ({ ...current, metadata: { ...current.metadata, deviceProfile: event.target.value } }))}><option>celular 360 × 800</option><option>celular 390 × 844</option><option>tablet 768 × 1024</option><option>notebook 1366 × 768</option><option>desktop 1440 × 900</option></select></label>
            <label className="field"><span>Tecnologia assistiva</span><input value={session.metadata.assistiveTechnology} onChange={(event) => setSession((current) => ({ ...current, metadata: { ...current.metadata, assistiveTechnology: event.target.value } }))} /></label>
            <label className="field"><span>Moderador</span><input value={session.metadata.moderator} onChange={(event) => setSession((current) => ({ ...current, metadata: { ...current.metadata, moderator: event.target.value } }))} /></label>
          </div>
          <p className="muted">O relatório não lê o Diário, check-ins, missão ativa ou inventário do participante.</p>
        </Card>

        <Card title="Avaliação geral" eyebrow="Escala de 1 a 5">
          <div className="rating-grid">
            {(Object.keys(session.ratings) as Array<keyof HomologationRatings>).map((key) => {
              const labels: Record<keyof HomologationRatings, string> = { comprehension: 'Compreensão', navigation: 'Navegação', visualComfort: 'Conforto visual', trust: 'Confiança' };
              return <label className="field" key={key}><span>{labels[key]}</span><select value={session.ratings[key]} onChange={(event) => setSession((current) => ({ ...current, ratings: { ...current.ratings, [key]: Number(event.target.value) } }))}>{[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}</option>)}</select></label>;
            })}
          </div>
        </Card>
      </div>

      <section className="homologation-tasks" aria-labelledby="homologation-tasks-title">
        <div className="section-heading"><div><p className="eyebrow">Roteiro principal</p><h2 id="homologation-tasks-title">Tarefas da sessão</h2></div><p>Peça para a pessoa pensar em voz alta. Evite ensinar a interface antes da tentativa.</p></div>
        {homologationTasks.map((task, index) => {
          const result = session.results[task.id];
          return (
            <article className={`homologation-task homologation-task--${result.status}`} key={task.id}>
              <div className="homologation-task__number" aria-hidden="true">{index + 1}</div>
              <div className="homologation-task__content">
                <p className="eyebrow">{task.category}</p>
                <h3>{task.title}</h3>
                <p>{task.expectedOutcome}</p>
                <a className="task-link" href={task.path} target="_blank" rel="noreferrer">Abrir tarefa em nova aba <ExternalLink size={15}/></a>
              </div>
              <div className="homologation-task__result">
                <label className="field"><span>Resultado</span><select value={result.status} onChange={(event) => updateResult(task.id, { status: event.target.value as HomologationStatus })}>{statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
                <label className="field"><span>Observações</span><textarea value={result.notes} onChange={(event) => updateResult(task.id, { notes: event.target.value })} placeholder="Comportamento observado, frase do participante ou ponto de fricção." /></label>
              </div>
            </article>
          );
        })}
      </section>

      <Card title="Síntese da sessão" eyebrow="Decisões para a próxima sprint">
        <label className="field"><span>Achados, prioridades e recomendações</span><textarea value={session.finalNotes} onChange={(event) => setSession((current) => ({ ...current, finalNotes: event.target.value }))} placeholder="Registre somente observações necessárias para melhorar o produto." /></label>
        <div className="homologation-actions">
          <Button variant="ghost" onClick={resetSession}><RotateCcw size={17}/> Limpar sessão</Button>
          <Button onClick={exportReport}><Download size={17}/> Exportar relatório JSON</Button>
        </div>
      </Card>

      <div className="homologation-footer"><ClipboardCheck size={18}/><span>Ferramenta interna de pesquisa · Tehkné Solutions</span></div>
    </div>
  );
}
