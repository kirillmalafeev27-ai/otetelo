import { getValidMoves, getFlips, applyMove, getScore } from './reversi.js';
import { BOARD_SIZE, MODES, AI_ACCURACY, PRONOUNS } from '../utils/constants.js';
import { randomChoice } from '../utils/helpers.js';
import { getRandomPieceType, assignPronoun, calculateShields } from './modeRules.js';

const CORNER_BONUS = 25;
const EDGE_BONUS = 5;
const SHIELD_BONUS = 3;
const FRAGILE_PENALTY = -5;

function isCorner(r, c) {
  return (r === 0 || r === BOARD_SIZE - 1) && (c === 0 || c === BOARD_SIZE - 1);
}

function isEdge(r, c) {
  return r === 0 || r === BOARD_SIZE - 1 || c === 0 || c === BOARD_SIZE - 1;
}

function evaluateBoard(board, boardMeta, player, mode) {
  const score = getScore(board);
  const opponent = player === 1 ? 2 : 1;
  let value = (score[player] - score[opponent]) * 2;

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (!board[r][c]) continue;
      const isOurs = board[r][c].player === player;
      const meta = boardMeta[r][c];
      const sign = isOurs ? 1 : -1;

      if (isCorner(r, c)) value += CORNER_BONUS * sign;
      else if (isEdge(r, c)) value += EDGE_BONUS * sign;

      if (mode === MODES.CASE) {
        value += meta.shields * SHIELD_BONUS * sign;
        if (meta.fragile) value += FRAGILE_PENALTY * sign;
        if (meta.dativProtect) value += SHIELD_BONUS * sign;
      }
    }
  }

  const ourMoves = getValidMoves(board, boardMeta, player, mode).length;
  const theirMoves = getValidMoves(board, boardMeta, opponent, mode).length;
  value += (ourMoves - theirMoves) * 1.5;

  return value;
}

function minimax(board, boardMeta, depth, alpha, beta, maximizing, player, mode) {
  const opponent = player === 1 ? 2 : 1;

  if (depth === 0) {
    return { score: evaluateBoard(board, boardMeta, player, mode) };
  }

  const currentPlayer = maximizing ? player : opponent;
  const moves = getValidMoves(board, boardMeta, currentPlayer, mode);

  if (moves.length === 0) {
    const otherMoves = getValidMoves(board, boardMeta, maximizing ? opponent : player, mode);
    if (otherMoves.length === 0) {
      return { score: evaluateBoard(board, boardMeta, player, mode) * 100 };
    }
    return minimax(board, boardMeta, depth - 1, alpha, beta, !maximizing, player, mode);
  }

  let bestMove = moves[0];

  if (maximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const flips = getFlips(board, boardMeta, move.r, move.c, currentPlayer, mode, null);
      const { board: newBoard, boardMeta: newMeta } = applyMove(board, boardMeta, move.r, move.c, currentPlayer, flips);
      const result = minimax(newBoard, newMeta, depth - 1, alpha, beta, false, player, mode);
      if (result.score > maxEval) {
        maxEval = result.score;
        bestMove = move;
      }
      alpha = Math.max(alpha, result.score);
      if (beta <= alpha) break;
    }
    return { score: maxEval, move: bestMove };
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const flips = getFlips(board, boardMeta, move.r, move.c, currentPlayer, mode, null);
      const { board: newBoard, boardMeta: newMeta } = applyMove(board, boardMeta, move.r, move.c, currentPlayer, flips);
      const result = minimax(newBoard, newMeta, depth - 1, alpha, beta, true, player, mode);
      if (result.score < minEval) {
        minEval = result.score;
        bestMove = move;
      }
      beta = Math.min(beta, result.score);
      if (beta <= alpha) break;
    }
    return { score: minEval, move: bestMove };
  }
}

export function getAIMove(board, boardMeta, player, mode, difficulty) {
  const depthMap = { EASY: 2, MEDIUM: 3, HARD: 4 };
  const depth = depthMap[difficulty] || 3;
  const result = minimax(board, boardMeta, depth, -Infinity, Infinity, true, player, mode);
  return result.move || getValidMoves(board, boardMeta, player, mode)[0];
}

export function aiAnswerGrammar(task, mode, difficulty, boardMeta, r, c) {
  const accuracy = AI_ACCURACY[difficulty] || AI_ACCURACY.MEDIUM;
  const isCorrect = Math.random() < accuracy;

  switch (mode) {
    case MODES.GENDER: {
      const correctGender = task.gender;
      if (isCorrect) {
        return { answer: correctGender, correct: true, pieceType: randomChoice(['der', 'die', 'das']) };
      }
      const options = ['der', 'die', 'das'].filter(g => g !== correctGender);
      return { answer: randomChoice(options), correct: false, pieceType: getRandomPieceType() };
    }
    case MODES.CASE: {
      if (isCorrect) {
        const shields = calculateShields(task.case);
        return { answer: task.answer, correct: true, ...shields };
      }
      const wrong = task.options.filter(o => o !== task.answer);
      return { answer: randomChoice(wrong), correct: false, shields: 0, dativProtect: false, fragile: true };
    }
    case MODES.CONJUGATION: {
      const pronoun = assignPronoun(boardMeta, r, c);
      const correctForm = task.conjugation[pronoun];
      if (isCorrect) {
        return { answer: correctForm, correct: true, pronoun };
      }
      return { answer: correctForm + 'e', correct: false, pronoun };
    }
    case MODES.SENTENCE: {
      if (isCorrect) {
        return { answer: task.words_correct, correct: true, result: 'full' };
      }
      return { answer: task.words_shuffled, correct: false, result: 'wrong' };
    }
    default:
      return { answer: null, correct: isCorrect };
  }
}
