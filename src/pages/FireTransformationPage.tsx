import { AlertTriangle, Archive, ArrowRight, BookOpenText, CheckCircle2, Hammer, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import {
  fireTransformationActionOptions,
  fireTransformationBiblicalUnit,
  fireTransformationDecisionOptions,
  fireTransformationNodes,
  fireTransformationObjectOptions,
  fireTransformationReviewOptions,
  fireTransformationSafeguardOptions,
  fireTransformationStatements
} from '../content/fireTransformation';
import {
  canCompleteFireTransformation,
  isCompatibleTransformationChoice,
  type FireTransformationStatementCategory
} from '../domain/fireTransformation';
import type { SymbolicNode } from '../domain/types';
import { useAthanorStore } from '../state/useAthanorStore';
import { useFireCourageStore } from '../state/useFireCourageStore';
import { useFireTransformationStore } from '../state/useFireTransformationStore';

const categoryLabels: Record<FireTransformationStatementCategory, string> = {
  preserve: 'Preservar',
  repair: 'Reparar',
  transform: 'Transformar',
  close: 'Encerrar',
  archive: 'Arquivar'
};

const chainNodeIds = ['tiferet_transformation_v1', 'li_transformation_v1', 'temperance_transformation_v1', 'transformed_metal_v1'];

function resolveNode(node: SymbolicNode, enabledLayers: string[]): SymbolicNode {
  if (!node.layer || enabledLayers.includes(node.layer)) return node;
  return fireTransformationNodes.find((candidate) => candidate.id === node.fallbackNodeId) ?? node;
}

export function FireTransformationPage() {
  const navigate = useNavigate();
  const enabledLayers = useAthanorStore((state) => state.preferences.enabledLayers);
  const courageProgress = useFireCourageStore((state) => state.progress);
  const storedProgress = useFireTransformationStore((state) => state.progress);
  const start = useFireTransformationStore((state) => state.start);
  const classify = useFireTransformationStore((state) => state.classify);
  const skipClassification = useFireTransformationStore((state) => state.skipClassification);
  const setObject = useFireTransformationStore((state) => state.setObject);
  const setDecision = useFireTransformationStore((state) => state.setDecision);
  const setAction = useFireTransformationStore((state) => state.setAction);
  const setSafeguard = useFireTransformationStore((state) => state.setSafeguard);
  const setReview = useFireTransformationStore((state) => state.setReview);
  const complete = useFireTransformationStore((state) => state.complete);

  const sourceCourageMarkId = courageProgress?.status === 'completed' && courageProgress.proportionalCourageMarkCreated
    ? courageProgress.completedAt ?? `${courageProgress.sourceBoundaryPlateId}:courage-mark`
    : undefined;
  const progress = sourceCourageMarkId && storedProgress?.sourceCourageMarkId === sourceCourageMarkId
    ? storedProgress
    : undefined;

  if (!sourceCourageMarkId) {
    return <div className="page page--fire page--fire-transformation"><PageHeader eyebrow="Capítulo do Fogo · Quinta missão" title="A Oficina da Transformação ainda não está disponível." description="Conclua A Coragem Proporcional e crie a Marca."/><Card title="Dependência da jornada" eyebrow="Marca necessária"><Button onClick={() => navigate('/mission/proportional-courage')}>Abrir A Coragem Proporcional</Button></Card></div>;
  }

  if (!progress) {
    return (
      <div className="page page--fire page--fire-transformation">
        <PageHeader eyebrow="Capítulo do Fogo · Quinta missão" title="O que Precisa Ser Transformado" description="Compare destinos usando apenas objetos fictícios e intervenções pequenas, reversíveis e revisáveis."/>
        <div className="fire-transformation-intro-grid">
          <Card title={fireTransformationBiblicalUnit.title} eyebrow={fireTransformationBiblicalUnit.reference}><blockquote>{fireTransformationBiblicalUnit.principle}</blockquote><p>{fireTransformationBiblicalUnit.context}</p><div className="provenance-inline"><BookOpenText size={17}/><span>A Bíblia inicia a missão; as demais relações são opcionais e identificadas.</span></div></Card>
          <Card title="Antes de começar" eyebrow="Escopo seguro"><ul className="simple-list"><li>somente objetos e situações fictícias serão usados;</li><li>nenhuma relação, emprego, tratamento ou decisão financeira será avaliada;</li><li>preservar e não alterar são resultados válidos;</li><li>decisões irreversíveis permanecem fora do jogo.</li></ul><div className="fire-transformation-actions"><Button onClick={() => start(sourceCourageMarkId)}>Iniciar missão <ArrowRight size={18}/></Button><Button variant="ghost" onClick={() => navigate('/safety?source=fire-transformation')}><ShieldCheck size={18}/> Apoio direto</Button></div></Card>
        </div>
      </div>
    );
  }

  if (progress.status === 'completed') {
    const object = fireTransformationObjectOptions.find((option) => option.id === progress.object);
    const decision = fireTransformationDecisionOptions.find((option) => option.id === progress.decision);
    const action = fireTransformationActionOptions.find((option) => option.id === progress.action);
    const review = fireTransformationReviewOptions.find((option) => option.id === progress.review);
    const nodes = chainNodeIds.map((id) => fireTransformationNodes.find((node) => node.id === id)).filter((node): node is SymbolicNode => Boolean(node)).map((node) => resolveNode(node, enabledLayers));

    return (
      <div className="page page--fire page--fire-transformation">
        <PageHeader eyebrow="Componente criado" title="O Metal registra uma decisão fictícia e revisável." description="O item não representa ruptura, cura, mudança pessoal ou resultado garantido."/>
        <div className="fire-transformation-result-grid">
          <Card className="transformed-metal-card"><div className="transformed-metal-visual" aria-hidden="true"><Hammer/><Sparkles/></div><p className="eyebrow">Componente do Fogo</p><h2>Metal Transformado</h2><span className="item-status item-status--active">Criado</span></Card>
          <Card title="Escolha registrada" eyebrow="Objeto fictício"><p><strong>{object?.label}</strong></p><p>{decision?.label}: {action?.label}.</p><p className="field-help">{review?.label}. Nenhuma ação foi executada pelo aplicativo.</p></Card>
        </div>
        <Card title="Cadeia opcional" eyebrow="Proveniência por camada"><div className="fire-transformation-chain-grid">{nodes.map((node) => <article key={node.id} className="fire-transformation-chain-node"><span className={`provenance-badge provenance-badge--${node.provenance.class.toLowerCase()}`}>{node.provenance.class}</span><h3>{node.name}</h3><p>{node.description}</p><small>{node.provenance.label}</small></article>)}</div></Card>
        <Card title="Próximo passo" eyebrow="Sem integração automática"><p>O Metal é o quinto componente do Fogo. Criá-lo não conclui o capítulo nem transforma uma escolha fictícia em recomendação pessoal.</p><div className="fire-transformation-actions"><Button onClick={() => navigate('/temple/forge')}>Voltar à Forja</Button><Button variant="ghost" onClick={() => navigate('/temple')}>Abrir o Átrio</Button></div></Card>
      </div>
    );
  }

  const compatible = isCompatibleTransformationChoice(progress);
  const ready = canCompleteFireTransformation(progress, fireTransformationStatements.length);

  return (
    <div className="page page--fire page--fire-transformation">
      <PageHeader eyebrow="O que Precisa Ser Transformado" title="Nem toda forma precisa ser modificada." description="Preservar, observar, encerrar e arquivar também são decisões completas." action={<Button variant="ghost" onClick={() => navigate('/safety?source=fire-transformation')}><AlertTriangle size={18}/> Apoio direto</Button>}/>
      <Card title="Distinguir cinco destinos" eyebrow="Exemplos fictícios ou recusa"><div className="fire-transformation-statement-list">{fireTransformationStatements.map((entry) => { const selected = progress.classifications[entry.id]; return <article key={entry.id} className="fire-transformation-statement"><p>{entry.text}</p><div className="fire-transformation-classification-actions">{(Object.keys(categoryLabels) as FireTransformationStatementCategory[]).map((category) => <button key={category} type="button" aria-pressed={selected === category} onClick={() => classify(entry.id, category)}>{categoryLabels[category]}</button>)}</div>{selected && <p className="classification-feedback" data-match={selected === entry.suggestedCategory}>Sugestão editorial: {categoryLabels[entry.suggestedCategory]}. {entry.explanation}</p>}</article>; })}</div><Button variant="ghost" onClick={skipClassification}>Concluir sem classificar</Button>{progress.classificationSkipped && <p className="field-help"><CheckCircle2 size={16}/> Classificação recusada sem perda de progresso.</p>}</Card>
      <TransformationOptions title="1. Qual objeto fictício será observado?" eyebrow="Oficina" options={fireTransformationObjectOptions} selected={progress.object} onSelect={setObject}/>
      <TransformationOptions title="2. Qual destino será considerado?" eyebrow="Preservar, reparar, transformar, encerrar ou arquivar" options={fireTransformationDecisionOptions} selected={progress.decision} onSelect={setDecision}/>
      <TransformationOptions title="3. Qual intervenção pequena será usada?" eyebrow="Ação reversível" options={fireTransformationActionOptions} selected={progress.action} onSelect={setAction}/>
      <TransformationOptions title="4. Qual salvaguarda permanece ativa?" eyebrow="Limite de escopo" options={fireTransformationSafeguardOptions} selected={progress.safeguard} onSelect={setSafeguard}/>
      <TransformationOptions title="5. Quando a escolha poderá ser revista?" eyebrow="Revisão" options={fireTransformationReviewOptions} selected={progress.review} onSelect={setReview}/>
      {!compatible && progress.decision && progress.action && progress.safeguard && <Card title="A combinação precisa ser reduzida" eyebrow="Salvaguarda ativa"><p>O destino, a ação e a salvaguarda selecionados não são compatíveis. Escolha observar, copiar ou não alterar quando faltar contexto.</p></Card>}
      <Card title="Criar o Metal Transformado" eyebrow="Sem decisão pessoal de alto risco"><div className="safety-summary"><ShieldCheck/><p>Esta missão não orienta ruptura de vínculo, saída de emprego, alteração de tratamento, gasto financeiro ou qualquer decisão irreversível.</p></div><div className="fire-transformation-actions"><Button disabled={!ready} onClick={complete}>Criar Metal <Hammer size={18}/></Button><Button variant="ghost" onClick={() => navigate('/temple/forge')}><Archive size={18}/> Pausar e voltar</Button></div></Card>
    </div>
  );
}

interface TransformationOptionsProps<T extends string> { title: string; eyebrow: string; options: Array<{ id: T; label: string; description: string }>; selected?: T; onSelect: (id: T) => void; }
function TransformationOptions<T extends string>({ title, eyebrow, options, selected, onSelect }: TransformationOptionsProps<T>) { return <Card title={title} eyebrow={eyebrow}><div className="fire-transformation-option-list">{options.map((option) => <button key={option.id} type="button" aria-pressed={selected === option.id} onClick={() => onSelect(option.id)}><strong>{option.label}</strong><span>{option.description}</span></button>)}</div></Card>; }
