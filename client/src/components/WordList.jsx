import React from 'react';

const styles = {
  container: {
    background: 'var(--card-bg)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid var(--card-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '12px',
    maxHeight: '480px',
    overflowY: 'auto',
    position: 'relative',
  },
  title: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    marginBottom: '10px',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '4px',
  },
  word: {
    padding: '6px 4px',
    fontSize: '0.73rem',
    fontFamily: 'var(--font-german)',
    background: 'rgba(14, 14, 40, 0.5)',
    border: '1px solid var(--card-border)',
    borderRadius: '6px',
    color: 'var(--text)',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  wordUsed: {
    opacity: 0.25,
    cursor: 'default',
    textDecoration: 'line-through',
  },
  wordSelected: {
    borderColor: 'rgba(61, 184, 232, 0.4)',
    boxShadow: '0 0 10px rgba(61, 184, 232, 0.12)',
    background: 'rgba(61, 184, 232, 0.08)',
    color: 'var(--text-bright)',
  },
};

export default function WordList({ words, selectedWord, usedWords, onSelect, disabled }) {
  return (
    <div style={styles.container}>
      <div style={styles.title}>W\u00f6rter ({words.length - usedWords.size} \u00fcbrig)</div>
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
                  e.currentTarget.style.borderColor = 'rgba(61, 184, 232, 0.3)';
                  e.currentTarget.style.transform = 'scale(1.04)';
                  e.currentTarget.style.background = 'rgba(61, 184, 232, 0.06)';
                }
              }}
              onMouseLeave={e => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--card-border)';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = 'rgba(14, 14, 40, 0.5)';
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
