import React, { useState } from 'react';
import MainMenu from './components/MainMenu.jsx';
import PromptConfig from './components/PromptConfig.jsx';
import GameBoard from './components/GameBoard.jsx';
import ScoreBar from './components/ScoreBar.jsx';
import TaskPanel from './components/TaskPanel.jsx';

import GameOverScreen from './components/GameOverScreen.jsx';
import WordList from './components/WordList.jsx';
import RulesPanel from './components/RulesPanel.jsx';

import { useGame } from './hooks/useGame.js';
import { GAME_PHASE, MODES } from './utils/constants.js';

const gameScreenStyles = {
  container: {
    width: '100%',
    maxWidth: '700px',
    margin: '0 auto',
    padding: '16px',
  },
  genderLayout: {
    display: 'flex',
    gap: '14px',
    width: '100%',
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '14px',
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
    gap: '28px',
  },
  loadingTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.3rem',
    color: 'var(--player2)',
    letterSpacing: '0.08em',
  },
  loadingBar: {
    width: '220px',
    height: '2px',
    background: 'rgba(100, 140, 255, 0.1)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  loadingFill: {
    width: '60%',
    height: '100%',
    background: 'linear-gradient(90deg, var(--player2), rgba(100, 140, 255, 0.6), var(--player1))',
    borderRadius: '2px',
    animation: 'loadingSlide 1.8s ease infinite',
    backgroundSize: '200% 100%',
  },
  backBtn: {
    position: 'absolute',
    top: '14px',
    left: '14px',
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-heading)',
    fontSize: '0.7rem',
    cursor: 'pointer',
    padding: '8px 14px',
    transition: 'all 0.35s ease',
    letterSpacing: '0.08em',
    borderRadius: 'var(--radius)',
  },
  genderTaskPanel: {
    background: 'var(--card-bg)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid var(--card-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '18px',
    marginBottom: '14px',
    minHeight: '80px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  genderPrompt: {
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    padding: '12px',
    letterSpacing: '0.03em',
  },
  playerIndicator: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.7rem',
    textAlign: 'center',
    padding: '6px 10px',
    marginBottom: '10px',
    borderRadius: '10px',
    letterSpacing: '0.06em',
    backdropFilter: 'blur(4px)',
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
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'rgba(100, 140, 255, 0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none'; }}
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
                  padding: '10px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  letterSpacing: '0.02em',
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
                <div>
                  <div style={{ fontFamily: 'var(--font-german)', fontSize: '1.8rem', color: 'var(--text-bright)', marginBottom: '14px', fontStyle: 'italic' }}>
                    {selectedTask.word}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '12px', letterSpacing: '0.05em' }}>Welcher Artikel?</div>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    {['der', 'die', 'das'].map(g => {
                      const gColor = g === 'der' ? '#e8365d' : g === 'die' ? '#3db8e8' : '#e8a832';
                      return (
                        <button
                          key={g}
                          style={{
                            padding: '10px 24px',
                            fontSize: '1.05rem',
                            fontWeight: 700,
                            fontFamily: 'var(--font-heading)',
                            letterSpacing: '0.04em',
                            background: 'var(--btn-bg)',
                            backdropFilter: 'blur(8px)',
                            border: `1.5px solid var(--card-border)`,
                            borderRadius: 'var(--radius)',
                            color: 'var(--text)',
                            cursor: 'pointer',
                            transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                          }}
                          onClick={() => game.handleArticleSelect(g)}
                          onMouseEnter={e => {
                            e.currentTarget.style.boxShadow = `0 4px 20px ${gColor}18, 0 0 12px ${gColor}10`;
                            e.currentTarget.style.borderColor = `${gColor}60`;
                            e.currentTarget.style.color = gColor;
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.borderColor = 'var(--card-border)';
                            e.currentTarget.style.color = 'var(--text)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : selectedTask && game.selectedArticle !== null ? (
                <div>
                  <div style={{ fontFamily: 'var(--font-german)', fontSize: '1.4rem', color: 'var(--text-bright)', fontStyle: 'italic' }}>
                    <span style={{
                      color: game.selectedArticle === 'der' ? '#e8365d' : game.selectedArticle === 'die' ? '#3db8e8' : '#e8a832',
                      fontWeight: 700,
                    }}>
                      {game.selectedArticle}
                    </span>
                    {' '}{selectedTask.word}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '10px', letterSpacing: '0.03em' }}>
                    W&auml;hle ein Feld auf dem Brett
                  </div>
                </div>
              ) : (
                <div style={gameScreenStyles.genderPrompt}>
                  W&auml;hle ein Wort aus der Liste
                </div>
              )}

              {game.aiAnswer && (
                <div style={{
                  background: 'rgba(61, 184, 232, 0.04)',
                  border: '1px solid rgba(61, 184, 232, 0.12)',
                  borderRadius: 'var(--radius)',
                  padding: '10px 14px',
                  marginTop: '10px',
                  backdropFilter: 'blur(4px)',
                }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.65rem', color: 'var(--player2)', marginBottom: '3px', letterSpacing: '0.1em', opacity: 0.7 }}>KI-ANTWORT:</div>
                  <div style={{
                    fontFamily: 'var(--font-german)',
                    fontSize: '1rem',
                    color: game.aiAnswer.correct ? 'var(--success)' : 'var(--error)',
                  }}>
                    {typeof game.aiAnswer.answer === 'string' ? game.aiAnswer.answer : JSON.stringify(game.aiAnswer.answer)}
                    {game.aiAnswer.correct ? ' \u2713' : ' \u2717'}
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
          conjugationPronouns={game.conjugationPronouns}
        />

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
