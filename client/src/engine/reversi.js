import { BOARD_SIZE, DIRECTIONS, STRAIGHT_DIRS, DIAGONAL_DIRS, MODES } from '../utils/constants.js';
import { inBounds, deepClone } from '../utils/helpers.js';

export function createBoard() {
  const board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
  const mid = BOARD_SIZE / 2;
  board[mid - 1][mid - 1] = { player: 2 };
  board[mid - 1][mid] = { player: 1 };
  board[mid][mid - 1] = { player: 1 };
  board[mid][mid] = { player: 2 };
  return board;
}

export function createBoardMeta() {
  const meta = Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => ({
      type: null,
      shields: 0,
      pronoun: null,
      fragile: false,
      dativProtect: false,
    }))
  );
  return meta;
}

function getDirectionsForMode(mode, pieceType) {
  if (mode === MODES.GENDER) {
    if (pieceType === 'der') return STRAIGHT_DIRS;
    if (pieceType === 'die') return DIAGONAL_DIRS;
    if (pieceType === 'das') return DIRECTIONS;
  }
  return DIRECTIONS;
}

function getMaxDepthForMode(mode, pieceType, bonus) {
  if (mode === MODES.GENDER && pieceType === 'das') return 1;
  if (mode === MODES.SENTENCE && bonus) return Infinity;
  return Infinity;
}

export function getFlips(board, boardMeta, r, c, player, mode, pieceType, options = {}) {
  if (board[r][c] !== null) return [];

  const dirs = getDirectionsForMode(mode, pieceType);
  const maxDepth = getMaxDepthForMode(mode, pieceType, options.bonus);
  const opponent = player === 1 ? 2 : 1;
  const allFlips = [];

  for (const [dr, dc] of dirs) {
    const lineFlips = [];
    let nr = r + dr;
    let nc = c + dc;
    let depth = 0;

    while (inBounds(nr, nc) && board[nr][nc] !== null && depth < maxDepth) {
      const piece = board[nr][nc];
      const meta = boardMeta[nr][nc];

      if (piece.player === opponent) {
        if (mode === MODES.CASE && meta.shields > 0) {
          lineFlips.push({ r: nr, c: nc, shieldHit: true });
          break;
        }
        lineFlips.push({ r: nr, c: nc });
      } else if (piece.player === player) {
        if (lineFlips.length > 0) {
          allFlips.push(...lineFlips.filter(f => !f.shieldHit));
        }
        break;
      }
      nr += dr;
      nc += dc;
      depth++;
    }
  }

  if (mode === MODES.CASE) {
    return filterByShields(allFlips, board, boardMeta, options);
  }

  return allFlips;
}

function filterByShields(flips, board, boardMeta, options) {
  const result = [];
  for (const flip of flips) {
    const meta = boardMeta[flip.r][flip.c];
    if (meta.fragile) {
      result.push(flip);
      continue;
    }
    if (meta.shields > 0) {
      if (!isDativProtected(flip.r, flip.c, board, boardMeta, board[flip.r][flip.c].player)) {
        result.push({ ...flip, reduceShield: true });
      }
    } else {
      if (!isDativProtected(flip.r, flip.c, board, boardMeta, board[flip.r][flip.c].player)) {
        result.push(flip);
      }
    }
  }
  return result;
}

function isDativProtected(r, c, board, boardMeta, player) {
  for (const [dr, dc] of DIRECTIONS) {
    const nr = r + dr;
    const nc = c + dc;
    if (inBounds(nr, nc) && board[nr][nc] !== null && board[nr][nc].player === player) {
      if (boardMeta[nr][nc].dativProtect) {
        return true;
      }
    }
  }
  return false;
}

export function getValidMoves(board, boardMeta, player, mode) {
  const moves = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] !== null) continue;

      if (mode === MODES.GENDER) {
        const types = ['der', 'die', 'das'];
        let hasAny = false;
        for (const t of types) {
          if (getFlips(board, boardMeta, r, c, player, mode, t).length > 0) {
            hasAny = true;
            break;
          }
        }
        if (hasAny) moves.push({ r, c });
      } else {
        if (getFlips(board, boardMeta, r, c, player, mode, null).length > 0) {
          moves.push({ r, c });
        }
      }
    }
  }
  return moves;
}

export function applyMove(board, boardMeta, r, c, player, flips, meta = {}) {
  const newBoard = deepClone(board);
  const newMeta = deepClone(boardMeta);

  newBoard[r][c] = { player };
  newMeta[r][c] = {
    type: meta.type || null,
    shields: meta.shields || 0,
    pronoun: meta.pronoun || null,
    fragile: meta.fragile || false,
    dativProtect: meta.dativProtect || false,
  };

  for (const flip of flips) {
    if (flip.reduceShield) {
      newMeta[flip.r][flip.c].shields--;
      if (newMeta[flip.r][flip.c].shields <= 0) {
        newMeta[flip.r][flip.c].dativProtect = false;
      }
    } else {
      newBoard[flip.r][flip.c] = { player };
    }
  }

  return { board: newBoard, boardMeta: newMeta };
}

export function getScore(board) {
  let p1 = 0, p2 = 0;
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c]?.player === 1) p1++;
      if (board[r][c]?.player === 2) p2++;
    }
  }
  return { 1: p1, 2: p2 };
}

export function isGameOver(board, boardMeta, mode) {
  const m1 = getValidMoves(board, boardMeta, 1, mode);
  const m2 = getValidMoves(board, boardMeta, 2, mode);
  return m1.length === 0 && m2.length === 0;
}

export function getWinner(board) {
  const score = getScore(board);
  if (score[1] > score[2]) return 1;
  if (score[2] > score[1]) return 2;
  return 0;
}
