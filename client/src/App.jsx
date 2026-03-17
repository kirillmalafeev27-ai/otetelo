import React, { useState } from 'react';
import MainMenu from './components/MainMenu.jsx';
import PromptConfig from './components/PromptConfig.jsx';
import GameBoard from './components/GameBoard.jsx';
import ScoreBar from './components/ScoreBar.jsx';
import TaskPanel from './components/TaskPanel.jsx';
import ChainResolver from './components/ChainResolver.jsx';
import GameOverScreen from './components/GameOverScreen.jsx';
import { useGame } from './hooks/useGame.js';
import { GAME_PHASE, MODES } from './utils/constants.js';

const gameScreenStyles = {
  container: {
    width: '100%',
    maxWidth: '700px',
    margin: '0 auto',
    padding: '12px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '24px',
  },
  loadingTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.5rem',
    color: 'var(--player2)',
  },
  loadingBar: {
    width: '200px',
    height: '4px',
    background: 'var(--card-border)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  loadingFill: {
    width: '60%',
    height: '100%',
    background: 'linear-gradient(90deg, var(--player2), var(--player1))',
    borderRadius: '2px',
    animation: 'loadingSlide 1.5s ease infinite',
  },
  backBtn: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    background: 'none',
    border: 'none',
    color: 'var(--text-dim)',
    fontFamily: 'var(--font-heading)',
    fontSize: '0.8rem',
    cursor: 'pointer',
    padding: '8px 12px',
    transition: 'color 0.3s',
  },
};

export default function App() {
  const game = useGame();
  const [selectedMode, setSelectedMode] = useState(null);

  const handleSelectMode = (modeId) => {
    setSelectedMode(modeId);
    game.setMode(modeId);
    game.setGamePhase(GAME_PHASE.PROMPT_CONFIG);
  };

  const handleStart = async (level, config) => {
    await game.startGame(selectedMode, level, config);
  };

  const handleBackToMenu = () => {
    setSelectedMode(null);
    game.setGamePhase(GAME_PHASE.MENU);
  };

  // Menu
  if (game.gamePhase === GAME_PHASE.MENU || game.gamePhase === GAME_PHASE.MODE_SELECT) {
    return (
      <div className="app">
        <MainMenu onSelectMode={handleSelectMode} />
      </div>
    );
  }

  // Config
  if (game.gamePhase === GAME_PHASE.PROMPT_CONFIG || game.gamePhase === GAME_PHASE.LEVEL_SELECT) {
    return (
      <div className="app">
        <PromptConfig
          mode={selectedMode}
          onStart={handleStart}
          onBack={handleBackToMenu}
        />
      </div>
    );
  }

  // Loading
  if (game.gamePhase === GAME_PHASE.LOADING) {
    return (
      <div className="app">
        <div style={gameScreenStyles.loadingContainer}>
          <div style={gameScreenStyles.loadingTitle}>
            Aufgaben werden generiert<span className="loading-dots"></span>
          </div>
          <div style={gameScreenStyles.loadingBar}>
            <div style={gameScreenStyles.loadingFill} />
          </div>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            Claude generiert Grammatikaufgaben...
          </div>
        </div>
      </div>
    );
  }

  // Game Over
  if (game.gamePhase === GAME_PHASE.GAME_OVER) {
    return (
      <div className="app">
        <GameOverScreen
          scores={game.scores}
          winner={game.winner}
          stats={game.stats}
          gameType={game.gameConfig.gameType}
          onPlayAgain={() => handleStart(game.level, game.gameConfig)}
          onMainMenu={handleBackToMenu}
        />
      </div>
    );
  }

  // Game
  const isAnswering = game.gamePhase === GAME_PHASE.ANSWERING || game.gamePhase === GAME_PHASE.CHOOSING_TYPE;
  const isChaining = game.gamePhase === GAME_PHASE.CHAIN_RESOLVING;

  return (
    <div className="app">
      <div style={{ position: 'relative' }}>
        <button
          style={gameScreenStyles.backBtn}
          onClick={handleBackToMenu}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-dim)'; }}
        >
          ← MENÜ
        </button>
      </div>

      <div style={gameScreenStyles.container}>
        <ScoreBar
          scores={game.scores}
          currentPlayer={game.currentPlayer}
          gameType={game.gameConfig.gameType}
        />

        {isChaining && game.mode === MODES.CONJUGATION ? (
          <ChainResolver
            chainFlips={game.chainFlips}
            chainIndex={game.chainIndex}
            boardMeta={game.boardMeta}
            task={game.aiTasks.getNextTask()}
            onAnswer={game.handleChainAnswer}
          />
        ) : (
          <TaskPanel
            mode={game.mode}
            task={isAnswering ? game.currentTask : null}
            gamePhase={game.gamePhase}
            onGenderAnswer={game.handleGenderAnswer}
            onCaseAnswer={game.handleCaseAnswer}
            onConjugationAnswer={game.handleConjugationAnswer}
            onSentenceAnswer={game.handleSentenceAnswer}
            aiAnswer={game.aiAnswer}
            message={game.message}
          />
        )}

        <GameBoard
          board={game.board}
          boardMeta={game.boardMeta}
          validMoves={game.gamePhase === GAME_PHASE.PLAYING ? game.validMoves : []}
          currentPlayer={game.currentPlayer}
          selectedCell={game.selectedCell}
          onCellClick={game.handleCellClick}
          animations={game.animations}
          chainFlips={game.chainFlips}
          chainIndex={game.chainIndex}
        />
      </div>
    </div>
  );
}
