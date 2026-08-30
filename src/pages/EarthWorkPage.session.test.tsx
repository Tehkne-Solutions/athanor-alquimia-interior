import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../storage/idbStorage', () => ({
  idbStateStorage: {
    getItem: vi.fn(async () => null),
    setItem: vi.fn(async () => undefined),
    removeItem: vi.fn(async () => undefined)
  }
}));

import { EarthWorkPage } from './EarthWorkPage';
import { useEarthBodyStore } from '../state/useEarthBodyStore';
import { useEarthWorkStore } from '../state/useEarthWorkStore';
import { earthWorkEntries } from '../content/earthWork';

const sourceBodyPresenceMarkId = '2026-08-30T12:00:00.000Z';

describe('Primeira Obra · Trabalho que Cabe Hoje', () => {
  beforeEach(() => {
    useEarthBodyStore.setState({
      progress: {
        id: 'mission_body_arrives_first_v1',
        status: 'completed',
        currentStep: 4,
        classifications: {},
        bodyPresenceMarkCreated: true,
        startedAt: sourceBodyPresenceMarkId,
        updatedAt: sourceBodyPresenceMarkId,
        completedAt: sourceBodyPresenceMarkId
      }
    });
    useEarthWorkStore.setState({ progress: undefined });
  });

  afterEach(() => {
    cleanup();
    useEarthWorkStore.setState({ progress: undefined });
    useEarthBodyStore.setState({ progress: undefined });
  });

  it('mantém a missão bloqueada até O Corpo Chega Primeiro', () => {
    useEarthBodyStore.setState({ progress: undefined });
    render(<MemoryRouter><EarthWorkPage /></MemoryRouter>);

    expect(screen.getByText('O trabalho ainda não pode ser decomposto.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Abrir a primeira missão/i })).toBeInTheDocument();
  });

  it('inicia a Primeira Obra e apresenta todas as etapas sem criar ação externa', () => {
    render(<MemoryRouter><EarthWorkPage /></MemoryRouter>);

    fireEvent.click(screen.getByRole('button', { name: /Iniciar missão/i }));

    expect(screen.getByText('1. Distinguir níveis de trabalho')).toBeInTheDocument();
    expect(screen.getByText('2. Escolher um cenário')).toBeInTheDocument();
    expect(screen.getByText('3. Reconhecer capacidade e tempo')).toBeInTheDocument();
    expect(screen.getByText('4. Selecionar a menor unidade suficiente')).toBeInTheDocument();
    expect(screen.getByText('5. Apoios disponíveis')).toBeInTheDocument();
    expect(screen.getByText('6. Escolher o destino')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Criar Semente/i })).toBeDisabled();
  });

  it('permite concluir a Primeira Obra com o caminho mínimo válido', () => {
    render(<MemoryRouter><EarthWorkPage /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: /Iniciar missão/i }));

    fireEvent.click(screen.getByRole('button', { name: /Concluir sem classificar/i }));
    fireEvent.click(screen.getByRole('button', { name: /Canto de mesa fictício/i }));
    fireEvent.click(screen.getByRole('button', { name: /Alguma capacidade disponível/i }));
    fireEvent.click(screen.getByRole('button', { name: /Até 5 minutos/i }));
    fireEvent.click(screen.getByRole('button', { name: /Apenas observar/i }));
    fireEvent.click(screen.getByRole('button', { name: /Temporizador opcional/i }));
    fireEvent.click(screen.getByRole('button', { name: /Fazer o passo pequeno/i }));

    const complete = screen.getByRole('button', { name: /Criar Semente/i });
    expect(complete).toBeEnabled();
    fireEvent.click(complete);

    expect(screen.getByText('Uma Semente foi registrada sem se tornar cobrança.')).toBeInTheDocument();
    expect(useEarthWorkStore.getState().progress?.status).toBe('completed');
    expect(useEarthWorkStore.getState().progress?.firstStepSeedCreated).toBe(true);
    expect(earthWorkEntries.length).toBeGreaterThan(0);
  });
});
