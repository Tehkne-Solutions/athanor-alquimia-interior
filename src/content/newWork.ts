import type { BiblicalUnit } from '../domain/types';
import type { NewWorkMode, NewWorkStartPoint } from '../domain/continuousJourney';

export const newWorkBiblicalUnit: BiblicalUnit = {
  id: 'psalm_new_work_v1',
  reference: 'Salmos 90:17',
  title: 'A obra pode recomeçar sem apagar o caminho',
  principle: 'Pedir firmeza para uma obra não exige negar os ciclos anteriores nem transformar continuidade em obrigação.',
  context: 'O salmo encerra uma oração sobre tempo, limite e trabalho. O Athanor usa esse princípio editorialmente para abrir novas jornadas locais e revisáveis, sem prometer aprovação divina, êxito, produtividade ou permanência.',
  themes: ['obra', 'tempo', 'continuidade', 'memória', 'recomeço'],
  application: 'Escolher um novo ponto de partida, observar ou repousar, preservando todos os ciclos já registrados.',
  provenance: [{
    id: 'prov-new-work-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia o modo contínuo; os pontos de partida e registros são estruturas autorais do Athanor.',
    sourceLabel: 'Salmos 90:17'
  }]
};

export const newWorkStartPoints: Array<{ id: NewWorkStartPoint; label: string; description: string; route: string }> = [
  { id: 'word', label: 'Palavra', description: 'Retornar à Biblioteca e às práticas de formulação e discernimento.', route: '/temple/proverbs-library' },
  { id: 'water', label: 'Água', description: 'Retornar à Câmara dos Salmos e às práticas de emoção, memória e apoio.', route: '/temple/psalms-chamber' },
  { id: 'fire', label: 'Fogo', description: 'Retornar à Forja e às práticas de intervalo, limite e transformação.', route: '/temple/forge' },
  { id: 'earth', label: 'Terra', description: 'Retornar ao Jardim e às práticas de corpo, recurso, ritmo e ordem.', route: '/temple/garden' },
  { id: 'spirit', label: 'Espírito', description: 'Retornar ao Santuário e às práticas de síntese, conselho e revisão.', route: '/temple/spirit-sanctuary' },
  { id: 'rest', label: 'Repouso sem novo ponto', description: 'Registrar uma pausa sem iniciar ou reiniciar qualquer missão.', route: '/temple' }
];

export const newWorkModes: Array<{ id: NewWorkMode; label: string; description: string }> = [
  { id: 'revisit_practice', label: 'Revisitar uma prática', description: 'Voltar a um ambiente sem apagar ou reiniciar o ciclo anterior.' },
  { id: 'open_new_cycle', label: 'Preparar um novo ciclo', description: 'Registrar intenção de jornada futura sem iniciar tarefas automaticamente.' },
  { id: 'observe_only', label: 'Somente observar', description: 'Abrir o ambiente sem assumir compromisso de ação.' },
  { id: 'rest_without_start', label: 'Repousar sem iniciar', description: 'Manter o Templo disponível sem escolher uma nova missão.' }
];

export const newWorkRestrictions = [
  'Não apaga ciclos, itens, destinos ou revisões anteriores',
  'Não reinicia missões automaticamente',
  'Não cria streak, prazo, cobrança ou pontuação de continuidade',
  'Não interpreta a escolha como direção espiritual, diagnóstico ou previsão',
  'Repousar e não escolher um elemento são resultados completos'
];
