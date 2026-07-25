import { ArrowLeft, CheckCircle2, Droplet, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { waterEmotions, waterNeeds } from '../content/water';
import { canCompleteWaterNaming } from '../domain/water';
import { useAthanorStore } from '../state/useAthanorStore';

export function WaterMissionPage() {
  const navigate = useNavigate();
  const waterJourney = useAthanorStore((state) => state.waterJourney);
  const startWaterJourney = useAthanorStore((state) => state.startWaterJourney);
  const toggleWaterEmotion = useAthanorStore((state) => state.toggleWaterEmotion);
  const setWaterIntensity = useAthanorStore((state) => state.setWaterIntensity);
  const setWaterNeed = useAthanorStore((state) => state.setWaterNeed);
  const skipWaterCheckIn = useAthanorStore((state) => state.skipWaterCheckIn);
  const completeWaterNaming = useAthanorStore((state) => state.completeWaterNaming);

  if (!waterJourney) {
    return (
      <div className="page page--water">
        <PageHeader
          eyebrow="O Nome das Águas"
          title="A missão ainda não foi iniciada."
          description="Entre primeiro na Câmara dos Salmos para confirmar que a jornada anterior foi integrada."
        />
        <Card title="Começar a missão" eyebrow="Check-in opcional">
          <p>Nenhum dado é obrigatório. O estado será guardado somente no dispositivo.</p>
          <div className="button-row">
            <Button variant="ghost" onClick={() => navigate('/temple/psalms-chamber')}><ArrowLeft size={18}/> Voltar à Câmara</Button>
            <Button onClick={startWaterJourney}>Iniciar missão</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (waterJourney.status === 'named') {
    return (
      <div className="page page--water">
        <PageHeader
          eyebrow="Missão concluída"
          title="A Gota Nomeada foi criada."
          description="O componente registra uma prática de reconhecimento. Ele não representa uma avaliação emocional nem possui efeito fora do gameplay."
        />
        <div className="water-result-grid">
          <Card className="named-drop-card">
            <div className="named-drop" aria-hidden="true"><Droplet/></div>
            <p className="eyebrow">Componente da Água</p>
            <h2>Gota Nomeada</h2>
            <p>{waterJourney.checkIn.skipped
              ? 'Você concluiu a missão sem registrar o check-in. A recusa foi preservada como escolha válida.'
              : `${waterJourney.checkIn.emotions.length} movimento(s) foram reconhecidos sem receber pontuação moral.`}</p>
          </Card>
          <Card title="O que acontece agora" eyebrow="Fundação do Cálice">
            <div className="review-status review-status--complete"><CheckCircle2/><p>A Câmara mantém o componente disponível. A receita completa do Cálice será aberta em uma fase posterior, depois de lamento, memória e confiança.</p></div>
            <Button onClick={() => navigate('/temple/psalms-chamber')}>Voltar à Câmara dos Salmos</Button>
          </Card>
        </div>
      </div>
    );
  }

  const { checkIn } = waterJourney;
  const canComplete = canCompleteWaterNaming(checkIn);

  return (
    <div className="page page--water">
      <PageHeader
        eyebrow="Capítulo da Água · Missão 1"
        title="O Nome das Águas"
        description="Reconheça um ou mais movimentos percebidos agora. Emoções podem coexistir, mudar e permanecer sem explicação imediata."
      />

      <div className="water-mission-grid">
        <Card title="Quais movimentos estão presentes?" eyebrow="Seleção múltipla e opcional" className="water-mission-grid__wide">
          <div className="emotion-grid">
            {waterEmotions.map((emotion) => {
              const selected = checkIn.emotions.includes(emotion.id);
              return (
                <button
                  key={emotion.id}
                  type="button"
                  className={`emotion-card ${selected ? 'emotion-card--selected' : ''}`}
                  aria-pressed={selected}
                  onClick={() => toggleWaterEmotion(emotion.id)}
                >
                  <strong>{emotion.label}</strong>
                  <span>{emotion.description}</span>
                </button>
              );
            })}
          </div>
        </Card>

        <Card title="Intensidade percebida" eyebrow="Opcional">
          <div className="intensity-scale" aria-label="Intensidade percebida de um a cinco">
            {([1, 2, 3, 4, 5] as const).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={checkIn.intensity === value}
                className={checkIn.intensity === value ? 'intensity-button intensity-button--selected' : 'intensity-button'}
                onClick={() => setWaterIntensity(checkIn.intensity === value ? undefined : value)}
              >
                {value}
              </button>
            ))}
          </div>
          <p className="field-help">A escala serve somente para esta sessão e não mede saúde, risco ou gravidade clínica.</p>
        </Card>

        <Card title="O que parece necessário?" eyebrow="Opcional">
          <div className="need-grid">
            {waterNeeds.map((need) => (
              <button
                key={need.id}
                type="button"
                className={checkIn.need === need.id ? 'need-chip need-chip--selected' : 'need-chip'}
                aria-pressed={checkIn.need === need.id}
                onClick={() => setWaterNeed(checkIn.need === need.id ? undefined : need.id)}
              >
                {need.label}
              </button>
            ))}
          </div>
        </Card>

        <Card title="Privacidade e limites" eyebrow="Local-first" className="water-mission-grid__wide">
          <div className="safety-summary"><ShieldCheck/><p>Você pode concluir sem registrar. O Athanor não interpreta causa, transtorno, memória ou identidade a partir das escolhas.</p></div>
          <div className="water-mission-actions">
            <Button variant="ghost" onClick={skipWaterCheckIn}>Prefiro não registrar</Button>
            <Button disabled={!canComplete} onClick={completeWaterNaming}>Criar Gota Nomeada</Button>
          </div>
          {checkIn.skipped && <p className="field-help" role="status">Check-in recusado. A missão pode ser concluída sem respostas.</p>}
        </Card>
      </div>
    </div>
  );
}
