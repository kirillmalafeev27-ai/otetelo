import React from 'react';

const pieceStyles = {
  container: {
    width: '85%',
    height: '85%',
    borderRadius: '50%',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transformStyle: 'preserve-3d',
  },
  marker: {
    fontSize: '10px',
    fontWeight: 700,
    position: 'absolute',
    top: '2px',
    right: '2px',
    lineHeight: 1,
  },
  pronoun: {
    fontSize: '9px',
    fontWeight: 600,
    color: '#fff',
    textShadow: '0 0 4px rgba(0,0,0,0.8)',
    position: 'absolute',
    bottom: '1px',
    left: '50%',
    transform: 'translateX(-50%)',
    whiteSpace: 'nowrap',
  },
  shield: {
    position: 'absolute',
    top: '-4px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '8px',
    display: 'flex',
    gap: '1px',
  },
};

function getShapeStyle(type) {
  if (type === 'der') {
    return { borderRadius: '4px', transform: 'rotate(45deg)', width: '70%', height: '70%' };
  }
  if (type === 'die') {
    return { borderRadius: '50%' };
  }
  if (type === 'das') {
    return { borderRadius: '4px' };
  }
  return { borderRadius: '50%' };
}

export default function Piece({ player, type, shields, pronoun, fragile, dativProtect, isNew, isFlipping }) {
  const isP1 = player === 1;
  const baseColor = isP1
    ? 'radial-gradient(circle at 35% 35%, #2a2a4e, #1a1a2e, #000)'
    : 'radial-gradient(circle at 35% 35%, #ffffff, #e0e0ff, #8888cc)';
  const glowColor = isP1 ? 'var(--player1)' : 'var(--player2)';
  const glowShadow = isP1
    ? '0 0 8px #ff006e88, inset 0 0 4px #ff006e44'
    : '0 0 8px #00d4ff88, inset 0 0 4px #00d4ff44';

  const shapeStyle = type ? getShapeStyle(type) : { borderRadius: '50%' };

  const fragileStyle = fragile ? {
    opacity: 0.7,
    border: '1px dashed var(--error)',
  } : {};

  const shieldStyle = shields > 0 ? {
    border: `2px solid var(--gold)`,
    boxShadow: `${glowShadow}, 0 0 6px var(--gold)`,
  } : {};

  const className = [
    isNew ? 'piece-appear' : '',
    isFlipping ? 'piece-flip' : '',
    shields > 0 ? 'shield-shimmer' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={className}
      style={{
        ...pieceStyles.container,
        ...shapeStyle,
        background: baseColor,
        boxShadow: glowShadow,
        ...shieldStyle,
        ...fragileStyle,
      }}
    >
      {type && (
        <span style={{ ...pieceStyles.marker, color: glowColor }}>
          {type === 'der' ? '♦' : type === 'die' ? '●' : '■'}
        </span>
      )}

      {shields > 0 && (
        <span style={pieceStyles.shield}>
          {Array.from({ length: shields }).map((_, i) => (
            <span key={i} style={{ color: 'var(--gold)' }}>🛡</span>
          ))}
          {dativProtect && <span style={{ color: '#2ecc71', fontSize: '7px' }}>+</span>}
        </span>
      )}

      {pronoun && (
        <span style={pieceStyles.pronoun}>{pronoun}</span>
      )}
    </div>
  );
}
