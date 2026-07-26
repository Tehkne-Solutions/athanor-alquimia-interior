import { BookOpenText, CheckCircle2, Gem, Hammer, MoonStar, RotateCcw, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import {
  earthStoneActiveLimits,
  earthStoneBiblicalUnit,
  earthStoneComponentLabels,
  earthStoneFunctions,
  earthStoneNodes,
  earthStoneRecipe,
  earthStoneResources,
  earthStoneReviewWindows,
  earthStoneRhythms,
  earthStoneSmallSteps
} from '../content/earthStone';
import { canCraftEarthStone } from '../domain/earthStone';
import type { ReviewOutcome, SymbolicNode } from '../domain/types';
import { useAthanorStore } from '../state/useAthanorStore';
import { useEarthOrderStore } from '../state/useEarthOrderStore';
import { useEarthStoneStore } from '../state/useEarthStoneStore';

const chainNodeIds = ['malkhut_stone_v1', 'kun_stone_v1', 'empress_stone_v1', 'first_step_stone_v1'];

function resolveNode(node: SymbolicNode, enabledLayers: string[]): SymbolicNode {
  if (!node.layer || enabledLayers.includes(node.layer)) return node;
  return earthStoneNodes.find((candidate) => candidate.id === node.fallbackNodeId) ?? node;
}

export function EarthStonePage() {
  const navigate = useNavigate();
  const [reflection, setReflection] = useState('');
  const enabledLayers = useAthanorStore((state) => state.preferences.enabledLayers);
  const order = useEarthOrderStore((state) => state.progress);
  const storedProgress = useEarthStoneStore((state) => state.progress);
  const start = useEarthStoneStore((state) => state.start);
  const selectFunction = useEarthStoneStore((state) => state.selectFunction);
  const selectSmallStep = useEarthStoneStore((state) => state.selectSmallStep);
  const selectResource = useEarthStoneStore((state) => state.selectResource);
  const selectRhythm = useEarthStoneStore((state) => state.selectRhythm);
  const selectActiveLimit = useEarthStoneStore((state) => state.selectActiveLimit);
  const selectReviewWindow = useEarthStoneStore((state) => state.selectReviewWindow);
  const craft = useEarthStoneStore((state) => state.craft);
  const requestReview = useEarthStoneStore((state) => state.requestReview);
  const review = useEarthStoneStore((state) => state.review);
  const resume = useEarthStoneStore((state) => state.resume);
  const position = useEarthStoneStore((state) => state.position);

  const sourceOrderMapId = order?.status === 'completed' && order.possibleOrderMapCreated
    ? order.completedAt ?? `${order.sourceRhythmCompassId}:order-map`
    : undefined;
  const progress = sourceOrderMapId && storedProgress?.sourceOrderMapId === sourceOrderMapId
    ? storedProgress
    : undefined;

  if (!sourceOrderMapId) {
    return <div className="page page--earth page--earth-stone"><PageHeader eyebrow="Capítulo da Terra · Crafting" title="A receita da Pedra ainda está incompleta." description="Conclua A Ordem que Serve e crie o Mapa da Ordem Possível."/><Card title="Componente necessário" eyebrow="Mapa da Ordem Possível"><Button onClick={() => navigate('/mission/order-that-serves')}>Abrir a quinta missão</Button></Card></div>;
  }

  if (!progress) {
    return (
      <div className="page page--earth page--earth-stone">
        <PageHeader eyebrow="Capítulo da Terra · Crafting" title="Lapidação da Pedra do Primeiro Passo" description="Reúna os cinco componentes em uma função, passo, recurso, ritmo, limite e revisão."/>
        <div className="earth-stone-intro-grid">
          <Card title={earthStoneBiblicalUnit.title} eyebrow={earthStoneBiblicalUnit.reference}><blockquote>{earthStoneBiblicalUnit.principle}</blockquote><p>{earthStoneBiblicalUnit.context}</p><div className="provenance-inline"><BookOpenText size={17}/><span>A Bíblia inicia a receita; a Pedra é uma síntese de gameplay da Tehkné Solutions.</span></div></Card>
          <Card title="Iniciar a lapidação" eyebrow="Sem estabilidade prometida"><div className="earth-stone-preview" aria-hidden="true"><Gem/></div><p>O item organiza escolhas fictícias e locais. Ele não mede produtividade, não executa tarefas e não garante direção ou resultado.</p><Button onClick={() => start(sourceOrderMapId)}>Organizar a receita</Button></Card>
        </div>
      </div>
    );
  }

  const selectedFunction = earthStoneFunctions.find((item) => item.id === progress.function);
  const selectedSmallStep = earthStoneSmallSteps.find((item) => item.id === progress.smallStep);
  const selectedResource = earthStoneResources.find((item) => item.id === progress.resource);
  const selectedRhythm = earthStoneRhythms.find((item) => item.id === progress.rhythm);
  const selectedLimit = earthStoneActiveLimits.find((item) => item.id === progress.activeLimit);
  const selectedReview = earthStoneReviewWindows.find((item) => item.id === progress.reviewWindow);
  const nodes = chainNodeIds
    .map((id) => earthStoneNodes.find((node) => node.id === id))
    .filter((node): node is SymbolicNode => Boolean(node))
    .map((node) => resolveNode(node, enabledLayers));

  const submitReview = (outcome: ReviewOutcome) => {
    review(outcome, reflection);
    setReflection('');
  };

  if (progress.status === 'integrated') {
    return (
      <div className="page page--earth page--earth-stone">
        <PageHeader eyebrow={progress.positioned ? 'Pedra posicionada' : 'Ciclo integrado'} title={progress.positioned ? 'A Pedra ocupa seu lugar no Jardim.' : 'A Pedra do Primeiro Passo foi integrada.'} description="O item registra uma fórmula revisada. Ele não garante execução, estabilidade ou resultado."/>
        <div className="earth-stone-result-grid"><Card className="earth-stone-item-card"><div className="earth-stone-preview earth-stone-preview--complete" aria-hidden="true"><Gem/></div><p className="eyebrow">Instrumento de jornada</p><h2>Pedra do Primeiro Passo</h2><span className="item-status item-status--integrated">Integrada</span></Card><Card title="Fórmula integrada" eyebrow="Escolhas pequenas e revisáveis"><ul className="simple-list"><li><strong>Função:</strong> {selectedFunction?.label}</li><li><strong>Passo:</strong> {selectedSmallStep?.label}</li><li><strong>Recurso:</strong> {selectedResource?.label}</li><li><strong>Ritmo:</strong> {selectedRhythm?.label}</li><li><strong>Limite:</strong> {selectedLimit?.label}</li><li><strong>Revisão:</strong> {selectedReview?.label}</li></ul>{progress.reflection && <p className="earth-stone-reflection">{progress.reflection}</p>}</Card></div>
        <Card title={progress.positioned ? 'Item posicionado' : 'Posicionar no Jardim'} eyebrow="Transformação do Templo"><p>{progress.positioned ? 'O Jardim reconhece o item integrado. O Capítulo da Terra ainda exige encerramento próprio.' : 'Somente itens integrados podem ser posicionados. O posicionamento não encerra automaticamente o capítulo.'}</p><div className="earth-stone-actions">{!progress.positioned && <Button onClick={position}>Posicionar a Pedra</Button>}<Button variant="secondary" onClick={() => navigate('/temple/garden')}>Voltar ao Jardim</Button><Button variant="ghost" onClick={() => navigate('/inventory')}>Abrir inventário</Button></div></Card>
      </div>
    );
  }

  if (progress.status === 'resting') {
    return <div className="page page--earth page--earth-stone"><PageHeader eyebrow="Ciclo em repouso" title="A Pedra permanece guardada sem desaparecer." description="Repousar não apaga componentes e não cria prazo obrigatório."/><Card title="Retomar quando fizer sentido" eyebrow="Sem sequência perdida"><div className="safety-summary"><MoonStar/><p>A receita e suas escolhas permanecem no dispositivo.</p></div><div className="earth-stone-actions"><Button onClick={resume}><RotateCcw size={18}/> Retomar e ajustar</Button><Button variant="ghost" onClick={() => navigate('/temple/garden')}>Voltar ao Jardim</Button></div></Card></div>;
  }

  if (progress.status === 'awaiting_review') {
    return (
      <div className="page page--earth page--earth-stone">
        <PageHeader eyebrow="Revisão da Pedra" title="A criação ainda não encerra o ciclo." description="Escolha integrar, ajustar ou repousar. Nenhuma opção reduz progresso."/>
        <div className="earth-stone-review-grid"><Card title="Fórmula atual" eyebrow="Aguardando revisão"><ul className="simple-list"><li><strong>Função:</strong> {selectedFunction?.label}</li><li><strong>Passo:</strong> {selectedSmallStep?.label}</li><li><strong>Recurso:</strong> {selectedResource?.label}</li><li><strong>Ritmo:</strong> {selectedRhythm?.label}</li><li><strong>Limite:</strong> {selectedLimit?.label}</li><li><strong>Revisão:</strong> {selectedReview?.label}</li></ul></Card><Card title="Registro opcional" eyebrow="Não altera recompensa"><label className="field-label" htmlFor="stone-reflection">O que deseja preservar desta revisão?</label><textarea id="stone-reflection" rows={5} value={reflection} onChange={(event) => setReflection(event.target.value)} placeholder="Este campo pode permanecer vazio."/></Card></div>
        <Card title="Destino do ciclo" eyebrow="Escolha reversível"><div className="earth-stone-actions"><Button onClick={() => submitReview('integrated')}>Integrar a Pedra</Button><Button variant="secondary" onClick={() => submitReview('adjusted')}>Ajustar a fórmula</Button><Button variant="ghost" onClick={() => submitReview('resting')}>Colocar em repouso</Button></div></Card>
      </div>
    );
  }

  if (progress.status === 'active') {
    return <div className="page page--earth page--earth-stone"><PageHeader eyebrow="Pedra criada" title="A fórmula agora precisa de retorno." description="Criar o item não confirma execução, estabilidade ou integração."/><div className="earth-stone-result-grid"><Card className="earth-stone-item-card"><div className="earth-stone-preview" aria-hidden="true"><Gem/></div><h2>Pedra do Primeiro Passo</h2><span className="item-status item-status--active">Ativa</span></Card><Card title="Próxima etapa" eyebrow="Revisão explícita"><p>O Athanor não verifica se qualquer ação externa foi executada.</p><Button onClick={requestReview}>Revisar a Pedra agora</Button></Card></div></div>;
  }

  const craftReady = canCraftEarthStone(progress);

  return (
    <div className="page page--earth page--earth-stone">
      <PageHeader eyebrow={progress.status === 'adjusted' ? 'Receita em ajuste' : 'Crafting da Terra'} title="Organize a fórmula da Pedra." description="Todas as escolhas são locais, pequenas e revisáveis."/>
      <Card title="Componentes reunidos" eyebrow="Cinco práticas da Terra"><div className="earth-stone-components-grid">{earthStoneRecipe.componentIds.map((id) => <div key={id} className="earth-stone-component"><CheckCircle2/><strong>{earthStoneComponentLabels[id]}</strong><small>Disponível</small></div>)}</div></Card>
      <StoneOptions title="1. Função" eyebrow="O que o item organizará" options={earthStoneFunctions} selected={progress.function} onSelect={selectFunction}/>
      <StoneOptions title="2. Menor passo" eyebrow="Inclui nenhum passo" options={earthStoneSmallSteps} selected={progress.smallStep} onSelect={selectSmallStep}/>
      <StoneOptions title="3. Recurso" eyebrow="Inclui ausência real" options={earthStoneResources} selected={progress.resource} onSelect={selectResource}/>
      <StoneOptions title="4. Ritmo" eyebrow="Sem streak" options={earthStoneRhythms} selected={progress.rhythm} onSelect={selectRhythm}/>
      <StoneOptions title="5. Limite ativo" eyebrow="Máximo, não meta" options={earthStoneActiveLimits} selected={progress.activeLimit} onSelect={selectActiveLimit}/>
      <StoneOptions title="6. Revisão" eyebrow="Retorno explícito" options={earthStoneReviewWindows} selected={progress.reviewWindow} onSelect={selectReviewWindow}/>
      <Card title="Cadeia opcional" eyebrow="Proveniência por camada"><div className="earth-stone-chain-grid">{nodes.map((node) => <article key={node.id} className="earth-stone-chain-node"><span className={`provenance-badge provenance-badge--${node.provenance.class.toLowerCase()}`}>{node.provenance.class}</span><h3>{node.name}</h3><p>{node.description}</p><small>{node.provenance.label}</small></article>)}</div></Card>
      <Card title="Lapidar a Pedra do Primeiro Passo" eyebrow="Sem promessa de estabilidade"><div className="safety-summary"><ShieldCheck/><p>O item registra escolhas pequenas. Não mede produtividade, não executa tarefas e não substitui recursos reais.</p></div><div className="earth-stone-actions"><Button disabled={!craftReady} onClick={craft}>Lapidar Pedra <Hammer size={18}/></Button><Button variant="ghost" onClick={() => navigate('/temple/garden')}>Pausar e voltar</Button></div></Card>
    </div>
  );
}

interface StoneOptionsProps<T extends string> {
  title: string;
  eyebrow: string;
  options: Array<{ id: T; label: string; description: string }>;
  selected?: T;
  onSelect: (id: T) => void;
}

function StoneOptions<T extends string>({ title, eyebrow, options, selected, onSelect }: StoneOptionsProps<T>) {
  return <Card title={title} eyebrow={eyebrow}><div className="earth-stone-option-list">{options.map((option) => <button key={option.id} type="button" aria-pressed={selected === option.id} onClick={() => onSelect(option.id)}><strong>{option.label}</strong><span>{option.description}</span></button>)}</div></Card>;
}
