import React from 'react';

const pieceStyles = {
  container: {
    width: '82%',
    height: '82%',
    borderRadius: '50%',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transformStyle: 'preserve-3d',
    transition: 'box-shadow 0.4s ease, transform 0.3s ease',
  },
  marker: {
    fontSize: '9px',
    fontWeight: 700,
    position: 'absolute',
    top: '2px',
    right: '3px',
    lineHeight: 1,
    opacity: 0.9,
  },
  pronoun: {
    fontSize: '8px',
    fontWeight: 600,
    letterSpacing: '0.02em',
    color: 'rgba(255, 255, 255, 0.9)',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.6)',
    position: 'absolute',
    bottom: '2px',
    left: '50%',
    transform: 'translateX(-50%)',
    whiteSpace: 'nowrap',
  },
  shield: {
    position: 'absolute',
    top: '-3px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '7px',
    display: 'flex',
    gap: '1px',
  },
};

function getShapeStyle(type) {
  if (type === 'der') {
    return { borderRadius: '4px', transform: 'rotate(45deg)', width: '68%', height: '68%' };
  }
  if (type === 'die') {
    return { borderRadius: '50%' };
  }
  if (type === 'das') {
    return { borderRadius: '5px' };
  }
  return { borderRadius: '50%' };
}

export default function Piece({ player, type, shields, pronoun, fragile, dativProtect, isNew, isFlipping }) {
  const isP1 = player === 1;

  // Premium gradient with glass-like reflections
  const baseColor = isP1
    ? 'radial-gradient(ellipse at 35% 30%, #3a2a4e 0%, #1e1830 40%, #0c0818 100%)'
    : 'radial-gradient(ellipse at 35% 30%, #ffffff 0%, #d8d8f0 40%, #a0a0c8 100%)';

  // Subtle specular highlight overlay
  const highlightGradient = isP1
    ? 'radial-gradient(ellipse at 30% 25%, rgba(255, 255, 255, 0.12) 0%, transparent 50%)'
    : 'radial-gradient(ellipse at 30% 25%, rgba(255, 255, 255, 0.35) 0%, transparent 50%)';

  const glowColor = isP1 ? 'var(--player1)' : 'var(--player2)';
  const glowShadow = isP1
    ? '0 2px 8px rgba(232, 54, 93, 0.35), inset 0 1px 3px rgba(232, 54, 93, 0.15), 0 0 1px rgba(232, 54, 93, 0.6)'
    : '0 2px 8px rgba(61, 184, 232, 0.35), inset 0 1px 3px rgba(61, 184, 232, 0.15), 0 0 1px rgba(61, 184, 232, 0.6)';

  const shapeStyle = type ? getShapeStyle(type) : { borderRadius: '50%' };

  const fragileStyle = fragile ? {
    opacity: 0.6,
    border: '1px dashed rgba(224, 80, 80, 0.5)',
  } : {};

  const shieldStyle = shields > 0 ? {
    border: '2px solid var(--gold)',
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
      {/* Glass specular highlight */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 'inherit',
        background: highlightGradient,
        pointerEvents: 'none',
      }} />

      {type && (
        <span style={{ ...pieceStyles.marker, color: glowColor }}>
          {type === 'der' ? '♦' : type === 'die' ? '●' : '■'}
        </span>
      )}

      {shields > 0 && (
        <span style={pieceStyles.shield}>
          {Array.from({ length: shields }).map((_, i) => (
            <span key={i} style={{ color: 'var(--gold)' }}>&#x1F6E1;</span>
          ))}
          {dativProtect && <span style={{ color: 'var(--success)', fontSize: '6px' }}>+</span>}
        </span>
      )}

      {pronoun && (
        <span style={pieceStyles.pronoun}>{pronoun}</span>
      )}
    </div>
  );
}
