import { ArrowLeft, BookOpen, CheckCircle2, Footprints, Gem, Sprout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { useAthanorStore } from '../state/useAthanorStore';
import { useEarthBodyStore } from '../state/useEarthBodyStore';
import { useEarthChapterStore } from '../state/useEarthChapterStore';
import { useEarthOrderStore } from '../state/useEarthOrderStore';
import { useEarthResourcesStore } from '../state/useEarthResourcesStore';
import { useEarthRhythmStore } from '../state/useEarthRhythmStore';
import { useEarthStoneStore } from '../state/useEarthStoneStore';
import { useEarthWorkStore } from '../state/useEarthWorkStore';

export function PractitionerMemoryPage() {
  const navigate = useNavigate();
  const character = useAthanorStore((state) => state.character);
  const reviews = useAthanorStore((state) => state.reviews ?? []);
  const inventory = useAthanorStore((state) => state.inventory);
  const body = useEarthBodyStore((state) => state.progress);
  const work = useEarthWorkStore((state) => state.progress);
  const resources = useEarthResourcesStore((state) => state.progress);
  const rhythm = useEarthRhythmStore((state) => state.progress);
  const order = useEarthOrderStore((state) => state.progress);
  const stone = useEarthStoneStore((state) => state.progress);
  const chapter = useEarthChapterStore((state) => state.progress);

  if (!character) return null;

  const completedEarth = chapter?.status === 'completed';
  const milestones = [
    { label: 'Presença corporal percebida', done: Boolean(body?.bodyPresenceMarkCreated), icon: Footprints },
    { label: 'Semente do Primeiro Passo criada', done: Boolean(work?.firstStepSeedCreated), icon: Sprout },
    { label: 'Cesto dos Recursos Possíveis criado', done: Boolean(resources?.possibleResourcesBasketCreated), icon: BookOpen },
    { label: 'Compasso do Ritmo Sustentável criado', done: Boolean(rhythm?.rhythmCompassCreated), icon: BookOpen },
    { label: 'Mapa da Ordem Possível criado', done: Boolean(order?.possibleOrderMapCreated), icon: BookOpen },
    { label: 'Pedra do Primeiro Passo criada', done: Boolean(stone?.stoneCreated), icon: Gem },
    { label: 'Ciclo da Terra registrado', done: completedEarth, icon: CheckCircle2 }
  ];
  const completedMilestones = milestones.filter((item) => item.done).length;
  const recentReviews = [...reviews].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  return <div className="page page--memory">
    <PageHeader
      eyebrow="Memória do Praticante"
      title={`O que ficou da sua jornada, ${character.name}.`}
      description="O Athanor guarda acontecimentos da jornada para que você possa reconhecê-los depois. Registro não é diagnóstico, avaliação ou previsão."
      action={<Button variant="ghost" onClick={() => navigate('/temple')}><ArrowLeft size={18}/> Voltar ao Átrio</Button>}
    />
    <div className="temple-dashboard">
      <Card eyebrow="Jornada" title={`${completedMilestones} de ${milestones.length} marcos registrados`}>
        <div className="memory-milestones" aria-label="Marcos da jornada">
          {milestones.map(({ label, done, icon: Icon }) => <div className="item-mini" key={label}>
            <div className="lamp-icon"><Icon/></div>
            <div><strong>{label}</strong><p>{done ? 'Registrado na sua jornada.' : 'Ainda não registrado.'}</p></div>
          </div>)}
        </div>
      </Card>

      <Card eyebrow="Primeira Obra" title={completedEarth ? 'A experiência ganhou um lugar na memória' : 'A experiência ainda está em construção'}>
        <p>{completedEarth
          ? 'Você concluiu o primeiro ciclo da Terra. A memória aqui não transforma a experiência em uma nota: ela apenas preserva o caminho percorrido e os artefatos que nasceram dele.'
          : work
            ? 'Sua Primeira Obra já deixou rastros no Templo. Continue quando fizer sentido para você; o percurso pode permanecer aberto sem criar uma cobrança.'
            : 'Quando uma prática começar, seus marcos poderão aparecer aqui sem transformar a jornada em uma métrica de desempenho.'}</p>
        <Button variant="secondary" onClick={() => navigate(completedEarth ? '/temple/garden' : '/temple')}>{completedEarth ? 'Revisitar o Jardim' : 'Continuar no Átrio'} <ArrowLeft size={18}/></Button>
      </Card>

      <Card eyebrow="Registros anteriores" title={recentReviews.length ? 'Últimas revisões' : 'Ainda não há revisões registradas'}>
        {recentReviews.length ? recentReviews.map((review) => <div className="item-mini" key={review.id}>
          <div className="lamp-icon"><CheckCircle2/></div>
          <div><strong>{review.outcome === 'integrated' ? 'Integração' : review.outcome === 'adjusted' ? 'Ajuste' : 'Repouso'}</strong><p>{review.reflection || 'Uma revisão foi registrada sem reflexão escrita.'}</p></div>
        </div>) : <p>Quando uma Obra passar por revisão, o acontecimento poderá ser reencontrado aqui.</p>}
      </Card>

      <Card eyebrow="Artefatos" title="O que nasceu do caminho">
        <p>{inventory.length ? `${inventory.length} item(ns) permanecem registrados no inventário do Templo.` : 'Nenhum item permanente foi registrado ainda.'}</p>
        <Button variant="ghost" onClick={() => navigate('/inventory')}>Abrir instrumentos</Button>
      </Card>
    </div>
  </div>;
}
