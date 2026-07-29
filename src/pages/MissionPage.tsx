import { ArrowRight, MessageCircleQuestion, PauseCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { useAthanorStore } from '../state/useAthanorStore';

export function MissionPage() {
  const navigate = useNavigate();
  const mission = useAthanorStore((state) => state.activeMission);
  const startMission = useAthanorStore((state) => state.startMission);
  const classificationCompleted = Boolean(mission && mission.currentStep >= 2);
  const begin = () => {
    if (!mission) startMission();
    navigate(classificationCompleted ? '/mission/word-before-response/chain' : '/mission/word-before-response/classification');
  };
  return (
    <div className="page">
      <PageHeader eyebrow="Missão 01 · Capítulo do Ar" title="A Palavra Antes da Resposta" description="Uma missão de prudência, escuta e organização da comunicação." />
      <div className="mission-intro">
        <div className="mission-intro__symbol"><MessageCircleQuestion size={48}/></div>
        <div><p className="eyebrow">Conflito narrativo</p><h2>A resposta chegou antes da pergunta estar completa.</h2><p>O Mensageiro recebeu fragmentos diferentes e tenta responder a todos de uma vez. Para restaurar a Biblioteca, você deverá separar as camadas de cada frase.</p></div>
      </div>
      <div className="content-grid">
        <Card eyebrow="Etapa 1" title="Classifique as mensagens"><p>Separe fato, interpretação, previsão e intenção. O jogo oferece feedback explicativo, não uma avaliação psicológica.</p></Card>
        <Card eyebrow="Etapa 2" title="Escolha sua intenção"><p>Compreender, perguntar, esperar, informar, estabelecer limite ou preparar um próximo passo.</p></Card>
        <Card eyebrow="Etapa 3" title="Crie o item"><p>Transforme o princípio, a intenção e a ação em uma Lâmpada da Palavra Clara.</p></Card>
      </div>
      <div className="mission-actions"><Button variant="ghost" onClick={() => navigate('/temple')}><PauseCircle size={18}/> Pausar e voltar ao Átrio</Button><Button onClick={begin}>{classificationCompleted ? 'Retomar na cadeia simbólica' : mission ? 'Continuar classificação' : 'Começar classificação'} <ArrowRight size={18}/></Button></div>
    </div>
  );
}
