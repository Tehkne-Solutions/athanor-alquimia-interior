import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import type { AthanorCharacter, AstralTemple, CraftedItem, ItemLifecycle, MissionProgress } from '../domain/types';

vi.mock('../storage/idbStorage', () => ({
  idbStateStorage: {
    getItem: vi.fn(async () => null),
    setItem: vi.fn(async () => undefined),
    removeItem: vi.fn(async () => undefined)
  }
}));

import { MissionPage } from './MissionPage';
import { TemplePage } from './TemplePage';
import { useAthanorStore } from '../state/useAthanorStore';

const timestamp = '2026-08-02T12:00:00.000Z';

function createMission(currentStep: number): MissionProgress {
  return {
    id: 'mission_word_before_response_v1',
    status: 'active',
    currentStep,
    classifications: {},
    startedAt: timestamp,
    updatedAt: timestamp
  };
}

function createLamp(lifecycle: ItemLifecycle): CraftedItem {
  return {
    id: 'item_clear_word_lamp_v1',
    recipeId: 'recipe_clear_word_lamp_v1',
    name: 'Lâmpada da Palavra Clara',
    category: 'journey_instrument',
    lifecycle,
    functions: [],
    restrictions: [],
    action: 'Responder apenas depois de separar fato e interpretação.',
    createdAt: timestamp,
    updatedAt: timestamp,
    version: '1.2.0'
  };
}

const character: AthanorCharacter = {
  id: 'character-test',
  name: 'Peregrino',
  title: 'Artesão do Átrio',
  origin: 'reader',
  primaryClass: 'scribe',
  appearance: {
    body: 'body-01',
    skin: 'skin-03',
    hair: 'hair-02',
    garment: 'garment-scribe',
    accent: 'amber',
    symbol: 'lamp'
  },
  workLevel: 'foundation',
  createdAt: timestamp,
  updatedAt: timestamp,
  version: '1.2.0'
};

const temple: AstralTemple = {
  id: 'temple-test',
  theme: 'mineral',
  activeRoomId: 'atrium',
  placedItems: [],
  restorationLevel: 1,
  rooms: [
    { roomId: 'atrium', name: 'Átrio da Presença', status: 'active', restorationProgress: 30, placedItemIds: [] },
    { roomId: 'proverbs-library', name: 'Biblioteca dos Provérbios', status: 'available', restorationProgress: 8, activeMissionId: 'mission_word_before_response_v1', placedItemIds: [] },
    { roomId: 'psalms-chamber', name: 'Câmara dos Salmos', status: 'dormant', restorationProgress: 0, placedItemIds: [] },
    { roomId: 'forge', name: 'Forja dos Elementos', status: 'dormant', restorationProgress: 0, placedItemIds: [] },
    { roomId: 'garden', name: 'Jardim Interior', status: 'dormant', restorationProgress: 0, placedItemIds: [] },
    { roomId: 'central-tree', name: 'Árvore Central', status: 'dormant', restorationProgress: 0, placedItemIds: [] }
  ],
  createdAt: timestamp,
  updatedAt: timestamp,
  version: '1.2.0'
};

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}</output>;
}

function renderMission() {
  return render(
    <MemoryRouter initialEntries={['/mission/word-before-response']}>
      <Routes>
        <Route path="/mission/word-before-response" element={<MissionPage/>}/>
        <Route path="*" element={<LocationProbe/>}/>
      </Routes>
    </MemoryRouter>
  );
}

function renderTemple() {
  return render(
    <MemoryRouter initialEntries={['/temple']}>
      <Routes>
        <Route path="/temple" element={<TemplePage/>}/>
        <Route path="*" element={<LocationProbe/>}/>
      </Routes>
    </MemoryRouter>
  );
}

async function expectRoute(path: string) {
  await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent(path));
}

describe('entradas integradas da Primeira Obra', () => {
  beforeEach(() => {
    useAthanorStore.setState({
      initialized: true,
      onboardingCompleted: true,
      character,
      temple,
      activeMission: undefined,
      inventory: [],
      waterJourney: undefined,
      reviews: []
    });
  });

  afterEach(() => {
    cleanup();
    useAthanorStore.setState({
      character: undefined,
      temple: undefined,
      activeMission: undefined,
      inventory: [],
      waterJourney: undefined,
      reviews: []
    });
  });

  it('MissionPage inicia a classificação e cria a missão quando ainda não existe', async () => {
    renderMission();

    fireEvent.click(screen.getByRole('button', { name: /Começar classificação/i }));

    await expectRoute('/mission/word-before-response/classification');
    expect(useAthanorStore.getState().activeMission?.currentStep).toBe(1);
  });

  it('MissionPage retoma a cadeia simbólica quando a classificação já terminou', async () => {
    useAthanorStore.setState({ activeMission: createMission(2) });
    renderMission();

    fireEvent.click(screen.getByRole('button', { name: /Retomar na cadeia simbólica/i }));

    await expectRoute('/mission/word-before-response/chain');
  });

  it('MissionPage retoma revisão quando a Lâmpada aguarda retorno', async () => {
    useAthanorStore.setState({
      activeMission: createMission(2),
      inventory: [createLamp('awaiting_review')]
    });
    renderMission();

    fireEvent.click(screen.getByRole('button', { name: /Retomar revisão da Lâmpada/i }));

    await expectRoute('/review/clear-word-lamp');
  });

  it('TemplePage abre a missão pelo CTA central quando a Primeira Obra ainda não começou', async () => {
    renderTemple();

    fireEvent.click(screen.getByRole('button', { name: /Iniciar jornada/i }));

    await expectRoute('/mission/word-before-response');
  });

  it('TemplePage abre revisão para lifecycle resting', async () => {
    useAthanorStore.setState({
      activeMission: createMission(2),
      inventory: [createLamp('resting')]
    });
    renderTemple();

    expect(screen.getByText('Ciclo em repouso')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Retomar revisão/i }));

    await expectRoute('/review/clear-word-lamp');
  });

  it('TemplePage abre a Biblioteca quando a Primeira Obra está integrada', async () => {
    useAthanorStore.setState({
      activeMission: createMission(2),
      inventory: [createLamp('integrated')]
    });
    renderTemple();

    expect(screen.getByText('Ciclo integrado')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Visitar a Biblioteca/i }));

    await expectRoute('/temple/proverbs-library');
  });
});
