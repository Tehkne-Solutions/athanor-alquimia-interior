const steps = [
  { id: 1, label: 'Personagem' },
  { id: 2, label: 'Templo' },
  { id: 3, label: 'Fontes' }
] as const;

interface OnboardingProgressProps {
  current: 1 | 2 | 3;
}

export function OnboardingProgress({ current }: OnboardingProgressProps) {
  return (
    <nav className="onboarding-progress" aria-label="Progresso da fundação do Templo">
      <ol>
        {steps.map((step) => {
          const state = step.id < current ? 'complete' : step.id === current ? 'current' : 'upcoming';
          return (
            <li key={step.id} className={`onboarding-progress__step onboarding-progress__step--${state}`} aria-current={state === 'current' ? 'step' : undefined}>
              <span aria-hidden="true">{step.id < current ? '✓' : step.id}</span>
              <strong>{step.label}</strong>
            </li>
          );
        })}
      </ol>
      <p className="visually-hidden">Etapa {current} de 3: {steps[current - 1].label}.</p>
    </nav>
  );
}
