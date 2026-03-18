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
    letterSpacing: '0.02em',
  },
  tense: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    marginBottom: '18px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
  },
  pronounList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxWidth: '420px',
    margin: '0 auto 18px',
  },
  pronounRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  pronounLabel: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.8rem',
    color: 'var(--player2)',
    width: '80px',
    textAlign: 'right',
    flexShrink: 0,
    letterSpacing: '0.03em',
    opacity: 0.85,
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    fontSize: '1rem',
    fontFamily: 'var(--font-german)',
    background: 'var(--input-bg)',
    backdropFilter: 'blur(4px)',
    border: '1.5px solid var(--input-border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text-bright)',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  statusIcon: {
    width: '26px',
    fontSize: '1rem',
    textAlign: 'center',
    flexShrink: 0,
    transition: 'all 0.4s ease',
  },
  submitBtn: {
    padding: '11px 32px',
    fontSize: '0.9rem',
    fontWeight: 700,
    fontFamily: 'var(--font-heading)',
    letterSpacing: '0.08em',
    background: 'var(--btn-bg)',
    backdropFilter: 'blur(8px)',
    border: '1.5px solid rgba(61, 184, 232, 0.3)',
    borderRadius: 'var(--radius)',
    color: 'var(--player2)',
    cursor: 'pointer',
    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
    marginTop: '6px',
  },
  feedback: {
    padding: '12px 18px',
    borderRadius: 'var(--radius)',
    marginTop: '14px',
    fontWeight: 600,
    fontSize: '0.88rem',
    backdropFilter: 'blur(4px)',
    letterSpacing: '0.02em',
  },
  correction: {
    fontSize: '0.78rem',
    marginTop: '5px',
    opacity: 0.75,
    fontFamily: 'var(--font-german)',
    fontStyle: 'italic',
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
    if (flipPronouns?.length > 0) {
      setTimeout(() => {
        const firstRef = inputRefs.current[flipPronouns[0]];
        if (firstRef) firstRef.focus();
      }, 150);
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
    const newResults = {};
    for (const pronoun of flipPronouns) {
      const userAnswer = (answers[pronoun] || '').trim().toLowerCase();
      const correctForm = (task.conjugation?.[pronoun] || '').toLowerCase();
      newResults[pronoun] = userAnswer === correctForm;
    }
    setResults(newResults);
    setSubmitted(true);

    setTimeout(() => {
      onAnswer(newResults);
    }, 1600);
  };

  const allFilled = flipPronouns.every(p => (answers[p] || '').trim().length > 0);
  const correctCount = Object.values(results).filter(Boolean).length;
  const totalCount = flipPronouns.length;

  return (
    <div style={styles.container}>
      <div style={styles.verb}>{task.verb}</div>
      <div style={styles.tense}>{task.tense}</div>

      <div style={styles.pronounList}>
        {flipPronouns.map((pronoun, idx) => {
          const isCorrect = submitted && results[pronoun];
          const isWrong = submitted && !results[pronoun];

          return (
            <div
              key={pronoun}
              style={{
                ...styles.pronounRow,
                transform: submitted ? (isCorrect ? 'translateX(2px)' : isWrong ? 'translateX(-2px)' : '') : '',
              }}
              className={isWrong ? 'shake' : ''}
            >
              <span style={{
                ...styles.pronounLabel,
                color: submitted
                  ? (isCorrect ? 'var(--success)' : 'var(--error)')
                  : 'var(--player2)',
              }}>
                {pronoun}
              </span>
              <input
                ref={el => { inputRefs.current[pronoun] = el; }}
                style={{
                  ...styles.input,
                  borderColor: submitted
                    ? (isCorrect ? 'rgba(60, 200, 120, 0.4)' : 'rgba(224, 80, 80, 0.4)')
                    : 'var(--input-border)',
                  boxShadow: submitted
                    ? (isCorrect
                      ? '0 0 8px rgba(60, 200, 120, 0.1)'
                      : '0 0 8px rgba(224, 80, 80, 0.1)')
                    : 'none',
                }}
                value={answers[pronoun] || ''}
                onChange={e => handleChange(pronoun, e.target.value)}
                onKeyDown={e => handleKeyDown(e, pronoun, idx)}
                onFocus={e => {
                  if (!submitted) {
                    e.currentTarget.style.borderColor = 'rgba(61, 184, 232, 0.4)';
                    e.currentTarget.style.boxShadow = '0 0 12px rgba(61, 184, 232, 0.08)';
                  }
                }}
                onBlur={e => {
                  if (!submitted) {
                    e.currentTarget.style.borderColor = 'var(--input-border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
                placeholder="..."
                disabled={submitted}
              />
              <span style={{
                ...styles.statusIcon,
                color: isCorrect ? 'var(--success)' : 'var(--error)',
                opacity: submitted ? 1 : 0,
                transform: submitted ? 'scale(1)' : 'scale(0.5)',
              }}>
                {submitted && (isCorrect ? '\u2713' : '\u2717')}
              </span>
            </div>
          );
        })}
      </div>

      {!submitted && (
        <button
          style={{
            ...styles.submitBtn,
            opacity: allFilled ? 1 : 0.4,
            cursor: allFilled ? 'pointer' : 'default',
          }}
          onClick={allFilled ? handleSubmit : undefined}
          onMouseEnter={e => {
            if (allFilled) {
              e.currentTarget.style.background = 'rgba(61, 184, 232, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(61, 184, 232, 0.5)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(61, 184, 232, 0.1)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'var(--btn-bg)';
            e.currentTarget.style.borderColor = 'rgba(61, 184, 232, 0.3)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          PR\u00dcFEN
        </button>
      )}

      {submitted && (
        <div
          style={{
            ...styles.feedback,
            background: correctCount === totalCount
              ? 'rgba(60, 200, 120, 0.08)'
              : correctCount > 0
                ? 'rgba(232, 168, 50, 0.08)'
                : 'rgba(224, 80, 80, 0.08)',
            color: correctCount === totalCount
              ? 'var(--success)'
              : correctCount > 0
                ? 'var(--gold-soft)'
                : 'var(--error)',
            border: `1px solid ${correctCount === totalCount
              ? 'rgba(60, 200, 120, 0.2)'
              : correctCount > 0
                ? 'rgba(232, 168, 50, 0.2)'
                : 'rgba(224, 80, 80, 0.2)'}`,
          }}
          className={correctCount === totalCount ? 'correct-flash' : correctCount === 0 ? 'shake' : ''}
        >
          {correctCount === totalCount
            ? `Alles richtig! ${correctCount}/${totalCount} Figuren werden umgedreht.`
            : correctCount > 0
              ? `${correctCount}/${totalCount} richtig. Nur korrekte Figuren werden umgedreht.`
              : `Alles falsch! Keine Figuren werden umgedreht.`}
          {flipPronouns.filter(p => !results[p]).map(p => (
            <div key={p} style={styles.correction}>
              {p} \u2192 {task.conjugation?.[p]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
