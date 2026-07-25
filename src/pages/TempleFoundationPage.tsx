import { ArrowRight, BookOpen, Gem, Sprout } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { useAthanorStore } from '../state/useAthanorStore';
import type { TempleTheme } from '../domain/types';

const themes: { id: TempleTheme; name: string; icon: typeof Gem; description: string }[] = [
  { id: 'mineral', name: 'Templo Mineral', icon: Gem, description: 'Obsidiana, basalto, metal e luz âmbar.' },
  { id: 'luminal', name: 'Biblioteca Luminal', icon: BookOpen, description: 'Pedra clara, vidro, papel e madeira.' },
  { id: 'living', name: 'Jardim Vivo', icon: Sprout, description: 'Água, raízes, minerais e estruturas orgânicas.' }
];

export function TempleFoundationPage() {
  const navigate = useNavigate();
  const foundTemple = useAthanorStore((state) => state.foundTemple);
  const [selected, setSelected] = useState<TempleTheme>('mineral');
  const submit = () => { foundTemple(selected); navigate('/setup/bible'); };
  return (
    <main className="onboarding-page">
      <header className="onboarding-header"><p className="eyebrow">Fundação · 2 de 3</p><h1>Escolha a primeira forma do seu Templo.</h1><p>A escolha é estética e poderá ser alterada. Ela não modifica fontes, recompensas ou resultados.</p></header>
      <div className="temple-theme-grid">
        {themes.map(({ id, name, icon: Icon, description }) => <button key={id} type="button" onClick={() => setSelected(id)} className={`temple-theme temple-theme--${id} ${selected === id ? 'temple-theme--selected' : ''}`}><div className="temple-theme__scene"><Icon size={42}/><span className="temple-theme__light"/></div><strong>{name}</strong><span>{description}</span></button>)}
      </div>
      <div className="onboarding-actions"><Button onClick={submit}>Fundar este Templo <ArrowRight size={18}/></Button></div>
    </main>
  );
}
