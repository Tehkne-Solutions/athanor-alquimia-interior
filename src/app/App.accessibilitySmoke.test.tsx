import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../storage/idbStorage', () => ({
  idbStateStorage: {
    getItem: vi.fn(async () => null),
    setItem: vi.fn(async () => undefined),
    removeItem: vi.fn(async () => undefined)
  }
}));

import { App } from './App';
import { useAthanorStore } from '../state/useAthanorStore';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App/>
    </MemoryRouter>
  );
}

describe('smoke de acessibilidade do shell protegido', () => {
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

  it('expõe skip link e landmark principal focável', () => {
    renderAt('/mission/word-before-response');

    const skipLink = screen.getByRole('link', { name: /Ir para o conteúdo principal/i });
    expect(skipLink).toHaveAttribute('href', '#main-content');
    expect(skipLink.tabIndex).toBeGreaterThanOrEqual(0);

    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('id', 'main-content');
    expect(main).toHaveAttribute('tabindex', '-1');
  });

  it('mantém navegação principal nomeada em desktop e mobile', () => {
    renderAt('/mission/word-before-response');

    const navigations = screen.getAllByRole('navigation', { name: /Navegação principal/i });
    expect(navigations).toHaveLength(2);
    expect(screen.getAllByRole('link', { name: 'Jornada' })).toHaveLength(2);
  });

  it('mantém links de navegação semanticamente operáveis por teclado', () => {
    renderAt('/mission/word-before-response');

    const journeyLinks = screen.getAllByRole('link', { name: 'Jornada' });
    for (const link of journeyLinks) {
      expect(link).toHaveAttribute('href', '/mission/word-before-response');
      expect(link.tabIndex).toBeGreaterThanOrEqual(0);
    }
  });

  it('anuncia a rota atual em uma região live', () => {
    renderAt('/mission/word-before-response');

    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveAttribute('aria-atomic', 'true');
    expect(status).toHaveTextContent('Página atual: Missão A Palavra Antes da Resposta');
  });

  it('move o foco para o conteúdo principal depois de uma navegação', async () => {
    renderAt('/mission/word-before-response');

    const main = screen.getByRole('main');
    expect(main).not.toHaveFocus();

    fireEvent.click(screen.getAllByRole('link', { name: 'Inventário' })[0]);

    await waitFor(() => expect(main).toHaveFocus());
    expect(screen.getByRole('status')).toHaveTextContent('Página atual: Inventário');
  });
});
