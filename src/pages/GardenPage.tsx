import { BookOpenText, CheckCircle2, Footprints, LockKeyhole, ShieldCheck, Sprout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { earthActionOptions, earthResourceOptions } from '../content/earthBody';
import { earthFoundationBiblicalUnit } from '../content/earthFoundation';
import { useAthanorStore } from '../state/useAthanorStore';
import { useEarthBodyStore } from '../state/useEarthBodyStore';
import { useFireChapterStore } from '../state/useFireChapterStore';

export function GardenPage() {
  const navigate = useNavigate();
  const garden = useAthanorStore((state) => state.temple?.rooms.find((room) => room.roomId === 'garden'));
  const fireChapter = useFireChapterStore((state) => state.progress);
  const rawBodyProgress = useEarthBodyStore((state) => state.progress);
  const sourceFireCycleId = fireChapter?.cycleId ?? fireChapter?.completedAt;
  const bodyProgress = sourceFireCycleId && rawBodyProgress?.sourceFireCycleId === sourceFireCycleId
    ? rawBodyProgress
    : undefined;
  const available = Boolean(fireChapter?.status === 'completed' || (garden && garden.status !== 'dormant' && garden.status !== 'hidden'));

  if (!available) {
    return <div className="page page--earth"><PageHeader eyebrow="Capítulo da Terra" title="O Jardim ainda está adormecido." description="Conclua a revisão geral do Fogo. O Jardim não é aberto apenas pela criação ou pelo posicionamento do Escudo."/><Card title="Caminho ainda fechado" eyebrow="Dependência da jornada"><div className="earth-lock"><LockKeyhole/><p>Integre e posicione o Escudo e escolha o destino das cinco práticas do Fogo.</p></div><Button onClick={() => navigate('/review/fire-chapter')}>Revisar o capítulo do Fogo</Button></Card></div>;
  }

  const selectedAction = earthActionOptions.find((option) => option.id === bodyProgress?.action);
  const selectedResources = earthResourceOptions.filter((option) => bodyProgress?.resources.includes(option.id));
  const missionLabel = bodyProgress?.status === 'completed'
    ? 'Revisar a Marca da Presença'
    : bodyProgress
      ? 'Continuar O Corpo Chega Primeiro'
      : 'Iniciar O Corpo Chega Primeiro';

  return <div className="page page--earth"><PageHeader eyebrow="Jardim Interior" title={bodyProgress?.status === 'completed' ? 'A presença corporal recebeu sua primeira marca.' : 'A Terra começa pelo que já está presente.'} description="O capítulo organiza corpo percebido, descanso e um primeiro passo sem diagnóstico ou cobrança de produtividade."/><div className="earth-foundation-grid"><Card className="earth-hero-card"><div className="earth-hero-symbol" aria-hidden="true">{bodyProgress?.status === 'completed' ? <Footprints/> : <Sprout/>}</div><div><p className="eyebrow">Estado do Jardim</p><h2>{bodyProgress?.status === 'completed' ? 'Primeiro componente criado' : bodyProgress ? 'Missão em andamento' : 'Fundação disponível'}</h2><p>{bodyProgress?.status === 'completed' ? 'A Marca registra escolhas curadas sem avaliar saúde, disciplina ou produtividade.' : 'A primeira missão trabalha somente com escolhas curadas, recusáveis e armazenadas localmente.'}</p></div></Card><Card title={earthFoundationBiblicalUnit.title} eyebrow={earthFoundationBiblicalUnit.reference}><blockquote>{earthFoundationBiblicalUnit.principle}</blockquote><p>{earthFoundationBiblicalUnit.context}</p><div className="provenance-inline"><BookOpenText size={17}/><span>A Bíblia permanece como núcleo. Malkhut, Kun e A Imperatriz são camadas opcionais e identificadas.</span></div></Card><Card title="O Corpo Chega Primeiro" eyebrow="Primeira missão da Terra"><div className="earth-mission-preview">{bodyProgress?.status === 'completed' ? <CheckCircle2/> : <Footprints/>}<div><strong>{bodyProgress?.status === 'completed' ? 'Marca da Presença Corporal criada' : 'Check-in perceptivo e recusável'}</strong><p>{bodyProgress?.status === 'completed' ? `${selectedAction?.label ?? 'Nenhuma ação'} · ${selectedResources.length} estado(s) de recurso` : 'Energia, descanso, tensão, conforto, recursos e uma ação pequena.'}</p></div></div><ul className="simple-list"><li>nenhuma leitura clínica do corpo;</li><li>nenhuma contagem de peso, calorias ou desempenho;</li><li>descanso e não agir são opções completas;</li><li>sinais de emergência usam linguagem direta e sem símbolos.</li></ul><Button onClick={() => navigate('/mission/body-arrives-first')}>{missionLabel}</Button></Card>{bodyProgress?.status === 'completed' && <Card title="Marca da Presença Corporal" eyebrow="Primeiro componente"><div className="earth-mission-preview"><Footprints/><div><strong>Componente local criado</strong><p>Não conclui o capítulo e não representa diagnóstico ou melhora.</p></div></div></Card>}<Card title="Limites do Jardim" eyebrow="Segurança"><div className="safety-summary"><ShieldCheck/><p>O Athanor não diagnostica condições físicas, não recomenda tratamento e não transforma produtividade em valor pessoal.</p></div><Button variant="ghost" onClick={() => navigate('/safety?source=earth')}>Abrir apoio direto</Button></Card></div></div>;
}
