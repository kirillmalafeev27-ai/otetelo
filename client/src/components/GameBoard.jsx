import React from 'react';
import Cell from './Cell.jsx';
import { BOARD_SIZE, COLORS } from '../utils/constants.js';
import { colLabel, rowLabel } from '../utils/helpers.js';

const boardStyles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  boardContainer: {
    display: 'flex',
    gap: 0,
    position: 'relative',
  },
  colLabels: {
    display: 'grid',
    gridTemplateColumns: `24px repeat(${BOARD_SIZE}, 1fr)`,
    width: '100%',
    maxWidth: 'min(85vw, 560px)',
  },
  colLabel: {
    textAlign: 'center',
    fontFamily: 'var(--font-heading)',
    fontSize: '0.65rem',
    color: 'var(--text-muted, #4a4a60)',
    padding: '6px 0',
    letterSpacing: '0.05em',
    transition: 'color 0.3s ease',
  },
  rowLabels: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '24px',
  },
  rowLabel: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.65rem',
    color: 'var(--text-muted, #4a4a60)',
    textAlign: 'center',
    letterSpacing: '0.05em',
    transition: 'color 0.3s ease',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
    gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
    width: 'min(85vw, 540px)',
    height: 'min(85vw, 540px)',
    borderRadius: '12px',
    overflow: 'hidden',
    position: 'relative',
    animation: 'boardAmbient 6s ease-in-out infinite',
  },
  boardFrame: {
    position: 'absolute',
    inset: '-1px',
    borderRadius: '13px',
    padding: '1px',
    background: 'linear-gradient(135deg, rgba(61, 184, 232, 0.2) 0%, rgba(100, 140, 255, 0.08) 30%, rgba(232, 54, 93, 0.12) 60%, rgba(61, 184, 232, 0.2) 100%)',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    pointerEvents: 'none',
    backgroundSize: '200% 200%',
    animation: 'gradientShift 8s ease infinite',
  },
};

export default function GameBoard({
  board, boardMeta, validMoves, currentPlayer, selectedCell,
  onCellClick, animations, chainFlips, chainIndex,
}) {
  if (!board) return null;

  const playerColor = currentPlayer === 1 ? COLORS.PLAYER1 : COLORS.PLAYER2;
  const validSet = new Set(validMoves.map(m => `${m.r}-${m.c}`));

  return (
    <div style={boardStyles.wrapper}>
      <div style={boardStyles.colLabels}>
        <div />
        {Array.from({ length: BOARD_SIZE }).map((_, c) => (
          <div key={c} style={boardStyles.colLabel}>{colLabel(c)}</div>
        ))}
      </div>

      <div style={boardStyles.boardContainer}>
        <div style={boardStyles.rowLabels}>
          {Array.from({ length: BOARD_SIZE }).map((_, r) => (
            <div key={r} style={boardStyles.rowLabel}>{rowLabel(r)}</div>
          ))}
        </div>

        <div style={{ position: 'relative' }}>
          {/* Animated gradient border frame */}
          <div style={boardStyles.boardFrame} />

          <div style={boardStyles.grid}>
            {Array.from({ length: BOARD_SIZE }).map((_, r) =>
              Array.from({ length: BOARD_SIZE }).map((_, c) => {
                const key = `${r}-${c}`;
                const isValid = validSet.has(key);
                const isSelected = selectedCell?.r === r && selectedCell?.c === c;
                const isNew = animations.newPiece === key;
                const isFlipping = animations.flippingCells.has(key);
                const chainActive = chainFlips?.some((f, i) => f.r === r && f.c === c && i === chainIndex);

                return (
                  <Cell
                    key={key}
                    piece={board[r][c]}
                    meta={boardMeta[r][c]}
                    isValid={isValid}
                    isSelected={isSelected}
                    playerColor={playerColor}
                    onClick={() => onCellClick(r, c)}
                    isNew={isNew}
                    isFlipping={isFlipping}
                    chainActive={chainActive}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
