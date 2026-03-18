import { useState, useCallback, useEffect, useRef } from 'react';
import {
  createBoard, createBoardMeta, getValidMoves, getFlips,
  applyMove, getScore, isGameOver, getWinner
} from '../engine/reversi.js';
import { calculateShields, assignPronoun, getRandomPieceType, checkWordOrder, ensureUniquePronounsOnFlips } from '../engine/modeRules.js';
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

  // Gender mode: word list state
  const [selectedWordIndex, setSelectedWordIndex] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [usedWords, setUsedWords] = useState(new Set());

  // Conjugation mode: flip pronouns state
  const [conjugationFlips, setConjugationFlips] = useState([]);
  const [conjugationPronouns, setConjugationPronouns] = useState([]);

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
    const newMeta = createBoardMeta(selectedMode);
    setBoard(newBoard);
    setBoardMeta(newMeta);
    setCurrentPlayer(1);
    setStats({ 1: { correct: 0, wrong: 0 }, 2: { correct: 0, wrong: 0 } });
    taskIndexRef.current = 0;
    setSelectedWordIndex(null);
    setSelectedArticle(null);
    setUsedWords(new Set());
    setGamePhase(GAME_PHASE.PLAYING);

    const moves = getValidMoves(newBoard, newMeta, 1, selectedMode);
    setValidMoves(moves);
  }, [aiTasks]);

  const getTask = useCallback(() => {
    return aiTasks.getNextTask();
  }, [aiTasks]);

  // Gender mode: select word from list
  const handleWordSelect = useCallback((index) => {
    if (gamePhase !== GAME_PHASE.PLAYING) return;
    if (usedWords.has(index)) return;
    setSelectedWordIndex(index);
    setSelectedArticle(null);
    setCurrentTask(aiTasks.tasks[index] || null);
  }, [gamePhase, usedWords, aiTasks.tasks]);

  // Gender mode: select article
  const handleArticleSelect = useCallback((article) => {
    if (selectedWordIndex === null) return;
    setSelectedArticle(article);
  }, [selectedWordIndex]);

  // Gender mode: cell click after word + article selected
  const handleGenderCellClick = useCallback(async (r, c) => {
    if (gamePhase !== GAME_PHASE.PLAYING) return;
    if (animations.animating) return;
    if (!validMoves.some(m => m.r === r && m.c === c)) return;

    // For gender mode: need word + article selected first
    if (mode === MODES.GENDER) {
      if (selectedWordIndex === null || selectedArticle === null) return;

      const task = aiTasks.tasks[selectedWordIndex];
      if (!task) return;

      const correct = selectedArticle === task.gender;
      const pieceType = correct ? task.gender : getRandomPieceType();

      setStats(prev => ({
        ...prev,
        [currentPlayer]: {
          ...prev[currentPlayer],
          [correct ? 'correct' : 'wrong']: prev[currentPlayer][correct ? 'correct' : 'wrong'] + 1,
        },
      }));

      // Show feedback
      if (correct) {
        setMessage({ type: 'success', text: `Richtig! ${task.gender} ${task.word}` });
      } else {
        setMessage({ type: 'error', text: `Falsch! Es heißt: ${task.gender} ${task.word}` });
      }

      // Mark word as used
      setUsedWords(prev => new Set([...prev, selectedWordIndex]));

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

      // Clear gender selection state
      setSelectedWordIndex(null);
      setSelectedArticle(null);
      setCurrentTask(null);

      await delay(600);
      setMessage(null);
      await finishTurn(newBoard, newMeta);
      return;
    }

    // Conjugation mode: calculate flips, collect pronouns, show task
    if (mode === MODES.CONJUGATION) {
      const allFlips = getFlips(board, boardMeta, r, c, currentPlayer, mode, null);
      if (allFlips.length === 0) return; // no flips possible

      // Ensure unique pronouns on the flip line
      const uniqueFlips = ensureUniquePronounsOnFlips(allFlips, boardMeta);
      const pronouns = uniqueFlips.map(f => f.pronoun);

      setSelectedCell({ r, c });
      setConjugationFlips(uniqueFlips);
      setConjugationPronouns(pronouns);

      // Pick a task (verb) from the pool
      const task = getTask();
      setCurrentTask(task);
      setGamePhase(GAME_PHASE.ANSWERING);
      return;
    }

    // Other non-gender modes: original behavior
    setSelectedCell({ r, c });
    const task = getTask();
    setCurrentTask(task);

    setGamePhase(GAME_PHASE.ANSWERING);
  }, [gamePhase, animations.animating, validMoves, mode, selectedWordIndex, selectedArticle, aiTasks.tasks, board, boardMeta, currentPlayer, getTask, boardMeta]);

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

  // Conjugation mode: batch answer - results is { pronoun: true/false }
  const handleConjugationAnswer = useCallback(async (results) => {
    if (!selectedCell || !currentTask) return;
    const { r, c } = selectedCell;

    // Count correct/wrong
    const correctCount = Object.values(results).filter(Boolean).length;
    const wrongCount = Object.values(results).filter(v => !v).length;

    setStats(prev => ({
      ...prev,
      [currentPlayer]: {
        ...prev[currentPlayer],
        correct: prev[currentPlayer].correct + correctCount,
        wrong: prev[currentPlayer].wrong + wrongCount,
      },
    }));

    // Only flip pieces where conjugation was correct
    const successFlips = conjugationFlips.filter(f => results[f.pronoun]);

    // Assign a pronoun to the new piece
    const newPronoun = assignPronoun(boardMeta, r, c);
    const meta = { pronoun: newPronoun };
    const { board: newBoard, boardMeta: newMeta } = applyMove(board, boardMeta, r, c, currentPlayer, successFlips, meta);

    setGamePhase(GAME_PHASE.ANIMATING);
    await animations.animatePlacement(r, c);
    setBoard(newBoard);
    setBoardMeta(newMeta);

    if (successFlips.length > 0) {
      await animations.animateFlips(successFlips);
    }

    // Clear conjugation state
    setConjugationFlips([]);
    setConjugationPronouns([]);

    await finishTurn(newBoard, newMeta);
  }, [selectedCell, currentTask, currentPlayer, board, boardMeta, conjugationFlips, animations]);

  // Chain answer kept for backwards compatibility but no longer used by conjugation mode
  const handleChainAnswer = useCallback(async () => {}, []);

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
      setSelectedWordIndex(null);
      setSelectedArticle(null);
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
        setSelectedWordIndex(null);
        setSelectedArticle(null);
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

    // For gender mode AI: pick a random unused word
    let task;
    if (mode === MODES.GENDER) {
      const availableIndices = aiTasks.tasks
        .map((_, i) => i)
        .filter(i => !usedWords.has(i));
      if (availableIndices.length === 0) {
        setMessage(null);
        setAiAnswer(null);
        await finishTurn(currentBoard, currentMeta);
        return;
      }
      const randomIdx = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      task = aiTasks.tasks[randomIdx];
      setUsedWords(prev => new Set([...prev, randomIdx]));
    } else {
      task = getTask();
    }

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
      // AI: correct → actual gender piece, wrong → random
      pieceType = aiResult.correct ? task.gender : getRandomPieceType();
      flips = getFlips(currentBoard, currentMeta, move.r, move.c, aiPlayer, mode, pieceType);
      meta = { type: pieceType };
    } else if (mode === MODES.CASE) {
      const shieldData = aiResult.correct ? calculateShields(task?.case || 'Nominativ') : calculateShields('wrong');
      flips = getFlips(currentBoard, currentMeta, move.r, move.c, aiPlayer, mode, null);
      meta = shieldData;
    } else if (mode === MODES.CONJUGATION) {
      const allFlips = getFlips(currentBoard, currentMeta, move.r, move.c, aiPlayer, mode, null);
      const uniqueFlips = ensureUniquePronounsOnFlips(allFlips, currentMeta);
      // AI answers each pronoun based on difficulty accuracy
      const accuracy = gameConfig.aiDifficulty === 'EASY' ? 0.7 : gameConfig.aiDifficulty === 'HARD' ? 0.95 : 0.85;
      flips = uniqueFlips.filter(() => Math.random() < accuracy);
      const newPronoun = assignPronoun(currentMeta, move.r, move.c);
      meta = { pronoun: newPronoun };
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
  }, [mode, gameConfig, animations, getTask, aiTasks.tasks, usedWords]);

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
    // Gender mode state
    selectedWordIndex, selectedArticle, usedWords,
    handleWordSelect, handleArticleSelect,
    // Conjugation mode state
    conjugationFlips, conjugationPronouns,
    // Handlers
    startGame,
    handleCellClick: handleGenderCellClick,
    handleGenderAnswer,
    handleCaseAnswer,
    handleConjugationAnswer,
    handleChainAnswer,
    handleSentenceAnswer,
    setMode, setLevel,
  };
}
