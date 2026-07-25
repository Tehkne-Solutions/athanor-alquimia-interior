import { ArrowLeft, BookOpenText, CheckCircle2, Eye, Layers3, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import {
  waterMemoryBiblicalUnit,
  waterMemoryCategoryLabels,
  waterMemoryEntries,
  waterMemoryNodes,
  waterPresenceAnchors
} from '../content/water';
import {
  canCompleteWaterMemory,
  evaluateWaterMemory,
  waterMemoryCategories
} from '../domain/waterMemory';
import { useAthanorStore } from '../state/useAthanorStore';
import { useWaterLamentStore } from '../state/useWaterLamentStore';
import { useWaterMemoryStore } from '../state/useWaterMemoryStore';

const layerNodeIds = {
  kabbalah: ['yesod_memory_v1', 'memory_chamber_v1'],
  sefer: ['mem_water_v1', 'depth_symbol_v1'],
  iching: ['kan_water_v1', 'crossing_movement_v1'],
  tarot: ['high_priestess_memory_v1', 'silence_keeper_v1']
} as const;

export function WaterMemoryPage() {
  const navigate = useNavigate();
  const waterJourney = useAthanorStore((state) => state.waterJourney);
  const enabledLayers = useAthanorStore((state) => state.preferences.enabledLayers);
  const lamentProgress = useWaterLamentStore((state) => state.progress);
  const lamentJourneyStartedAt = useWaterLamentStore((state) => state.journeyStartedAt);
  const storedProgress = useWaterMemoryStore((state) => state.progress);
  const start = useWaterMemoryStore((state) => state.start);
  const classify = useWaterMemoryStore((state) => state.classify);
  const togglePresenceAnchor = useWaterMemoryStore((state) => state.togglePresenceAnchor);
  const skip = useWaterMemoryStore((state) => state.skip);
  const complete = useWaterMemoryStore((state) => state.complete);

  const namingCompleted = Boolean(waterJourney?.namedDropCreated);
  const lamentCompleted = Boolean(
    waterJourney
      && lamentJourneyStartedAt === waterJourney.startedAt
      && lamentProgress?.status === 'completed'
  );
  const progress = waterJourney && storedProgress?.journeyStartedAt === waterJourney.startedAt
    ? storedProgress
    : undefined;

  if (!namingCompleted || !lamentCompleted) {
    return (
      <div className="page page--water page--memory">
        <PageHeader
          eyebrow="Capítulo da Água · Missão 3"
          title="O Espelho das Memórias ainda não está disponível."
          description="Conclua primeiro O Nome das Águas e A Voz do Lamento. Nenhum texto pessoal será solicitado nesta etapa."
        />
        <Card title="Dependências da jornada" eyebrow="Gota e Fragmento">
          <ul className="simple-list">
            <li>{namingCompleted ? 'Gota Nomeada disponível.' : 'Gota Nomeada ainda necessária.'}</li>
            <li>{lamentCompleted ? 'Fragmento do Lamento disponível.' : 'Fragmento do Lamento ainda necessário.'}</li>
          </ul>
          <Button onClick={() => navigate('/temple/psalms-chamber')}><ArrowLeft size={18}/> Voltar à Câmara</Button>
        </Card>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="page page--water page--memory">
        <PageHeader
          eyebrow="Capítulo da Água · Missão 3"
          title="O Espelho das Memórias"
          description="Diferencie memória, sensação atual, previsão, necessidade e ação usando frases fictícias."
        />
        <div className="memory-intro-grid">
          <Card title={waterMemoryBiblicalUnit.title} eyebrow={waterMemoryBiblicalUnit.reference}>
            <blockquote>{waterMemoryBiblicalUnit.principle}</blockquote>
            <p>{waterMemoryBiblicalUnit.context}</p>
            <div className="provenance-inline"><BookOpenText size={17}/><span>A fonte bíblica inicia a missão; as correspondências posteriores permanecem identificadas.</span></div>
          </Card>
          <Card title="Começar a prática" eyebrow="Sem autobiografia obrigatória">
            <p>O exercício usa somente frases preparadas pelo Athanor. Não verifica a verdade de lembranças, não interpreta sua origem e não produz diagnóstico.</p>
            <Button onClick={() => waterJourney && start(waterJourney.startedAt)}>Iniciar Reflexo e Presença</Button>
          </Card>
        </div>
      </div>
    );
  }

  if (progress.status === 'completed') {
    const evaluation = evaluateWaterMemory(progress, waterMemoryEntries);
    const resolvedNodes = [
      enabledLayers.includes('kabbalah') ? layerNodeIds.kabbalah[0] : layerNodeIds.kabbalah[1],
      enabledLayers.includes('sefer') ? layerNodeIds.sefer[0] : layerNodeIds.sefer[1],
      enabledLayers.includes('iching') ? layerNodeIds.iching[0] : layerNodeIds.iching[1],
      enabledLayers.includes('tarot') ? layerNodeIds.tarot[0] : layerNodeIds.tarot[1],
      'water_mirror_v1'
    ].map((id) => waterMemoryNodes.find((node) => node.id === id)).filter(Boolean);

    return (
      <div className="page page--water page--memory">
        <PageHeader
          eyebrow="Missão concluída"
          title="O Espelho das Águas foi criado."
          description="O componente registra uma prática de distinção. Ele não confirma memórias, não prevê acontecimentos e não mede saúde emocional."
        />

        <div className="memory-result-grid">
          <Card className="water-mirror-card">
            <div className="water-mirror" aria-hidden="true"><Eye/></div>
            <p className="eyebrow">Componente da Água</p>
            <h2>Espelho das Águas</h2>
            <p>{progress.skipped
              ? 'A missão foi concluída sem classificações. A recusa permaneceu uma escolha válida.'
              : `${evaluation.classified} frases foram classificadas. ${evaluation.aligned} coincidiram com a proposta editorial.`}</p>
            <p className="field-help">A quantidade de coincidências não altera recompensa, status ou acesso ao próximo conteúdo.</p>
          </Card>

          <Card title="Revisão didática" eyebrow="Sem pontuação moral">
            {progress.skipped ? (
              <p>Nenhum resultado foi comparado.</p>
            ) : evaluation.differences.length === 0 ? (
              <div className="review-status review-status--complete"><CheckCircle2/><p>Todas as distinções coincidiram com a proposta editorial desta atividade.</p></div>
            ) : (
              <div className="memory-differences">
                {evaluation.differences.map((difference) => {
                  const entry = waterMemoryEntries.find((candidate) => candidate.id === difference.entryId);
                  return (
                    <div key={difference.entryId} className="memory-difference">
                      <strong>{entry?.text}</strong>
                      <span>Escolha: {waterMemoryCategoryLabels[difference.selected]}</span>
                      <span>Proposta editorial: {waterMemoryCategoryLabels[difference.suggested]}</span>
                      <small>{entry?.explanation}</small>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        <Card title="Cadeia com proveniência" eyebrow="Camadas opcionais">
          <div className="memory-chain" aria-label="Cadeia simbólica do Espelho das Águas">
            {resolvedNodes.map((node) => node && (
              <article key={node.id} className="memory-chain-node">
                <Layers3 aria-hidden="true"/>
                <div>
                  <span className={`provenance-badge provenance-badge--${node.provenance.class.toLowerCase()}`}>{node.provenance.class}</span>
                  <h3>{node.name}</h3>
                  <p>{node.description}</p>
                  <small>{node.provenance.explanation}</small>
                </div>
              </article>
            ))}
          </div>
        </Card>

        <Card title="Fundação do Cálice" eyebrow="Terceira etapa">
          <p>A Gota Nomeada, o Fragmento do Lamento e o Espelho das Águas estão disponíveis. Confiança, ação de cuidado e revisão ainda serão necessárias antes do Cálice da Memória Serena.</p>
          <Button onClick={() => navigate('/temple/psalms-chamber')}>Voltar à Câmara dos Salmos</Button>
        </Card>
      </div>
    );
  }

  const canComplete = canCompleteWaterMemory(progress, waterMemoryEntries);
  const completeWithoutClassifying = () => {
    skip();
    complete();
  };

  return (
    <div className="page page--water page--memory">
      <PageHeader
        eyebrow="Capítulo da Água · Missão 3"
        title="Reflexo e Presença"
        description="Classifique frases fictícias. Uma memória não é automaticamente uma sensação atual, uma previsão, uma necessidade ou uma ação."
      />

      <div className="memory-category-legend" aria-label="Categorias da atividade">
        {waterMemoryCategories.map((category) => (
          <span key={category}>{waterMemoryCategoryLabels[category]}</span>
        ))}
      </div>

      <div className="memory-entry-list">
        {waterMemoryEntries.map((entry, index) => (
          <Card key={entry.id} title={`Reflexo ${index + 1}`} eyebrow="Frase fictícia" className="memory-entry-card">
            <p className="memory-entry-text">{entry.text}</p>
            <div className="memory-category-buttons" role="group" aria-label={`Classificar: ${entry.text}`}>
              {waterMemoryCategories.map((category) => {
                const selected = progress.classifications[entry.id] === category;
                return (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={selected}
                    className={selected ? 'memory-category-button memory-category-button--selected' : 'memory-category-button'}
                    onClick={() => classify(entry.id, category)}
                  >
                    {waterMemoryCategoryLabels[category]}
                  </button>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      <Card title="Retorno ao ambiente atual" eyebrow="Prática opcional">
        <p>Marque somente os tipos de observação realizados. O Athanor não armazena a cor, o som, a textura ou o objeto percebido.</p>
        <div className="presence-anchor-grid">
          {waterPresenceAnchors.map((anchor) => {
            const selected = progress.presenceAnchors.includes(anchor.id);
            return (
              <button
                key={anchor.id}
                type="button"
                aria-pressed={selected}
                className={selected ? 'presence-anchor presence-anchor--selected' : 'presence-anchor'}
                onClick={() => togglePresenceAnchor(anchor.id)}
              >
                <strong>{anchor.label}</strong>
                <span>{anchor.description}</span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card title="Privacidade e limites" eyebrow="Componente de gameplay">
        <div className="safety-summary"><ShieldCheck/><p>Nenhuma memória pessoal é solicitada ou validada. O resultado não mede saúde, atenção, inteligência ou espiritualidade.</p></div>
        <div className="water-mission-actions">
          <Button variant="ghost" onClick={() => navigate('/temple/psalms-chamber')}>Pausar e voltar</Button>
          <Button variant="secondary" onClick={completeWithoutClassifying}>Concluir sem classificar</Button>
          <Button disabled={!canComplete} onClick={complete}>Criar Espelho das Águas</Button>
        </div>
      </Card>
    </div>
  );
}
