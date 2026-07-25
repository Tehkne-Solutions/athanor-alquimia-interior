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

interface TempleMapProps {
  temple: AstralTemple;
  onRoomSelect?: (roomId: string) => void;
  unlockedRoomIds?: string[];
}

export function TempleMap({ temple, onRoomSelect, unlockedRoomIds = [] }: TempleMapProps) {
  return (
    <div className="temple-map" aria-label="Mapa do Templo Astral">
      {temple.rooms.map((room) => {
        const Icon = icons[room.roomId as keyof typeof icons] ?? Sparkles;
        const derivedAvailable = unlockedRoomIds.includes(room.roomId) && (room.status === 'dormant' || room.status === 'hidden');
        const effectiveStatus = derivedAvailable ? 'available' : room.status;
        const disabled = effectiveStatus === 'dormant' || effectiveStatus === 'hidden';
        return (
          <button
            key={room.roomId}
            type="button"
            className={`temple-node temple-node--${effectiveStatus}`}
            onClick={() => !disabled && onRoomSelect?.(room.roomId)}
            disabled={disabled}
          >
            <Icon size={22} aria-hidden="true" />
            <span>{room.name}</span>
            <small>{effectiveStatus === 'restored' ? 'Restaurada' : effectiveStatus === 'available' ? 'Disponível' : effectiveStatus === 'active' ? 'Ativa' : 'Adormecida'}</small>
          </button>
        );
      })}
    </div>
  );
}
