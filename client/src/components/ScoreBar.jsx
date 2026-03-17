import React from 'react';

const styles = {
  bar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    background: 'var(--card-bg)',
    borderRadius: 'var(--radius)',
    marginBottom: '12px',
    border: '1px solid var(--card-border)',
  },
  player: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  dot: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
  },
  name: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.9rem',
  },
  score: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.4rem',
    fontWeight: 700,
  },
  turn: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.75rem',
    color: 'var(--text-dim)',
    letterSpacing: '0.1em',
  },
  active: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.7rem',
    fontFamily: 'var(--font-heading)',
    letterSpacing: '0.05em',
  },
};

export default function ScoreBar({ scores, currentPlayer, gameType }) {
  const p1Active = currentPlayer === 1;
  const p2Active = currentPlayer === 2;

  return (
    <div style={styles.bar}>
      <div style={styles.player}>
        <div style={{
          ...styles.dot,
          background: 'radial-gradient(circle, #2a2a4e, #000)',
          boxShadow: p1Active ? '0 0 10px var(--player1)' : '0 0 4px var(--player1-glow)',
          border: '2px solid var(--player1)',
        }} />
        <div>
          <div style={{ ...styles.name, color: p1Active ? 'var(--player1)' : 'var(--text-dim)' }}>
            Schwarz
          </div>
          {p1Active && <span style={{ ...styles.active, background: 'var(--player1)', color: '#fff' }}>AM ZUG</span>}
        </div>
        <div style={{ ...styles.score, color: 'var(--player1)' }}>{scores[1]}</div>
      </div>

      <div style={styles.turn}>VS</div>

      <div style={styles.player}>
        <div style={{ ...styles.score, color: 'var(--player2)' }}>{scores[2]}</div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ ...styles.name, color: p2Active ? 'var(--player2)' : 'var(--text-dim)' }}>
            {gameType === 'pvai' ? 'KI' : 'Weiß'}
          </div>
          {p2Active && <span style={{ ...styles.active, background: 'var(--player2)', color: '#000' }}>AM ZUG</span>}
        </div>
        <div style={{
          ...styles.dot,
          background: 'radial-gradient(circle, #fff, #8888cc)',
          boxShadow: p2Active ? '0 0 10px var(--player2)' : '0 0 4px var(--player2-glow)',
          border: '2px solid var(--player2)',
        }} />
      </div>
    </div>
  );
}
