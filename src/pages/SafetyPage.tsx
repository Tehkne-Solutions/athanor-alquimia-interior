import { HeartHandshake, Phone, ShieldAlert } from 'lucide-react';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';

export function SafetyPage() {
  return <div className="page page--safety"><PageHeader eyebrow="Apoio direto" title="Sua segurança vem antes da narrativa." description="O fluxo simbólico foi interrompido. Em uma situação de risco imediato, procure serviços de emergência locais ou alguém de confiança."/><div className="content-grid"><Card title="Ação imediata"><div className="safety-action"><Phone/><p>Contate o serviço de emergência da sua região ou dirija-se a um local seguro.</p></div></Card><Card title="Apoio humano"><div className="safety-action"><HeartHandshake/><p>Considere falar com uma pessoa de confiança ou profissional qualificado.</p></div></Card><Card title="Limite do produto"><div className="safety-action"><ShieldAlert/><p>O Athanor não interpreta crises por símbolos, cartas, passagens ou crafting.</p></div></Card></div></div>;
}
