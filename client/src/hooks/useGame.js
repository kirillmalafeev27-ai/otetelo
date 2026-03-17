import { useState, useCallback, useEffect, useRef } from 'react';
import {
  createBoard, createBoardMeta, getValidMoves, getFlips,
  applyMove, getScore, isGameOver, getWinner
} from '../engine/reversi.js';
import { calculateShields, assignPronoun, getRandomPieceType, checkWordOrder } from '../engine/modeRules.js';
import { getAIMove, aiAnswerGrammar } from '../engine/aiPlayer.js';
import { GAME_PHASE, MODES, TIMING } from '../utils/constants.js';
import { delay } from '../utils/helpers.js';
import { useAnimations } from './useAnimations.js';
import { useAITasks } from './useAITasks.js';

export function useGame() {
  const [gamePhase, setGamePhase] = useState(GAME_PHASE.MENU);
  const [board, setBoard] = useState(null);
  const [boardMeta, setBoardMeta] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [selectedCell, setSelectedCell] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [mode, setMode] = useState(null);
  const [level, setLevel] = useState(null);
  const [gameConfig, setGameConfig] = useState({
    gameType: 'pvp',
    aiDifficulty: 'MEDIUM',
    age: 16,
    topic: 'Alltag',
  });
  const [stats, setStats] = useState({ 1: { correct: 0, wrong: 0 }, 2: { correct: 0, wrong: 0 } });
  const [pendingFlips, setPendingFlips] = useState([]);
  const [chainFlips, setChainFlips] = useState([]);
  const [chainIndex, setChainIndex] = useState(0);
  const [aiAnswer, setAiAnswer] = useState(null);
  const [message, setMessage] = useState(null);

  const animations = useAnimations();
  const aiTasks = useAITasks();
  const taskIndexRef = useRef(0);

  const startGame = useCallback(async (selectedMode, selectedLevel, config) => {
    setMode(selectedMode);
    setLevel(selectedLevel);
    setGameConfig(prev => ({ ...prev, ...config }));
    setGamePhase(GAME_PHASE.LOADING);

    const taskCount = selectedMode === MODES.GENDER ? 64 : 30;
    await aiTasks.fetchTasks(selectedMode, selectedLevel, config.age || 16, config.topic || 'Alltag', taskCount);

    const newBoard = createBoard();
    const newMeta = createBoardMeta();
    setBoard(newBoard);
    setBoardMeta(newMeta);
    setCurrentPlayer(1);
    setStats({ 1: { correct: 0, wrong: 0 }, 2: { correct: 0, wrong: 0 } });
    taskIndexRef.current = 0;
    setGamePhase(GAME_PHASE.PLAYING);

    const moves = getValidMoves(newBoard, newMeta, 1, selectedMode);
    setValidMoves(moves);
  }, [aiTasks]);

  const getTask = useCallback(() => {
    return aiTasks.getNextTask();
  }, [aiTasks]);

  const handleCellClick = useCallback((r, c) => {
    if (gamePhase !== GAME_PHASE.PLAYING) return;
    if (animations.animating) return;
    if (!validMoves.some(m => m.r === r && m.c === c)) return;

    setSelectedCell({ r, c });
    const task = getTask();
    setCurrentTask(task);

    if (mode === MODES.CONJUGATION) {
      const pronoun = assignPronoun(boardMeta, r, c);
      setCurrentTask(prev => prev ? { ...prev, assignedPronoun: pronoun } : null);
    }

    setGamePhase(GAME_PHASE.ANSWERING);
  }, [gamePhase, animations.animating, validMoves, getTask, mode, boardMeta]);

  const handleGenderAnswer = useCallback(async (answer, chosenType) => {
    if (!selectedCell || !currentTask) return;
    const { r, c } = selectedCell;
    const correct = answer === currentTask.gender;
    const pieceType = correct ? chosenType : getRandomPieceType();

    setStats(prev => ({
      ...prev,
      [currentPlayer]: {
        ...prev[currentPlayer],
        [correct ? 'correct' : 'wrong']: prev[currentPlayer][correct ? 'correct' : 'wrong'] + 1,
      },
    }));

    const flips = getFlips(board, boardMeta, r, c, currentPlayer, mode, pieceType);
    const meta = { type: pieceType };
    const { board: newBoard, boardMeta: newMeta } = applyMove(board, boardMeta, r, c, currentPlayer, flips, meta);

    setGamePhase(GAME_PHASE.ANIMATING);
    await animations.animatePlacement(r, c);
    setBoard(newBoard);
    setBoardMeta(newMeta);

    if (flips.length > 0) {
      await animations.animateFlips(flips);
    }

    await finishTurn(newBoard, newMeta);
  }, [selectedCell, currentTask, currentPlayer, board, boardMeta, mode, animations]);

  const handleCaseAnswer = useCallback(async (answer) => {
    if (!selectedCell || !currentTask) return;
    const { r, c } = selectedCell;
    const correct = answer === currentTask.answer;
    const shieldData = correct ? calculateShields(currentTask.case) : calculateShields('wrong');

    setStats(prev => ({
      ...prev,
      [currentPlayer]: {
        ...prev[currentPlayer],
        [correct ? 'correct' : 'wrong']: prev[currentPlayer][correct ? 'correct' : 'wrong'] + 1,
      },
    }));

    const flips = getFlips(board, boardMeta, r, c, currentPlayer, mode, null);
    const meta = shieldData;
    const { board: newBoard, boardMeta: newMeta } = applyMove(board, boardMeta, r, c, currentPlayer, flips, meta);

    setGamePhase(GAME_PHASE.ANIMATING);
    await animations.animatePlacement(r, c);
    setBoard(newBoard);
    setBoardMeta(newMeta);

    if (flips.length > 0) {
      await animations.animateFlips(flips);
    }

    await finishTurn(newBoard, newMeta);
  }, [selectedCell, currentTask, currentPlayer, board, boardMeta, mode, animations]);

  const handleConjugationAnswer = useCallback(async (answer) => {
    if (!selectedCell || !currentTask) return;
    const { r, c } = selectedCell;
    const pronoun = currentTask.assignedPronoun;
    const correctForm = currentTask.conjugation?.[pronoun];
    const correct = answer.trim().toLowerCase() === correctForm?.toLowerCase();

    setStats(prev => ({
      ...prev,
      [currentPlayer]: {
        ...prev[currentPlayer],
        [correct ? 'correct' : 'wrong']: prev[currentPlayer][correct ? 'correct' : 'wrong'] + 1,
      },
    }));

    const allFlips = correct ? getFlips(board, boardMeta, r, c, currentPlayer, mode, null) : [];
    const meta = { pronoun };
    const { board: newBoard, boardMeta: newMeta } = applyMove(board, boardMeta, r, c, currentPlayer, allFlips.length >= 3 ? [] : allFlips, meta);

    setGamePhase(GAME_PHASE.ANIMATING);
    await animations.animatePlacement(r, c);
    setBoard(newBoard);
    setBoardMeta(newMeta);

    if (allFlips.length >= 3 && correct) {
      setChainFlips(allFlips);
      setChainIndex(0);
      setGamePhase(GAME_PHASE.CHAIN_RESOLVING);
      return;
    }

    if (allFlips.length > 0 && allFlips.length < 3) {
      await animations.animateFlips(allFlips);
    }

    await finishTurn(newBoard, newMeta);
  }, [selectedCell, currentTask, currentPlayer, board, boardMeta, mode, animations]);

  const handleChainAnswer = useCallback(async (answer, chainTask) => {
    const flip = chainFlips[chainIndex];
    if (!flip || !chainTask) return;

    const pronoun = boardMeta[flip.r][flip.c]?.pronoun || 'ich';
    const correctForm = chainTask.conjugation?.[pronoun];
    const correct = answer.trim().toLowerCase() === correctForm?.toLowerCase();

    if (correct) {
      const newBoard = JSON.parse(JSON.stringify(board));
      const newMeta = JSON.parse(JSON.stringify(boardMeta));
      newBoard[flip.r][flip.c] = { player: currentPlayer };

      animations.highlightChain(chainIndex);
      await delay(TIMING.PIECE_FLIP + TIMING.FLIP_DELAY);

      setBoard(newBoard);
      setBoardMeta(newMeta);

      if (chainIndex + 1 < chainFlips.length) {
        setChainIndex(chainIndex + 1);
      } else {
        animations.clearChainHighlight();
        await finishTurn(newBoard, newMeta);
      }
    } else {
      setMessage({ type: 'error', text: `Kette gebrochen! Richtig: ${correctForm}` });
      animations.clearChainHighlight();
      await delay(1500);
      setMessage(null);
      await finishTurn(board, boardMeta);
    }
  }, [chainFlips, chainIndex, board, boardMeta, currentPlayer, animations]);

  const handleSentenceAnswer = useCallback(async (submittedOrder) => {
    if (!selectedCell || !currentTask) return;
    const { r, c } = selectedCell;
    const result = checkWordOrder(submittedOrder, currentTask.words_correct);

    const correct = result !== 'wrong';
    setStats(prev => ({
      ...prev,
      [currentPlayer]: {
        ...prev[currentPlayer],
        [correct ? 'correct' : 'wrong']: prev[currentPlayer][correct ? 'correct' : 'wrong'] + 1,
      },
    }));

    let flips = [];
    if (result === 'full') {
      flips = getFlips(board, boardMeta, r, c, currentPlayer, mode, null, { bonus: true });
    } else if (result === 'partial') {
      flips = getFlips(board, boardMeta, r, c, currentPlayer, mode, null);
    }

    const { board: newBoard, boardMeta: newMeta } = applyMove(board, boardMeta, r, c, currentPlayer, flips);

    setGamePhase(GAME_PHASE.ANIMATING);
    await animations.animatePlacement(r, c);
    setBoard(newBoard);
    setBoardMeta(newMeta);

    if (flips.length > 0) {
      await animations.animateFlips(flips);
    }

    await finishTurn(newBoard, newMeta);
  }, [selectedCell, currentTask, currentPlayer, board, boardMeta, mode, animations]);

  const finishTurn = useCallback(async (newBoard, newMeta) => {
    await delay(TIMING.TURN_PAUSE);

    const nextPlayer = currentPlayer === 1 ? 2 : 1;
    const nextMoves = getValidMoves(newBoard, newMeta, nextPlayer, mode);

    if (nextMoves.length > 0) {
      setCurrentPlayer(nextPlayer);
      setValidMoves(nextMoves);
      setSelectedCell(null);
      setCurrentTask(null);
      setChainFlips([]);
      setChainIndex(0);
      setGamePhase(GAME_PHASE.PLAYING);

      if (gameConfig.gameType === 'pvai' && nextPlayer === 2) {
        await handleAITurn(newBoard, newMeta, nextPlayer, nextMoves);
      }
    } else {
      const currentMoves = getValidMoves(newBoard, newMeta, currentPlayer, mode);
      if (currentMoves.length > 0) {
        setMessage({ type: 'info', text: `Spieler ${nextPlayer} passt!` });
        setValidMoves(currentMoves);
        setSelectedCell(null);
        setCurrentTask(null);
        setGamePhase(GAME_PHASE.PLAYING);
        await delay(1500);
        setMessage(null);

        if (gameConfig.gameType === 'pvai' && currentPlayer === 2) {
          await handleAITurn(newBoard, newMeta, currentPlayer, currentMoves);
        }
      } else {
        setGamePhase(GAME_PHASE.GAME_OVER);
      }
    }
  }, [currentPlayer, mode, gameConfig]);

  const handleAITurn = useCallback(async (currentBoard, currentMeta, aiPlayer, moves) => {
    setGamePhase(GAME_PHASE.ANIMATING);
    setMessage({ type: 'info', text: 'KI denkt nach...' });

    const thinkTime = TIMING.AI_THINK_MIN + Math.random() * (TIMING.AI_THINK_MAX - TIMING.AI_THINK_MIN);
    await delay(thinkTime);

    const task = getTask();
    const aiResult = aiAnswerGrammar(task, mode, gameConfig.aiDifficulty, currentMeta, 0, 0);
    setAiAnswer({ task, ...aiResult });

    await delay(1000);

    const move = getAIMove(currentBoard, currentMeta, aiPlayer, mode, gameConfig.aiDifficulty);
    if (!move) {
      setMessage(null);
      setAiAnswer(null);
      await finishTurn(currentBoard, currentMeta);
      return;
    }

    setStats(prev => ({
      ...prev,
      [aiPlayer]: {
        ...prev[aiPlayer],
        [aiResult.correct ? 'correct' : 'wrong']: prev[aiPlayer][aiResult.correct ? 'correct' : 'wrong'] + 1,
      },
    }));

    let pieceType = null;
    let flips = [];
    let meta = {};

    if (mode === MODES.GENDER) {
      pieceType = aiResult.correct ? aiResult.pieceType : getRandomPieceType();
      flips = getFlips(currentBoard, currentMeta, move.r, move.c, aiPlayer, mode, pieceType);
      meta = { type: pieceType };
    } else if (mode === MODES.CASE) {
      const shieldData = aiResult.correct ? calculateShields(task?.case || 'Nominativ') : calculateShields('wrong');
      flips = getFlips(currentBoard, currentMeta, move.r, move.c, aiPlayer, mode, null);
      meta = shieldData;
    } else if (mode === MODES.CONJUGATION) {
      const pronoun = assignPronoun(currentMeta, move.r, move.c);
      flips = aiResult.correct ? getFlips(currentBoard, currentMeta, move.r, move.c, aiPlayer, mode, null) : [];
      meta = { pronoun };
    } else if (mode === MODES.SENTENCE) {
      if (aiResult.result === 'full') {
        flips = getFlips(currentBoard, currentMeta, move.r, move.c, aiPlayer, mode, null, { bonus: true });
      } else if (aiResult.result === 'partial') {
        flips = getFlips(currentBoard, currentMeta, move.r, move.c, aiPlayer, mode, null);
      }
    }

    const { board: newBoard, boardMeta: newMeta } = applyMove(currentBoard, currentMeta, move.r, move.c, aiPlayer, flips, meta);

    await animations.animatePlacement(move.r, move.c);
    setBoard(newBoard);
    setBoardMeta(newMeta);

    if (flips.length > 0) {
      await animations.animateFlips(flips);
    }

    setMessage(null);
    setAiAnswer(null);
    await finishTurn(newBoard, newMeta);
  }, [mode, gameConfig, animations, getTask]);

  const scores = board ? getScore(board) : { 1: 2, 2: 2 };
  const winner = board ? getWinner(board) : null;

  return {
    gamePhase, setGamePhase,
    board, boardMeta,
    currentPlayer,
    selectedCell,
    validMoves,
    currentTask,
    mode, level,
    gameConfig, setGameConfig,
    scores, winner, stats,
    message,
    aiAnswer,
    chainFlips, chainIndex,
    animations,
    aiTasks,
    startGame,
    handleCellClick,
    handleGenderAnswer,
    handleCaseAnswer,
    handleConjugationAnswer,
    handleChainAnswer,
    handleSentenceAnswer,
    setMode, setLevel,
  };
}
