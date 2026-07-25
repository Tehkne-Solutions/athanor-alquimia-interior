import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { RouteAnnouncer } from './RouteAnnouncer';

describe('RouteAnnouncer', () => {
  it('anuncia a página atual', () => {
    render(<MemoryRouter initialEntries={['/review/clear-word-lamp']}><RouteAnnouncer/></MemoryRouter>);

    expect(screen.getByRole('status')).toHaveTextContent('Revisão da Lâmpada da Palavra Clara');
  });
});
