import { AlertTriangle, ArrowRight, BookOpenText, CheckCircle2, Circle, GitBranch, Pause, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { spiritCenterNodes } from '../content/spiritCenter';
import {
  spiritCouncilBasisOptions,
  spiritCouncilBiblicalUnit,
  spiritCouncilDecisionOptions,
  spiritCouncilDimensionLabels,
  spiritCouncilDisagreementOptions,
  spiritCouncilEntries,
  spiritCouncilNodes,
  spiritCouncilScenarios,
  spiritCouncilVoiceOptions
} from '../content/spiritCouncil';
import { spiritFoundationNodes } from '../content/spiritFoundation';
import {
  canCompleteSpiritCouncil,
  spiritCouncilDimensions,
  type SpiritCouncilCategory
} from '../domain/spiritCouncil';
import type { SymbolicNode } from '../domain/types';
import { useAthanorStore } from '../state/useAthanorStore';
import { useSpiritCenterStore } from '../state/useSpiritCenterStore';
import { useSpiritCouncilStore } from '../state/useSpiritCouncilStore';

const categoryLabels: Record<SpiritCouncilCategory, string> = {
  agreement: 'Acordo',
  negotiation: 'Negociação',
  silence: 'Silêncio',
  coercion: 'Coerção'
};

const allSpiritNodes = [...spiritFoundationNodes, ...spiritCenterNodes, ...spiritCouncilNodes];
const chainNodeIds = [
  'spirit_binah_council_v1',
  'spirit_ruach_voices_v1',
  'spirit_dui_council_v1',
  'spirit_temperance_council_v1',
  'spirit_open_council_seal_v1'
];

function resolveNode(node: SymbolicNode, enabledLayers: string[]): SymbolicNode {
  if (!node.layer || enabledLayers.includes(node.layer)) return node;
  return allSpiritNodes.find((candidate) => candidate.id === node.fallbackNodeId) ?? node;
}

export function SpiritCouncilPage() {
  const navigate = useNavigate();
  const enabledLayers = useAthanorStore((state) => state.preferences.enabledLayers);
  const rawCenter = useSpiritCenterStore((state) => state.progress);
  const storedProgress = useSpiritCouncilStore((state) => state.progress);
  const start = useSpiritCouncilStore((state) => state.start);
  const classify = useSpiritCouncilStore((state) => state.classify);
  const skipClassification = useSpiritCouncilStore((state) => state.skipClassification);
  const selectScenario = useSpiritCouncilStore((state) => state.selectScenario);
  const setVoice = useSpiritCouncilStore((state) => state.setVoice);
  const setDisagreement = useSpiritCouncilStore((state) => state.setDisagreement);
  const setBasis = useSpiritCouncilStore((state) => state.setBasis);
  const setDecision = useSpiritCouncilStore((state) => state.setDecision);
  const declineCouncil = useSpiritCouncilStore((state) => state.declineCouncil);
  const complete = useSpiritCouncilStore((state) => state.complete);

  const centerCompleted = rawCenter?.status === 'completed' && rawCenter.provisionalCenterKnotCreated;
  const sourceCenterId = centerCompleted && rawCenter
    ? rawCenter.completedAt ?? `${rawCenter.sourceThreadId}:provisional-center-knot`
    : undefined;
  const progress = sourceCenterId && storedProgress?.sourceCenterId === sourceCenterId
    ? storedProgress
    : undefined;

  if (!sourceCenterId) {
    return <div className="page page--spirit"><PageHeader eyebrow="Capítulo do Espírito · Terceira missão" title="O conselho ainda não pode ser aberto." description="Conclua primeiro O Centro que Não Apaga as Partes na jornada atual."/><Card title="Dependência do Nó" eyebrow="Caminho ainda fechado"><Button onClick={() => navigate('/mission/center-without-erasing')}>Voltar ao Centro Provisório</Button></Card></div>;
  }

  if (!progress) {
    return <div className="page page--spirit page--spirit-council"><PageHeader eyebrow="Capítulo do Espírito · Terceira missão" title="O Conselho das Partes" description="Permita fala, passagem, desconhecimento e discordância sem maioria obrigatória."/><div className="spirit-council-intro-grid"><Card title={spiritCouncilBiblicalUnit.title} eyebrow={spiritCouncilBiblicalUnit.reference}><blockquote>{spiritCouncilBiblicalUnit.principle}</blockquote><p>{spiritCouncilBiblicalUnit.context}</p><div className="provenance-inline"><BookOpenText size={17}/><span>A fonte bíblica inicia a missão. As demais relações são comparações opcionais e identificadas.</span></div></Card><Card title="Antes de começar" eyebrow="Autonomia"><ul className="simple-list"><li>nenhuma parte precisa falar;</li><li>passar ou não saber mantém a parte presente;</li><li>discordâncias não precisam ser resolvidas;</li><li>adiar, não decidir e recusar são conclusões completas.</li></ul><div className="spirit-actions"><Button onClick={() => start(sourceCenterId)}>Abrir o conselho <ArrowRight size={18}/></Button><Button variant="ghost" onClick={() => navigate('/safety?source=spirit-council')}><ShieldCheck size={18}/> Apoio direto</Button></div></Card></div></div>;
  }

  if (progress.status === 'completed') {
    const nodes = chainNodeIds
      .map((id) => allSpiritNodes.find((node) => node.id === id))
      .filter((node): node is SymbolicNode => Boolean(node))
      .map((node) => resolveNode(node, enabledLayers));
    const speaking = Object.values(progress.voiceStates).filter((state) => state === 'speak').length;
    const passing = Object.values(progress.voiceStates).filter((state) => state === 'pass').length;
    const unknown = Object.values(progress.voiceStates).filter((state) => state === 'unknown').length;

    return <div className="page page--spirit page--spirit-council"><PageHeader eyebrow="Componente criado" title="O conselho permaneceu aberto às diferenças." description="O Selo registra escolhas curadas. Ele não mede consenso, maturidade ou integração espiritual."/><div className="spirit-council-result-grid"><Card className="spirit-council-seal-card"><div className="spirit-council-seal" aria-hidden="true"><Circle/></div><p className="eyebrow">Terceiro componente do Espírito</p><h2>Selo do Conselho Aberto</h2><span className="item-status item-status--active">Criado</span></Card><Card title="Fórmula registrada" eyebrow="Sem maioria"><ul className="simple-list"><li><strong>Falaram:</strong> {speaking}</li><li><strong>Passaram:</strong> {passing}</li><li><strong>Desconhecidas:</strong> {unknown}</li><li><strong>Discordância:</strong> {spiritCouncilDisagreementOptions.find((item) => item.id === progress.disagreement)?.label}</li><li><strong>Base:</strong> {spiritCouncilBasisOptions.find((item) => item.id === progress.basis)?.label}</li><li><strong>Decisão:</strong> {spiritCouncilDecisionOptions.find((item) => item.id === progress.decision)?.label}</li></ul></Card></div><Card title="Cadeia opcional" eyebrow="Proveniência por camada"><div className="spirit-chain-grid">{nodes.map((node) => <article key={node.id} className="spirit-chain-node"><span className={`provenance-badge provenance-badge--${node.provenance.class.toLowerCase()}`}>{node.provenance.class}</span><h3>{node.name}</h3><p>{node.description}</p><small>{node.provenance.label}</small></article>)}</div></Card><Card title="Próximo passo" eyebrow="Sem conclusão automática"><p>O Selo é o terceiro componente do Espírito. Ele preserva o Fio e o Nó, não transforma maioria em verdade e não conclui o capítulo.</p><div className="spirit-actions"><Button onClick={() => navigate('/temple/spirit-sanctuary')}>Voltar ao Santuário</Button><Button variant="ghost" onClick={() => navigate('/temple')}>Abrir o Átrio</Button></div></Card></div>;
  }

  const selectedScenario = spiritCouncilScenarios.find((scenario) => scenario.id === progress.scenarioId);
  const completeReady = canCompleteSpiritCouncil(progress, spiritCouncilEntries.length);

  return <div className="page page--spirit page--spirit-council"><PageHeader eyebrow="O Conselho das Partes" title="Escuta não exige maioria nem concordância." description="Todos os exemplos são fictícios. Nenhuma escolha recebe pontuação de consenso ou harmonia." action={<Button variant="ghost" onClick={() => navigate('/safety?source=spirit-council')}><AlertTriangle size={18}/> Apoio direto</Button>}/>
    <Card title="1. Distinguir quatro movimentos" eyebrow="Exemplos fictícios"><div className="spirit-council-classification-list">{spiritCouncilEntries.map((entry) => { const selected = progress.classifications[entry.id]; return <article key={entry.id} className="spirit-council-entry"><p>{entry.text}</p><div className="classification-actions">{(Object.keys(categoryLabels) as SpiritCouncilCategory[]).map((category) => <button key={category} type="button" aria-pressed={selected === category} onClick={() => classify(entry.id, category)}>{categoryLabels[category]}</button>)}</div>{selected && <p className="classification-feedback" data-match={selected === entry.suggestedCategory}>Sugestão editorial: {categoryLabels[entry.suggestedCategory]}. {entry.explanation}</p>}</article>; })}</div><Button variant="ghost" onClick={skipClassification}>Concluir sem classificar</Button>{progress.classificationSkipped && <p className="field-help"><CheckCircle2 size={16}/> Classificação recusada sem perda de progresso.</p>}</Card>
    <Card title="2. Escolher um cenário fictício" eyebrow="Conselho sem votação"><div className="spirit-council-scenario-grid">{spiritCouncilScenarios.map((scenario) => <button key={scenario.id} type="button" aria-pressed={progress.scenarioId === scenario.id} onClick={() => selectScenario(scenario.id)}><strong>{scenario.title}</strong><span>{scenario.description}</span></button>)}</div></Card>
    <Card title="3. Registrar a participação das cinco partes" eyebrow="Falar, passar ou não saber"><div className="spirit-council-voices">{spiritCouncilDimensions.map((dimension) => <article key={dimension} className="spirit-council-voice"><h3>{spiritCouncilDimensionLabels[dimension]}</h3><p>{selectedScenario?.prompts[dimension] ?? 'Escolha primeiro um cenário fictício.'}</p><div className="spirit-council-option-grid">{spiritCouncilVoiceOptions.map((option) => <button key={option.id} type="button" disabled={!selectedScenario} aria-pressed={progress.voiceStates[dimension] === option.id} onClick={() => setVoice(dimension, option.id)}><strong>{option.label}</strong><small>{option.description}</small></button>)}</div></article>)}</div></Card>
    <Card title="4. Preservar a discordância" eyebrow="Diferença não é falha"><div className="spirit-council-option-grid">{spiritCouncilDisagreementOptions.map((option) => <button key={option.id} type="button" aria-pressed={progress.disagreement === option.id} onClick={() => setDisagreement(option.id)}><strong>{option.label}</strong><small>{option.description}</small></button>)}</div></Card>
    <Card title="5. Escolher base e encerramento" eyebrow="Sem regra majoritária"><div className="spirit-council-option-grid">{spiritCouncilBasisOptions.map((option) => <button key={option.id} type="button" aria-pressed={progress.basis === option.id} onClick={() => setBasis(option.id)}><strong>{option.label}</strong><small>{option.description}</small></button>)}</div><div className="spirit-council-option-grid">{spiritCouncilDecisionOptions.filter((option) => option.id !== 'decline').map((option) => <button key={option.id} type="button" aria-pressed={progress.decision === option.id} onClick={() => setDecision(option.id)}>{option.id === 'postpone' ? <Pause size={17}/> : option.id === 'provisional' ? <GitBranch size={17}/> : <Circle size={17}/>}<strong>{option.label}</strong><small>{option.description}</small></button>)}</div><Button variant="ghost" onClick={declineCouncil}>Recusar integralmente o conselho</Button>{progress.councilDeclined && <p className="field-help"><CheckCircle2 size={16}/> Recusa registrada como conclusão completa.</p>}</Card>
    <Card title="Criar o Selo do Conselho Aberto" eyebrow="Discordância preservada"><div className="safety-summary"><ShieldCheck/><p>O conselho é uma prática fictícia de gameplay. Não produz verdade por maioria, leitura oculta, diagnóstico ou direção espiritual.</p></div><div className="spirit-actions"><Button disabled={!completeReady} onClick={complete}>Criar o Selo <Sparkles size={18}/></Button><Button variant="ghost" onClick={() => navigate('/temple/spirit-sanctuary')}>Pausar e voltar</Button></div>{!completeReady && <p className="field-help">Conclua ou recuse a classificação; depois escolha cenário, participação das cinco partes, discordância, base e decisão — ou recuse todo o conselho.</p>}</Card>
  </div>;
}
