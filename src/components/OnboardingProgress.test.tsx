import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OnboardingProgress } from './OnboardingProgress';

describe('OnboardingProgress', () => {
  it('marca a etapa atual semanticamente', () => {
    render(<OnboardingProgress current={2}/>);

    expect(screen.getByRole('navigation', { name: /progresso da fundação/i })).toBeInTheDocument();
    expect(screen.getByText('Templo').closest('li')).toHaveAttribute('aria-current', 'step');
    expect(screen.getByText(/etapa 2 de 3/i)).toBeInTheDocument();
  });
});
