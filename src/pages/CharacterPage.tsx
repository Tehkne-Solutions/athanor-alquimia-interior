import { Award, Compass, Settings2, Shield, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { PageHeader } from '../components/PageHeader';
import { useAthanorStore } from '../state/useAthanorStore';

export function CharacterPage() {
  const navigate = useNavigate();
  const character = useAthanorStore((state) => state.character);
  const inventory = useAthanorStore((state) => state.inventory);
  const reviews = useAthanorStore((state) => state.reviews ?? []);

  if (!character) return null;

  const integrated = inventory.some((item) => item.lifecycle === 'integrated');
  const levelLabel = character.workLevel === 'first_fire' ? 'Primeiro Fogo' : 'Fundação';

  return (
    <div className="page">
      <PageHeader
        eyebrow="Ficha RPG"
        title={character.name}
        description="Status de progressão do jogo, separados de qualquer avaliação clínica ou moral."
        action={<Button variant="ghost" onClick={() => navigate('/settings/accessibility')}><Settings2 size={18}/> Acessibilidade</Button>}
      />
      <div className="character-sheet">
        <Card className="character-sheet__avatar"><CharacterAvatar character={character}/></Card>
        <Card title="Nível da Obra" eyebrow="Progressão">
          <div className="stat-block"><strong>{levelLabel}</strong><span>{character.workLevel === 'first_fire' ? '2' : '1'} de 6 faixas narrativas</span></div>
          <div className="progress-track"><span style={{width: integrated ? '32%' : inventory.length ? '22%' : '12%'}}/></div>
        </Card>
        <Card title="Caminhos" eyebrow="Classes">
          <div className="mini-stat"><Compass/><span><strong>Classe principal</strong>{character.primaryClass}</span></div>
          <div className="mini-stat"><Award/><span><strong>Origem</strong>{character.origin}</span></div>
        </Card>
        <Card title="Virtudes em prática" eyebrow="Experiências concluídas">
          <div className="virtue-list"><span><Sparkles/> Prudência <b>{inventory.length ? 2 : 0}</b></span><span><Shield/> Clareza <b>{integrated ? 2 : inventory.length ? 1 : 0}</b></span></div>
          <p className="muted">Esses números representam práticas de gameplay, não traços permanentes.</p>
        </Card>
        <Card title="Ciclos revisados" eyebrow="Retorno à Obra">
          <div className="stat-block"><strong>{reviews.length}</strong><span>{reviews.length === 1 ? 'revisão registrada' : 'revisões registradas'}</span></div>
          <p className="muted">Revisar, ajustar e colocar em repouso contam como formas válidas de acompanhar uma jornada.</p>
        </Card>
      </div>
    </div>
  );
}
