import React from 'react';
import Cell from './Cell.jsx';
import { BOARD_SIZE, COLORS } from '../utils/constants.js';
import { colLabel, rowLabel } from '../utils/helpers.js';

const boardStyles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  boardContainer: {
    display: 'flex',
    gap: 0,
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
    fontSize: '0.7rem',
    color: 'var(--text-dim)',
    padding: '4px 0',
  },
  rowLabels: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '24px',
  },
  rowLabel: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.7rem',
    color: 'var(--text-dim)',
    textAlign: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
    gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
    width: 'min(85vw, 540px)',
    height: 'min(85vw, 540px)',
    border: '2px solid var(--grid)',
    borderRadius: '4px',
    boxShadow: '0 0 20px rgba(0, 255, 136, 0.1)',
    overflow: 'hidden',
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
  );
}
