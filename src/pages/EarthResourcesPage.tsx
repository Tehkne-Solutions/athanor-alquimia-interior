import { AlertTriangle, ArrowRight, CheckCircle2, ListChecks, ShieldCheck, Sprout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import {
  earthResourceAvailabilityOptions,
  earthResourceDecisionOptions,
  earthResourceEntries,
  earthResourceKindOptions,
  earthResourcesBiblicalUnit,
  earthResourceScopeOptions,
  earthResourceSubstitutionOptions
} from '../content/earthResources';
import { canCompleteEarthResources, type EarthResourceCategory } from '../domain/earthResources';
import { useEarthResourcesStore } from '../state/useEarthResourcesStore';
import { useEarthWorkStore } from '../state/useEarthWorkStore';

const categoryLabels: Record<EarthResourceCategory, string> = {
  resource: 'Recurso',
  desire: 'Desejo',
  dependency: 'Dependência',
  guarantee: 'Garantia'
};

export function EarthResourcesPage() {
  const navigate = useNavigate();
  const workProgress = useEarthWorkStore((state) => state.progress);
  const storedProgress = useEarthResourcesStore((state) => state.progress);
  const start = useEarthResourcesStore((state) => state.start);
  const classify = useEarthResourcesStore((state) => state.classify);
  const skipClassification = useEarthResourcesStore((state) => state.skipClassification);
  const setAvailability = useEarthResourcesStore((state) => state.setAvailability);
  const setSubstitution = useEarthResourcesStore((state) => state.setSubstitution);
  const setScope = useEarthResourcesStore((state) => state.setScope);
  const setDecision = useEarthResourcesStore((state) => state.setDecision);
  const complete = useEarthResourcesStore((state) => state.complete);

  const sourceFirstStepSeedId = workProgress?.status === 'completed' && workProgress.firstStepSeedCreated
    ? workProgress.completedAt ?? `${workProgress.sourceBodyPresenceMarkId}:first-step-seed`
    : undefined;
  const progress = sourceFirstStepSeedId && storedProgress?.sourceFirstStepSeedId === sourceFirstStepSeedId
    ? storedProgress
    : undefined;

  if (!sourceFirstStepSeedId) {
    return <div className="page page--earth"><PageHeader eyebrow="Capítulo da Terra" title="A Casa dos Recursos ainda está fechada." description="Conclua primeiro O Trabalho que Cabe Hoje."/><Card title="Dependência da jornada"><Button onClick={() => navigate('/mission/work-that-fits-today')}>Abrir a segunda missão</Button></Card></div>;
  }

  if (!progress) {
    return <div className="page page--earth page--earth-resources"><PageHeader eyebrow="Capítulo da Terra · Terceira missão" title="A Casa dos Recursos" description="Reconheça o que existe, o que pode chegar depois e o que precisa ser reduzido, substituído ou pausado."/><div className="earth-resources-grid"><Card title={earthResourcesBiblicalUnit.title} eyebrow={earthResourcesBiblicalUnit.reference}><blockquote>{earthResourcesBiblicalUnit.principle}</blockquote><p>{earthResourcesBiblicalUnit.context}</p></Card><Card title="Antes de começar" eyebrow="Autonomia"><ul className="simple-list"><li>somente recursos e atividades fictícias;</li><li>falta de recurso não representa falha pessoal;</li><li>substituir, esperar, pausar e abandonar são resultados completos;</li><li>nenhuma compra, reserva ou contato é executado.</li></ul><Button onClick={() => start(sourceFirstStepSeedId)}>Iniciar missão <ArrowRight size={18}/></Button></Card></div></div>;
  }

  if (progress.status === 'completed') {
    const substitution = earthResourceSubstitutionOptions.find((option) => option.id === progress.substitution);
    const scope = earthResourceScopeOptions.find((option) => option.id === progress.scope);
    const decision = earthResourceDecisionOptions.find((option) => option.id === progress.decision);
    const availableNow = Object.values(progress.availability).filter((value) => value === 'available_now').length;
    const availableLater = Object.values(progress.availability).filter((value) => value === 'available_later').length;

    return <div className="page page--earth page--earth-resources"><PageHeader eyebrow="Componente criado" title="Um Cesto foi montado sem prometer abundância." description="Ele registra somente disponibilidades fictícias, uma redução possível e uma decisão recusável."/><div className="earth-resources-grid"><Card className="earth-basket-card"><div className="earth-basket-visual" aria-hidden="true"><Sprout/></div><p className="eyebrow">Terceiro componente da Terra</p><h2>Cesto dos Recursos Possíveis</h2><span className="item-status item-status--active">Criado</span></Card><Card title="Inventário local" eyebrow="Sem dados pessoais"><ul className="simple-list"><li><strong>Disponíveis agora:</strong> {availableNow}</li><li><strong>Possíveis depois:</strong> {availableLater}</li><li><strong>Substituição:</strong> {substitution?.label}</li><li><strong>Escopo:</strong> {scope?.label}</li><li><strong>Decisão:</strong> {decision?.label}</li></ul></Card></div><Card title="Próximo passo" eyebrow="Sem integração automática"><p>O Cesto não conclui o capítulo e não garante acesso futuro a nenhum recurso.</p><div className="earth-resources-actions"><Button onClick={() => navigate('/temple/garden')}>Voltar ao Jardim</Button><Button variant="ghost" onClick={() => navigate('/temple')}>Abrir o Átrio</Button></div></Card></div>;
  }

  const completeReady = canCompleteEarthResources(progress, earthResourceEntries.length);
  const hasUnavailable = Object.values(progress.availability).includes('unavailable');

  return <div className="page page--earth page--earth-resources"><PageHeader eyebrow="A Casa dos Recursos" title="Disponibilidade não é garantia, e ausência não é fracasso." description="Todas as escolhas são locais, fictícias e podem terminar em redução, pausa ou nenhuma ação." action={<Button variant="ghost" onClick={() => navigate('/safety?source=earth')}><AlertTriangle size={18}/> Apoio direto</Button>}/>
    <Card title="1. Distinguir relações com recursos" eyebrow="Exemplos fictícios"><div className="earth-resource-entry-list">{earthResourceEntries.map((entry) => { const selected = progress.classifications[entry.id]; return <article key={entry.id} className="earth-resource-entry"><p>{entry.text}</p><div className="classification-actions">{(Object.keys(categoryLabels) as EarthResourceCategory[]).map((category) => <button key={category} type="button" aria-pressed={selected === category} onClick={() => classify(entry.id, category)}>{categoryLabels[category]}</button>)}</div>{selected && <p className="classification-feedback" data-match={selected === entry.suggestedCategory}>Sugestão editorial: {categoryLabels[entry.suggestedCategory]}. {entry.explanation}</p>}</article>; })}</div><Button variant="ghost" onClick={skipClassification}>Concluir sem classificar</Button>{progress.classificationSkipped && <p className="field-help"><CheckCircle2 size={16}/> Classificação recusada sem perda de progresso.</p>}</Card>
    <Card title="2. Inventariar disponibilidade" eyebrow="Presente, futuro, ausência ou dúvida"><div className="earth-resource-inventory">{earthResourceKindOptions.map((resource) => <section key={resource.id} className="earth-resource-row"><div><strong>{resource.label}</strong><p>{resource.description}</p></div><div className="earth-chip-grid">{earthResourceAvailabilityOptions.map((option) => <button key={option.id} type="button" aria-pressed={progress.availability[resource.id] === option.id} onClick={() => setAvailability(resource.id, option.id)}>{option.label}</button>)}</div></section>)}</div></Card>
    <div className="earth-resources-grid"><Card title="3. Escolher uma substituição" eyebrow="Pode não existir alternativa"><div className="earth-option-list">{earthResourceSubstitutionOptions.map((option) => <button key={option.id} type="button" aria-pressed={progress.substitution === option.id} onClick={() => setSubstitution(option.id)}><strong>{option.label}</strong><span>{option.description}</span></button>)}</div></Card><Card title="4. Ajustar o escopo" eyebrow="Menor não vale menos"><div className="earth-option-list">{earthResourceScopeOptions.map((option) => <button key={option.id} type="button" aria-pressed={progress.scope === option.id} onClick={() => setScope(option.id)}><strong>{option.label}</strong><span>{option.description}</span></button>)}</div>{hasUnavailable && progress.scope === 'keep_scope' && <p className="field-help"><AlertTriangle size={16}/> Um recurso está indisponível. Para continuar agora, reduza ou altere o escopo.</p>}</Card></div>
    <Card title="5. Escolher o destino" eyebrow="Todos os resultados são completos"><div className="earth-option-grid">{earthResourceDecisionOptions.map((option) => { const disabled = (option.id === 'use_substitute' && (!progress.substitution || progress.substitution === 'no_substitute')) || (progress.scope === 'pause_scope' && ['proceed_with_available', 'use_substitute'].includes(option.id)); return <button key={option.id} type="button" disabled={disabled} aria-pressed={progress.decision === option.id} onClick={() => setDecision(option.id)}><ListChecks size={17}/><strong>{option.label}</strong><span>{option.description}</span></button>; })}</div></Card>
    <Card title="Criar o Cesto dos Recursos Possíveis" eyebrow="Sem promessa de disponibilidade"><div className="safety-summary"><ShieldCheck/><p>O Athanor não compra materiais, reserva tempo, busca informação ou contata pessoas.</p></div><div className="earth-resources-actions"><Button disabled={!completeReady} onClick={complete}>Criar Cesto <Sprout size={18}/></Button><Button variant="ghost" onClick={() => navigate('/temple/garden')}>Voltar ao Jardim</Button></div></Card>
  </div>;
}
