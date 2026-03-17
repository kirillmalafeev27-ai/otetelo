import React, { useState } from 'react';
import { MODE_INFO } from '../utils/constants.js';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
  },
  title: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.8rem',
    marginBottom: '8px',
    color: 'var(--text-bright)',
  },
  subtitle: {
    color: 'var(--text-dim)',
    marginBottom: '32px',
  },
  form: {
    background: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '32px',
    width: '100%',
    maxWidth: '480px',
  },
  field: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    color: 'var(--text)',
    fontWeight: 500,
  },
  row: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
  },
  toggleGroup: {
    display: 'flex',
    gap: '8px',
  },
  toggle: {
    flex: 1,
    padding: '10px 16px',
    background: 'var(--input-bg)',
    border: '1px solid var(--input-border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text)',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s',
    fontSize: '14px',
  },
  toggleActive: {
    borderColor: 'var(--player2)',
    boxShadow: '0 0 8px var(--player2-glow)',
    background: 'rgba(0, 212, 255, 0.1)',
  },
  btns: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
  },
};

export default function PromptConfig({ mode, onStart, onBack }) {
  const modeInfo = MODE_INFO[mode];
  const [level, setLevel] = useState('A1');
  const [age, setAge] = useState('16');
  const [topic, setTopic] = useState('');
  const [gameType, setGameType] = useState('pvp');
  const [aiDifficulty, setAiDifficulty] = useState('MEDIUM');
  const [levelIndex, setLevelIndex] = useState(0);

  const handleStart = () => {
    const selectedLevel = modeInfo.levels[levelIndex]?.level || level;
    onStart(selectedLevel, {
      age: Number(age),
      topic: topic || 'Alltag',
      gameType,
      aiDifficulty,
      levelIndex,
    });
  };

  return (
    <div style={styles.container} className="screen slide-up">
      <h2 style={styles.title}>{modeInfo.name}</h2>
      <p style={styles.subtitle}>{modeInfo.subtitle}</p>

      <div style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Spielstufe</label>
          <div style={styles.toggleGroup}>
            {modeInfo.levels.map((l, i) => (
              <div
                key={i}
                style={{ ...styles.toggle, ...(levelIndex === i ? styles.toggleActive : {}) }}
                onClick={() => { setLevelIndex(i); setLevel(l.level); }}
              >
                <div style={{ fontWeight: 600 }}>{l.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: 2 }}>{l.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.row}>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Alter</label>
            <input
              type="number"
              className="neon-input"
              value={age}
              onChange={e => setAge(e.target.value)}
              min="6"
              max="99"
            />
          </div>
          <div style={{ flex: 2 }}>
            <label style={styles.label}>Thema</label>
            <input
              type="text"
              className="neon-input"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="z.B. Schule, Essen, Reisen..."
            />
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Spielmodus</label>
          <div style={styles.toggleGroup}>
            <div
              style={{ ...styles.toggle, ...(gameType === 'pvp' ? styles.toggleActive : {}) }}
              onClick={() => setGameType('pvp')}
            >
              PvP
            </div>
            <div
              style={{ ...styles.toggle, ...(gameType === 'pvai' ? styles.toggleActive : {}) }}
              onClick={() => setGameType('pvai')}
            >
              vs KI
            </div>
          </div>
        </div>

        {gameType === 'pvai' && (
          <div style={styles.field}>
            <label style={styles.label}>KI-Schwierigkeit</label>
            <div style={styles.toggleGroup}>
              {[
                { key: 'EASY', label: 'Leicht (70%)', color: '#2ecc71' },
                { key: 'MEDIUM', label: 'Mittel (85%)', color: '#f39c12' },
                { key: 'HARD', label: 'Schwer (95%)', color: '#e74c3c' },
              ].map(d => (
                <div
                  key={d.key}
                  style={{
                    ...styles.toggle,
                    ...(aiDifficulty === d.key ? { ...styles.toggleActive, borderColor: d.color, boxShadow: `0 0 8px ${d.color}44` } : {}),
                  }}
                  onClick={() => setAiDifficulty(d.key)}
                >
                  {d.label}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={styles.btns}>
          <button className="neon-btn" onClick={onBack} style={{ flex: 1 }}>
            ← Zurück
          </button>
          <button className="neon-btn primary" onClick={handleStart} style={{ flex: 2 }}>
            Spiel starten
          </button>
        </div>
      </div>
    </div>
  );
}
