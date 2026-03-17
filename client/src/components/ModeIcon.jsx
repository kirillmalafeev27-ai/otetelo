import React from 'react';

export default function ModeIcon({ mode, size = 48 }) {
  const style = { width: size, height: size };

  if (mode === 'gender' || mode === 1) {
    return (
      <svg style={style} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="28" r="10" stroke="#ff006e" strokeWidth="2" fill="none" />
        <line x1="18" y1="38" x2="18" y2="46" stroke="#ff006e" strokeWidth="2" />
        <line x1="14" y1="42" x2="22" y2="42" stroke="#ff006e" strokeWidth="2" />
        <circle cx="32" cy="20" r="10" stroke="#00d4ff" strokeWidth="2" fill="none" />
        <line x1="39" y1="13" x2="44" y2="8" stroke="#00d4ff" strokeWidth="2" />
        <line x1="40" y1="8" x2="44" y2="8" stroke="#00d4ff" strokeWidth="2" />
        <line x1="44" y1="8" x2="44" y2="12" stroke="#00d4ff" strokeWidth="2" />
      </svg>
    );
  }

  if (mode === 'shield' || mode === 2) {
    return (
      <svg style={style} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 4L6 14V24C6 36 24 44 24 44C24 44 42 36 42 24V14L24 4Z"
          stroke="#f39c12" strokeWidth="2" fill="none" />
        <path d="M24 12L12 18V24C12 32 24 38 24 38C24 38 36 32 36 24V18L24 12Z"
          stroke="#f39c12" strokeWidth="1.5" fill="rgba(243,156,18,0.1)" />
        <text x="24" y="28" textAnchor="middle" fill="#f39c12" fontSize="12" fontFamily="Orbitron">K</text>
      </svg>
    );
  }

  if (mode === 'chain' || mode === 3) {
    return (
      <svg style={style} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="18" cy="20" rx="10" ry="7" stroke="#2ecc71" strokeWidth="2" fill="none" transform="rotate(-30 18 20)" />
        <ellipse cx="30" cy="28" rx="10" ry="7" stroke="#2ecc71" strokeWidth="2" fill="none" transform="rotate(-30 30 28)" />
      </svg>
    );
  }

  if (mode === 'puzzle' || mode === 4) {
    return (
      <svg style={style} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="18" height="18" rx="2" stroke="#00d4ff" strokeWidth="2" fill="none" />
        <rect x="26" y="4" width="18" height="18" rx="2" stroke="#ff006e" strokeWidth="2" fill="none" />
        <rect x="4" y="26" width="18" height="18" rx="2" stroke="#f39c12" strokeWidth="2" fill="none" />
        <rect x="26" y="26" width="18" height="18" rx="2" stroke="#2ecc71" strokeWidth="2" fill="none" />
      </svg>
    );
  }

  return null;
}
