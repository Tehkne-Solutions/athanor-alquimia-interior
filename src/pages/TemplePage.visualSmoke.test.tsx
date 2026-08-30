import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const temple = {
  id: 'temple-test',
  theme: 'mineral' as const,
  activeRoomId: 'atrium',
  restorationLevel: 1,
  placedItems: [],
  rooms: [
    { roomId: 'atrium', name: 'Átrio da Presença', status: 'active', restorationProgress: 30, placedItemIds: [] },
    { roomId: 'proverbs-library', name: 'Biblioteca dos Provérbios', status: 'available', restorationProgress: 8, placedItemIds: [] },
    { roomId: 'psalms-chamber', name: 'Câmara dos Salmos', status: 'dormant', restorationProgress: 0, placedItemIds: [] },
    { roomId: 'forge', name: 'Forja dos Elementos', status: 'dormant', restorationProgress: 0, placedItemIds: [] },
    { roomId: 'garden', name: 'Jardim Interior', status: 'dormant', restorationProgress: 0, placedItemIds: [] },
    { roomId: 'central-tree', name: 'Árvore Central', status: 'dormant', restorationProgress: 0, placedItemIds: [] }
  ],
  createdAt: '2026-08-30T00:00:00.000Z',
  updatedAt: '2026-08-30T00:00:00.000Z',
  version: '1.2.0'
};

const character = {
  id: 'character-test',
  name: 'Athanor',
  title: 'Escriba',
  origin: 'reader' as const,
  primaryClass: 'scribe' as const,
  appearance: { body: 'body-01', skin: 'skin-03', hair: 'hair-02', garment: 'garment-scribe', accent: 'amber', symbol: 'lamp' },
  workLevel: 'foundation' as const,
  createdAt: '2026-08-30T00:00:00.000Z',
  updatedAt: '2026-08-30T00:00:00.000Z'
};

const athanorState = {
  character,
  temple,
  inventory: [],
  activeMission: undefined,
  waterJourney: undefined,
  reviews: []
};

const progress = undefined;

vi.mock('../state/useAthanorStore', () => ({ useAthanorStore: (selector: (state: typeof athanorState) => unknown) => selector(athanorState) }));
vi.mock('../state/useWaterChaliceStore', () => ({ useWaterChaliceStore: (selector: (state: { progress: typeof progress }) => unknown) => selector({ progress }) }));
vi.mock('../state/useWaterChapterStore', () => ({ useWaterChapterStore: (selector: (state: { progress: typeof progress }) => unknown) => selector({ progress }) }));
vi.mock('../state/useFireMissionStore', () => ({ useFireMissionStore: (selector: (state: { progress: typeof progress }) => unknown) => selector({ progress }) }));
vi.mock('../state/useFireIntervalStore', () => ({ useFireIntervalStore: (selector: (state: { progress: typeof progress }) => unknown) => selector({ progress }) }));
vi.mock('../state/useFireBoundaryStore', () => ({ useFireBoundaryStore: (selector: (state: { progress: typeof progress }) => unknown) => selector({ progress }) }));
vi.mock('../state/useFireCourageStore', () => ({ useFireCourageStore: (selector: (state: { progress: typeof progress }) => unknown) => selector({ progress }) }));
vi.mock('../state/useFireTransformationStore', () => ({ useFireTransformationStore: (selector: (state: { progress: typeof progress }) => unknown) => selector({ progress }) }));
vi.mock('../state/useFireShieldStore', () => ({ useFireShieldStore: (selector: (state: { progress: typeof progress }) => unknown) => selector({ progress }) }));
vi.mock('../state/useFireChapterStore', () => ({ useFireChapterStore: (selector: (state: { progress: typeof progress }) => unknown) => selector({ progress }) }));
vi.mock('../state/useEarthBodyStore', () => ({ useEarthBodyStore: (selector: (state: { progress: typeof progress }) => unknown) => selector({ progress }) }));
vi.mock('../state/useEarthWorkStore', () => ({ useEarthWorkStore: (selector: (state: { progress: typeof progress }) => unknown) => selector({ progress }) }));
vi.mock('../state/useEarthResourcesStore', () => ({ useEarthResourcesStore: (selector: (state: { progress: typeof progress }) => unknown) => selector({ progress }) }));
vi.mock('../state/useEarthRhythmStore', () => ({ useEarthRhythmStore: (selector: (state: { progress: typeof progress }) => unknown) => selector({ progress }) }));
vi.mock('../state/useEarthOrderStore', () => ({ useEarthOrderStore: (selector: (state: { progress: typeof progress }) => unknown) => selector({ progress }) }));
vi.mock('../state/useEarthStoneStore', () => ({ useEarthStoneStore: (selector: (state: { progress: typeof progress }) => unknown) => selector({ progress }) }));
vi.mock('../state/useEarthChapterStore', () => ({ useEarthChapterStore: (selector: (state: { progress: typeof progress }) => unknown) => selector({ progress }) }));

vi.mock('../components/CharacterAvatar', () => ({ CharacterAvatar: () => <div data-testid="character-avatar" /> }));
vi.mock('../components/TempleMap', () => ({ TempleMap: () => <div data-testid="temple-map" /> }));

import { TemplePage } from './TemplePage';

afterEach(() => cleanup());

describe('smoke visual estrutural do Átrio', () => {
  it('mantém a hierarquia visual principal e classes da Sprint 9.1', () => {
    render(<MemoryRouter><TemplePage /></MemoryRouter>);

    expect(document.querySelector('.page--temple')).toBeInTheDocument();
    expect(document.querySelector('.temple-dashboard')).toBeInTheDocument();
    expect(document.querySelector('.hero-card')).toBeInTheDocument();
    expect(document.querySelector('.mission-card')).toBeInTheDocument();
    expect(document.querySelector('.principle-card')).toBeInTheDocument();
    expect(document.querySelector('.safety-summary')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'A Palavra Antes da Resposta' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Mapa do Templo' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Instrumentos da Obra' })).toBeInTheDocument();
  });
});
