import { AlertTriangle, ArrowRight, BadgeCheck, BookOpenText, CheckCircle2, Footprints, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import {
  fireCourageActionOptions,
  fireCourageBiblicalUnit,
  fireCourageContextOptions,
  fireCourageNodes,
  fireCourageReadinessOptions,
  fireCourageResourceOptions,
  fireCourageStatements
} from '../content/fireCourage';
import { canCompleteFireCourage, type FireCourageStatementCategory } from '../domain/fireCourage';
import type { SymbolicNode } from '../domain/types';
import { useAthanorStore } from '../state/useAthanorStore';
import { useFireBoundaryStore } from '../state/useFireBoundaryStore';
import { useFireCourageStore } from '../state/useFireCourageStore';

const categoryLabels: Record<FireCourageStatementCategory, string> = {
  proportional_courage: 'Coragem proporcional',
  imprudent_exposure: 'Exposição imprudente',
  avoidance: 'Evasão',
  external_pressure: 'Pressão externa'
};

const chainNodeIds = ['netzach_courage_v1', 'zhen_courage_v1', 'strength_courage_v1', 'proportional_courage_mark_v1'];

function resolveNode(node: SymbolicNode, enabledLayers: string[]): SymbolicNode {
  if (!node.layer || enabledLayers.includes(node.layer)) return node;
  return fireCourageNodes.find((candidate) => candidate.id === node.fallbackNodeId) ?? node;
}

export function FireCouragePage() {
  const navigate = useNavigate();
  const enabledLayers = useAthanorStore((state) => state.preferences.enabledLayers);
  const boundaryProgress = useFireBoundaryStore((state) => state.progress);
  const storedProgress = useFireCourageStore((state) => state.progress);
  const start = useFireCourageStore((state) => state.start);
  const classify = useFireCourageStore((state) => state.classify);
  const skipClassification = useFireCourageStore((state) => state.skipClassification);
  const setContext = useFireCourageStore((state) => state.setContext);
  const setAction = useFireCourageStore((state) => state.setAction);
  const toggleResource = useFireCourageStore((state) => state.toggleResource);
  const setReadiness = useFireCourageStore((state) => state.setReadiness);
  const complete = useFireCourageStore((state) => state.complete);

  const sourceBoundaryPlateId = boundaryProgress?.status === 'completed' && boundaryProgress.boundaryPlateCreated
    ? boundaryProgress.completedAt ?? `${boundaryProgress.sourceIntervalEmberId}:boundary-plate`
    : undefined;
  const progress = sourceBoundaryPlateId && storedProgress?.sourceBoundaryPlateId === sourceBoundaryPlateId
    ? storedProgress
    : undefined;

  if (!sourceBoundaryPlateId) {
    return (
      <div className="page page--fire page--fire-courage">
        <PageHeader eyebrow="Capítulo do Fogo · Quarta missão" title="A escala de coragem ainda não está disponível." description="Conclua O Limite que Protege e crie a Placa do Limite." />
        <Card title="Dependência da jornada" eyebrow="Placa necessária"><Button onClick={() => navigate('/mission/limit-that-protects')}>Abrir O Limite que Protege</Button></Card>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="page page--fire page--fire-courage">
        <PageHeader eyebrow="Capítulo do Fogo · Quarta missão" title="A Coragem Proporcional" description="Escolha a menor ação suficiente considerando segurança, apoio, contexto e possibilidade de recusa." />
        <div className="fire-courage-intro-grid">
          <Card title={fireCourageBiblicalUnit.title} eyebrow={fireCourageBiblicalUnit.reference}>
            <blockquote>{fireCourageBiblicalUnit.principle}</blockquote><p>{fireCourageBiblicalUnit.context}</p>
            <div className="provenance-inline"><BookOpenText size={17}/><span>A Bíblia inicia a missão; as demais relações são opcionais e identificadas.</span></div>
          </Card>
          <Card title="Antes de começar" eyebrow="Autonomia e segurança">
            <ul className="simple-list"><li>nenhuma situação real ou nome será solicitado;</li><li>a maior ação não recebe mais valor;</li><li>adiar e recusar são escolhas válidas;</li><li>risco imediato substitui o simbolismo por apoio direto.</li></ul>
            <div className="fire-courage-actions"><Button onClick={() => start(sourceBoundaryPlateId)}>Iniciar missão <ArrowRight size={18}/></Button><Button variant="ghost" onClick={() => navigate('/safety?source=fire-courage')}><ShieldCheck size={18}/> Apoio direto</Button></div>
          </Card>
        </div>
      </div>
    );
  }

  if (progress.status === 'completed') {
    const action = fireCourageActionOptions.find((option) => option.id === progress.action);
    const readiness = fireCourageReadinessOptions.find((option) => option.id === progress.readiness);
    const resources = fireCourageResourceOptions.filter((option) => progress.resources.includes(option.id));
    const nodes = chainNodeIds.map((id) => fireCourageNodes.find((node) => node.id === id)).filter((node): node is SymbolicNode => Boolean(node)).map((node) => resolveNode(node, enabledLayers));

    return (
      <div className="page page--fire page--fire-courage">
        <PageHeader eyebrow="Componente criado" title="A Marca registra medida, não bravura." description="O componente registra uma escolha limitada e os recursos considerados. Ele não prova coragem, superação ou segurança." />
        <div className="fire-courage-result-grid">
          <Card className="courage-mark-card"><div className="courage-mark-visual" aria-hidden="true"><BadgeCheck/><Footprints/></div><p className="eyebrow">Componente do Fogo</p><h2>Marca da Coragem Proporcional</h2><span className="item-status item-status--active">Criada</span></Card>
          <Card title="Escolha registrada" eyebrow="Menor ação suficiente">
            <p><strong>{action?.label ?? 'Nenhuma ação registrada'}</strong></p><p>{readiness?.label}</p>
            <p className="field-help">Recursos considerados: {resources.length ? resources.map((item) => item.label).join(', ') : 'nenhum registro'}.</p>
          </Card>
        </div>
        <Card title="Cadeia opcional" eyebrow="Proveniência por camada"><div className="fire-courage-chain-grid">{nodes.map((node) => <article key={node.id} className="fire-courage-chain-node"><span className={`provenance-badge provenance-badge--${node.provenance.class.toLowerCase()}`}>{node.provenance.class}</span><h3>{node.name}</h3><p>{node.description}</p><small>{node.provenance.label}</small></article>)}</div></Card>
        <Card title="Próximo passo" eyebrow="Sem integração automática"><p>A Marca é o quarto componente do Fogo. Criá-la não conclui o capítulo nem transforma a ação em obrigação.</p><div className="fire-courage-actions"><Button onClick={() => navigate('/temple/forge')}>Voltar à Forja</Button><Button variant="ghost" onClick={() => navigate('/temple')}>Abrir o Átrio</Button></div></Card>
      </div>
    );
  }

  const ready = canCompleteFireCourage(progress, fireCourageStatements.length);

  return (
    <div className="page page--fire page--fire-courage">
      <PageHeader eyebrow="A Coragem Proporcional" title="Coragem não exige a maior ação." description="Escolha o menor passo que respeita segurança, recursos e autonomia." action={<Button variant="ghost" onClick={() => navigate('/safety?source=fire-courage')}><AlertTriangle size={18}/> Apoio direto</Button>} />
      <Card title="Distinguir quatro movimentos" eyebrow="Exemplos fictícios ou recusa">
        <div className="fire-courage-statement-list">{fireCourageStatements.map((entry) => { const selected = progress.classifications[entry.id]; return <article key={entry.id} className="fire-courage-statement"><p>{entry.text}</p><div className="fire-courage-classification-actions">{(Object.keys(categoryLabels) as FireCourageStatementCategory[]).map((category) => <button key={category} type="button" aria-pressed={selected === category} onClick={() => classify(entry.id, category)}>{categoryLabels[category]}</button>)}</div>{selected && <p className="classification-feedback" data-match={selected === entry.suggestedCategory}>Sugestão editorial: {categoryLabels[entry.suggestedCategory]}. {entry.explanation}</p>}</article>; })}</div>
        <Button variant="ghost" onClick={skipClassification}>Concluir sem classificar</Button>{progress.classificationSkipped && <p className="field-help"><CheckCircle2 size={16}/> Classificação recusada sem perda de progresso.</p>}
      </Card>

      <CourageOptions title="1. Qual contexto será considerado?" eyebrow="Situação fictícia" options={fireCourageContextOptions} selected={progress.context} onSelect={setContext}/>
      <Card title="2. Qual é a menor ação suficiente?" eyebrow="Escala segura e reversível"><div className="fire-courage-action-scale">{fireCourageActionOptions.map((option) => <button key={option.id} type="button" aria-pressed={progress.action === option.id} onClick={() => setAction(option.id)}><span>Escala {option.scale}</span><strong>{option.label}</strong><small>{option.description}</small></button>)}</div></Card>
      <Card title="3. Quais recursos estão disponíveis?" eyebrow="Seleção múltipla ou ausência"><div className="fire-courage-resource-grid">{fireCourageResourceOptions.map((option) => <button key={option.id} type="button" aria-pressed={progress.resources.includes(option.id)} onClick={() => toggleResource(option.id)}><strong>{option.label}</strong><span>{option.description}</span></button>)}</div></Card>
      <CourageOptions title="4. Como esta escolha será tratada?" eyebrow="Prontidão e autonomia" options={fireCourageReadinessOptions} selected={progress.readiness} onSelect={setReadiness}/>

      <Card title="Criar a Marca da Coragem Proporcional" eyebrow="Sem prova de valor"><div className="safety-summary"><ShieldCheck/><p>Adiar, preparar ou recusar são escolhas completas. O Athanor não executa ações, não incentiva exposição e não mede bravura.</p></div><div className="fire-courage-actions"><Button disabled={!ready} onClick={complete}>Criar Marca <BadgeCheck size={18}/></Button><Button variant="ghost" onClick={() => navigate('/temple/forge')}>Pausar e voltar</Button></div></Card>
    </div>
  );
}

interface CourageOptionsProps<T extends string> { title: string; eyebrow: string; options: Array<{ id: T; label: string; description: string }>; selected?: T; onSelect: (id: T) => void; }
function CourageOptions<T extends string>({ title, eyebrow, options, selected, onSelect }: CourageOptionsProps<T>) { return <Card title={title} eyebrow={eyebrow}><div className="fire-courage-option-list">{options.map((option) => <button key={option.id} type="button" aria-pressed={selected === option.id} onClick={() => onSelect(option.id)}><strong>{option.label}</strong><span>{option.description}</span></button>)}</div></Card>; }
