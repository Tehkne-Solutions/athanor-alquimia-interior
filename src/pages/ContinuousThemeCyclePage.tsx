import { BookOpenText, CheckCircle2, Circle, Clock3, Layers3, Pause, Play, ShieldCheck, SkipForward } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import {
  continuousThemeCycleBiblicalUnit,
  continuousThemeCycleCatalog,
  continuousThemeCycleRestrictions,
  getContinuousThemeCyclePackages
} from '../content/continuousThemeCycle';
import { newWorkStartPoints } from '../content/newWork';
import {
  findOpenContinuousThemeCycle,
  getContinuousThemeCyclesByTrail,
  summarizeContinuousThemeCycle,
  type ContinuousThemeCycleDepth
} from '../domain/continuousThemeCycle';
import { findTrailByCycleInstance } from '../domain/continuousTrail';
import { useContinuousThemeCycleStore } from '../state/useContinuousThemeCycleStore';
import { useContinuousTrailStore } from '../state/useContinuousTrailStore';

const statusLabels = {
  active: 'Ativo',
  paused: 'Pausado',
  completed: 'Concluído',
  declined: 'Sem ciclo adicional'
} as const;

export function ContinuousThemeCyclePage() {
  const navigate = useNavigate();
  const { instanceId } = useParams<{ instanceId: string }>();
  const [selectedPackageId, setSelectedPackageId] = useState<string>();
  const [depth, setDepth] = useState<ContinuousThemeCycleDepth>(1);
  const trailProgress = useContinuousTrailStore((state) => state.progress);
  const cycleProgress = useContinuousThemeCycleStore((state) => state.progress);
  const start = useContinuousThemeCycleStore((state) => state.start);
  const decline = useContinuousThemeCycleStore((state) => state.decline);
  const advance = useContinuousThemeCycleStore((state) => state.advance);
  const pause = useContinuousThemeCycleStore((state) => state.pause);
  const resume = useContinuousThemeCycleStore((state) => state.resume);
  const endEarly = useContinuousThemeCycleStore((state) => state.endEarly);

  const trail = instanceId ? findTrailByCycleInstance(trailProgress, instanceId) : undefined;
  const point = trail ? newWorkStartPoints.find((item) => item.id === trail.startPoint) : undefined;
  const packages = trail
    ? getContinuousThemeCyclePackages(trail.startPoint, trail.themeId, Boolean(trail.noTheme))
    : [];
  const selectedPackage = packages.find((item) => item.id === selectedPackageId) ?? packages[0];
  const openCycle = trail ? findOpenContinuousThemeCycle(cycleProgress, trail.id) : undefined;
  const history = trail ? getContinuousThemeCyclesByTrail(cycleProgress, trail.id).slice().reverse() : [];

  if (!trail) {
    return <div className="page page--continuous-theme-cycle"><PageHeader eyebrow="Fase 8.4" title="O Rastro de origem não foi encontrado." description="O ciclo temático precisa de uma instância contínua com Rastro registrado."/><Card title="Origem necessária"><Button onClick={() => navigate('/temple/continuous-cycles')}>Abrir jornadas contínuas</Button></Card></div>;
  }

  const trailReady = trail.status === 'completed' && trail.continuousTrailTraceCreated;
  const currentPassage = openCycle?.passages[openCycle.currentPassageIndex];
  const summary = openCycle ? summarizeContinuousThemeCycle(openCycle) : undefined;
  const themeLabel = trail.noTheme ? 'Sem tema' : (trail.themeId ?? 'Tema legado não registrado');

  return <div className="page page--continuous-theme-cycle">
    <PageHeader eyebrow="O Ciclo Temático que se Expande" title={`${point?.label ?? 'Jornada'} · sequência curada`} description="Escolha de uma a três passagens, mantenha a possibilidade de pausa e encerre sem recompensa baseada em profundidade ou repetição."/>

    <div className="continuous-theme-cycle-intro">
      <Card title={continuousThemeCycleBiblicalUnit.title} eyebrow={continuousThemeCycleBiblicalUnit.reference}><blockquote>{continuousThemeCycleBiblicalUnit.principle}</blockquote><p>{continuousThemeCycleBiblicalUnit.context}</p><div className="provenance-inline"><BookOpenText size={17}/><span>A Bíblia inicia a reflexão; pacotes, passagens e profundidades são estruturas autorais da Tehkné Solutions.</span></div></Card>
      <Card title="Origem preservada" eyebrow={`Catálogo ${continuousThemeCycleCatalog.version}`}><ul className="simple-list"><li><strong>Elemento:</strong> {point?.label ?? trail.startPoint}</li><li><strong>Tema:</strong> {themeLabel}</li><li><strong>Variante:</strong> {trail.contentVariantId}</li><li><strong>Rastro:</strong> {trail.id}</li></ul><div className="safety-summary"><ShieldCheck/><p>O ciclo apenas referencia esses IDs. Nenhuma resposta, nota ou decisão anterior é copiada.</p></div></Card>
    </div>

    {!trailReady && <Card title="Conclua ou passe o Rastro primeiro" eyebrow="Dependência explícita"><p>O ciclo adicional só pode ser aberto depois que orientação, observação e revisão forem encerradas no Rastro desta instância.</p><Button onClick={() => navigate(`/temple/continuous-cycles/${trail.sourceCycleInstanceId}/trail`)}>Voltar ao Rastro</Button></Card>}

    {trailReady && !openCycle && <Card title="Escolher um pacote e a profundidade" eyebrow="Ativação explícita">
      <div className="continuous-theme-package-grid" role="group" aria-label="Pacotes temáticos curados">{packages.map((item) => <button key={item.id} type="button" aria-pressed={selectedPackage?.id === item.id} onClick={() => setSelectedPackageId(item.id)}><Layers3/><span><strong>{item.label}</strong><small>{item.description}</small></span></button>)}</div>
      <div className="continuous-theme-depth" role="group" aria-label="Profundidade do ciclo">{([1, 2, 3] as ContinuousThemeCycleDepth[]).map((value) => <button key={value} type="button" aria-pressed={depth === value} onClick={() => setDepth(value)}><strong>{value}</strong><span>{value === 1 ? 'Uma passagem' : `${value} passagens`}</span></button>)}</div>
      {selectedPackage && <div className="continuous-theme-preview"><p className="eyebrow">Prévia do pacote</p><ol>{selectedPackage.passages.map((passage) => <li key={passage.id}><strong>{passage.label}</strong><span>{passage.stage}</span></li>)}</ol></div>}
      <div className="continuous-trail-actions"><Button disabled={!selectedPackage} onClick={() => selectedPackage && start(trail, selectedPackage, depth, continuousThemeCycleCatalog.version)}>Iniciar ciclo com {depth} {depth === 1 ? 'passagem' : 'passagens'}</Button><Button variant="secondary" onClick={() => decline(trail, continuousThemeCycleCatalog.version)}>Nenhum ciclo adicional</Button><Button variant="ghost" onClick={() => navigate(`/temple/continuous-cycles/${trail.sourceCycleInstanceId}/trail`)}>Voltar ao Rastro</Button></div>
      <p className="field-help">Profundidade maior não concede recompensa adicional. A ordem das passagens é curada e determinística, sem repetição dentro da mesma instância.</p>
    </Card>}

    {openCycle && currentPassage && <>
      <Card title="Progresso do ciclo" eyebrow={`${summary?.completed ?? 0} concluídas · ${summary?.passed ?? 0} passadas`}><div className="continuous-theme-passage-grid">{openCycle.passages.map((passage, index) => <article key={passage.id} className={index === openCycle.currentPassageIndex && openCycle.status !== 'completed' ? 'continuous-theme-passage continuous-theme-passage--active' : 'continuous-theme-passage'}>{passage.result === 'completed' ? <CheckCircle2/> : passage.result === 'passed' ? <SkipForward/> : openCycle.status === 'paused' && index === openCycle.currentPassageIndex ? <Clock3/> : <Circle/>}<div><strong>{passage.label}</strong><small>{passage.stage} · {passage.result}</small></div></article>)}</div><p className="muted">Pacote: <code>{openCycle.packageId}</code> · profundidade {openCycle.depth}</p></Card>
      <Card title={currentPassage.label} eyebrow={`${themeLabel} · ${trail.contentVariantId} · ${currentPassage.stage}`}><p className="continuous-theme-cycle-prompt">{currentPassage.prompt}</p>{openCycle.status === 'active' && <div className="continuous-trail-actions"><Button onClick={() => advance(openCycle.id, 'completed')}>Concluir passagem</Button><Button variant="secondary" onClick={() => advance(openCycle.id, 'passed')}>Passar passagem</Button><Button variant="ghost" onClick={() => pause(openCycle.id)}><Pause size={17}/> Pausar ciclo</Button><Button variant="ghost" onClick={() => endEarly(openCycle.id)}>Encerrar antes do fim</Button></div>}{openCycle.status === 'paused' && <div className="continuous-trail-actions"><Button onClick={() => resume(openCycle.id)}><Play size={17}/> Retomar ciclo</Button><Button variant="secondary" onClick={() => endEarly(openCycle.id)}>Encerrar preservando o histórico</Button></div>}</Card>
    </>}

    <Card title="Histórico de pacotes" eyebrow={`${history.length} registros`}><div className="continuous-theme-cycle-history">{history.length ? history.map((item) => <article key={item.id}><div><strong>{item.packageLabel ?? 'Nenhum ciclo adicional'}</strong><span>{statusLabels[item.status]} · profundidade {item.depth}</span></div><small>{item.catalogVersion} · {item.id}</small>{item.endedEarly && <em>Encerrado antes do fim, sem perda.</em>}</article>) : <p>Nenhum pacote foi registrado para este Rastro.</p>}</div></Card>

    <Card title="Limites do ciclo temático" eyebrow="Conteúdo curado"><ul className="simple-list">{continuousThemeCycleRestrictions.map((restriction) => <li key={restriction}>{restriction}</li>)}</ul><div className="safety-summary"><ShieldCheck/><p>O ciclo não representa evolução, maturidade, cura, produtividade ou direção espiritual. Todos os registros permanecem locais.</p></div></Card>
  </div>;
}
