import { Archive, LampDesk } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { useAthanorStore } from '../state/useAthanorStore';

export function InventoryPage() {
  const navigate = useNavigate();
  const inventory = useAthanorStore((state) => state.inventory);
  return (
    <div className="page">
      <PageHeader eyebrow="Arsenal simbólico" title="Inventário" description="Itens registram ciclos de gameplay. Eles não prometem efeitos externos." />
      {inventory.length === 0 ? <Card className="empty-inventory"><Archive size={38}/><h2>Seu inventário ainda está vazio.</h2><p>A primeira receita é desbloqueada na Biblioteca dos Provérbios.</p><Button onClick={() => navigate('/temple/proverbs-library')}>Ir para a Biblioteca</Button></Card> : <div className="inventory-grid">{inventory.map((item) => <button key={item.id} className="inventory-item" type="button" onClick={() => navigate('/items/clear-word-lamp')}><div className="inventory-item__icon"><LampDesk/></div><span className={`item-status item-status--${item.lifecycle}`}>{item.lifecycle === 'integrated' ? 'Integrado' : 'Ativo'}</span><strong>{item.name}</strong><small>{item.action}</small></button>)}</div>}
    </div>
  );
}
