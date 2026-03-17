import React, { useState, useRef, useEffect } from 'react';

const styles = {
  container: {
    textAlign: 'center',
  },
  verb: {
    fontFamily: 'var(--font-german)',
    fontSize: '2rem',
    color: 'var(--text-bright)',
    marginBottom: '8px',
    fontStyle: 'italic',
  },
  pronoun: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.1rem',
    color: 'var(--player2)',
    marginBottom: '16px',
  },
  inputRow: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '400px',
    margin: '0 auto',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    fontSize: '1.2rem',
    fontFamily: 'var(--font-german)',
    background: 'var(--input-bg)',
    border: '2px solid var(--input-border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text-bright)',
    textAlign: 'center',
  },
  submitBtn: {
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: 700,
    fontFamily: 'var(--font-heading)',
    background: 'var(--btn-bg)',
    border: '2px solid var(--player2)',
    borderRadius: 'var(--radius)',
    color: 'var(--player2)',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  feedback: {
    padding: '10px 16px',
    borderRadius: 'var(--radius)',
    marginTop: '12px',
    fontWeight: 600,
  },
};

export default function ConjugationInput({ task, onAnswer }) {
  const [value, setValue] = useState('');
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [task]);

  if (!task) return null;

  const pronoun = task.assignedPronoun || 'ich';
  const correctForm = task.conjugation?.[pronoun] || '';

  const handleSubmit = () => {
    if (!value.trim() || answered) return;
    const isCorrect = value.trim().toLowerCase() === correctForm.toLowerCase();
    setCorrect(isCorrect);
    setAnswered(true);

    setTimeout(() => {
      onAnswer(value.trim());
    }, 1200);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div style={styles.container}>
      <div style={styles.verb}>{task.verb}</div>
      <div style={styles.pronoun}>{pronoun} ___?</div>

      <div style={styles.inputRow}>
        <input
          ref={inputRef}
          style={{
            ...styles.input,
            borderColor: answered ? (correct ? 'var(--success)' : 'var(--error)') : 'var(--input-border)',
          }}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Konjugierte Form..."
          disabled={answered}
        />
        {!answered && (
          <button
            style={styles.submitBtn}
            onClick={handleSubmit}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--btn-bg)'; }}
          >
            OK
          </button>
        )}
      </div>

      {answered && (
        <div
          style={{
            ...styles.feedback,
            background: correct ? 'rgba(46,204,113,0.15)' : 'rgba(231,76,60,0.15)',
            color: correct ? 'var(--success)' : 'var(--error)',
            border: `1px solid ${correct ? 'var(--success)' : 'var(--error)'}`,
          }}
          className={correct ? 'correct-flash' : 'shake'}
        >
          {correct
            ? `Richtig! ${pronoun} ${correctForm}`
            : `Falsch! Richtig: ${pronoun} ${correctForm}`}
          {!correct && ' — Keine Figuren werden umgedreht!'}
        </div>
      )}
    </div>
  );
}
