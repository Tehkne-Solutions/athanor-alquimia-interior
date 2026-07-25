import { useState } from 'react';
import { AlertTriangle, ArrowLeft, BookOpenText, Feather, HeartHandshake, Pause, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { waterLamentBiblicalUnit, waterLamentWarnings } from '../content/water';
import { createEmptyWaterLamentDraft, type WaterLamentCompletionOutcome, type WaterLamentField } from '../domain/waterLament';
import { useAthanorStore } from '../state/useAthanorStore';
import { useWaterLamentStore } from '../state/useWaterLamentStore';

const fields: { id: WaterLamentField; label: string; help: string; placeholder: string }[] = [
  {
    id: 'happened',
    label: 'O que aconteceu?',
    help: 'Registre apenas os fatos ou a parte da situação que deseja preservar.',
    placeholder: 'Opcional. Você pode escrever uma frase curta.'
  },
  {
    id: 'feeling',
    label: 'O que está sentindo?',
    help: 'Use suas próprias palavras. Não é necessário explicar a causa.',
    placeholder: 'Opcional. Também é válido não saber nomear.'
  },
  {
    id: 'desire',
    label: 'O que deseja ou gostaria que mudasse?',
    help: 'Um desejo não é uma previsão nem uma obrigação de agir agora.',
    placeholder: 'Opcional. Pode ser uma pergunta, necessidade ou esperança.'
  },
  {
    id: 'support',
    label: 'De que apoio precisa?',
    help: 'Pode ser escuta, tempo, informação, descanso ou apoio profissional.',
    placeholder: 'Opcional. Não inclua dados de contato de terceiros.'
  }
];

export function WaterLamentPage() {
  const navigate = useNavigate();
  const waterJourney = useAthanorStore((state) => state.waterJourney);
  const storedProgress = useWaterLamentStore((state) => state.progress);
  const storedJourneyStartedAt = useWaterLamentStore((state) => state.journeyStartedAt);
  const start = useWaterLamentStore((state) => state.start);
  const updateField = useWaterLamentStore((state) => state.updateField);
  const skip = useWaterLamentStore((state) => state.skip);
  const complete = useWaterLamentStore((state) => state.complete);
  const [acknowledged, setAcknowledged] = useState(false);

  const namingCompleted = Boolean(waterJourney?.namedDropCreated);
  const sessionMatches = Boolean(waterJourney && storedJourneyStartedAt === waterJourney.startedAt);
  const progress = sessionMatches ? storedProgress : undefined;
  const draft = progress?.draft ?? createEmptyWaterLamentDraft();

  const handleOutcome = (outcome: WaterLamentCompletionOutcome) => {
    if (outcome === 'safety') navigate('/safety?source=lament');
  };

  const ensureStarted = () => {
    if (waterJourney) start(waterJourney.startedAt);
  };

  const completeSilently = () => {
    ensureStarted();
    skip();
    handleOutcome(complete());
  };

  if (!namingCompleted) {
    return (
      <div className="page page--water page--lament">
        <PageHeader
          eyebrow="Capítulo da Água · Missão 2"
          title="A Voz do Lamento ainda não está disponível."
          description="Conclua primeiro O Nome das Águas. O Templo não exige escrita nem intensidade mínima para abrir esta etapa."
        />
        <Card title="Dependência da jornada" eyebrow="Gota Nomeada">
          <p>A segunda missão começa depois que o primeiro movimento foi reconhecido ou recusado conscientemente.</p>
          <Button onClick={() => navigate('/mission/name-the-waters')}><ArrowLeft size={18}/> Voltar à primeira missão</Button>
        </Card>
      </div>
    );
  }

  if (progress?.status === 'safety_interrupted') {
    return (
      <div className="page page--safety">
        <PageHeader
          eyebrow="Fluxo simbólico interrompido"
          title="Este registro precisa de apoio direto."
          description="Nenhum Fragmento foi criado e o texto foi removido do estado da missão. A verificação local é limitada e não substitui avaliação humana."
        />
        <Card title="Priorize sua segurança" eyebrow="Apoio humano">
          <div className="safety-action"><ShieldAlert/><p>Use a tela direta de apoio para encontrar próximos passos sem cartas, símbolos, recompensas ou interpretação.</p></div>
          <Button onClick={() => navigate('/safety?source=lament')}>Abrir apoio direto</Button>
        </Card>
      </div>
    );
  }

  if (progress?.status === 'completed') {
    return (
      <div className="page page--water page--lament">
        <PageHeader
          eyebrow="Missão concluída"
          title="O Fragmento do Lamento foi criado."
          description="O componente representa a conclusão de uma prática, não a intensidade ou o conteúdo do sofrimento registrado."
        />
        <div className="lament-result-grid">
          <Card className="lament-fragment-card">
            <div className="lament-fragment" aria-hidden="true"><Feather/></div>
            <p className="eyebrow">Componente da Água</p>
            <h2>Fragmento do Lamento</h2>
            <p>{progress.draft.skipped
              ? 'A missão foi concluída em silêncio. Nenhum texto foi necessário para preservar a escolha.'
              : 'O registro permaneceu local. Seu conteúdo não é exibido no componente, não altera recompensas e não será interpretado.'}</p>
          </Card>
          <Card title="Fundação do Cálice" eyebrow="Segunda etapa">
            <p>A Gota Nomeada e o Fragmento do Lamento agora fazem parte da futura receita do Cálice da Memória Serena.</p>
            <p className="field-help">Memória, confiança, ação de cuidado e revisão ainda serão necessários antes do crafting completo.</p>
            <Button onClick={() => navigate('/temple/psalms-chamber')}>Voltar à Câmara dos Salmos</Button>
          </Card>
        </div>
      </div>
    );
  }

  const beginWriting = () => {
    ensureStarted();
    setAcknowledged(true);
  };

  return (
    <div className="page page--water page--lament">
      <PageHeader
        eyebrow="Capítulo da Água · Missão 2"
        title="A Voz do Lamento"
        description="Organize uma experiência em quatro partes opcionais. Você pode escrever, concluir em silêncio, pausar ou procurar apoio direto."
      />

      <div className="lament-layout">
        <Card title={waterLamentBiblicalUnit.title} eyebrow={waterLamentBiblicalUnit.reference}>
          <blockquote>{waterLamentBiblicalUnit.principle}</blockquote>
          <p>{waterLamentBiblicalUnit.context}</p>
          <div className="provenance-inline"><BookOpenText size={17}/><span>Fonte bíblica, aplicação editorial e gameplay permanecem separados.</span></div>
        </Card>

        <Card title="Antes de continuar" eyebrow="Alerta de conteúdo" className="lament-warning-card">
          <div className="lament-warning-heading"><AlertTriangle aria-hidden="true"/><p>Esta etapa pode envolver perda, ausência, conflito, medo ou sofrimento.</p></div>
          <ul className="simple-list">
            {waterLamentWarnings.map((warning) => <li key={warning}>{warning}</li>)}
          </ul>
          <div className="button-row">
            <Button variant="danger" onClick={() => navigate('/safety?source=lament')}><HeartHandshake size={18}/> Preciso de apoio direto agora</Button>
            {!acknowledged && <Button onClick={beginWriting}>Compreendo e quero continuar</Button>}
          </div>
        </Card>

        {acknowledged && (
          <Card title="Registro opcional" eyebrow="Armazenamento local" className="lament-form-card">
            <div className="lament-fields">
              {fields.map((field) => (
                <label key={field.id} className="lament-field">
                  <span>{field.label}</span>
                  <small>{field.help}</small>
                  <textarea
                    value={draft[field.id]}
                    maxLength={1200}
                    rows={4}
                    placeholder={field.placeholder}
                    onChange={(event) => updateField(field.id, event.target.value)}
                  />
                  <small>{draft[field.id].length}/1200 caracteres</small>
                </label>
              ))}
            </div>

            <div className="lament-privacy-note">
              <ShieldAlert aria-hidden="true"/>
              <p>Uma verificação local limitada ocorre somente ao concluir. Ela não diagnostica. Se identificar uma frase crítica explícita, o texto é removido do estado da missão e o fluxo segue para apoio direto.</p>
            </div>

            <div className="water-mission-actions lament-actions">
              <Button variant="ghost" onClick={() => navigate('/temple/psalms-chamber')}><Pause size={18}/> Pausar e voltar</Button>
              <Button variant="secondary" onClick={completeSilently}>Concluir sem escrever</Button>
              <Button onClick={() => handleOutcome(complete())}>Criar Fragmento do Lamento</Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
