import { ArrowRight, BookOpenCheck, LampDesk, MapPin, ShieldCheck } from 'lucide-react';
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
  if (!item) return <div className="page"><PageHeader title="A receita ainda não foi concluída."/><Button onClick={() => navigate('/crafting/clear-word-lamp')}>Voltar à Forja</Button></div>;
  const place = () => { placeLamp(); navigate('/temple'); };
  return (
    <div className="page page--item-reveal">
      <PageHeader eyebrow="Item criado" title={item.name} description="Instrumento de Jornada · criação Athanor" />
      <div className="item-reveal">
        <div className="item-reveal__visual"><div className="item-reveal__halo"/><LampDesk size={82}/><span className="item-reveal__base"/></div>
        <div className="item-reveal__details"><div className="provenance-line"><ProvenanceBadge type="ATH"/><span>Receita original de gameplay</span></div><h2>Sua palavra recebeu um recipiente.</h2><p>A Lâmpada permanece vinculada à ação:</p><blockquote>{item.action}</blockquote><div className="item-function-grid">{item.functions.map((fn) => <div key={fn}><BookOpenCheck size={18}/><span>{fn}</span></div>)}</div></div>
      </div>
      <div className="content-grid">
        <Card title="Limites do item" eyebrow="Uso seguro"><ul className="simple-list">{item.restrictions.map((restriction) => <li key={restriction}><ShieldCheck size={16}/>{restriction}</li>)}</ul></Card>
        <Card title="Próxima transformação" eyebrow="Biblioteca dos Provérbios"><p>Posicione a Lâmpada para restaurar a sala, iluminar Hod no mapa e concluir o vertical slice.</p><Button onClick={place}><MapPin size={18}/> Posicionar na Biblioteca <ArrowRight size={18}/></Button></Card>
      </div>
    </div>
  );
}
