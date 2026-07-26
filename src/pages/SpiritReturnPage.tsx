import { AlertTriangle, Archive, ArrowRight, BookOpenText, CheckCircle2, Circle, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { spiritDecisionNodes } from '../content/spiritDecision';
import {
  spiritReturnBasisOptions,
  spiritReturnBiblicalUnit,
  spiritReturnContextOptions,
  spiritReturnDispositionOptions,
  spiritReturnEntries,
  spiritReturnNodes,
  spiritReturnObservationOptions,
  spiritReturnResourceOptions,
  spiritReturnScenarios
} from '../content/spiritReturn';
import { canCompleteSpiritReturn, type SpiritReturnCategory } from '../domain/spiritReturn';
import type { SymbolicNode } from '../domain/types';
import { useAthanorStore } from '../state/useAthanorStore';
import { useSpiritDecisionStore } from '../state/useSpiritDecisionStore';
import { useSpiritReturnStore } from '../state/useSpiritReturnStore';

const categoryLabels: Record<SpiritReturnCategory, string> = {
  review: 'Revisão',
  correction: 'Correção',
  repetition: 'Repetição',
  punishment: 'Punição'
};

const allSpiritNodes = [...spiritDecisionNodes, ...spiritReturnNodes];
const chainNodeIds = ['spirit_yesod_record_v1', 'spirit_ruach_revisit_v1', 'spirit_kan_return_v1', 'spirit_hermit_return_v1', 'spirit_possible_return_key_v1'];

function resolveNode(node: SymbolicNode, enabledLayers: string[]): SymbolicNode {
  if (!node.layer || enabledLayers.includes(node.layer)) return node;
  return allSpiritNodes.find((candidate) => candidate.id === node.fallbackNodeId) ?? node;
}

export function SpiritReturnPage() {
  const navigate = useNavigate();
  const enabledLayers = useAthanorStore((state) => state.preferences.enabledLayers);
  const rawDecision = useSpiritDecisionStore((state) => state.progress);
  const storedProgress = useSpiritReturnStore((state) => state.progress);
  const start = useSpiritReturnStore((state) => state.start);
  const classify = useSpiritReturnStore((state) => state.classify);
  const skipClassification = useSpiritReturnStore((state) => state.skipClassification);
  const selectScenario = useSpiritReturnStore((state) => state.selectScenario);
  const setObservation = useSpiritReturnStore((state) => state.setObservation);
  const setContext = useSpiritReturnStore((state) => state.setContext);
  const setResources = useSpiritReturnStore((state) => state.setResources);
  const setBasis = useSpiritReturnStore((state) => state.setBasis);
  const setDisposition = useSpiritReturnStore((state) => state.setDisposition);
  const declineReturn = useSpiritReturnStore((state) => state.declineReturn);
  const complete = useSpiritReturnStore((state) => state.complete);

  const decisionCompleted = rawDecision?.status === 'completed' && rawDecision.revisableDecisionMarkCreated;
  const sourceDecisionId = decisionCompleted && rawDecision
    ? rawDecision.completedAt ?? `${rawDecision.sourceCouncilId}:revisable-decision-mark`
    : undefined;
  const progress = sourceDecisionId && storedProgress?.sourceDecisionId === sourceDecisionId ? storedProgress : undefined;

  if (!sourceDecisionId) {
    return <div className="page page--spirit"><PageHeader eyebrow="Capítulo do Espírito · Quinta missão" title="O retorno ainda não pode ser aberto." description="Conclua primeiro A Decisão que Permanece Aberta na jornada atual."/><Card title="Dependência da Marca" eyebrow="Caminho ainda fechado"><Button onClick={() => navigate('/mission/decision-remains-open')}>Voltar à Decisão</Button></Card></div>;
  }

  if (!progress) {
    return <div className="page page--spirit page--spirit-return"><PageHeader eyebrow="Capítulo do Espírito · Quinta missão" title="O Retorno que Não Condena" description="Observe o que aconteceu, reconheça mudanças e escolha voltar ou não voltar sem cobrança de consistência."/><div className="spirit-return-intro-grid"><Card title={spiritReturnBiblicalUnit.title} eyebrow={spiritReturnBiblicalUnit.reference}><blockquote>{spiritReturnBiblicalUnit.principle}</blockquote><p>{spiritReturnBiblicalUnit.context}</p><div className="provenance-inline"><BookOpenText size={17}/><span>A Bíblia inicia a missão. Cabala, Sefer, I Ching e Tarot permanecem opcionais e identificados.</span></div></Card><Card title="Antes de começar" eyebrow="Autonomia"><ul className="simple-list"><li>todos os cenários são fictícios;</li><li>resultado desconhecido permanece desconhecido;</li><li>arquivar e não retomar são conclusões completas;</li><li>nenhuma ação real será executada.</li></ul><div className="spirit-actions"><Button onClick={() => start(sourceDecisionId)}>Iniciar o retorno <ArrowRight size={18}/></Button><Button variant="ghost" onClick={() => navigate('/safety?source=spirit-return')}><ShieldCheck size={18}/> Apoio direto</Button></div></Card></div></div>;
  }

  if (progress.status === 'completed') {
    const nodes = chainNodeIds.map((id) => allSpiritNodes.find((node) => node.id === id)).filter((node): node is SymbolicNode => Boolean(node)).map((node) => resolveNode(node, enabledLayers));
    return <div className="page page--spirit page--spirit-return"><PageHeader eyebrow="Componente criado" title="O retorno permaneceu possível, não obrigatório." description="A Chave registra uma revisão fictícia. Ela não mede consistência, disciplina ou amadurecimento espiritual."/><div className="spirit-return-result-grid"><Card className="spirit-return-key-card"><div className="spirit-return-key" aria-hidden="true"><RotateCcw/></div><p className="eyebrow">Quinto componente do Espírito</p><h2>Chave do Retorno Possível</h2><span className="item-status item-status--active">Criada</span></Card><Card title="Fórmula registrada" eyebrow="Sem condenação"><ul className="simple-list"><li><strong>Observação:</strong> {spiritReturnObservationOptions.find((item) => item.id === progress.observation)?.label}</li><li><strong>Contexto:</strong> {spiritReturnContextOptions.find((item) => item.id === progress.context)?.label}</li><li><strong>Recursos:</strong> {spiritReturnResourceOptions.find((item) => item.id === progress.resources)?.label}</li><li><strong>Destino:</strong> {spiritReturnDispositionOptions.find((item) => item.id === progress.disposition)?.label}</li></ul></Card></div><Card title="Cadeia opcional" eyebrow="Proveniência por camada"><div className="spirit-chain-grid">{nodes.map((node) => <article key={node.id} className="spirit-chain-node"><span className={`provenance-badge provenance-badge--${node.provenance.class.toLowerCase()}`}>{node.provenance.class}</span><h3>{node.name}</h3><p>{node.description}</p><small>{node.provenance.label}</small></article>)}</div></Card><Card title="Próximo passo" eyebrow="Sem conclusão automática"><p>A Chave é o quinto componente do Espírito. Ela preserva Fio, Nó, Selo e Marca, mas ainda não conclui o capítulo.</p><div className="spirit-actions"><Button onClick={() => navigate('/temple/spirit-sanctuary')}>Voltar ao Santuário</Button><Button variant="ghost" onClick={() => navigate('/temple')}>Abrir o Átrio</Button></div></Card></div>;
  }

  const selectedScenario = spiritReturnScenarios.find((scenario) => scenario.id === progress.scenarioId);
  const allowedDispositions = spiritReturnDispositionOptions.filter((option) => {
    if (option.id === 'redo' && (progress.observation === 'unknown' || progress.resources === 'unavailable')) return false;
    if (option.id === 'maintain' && progress.resources === 'unavailable') return false;
    return true;
  });
  const completeReady = canCompleteSpiritReturn(progress, spiritReturnEntries.length);

  return <div className="page page--spirit page--spirit-return"><PageHeader eyebrow="O Retorno que Não Condena" title="Rever não exige repetir nem compensar." description="Todos os dados pertencem a cenários fictícios. Não existe pontuação de continuidade, correção ou produtividade." action={<Button variant="ghost" onClick={() => navigate('/safety?source=spirit-return')}><AlertTriangle size={18}/> Apoio direto</Button>}/>
    <Card title="1. Distinguir quatro ideias" eyebrow="Exemplos fictícios"><div className="spirit-return-classification-list">{spiritReturnEntries.map((entry) => { const selected = progress.classifications[entry.id]; return <article key={entry.id} className="spirit-return-entry"><p>{entry.text}</p><div className="classification-actions">{(Object.keys(categoryLabels) as SpiritReturnCategory[]).map((category) => <button key={category} type="button" aria-pressed={selected === category} onClick={() => classify(entry.id, category)}>{categoryLabels[category]}</button>)}</div>{selected && <p className="classification-feedback" data-match={selected === entry.suggestedCategory}>Sugestão editorial: {categoryLabels[entry.suggestedCategory]}. {entry.explanation}</p>}</article>; })}</div><Button variant="ghost" onClick={skipClassification}>Concluir sem classificar</Button>{progress.classificationSkipped && <p className="field-help"><CheckCircle2 size={16}/> Classificação recusada sem perda de progresso.</p>}</Card>
    <Card title="2. Retornar a uma decisão fictícia" eyebrow="Escolha e observação"><div className="spirit-return-scenario-grid">{spiritReturnScenarios.map((scenario) => <button key={scenario.id} type="button" aria-pressed={progress.scenarioId === scenario.id} onClick={() => selectScenario(scenario.id)}><strong>{scenario.title}</strong><span>{scenario.decision}</span></button>)}</div>{selectedScenario && <div className="spirit-return-comparison"><p><strong>Decisão:</strong> {selectedScenario.decision}</p><p><strong>Observado:</strong> {selectedScenario.observed}</p><p><strong>Contexto:</strong> {selectedScenario.context}</p><p><strong>Recursos:</strong> {selectedScenario.resources}</p></div>}</Card>
    <Card title="3. Registrar o que foi observado" eyebrow="Desconhecimento preservado"><div className="spirit-return-option-grid">{spiritReturnObservationOptions.map((option) => <button key={option.id} type="button" disabled={!selectedScenario} aria-pressed={progress.observation === option.id} onClick={() => setObservation(option.id)}><strong>{option.label}</strong><small>{option.description}</small></button>)}</div></Card>
    <Card title="4. Reconhecer contexto e recursos" eyebrow="Sem culpa"><div className="spirit-return-option-grid">{spiritReturnContextOptions.map((option) => <button key={option.id} type="button" disabled={!selectedScenario} aria-pressed={progress.context === option.id} onClick={() => setContext(option.id)}><strong>{option.label}</strong><small>{option.description}</small></button>)}</div><div className="spirit-return-option-grid">{spiritReturnResourceOptions.map((option) => <button key={option.id} type="button" disabled={!selectedScenario} aria-pressed={progress.resources === option.id} onClick={() => setResources(option.id)}><strong>{option.label}</strong><small>{option.description}</small></button>)}</div></Card>
    <Card title="5. Escolher a base e o destino" eyebrow="Retorno não obrigatório"><div className="spirit-return-option-grid">{spiritReturnBasisOptions.map((option) => <button key={option.id} type="button" aria-pressed={progress.basis === option.id} onClick={() => setBasis(option.id)}><strong>{option.label}</strong><small>{option.description}</small></button>)}</div><div className="spirit-return-option-grid">{allowedDispositions.map((option) => <button key={option.id} type="button" aria-pressed={progress.disposition === option.id} onClick={() => setDisposition(option.id)}>{option.id === 'redo' ? <RotateCcw size={17}/> : option.id === 'archive' ? <Archive size={17}/> : option.id === 'no_return' ? <Circle size={17}/> : <Sparkles size={17}/>}<strong>{option.label}</strong><small>{option.description}</small></button>)}</div><Button variant="ghost" onClick={declineReturn}>Recusar integralmente o retorno</Button>{progress.returnDeclined && <p className="field-help"><CheckCircle2 size={16}/> Recusa registrada como conclusão completa.</p>}</Card>
    <Card title="Criar a Chave do Retorno Possível" eyebrow="Sem punição ou cobrança"><div className="safety-summary"><ShieldCheck/><p>Nenhuma decisão real será repetida, corrigida ou arquivada pelo aplicativo. A Chave pertence somente ao cenário fictício.</p></div><div className="spirit-actions"><Button disabled={!completeReady} onClick={() => complete(spiritReturnEntries.length)}>Criar a Chave <Sparkles size={18}/></Button><Button variant="ghost" onClick={() => navigate('/temple/spirit-sanctuary')}>Pausar e voltar</Button></div>{!completeReady && <p className="field-help">Conclua ou recuse a classificação; depois escolha cenário, observação, contexto, recursos, base e destino — ou recuse todo o retorno.</p>}</Card>
  </div>;
}
