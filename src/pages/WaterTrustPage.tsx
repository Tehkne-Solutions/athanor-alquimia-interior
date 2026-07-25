import { ArrowLeft, BookOpenText, CheckCircle2, HeartHandshake, Layers3, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import {
  waterCareActions,
  waterSupportResources,
  waterTrustBiblicalUnit,
  waterTrustNodes,
  waterTrustStatementCategoryLabels,
  waterTrustStatements
} from '../content/waterTrust';
import {
  canCompleteWaterTrust,
  evaluateWaterTrust,
  waterTrustStatementCategories
} from '../domain/waterTrust';
import { useAthanorStore } from '../state/useAthanorStore';
import { useWaterMemoryStore } from '../state/useWaterMemoryStore';
import { useWaterTrustStore } from '../state/useWaterTrustStore';

const layerNodeIds = {
  kabbalah: ['chesed_support_v1', 'support_fountain_v1'],
  iching: ['kun_support_v1', 'sustaining_movement_v1'],
  tarot: ['star_trust_v1', 'hope_bearer_v1']
} as const;

export function WaterTrustPage() {
  const navigate = useNavigate();
  const waterJourney = useAthanorStore((state) => state.waterJourney);
  const enabledLayers = useAthanorStore((state) => state.preferences.enabledLayers);
  const memoryProgress = useWaterMemoryStore((state) => state.progress);
  const storedProgress = useWaterTrustStore((state) => state.progress);
  const start = useWaterTrustStore((state) => state.start);
  const classify = useWaterTrustStore((state) => state.classify);
  const toggleResource = useWaterTrustStore((state) => state.toggleResource);
  const selectCareAction = useWaterTrustStore((state) => state.selectCareAction);
  const skipClassification = useWaterTrustStore((state) => state.skipClassification);
  const complete = useWaterTrustStore((state) => state.complete);

  const memoryCompleted = Boolean(
    waterJourney
      && memoryProgress?.journeyStartedAt === waterJourney.startedAt
      && memoryProgress.status === 'completed'
  );
  const progress = waterJourney && storedProgress?.journeyStartedAt === waterJourney.startedAt
    ? storedProgress
    : undefined;

  if (!memoryCompleted) {
    return (
      <div className="page page--water page--trust">
        <PageHeader
          eyebrow="Capítulo da Água · Missão 4"
          title="O Espaço da Confiança ainda não está disponível."
          description="Conclua primeiro O Espelho das Memórias. Apoio possível não será apresentado como garantia ou previsão."
        />
        <Card title="Dependência da jornada" eyebrow="Espelho das Águas">
          <p>O Espelho das Águas ainda é necessário.</p>
          <Button onClick={() => navigate('/temple/psalms-chamber')}><ArrowLeft size={18}/> Voltar à Câmara</Button>
        </Card>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="page page--water page--trust">
        <PageHeader
          eyebrow="Capítulo da Água · Missão 4"
          title="O Espaço da Confiança"
          description="Diferencie apoio possível, garantia e previsão; depois mapeie somente os recursos que realmente estiverem disponíveis."
        />
        <div className="trust-intro-grid">
          <Card title={waterTrustBiblicalUnit.title} eyebrow={waterTrustBiblicalUnit.reference}>
            <blockquote>{waterTrustBiblicalUnit.principle}</blockquote>
            <p>{waterTrustBiblicalUnit.context}</p>
            <div className="provenance-inline"><BookOpenText size={17}/><span>A fonte bíblica inicia a missão. Nenhuma passagem é usada para prometer proteção ou resultado.</span></div>
          </Card>
          <Card title="Pontes Disponíveis" eyebrow="Recursos sem promessa">
            <p>O exercício usa frases fictícias. O mapa de recursos é opcional e pode permanecer vazio quando nenhum apoio estiver disponível agora.</p>
            <Button onClick={() => waterJourney && start(waterJourney.startedAt)}>Iniciar O Espaço da Confiança</Button>
          </Card>
        </div>
      </div>
    );
  }

  if (progress.status === 'completed') {
    const evaluation = evaluateWaterTrust(progress, waterTrustStatements);
    const resolvedNodes = [
      enabledLayers.includes('kabbalah') ? layerNodeIds.kabbalah[0] : layerNodeIds.kabbalah[1],
      enabledLayers.includes('iching') ? layerNodeIds.iching[0] : layerNodeIds.iching[1],
      enabledLayers.includes('tarot') ? layerNodeIds.tarot[0] : layerNodeIds.tarot[1],
      'trust_bridge_v1'
    ].map((id) => waterTrustNodes.find((node) => node.id === id)).filter(Boolean);
    const selectedResourceLabels = progress.selectedResources
      .map((id) => waterSupportResources.find((resource) => resource.id === id)?.label)
      .filter((label): label is string => Boolean(label));
    const selectedAction = waterCareActions.find((action) => action.id === progress.careAction);
    const resourceSummary = selectedResourceLabels.length === 1
      ? '1 recurso marcado como disponível agora.'
      : `${selectedResourceLabels.length} recursos marcados como disponíveis agora.`;

    return (
      <div className="page page--water page--trust">
        <PageHeader
          eyebrow="Missão concluída"
          title="A Ponte da Confiança foi criada."
          description="O componente registra uma prática de mapear apoio possível. Ele não garante proteção, aceitação, melhora ou resultado favorável."
        />

        <div className="trust-result-grid">
          <Card className="trust-bridge-card">
            <div className="trust-bridge" aria-hidden="true"><HeartHandshake/></div>
            <p className="eyebrow">Componente da Água</p>
            <h2>Ponte da Confiança</h2>
            <p>{selectedResourceLabels.length > 0
              ? resourceSummary
              : 'Nenhum recurso foi marcado. A ausência de apoio disponível não reduz recompensa ou progresso.'}</p>
            <p className="field-help">A Ponte representa a conclusão da prática, não a existência objetiva de segurança.</p>
          </Card>

          <Card title="Recursos e ação" eyebrow="Escolhas opcionais">
            {selectedResourceLabels.length > 0 ? (
              <ul className="simple-list">{selectedResourceLabels.map((label) => <li key={label}>{label}</li>)}</ul>
            ) : (
              <p>Nenhum recurso selecionado.</p>
            )}
            <p><strong>Ação de cuidado:</strong> {selectedAction?.label ?? 'Nenhuma ação selecionada'}</p>
            {selectedAction && <small>{selectedAction.description}</small>}
          </Card>
        </div>

        <Card title="Revisão didática" eyebrow="Sem pontuação moral">
          {progress.skippedClassification ? (
            <p>A classificação foi recusada. Nenhum resultado foi comparado.</p>
          ) : evaluation.differences.length === 0 ? (
            <div className="review-status review-status--complete"><CheckCircle2/><p>As distinções coincidiram com a proposta editorial desta atividade.</p></div>
          ) : (
            <div className="trust-differences">
              {evaluation.differences.map((difference) => {
                const statement = waterTrustStatements.find((candidate) => candidate.id === difference.statementId);
                return (
                  <div key={difference.statementId} className="trust-difference">
                    <strong>{statement?.text}</strong>
                    <span>Escolha: {waterTrustStatementCategoryLabels[difference.selected]}</span>
                    <span>Proposta editorial: {waterTrustStatementCategoryLabels[difference.suggested]}</span>
                    <small>{statement?.explanation}</small>
                  </div>
                );
              })}
            </div>
          )}
          <p className="field-help">Coincidências e diferenças não alteram o componente, o acesso ou a recompensa.</p>
        </Card>

        <Card title="Cadeia com proveniência" eyebrow="Camadas opcionais">
          <div className="trust-chain" aria-label="Cadeia simbólica da Ponte da Confiança">
            {resolvedNodes.map((node) => node && (
              <article key={node.id} className="trust-chain-node">
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

        <Card title="Fundação do Cálice" eyebrow="Quarta etapa">
          <p>Gota Nomeada, Fragmento do Lamento, Espelho das Águas e Ponte da Confiança estão disponíveis. A próxima fase reunirá ação de cuidado, revisão e crafting do Cálice da Memória Serena.</p>
          <Button onClick={() => navigate('/temple/psalms-chamber')}>Voltar à Câmara dos Salmos</Button>
        </Card>
      </div>
    );
  }

  const canComplete = canCompleteWaterTrust(progress, waterTrustStatements);
  const completeWithoutClassifying = () => {
    skipClassification();
    complete();
  };

  return (
    <div className="page page--water page--trust">
      <PageHeader
        eyebrow="Capítulo da Água · Missão 4"
        title="Pontes Disponíveis"
        description="Apoio é um recurso possível. Garantia promete um resultado. Previsão afirma algo que ainda não ocorreu."
      />

      <div className="trust-category-legend" aria-label="Categorias da atividade">
        {waterTrustStatementCategories.map((category) => (
          <span key={category}>{waterTrustStatementCategoryLabels[category]}</span>
        ))}
      </div>

      <div className="trust-statement-list">
        {waterTrustStatements.map((statement, index) => (
          <Card key={statement.id} title={`Ponte ${index + 1}`} eyebrow="Frase fictícia" className="trust-statement-card">
            <p className="trust-statement-text">{statement.text}</p>
            <div className="trust-category-buttons" role="group" aria-label={`Classificar: ${statement.text}`}>
              {waterTrustStatementCategories.map((category) => {
                const selected = progress.classifications[statement.id] === category;
                return (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={selected}
                    className={selected ? 'trust-category-button trust-category-button--selected' : 'trust-category-button'}
                    onClick={() => classify(statement.id, category)}
                  >
                    {waterTrustStatementCategoryLabels[category]}
                  </button>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      <Card title="Mapa de recursos" eyebrow="Seleção opcional">
        <p>Marque somente o que realmente parece disponível. Não selecionar nada é uma resposta válida.</p>
        <div className="trust-resource-grid">
          {waterSupportResources.map((resource) => {
            const selected = progress.selectedResources.includes(resource.id);
            return (
              <button
                key={resource.id}
                type="button"
                aria-pressed={selected}
                className={selected ? 'trust-resource trust-resource--selected' : 'trust-resource'}
                onClick={() => toggleResource(resource.id)}
              >
                <strong>{resource.label}</strong>
                <span>{resource.description}</span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card title="Ação de cuidado" eyebrow="Compromisso opcional">
        <p>Escolha uma ação pequena ou conclua sem assumir compromisso externo.</p>
        <div className="trust-action-grid" role="group" aria-label="Ações de cuidado disponíveis">
          {waterCareActions.map((action) => {
            const selected = progress.careAction === action.id;
            return (
              <button
                key={action.id}
                type="button"
                aria-pressed={selected}
                className={selected ? 'trust-action trust-action--selected' : 'trust-action'}
                onClick={() => selectCareAction(action.id)}
              >
                <strong>{action.label}</strong>
                <span>{action.description}</span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card title="Privacidade e limites" eyebrow="Sem promessa de resultado">
        <div className="safety-summary"><ShieldCheck/><p>O Athanor não confirma segurança, proteção divina específica, reação de terceiros ou desfecho futuro. Recursos e ações permanecem opcionais.</p></div>
        <div className="water-mission-actions">
          <Button variant="ghost" onClick={() => navigate('/temple/psalms-chamber')}>Pausar e voltar</Button>
          <Button variant="secondary" onClick={completeWithoutClassifying}>Concluir sem classificar</Button>
          <Button disabled={!canComplete} onClick={complete}>Criar Ponte da Confiança</Button>
        </div>
      </Card>
    </div>
  );
}
