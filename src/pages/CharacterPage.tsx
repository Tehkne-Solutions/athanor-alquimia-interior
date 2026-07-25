import { Award, Compass, Shield, Sparkles } from 'lucide-react';
import { Card } from '../components/Card';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { PageHeader } from '../components/PageHeader';
import { useAthanorStore } from '../state/useAthanorStore';

export function CharacterPage() {
  const character = useAthanorStore((state) => state.character);
  const inventory = useAthanorStore((state) => state.inventory);
  if (!character) return null;
  return <div className="page"><PageHeader eyebrow="Ficha RPG" title={character.name} description="Status de progressão do jogo, separados de qualquer avaliação clínica ou moral."/><div className="character-sheet"><Card className="character-sheet__avatar"><CharacterAvatar character={character}/></Card><Card title="Nível da Obra" eyebrow="Progressão"><div className="stat-block"><strong>Fundação</strong><span>1 de 6 faixas narrativas</span></div><div className="progress-track"><span style={{width: inventory.length ? '32%' : '12%'}}/></div></Card><Card title="Caminhos" eyebrow="Classes"><div className="mini-stat"><Compass/><span><strong>Classe principal</strong>{character.primaryClass}</span></div><div className="mini-stat"><Award/><span><strong>Origem</strong>{character.origin}</span></div></Card><Card title="Virtudes em prática" eyebrow="Experiências concluídas"><div className="virtue-list"><span><Sparkles/> Prudência <b>{inventory.length ? 2 : 0}</b></span><span><Shield/> Clareza <b>{inventory.length ? 1 : 0}</b></span></div><p className="muted">Esses números representam práticas de gameplay, não traços permanentes.</p></Card></div></div>;
}
