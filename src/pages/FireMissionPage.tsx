import { AlertTriangle, ArrowRight, BookOpenText, CheckCircle2, Flame, Pause, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { fireFoundationBiblicalUnit, fireFoundationNodes } from '../content/fireFoundation';
import {
  fireActionOptions,
  fireClassificationEntries,
  fireEmotionOptions,
  fireMissionNodes,
  fireNeedOptions,
  firePauseOptions
} from '../content/fireMission';
import { canCompleteFireMission, type FireClassificationCategory } from '../domain/fire';
import type { SymbolicNode } from '../domain/types';
import { useAthanorStore } from '../state/useAthanorStore';
import { useFireMissionStore } from '../state/useFireMissionStore';
import { useWaterChapterStore } from '../state/useWaterChapterStore';

const categoryLabels: Record<FireClassificationCategory, string> = {
  emotion: 'Emoção',
  impulse: 'Impulso',
  need: 'Necessidade',
  action: 'Ação'
};

const allFireNodes = [...fireFoundationNodes, ...fireMissionNodes];
const chainNodeIds = [
  'gevurah_limit_v1',
  'shin_fire_v1',
  'gen_stillness_v1',
  'zhen_movement_v1',
  'strength_archetype_v1',
  'named_flame_v1'
];

function resolveNode(node: SymbolicNode, enabledLayers: string[]): SymbolicNode {
  if (!node.layer || enabledLayers.includes(node.layer)) return node;
  return allFireNodes.find((candidate) => candidate.id === node.fallbackNodeId) ?? node;
}

export function FireMissionPage() {
  const navigate = useNavigate();
  const forge = useAthanorStore((state) => state.temple?.rooms.find((room) => room.roomId === 'forge'));
  const enabledLayers = useAthanorStore((state) => state.preferences.enabledLayers);
  const waterChapter = useWaterChapterStore((state) => state.progress);
  const storedProgress = useFireMissionStore((state) => state.progress);
  const start = useFireMissionStore((state) => state.start);
  const toggleEmotion = useFireMissionStore((state) => state.toggleEmotion);
  const setIntensity = useFireMissionStore((state) => state.setIntensity);
  const skipCheckIn = useFireMissionStore((state) => state.skipCheckIn);
  const classify = useFireMissionStore((state) => state.classify);
  const skipClassification = useFireMissionStore((state) => state.skipClassification);
  const setPause = useFireMissionStore((state) => state.setPause);
  const setNeed = useFireMissionStore((state) => state.setNeed);
  const setAction = useFireMissionStore((state) => state.setAction);
  const complete = useFireMissionStore((state) => state.complete);

  const available = Boolean(
    forge
      && forge.status !== 'dormant'
      && forge.status !== 'hidden'
      && waterChapter?.status === 'completed'
  );
  const sourceWaterCycleId = waterChapter?.cycleId ?? waterChapter?.completedAt;
  const progress = sourceWaterCycleId && storedProgress?.sourceWaterCycleId === sourceWaterCycleId
    ? storedProgress
    : undefined;

  if (!available || !sourceWaterCycleId) {
    return (
      <div className="page page--fire">
        <PageHeader eyebrow="Capítulo do Fogo" title="A Chama ainda não pode ser nomeada." description="Conclua primeiro o ciclo da Água e abra a Forja pelo Templo." />
        <Card title="Caminho ainda fechado" eyebrow="Dependência da jornada">
          <Button onClick={() => navigate('/temple/forge')}>Voltar à Forja</Button>
        </Card>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="page page--fire page--fire-mission">
        <PageHeader
          eyebrow="Capítulo do Fogo · Primeira missão"
          title="O Nome da Chama"
          description="Reconheça intensidade, diferencie impulso de ação e escolha um passo proporcional — inclusive não responder agora."
        />
        <div className="fire-mission-intro-grid">
          <Card title={fireFoundationBiblicalUnit.title} eyebrow={fireFoundationBiblicalUnit.reference}>
            <blockquote>{fireFoundationBiblicalUnit.principle}</blockquote>
            <p>{fireFoundationBiblicalUnit.context}</p>
            <div className="provenance-inline"><BookOpenText size={17}/><span>A fonte bíblica inicia a missão. As demais relações aparecem como camadas separadas.</span></div>
          </Card>
          <Card title="Antes de começar" eyebrow="Autonomia e segurança">
            <ul className="simple-list">
              <li>nenhuma emoção recebe valor moral;</li>
              <li>a intensidade de 1 a 5 é opcional e não clínica;</li>
              <li>o exercício pode ser recusado;</li>
              <li>nenhuma opção autoriza ameaça, violência ou retaliação.</li>
            </ul>
            <div className="fire-mission-actions">
              <Button onClick={() => start(sourceWaterCycleId)}>Iniciar a missão <ArrowRight size={18}/></Button>
              <Button variant="ghost" onClick={() => navigate('/safety?source=fire')}><ShieldCheck size={18}/> Preciso de apoio direto</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (progress.status === 'completed') {
    const resolvedNodes = chainNodeIds
      .map((id) => allFireNodes.find((node) => node.id === id))
      .filter((node): node is SymbolicNode => Boolean(node))
      .map((node) => resolveNode(node, enabledLayers));
    const selectedAction = fireActionOptions.find((option) => option.id === progress.action);
    const selectedNeed = fireNeedOptions.find((option) => option.id === progress.need);

    return (
      <div className="page page--fire page--fire-mission">
        <PageHeader
          eyebrow="Componente criado"
          title="A Chama foi nomeada sem se tornar uma ordem."
          description="O componente registra reconhecimento, pausa, necessidade e ação escolhida. Ele não mede autocontrole nem garante resultado."
        />
        <div className="fire-result-grid">
          <Card className="named-flame-card">
            <div className="named-flame-visual" aria-hidden="true"><Flame/></div>
            <p className="eyebrow">Componente do Fogo</p>
            <h2>Chama Nomeada</h2>
            <span className="item-status item-status--active">Criada</span>
          </Card>
          <Card title="Fórmula registrada" eyebrow="Somente categorias locais">
            <ul className="simple-list">
              <li><strong>Movimentos selecionados:</strong> {progress.checkInSkipped ? 'Check-in recusado' : progress.emotions.length}</li>
              <li><strong>Intensidade:</strong> {progress.intensity ?? 'Não informada'}</li>
              <li><strong>Necessidade:</strong> {selectedNeed?.label}</li>
              <li><strong>Ação:</strong> {selectedAction?.label}</li>
            </ul>
          </Card>
        </div>
        <Card title="Cadeia opcional" eyebrow="Proveniência por camada">
          <div className="fire-chain-grid">
            {resolvedNodes.map((node) => (
              <article key={node.id} className="fire-chain-node">
                <span className={`provenance-badge provenance-badge--${node.provenance.class.toLowerCase()}`}>{node.provenance.class}</span>
                <h3>{node.name}</h3>
                <p>{node.description}</p>
                <small>{node.provenance.label}</small>
              </article>
            ))}
          </div>
        </Card>
        <Card title="Próximo passo" eyebrow="Sem integração automática">
          <p>A Chama Nomeada é o primeiro componente do Fogo. Ela não conclui o capítulo e não transforma a ação selecionada em obrigação.</p>
          <div className="fire-mission-actions">
            <Button onClick={() => navigate('/temple/forge')}>Voltar à Forja</Button>
            <Button variant="ghost" onClick={() => navigate('/temple')}>Abrir o Átrio</Button>
          </div>
        </Card>
      </div>
    );
  }

  const completeReady = canCompleteFireMission(progress, fireClassificationEntries.length);

  return (
    <div className="page page--fire page--fire-mission">
      <PageHeader
        eyebrow="O Nome da Chama"
        title="Intensidade pode ser reconhecida antes de virar gesto."
        description="Todas as escolhas são reversíveis e permanecem somente neste dispositivo."
        action={<Button variant="ghost" onClick={() => navigate('/safety?source=fire')}><AlertTriangle size={18}/> Apoio direto</Button>}
      />

      <Card title="1. Nomear movimentos percebidos" eyebrow="Seleção múltipla ou recusa">
        <div className="fire-choice-grid">
          {fireEmotionOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className="fire-choice"
              aria-pressed={progress.emotions.includes(option.id)}
              onClick={() => toggleEmotion(option.id)}
            >
              <Flame size={18}/><span>{option.label}</span>
            </button>
          ))}
        </div>
        <div className="fire-inline-controls">
          <span>Intensidade opcional:</span>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              className="intensity-button"
              aria-pressed={progress.intensity === value}
              onClick={() => setIntensity(value as 1 | 2 | 3 | 4 | 5)}
            >{value}</button>
          ))}
          <Button variant="ghost" onClick={skipCheckIn}>Prefiro não registrar</Button>
        </div>
        {progress.checkInSkipped && <p className="field-help"><CheckCircle2 size={16}/> Check-in recusado. A missão continua sem perda de progresso.</p>}
      </Card>

      <Card title="2. Diferenciar antes de agir" eyebrow="Frases fictícias">
        <p>Classifique emoção, impulso, necessidade e ação. As sugestões servem apenas como feedback didático.</p>
        <div className="fire-classification-list">
          {fireClassificationEntries.map((entry) => {
            const selected = progress.classifications[entry.id];
            return (
              <article key={entry.id} className="fire-classification-entry">
                <p>{entry.text}</p>
                <div className="classification-actions">
                  {(Object.keys(categoryLabels) as FireClassificationCategory[]).map((category) => (
                    <button
                      key={category}
                      type="button"
                      aria-pressed={selected === category}
                      onClick={() => classify(entry.id, category)}
                    >{categoryLabels[category]}</button>
                  ))}
                </div>
                {selected && (
                  <p className="classification-feedback" data-match={selected === entry.suggestedCategory}>
                    Sugestão editorial: {categoryLabels[entry.suggestedCategory]}. {entry.explanation}
                  </p>
                )}
              </article>
            );
          })}
        </div>
        <Button variant="ghost" onClick={skipClassification}>Concluir sem classificar</Button>
        {progress.classificationSkipped && <p className="field-help"><CheckCircle2 size={16}/> Classificação recusada. Nenhuma pontuação foi perdida.</p>}
      </Card>

      <div className="fire-form-grid">
        <Card title="3. Criar intervalo" eyebrow="Pausa opcional">
          <div className="fire-option-list">
            {firePauseOptions.map((option) => (
              <button key={option.id} type="button" aria-pressed={progress.pause === option.id} onClick={() => setPause(option.id)}>
                <Pause size={17}/><span>{option.label}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card title="4. Reconhecer uma necessidade" eyebrow="Sem diagnóstico">
          <div className="fire-option-list">
            {fireNeedOptions.map((option) => (
              <button key={option.id} type="button" aria-pressed={progress.need === option.id} onClick={() => setNeed(option.id)}>
                <strong>{option.label}</strong><span>{option.description}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <Card title="5. Escolher uma ação proporcional" eyebrow="Somente opções seguras e reversíveis">
        <div className="fire-action-grid">
          {fireActionOptions.map((option) => (
            <button key={option.id} type="button" aria-pressed={progress.action === option.id} onClick={() => setAction(option.id)}>
              <strong>{option.label}</strong><span>{option.description}</span>
            </button>
          ))}
        </div>
      </Card>

      <Card title="Criar a Chama Nomeada" eyebrow="Sem obrigação de agir">
        <div className="safety-summary"><ShieldCheck/><p>A missão não disponibiliza confronto, ameaça, retaliação ou controle de terceiros. Em risco imediato, use o fluxo direto de apoio.</p></div>
        <div className="fire-mission-actions">
          <Button disabled={!completeReady} onClick={complete}>Criar Chama Nomeada <Flame size={18}/></Button>
          <Button variant="ghost" onClick={() => navigate('/temple/forge')}>Pausar e voltar à Forja</Button>
        </div>
        {!completeReady && <p className="field-help">Conclua ou recuse as duas primeiras etapas e escolha pausa, necessidade e ação.</p>}
      </Card>
    </div>
  );
}
