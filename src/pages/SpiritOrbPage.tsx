import { BookOpenText, CheckCircle2, Circle, Hammer, MoonStar, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import {
  spiritOrbBiblicalUnit,
  spiritOrbComponentLabels,
  spiritOrbDecisions,
  spiritOrbDisagreements,
  spiritOrbFunctions,
  spiritOrbNodes,
  spiritOrbRecipe,
  spiritOrbReturns,
  spiritOrbReviewWindows,
  spiritOrbVisibleDimensions
} from '../content/spiritOrb';
import { canCraftSpiritOrb } from '../domain/spiritOrb';
import type { ReviewOutcome, SymbolicNode } from '../domain/types';
import { useAthanorStore } from '../state/useAthanorStore';
import { useSpiritOrbStore } from '../state/useSpiritOrbStore';
import { useSpiritReturnStore } from '../state/useSpiritReturnStore';

const chainNodeIds = ['spirit_tiferet_orb_v1', 'spirit_ruach_orb_v1', 'spirit_li_orb_v1', 'spirit_world_orb_v1', 'possible_integration_orb_v1'];

function resolveNode(node: SymbolicNode, enabledLayers: string[]): SymbolicNode {
  if (!node.layer || enabledLayers.includes(node.layer)) return node;
  return spiritOrbNodes.find((candidate) => candidate.id === node.fallbackNodeId) ?? node;
}

export function SpiritOrbPage() {
  const navigate = useNavigate();
  const [reflection, setReflection] = useState('');
  const enabledLayers = useAthanorStore((state) => state.preferences.enabledLayers);
  const spiritReturn = useSpiritReturnStore((state) => state.progress);
  const storedProgress = useSpiritOrbStore((state) => state.progress);
  const start = useSpiritOrbStore((state) => state.start);
  const selectFunction = useSpiritOrbStore((state) => state.selectFunction);
  const selectVisibleDimension = useSpiritOrbStore((state) => state.selectVisibleDimension);
  const selectDisagreement = useSpiritOrbStore((state) => state.selectDisagreement);
  const selectDecision = useSpiritOrbStore((state) => state.selectDecision);
  const selectReturnMode = useSpiritOrbStore((state) => state.selectReturnMode);
  const selectReviewWindow = useSpiritOrbStore((state) => state.selectReviewWindow);
  const craft = useSpiritOrbStore((state) => state.craft);
  const requestReview = useSpiritOrbStore((state) => state.requestReview);
  const review = useSpiritOrbStore((state) => state.review);
  const resume = useSpiritOrbStore((state) => state.resume);
  const position = useSpiritOrbStore((state) => state.position);

  const sourceReturnKeyId = spiritReturn?.status === 'completed' && spiritReturn.possibleReturnKeyCreated
    ? spiritReturn.completedAt ?? `${spiritReturn.sourceDecisionId}:possible-return-key`
    : undefined;
  const progress = sourceReturnKeyId && storedProgress?.sourceReturnKeyId === sourceReturnKeyId
    ? storedProgress
    : undefined;

  if (!sourceReturnKeyId) {
    return <div className="page page--spirit page--spirit-orb"><PageHeader eyebrow="Capítulo do Espírito · Crafting" title="A receita do Orbe ainda está incompleta." description="Conclua O Retorno que Não Condena e crie a Chave do Retorno Possível."/><Card title="Componente necessário" eyebrow="Chave do Retorno Possível"><Button onClick={() => navigate('/mission/return-without-condemnation')}>Abrir a quinta missão</Button></Card></div>;
  }

  if (!progress) {
    return <div className="page page--spirit page--spirit-orb"><PageHeader eyebrow="Capítulo do Espírito · Crafting" title="Tecelagem do Orbe da Integração Possível" description="Reúna os cinco componentes sem exigir coerência, decisão, retorno ou ação externa."/><div className="spirit-orb-intro-grid"><Card title={spiritOrbBiblicalUnit.title} eyebrow={spiritOrbBiblicalUnit.reference}><blockquote>{spiritOrbBiblicalUnit.principle}</blockquote><p>{spiritOrbBiblicalUnit.context}</p><div className="provenance-inline"><BookOpenText size={17}/><span>A Bíblia inicia a receita; o Orbe é uma síntese de gameplay da Tehkné Solutions.</span></div></Card><Card title="Iniciar a tecelagem" eyebrow="Sem integração presumida"><div className="spirit-orb-preview" aria-hidden="true"><Circle/></div><p>O item registra um conjunto temporário e revisável. Ele não mede coerência, pureza, maturidade ou elevação espiritual.</p><Button onClick={() => start(sourceReturnKeyId)}>Organizar a receita</Button></Card></div></div>;
  }

  const selectedFunction = spiritOrbFunctions.find((item) => item.id === progress.function);
  const selectedVisible = spiritOrbVisibleDimensions.find((item) => item.id === progress.visibleDimension);
  const selectedDisagreement = spiritOrbDisagreements.find((item) => item.id === progress.disagreement);
  const selectedDecision = spiritOrbDecisions.find((item) => item.id === progress.decision);
  const selectedReturn = spiritOrbReturns.find((item) => item.id === progress.returnMode);
  const selectedReview = spiritOrbReviewWindows.find((item) => item.id === progress.reviewWindow);
  const nodes = chainNodeIds
    .map((id) => spiritOrbNodes.find((node) => node.id === id))
    .filter((node): node is SymbolicNode => Boolean(node))
    .map((node) => resolveNode(node, enabledLayers));

  const submitReview = (outcome: ReviewOutcome) => {
    review(outcome, reflection);
    setReflection('');
  };

  if (progress.status === 'integrated') {
    return <div className="page page--spirit page--spirit-orb"><PageHeader eyebrow={progress.positioned ? 'Orbe posicionado' : 'Ciclo integrado'} title={progress.positioned ? 'O Orbe ocupa seu lugar no Santuário.' : 'O Orbe da Integração Possível foi integrado.'} description="O item registra uma fórmula revisada. Ele não representa completude, cura ou integração espiritual alcançada."/><div className="spirit-orb-result-grid"><Card className="spirit-orb-item-card"><div className="spirit-orb-preview spirit-orb-preview--complete" aria-hidden="true"><Circle/></div><p className="eyebrow">Instrumento de jornada</p><h2>Orbe da Integração Possível</h2><span className="item-status item-status--integrated">Integrado</span></Card><Card title="Fórmula integrada" eyebrow="Partes e diferenças preservadas"><ul className="simple-list"><li><strong>Função:</strong> {selectedFunction?.label}</li><li><strong>Dimensão visível:</strong> {selectedVisible?.label}</li><li><strong>Discordância:</strong> {selectedDisagreement?.label}</li><li><strong>Decisão:</strong> {selectedDecision?.label}</li><li><strong>Retorno:</strong> {selectedReturn?.label}</li><li><strong>Revisão:</strong> {selectedReview?.label}</li></ul>{progress.reflection && <p className="spirit-orb-reflection">{progress.reflection}</p>}</Card></div><Card title={progress.positioned ? 'Item posicionado' : 'Posicionar no Santuário'} eyebrow="Transformação do Templo"><p>{progress.positioned ? 'O Santuário reconhece o item integrado. O Capítulo do Espírito ainda exige encerramento próprio.' : 'Somente itens integrados podem ser posicionados. O posicionamento não encerra automaticamente o capítulo.'}</p><div className="spirit-orb-actions">{!progress.positioned && <Button onClick={position}>Posicionar o Orbe</Button>}<Button variant="secondary" onClick={() => navigate('/temple/spirit-sanctuary')}>Voltar ao Santuário</Button><Button variant="ghost" onClick={() => navigate('/inventory')}>Abrir inventário</Button></div></Card></div>;
  }

  if (progress.status === 'resting') {
    return <div className="page page--spirit page--spirit-orb"><PageHeader eyebrow="Ciclo em repouso" title="O Orbe permanece guardado sem desaparecer." description="Repousar não apaga componentes e não cria prazo obrigatório."/><Card title="Retomar quando fizer sentido" eyebrow="Sem sequência perdida"><div className="safety-summary"><MoonStar/><p>A receita e suas escolhas permanecem no dispositivo.</p></div><div className="spirit-orb-actions"><Button onClick={resume}><RotateCcw size={18}/> Retomar e ajustar</Button><Button variant="ghost" onClick={() => navigate('/temple/spirit-sanctuary')}>Voltar ao Santuário</Button></div></Card></div>;
  }

  if (progress.status === 'awaiting_review') {
    return <div className="page page--spirit page--spirit-orb"><PageHeader eyebrow="Revisão do Orbe" title="A criação ainda não encerra o ciclo." description="Escolha integrar, ajustar ou repousar. Nenhuma opção reduz progresso."/><div className="spirit-orb-review-grid"><Card title="Fórmula atual" eyebrow="Aguardando revisão"><ul className="simple-list"><li><strong>Função:</strong> {selectedFunction?.label}</li><li><strong>Dimensão visível:</strong> {selectedVisible?.label}</li><li><strong>Discordância:</strong> {selectedDisagreement?.label}</li><li><strong>Decisão:</strong> {selectedDecision?.label}</li><li><strong>Retorno:</strong> {selectedReturn?.label}</li><li><strong>Revisão:</strong> {selectedReview?.label}</li></ul></Card><Card title="Registro opcional" eyebrow="Não altera recompensa"><label className="field-label" htmlFor="orb-reflection">O que deseja preservar desta revisão?</label><textarea id="orb-reflection" rows={5} value={reflection} onChange={(event) => setReflection(event.target.value)} placeholder="Este campo pode permanecer vazio."/></Card></div><Card title="Destino do ciclo" eyebrow="Escolha reversível"><div className="spirit-orb-actions"><Button onClick={() => submitReview('integrated')}>Integrar o Orbe</Button><Button variant="secondary" onClick={() => submitReview('adjusted')}>Ajustar a fórmula</Button><Button variant="ghost" onClick={() => submitReview('resting')}>Colocar em repouso</Button></div></Card></div>;
  }

  if (progress.status === 'active') {
    return <div className="page page--spirit page--spirit-orb"><PageHeader eyebrow="Orbe criado" title="A fórmula agora precisa de retorno." description="Criar o item não confirma coerência, ação ou integração."/><div className="spirit-orb-result-grid"><Card className="spirit-orb-item-card"><div className="spirit-orb-preview" aria-hidden="true"><Circle/></div><h2>Orbe da Integração Possível</h2><span className="item-status item-status--active">Ativo</span></Card><Card title="Próxima etapa" eyebrow="Revisão explícita"><p>O Athanor não verifica se qualquer decisão, retorno ou ação externa aconteceu.</p><Button onClick={requestReview}>Revisar o Orbe agora</Button></Card></div></div>;
  }

  const craftReady = canCraftSpiritOrb(progress);

  return <div className="page page--spirit page--spirit-orb"><PageHeader eyebrow={progress.status === 'adjusted' ? 'Receita em ajuste' : 'Crafting do Espírito'} title="Organize a fórmula do Orbe." description="Todas as escolhas são temporárias, locais e revisáveis."/><Card title="Componentes reunidos" eyebrow="Cinco práticas do Espírito"><div className="spirit-orb-components-grid">{spiritOrbRecipe.componentIds.map((id) => <div key={id} className="spirit-orb-component"><CheckCircle2/><strong>{spiritOrbComponentLabels[id]}</strong><small>Disponível</small></div>)}</div></Card><OrbOptions title="1. Função temporária" eyebrow="O que o item preservará" options={spiritOrbFunctions} selected={progress.function} onSelect={selectFunction}/><OrbOptions title="2. Dimensão inicialmente visível" eyebrow="Inclui nenhuma dimensão" options={spiritOrbVisibleDimensions} selected={progress.visibleDimension} onSelect={selectVisibleDimension}/><OrbOptions title="3. Discordância" eyebrow="Sem consenso obrigatório" options={spiritOrbDisagreements} selected={progress.disagreement} onSelect={selectDisagreement}/><OrbOptions title="4. Decisão" eyebrow="Inclui retirada e ausência" options={spiritOrbDecisions} selected={progress.decision} onSelect={selectDecision}/><OrbOptions title="5. Possibilidade de retorno" eyebrow="Inclui arquivo e nenhum retorno" options={spiritOrbReturns} selected={progress.returnMode} onSelect={selectReturnMode}/><OrbOptions title="6. Revisão" eyebrow="Sem prazo obrigatório" options={spiritOrbReviewWindows} selected={progress.reviewWindow} onSelect={selectReviewWindow}/><Card title="Cadeia opcional" eyebrow="Proveniência por camada"><div className="spirit-orb-chain-grid">{nodes.map((node) => <article key={node.id} className="spirit-orb-chain-node"><span className={`provenance-badge provenance-badge--${node.provenance.class.toLowerCase()}`}>{node.provenance.class}</span><h3>{node.name}</h3><p>{node.description}</p><small>{node.provenance.label}</small></article>)}</div></Card><Card title="Tecer o Orbe da Integração Possível" eyebrow="Sem promessa de completude"><div className="safety-summary"><ShieldCheck/><p>O item registra um conjunto provisório. Não mede integração, não executa decisões e não produz leitura espiritual.</p></div><div className="spirit-orb-actions"><Button disabled={!craftReady} onClick={craft}>Tecer Orbe <Hammer size={18}/></Button><Button variant="ghost" onClick={() => navigate('/temple/spirit-sanctuary')}>Pausar e voltar</Button></div></Card></div>;
}

interface OrbOptionsProps<T extends string> {
  title: string;
  eyebrow: string;
  options: Array<{ id: T; label: string; description: string }>;
  selected?: T;
  onSelect: (id: T) => void;
}

function OrbOptions<T extends string>({ title, eyebrow, options, selected, onSelect }: OrbOptionsProps<T>) {
  return <Card title={title} eyebrow={eyebrow}><div className="spirit-orb-option-list">{options.map((option) => <button key={option.id} type="button" aria-pressed={selected === option.id} onClick={() => onSelect(option.id)}><strong>{option.label}</strong><span>{option.description}</span></button>)}</div></Card>;
}
