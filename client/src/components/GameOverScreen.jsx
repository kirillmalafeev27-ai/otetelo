import React from 'react';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    textAlign: 'center',
  },
  title: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'clamp(1.8rem, 5vw, 3rem)',
    fontWeight: 900,
    marginBottom: '24px',
  },
  scoreBox: {
    display: 'flex',
    gap: '40px',
    marginBottom: '32px',
    justifyContent: 'center',
  },
  playerScore: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  scoreDot: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
  },
  scoreNum: {
    fontFamily: 'var(--font-heading)',
    fontSize: '2.5rem',
    fontWeight: 900,
  },
  playerName: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.9rem',
  },
  statsCard: {
    background: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    marginBottom: '32px',
    width: '100%',
    maxWidth: '400px',
  },
  statsTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1rem',
    color: 'var(--text-dim)',
    marginBottom: '16px',
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid var(--card-border)',
  },
  statLabel: {
    color: 'var(--text)',
  },
  statValue: {
    fontWeight: 600,
  },
  btnGroup: {
    display: 'flex',
    gap: '12px',
  },
};

export default function GameOverScreen({ scores, winner, stats, gameType, onPlayAgain, onMainMenu }) {
  const winnerColor = winner === 1 ? 'var(--player1)' : winner === 2 ? 'var(--player2)' : 'var(--gold)';
  const winnerName = winner === 0 ? 'Unentschieden!' :
    winner === 1 ? 'Schwarz gewinnt!' :
    (gameType === 'pvai' ? 'KI gewinnt!' : 'Weiß gewinnt!');

  const p1Acc = stats[1].correct + stats[1].wrong > 0
    ? Math.round((stats[1].correct / (stats[1].correct + stats[1].wrong)) * 100)
    : 0;
  const p2Acc = stats[2].correct + stats[2].wrong > 0
    ? Math.round((stats[2].correct / (stats[2].correct + stats[2].wrong)) * 100)
    : 0;

  return (
    <div style={styles.container} className="screen slide-up">
      <h1 style={{ ...styles.title, color: winnerColor }} className="neon-flicker">
        {winnerName}
      </h1>

      <div style={styles.scoreBox}>
        <div style={styles.playerScore}>
          <div style={{
            ...styles.scoreDot,
            background: 'radial-gradient(circle, #2a2a4e, #000)',
            border: '3px solid var(--player1)',
            boxShadow: '0 0 15px var(--player1-glow)',
          }} />
          <div style={{ ...styles.scoreNum, color: 'var(--player1)' }}>{scores[1]}</div>
          <div style={{ ...styles.playerName, color: 'var(--player1)' }}>Schwarz</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'var(--font-heading)', color: 'var(--text-dim)', fontSize: '1.5rem' }}>
          :
        </div>

        <div style={styles.playerScore}>
          <div style={{
            ...styles.scoreDot,
            background: 'radial-gradient(circle, #fff, #8888cc)',
            border: '3px solid var(--player2)',
            boxShadow: '0 0 15px var(--player2-glow)',
          }} />
          <div style={{ ...styles.scoreNum, color: 'var(--player2)' }}>{scores[2]}</div>
          <div style={{ ...styles.playerName, color: 'var(--player2)' }}>
            {gameType === 'pvai' ? 'KI' : 'Weiß'}
          </div>
        </div>
      </div>

      <div style={styles.statsCard}>
        <div style={styles.statsTitle}>GRAMMATIK-STATISTIK</div>

        <div style={styles.statRow}>
          <span style={styles.statLabel}>Schwarz — Richtig</span>
          <span style={{ ...styles.statValue, color: 'var(--success)' }}>{stats[1].correct}</span>
        </div>
        <div style={styles.statRow}>
          <span style={styles.statLabel}>Schwarz — Falsch</span>
          <span style={{ ...styles.statValue, color: 'var(--error)' }}>{stats[1].wrong}</span>
        </div>
        <div style={styles.statRow}>
          <span style={styles.statLabel}>Schwarz — Genauigkeit</span>
          <span style={{ ...styles.statValue, color: p1Acc >= 70 ? 'var(--success)' : 'var(--error)' }}>{p1Acc}%</span>
        </div>

        <div style={{ height: '12px' }} />

        <div style={styles.statRow}>
          <span style={styles.statLabel}>{gameType === 'pvai' ? 'KI' : 'Weiß'} — Richtig</span>
          <span style={{ ...styles.statValue, color: 'var(--success)' }}>{stats[2].correct}</span>
        </div>
        <div style={styles.statRow}>
          <span style={styles.statLabel}>{gameType === 'pvai' ? 'KI' : 'Weiß'} — Falsch</span>
          <span style={{ ...styles.statValue, color: 'var(--error)' }}>{stats[2].wrong}</span>
        </div>
        <div style={styles.statRow}>
          <span style={styles.statLabel}>{gameType === 'pvai' ? 'KI' : 'Weiß'} — Genauigkeit</span>
          <span style={{ ...styles.statValue, color: p2Acc >= 70 ? 'var(--success)' : 'var(--error)' }}>{p2Acc}%</span>
        </div>
      </div>

      <div style={styles.btnGroup}>
        <button className="neon-btn" onClick={onMainMenu}>
          Hauptmenü
        </button>
        <button className="neon-btn primary" onClick={onPlayAgain}>
          Nochmal spielen
        </button>
      </div>
    </div>
  );
}
