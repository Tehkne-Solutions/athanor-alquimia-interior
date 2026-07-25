import { ArrowLeft, CheckCircle2, Clock3, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import type { ReviewOutcome } from '../domain/types';
import { useAthanorStore } from '../state/useAthanorStore';

const reviewOptions: Array<{
  outcome: ReviewOutcome;
  title: string;
  description: string;
  icon: typeof CheckCircle2;
}> = [
  {
    outcome: 'integrated',
    title: 'A ação cumpriu sua função',
    description: 'Concluir o ciclo e integrar a Lâmpada à primeira Obra.',
    icon: CheckCircle2
  },
  {
    outcome: 'adjusted',
    title: 'Preciso ajustar o próximo passo',
    description: 'Preservar o aprendizado e reformular uma ação que dependa de você.',
    icon: RefreshCw
  },
  {
    outcome: 'resting',
    title: 'Ainda não é o momento de concluir',
    description: 'Manter o ciclo em observação, sem perder progresso ou sequência.',
    icon: Clock3
  }
];

export function ReviewPage() {
  const navigate = useNavigate();
  const mission = useAthanorStore((state) => state.activeMission);
  const item = useAthanorStore((state) => state.inventory.find((candidate) => candidate.id === 'item_clear_word_lamp_v1'));
  const completeLampReview = useAthanorStore((state) => state.completeLampReview);
  const [outcome, setOutcome] = useState<ReviewOutcome>('resting');
  const [reflection, setReflection] = useState('');
  const [adjustedAction, setAdjustedAction] = useState(mission?.action ?? '');

  if (!mission || !item) {
    return (
      <div className="page">
        <PageHeader title="Não há um ciclo pronto para revisão." description="A revisão é liberada depois que a Lâmpada é criada e posicionada na Biblioteca." />
        <Button onClick={() => navigate('/temple')}><ArrowLeft size={18}/> Voltar ao Templo</Button>
      </div>
    );
  }

  const submit = () => {
    completeLampReview(outcome, reflection, adjustedAction);
    navigate(outcome === 'integrated' ? '/temple' : '/items/clear-word-lamp');
  };

  const adjustedActionMissing = outcome === 'adjusted' && !adjustedAction.trim();

  return (
    <div className="page page--review">
      <PageHeader
        eyebrow="Retorno à Obra"
        title="Revisão da Lâmpada da Palavra Clara"
        description="A revisão registra o que aconteceu depois da prática. Ela não mede sucesso pessoal e pode permanecer em repouso pelo tempo necessário."
      />

      <div className="review-layout">
        <Card title="A ação vinculada" eyebrow="Ciclo em observação">
          <blockquote>{mission.action}</blockquote>
          <p className="muted">Você pode concluir, ajustar ou manter este ciclo em repouso. Nenhuma opção remove o item ou apaga a restauração da Biblioteca.</p>
        </Card>

        <Card title="O que aconteceu desde então?" eyebrow="Escolha um destino">
          <div className="review-options" role="radiogroup" aria-label="Destino da revisão">
            {reviewOptions.map(({ outcome: optionOutcome, title, description, icon: Icon }) => (
              <button
                type="button"
                key={optionOutcome}
                role="radio"
                aria-checked={outcome === optionOutcome}
                className={`review-option ${outcome === optionOutcome ? 'review-option--selected' : ''}`}
                onClick={() => setOutcome(optionOutcome)}
              >
                <Icon size={22} aria-hidden="true" />
                <span><strong>{title}</strong><small>{description}</small></span>
              </button>
            ))}
          </div>
        </Card>

        {outcome === 'adjusted' && (
          <Card title="Ajuste a ação" eyebrow="Novo passo revisável">
            <label className="field">
              <span>Ação ajustada</span>
              <textarea
                value={adjustedAction}
                onChange={(event) => setAdjustedAction(event.target.value)}
                placeholder="Descreva uma ação que dependa de você, tenha limite e possa ser revisada novamente."
              />
            </label>
          </Card>
        )}

        <Card title="Registro opcional" eyebrow="Privado e local">
          <label className="field">
            <span>O que você percebeu?</span>
            <textarea
              value={reflection}
              onChange={(event) => setReflection(event.target.value)}
              placeholder="Você pode escrever uma frase, deixar em branco ou registrar apenas mais tarde."
            />
          </label>
          <p className="muted">Este texto permanece no estado local do aplicativo e não é enviado para analytics.</p>
        </Card>
      </div>

      <div className="mission-actions">
        <Button variant="ghost" onClick={() => navigate('/temple')}><ArrowLeft size={18}/> Revisar depois</Button>
        <Button disabled={adjustedActionMissing} onClick={submit}>Registrar revisão</Button>
      </div>
    </div>
  );
}
