import { BookOpenText, CheckCircle2, Circle, Clock3, History, Pause, Play, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import {
  continuousThemeBiblicalUnit,
  continuousThemeCatalog,
  continuousThemeRestrictions,
  getContinuousThemes,
  type ContinuousThemeOption
} from '../content/continuousTheme';
import {
  continuousTrailBiblicalUnit,
  continuousTrailRestrictions,
  continuousTrailTraceDefinition,
  continuousTrailVariants,
  getContinuousTrailPractices,
  selectContinuousTrailVariant
} from '../content/continuousTrail';
import {
  continuousTrailCatalogDefinition,
  continuousVariationBiblicalUnit,
  continuousVariationRestrictions
} from '../content/continuousVariation';
import {
  canCompleteContinuousTrailStage,
  findTrailByCycleInstance,
  getContinuousTrailThemeHistory,
  getContinuousTrailVariantHistory,
  isContinuousTrailThemeResolved,
  summarizeContinuousTrail,
  type ContinuousTrailStage,
  type ContinuousTrailThemeAction,
  type ContinuousTrailVariantAction
} from '../domain/continuousTrail';
import { newWorkModes, newWorkStartPoints } from '../content/newWork';
import { useContinuousCycleStore } from '../state/useContinuousCycleStore';
import { useContinuousTrailStore } from '../state/useContinuousTrailStore';

const stageLabels: Record<ContinuousTrailStage, string> = {
  orientation: 'Orientação',
  observation: 'Observação',
  review: 'Revisão'
};

const variantActionLabels: Record<ContinuousTrailVariantAction, string> = {
  initial: 'Variante inicial',
  kept: 'Mantida explicitamente',
  rotated: 'Outra variante solicitada'
};

const themeActionLabels: Record<ContinuousTrailThemeAction, string> = {
  selected: 'Tema selecionado',
  kept: 'Tema mantido',
  rotated: 'Outro tema solicitado',
  cleared: 'Tema removido',
  passed_without_theme: 'Orientação passada sem tema'
};

function getThemeLens(theme: ContinuousThemeOption, stage: ContinuousTrailStage): string {
  if (stage === 'orientation') return theme.orientationLens;
  if (stage === 'observation') return theme.observationLens;
  return theme.reviewLens;
}

export function ContinuousTrailPage() {
  const navigate = useNavigate();
  const { instanceId } = useParams<{ instanceId: string }>();
  const cycleProgress = useContinuousCycleStore((state) => state.progress);
  const trailProgress = useContinuousTrailStore((state) => state.progress);
  const start = useContinuousTrailStore((state) => state.start);
  const keepVariant = useContinuousTrailStore((state) => state.keepVariant);
  const requestVariant = useContinuousTrailStore((state) => state.requestVariant);
  const selectTheme = useContinuousTrailStore((state) => state.selectTheme);
  const chooseNoTheme = useContinuousTrailStore((state) => state.chooseNoTheme);
  const keepTheme = useContinuousTrailStore((state) => state.keepTheme);
  const requestTheme = useContinuousTrailStore((state) => state.requestTheme);
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
  const candidateVariantIds = continuousTrailVariants
    .filter((variant) => variant.startPoint === cycle.startPoint)
    .map((variant) => variant.id);
  const themes = getContinuousThemes(cycle.startPoint);
  const candidateThemeIds = themes.map((theme) => theme.id);

  if (!trail) {
    const canStart = cycle.status === 'active';
    return <div className="page page--continuous-trail"><PageHeader eyebrow="A Jornada que se Desdobra" title={`${point?.label ?? 'Jornada'} · conteúdo curado por semente`} description="Orientação, observação e revisão permanecem separadas por instância. Nenhuma resposta anterior é reutilizada."/>
      <div className="continuous-trail-intro-grid">
        <Card title={continuousTrailBiblicalUnit.title} eyebrow={continuousTrailBiblicalUnit.reference}><blockquote>{continuousTrailBiblicalUnit.principle}</blockquote><p>{continuousTrailBiblicalUnit.context}</p><div className="provenance-inline"><BookOpenText size={17}/><span>A Bíblia inicia a reflexão; as variantes e práticas são estruturas autorais da Tehkné Solutions.</span></div></Card>
        <Card title="Variante selecionada" eyebrow={selectedVariant.id}><ul className="simple-list"><li><strong>Orientação:</strong> {selectedVariant.orientation}</li><li><strong>Observação:</strong> {selectedVariant.observation}</li><li><strong>Revisão:</strong> {selectedVariant.review}</li></ul><p className="muted">Catálogo {continuousTrailCatalogDefinition.version} · {point?.label} · {mode?.label}. A semente utiliza somente metadados curados da instância.</p></Card>
        <Card title={continuousVariationBiblicalUnit.title} eyebrow={continuousVariationBiblicalUnit.reference}><blockquote>{continuousVariationBiblicalUnit.principle}</blockquote><p>{continuousVariationBiblicalUnit.context}</p><div className="safety-summary"><History/><p>Depois de iniciar, a variante poderá ser mantida ou trocada por outra versão curada sem alterar o progresso.</p></div></Card>
        <Card title={continuousThemeBiblicalUnit.title} eyebrow={continuousThemeBiblicalUnit.reference}><blockquote>{continuousThemeBiblicalUnit.principle}</blockquote><p>{continuousThemeBiblicalUnit.context}</p><div className="safety-summary"><ShieldCheck/><p>O tema será escolhido explicitamente depois da abertura do Rastro. Permanecer sem tema também será válido.</p></div></Card>
      </div>
      <Card title="Abrir o desdobramento" eyebrow="Ativação explícita"><div className="safety-summary"><ShieldCheck/><p>Iniciar não reinicia a missão do elemento e não copia respostas, notas ou destinos anteriores.</p></div><Button disabled={!canStart} onClick={() => start(cycle, selectedVariant.id, continuousTrailCatalogDefinition.version)}>{canStart ? 'Iniciar orientação' : 'A jornada de origem precisa estar ativa'}</Button>{!canStart && <p className="field-help">Retome a instância na tela de jornadas contínuas ou mantenha-a pausada sem perda.</p>}</Card>
    </div>;
  }

  const practices = getContinuousTrailPractices(cycle.startPoint);
  const summary = summarizeContinuousTrail(trail);
  const stagePrompt = selectedVariant[trail.currentStage];
  const cycleAllowsProgress = cycle.status === 'active';
  const canAct = cycleAllowsProgress && trail.status === 'active';
  const canComplete = canAct && canCompleteContinuousTrailStage(trail);
  const variantHistory = getContinuousTrailVariantHistory(trail);
  const canChangeVariant = canAct && candidateVariantIds.length > 1;
  const selectedTheme = themes.find((theme) => theme.id === trail.themeId);
  const themeHistory = getContinuousTrailThemeHistory(trail);
  const themeResolved = isContinuousTrailThemeResolved(trail);
  const canKeepTheme = canAct && Boolean(trail.themeId || trail.noTheme);
  const canRotateTheme = canAct && Boolean(trail.themeId) && candidateThemeIds.length > 1;
  const themeLabel = selectedTheme?.label ?? (trail.noTheme ? 'Sem tema' : 'Sem tema registrado');
  const themeLens = selectedTheme ? getThemeLens(selectedTheme, trail.currentStage) : undefined;
  const combinedSignature = `${cycle.startPoint} · ${trail.themeId ?? 'no-theme'} · ${trail.contentVariantId}`;

  return <div className="page page--continuous-trail"><PageHeader eyebrow="Rastro da Jornada Contínua" title={`${point?.label ?? 'Jornada'} · ${stageLabels[trail.currentStage]}`} description="Tema, variante e prática permanecem independentes. Escolher, passar, pausar ou permanecer sem tema e prática são caminhos completos."/>
    <Card title="Progresso desta instância" eyebrow={`${summary.completed} concluídas · ${summary.passed} passadas`}><div className="continuous-trail-stage-grid">{(['orientation', 'observation', 'review'] as ContinuousTrailStage[]).map((stage) => { const state = trail.stages[stage]; const active = trail.currentStage === stage && trail.status !== 'completed'; return <article key={stage} className={active ? 'continuous-trail-stage continuous-trail-stage--active' : 'continuous-trail-stage'}>{state.result === 'completed' ? <CheckCircle2/> : state.result === 'passed' ? <Sparkles/> : state.result === 'paused' ? <Clock3/> : <Circle/>}<div><strong>{stageLabels[stage]}</strong><small>{state.result}</small></div></article>; })}</div><p className="muted">Instância: <code>{trail.sourceCycleInstanceId}</code></p></Card>

    <Card title="O Tema que Orienta sem Determinar" eyebrow={`Catálogo temático ${trail.themeCatalogVersion ?? continuousThemeCatalog.version}`}>
      <div className="continuous-theme-grid">
        <div>
          <p className="eyebrow">Tema atual</p><h3>{themeLabel}</h3>
          {selectedTheme ? <><p>{selectedTheme.description}</p><div className="continuous-theme-lens"><strong>Lente desta etapa</strong><span>{themeLens}</span></div></> : <p>A jornada permanece sem uma lente temática adicional. A variante continua disponível integralmente.</p>}
          <p className="muted">Combinação curada: <code>{combinedSignature}</code></p>
          <div className="continuous-trail-actions"><Button disabled={!canKeepTheme} onClick={() => keepTheme(trail.id, continuousThemeCatalog.version)}>Manter estado temático</Button><Button variant="secondary" disabled={!canRotateTheme} onClick={() => requestTheme(trail.id, candidateThemeIds, continuousThemeCatalog.version)}><RefreshCw size={17}/> Solicitar outro tema</Button></div>
        </div>
        <div>
          <p className="eyebrow">Histórico temático</p>
          <ol className="continuous-variation-history">{themeHistory.length ? themeHistory.slice().reverse().map((entry) => <li key={`${entry.sequence}-${entry.selectedAt}`}><strong>{entry.themeId ?? 'Sem tema'}</strong><span>{themeActionLabels[entry.action]} · catálogo {entry.catalogVersion}</span></li>) : <li><strong>Nenhuma escolha registrada</strong><span>Rastro legado ou orientação ainda não resolvida.</span></li>}</ol>
        </div>
      </div>
      {trail.status !== 'completed' && <div className="continuous-theme-options" role="group" aria-label="Temas curados disponíveis">{themes.map((theme) => <button key={theme.id} type="button" disabled={!canAct} aria-pressed={trail.themeId === theme.id} onClick={() => selectTheme(trail.id, theme.id, continuousThemeCatalog.version)}><Circle/><span><strong>{theme.label}</strong><small>{theme.description}</small></span></button>)}<button type="button" disabled={!canAct} aria-pressed={Boolean(trail.noTheme)} onClick={() => chooseNoTheme(trail.id, continuousThemeCatalog.version)}><Pause/><span><strong>Sem tema</strong><small>Usar somente o conteúdo da variante, sem lente adicional.</small></span></button></div>}
      <div className="safety-summary"><ShieldCheck/><p>O tema é escolhido manualmente. Nenhuma resposta, emoção, nota ou decisão anterior participa da seleção ou da rotação.</p></div>
    </Card>

    <Card title="A Variação que Preserva o Núcleo" eyebrow={`Catálogo ${trail.catalogVersion ?? continuousTrailCatalogDefinition.version}`}><div className="continuous-variation-grid"><div><p className="eyebrow">Variante atual</p><h3>{selectedVariant.id}</h3><p>{selectedVariant[trail.currentStage]}</p><div className="continuous-trail-actions"><Button disabled={!canChangeVariant} onClick={() => keepVariant(trail.id, continuousTrailCatalogDefinition.version)}>Manter variante atual</Button><Button variant="secondary" disabled={!canChangeVariant} onClick={() => requestVariant(trail.id, candidateVariantIds, continuousTrailCatalogDefinition.version)}><RefreshCw size={17}/> Solicitar outra variante</Button></div>{!canChangeVariant && trail.status !== 'completed' && <p className="field-help">A rotação fica disponível quando a instância e o Rastro estão ativos.</p>}</div><div><p className="eyebrow">Histórico auditável</p><ol className="continuous-variation-history">{variantHistory.slice().reverse().map((entry) => <li key={`${entry.sequence}-${entry.selectedAt}`}><strong>{entry.variantId}</strong><span>{variantActionLabels[entry.action]} · catálogo {entry.catalogVersion}</span></li>)}</ol></div></div><div className="safety-summary"><ShieldCheck/><p>Solicitar outra variante preserva tema, prática, etapa e resultados. Nenhum conteúdo pessoal participa da rotação.</p></div></Card>

    {trail.status !== 'completed' && <Card title={stageLabels[trail.currentStage]} eyebrow={`${themeLabel} · ${selectedVariant.id}`}>{themeLens && <div className="continuous-theme-lens continuous-theme-lens--stage"><strong>Lente temática opcional</strong><span>{themeLens}</span></div>}<p className="continuous-trail-prompt">{stagePrompt}</p>{trail.currentStage === 'orientation' && <div className="continuous-trail-practice-grid" role="group" aria-label="Práticas curadas disponíveis">{practices.map((practice) => <button key={practice.id} type="button" disabled={!canAct} aria-pressed={trail.practiceId === practice.id} onClick={() => selectPractice(trail.id, practice.id)}><Circle/><span><strong>{practice.label}</strong><small>{practice.description}</small></span></button>)}<button type="button" disabled={!canAct} aria-pressed={trail.noPractice} onClick={() => chooseNoPractice(trail.id)}><Pause/><span><strong>Permanecer sem prática</strong><small>Continuar ou passar sem escolher uma atividade.</small></span></button></div>}
      {!cycleAllowsProgress && <div className="safety-summary"><Clock3/><p>A instância de origem está {cycle.status}. O Rastro permanece preservado e não pode avançar até uma retomada explícita.</p></div>}
      {trail.status === 'paused' && <div className="continuous-trail-actions"><Button disabled={!cycleAllowsProgress} onClick={() => resume(trail.id)}><Play size={17}/> Retomar etapa</Button><Button variant="ghost" onClick={() => navigate('/temple/continuous-cycles')}>Voltar às jornadas</Button></div>}
      {trail.status === 'active' && <div className="continuous-trail-actions"><Button disabled={!canComplete} onClick={() => advance(trail.id, 'completed')}>Concluir etapa</Button><Button variant="secondary" disabled={!canAct} onClick={() => advance(trail.id, 'passed')}>Passar etapa</Button><Button variant="ghost" disabled={!canAct} onClick={() => pause(trail.id)}><Pause size={17}/> Pausar</Button></div>}
      {trail.currentStage === 'orientation' && trail.status === 'active' && !canComplete && <p className="field-help">Escolha um tema ou marque Sem tema; escolha também uma prática ou ausência de prática. Passar a etapa resolve ambas as escolhas sem penalidade.</p>}</Card>}

    {trail.status === 'completed' && <Card title={continuousTrailTraceDefinition.label} eyebrow="Componente contínuo criado"><div className="continuous-trail-complete"><CheckCircle2/><div><strong>Orientação, observação e revisão foram encerradas nesta instância.</strong><p>{continuousTrailTraceDefinition.description}</p></div></div><p>{continuousTrailTraceDefinition.rewardPolicy}</p><div className="continuous-trail-actions"><Button variant="secondary" onClick={() => navigate('/temple/continuous-cycles')}>Voltar às jornadas</Button><Button variant="ghost" onClick={() => navigate(point?.route ?? '/temple')}>Abrir {point?.label ?? 'ambiente'}</Button></div></Card>}

    <Card title="Limites do desdobramento" eyebrow="Conteúdo curado"><ul className="simple-list">{[...continuousTrailRestrictions, ...continuousVariationRestrictions, ...continuousThemeRestrictions].map((restriction) => <li key={restriction}>{restriction}</li>)}</ul><div className="safety-summary"><ShieldCheck/><p>O Rastro registra somente o percurso desta instância. Tema e variante não representam evolução, coerência, cura ou direção espiritual.</p></div></Card>
  </div>;
}
