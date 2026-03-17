import React from 'react';

const styles = {
  container: {
    background: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '12px',
    maxHeight: '480px',
    overflowY: 'auto',
  },
  title: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.8rem',
    color: 'var(--text-dim)',
    marginBottom: '8px',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '4px',
  },
  word: {
    padding: '6px 4px',
    fontSize: '0.75rem',
    fontFamily: 'var(--font-german)',
    background: 'var(--btn-bg)',
    border: '1px solid var(--card-border)',
    borderRadius: '4px',
    color: 'var(--text)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  wordUsed: {
    opacity: 0.3,
    cursor: 'default',
    textDecoration: 'line-through',
  },
  wordSelected: {
    borderColor: 'var(--player2)',
    boxShadow: '0 0 8px rgba(0, 212, 255, 0.4)',
    background: 'rgba(0, 212, 255, 0.1)',
    color: 'var(--text-bright)',
  },
};

export default function WordList({ words, selectedWord, usedWords, onSelect, disabled }) {
  return (
    <div style={styles.container}>
      <div style={styles.title}>Wörter ({words.length - usedWords.size} übrig)</div>
      <div style={styles.grid}>
        {words.map((task, i) => {
          const isUsed = usedWords.has(i);
          const isSelected = selectedWord === i;
          return (
            <div
              key={i}
              style={{
                ...styles.word,
                ...(isUsed ? styles.wordUsed : {}),
                ...(isSelected ? styles.wordSelected : {}),
              }}
              onClick={() => {
                if (!isUsed && !disabled) onSelect(i);
              }}
              onMouseEnter={e => {
                if (!isUsed && !disabled) {
                  e.currentTarget.style.borderColor = 'var(--player2)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={e => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--card-border)';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              {task.word}
            </div>
          );
        })}
      </div>
    </div>
  );
}
