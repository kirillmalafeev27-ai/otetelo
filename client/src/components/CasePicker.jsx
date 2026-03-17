import React, { useState } from 'react';

const styles = {
  container: {
    textAlign: 'center',
  },
  sentence: {
    fontFamily: 'var(--font-german)',
    fontSize: '1.4rem',
    color: 'var(--text-bright)',
    marginBottom: '8px',
    lineHeight: 1.6,
  },
  caseLabel: {
    color: 'var(--text-dim)',
    fontSize: '0.85rem',
    marginBottom: '16px',
  },
  options: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  optionBtn: {
    padding: '12px 24px',
    fontSize: '1.1rem',
    fontFamily: 'var(--font-german)',
    fontWeight: 600,
    background: 'var(--btn-bg)',
    border: '2px solid var(--card-border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minWidth: '70px',
  },
  feedback: {
    padding: '10px 16px',
    borderRadius: 'var(--radius)',
    marginTop: '12px',
    fontWeight: 600,
    fontSize: '0.95rem',
  },
};

export default function CasePicker({ task, onAnswer }) {
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);

  if (!task) return null;

  const handlePick = (option) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    const isCorrect = option === task.answer;

    setTimeout(() => {
      onAnswer(option);
    }, 1200);
  };

  const isCorrect = selected === task.answer;

  return (
    <div style={styles.container}>
      <div style={styles.sentence}>
        {task.sentence}
      </div>
      <div style={styles.caseLabel}>Wähle die richtige Form:</div>

      <div style={styles.options}>
        {(task.options || []).map((opt, i) => {
          let btnStyle = { ...styles.optionBtn };
          if (answered) {
            if (opt === task.answer) {
              btnStyle.borderColor = 'var(--success)';
              btnStyle.boxShadow = '0 0 12px rgba(46,204,113,0.4)';
              btnStyle.background = 'rgba(46,204,113,0.1)';
            } else if (opt === selected) {
              btnStyle.borderColor = 'var(--error)';
              btnStyle.boxShadow = '0 0 12px rgba(231,76,60,0.4)';
              btnStyle.background = 'rgba(231,76,60,0.1)';
            } else {
              btnStyle.opacity = 0.4;
            }
          }

          return (
            <button
              key={i}
              style={btnStyle}
              className={answered && opt === selected && !isCorrect ? 'shake' : ''}
              onClick={() => handlePick(opt)}
              onMouseEnter={e => {
                if (!answered) {
                  e.currentTarget.style.borderColor = 'var(--player2)';
                  e.currentTarget.style.boxShadow = '0 0 12px var(--player2-glow)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={e => {
                if (!answered) {
                  e.currentTarget.style.borderColor = 'var(--card-border)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          style={{
            ...styles.feedback,
            background: isCorrect ? 'rgba(46,204,113,0.15)' : 'rgba(231,76,60,0.15)',
            color: isCorrect ? 'var(--success)' : 'var(--error)',
            border: `1px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}`,
          }}
        >
          {isCorrect
            ? `Richtig! ${task.case}`
            : `Falsch! Richtig: ${task.answer} (${task.case})`}
          {isCorrect && task.case === 'Dativ' && ' 🛡 + Schutz für Nachbarn!'}
          {isCorrect && task.case === 'Genitiv' && ' 🛡🛡 Doppelter Schutz!'}
          {!isCorrect && ' — Figur ist zerbrechlich!'}
        </div>
      )}
    </div>
  );
}
