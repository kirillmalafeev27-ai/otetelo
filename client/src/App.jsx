import React, { useState } from 'react';
import MainMenu from './components/MainMenu.jsx';
import PromptConfig from './components/PromptConfig.jsx';
import GameBoard from './components/GameBoard.jsx';
import ScoreBar from './components/ScoreBar.jsx';
import TaskPanel from './components/TaskPanel.jsx';
import ChainResolver from './components/ChainResolver.jsx';
import GameOverScreen from './components/GameOverScreen.jsx';
import WordList from './components/WordList.jsx';
import RulesPanel from './components/RulesPanel.jsx';
import GenderPicker from './components/GenderPicker.jsx';
import { useGame } from './hooks/useGame.js';
import { GAME_PHASE, MODES } from './utils/constants.js';

const gameScreenStyles = {
  container: {
    width: '100%',
    maxWidth: '700px',
    margin: '0 auto',
    padding: '12px',
  },
  genderLayout: {
    display: 'flex',
    gap: '12px',
    width: '100%',
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '12px',
    alignItems: 'flex-start',
  },
  genderLeft: {
    width: '240px',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  genderCenter: {
    flex: 1,
    minWidth: 0,
  },
  genderRight: {
    width: '200px',
    flexShrink: 0,
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
  genderTaskPanel: {
    background: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '16px',
    marginBottom: '12px',
    minHeight: '80px',
    textAlign: 'center',
  },
  genderPrompt: {
    color: 'var(--text-dim)',
    fontSize: '0.9rem',
    padding: '12px',
  },
  playerIndicator: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.75rem',
    textAlign: 'center',
    padding: '6px',
    marginBottom: '8px',
    borderRadius: '4px',
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

  // Gender mode: special 3-column layout
  if (game.mode === MODES.GENDER) {
    const isPlaying = game.gamePhase === GAME_PHASE.PLAYING;
    const isAnimating = game.gamePhase === GAME_PHASE.ANIMATING;
    const showValidMoves = isPlaying && game.selectedArticle !== null;
    const selectedTask = game.selectedWordIndex !== null ? game.aiTasks.tasks[game.selectedWordIndex] : null;

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

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '12px 12px 0' }}>
          <ScoreBar
            scores={game.scores}
            currentPlayer={game.currentPlayer}
            gameType={game.gameConfig.gameType}
          />
        </div>

        <div style={gameScreenStyles.genderLayout}>
          {/* Left: Word List */}
          <div style={gameScreenStyles.genderLeft}>
            <div style={{
              ...gameScreenStyles.playerIndicator,
              background: game.currentPlayer === 1 ? 'rgba(255, 0, 110, 0.15)' : 'rgba(0, 212, 255, 0.15)',
              color: game.currentPlayer === 1 ? 'var(--player1)' : 'var(--player2)',
              border: `1px solid ${game.currentPlayer === 1 ? 'var(--player1)' : 'var(--player2)'}`,
            }}>
              Spieler {game.currentPlayer}
            </div>
            <WordList
              words={game.aiTasks.tasks}
              selectedWord={game.selectedWordIndex}
              usedWords={game.usedWords}
              onSelect={game.handleWordSelect}
              disabled={!isPlaying || game.selectedArticle !== null}
            />
          </div>

          {/* Center: Task + Board */}
          <div style={gameScreenStyles.genderCenter}>
            {/* Task area */}
            <div style={gameScreenStyles.genderTaskPanel}>
              {game.message ? (
                <div style={{
                  padding: '8px',
                  fontWeight: 600,
                  color: game.message.type === 'error' ? 'var(--error)' :
                         game.message.type === 'success' ? 'var(--success)' : 'var(--player2)',
                }}
                className={game.message.type === 'error' ? 'shake' : game.message.type === 'success' ? 'correct-flash' : ''}
                >
                  {game.message.text}
                  {game.message.text.includes('denkt') && (
                    <span className="thinking-dots"><span>.</span><span>.</span><span>.</span></span>
                  )}
                </div>
              ) : selectedTask && game.selectedArticle === null ? (
                /* Word selected, pick article */
                <div>
                  <div style={{ fontFamily: 'var(--font-german)', fontSize: '1.8rem', color: 'var(--text-bright)', marginBottom: '12px', fontStyle: 'italic' }}>
                    {selectedTask.word}
                  </div>
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '10px' }}>Welcher Artikel?</div>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    {['der', 'die', 'das'].map(g => (
                      <button
                        key={g}
                        style={{
                          padding: '10px 24px',
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          fontFamily: 'var(--font-heading)',
                          background: 'var(--btn-bg)',
                          border: '2px solid var(--card-border)',
                          borderRadius: 'var(--radius)',
                          color: 'var(--text)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                        onClick={() => game.handleArticleSelect(g)}
                        onMouseEnter={e => {
                          e.currentTarget.style.boxShadow = `0 0 15px ${g === 'der' ? '#ff006e44' : g === 'die' ? '#00d4ff44' : '#f39c1244'}`;
                          e.currentTarget.style.borderColor = g === 'der' ? '#ff006e' : g === 'die' ? '#00d4ff' : '#f39c12';
                          e.currentTarget.style.transform = 'scale(1.08)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.borderColor = 'var(--card-border)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              ) : selectedTask && game.selectedArticle !== null ? (
                /* Article selected, pick cell */
                <div>
                  <div style={{ fontFamily: 'var(--font-german)', fontSize: '1.4rem', color: 'var(--text-bright)', fontStyle: 'italic' }}>
                    <span style={{
                      color: game.selectedArticle === 'der' ? '#ff006e' : game.selectedArticle === 'die' ? '#00d4ff' : '#f39c12',
                      fontWeight: 700,
                    }}>
                      {game.selectedArticle}
                    </span>
                    {' '}{selectedTask.word}
                  </div>
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '8px' }}>
                    Wähle ein Feld auf dem Brett
                  </div>
                </div>
              ) : (
                <div style={gameScreenStyles.genderPrompt}>
                  Wähle ein Wort aus der Liste
                </div>
              )}

              {game.aiAnswer && (
                <div style={{
                  background: 'rgba(0, 212, 255, 0.05)',
                  border: '1px solid rgba(0, 212, 255, 0.2)',
                  borderRadius: 'var(--radius)',
                  padding: '8px 12px',
                  marginTop: '8px',
                }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.7rem', color: 'var(--player2)', marginBottom: '2px' }}>KI-ANTWORT:</div>
                  <div style={{
                    fontFamily: 'var(--font-german)',
                    fontSize: '1rem',
                    color: game.aiAnswer.correct ? 'var(--success)' : 'var(--error)',
                  }}>
                    {typeof game.aiAnswer.answer === 'string' ? game.aiAnswer.answer : JSON.stringify(game.aiAnswer.answer)}
                    {game.aiAnswer.correct ? ' ✓' : ' ✗'}
                  </div>
                </div>
              )}
            </div>

            <GameBoard
              board={game.board}
              boardMeta={game.boardMeta}
              validMoves={showValidMoves ? game.validMoves : []}
              currentPlayer={game.currentPlayer}
              selectedCell={game.selectedCell}
              onCellClick={game.handleCellClick}
              animations={game.animations}
              chainFlips={game.chainFlips}
              chainIndex={game.chainIndex}
            />
          </div>

          {/* Right: Rules */}
          <div style={gameScreenStyles.genderRight}>
            <RulesPanel />
          </div>
        </div>
      </div>
    );
  }

  // Other modes: original layout
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
