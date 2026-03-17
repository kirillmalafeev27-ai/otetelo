import React, { useState } from 'react';

const styles = {
  container: {
    textAlign: 'center',
  },
  word: {
    fontFamily: 'var(--font-german)',
    fontSize: '2rem',
    color: 'var(--text-bright)',
    marginBottom: '20px',
    fontStyle: 'italic',
  },
  prompt: {
    color: 'var(--text-dim)',
    fontSize: '0.9rem',
    marginBottom: '16px',
  },
  btnGroup: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  genderBtn: {
    padding: '14px 28px',
    fontSize: '1.2rem',
    fontWeight: 700,
    fontFamily: 'var(--font-heading)',
    background: 'var(--btn-bg)',
    border: '2px solid var(--card-border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minWidth: '80px',
  },
  typeGroup: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    marginTop: '16px',
  },
  typeBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    padding: '12px 20px',
    background: 'var(--btn-bg)',
    border: '2px solid var(--card-border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  typeIcon: {
    fontSize: '1.5rem',
  },
  typeName: {
    fontSize: '0.8rem',
    fontFamily: 'var(--font-heading)',
  },
  typeDesc: {
    fontSize: '0.65rem',
    color: 'var(--text-dim)',
  },
  feedback: {
    padding: '8px 16px',
    borderRadius: 'var(--radius)',
    marginBottom: '12px',
    fontWeight: 600,
  },
};

export default function GenderPicker({ task, onAnswer }) {
  const [phase, setPhase] = useState('picking');
  const [feedback, setFeedback] = useState(null);
  const [correct, setCorrect] = useState(null);

  if (!task) return null;

  const handleGenderPick = (gender) => {
    const isCorrect = gender === task.gender;
    setCorrect(isCorrect);
    setFeedback(isCorrect
      ? `Richtig! ${task.gender} ${task.word}`
      : `Falsch! Es heißt: ${task.gender} ${task.word}`);

    if (isCorrect) {
      setPhase('choosingType');
    } else {
      setTimeout(() => {
        onAnswer(gender, null);
      }, 1200);
    }
  };

  const handleTypePick = (type) => {
    onAnswer(task.gender, type);
  };

  return (
    <div style={styles.container}>
      <div style={styles.word}>{task.word}</div>

      {feedback && (
        <div
          style={{
            ...styles.feedback,
            background: correct ? 'rgba(46, 204, 113, 0.15)' : 'rgba(231, 76, 60, 0.15)',
            color: correct ? 'var(--success)' : 'var(--error)',
            border: `1px solid ${correct ? 'var(--success)' : 'var(--error)'}`,
          }}
          className={correct ? 'correct-flash' : 'shake'}
        >
          {feedback}
        </div>
      )}

      {phase === 'picking' && (
        <>
          <div style={styles.prompt}>Welcher Artikel?</div>
          <div style={styles.btnGroup}>
            {['der', 'die', 'das'].map(g => (
              <button
                key={g}
                style={styles.genderBtn}
                onClick={() => handleGenderPick(g)}
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
        </>
      )}

      {phase === 'choosingType' && (
        <>
          <div style={styles.prompt}>Wähle den Typ deiner Figur:</div>
          <div style={styles.typeGroup}>
            <button style={styles.typeBtn} onClick={() => handleTypePick('der')}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff006e'; e.currentTarget.style.boxShadow = '0 0 12px #ff006e44'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <span style={styles.typeIcon}>♦</span>
              <span style={styles.typeName}>der (Ромб)</span>
              <span style={styles.typeDesc}>↑↓←→ прямые</span>
            </button>
            <button style={styles.typeBtn} onClick={() => handleTypePick('die')}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#00d4ff'; e.currentTarget.style.boxShadow = '0 0 12px #00d4ff44'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <span style={styles.typeIcon}>●</span>
              <span style={styles.typeName}>die (Круг)</span>
              <span style={styles.typeDesc}>↗↘↙↖ диагонали</span>
            </button>
            <button style={styles.typeBtn} onClick={() => handleTypePick('das')}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#f39c12'; e.currentTarget.style.boxShadow = '0 0 12px #f39c1244'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <span style={styles.typeIcon}>■</span>
              <span style={styles.typeName}>das (Квадрат)</span>
              <span style={styles.typeDesc}>все 8, макс. 1 вглубь</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
