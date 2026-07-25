import { ArrowRight, BookOpenCheck, CheckCircle2, Clock3, LampDesk, MapPin, RefreshCw, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { ProvenanceBadge } from '../components/ProvenanceBadge';
import { useAthanorStore } from '../state/useAthanorStore';

export function ItemPage() {
  const navigate = useNavigate();
  const item = useAthanorStore((state) => state.inventory.find((candidate) => candidate.id === 'item_clear_word_lamp_v1'));
  const placeLamp = useAthanorStore((state) => state.placeLamp);

  if (!item) {
    return <div className="page"><PageHeader title="A receita ainda não foi concluída."/><Button onClick={() => navigate('/crafting/clear-word-lamp')}>Voltar à Forja</Button></div>;
  }

  const awaitingReview = item.lifecycle === 'awaiting_review' || item.lifecycle === 'adjusted';
  const integrated = item.lifecycle === 'integrated';
  const place = () => {
    placeLamp();
    navigate('/review/clear-word-lamp');
  };

  return (
    <div className="page page--item-reveal">
      <PageHeader
        eyebrow={integrated ? 'Item integrado' : awaitingReview ? 'Item em observação' : 'Item criado'}
        title={item.name}
        description="Instrumento de Jornada · criação Athanor"
      />
      <div className="item-reveal">
        <div className="item-reveal__visual"><div className="item-reveal__halo"/><LampDesk size={82}/><span className="item-reveal__base"/></div>
        <div className="item-reveal__details">
          <div className="provenance-line"><ProvenanceBadge type="ATH"/><span>Receita original de gameplay</span></div>
          <h2>Sua palavra recebeu um recipiente.</h2>
          <p>A Lâmpada permanece vinculada à ação:</p>
          <blockquote>{item.action}</blockquote>
          <div className="item-function-grid">{item.functions.map((fn) => <div key={fn}><BookOpenCheck size={18}/><span>{fn}</span></div>)}</div>
        </div>
      </div>
      <div className="content-grid">
        <Card title="Limites do item" eyebrow="Uso seguro"><ul className="simple-list">{item.restrictions.map((restriction) => <li key={restriction}><ShieldCheck size={16}/>{restriction}</li>)}</ul></Card>

        {!awaitingReview && !integrated && (
          <Card title="Posicionar na Biblioteca" eyebrow="Transformação do Templo">
            <p>A sala será restaurada visualmente, mas o ciclo só será integrado depois que você retornar para revisar a ação.</p>
            <Button onClick={place}><MapPin size={18}/> Posicionar e abrir revisão <ArrowRight size={18}/></Button>
          </Card>
        )}

        {awaitingReview && (
          <Card title="Revisão pendente" eyebrow={item.lifecycle === 'adjusted' ? 'Ação ajustada' : 'Ciclo em observação'}>
            <div className="review-status"><Clock3 aria-hidden="true"/><p>A Biblioteca já foi restaurada. Agora você pode registrar o resultado, ajustar o passo ou manter o ciclo em repouso.</p></div>
            <Button onClick={() => navigate('/review/clear-word-lamp')}><RefreshCw size={18}/> Revisar a Lâmpada</Button>
          </Card>
        )}

        {integrated && (
          <Card title="Ciclo integrado" eyebrow="Primeira Obra">
            <div className="review-status review-status--complete"><CheckCircle2 aria-hidden="true"/><p>A ação foi revisada e a Lâmpada passou a fazer parte da sua Obra. O registro continua disponível localmente.</p></div>
            <Button onClick={() => navigate('/temple')}>Voltar ao Templo <ArrowRight size={18}/></Button>
          </Card>
        )}
      </div>
    </div>
  );
}
