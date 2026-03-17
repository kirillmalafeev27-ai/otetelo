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
  feedback: {
    padding: '8px 16px',
    borderRadius: 'var(--radius)',
    marginBottom: '12px',
    fontWeight: 600,
  },
  instruction: {
    color: 'var(--text-dim)',
    fontSize: '0.8rem',
    marginTop: '12px',
  },
};

export default function GenderPicker({ task, onAnswer }) {
  const [feedback, setFeedback] = useState(null);
  const [correct, setCorrect] = useState(null);
  const [answered, setAnswered] = useState(false);

  if (!task) return null;

  const handleGenderPick = (gender) => {
    if (answered) return;
    setAnswered(true);

    const isCorrect = gender === task.gender;
    setCorrect(isCorrect);
    setFeedback(isCorrect
      ? `Richtig! ${task.gender} ${task.word}`
      : `Falsch! Es heißt: ${task.gender} ${task.word}`);

    // Correct: piece type = actual gender (the one they strategically chose)
    // Wrong: random piece type (old behavior via onAnswer(gender, null))
    if (isCorrect) {
      setTimeout(() => {
        onAnswer(gender, task.gender);
      }, 800);
    } else {
      setTimeout(() => {
        onAnswer(gender, null);
      }, 1200);
    }
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

      {!answered && (
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
          <div style={styles.instruction}>
            Выбери клетку на поле после ответа
          </div>
        </>
      )}

      {answered && correct && (
        <div style={styles.instruction}>
          Выбери клетку на поле...
        </div>
      )}
    </div>
  );
}
