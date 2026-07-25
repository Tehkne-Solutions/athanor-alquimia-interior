import { BookOpenText, Flame, Flower2, LibraryBig, Sparkles, TreePine } from 'lucide-react';
import type { AstralTemple } from '../domain/types';

const icons = {
  atrium: Sparkles,
  'proverbs-library': LibraryBig,
  'psalms-chamber': BookOpenText,
  forge: Flame,
  garden: Flower2,
  'central-tree': TreePine
} as const;

export function TempleMap({ temple, onRoomSelect }: { temple: AstralTemple; onRoomSelect?: (roomId: string) => void }) {
  return (
    <div className="temple-map" aria-label="Mapa do Templo Astral">
      {temple.rooms.map((room) => {
        const Icon = icons[room.roomId as keyof typeof icons] ?? Sparkles;
        const disabled = room.status === 'dormant' || room.status === 'hidden';
        return (
          <button
            key={room.roomId}
            type="button"
            className={`temple-node temple-node--${room.status}`}
            onClick={() => !disabled && onRoomSelect?.(room.roomId)}
            disabled={disabled}
          >
            <Icon size={22} aria-hidden="true" />
            <span>{room.name}</span>
            <small>{room.status === 'restored' ? 'Restaurada' : room.status === 'available' ? 'Disponível' : room.status === 'active' ? 'Ativa' : 'Adormecida'}</small>
          </button>
        );
      })}
    </div>
  );
}
