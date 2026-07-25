import { Sparkles } from 'lucide-react';
import type { AthanorCharacter } from '../domain/types';

const classLabels = {
  scribe: 'Escriba', artisan: 'Artesão', guardian: 'Guardião', navigator: 'Navegante', mediator: 'Mediador', pilgrim: 'Peregrino'
} as const;

export function CharacterAvatar({ character, compact = false }: { character: AthanorCharacter; compact?: boolean }) {
  return (
    <div className={`character ${compact ? 'character--compact' : ''}`} aria-label={`Personagem ${character.name}`}>
      <div className="character__halo" aria-hidden="true" />
      <div className="character__figure" data-accent={character.appearance.accent}>
        <div className="character__head" />
        <div className="character__body">
          <Sparkles size={compact ? 18 : 28} aria-hidden="true" />
        </div>
      </div>
      {!compact && (
        <div className="character__caption">
          <strong>{character.name}</strong>
          <span>{character.title} · {classLabels[character.primaryClass]}</span>
        </div>
      )}
    </div>
  );
}
