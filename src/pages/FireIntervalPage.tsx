import { AlertTriangle, ArrowRight, BookOpenText, CheckCircle2, Clock3, Flame, LogOut, Pause, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import {
  fireExitOptions,
  fireIntervalBiblicalUnit,
  fireIntervalNodes,
  fireIntervalOptions,
  fireTimelineEntries,
  fireUrgencyEntries
} from '../content/fireInterval';
import {
  canCompleteFireInterval,
  type FireTimelinePhase,
  type FireUrgencyCategory
} from '../domain/fireInterval';
import type { SymbolicNode } from '../domain/types';
import { useAthanorStore } from '../state/useAthanorStore';
import { useFireIntervalStore } from '../state/useFireIntervalStore';
import { useFireMissionStore } from '../state/useFireMissionStore';

const timelineLabels: Record<FireTimelinePhase, string> = {
  trigger: 'Gatilho',
  body_signal: 'Sinal corporal',
  impulse: 'Impulso',
  gesture: 'Gesto'
};

const urgencyLabels: Record<FireUrgencyCategory, string> = {
  immediate_safety: 'Segurança imediata',
  time_sensitive: 'Prazo verificável',
  perceived_pressure: 'Pressão percebida',
  insufficient_information: 'Informação insuficiente'
};

function resolveNode(node: SymbolicNode, enabledLayers: string[]): SymbolicNode {
  if (!node.layer || enabledLayers.includes(node.layer)) return node;
  return fireIntervalNodes.find((candidate) => candidate.id === node.fallbackNodeId) ?? node;
}

export function FireIntervalPage() {
  const navigate = useNavigate();
  const forge = useAthanorStore((state) => state.temple?.rooms.find((room) => room.roomId === 'forge'));
  const enabledLayers = useAthanorStore((state) => state.preferences.enabledLayers);
  const fireMission = useFireMissionStore((state) => state.progress);
  const storedProgress = useFireIntervalStore((state) => state.progress);
  const start = useFireIntervalStore((state) => state.start);
  const classifyTimeline = useFireIntervalStore((state) => state.classifyTimeline);
  const skipTimeline = useFireIntervalStore((state) => state.skipTimeline);
  const classifyUrgency = useFireIntervalStore((state) => state.classifyUrgency);
  const skipUrgency = useFireIntervalStore((state) => state.skipUrgency);
  const setInterval = useFireIntervalStore((state) => state.setInterval);
  const setExit = useFireIntervalStore((state) => state.setExit);
  const complete = useFireIntervalStore((state) => state.complete);

  const sourceNamedFlameId = fireMission?.status === 'completed'
    ? fireMission.completedAt ?? fireMission.updatedAt
    : undefined;
  const progress = sourceNamedFlameId && storedProgress?.sourceNamedFlameId === sourceNamedFlameId
    ? storedProgress
    : undefined;
  const available = Boolean(
    forge
      && forge.status !== 'dormant'
      && forge.status !== 'hidden'
      && sourceNamedFlameId
  );

  if (!available || !sourceNamedFlameId) {
    return (
      <div className="page page--fire page--fire-interval">
        <PageHeader eyebrow="Capítulo do Fogo · Segunda missão" title="A Câmara do Instante ainda está fechada." description="Conclua primeiro O Nome da Chama. A segunda prática não é liberada apenas pela abertura da Forja." />
        <Card title="Dependência da jornada" eyebrow="Chama Nomeada necessária">
          <p>A missão anterior precisa criar seu primeiro componente antes que a linha temporal seja aberta.</p>
          <Button onClick={() => navigate('/mission/name-the-flame')}>Abrir O Nome da Chama</Button>
        </Card>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="page page--fire page--fire-interval">
        <PageHeader
          eyebrow="Capítulo do Fogo · Segunda missão"
          title="O Instante Antes do Gesto"
          description="Observe uma sequência fictícia, diferencie tipos de urgência e escolha uma saída segura — inclusive não agir agora."
        />
        <div className="fire-interval-intro-grid">
          <Card title={fireIntervalBiblicalUnit.title} eyebrow={fireIntervalBiblicalUnit.reference}>
            <blockquote>{fireIntervalBiblicalUnit.principle}</blockquote>
            <p>{fireIntervalBiblicalUnit.context}</p>
            <div className="provenance-inline"><BookOpenText size={17}/><span>A Bíblia inicia a prática. As relações simbólicas aparecem separadas e podem ser desativadas.</span></div>
          </Card>
          <Card title="Antes de começar" eyebrow="Exercício didático">
            <ul className="simple-list">
              <li>nenhuma situação pessoal será solicitada;</li>
              <li>os exemplos são fictícios e não avaliam autocontrole;</li>
              <li>urgência percebida não significa que o risco seja imaginário;</li>
              <li>em risco imediato, o fluxo de apoio substitui o simbolismo.</li>
            </ul>
            <div className="fire-interval-actions">
              <Button onClick={() => start(sourceNamedFlameId)}>Entrar na Câmara do Instante <ArrowRight size={18}/></Button>
              <Button variant="ghost" onClick={() => navigate('/safety?source=fire-interval')}><ShieldCheck size={18}/> Apoio direto</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (progress.status === 'completed') {
    const resolvedNodes = fireIntervalNodes
      .filter((node) => ['gevurah_interval_v1', 'gen_interval_v1', 'temperance_interval_v1', 'interval_ember_v1'].includes(node.id))
      .map((node) => resolveNode(node, enabledLayers));
    const selectedInterval = fireIntervalOptions.find((option) => option.id === progress.interval);
    const selectedExit = fireExitOptions.find((option) => option.id === progress.exit);

    return (
      <div className="page page--fire page--fire-interval">
        <PageHeader
          eyebrow="Componente criado"
          title="O intervalo foi registrado sem se tornar obrigação."
          description="A Brasa registra uma prática didática. Ela não comprova calma, segurança, domínio emocional ou melhora clínica."
        />
        <div className="fire-interval-result-grid">
          <Card className="interval-ember-card">
            <div className="interval-ember-visual" aria-hidden="true"><Clock3/><Flame/></div>
            <p className="eyebrow">Segundo componente do Fogo</p>
            <h2>Brasa do Intervalo</h2>
            <span className="item-status item-status--active">Criada</span>
          </Card>
          <Card title="Escolhas registradas" eyebrow="Somente categorias locais">
            <ul className="simple-list">
              <li><strong>Linha temporal:</strong> {progress.timelineSkipped ? 'Classificação recusada' : `${Object.keys(progress.timeline).length} frases classificadas`}</li>
              <li><strong>Urgência:</strong> {progress.urgencySkipped ? 'Classificação recusada' : `${Object.keys(progress.urgency).length} cenários classificados`}</li>
              <li><strong>Intervalo:</strong> {selectedInterval?.label}</li>
              <li><strong>Saída:</strong> {selectedExit?.label}</li>
            </ul>
          </Card>
        </div>
        <Card title="Cadeia opcional" eyebrow="Proveniência por camada">
          <div className="fire-interval-chain-grid">
            {resolvedNodes.map((node) => (
              <article key={node.id} className="fire-interval-chain-node">
                <span className={`provenance-badge provenance-badge--${node.provenance.class.toLowerCase()}`}>{node.provenance.class}</span>
                <h3>{node.name}</h3>
                <p>{node.description}</p>
                <small>{node.provenance.label}</small>
              </article>
            ))}
          </div>
        </Card>
        <Card title="Próximo passo" eyebrow="Sem integração automática">
          <p>A Brasa do Intervalo é o segundo componente do Fogo. Ela não conclui o capítulo e nenhuma saída selecionada se torna obrigação.</p>
          <div className="fire-interval-actions">
            <Button onClick={() => navigate('/temple/forge')}>Voltar à Forja</Button>
            <Button variant="ghost" onClick={() => navigate('/temple')}>Abrir o Átrio</Button>
          </div>
        </Card>
      </div>
    );
  }

  const completeReady = canCompleteFireInterval(progress, fireTimelineEntries.length, fireUrgencyEntries.length);

  return (
    <div className="page page--fire page--fire-interval">
      <PageHeader
        eyebrow="O Instante Antes do Gesto"
        title="Entre intensidade e gesto existe uma sequência que pode ser observada."
        description="As classificações são didáticas, reversíveis e permanecem somente neste dispositivo."
        action={<Button variant="ghost" onClick={() => navigate('/safety?source=fire-interval')}><AlertTriangle size={18}/> Apoio direto</Button>}
      />

      <Card title="1. Organizar uma linha temporal" eyebrow="Frases fictícias ou recusa">
        <p>Classifique cada exemplo como gatilho, sinal corporal, impulso ou gesto. O feedback não mede sua capacidade de pausa.</p>
        <div className="fire-interval-entry-list">
          {fireTimelineEntries.map((entry) => {
            const selected = progress.timeline[entry.id];
            return (
              <article key={entry.id} className="fire-interval-entry">
                <p>{entry.text}</p>
                <div className="fire-interval-classification-actions">
                  {(Object.keys(timelineLabels) as FireTimelinePhase[]).map((phase) => (
                    <button key={phase} type="button" aria-pressed={selected === phase} onClick={() => classifyTimeline(entry.id, phase)}>{timelineLabels[phase]}</button>
                  ))}
                </div>
                {selected && <p className="classification-feedback" data-match={selected === entry.suggestedPhase}>Sugestão editorial: {timelineLabels[entry.suggestedPhase]}. {entry.explanation}</p>}
              </article>
            );
          })}
        </div>
        <Button variant="ghost" onClick={skipTimeline}>Concluir sem classificar a linha temporal</Button>
        {progress.timelineSkipped && <p className="field-help"><CheckCircle2 size={16}/> Linha temporal recusada sem perda de progresso.</p>}
      </Card>

      <Card title="2. Diferenciar tipos de urgência" eyebrow="Contexto antes de velocidade">
        <p>Urgência real pode existir. O exercício apenas diferencia segurança imediata, prazo verificável, pressão percebida e falta de informação.</p>
        <div className="fire-interval-entry-list">
          {fireUrgencyEntries.map((entry) => {
            const selected = progress.urgency[entry.id];
            return (
              <article key={entry.id} className="fire-interval-entry">
                <p>{entry.text}</p>
                <div className="fire-interval-classification-actions fire-interval-classification-actions--urgency">
                  {(Object.keys(urgencyLabels) as FireUrgencyCategory[]).map((category) => (
                    <button key={category} type="button" aria-pressed={selected === category} onClick={() => classifyUrgency(entry.id, category)}>{urgencyLabels[category]}</button>
                  ))}
                </div>
                {selected && <p className="classification-feedback" data-match={selected === entry.suggestedCategory}>Sugestão editorial: {urgencyLabels[entry.suggestedCategory]}. {entry.explanation}</p>}
              </article>
            );
          })}
        </div>
        <Button variant="ghost" onClick={skipUrgency}>Concluir sem classificar urgências</Button>
        {progress.urgencySkipped && <p className="field-help"><CheckCircle2 size={16}/> Classificação de urgência recusada sem perda de progresso.</p>}
      </Card>

      <div className="fire-interval-form-grid">
        <Card title="3. Escolher um intervalo" eyebrow="Pausa ou nenhuma pausa">
          <div className="fire-interval-option-list">
            {fireIntervalOptions.map((option) => (
              <button key={option.id} type="button" aria-pressed={progress.interval === option.id} onClick={() => setInterval(option.id)}>
                <Pause size={17}/><span><strong>{option.label}</strong><small>{option.description}</small></span>
              </button>
            ))}
          </div>
        </Card>

        <Card title="4. Escolher uma saída segura" eyebrow="Sem executar ações pelo aplicativo">
          <div className="fire-interval-option-list">
            {fireExitOptions.map((option) => (
              <button key={option.id} type="button" aria-pressed={progress.exit === option.id} onClick={() => setExit(option.id)}>
                <LogOut size={17}/><span><strong>{option.label}</strong><small>{option.description}</small></span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Criar a Brasa do Intervalo" eyebrow="Sem obrigação de agir">
        <div className="safety-summary"><ShieldCheck/><p>Em risco imediato, sair com segurança e procurar ajuda direta tem prioridade. O Athanor não orienta confronto, contenção física ou permanência em perigo.</p></div>
        <div className="fire-interval-actions">
          <Button disabled={!completeReady} onClick={complete}>Criar Brasa do Intervalo <Flame size={18}/></Button>
          <Button variant="ghost" onClick={() => navigate('/temple/forge')}>Pausar e voltar à Forja</Button>
        </div>
      </Card>
    </div>
  );
}
