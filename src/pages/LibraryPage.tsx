import { ArrowRight, BookMarked, Wind } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { ProvenanceBadge } from '../components/ProvenanceBadge';
import { biblicalUnits } from '../content/seed';
import { useAthanorStore } from '../state/useAthanorStore';

export function LibraryPage() {
  const navigate = useNavigate();
  const temple = useAthanorStore((state) => state.temple);
  const startMission = useAthanorStore((state) => state.startMission);
  const passage = biblicalUnits[0];
  const restored = temple?.rooms.find((room) => room.roomId === 'proverbs-library')?.status === 'restored';
  const begin = () => { startMission(); navigate('/mission/word-before-response'); };
  return (
    <div className="page page--library">
      <PageHeader eyebrow="Capítulo do Ar" title="Biblioteca dos Provérbios" description={restored ? 'A Lâmpada organiza os caminhos da palavra e revela novas estantes.' : 'Fatos, interpretações e previsões atravessam os mesmos corredores. A Biblioteca precisa recuperar sua ordem.'} />
      <div className={`library-scene ${restored ? 'library-scene--restored' : ''}`}>
        <div className="library-scene__wind" aria-hidden="true"><span/><span/><span/></div>
        <div className="library-scene__character"><Wind size={40}/><strong>Mensageiro dos Ventos</strong><p>“Todas estas mensagens parecem urgentes quando chegam ao mesmo tempo.”</p></div>
        <div className="library-scene__lamp" aria-hidden="true" />
      </div>
      <div className="content-grid">
        <Card eyebrow="Fonte bíblica" title={passage.reference}><div className="provenance-line"><ProvenanceBadge type="BIB"/><span>Base principal da missão</span></div><blockquote>{passage.principle}</blockquote><p>{passage.context}</p><details><summary>Abrir aplicação editorial</summary><p>{passage.application}</p></details></Card>
        <Card eyebrow="Objetivo" title="Restaurar a ordem entre as palavras"><ul className="simple-list"><li>Distinguir o que foi observado</li><li>Reconhecer interpretações</li><li>Tratar previsões como possibilidades</li><li>Escolher uma intenção e uma ação</li></ul><Button onClick={begin}>{restored ? 'Revisitar missão' : 'Iniciar missão'} <ArrowRight size={18}/></Button></Card>
        <Card eyebrow="Recompensa" title="Lâmpada da Palavra Clara"><div className="reward-preview"><BookMarked/><div><strong>Instrumento de Jornada</strong><p>Abre missões de comunicação, destaca proveniência e restaura esta Biblioteca.</p></div></div></Card>
      </div>
    </div>
  );
}
