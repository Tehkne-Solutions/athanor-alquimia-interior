import { BookOpenText, Footprints, LockKeyhole, ShieldCheck, Sprout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { earthFoundationBiblicalUnit } from '../content/earthFoundation';
import { useAthanorStore } from '../state/useAthanorStore';
import { useFireChapterStore } from '../state/useFireChapterStore';

export function GardenPage() {
  const navigate = useNavigate();
  const garden = useAthanorStore((state) => state.temple?.rooms.find((room) => room.roomId === 'garden'));
  const fireChapter = useFireChapterStore((state) => state.progress);
  const available = Boolean(fireChapter?.status === 'completed' || (garden && garden.status !== 'dormant' && garden.status !== 'hidden'));

  if (!available) {
    return <div className="page page--earth"><PageHeader eyebrow="Capítulo da Terra" title="O Jardim ainda está adormecido." description="Conclua a revisão geral do Fogo. O Jardim não é aberto apenas pela criação ou pelo posicionamento do Escudo."/><Card title="Caminho ainda fechado" eyebrow="Dependência da jornada"><div className="earth-lock"><LockKeyhole/><p>Integre e posicione o Escudo e escolha o destino das cinco práticas do Fogo.</p></div><Button onClick={() => navigate('/review/fire-chapter')}>Revisar o capítulo do Fogo</Button></Card></div>;
  }

  return <div className="page page--earth"><PageHeader eyebrow="Jardim Interior" title="A Terra começa pelo que já está presente." description="A fundação técnica do capítulo organiza corpo percebido, descanso e um primeiro passo sem diagnóstico ou cobrança de produtividade."/><div className="earth-foundation-grid"><Card className="earth-hero-card"><div className="earth-hero-symbol" aria-hidden="true"><Sprout/></div><div><p className="eyebrow">Estado do Jardim</p><h2>Fundação disponível</h2><p>A primeira missão será O Corpo Chega Primeiro. Ela trabalhará somente com escolhas curadas, recusáveis e armazenadas localmente.</p></div></Card><Card title={earthFoundationBiblicalUnit.title} eyebrow={earthFoundationBiblicalUnit.reference}><blockquote>{earthFoundationBiblicalUnit.principle}</blockquote><p>{earthFoundationBiblicalUnit.context}</p><div className="provenance-inline"><BookOpenText size={17}/><span>A Bíblia permanece como núcleo. Malkhut, Kun e A Imperatriz serão camadas opcionais e identificadas.</span></div></Card><Card title="O Corpo Chega Primeiro" eyebrow="Primeira missão da Terra"><div className="earth-mission-preview"><Footprints/><div><strong>Escopo técnico preparado</strong><p>Condições percebidas, pausa, recurso disponível e uma ação pequena.</p></div></div><ul className="simple-list"><li>nenhuma leitura clínica do corpo;</li><li>nenhuma contagem de peso, calorias ou desempenho;</li><li>descanso e não agir serão opções completas;</li><li>sinais de emergência usarão linguagem direta e sem símbolos.</li></ul><Button disabled>Missão disponível na Fase 6.0</Button></Card><Card title="Limites do Jardim" eyebrow="Segurança"><div className="safety-summary"><ShieldCheck/><p>O Athanor não diagnostica condições físicas, não recomenda tratamento e não transforma produtividade em valor pessoal.</p></div><Button variant="ghost" onClick={() => navigate('/safety?source=earth')}>Abrir apoio direto</Button></Card></div></div>;
}
