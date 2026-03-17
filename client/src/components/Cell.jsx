import React from 'react';
import Piece from './Piece.jsx';

const cellStyles = {
  cell: {
    aspectRatio: '1',
    background: 'var(--board)',
    border: '1px solid var(--grid-line)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'default',
    transition: 'all 0.3s ease',
    position: 'relative',
  },
  valid: {
    cursor: 'pointer',
  },
  validDot: {
    width: '25%',
    height: '25%',
    borderRadius: '50%',
    opacity: 0.6,
    transition: 'all 0.3s',
  },
};

export default function Cell({ piece, meta, isValid, isSelected, playerColor, onClick, isNew, isFlipping, chainActive }) {
  const handleMouseEnter = (e) => {
    if (isValid) {
      e.currentTarget.style.boxShadow = `inset 0 0 15px ${playerColor}44`;
      e.currentTarget.style.transform = 'scale(1.03)';
    }
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.boxShadow = 'none';
    e.currentTarget.style.transform = 'scale(1)';
  };

  const activeBg = chainActive ? 'rgba(46, 204, 113, 0.15)' : isSelected ? 'rgba(0, 212, 255, 0.1)' : undefined;

  return (
    <div
      style={{
        ...cellStyles.cell,
        ...(isValid ? cellStyles.valid : {}),
        background: activeBg || cellStyles.cell.background,
      }}
      onClick={isValid ? onClick : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {piece ? (
        <Piece
          player={piece.player}
          type={meta?.type}
          shields={meta?.shields}
          pronoun={meta?.pronoun}
          fragile={meta?.fragile}
          dativProtect={meta?.dativProtect}
          isNew={isNew}
          isFlipping={isFlipping}
        />
      ) : isValid ? (
        <div
          style={{
            ...cellStyles.validDot,
            background: `radial-gradient(circle, ${playerColor}88, ${playerColor}22)`,
          }}
        />
      ) : null}
    </div>
  );
}
