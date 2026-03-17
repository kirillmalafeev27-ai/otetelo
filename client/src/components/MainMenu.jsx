import React from 'react';
import ModeIcon from './ModeIcon.jsx';
import { MODE_INFO } from '../utils/constants.js';

const menuStyles = {
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
    fontSize: 'clamp(2rem, 6vw, 4rem)',
    fontWeight: 900,
    textAlign: 'center',
    marginBottom: '12px',
    background: 'linear-gradient(135deg, #00d4ff, #ff006e)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: 'none',
    filter: 'drop-shadow(0 0 20px rgba(0, 212, 255, 0.3))',
  },
  subtitle: {
    color: 'var(--text-dim)',
    fontSize: '1.1rem',
    marginBottom: '48px',
    textAlign: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '20px',
    width: '100%',
    maxWidth: '900px',
  },
  card: {
    background: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '28px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center',
  },
  modeName: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.2rem',
    color: 'var(--text-bright)',
    marginTop: '12px',
    marginBottom: '4px',
  },
  modeSubtitle: {
    color: 'var(--text-dim)',
    fontSize: '0.85rem',
    marginBottom: '12px',
  },
  modeDesc: {
    color: 'var(--text)',
    fontSize: '0.9rem',
    lineHeight: 1.5,
  },
};

export default function MainMenu({ onSelectMode }) {
  const modes = Object.values(MODE_INFO);

  return (
    <div style={menuStyles.container} className="screen">
      <h1 style={menuStyles.title} className="neon-flicker">
        GRAMMATIK REVERSI
      </h1>
      <p style={menuStyles.subtitle}>Lerne Deutsch spielerisch — Wähle einen Modus</p>

      <div style={menuStyles.grid}>
        {modes.map(m => (
          <div
            key={m.id}
            style={menuStyles.card}
            className="card"
            onClick={() => onSelectMode(m.id)}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = m.id === 1 ? '#ff006e' : m.id === 2 ? '#f39c12' : m.id === 3 ? '#2ecc71' : '#00d4ff';
              e.currentTarget.style.boxShadow = `0 0 20px ${m.id === 1 ? '#ff006e33' : m.id === 2 ? '#f39c1233' : m.id === 3 ? '#2ecc7133' : '#00d4ff33'}`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--card-border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <ModeIcon mode={m.icon} size={56} />
            <div style={menuStyles.modeName}>{m.name}</div>
            <div style={menuStyles.modeSubtitle}>{m.subtitle}</div>
            <div style={menuStyles.modeDesc}>{m.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
