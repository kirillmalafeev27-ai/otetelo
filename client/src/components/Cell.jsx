import React, { useRef } from 'react';
import Piece from './Piece.jsx';

const cellStyles = {
  cell: {
    aspectRatio: '1',
    background: 'var(--board-cell, rgba(10, 10, 30, 0.8))',
    border: '1px solid var(--grid-line)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'default',
    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
    position: 'relative',
    overflow: 'hidden',
  },
  valid: {
    cursor: 'pointer',
  },
};

export default function Cell({ piece, meta, isValid, isSelected, playerColor, onClick, isNew, isFlipping, chainActive }) {
  const cellRef = useRef(null);

  const handleMouseEnter = (e) => {
    if (!isValid) return;
    const cell = e.currentTarget;
    cell.style.background = `radial-gradient(circle at 50% 50%, ${playerColor}10, transparent 70%)`;
    cell.style.boxShadow = `inset 0 0 20px ${playerColor}15, 0 0 8px ${playerColor}08`;
    cell.style.transform = 'scale(1.04)';
    cell.style.zIndex = '2';
    cell.style.borderColor = `${playerColor}30`;
  };

  const handleMouseLeave = (e) => {
    const cell = e.currentTarget;
    cell.style.background = '';
    cell.style.boxShadow = '';
    cell.style.transform = '';
    cell.style.zIndex = '';
    cell.style.borderColor = '';
  };

  const activeBg = chainActive
    ? 'radial-gradient(circle, rgba(60, 200, 120, 0.12), rgba(60, 200, 120, 0.04))'
    : isSelected
      ? `radial-gradient(circle, ${playerColor}12, ${playerColor}04)`
      : undefined;

  const activeShadow = chainActive
    ? 'inset 0 0 16px rgba(60, 200, 120, 0.1)'
    : isSelected
      ? `inset 0 0 16px ${playerColor}10`
      : undefined;

  return (
    <div
      ref={cellRef}
      style={{
        ...cellStyles.cell,
        ...(isValid ? cellStyles.valid : {}),
        ...(activeBg ? { background: activeBg } : {}),
        ...(activeShadow ? { boxShadow: activeShadow } : {}),
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
        <div style={{
          width: '28%',
          height: '28%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${playerColor}55, ${playerColor}15)`,
          boxShadow: `0 0 8px ${playerColor}20`,
          animation: 'validCellBreath 2s ease-in-out infinite',
          position: 'relative',
        }}>
          {/* Ripple ring */}
          <div style={{
            position: 'absolute',
            inset: '-4px',
            borderRadius: '50%',
            border: `1.5px solid ${playerColor}40`,
            animation: 'validCellRing 2s ease-out infinite',
          }} />
        </div>
      ) : null}
    </div>
  );
}
