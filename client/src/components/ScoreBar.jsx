import React from 'react';

const styles = {
  bar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 24px',
    background: 'var(--card-bg)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: 'var(--radius-lg)',
    marginBottom: '14px',
    border: '1px solid var(--card-border)',
    position: 'relative',
    overflow: 'hidden',
  },
  barGlow: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(90deg, rgba(232, 54, 93, 0.04) 0%, transparent 30%, transparent 70%, rgba(61, 184, 232, 0.04) 100%)',
    pointerEvents: 'none',
  },
  player: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    position: 'relative',
    zIndex: 1,
  },
  dot: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  name: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.8rem',
    letterSpacing: '0.06em',
    transition: 'all 0.4s ease',
  },
  score: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.5rem',
    fontWeight: 700,
    transition: 'all 0.3s ease',
    letterSpacing: '0.02em',
  },
  turn: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    letterSpacing: '0.15em',
    position: 'relative',
    zIndex: 1,
  },
  active: {
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '0.6rem',
    fontFamily: 'var(--font-heading)',
    letterSpacing: '0.08em',
    fontWeight: 600,
    display: 'inline-block',
    marginTop: '2px',
    transition: 'all 0.4s ease',
  },
};

export default function ScoreBar({ scores, currentPlayer, gameType }) {
  const p1Active = currentPlayer === 1;
  const p2Active = currentPlayer === 2;

  return (
    <div style={styles.bar}>
      {/* Ambient glow behind the bar */}
      <div style={styles.barGlow} />

      <div style={styles.player}>
        <div style={{
          ...styles.dot,
          background: isP1Gradient(),
          boxShadow: p1Active
            ? '0 0 12px var(--player1-glow), 0 0 4px var(--player1)'
            : '0 0 4px rgba(232, 54, 93, 0.2)',
          border: `1.5px solid ${p1Active ? 'var(--player1)' : 'rgba(232, 54, 93, 0.4)'}`,
          transform: p1Active ? 'scale(1.15)' : 'scale(1)',
        }} />
        <div>
          <div style={{
            ...styles.name,
            color: p1Active ? 'var(--player1-soft)' : 'var(--text-dim)',
          }}>
            Schwarz
          </div>
          {p1Active && (
            <span style={{
              ...styles.active,
              background: 'var(--player1-bg)',
              color: 'var(--player1-soft)',
              border: '1px solid rgba(232, 54, 93, 0.25)',
            }}>
              AM ZUG
            </span>
          )}
        </div>
        <div style={{
          ...styles.score,
          color: p1Active ? 'var(--player1)' : 'rgba(232, 54, 93, 0.5)',
          textShadow: p1Active ? '0 0 12px rgba(232, 54, 93, 0.3)' : 'none',
        }}>
          {scores[1]}
        </div>
      </div>

      <div style={styles.turn}>VS</div>

      <div style={styles.player}>
        <div style={{
          ...styles.score,
          color: p2Active ? 'var(--player2)' : 'rgba(61, 184, 232, 0.5)',
          textShadow: p2Active ? '0 0 12px rgba(61, 184, 232, 0.3)' : 'none',
        }}>
          {scores[2]}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            ...styles.name,
            color: p2Active ? 'var(--player2-soft)' : 'var(--text-dim)',
          }}>
            {gameType === 'pvai' ? 'KI' : 'Wei\u00df'}
          </div>
          {p2Active && (
            <span style={{
              ...styles.active,
              background: 'var(--player2-bg)',
              color: 'var(--player2-soft)',
              border: '1px solid rgba(61, 184, 232, 0.25)',
            }}>
              AM ZUG
            </span>
          )}
        </div>
        <div style={{
          ...styles.dot,
          background: isP2Gradient(),
          boxShadow: p2Active
            ? '0 0 12px var(--player2-glow), 0 0 4px var(--player2)'
            : '0 0 4px rgba(61, 184, 232, 0.2)',
          border: `1.5px solid ${p2Active ? 'var(--player2)' : 'rgba(61, 184, 232, 0.4)'}`,
          transform: p2Active ? 'scale(1.15)' : 'scale(1)',
        }} />
      </div>
    </div>
  );
}

function isP1Gradient() {
  return 'radial-gradient(circle at 35% 35%, #3a2a4e, #1e1830, #0c0818)';
}

function isP2Gradient() {
  return 'radial-gradient(circle at 35% 35%, #ffffff, #d8d8f0, #a0a0c8)';
}
