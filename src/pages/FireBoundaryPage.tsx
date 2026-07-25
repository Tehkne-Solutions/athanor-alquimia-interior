import { AlertTriangle, ArrowRight, BookOpenText, CheckCircle2, DoorOpen, Shield, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import {
  fireBoundaryActionOptions,
  fireBoundaryBiblicalUnit,
  fireBoundaryConditionOptions,
  fireBoundaryDurationOptions,
  fireBoundaryNodes,
  fireBoundaryReviewOptions,
  fireBoundaryScopeOptions,
  fireBoundaryStatements
} from '../content/fireBoundary';
import { canCompleteFireBoundary, type FireBoundaryStatementCategory } from '../domain/fireBoundary';
import type { SymbolicNode } from '../domain/types';
import { useAthanorStore } from '../state/useAthanorStore';
import { useFireBoundaryStore } from '../state/useFireBoundaryStore';
import { useFireIntervalStore } from '../state/useFireIntervalStore';

const categoryLabels: Record<FireBoundaryStatementCategory, string> = {
  boundary: 'Limite',
  control: 'Controle',
  punishment: 'Punição'
};

const chainNodeIds = ['gevurah_boundary_v1', 'gen_boundary_v1', 'emperor_boundary_v1', 'boundary_plate_v1'];

function resolveNode(node: SymbolicNode, enabledLayers: string[]): SymbolicNode {
  if (!node.layer || enabledLayers.includes(node.layer)) return node;
  return fireBoundaryNodes.find((candidate) => candidate.id === node.fallbackNodeId) ?? node;
}

export function FireBoundaryPage() {
  const navigate = useNavigate();
  const enabledLayers = useAthanorStore((state) => state.preferences.enabledLayers);
  const intervalProgress = useFireIntervalStore((state) => state.progress);
  const storedProgress = useFireBoundaryStore((state) => state.progress);
  const start = useFireBoundaryStore((state) => state.start);
  const classify = useFireBoundaryStore((state) => state.classify);
  const skipClassification = useFireBoundaryStore((state) => state.skipClassification);
  const setScope = useFireBoundaryStore((state) => state.setScope);
  const setCondition = useFireBoundaryStore((state) => state.setCondition);
  const setAction = useFireBoundaryStore((state) => state.setAction);
  const setDuration = useFireBoundaryStore((state) => state.setDuration);
  const setReview = useFireBoundaryStore((state) => state.setReview);
  const complete = useFireBoundaryStore((state) => state.complete);

  const sourceIntervalEmberId = intervalProgress?.status === 'completed' && intervalProgress.intervalEmberCreated
    ? intervalProgress.completedAt ?? `${intervalProgress.sourceNamedFlameId}:interval-ember`
    : undefined;
  const progress = sourceIntervalEmberId && storedProgress?.sourceIntervalEmberId === sourceIntervalEmberId
    ? storedProgress
    : undefined;

  if (!sourceIntervalEmberId) {
    return (
      <div className="page page--fire page--fire-boundary">
        <PageHeader eyebrow="Capítulo do Fogo · Terceira missão" title="O limite ainda não pode ser construído." description="Conclua O Instante Antes do Gesto e crie a Brasa do Intervalo." />
        <Card title="Dependência da jornada" eyebrow="Brasa necessária">
          <Button onClick={() => navigate('/mission/before-the-gesture')}>Abrir O Instante Antes do Gesto</Button>
        </Card>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="page page--fire page--fire-boundary">
        <PageHeader eyebrow="Capítulo do Fogo · Terceira missão" title="O Limite que Protege" description="Construa um limite sobre sua própria ação, com duração e revisão, sem controlar ou punir terceiros." />
        <div className="fire-boundary-intro-grid">
          <Card title={fireBoundaryBiblicalUnit.title} eyebrow={fireBoundaryBiblicalUnit.reference}>
            <blockquote>{fireBoundaryBiblicalUnit.principle}</blockquote>
            <p>{fireBoundaryBiblicalUnit.context}</p>
            <div className="provenance-inline"><BookOpenText size={17}/><span>A fonte bíblica inicia a missão. As relações simbólicas permanecem opcionais e identificadas.</span></div>
          </Card>
          <Card title="Antes de começar" eyebrow="Autonomia e segurança">
            <ul className="simple-list">
              <li>nenhum conflito real ou nome de pessoa será solicitado;</li>
              <li>controle e punição aparecem apenas em exemplos fictícios;</li>
              <li>o limite será formulado em primeira pessoa;</li>
              <li>em risco imediato, a saída segura substitui o simbolismo.</li>
            </ul>
            <div className="fire-boundary-actions">
              <Button onClick={() => start(sourceIntervalEmberId)}>Iniciar missão <ArrowRight size={18}/></Button>
              <Button variant="ghost" onClick={() => navigate('/safety?source=fire-boundary')}><ShieldCheck size={18}/> Apoio direto</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (progress.status === 'completed') {
    const action = fireBoundaryActionOptions.find((option) => option.id === progress.action);
    const condition = fireBoundaryConditionOptions.find((option) => option.id === progress.condition);
    const duration = fireBoundaryDurationOptions.find((option) => option.id === progress.duration);
    const review = fireBoundaryReviewOptions.find((option) => option.id === progress.review);
    const nodes = chainNodeIds
      .map((id) => fireBoundaryNodes.find((node) => node.id === id))
      .filter((node): node is SymbolicNode => Boolean(node))
      .map((node) => resolveNode(node, enabledLayers));

    return (
      <div className="page page--fire page--fire-boundary">
        <PageHeader eyebrow="Componente criado" title="A Placa registra uma ação própria, não uma ordem." description="O item preserva escopo, condição, duração e revisão. Ele não garante proteção nem obediência de terceiros." />
        <div className="fire-boundary-result-grid">
          <Card className="boundary-plate-card">
            <div className="boundary-plate-visual" aria-hidden="true"><Shield/><DoorOpen/></div>
            <p className="eyebrow">Componente do Fogo</p>
            <h2>Placa do Limite</h2>
            <span className="item-status item-status--active">Criada</span>
          </Card>
          <Card title="Formulação registrada" eyebrow="Somente escolhas locais">
            <p className="boundary-formula"><strong>{action?.label ?? 'Nenhuma ação'}</strong> {condition?.label.toLowerCase()}. {duration?.label}. {review?.label}.</p>
            <p className="field-help">A formulação pode ser revisada em fases futuras e não é executada pelo aplicativo.</p>
          </Card>
        </div>
        <Card title="Cadeia opcional" eyebrow="Proveniência por camada">
          <div className="fire-boundary-chain-grid">
            {nodes.map((node) => (
              <article key={node.id} className="fire-boundary-chain-node">
                <span className={`provenance-badge provenance-badge--${node.provenance.class.toLowerCase()}`}>{node.provenance.class}</span>
                <h3>{node.name}</h3><p>{node.description}</p><small>{node.provenance.label}</small>
              </article>
            ))}
          </div>
        </Card>
        <Card title="Próximo passo" eyebrow="Sem integração automática">
          <p>A Placa é o terceiro componente do Fogo. Criá-la não conclui o capítulo nem transforma a formulação em obrigação.</p>
          <div className="fire-boundary-actions"><Button onClick={() => navigate('/temple/forge')}>Voltar à Forja</Button><Button variant="ghost" onClick={() => navigate('/temple')}>Abrir o Átrio</Button></div>
        </Card>
      </div>
    );
  }

  const ready = canCompleteFireBoundary(progress, fireBoundaryStatements.length);

  return (
    <div className="page page--fire page--fire-boundary">
      <PageHeader eyebrow="O Limite que Protege" title="Limite descreve o que eu farei." description="Todas as escolhas são reversíveis e permanecem neste dispositivo." action={<Button variant="ghost" onClick={() => navigate('/safety?source=fire-boundary')}><AlertTriangle size={18}/> Apoio direto</Button>} />

      <Card title="Distinguir limite, controle e punição" eyebrow="Exemplos fictícios ou recusa">
        <div className="fire-boundary-statement-list">
          {fireBoundaryStatements.map((entry) => {
            const selected = progress.classifications[entry.id];
            return (
              <article key={entry.id} className="fire-boundary-statement">
                <p>{entry.text}</p>
                <div className="fire-boundary-classification-actions">
                  {(Object.keys(categoryLabels) as FireBoundaryStatementCategory[]).map((category) => (
                    <button key={category} type="button" aria-pressed={selected === category} onClick={() => classify(entry.id, category)}>{categoryLabels[category]}</button>
                  ))}
                </div>
                {selected && <p className="classification-feedback" data-match={selected === entry.suggestedCategory}>Sugestão editorial: {categoryLabels[entry.suggestedCategory]}. {entry.explanation}</p>}
              </article>
            );
          })}
        </div>
        <Button variant="ghost" onClick={skipClassification}>Concluir sem classificar</Button>
        {progress.classificationSkipped && <p className="field-help"><CheckCircle2 size={16}/> Classificação recusada sem perda de progresso.</p>}
      </Card>

      <div className="fire-boundary-form-grid">
        <BoundaryOptions title="1. Onde o limite se aplica?" eyebrow="Escopo" options={fireBoundaryScopeOptions} selected={progress.scope} onSelect={setScope}/>
        <BoundaryOptions title="2. Quando ele entra em vigor?" eyebrow="Condição" options={fireBoundaryConditionOptions} selected={progress.condition} onSelect={setCondition}/>
        <BoundaryOptions title="3. O que eu farei?" eyebrow="Ação própria" options={fireBoundaryActionOptions} selected={progress.action} onSelect={setAction}/>
        <BoundaryOptions title="4. Por quanto tempo?" eyebrow="Duração" options={fireBoundaryDurationOptions} selected={progress.duration} onSelect={setDuration}/>
      </div>
      <BoundaryOptions title="5. Quando o limite poderá ser revisto?" eyebrow="Abertura e revisão" options={fireBoundaryReviewOptions} selected={progress.review} onSelect={setReview}/>

      <Card title="Criar a Placa do Limite" eyebrow="Sem controle de terceiros">
        <div className="safety-summary"><ShieldCheck/><p>A missão não oferece ameaça, punição, retenção física ou ordens para terceiros. Em risco imediato, saia com segurança e procure apoio direto.</p></div>
        <div className="fire-boundary-actions"><Button disabled={!ready} onClick={complete}>Criar Placa do Limite <Shield size={18}/></Button><Button variant="ghost" onClick={() => navigate('/temple/forge')}>Pausar e voltar</Button></div>
      </Card>
    </div>
  );
}

interface BoundaryOptionsProps<T extends string> {
  title: string;
  eyebrow: string;
  options: Array<{ id: T; label: string; description: string }>;
  selected?: T;
  onSelect: (id: T) => void;
}

function BoundaryOptions<T extends string>({ title, eyebrow, options, selected, onSelect }: BoundaryOptionsProps<T>) {
  return (
    <Card title={title} eyebrow={eyebrow}>
      <div className="fire-boundary-option-list">
        {options.map((option) => (
          <button key={option.id} type="button" aria-pressed={selected === option.id} onClick={() => onSelect(option.id)}>
            <strong>{option.label}</strong><span>{option.description}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
