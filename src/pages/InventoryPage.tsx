import { Archive, CupSoda, Gem, LampDesk, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { useAthanorStore } from '../state/useAthanorStore';
import { useEarthStoneStore } from '../state/useEarthStoneStore';
import { useFireShieldStore } from '../state/useFireShieldStore';
import { useWaterChaliceStore } from '../state/useWaterChaliceStore';

const lifecycleLabel = (lifecycle: string) => {
  if (lifecycle === 'integrated') return 'Integrado';
  if (lifecycle === 'awaiting_review') return 'Em revisão';
  if (lifecycle === 'adjusted') return 'Ajustado';
  if (lifecycle === 'resting') return 'Em repouso';
  if (lifecycle === 'crafting') return 'Em preparação';
  return 'Ativo';
};

export function InventoryPage() {
  const navigate = useNavigate();
  const inventory = useAthanorStore((state) => state.inventory);
  const chalice = useWaterChaliceStore((state) => state.progress);
  const shield = useFireShieldStore((state) => state.progress);
  const stone = useEarthStoneStore((state) => state.progress);
  const hasChalice = Boolean(chalice?.chaliceCreated);
  const hasShield = Boolean(shield?.shieldCreated);
  const hasStone = Boolean(stone?.stoneCreated);
  const empty = inventory.length === 0 && !hasChalice && !hasShield && !hasStone;

  return (
    <div className="page">
      <PageHeader eyebrow="Arsenal simbólico" title="Inventário" description="Itens registram ciclos de gameplay. Eles não prometem efeitos externos." />
      {empty ? (
        <Card className="empty-inventory"><Archive size={38}/><h2>Seu inventário ainda está vazio.</h2><p>A primeira receita é desbloqueada na Biblioteca dos Provérbios.</p><Button onClick={() => navigate('/temple/proverbs-library')}>Ir para a Biblioteca</Button></Card>
      ) : (
        <div className="inventory-grid">
          {inventory.map((item) => (
            <button key={item.id} className="inventory-item" type="button" onClick={() => navigate('/items/clear-word-lamp')}>
              <div className="inventory-item__icon"><LampDesk/></div>
              <span className={`item-status item-status--${item.lifecycle}`}>{lifecycleLabel(item.lifecycle)}</span>
              <strong>{item.name}</strong>
              <small>{item.action}</small>
            </button>
          ))}
          {hasChalice && chalice && (
            <button className="inventory-item" type="button" onClick={() => navigate('/crafting/memory-serene-chalice')}>
              <div className="inventory-item__icon"><CupSoda/></div>
              <span className={`item-status item-status--${chalice.status}`}>{lifecycleLabel(chalice.status)}</span>
              <strong>Cálice da Memória Serena</strong>
              <small>{chalice.positioned ? 'Posicionado na Câmara dos Salmos' : 'Ciclo da Água em andamento'}</small>
            </button>
          )}
          {hasShield && shield && (
            <button className="inventory-item" type="button" onClick={() => navigate('/crafting/just-boundary-shield')}>
              <div className="inventory-item__icon"><Shield/></div>
              <span className={`item-status item-status--${shield.status}`}>{lifecycleLabel(shield.status)}</span>
              <strong>Escudo do Limite Justo</strong>
              <small>{shield.positioned ? 'Posicionado na Forja' : 'Ciclo do Fogo em andamento'}</small>
            </button>
          )}
          {hasStone && stone && (
            <button className="inventory-item" type="button" onClick={() => navigate('/crafting/first-step-stone')}>
              <div className="inventory-item__icon"><Gem/></div>
              <span className={`item-status item-status--${stone.status}`}>{lifecycleLabel(stone.status)}</span>
              <strong>Pedra do Primeiro Passo</strong>
              <small>{stone.positioned ? 'Posicionada no Jardim' : 'Ciclo da Terra em andamento'}</small>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
