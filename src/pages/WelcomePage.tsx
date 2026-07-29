import { ArrowRight, BookOpenText, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';

export function WelcomePage() {
  const navigate = useNavigate();
  return (
    <main className="landing-page">
      <div className="landing-page__glow" aria-hidden="true" />
      <section className="landing-hero">
        <div className="brand brand--hero"><span className="brand__mark">A</span><span className="brand__text"><strong>Athanor</strong><small>Alquimia Interior</small></span></div>
        <p className="eyebrow">RPG contemplativo · Tehkné Solutions</p>
        <h1>Construa seu <em>Templo Interior.</em></h1>
        <p className="landing-hero__lead">Uma jornada de sabedoria bíblica, reflexão, crafting simbólico e ações reais. Salmos e Provérbios formam o núcleo de um mundo pessoal que cresce com cada ciclo revisado.</p>
        <div className="landing-hero__actions">
          <Button onClick={() => navigate('/limits')}>Fundar meu Templo <ArrowRight size={18} /></Button>
          <Button variant="ghost" onClick={() => navigate('/limits')}>Conhecer limites e proposta</Button>
        </div>
        <div className="feature-grid">
          <article><BookOpenText /><strong>Bíblia como núcleo</strong><span>Salmos para contemplação e Provérbios para sabedoria prática.</span></article>
          <article><Sparkles /><strong>Templo persistente</strong><span>Ambientes, itens e caminhos representam sua jornada no jogo.</span></article>
          <article><ShieldCheck /><strong>Autonomia e privacidade</strong><span>Dados locais, práticas recusáveis e nenhuma interpretação clínica.</span></article>
        </div>
      </section>
    </main>
  );
}
