import { ArrowRight } from 'lucide-react';
import { chainNodes } from '../content/seed';
import type { SymbolicLayer } from '../domain/types';
import { ProvenanceBadge } from './ProvenanceBadge';

export function SymbolicChain({ enabledLayers }: { enabledLayers: SymbolicLayer[] }) {
  const orderedIds = ['node_bible_proverbs', 'node_prudence_speech', 'node_hod', 'node_air', 'node_aleph', 'node_xun', 'node_magician', 'node_lamp'];
  const nodeMap = new Map(chainNodes.map((node) => [node.id, node]));
  const resolved = orderedIds.map((id) => {
    const node = nodeMap.get(id)!;
    if (node.layer && !enabledLayers.includes(node.layer) && node.fallbackNodeId) return nodeMap.get(node.fallbackNodeId)!;
    return node;
  });
  return (
    <ol className="symbolic-chain">
      {resolved.map((node, index) => (
        <li key={`${node.id}-${index}`} className="symbolic-chain__step">
          <div className="symbolic-chain__node">
            <ProvenanceBadge type={node.provenance.class} />
            <strong>{node.name}</strong>
            <span>{node.description}</span>
          </div>
          {index < resolved.length - 1 && <ArrowRight className="symbolic-chain__arrow" aria-hidden="true" />}
        </li>
      ))}
    </ol>
  );
}
