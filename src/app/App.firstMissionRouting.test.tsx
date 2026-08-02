import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';
import type { CraftedItem, ItemLifecycle, MissionProgress } from '../domain/types';

vi.mock('../storage/idbStorage', () => ({
  idbStateStorage: {
    getItem: vi.fn(async () => null),
    setItem: vi.fn(async () => undefined),
    removeItem: vi.fn(async () => undefined)
  }
}));

import { App } from './App';
import { useAthanorStore } from '../state/useAthanorStore';

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}</output>;
}

function createMission(currentStep: number): MissionProgress {
  return {
    id: 'mission_word_before_response_v1',
    status: 'active',
    currentStep,
    classifications: {},
    startedAt: '2026-08-02T12:00:00.000Z',
    updatedAt: '2026-08-02T12:00:00.000Z'
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
    createdAt: '2026-08-02T12:00:00.000Z',
    updatedAt: '2026-08-02T12:00:00.000Z',
    version: '1.2.0'
  };
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App/>
      <LocationProbe/>
    </MemoryRouter>
  );
}

async function expectRoute(path: string) {
  await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent(path));
}

describe('roteamento integrado da Primeira Obra', () => {
  beforeEach(() => {
    useAthanorStore.setState({
      initialized: true,
      onboardingCompleted: true,
      activeMission: undefined,
      inventory: []
    });
  });

  afterEach(() => {
    cleanup();
    useAthanorStore.setState({
      initialized: false,
      onboardingCompleted: false,
      activeMission: undefined,
      inventory: []
    });
  });

  it('redireciona etapas avançadas para a introdução quando a missão não existe', async () => {
    renderAt('/mission/word-before-response/chain');
    await expectRoute('/mission/word-before-response');
  });

  it('redireciona crafting antecipado para classificação quando a missão está no passo 1', async () => {
    useAthanorStore.setState({ activeMission: createMission(1) });

    renderAt('/crafting/clear-word-lamp');
    await expectRoute('/mission/word-before-response/classification');
  });

  it('redireciona crafting para revisão quando a Lâmpada aguarda retorno', async () => {
    useAthanorStore.setState({
      activeMission: createMission(2),
      inventory: [createLamp('awaiting_review')]
    });

    renderAt('/crafting/clear-word-lamp');
    await expectRoute('/review/clear-word-lamp');
  });

  it('redireciona revisão antecipada para o item quando a Lâmpada ainda está ativa', async () => {
    useAthanorStore.setState({
      activeMission: createMission(2),
      inventory: [createLamp('active')]
    });

    renderAt('/review/clear-word-lamp');
    await expectRoute('/items/clear-word-lamp');
  });

  it('preserva a revisão para lifecycle resting compatível', async () => {
    useAthanorStore.setState({
      activeMission: createMission(2),
      inventory: [createLamp('resting')]
    });

    renderAt('/review/clear-word-lamp');
    await expectRoute('/review/clear-word-lamp');
  });
});
