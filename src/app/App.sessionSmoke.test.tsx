import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';

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

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
      <LocationProbe />
    </MemoryRouter>
  );
}

async function expectRoute(path: string) {
  await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent(path));
}

describe('contrato de primeira sessão', () => {
  beforeEach(() => {
    useAthanorStore.setState({
      initialized: true,
      onboardingCompleted: false,
      character: undefined,
      temple: undefined,
      activeMission: undefined,
      inventory: []
    });
  });

  afterEach(() => {
    cleanup();
    useAthanorStore.setState({
      initialized: false,
      onboardingCompleted: false,
      character: undefined,
      temple: undefined,
      activeMission: undefined,
      inventory: []
    });
  });

  it('leva um novo praticante da raiz para o onboarding', async () => {
    renderAt('/');
    await expectRoute('/welcome');
  });

  it('leva um praticante persistido da raiz para o Templo', async () => {
    useAthanorStore.setState({ onboardingCompleted: true });

    renderAt('/');
    await expectRoute('/temple');
  });

  it('mantém a entrada direta do onboarding determinística', async () => {
    renderAt('/welcome');
    await expectRoute('/welcome');
  });

  it('não permite que uma etapa protegida da Primeira Obra seja acessada sem sessão', async () => {
    renderAt('/mission/word-before-response/chain');
    await expectRoute('/welcome');
  });

  it('mantém o fallback global apontando para a decisão de entrada', async () => {
    renderAt('/rota-inexistente');
    await expectRoute('/welcome');
  });
});
