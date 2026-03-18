import React, { useState, useRef, useEffect } from 'react';

const styles = {
  container: {
    textAlign: 'center',
  },
  verb: {
    fontFamily: 'var(--font-german)',
    fontSize: '2rem',
    color: 'var(--text-bright)',
    marginBottom: '4px',
    fontStyle: 'italic',
  },
  tense: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.8rem',
    color: 'var(--text-dim)',
    marginBottom: '16px',
  },
  pronounList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxWidth: '420px',
    margin: '0 auto 16px',
  },
  pronounRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  pronounLabel: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.95rem',
    color: 'var(--player2)',
    width: '80px',
    textAlign: 'right',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    padding: '8px 12px',
    fontSize: '1rem',
    fontFamily: 'var(--font-german)',
    background: 'var(--input-bg)',
    border: '2px solid var(--input-border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text-bright)',
  },
  statusIcon: {
    width: '28px',
    fontSize: '1.1rem',
    textAlign: 'center',
    flexShrink: 0,
  },
  submitBtn: {
    padding: '10px 28px',
    fontSize: '1rem',
    fontWeight: 700,
    fontFamily: 'var(--font-heading)',
    background: 'var(--btn-bg)',
    border: '2px solid var(--player2)',
    borderRadius: 'var(--radius)',
    color: 'var(--player2)',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginTop: '8px',
  },
  feedback: {
    padding: '10px 16px',
    borderRadius: 'var(--radius)',
    marginTop: '12px',
    fontWeight: 600,
    fontSize: '0.9rem',
  },
};

export default function ConjugationInput({ task, flipPronouns, onAnswer }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState({});
  const inputRefs = useRef({});

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
    setResults({});
    // Focus first input
    if (flipPronouns?.length > 0) {
      setTimeout(() => {
        const firstRef = inputRefs.current[flipPronouns[0]];
        if (firstRef) firstRef.focus();
      }, 100);
    }
  }, [task, flipPronouns]);

  if (!task || !flipPronouns || flipPronouns.length === 0) return null;

  const handleChange = (pronoun, value) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [pronoun]: value }));
  };

  const handleKeyDown = (e, pronoun, idx) => {
    if (e.key === 'Enter') {
      if (idx < flipPronouns.length - 1) {
        const nextRef = inputRefs.current[flipPronouns[idx + 1]];
        if (nextRef) nextRef.focus();
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = () => {
    if (submitted) return;
    // Check each pronoun's answer
    const newResults = {};
    for (const pronoun of flipPronouns) {
      const userAnswer = (answers[pronoun] || '').trim().toLowerCase();
      const correctForm = (task.conjugation?.[pronoun] || '').toLowerCase();
      newResults[pronoun] = userAnswer === correctForm;
    }
    setResults(newResults);
    setSubmitted(true);

    // Send results back after delay
    setTimeout(() => {
      onAnswer(newResults);
    }, 1500);
  };

  const allFilled = flipPronouns.every(p => (answers[p] || '').trim().length > 0);
  const correctCount = Object.values(results).filter(Boolean).length;
  const totalCount = flipPronouns.length;

  return (
    <div style={styles.container}>
      <div style={styles.verb}>{task.verb}</div>
      <div style={styles.tense}>{task.tense}</div>

      <div style={styles.pronounList}>
        {flipPronouns.map((pronoun, idx) => (
          <div key={pronoun} style={styles.pronounRow}>
            <span style={styles.pronounLabel}>{pronoun}</span>
            <input
              ref={el => { inputRefs.current[pronoun] = el; }}
              style={{
                ...styles.input,
                borderColor: submitted
                  ? (results[pronoun] ? 'var(--success)' : 'var(--error)')
                  : 'var(--input-border)',
              }}
              value={answers[pronoun] || ''}
              onChange={e => handleChange(pronoun, e.target.value)}
              onKeyDown={e => handleKeyDown(e, pronoun, idx)}
              placeholder="..."
              disabled={submitted}
            />
            <span style={styles.statusIcon}>
              {submitted && (results[pronoun] ? '✓' : '✗')}
            </span>
          </div>
        ))}
      </div>

      {!submitted && (
        <button
          style={{
            ...styles.submitBtn,
            opacity: allFilled ? 1 : 0.5,
            cursor: allFilled ? 'pointer' : 'default',
          }}
          onClick={allFilled ? handleSubmit : undefined}
          onMouseEnter={e => { if (allFilled) e.currentTarget.style.background = 'rgba(0,212,255,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--btn-bg)'; }}
        >
          Prüfen
        </button>
      )}

      {submitted && (
        <div
          style={{
            ...styles.feedback,
            background: correctCount === totalCount
              ? 'rgba(46,204,113,0.15)'
              : correctCount > 0
                ? 'rgba(243,156,18,0.15)'
                : 'rgba(231,76,60,0.15)',
            color: correctCount === totalCount
              ? 'var(--success)'
              : correctCount > 0
                ? '#f39c12'
                : 'var(--error)',
            border: `1px solid ${correctCount === totalCount ? 'var(--success)' : correctCount > 0 ? '#f39c12' : 'var(--error)'}`,
          }}
        >
          {correctCount === totalCount
            ? `Alles richtig! ${correctCount}/${totalCount} Figuren werden umgedreht.`
            : correctCount > 0
              ? `${correctCount}/${totalCount} richtig. Nur korrekte Figuren werden umgedreht.`
              : `Alles falsch! Keine Figuren werden umgedreht.`}
          {flipPronouns.filter(p => !results[p]).map(p => (
            <div key={p} style={{ fontSize: '0.8rem', marginTop: '4px', opacity: 0.8 }}>
              {p} → {task.conjugation?.[p]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
