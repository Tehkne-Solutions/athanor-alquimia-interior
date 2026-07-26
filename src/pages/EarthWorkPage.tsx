import { AlertTriangle, ArrowRight, CheckCircle2, Clock3, ListChecks, ShieldCheck, Sprout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import {
  earthCapacityOptions,
  earthSmallStepOptions,
  earthTimeOptions,
  earthWorkBiblicalUnit,
  earthWorkContextOptions,
  earthWorkDecisionOptions,
  earthWorkEntries,
  earthWorkSupportOptions
} from '../content/earthWork';
import { canCompleteEarthWork, type EarthWorkCategory } from '../domain/earthWork';
import { useEarthBodyStore } from '../state/useEarthBodyStore';
import { useEarthWorkStore } from '../state/useEarthWorkStore';

const categoryLabels: Record<EarthWorkCategory, string> = {
  intention: 'Intenção',
  project: 'Projeto',
  task: 'Tarefa',
  first_step: 'Primeiro passo'
};

export function EarthWorkPage() {
  const navigate = useNavigate();
  const bodyProgress = useEarthBodyStore((state) => state.progress);
  const storedProgress = useEarthWorkStore((state) => state.progress);
  const start = useEarthWorkStore((state) => state.start);
  const classify = useEarthWorkStore((state) => state.classify);
  const skipClassification = useEarthWorkStore((state) => state.skipClassification);
  const setContext = useEarthWorkStore((state) => state.setContext);
  const setCapacity = useEarthWorkStore((state) => state.setCapacity);
  const setTimeWindow = useEarthWorkStore((state) => state.setTimeWindow);
  const setSmallStep = useEarthWorkStore((state) => state.setSmallStep);
  const setDecision = useEarthWorkStore((state) => state.setDecision);
  const toggleSupport = useEarthWorkStore((state) => state.toggleSupport);
  const complete = useEarthWorkStore((state) => state.complete);

  const sourceBodyPresenceMarkId = bodyProgress?.status === 'completed' && bodyProgress.bodyPresenceMarkCreated
    ? bodyProgress.completedAt ?? `${bodyProgress.sourceFireCycleId}:body-presence-mark`
    : undefined;
  const progress = sourceBodyPresenceMarkId && storedProgress?.sourceBodyPresenceMarkId === sourceBodyPresenceMarkId
    ? storedProgress
    : undefined;

  if (!sourceBodyPresenceMarkId) {
    return <div className="page page--earth"><PageHeader eyebrow="Capítulo da Terra" title="O trabalho ainda não pode ser decomposto." description="Conclua primeiro O Corpo Chega Primeiro."/><Card title="Dependência da jornada"><Button onClick={() => navigate('/mission/body-arrives-first')}>Abrir a primeira missão</Button></Card></div>;
  }

  if (!progress) {
    return <div className="page page--earth page--earth-work"><PageHeader eyebrow="Capítulo da Terra · Segunda missão" title="O Trabalho que Cabe Hoje" description="Transforme exemplos fictícios em unidades pequenas sem medir produtividade ou valor pessoal."/><div className="earth-work-grid"><Card title={earthWorkBiblicalUnit.title} eyebrow={earthWorkBiblicalUnit.reference}><blockquote>{earthWorkBiblicalUnit.principle}</blockquote><p>{earthWorkBiblicalUnit.context}</p></Card><Card title="Antes de começar" eyebrow="Autonomia"><ul className="simple-list"><li>somente atividades fictícias;</li><li>capacidade e tempo percebidos não são desempenho;</li><li>adiar, delegar, repousar e não agir são conclusões completas;</li><li>nenhuma ação é executada automaticamente.</li></ul><Button onClick={() => start(sourceBodyPresenceMarkId)}>Iniciar missão <ArrowRight size={18}/></Button></Card></div></div>;
  }

  if (progress.status === 'completed') {
    const context = earthWorkContextOptions.find((option) => option.id === progress.context);
    const step = earthSmallStepOptions.find((option) => option.id === progress.smallStep);
    const decision = earthWorkDecisionOptions.find((option) => option.id === progress.decision);
    return <div className="page page--earth page--earth-work"><PageHeader eyebrow="Componente criado" title="Uma Semente foi registrada sem se tornar cobrança." description="Ela representa somente uma unidade fictícia e uma decisão recusável."/><div className="earth-work-grid"><Card className="earth-seed-card"><div className="earth-seed-visual" aria-hidden="true"><Sprout/></div><p className="eyebrow">Segundo componente da Terra</p><h2>Semente do Primeiro Passo</h2><span className="item-status item-status--active">Criada</span></Card><Card title="Fórmula local" eyebrow="Sem texto pessoal"><ul className="simple-list"><li><strong>Contexto:</strong> {context?.label}</li><li><strong>Unidade:</strong> {step?.label}</li><li><strong>Decisão:</strong> {decision?.label}</li><li><strong>Apoios:</strong> {progress.supports.length}</li></ul></Card></div><Card title="Próximo passo" eyebrow="Sem integração automática"><p>A Semente não conclui o capítulo e não transforma a decisão em obrigação.</p><div className="earth-work-actions"><Button onClick={() => navigate('/temple/garden')}>Voltar ao Jardim</Button><Button variant="ghost" onClick={() => navigate('/temple')}>Abrir o Átrio</Button></div></Card></div>;
  }

  const completeReady = canCompleteEarthWork(progress, earthWorkEntries.length);

  return <div className="page page--earth page--earth-work"><PageHeader eyebrow="O Trabalho que Cabe Hoje" title="Uma direção ampla pode ser reduzida sem virar cobrança." description="Todas as escolhas permanecem locais e podem terminar em pausa, adiamento ou nenhuma ação." action={<Button variant="ghost" onClick={() => navigate('/safety?source=earth')}><AlertTriangle size={18}/> Apoio direto</Button>}/>
    <Card title="1. Distinguir níveis de trabalho" eyebrow="Exemplos fictícios"><div className="earth-work-entry-list">{earthWorkEntries.map((entry) => { const selected = progress.classifications[entry.id]; return <article key={entry.id} className="earth-work-entry"><p>{entry.text}</p><div className="classification-actions">{(Object.keys(categoryLabels) as EarthWorkCategory[]).map((category) => <button key={category} type="button" aria-pressed={selected === category} onClick={() => classify(entry.id, category)}>{categoryLabels[category]}</button>)}</div>{selected && <p className="classification-feedback" data-match={selected === entry.suggestedCategory}>Sugestão editorial: {categoryLabels[entry.suggestedCategory]}. {entry.explanation}</p>}</article>; })}</div><Button variant="ghost" onClick={skipClassification}>Concluir sem classificar</Button>{progress.classificationSkipped && <p className="field-help"><CheckCircle2 size={16}/> Classificação recusada sem perda de progresso.</p>}</Card>
    <div className="earth-work-grid"><Card title="2. Escolher um cenário" eyebrow="Somente exemplos curados"><div className="earth-option-list">{earthWorkContextOptions.map((option) => <button key={option.id} type="button" aria-pressed={progress.context === option.id} onClick={() => setContext(option.id)}><strong>{option.label}</strong><span>{option.description}</span></button>)}</div></Card><Card title="3. Reconhecer capacidade e tempo" eyebrow="Percepção, não produtividade"><p className="field-label">Capacidade percebida</p><div className="earth-chip-grid">{earthCapacityOptions.map((option) => <button key={option.id} type="button" aria-pressed={progress.capacity === option.id} onClick={() => setCapacity(option.id)}>{option.label}</button>)}</div><p className="field-label"><Clock3 size={16}/> Tempo percebido</p><div className="earth-chip-grid">{earthTimeOptions.map((option) => <button key={option.id} type="button" aria-pressed={progress.timeWindow === option.id} onClick={() => setTimeWindow(option.id)}>{option.label}</button>)}</div></Card></div>
    <Card title="4. Selecionar a menor unidade suficiente" eyebrow="Pode ser nenhum passo"><div className="earth-option-grid">{earthSmallStepOptions.map((option) => <button key={option.id} type="button" aria-pressed={progress.smallStep === option.id} onClick={() => setSmallStep(option.id)}><ListChecks size={17}/><strong>{option.label}</strong><span>{option.description}</span></button>)}</div></Card>
    <div className="earth-work-grid"><Card title="5. Apoios disponíveis" eyebrow="Seleção múltipla ou ausência"><div className="earth-chip-grid">{earthWorkSupportOptions.map((option) => <button key={option.id} type="button" aria-pressed={progress.supports.includes(option.id)} onClick={() => toggleSupport(option.id)}>{option.label}</button>)}</div></Card><Card title="6. Escolher o destino" eyebrow="Todos os resultados são completos"><div className="earth-option-list">{earthWorkDecisionOptions.map((option) => <button key={option.id} type="button" disabled={option.id === 'do_small_step' && progress.smallStep === 'no_step'} aria-pressed={progress.decision === option.id} onClick={() => setDecision(option.id)}><strong>{option.label}</strong><span>{option.description}</span></button>)}</div></Card></div>
    <Card title="Criar a Semente do Primeiro Passo" eyebrow="Sem obrigação de execução"><div className="safety-summary"><ShieldCheck/><p>O Athanor não envia mensagens, delega tarefas, inicia cronômetros ou mede produtividade.</p></div><div className="earth-work-actions"><Button disabled={!completeReady} onClick={complete}>Criar Semente <Sprout size={18}/></Button><Button variant="ghost" onClick={() => navigate('/temple/garden')}>Voltar ao Jardim</Button></div></Card>
  </div>;
}
