import { BookOpenText, CheckCircle2, Hammer, MoonStar, RotateCcw, Shield, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import {
  fireShieldBiblicalUnit,
  fireShieldComponentLabels,
  fireShieldDurations,
  fireShieldFunctions,
  fireShieldIntensities,
  fireShieldNodes,
  fireShieldRecipe,
  fireShieldReviewWindows,
  fireShieldSupports
} from '../content/fireShield';
import { canCraftFireShield } from '../domain/fireShield';
import type { ReviewOutcome, SymbolicNode } from '../domain/types';
import { useAthanorStore } from '../state/useAthanorStore';
import { useFireShieldStore } from '../state/useFireShieldStore';
import { useFireTransformationStore } from '../state/useFireTransformationStore';

const chainNodeIds = ['gevurah_shield_v1', 'gen_shield_v1', 'temperance_shield_v1', 'just_boundary_shield_v1'];

function resolveNode(node: SymbolicNode, enabledLayers: string[]): SymbolicNode {
  if (!node.layer || enabledLayers.includes(node.layer)) return node;
  return fireShieldNodes.find((candidate) => candidate.id === node.fallbackNodeId) ?? node;
}

export function FireShieldPage() {
  const navigate = useNavigate();
  const [reflection, setReflection] = useState('');
  const enabledLayers = useAthanorStore((state) => state.preferences.enabledLayers);
  const transformation = useFireTransformationStore((state) => state.progress);
  const storedProgress = useFireShieldStore((state) => state.progress);
  const start = useFireShieldStore((state) => state.start);
  const selectFunction = useFireShieldStore((state) => state.selectFunction);
  const selectIntensity = useFireShieldStore((state) => state.selectIntensity);
  const selectSupport = useFireShieldStore((state) => state.selectSupport);
  const selectDuration = useFireShieldStore((state) => state.selectDuration);
  const selectReviewWindow = useFireShieldStore((state) => state.selectReviewWindow);
  const craft = useFireShieldStore((state) => state.craft);
  const requestReview = useFireShieldStore((state) => state.requestReview);
  const review = useFireShieldStore((state) => state.review);
  const resume = useFireShieldStore((state) => state.resume);
  const position = useFireShieldStore((state) => state.position);

  const sourceTransformedMetalId = transformation?.status === 'completed' && transformation.transformedMetalCreated
    ? transformation.completedAt ?? `${transformation.sourceCourageMarkId}:transformed-metal`
    : undefined;
  const progress = sourceTransformedMetalId && storedProgress?.sourceTransformedMetalId === sourceTransformedMetalId
    ? storedProgress
    : undefined;

  if (!sourceTransformedMetalId) {
    return <div className="page page--fire page--fire-shield"><PageHeader eyebrow="Capítulo do Fogo · Crafting" title="A receita do Escudo ainda está incompleta." description="Conclua O que Precisa Ser Transformado e crie o Metal Transformado."/><Card title="Componente necessário" eyebrow="Metal Transformado"><Button onClick={() => navigate('/mission/what-needs-transformation')}>Abrir a quinta missão</Button></Card></div>;
  }

  if (!progress) {
    return (
      <div className="page page--fire page--fire-shield">
        <PageHeader eyebrow="Capítulo do Fogo · Crafting" title="Forja do Escudo do Limite Justo" description="Reúna os cinco componentes em uma função, intensidade, apoio, duração e revisão."/>
        <div className="fire-shield-intro-grid">
          <Card title={fireShieldBiblicalUnit.title} eyebrow={fireShieldBiblicalUnit.reference}><blockquote>{fireShieldBiblicalUnit.principle}</blockquote><p>{fireShieldBiblicalUnit.context}</p><div className="provenance-inline"><BookOpenText size={17}/><span>A Bíblia inicia a receita; o Escudo é uma síntese de gameplay da Tehkné Solutions.</span></div></Card>
          <Card title="Iniciar a receita" eyebrow="Sem proteção prometida"><div className="shield-preview" aria-hidden="true"><Shield/></div><p>O item organiza escolhas próprias. Ele não protege fisicamente, não controla terceiros e não autoriza confronto.</p><Button onClick={() => start(sourceTransformedMetalId)}>Organizar a receita</Button></Card>
        </div>
      </div>
    );
  }

  const selectedFunction = fireShieldFunctions.find((item) => item.id === progress.function);
  const selectedIntensity = fireShieldIntensities.find((item) => item.id === progress.intensity);
  const selectedSupport = fireShieldSupports.find((item) => item.id === progress.support);
  const selectedDuration = fireShieldDurations.find((item) => item.id === progress.duration);
  const selectedReview = fireShieldReviewWindows.find((item) => item.id === progress.reviewWindow);
  const nodes = chainNodeIds
    .map((id) => fireShieldNodes.find((node) => node.id === id))
    .filter((node): node is SymbolicNode => Boolean(node))
    .map((node) => resolveNode(node, enabledLayers));

  const submitReview = (outcome: ReviewOutcome) => {
    review(outcome, reflection);
    setReflection('');
  };

  if (progress.status === 'integrated') {
    return (
      <div className="page page--fire page--fire-shield">
        <PageHeader eyebrow={progress.positioned ? 'Escudo posicionado' : 'Ciclo integrado'} title={progress.positioned ? 'O Escudo ocupa seu lugar na Forja.' : 'O Escudo do Limite Justo foi integrado.'} description="O item registra uma fórmula revisada. Ele não oferece proteção externa ou garantia de resultado."/>
        <div className="fire-shield-result-grid"><Card className="shield-item-card"><div className="shield-preview shield-preview--complete" aria-hidden="true"><Shield/></div><p className="eyebrow">Instrumento de jornada</p><h2>Escudo do Limite Justo</h2><span className="item-status item-status--integrated">Integrado</span></Card><Card title="Fórmula integrada" eyebrow="Escolhas próprias e revisáveis"><ul className="simple-list"><li><strong>Função:</strong> {selectedFunction?.label}</li><li><strong>Intensidade:</strong> {selectedIntensity?.label}</li><li><strong>Apoio:</strong> {selectedSupport?.label}</li><li><strong>Duração:</strong> {selectedDuration?.label}</li><li><strong>Revisão:</strong> {selectedReview?.label}</li></ul>{progress.reflection && <p className="shield-reflection">{progress.reflection}</p>}</Card></div>
        <Card title={progress.positioned ? 'Item posicionado' : 'Posicionar na Forja'} eyebrow="Transformação do Templo"><p>{progress.positioned ? 'A Forja reconhece o item integrado. O Capítulo do Fogo ainda exige encerramento próprio.' : 'Somente itens integrados podem ser posicionados. O posicionamento não encerra automaticamente o capítulo.'}</p><div className="fire-shield-actions">{!progress.positioned && <Button onClick={position}>Posicionar o Escudo</Button>}<Button variant="secondary" onClick={() => navigate('/temple/forge')}>Voltar à Forja</Button><Button variant="ghost" onClick={() => navigate('/inventory')}>Abrir inventário</Button></div></Card>
      </div>
    );
  }

  if (progress.status === 'resting') {
    return <div className="page page--fire page--fire-shield"><PageHeader eyebrow="Ciclo em repouso" title="O Escudo permanece guardado sem desaparecer." description="Repousar não apaga componentes e não cria prazo obrigatório."/><Card title="Retomar quando fizer sentido" eyebrow="Sem sequência perdida"><div className="safety-summary"><MoonStar/><p>A receita e suas escolhas permanecem no dispositivo.</p></div><div className="fire-shield-actions"><Button onClick={resume}><RotateCcw size={18}/> Retomar e ajustar</Button><Button variant="ghost" onClick={() => navigate('/temple/forge')}>Voltar à Forja</Button></div></Card></div>;
  }

  if (progress.status === 'awaiting_review') {
    return (
      <div className="page page--fire page--fire-shield">
        <PageHeader eyebrow="Revisão do Escudo" title="A criação ainda não encerra o ciclo." description="Escolha integrar, ajustar ou repousar. Nenhuma opção reduz progresso."/>
        <div className="fire-shield-review-grid"><Card title="Fórmula atual" eyebrow="Aguardando revisão"><ul className="simple-list"><li><strong>Função:</strong> {selectedFunction?.label}</li><li><strong>Intensidade:</strong> {selectedIntensity?.label}</li><li><strong>Apoio:</strong> {selectedSupport?.label}</li><li><strong>Duração:</strong> {selectedDuration?.label}</li><li><strong>Revisão:</strong> {selectedReview?.label}</li></ul></Card><Card title="Registro opcional" eyebrow="Não altera recompensa"><label className="field-label" htmlFor="shield-reflection">O que deseja preservar desta revisão?</label><textarea id="shield-reflection" rows={5} value={reflection} onChange={(event) => setReflection(event.target.value)} placeholder="Este campo pode permanecer vazio."/></Card></div>
        <Card title="Destino do ciclo" eyebrow="Escolha reversível"><div className="fire-shield-actions"><Button onClick={() => submitReview('integrated')}>Integrar o Escudo</Button><Button variant="secondary" onClick={() => submitReview('adjusted')}>Ajustar a fórmula</Button><Button variant="ghost" onClick={() => submitReview('resting')}>Colocar em repouso</Button></div></Card>
      </div>
    );
  }

  if (progress.status === 'active') {
    return <div className="page page--fire page--fire-shield"><PageHeader eyebrow="Escudo criado" title="A fórmula agora precisa de retorno." description="Criar o item não confirma proteção, execução ou integração."/><div className="fire-shield-result-grid"><Card className="shield-item-card"><div className="shield-preview" aria-hidden="true"><Shield/></div><h2>Escudo do Limite Justo</h2><span className="item-status item-status--active">Ativo</span></Card><Card title="Próxima etapa" eyebrow="Revisão explícita"><p>O Athanor não verifica se uma ação externa foi executada.</p><Button onClick={requestReview}>Revisar o Escudo agora</Button></Card></div></div>;
  }

  const craftReady = canCraftFireShield(progress);

  return (
    <div className="page page--fire page--fire-shield">
      <PageHeader eyebrow={progress.status === 'adjusted' ? 'Receita em ajuste' : 'Crafting do Fogo'} title="Organize a fórmula do Escudo." description="Todas as escolhas são locais, limitadas e revisáveis."/>
      <Card title="Componentes reunidos" eyebrow="Cinco práticas do Fogo"><div className="fire-shield-components-grid">{fireShieldRecipe.componentIds.map((id) => <div key={id} className="fire-shield-component"><CheckCircle2/><strong>{fireShieldComponentLabels[id]}</strong><small>Disponível</small></div>)}</div></Card>
      <ShieldOptions title="1. Função" eyebrow="O que o item organizará" options={fireShieldFunctions} selected={progress.function} onSelect={selectFunction}/>
      <ShieldOptions title="2. Intensidade" eyebrow="Não é medida clínica" options={fireShieldIntensities} selected={progress.intensity} onSelect={selectIntensity}/>
      <ShieldOptions title="3. Apoio" eyebrow="Inclui ausência real de recurso" options={fireShieldSupports} selected={progress.support} onSelect={selectSupport}/>
      <ShieldOptions title="4. Duração" eyebrow="Sem permanência automática" options={fireShieldDurations} selected={progress.duration} onSelect={selectDuration}/>
      <ShieldOptions title="5. Revisão" eyebrow="Retorno explícito" options={fireShieldReviewWindows} selected={progress.reviewWindow} onSelect={selectReviewWindow}/>
      <Card title="Cadeia opcional" eyebrow="Proveniência por camada"><div className="fire-shield-chain-grid">{nodes.map((node) => <article key={node.id} className="fire-shield-chain-node"><span className={`provenance-badge provenance-badge--${node.provenance.class.toLowerCase()}`}>{node.provenance.class}</span><h3>{node.name}</h3><p>{node.description}</p><small>{node.provenance.label}</small></article>)}</div></Card>
      <Card title="Forjar o Escudo do Limite Justo" eyebrow="Sem promessa de proteção"><div className="safety-summary"><ShieldCheck/><p>O item organiza escolhas próprias. Não controla terceiros, não autoriza confronto e não substitui apoio real.</p></div><div className="fire-shield-actions"><Button disabled={!craftReady} onClick={craft}>Forjar Escudo <Hammer size={18}/></Button><Button variant="ghost" onClick={() => navigate('/temple/forge')}>Pausar e voltar</Button></div></Card>
    </div>
  );
}

interface ShieldOptionsProps<T extends string> {
  title: string;
  eyebrow: string;
  options: Array<{ id: T; label: string; description: string }>;
  selected?: T;
  onSelect: (id: T) => void;
}

function ShieldOptions<T extends string>({ title, eyebrow, options, selected, onSelect }: ShieldOptionsProps<T>) {
  return <Card title={title} eyebrow={eyebrow}><div className="fire-shield-option-list">{options.map((option) => <button key={option.id} type="button" aria-pressed={selected === option.id} onClick={() => onSelect(option.id)}><strong>{option.label}</strong><span>{option.description}</span></button>)}</div></Card>;
}
