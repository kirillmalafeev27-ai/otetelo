import React, { useState, useEffect } from 'react';
import { shuffleArray } from '../utils/helpers.js';

const styles = {
  container: {
    textAlign: 'center',
  },
  prompt: {
    color: 'var(--text-dim)',
    fontSize: '0.9rem',
    marginBottom: '16px',
  },
  wordPool: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '20px',
    minHeight: '50px',
    padding: '12px',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: 'var(--radius)',
    border: '1px dashed var(--card-border)',
  },
  wordCard: {
    padding: '8px 16px',
    fontSize: '1.1rem',
    fontFamily: 'var(--font-german)',
    fontWeight: 600,
    background: 'var(--btn-bg)',
    border: '2px solid var(--card-border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text-bright)',
    cursor: 'grab',
    userSelect: 'none',
    transition: 'all 0.2s ease',
  },
  wordCardDragging: {
    opacity: 0.5,
    transform: 'scale(0.95)',
  },
  dropZone: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    minHeight: '50px',
    padding: '12px',
    background: 'rgba(0, 212, 255, 0.05)',
    borderRadius: 'var(--radius)',
    border: '2px dashed var(--player2-glow)',
    marginBottom: '16px',
  },
  dropPlaceholder: {
    color: 'var(--text-dim)',
    fontSize: '0.85rem',
    alignSelf: 'center',
  },
  placedWord: {
    padding: '8px 16px',
    fontSize: '1.1rem',
    fontFamily: 'var(--font-german)',
    fontWeight: 600,
    background: 'rgba(0, 212, 255, 0.1)',
    border: '2px solid var(--player2)',
    borderRadius: 'var(--radius)',
    color: 'var(--text-bright)',
    cursor: 'pointer',
  },
  btnRow: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
  },
  btn: {
    padding: '10px 24px',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    border: '2px solid',
    borderRadius: 'var(--radius)',
    cursor: 'pointer',
    transition: 'all 0.3s',
    fontSize: '0.9rem',
  },
  feedback: {
    padding: '10px 16px',
    borderRadius: 'var(--radius)',
    marginTop: '12px',
    fontWeight: 600,
  },
};

export default function SentenceBuilder({ task, onAnswer }) {
  const [available, setAvailable] = useState([]);
  const [placed, setPlaced] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [result, setResult] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);

  useEffect(() => {
    if (task?.words_shuffled) {
      setAvailable([...task.words_shuffled]);
      setPlaced([]);
      setAnswered(false);
      setResult(null);
    }
  }, [task]);

  if (!task) return null;

  const handleWordClick = (word, index) => {
    if (answered) return;
    setAvailable(prev => prev.filter((_, i) => i !== index));
    setPlaced(prev => [...prev, word]);
  };

  const handlePlacedClick = (word, index) => {
    if (answered) return;
    setPlaced(prev => prev.filter((_, i) => i !== index));
    setAvailable(prev => [...prev, word]);
  };

  const handleClear = () => {
    if (answered) return;
    setAvailable([...task.words_shuffled]);
    setPlaced([]);
  };

  const handleSubmit = () => {
    if (placed.length === 0 || answered) return;
    setAnswered(true);

    const correct = task.words_correct;
    const isExact = placed.length === correct.length && placed.every((w, i) => w === correct[i]);
    const verbInPos2 = placed.length >= 2 && correct.length >= 2 && placed[1] === correct[1];

    let res;
    if (isExact) res = 'full';
    else if (verbInPos2) res = 'partial';
    else res = 'wrong';

    setResult(res);

    setTimeout(() => {
      onAnswer(placed);
    }, 1500);
  };

  return (
    <div style={styles.container}>
      <div style={styles.prompt}>Ordne die Wörter zum richtigen Satz:</div>

      <div style={styles.wordPool}>
        {available.length === 0 && placed.length === 0 ? (
          <span style={styles.dropPlaceholder}>Keine Wörter</span>
        ) : (
          available.map((word, i) => (
            <div
              key={`${word}-${i}`}
              style={{
                ...styles.wordCard,
                ...(dragIndex === i ? styles.wordCardDragging : {}),
              }}
              onClick={() => handleWordClick(word, i)}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--player2)';
                e.currentTarget.style.boxShadow = '0 0 10px var(--player2-glow)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--card-border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {word}
            </div>
          ))
        )}
      </div>

      <div style={{
        ...styles.dropZone,
        borderColor: result === 'full' ? 'var(--success)' :
                     result === 'partial' ? 'var(--gold)' :
                     result === 'wrong' ? 'var(--error)' :
                     'var(--player2-glow)',
        background: result === 'full' ? 'rgba(46,204,113,0.1)' :
                    result === 'partial' ? 'rgba(243,156,18,0.1)' :
                    result === 'wrong' ? 'rgba(231,76,60,0.1)' :
                    'rgba(0, 212, 255, 0.05)',
      }}>
        {placed.length === 0 ? (
          <span style={styles.dropPlaceholder}>← Klicke auf die Wörter, um sie hier einzufügen</span>
        ) : (
          placed.map((word, i) => (
            <div
              key={`placed-${word}-${i}`}
              style={{
                ...styles.placedWord,
                borderColor: answered && result === 'full' ? 'var(--success)' :
                             answered && result === 'wrong' ? 'var(--error)' :
                             'var(--player2)',
              }}
              onClick={() => handlePlacedClick(word, i)}
            >
              {word}
            </div>
          ))
        )}
      </div>

      {!answered && (
        <div style={styles.btnRow}>
          <button
            style={{ ...styles.btn, borderColor: 'var(--text-dim)', color: 'var(--text-dim)', background: 'var(--btn-bg)' }}
            onClick={handleClear}
          >
            Zurücksetzen
          </button>
          <button
            style={{
              ...styles.btn,
              borderColor: 'var(--success)',
              color: 'var(--success)',
              background: 'var(--btn-bg)',
              opacity: placed.length === 0 ? 0.4 : 1,
            }}
            onClick={handleSubmit}
            disabled={placed.length === 0}
          >
            Bestätigen
          </button>
        </div>
      )}

      {answered && (
        <div
          style={{
            ...styles.feedback,
            background: result === 'full' ? 'rgba(46,204,113,0.15)' :
                        result === 'partial' ? 'rgba(243,156,18,0.15)' :
                        'rgba(231,76,60,0.15)',
            color: result === 'full' ? 'var(--success)' :
                   result === 'partial' ? 'var(--gold)' :
                   'var(--error)',
            border: `1px solid ${result === 'full' ? 'var(--success)' : result === 'partial' ? 'var(--gold)' : 'var(--error)'}`,
          }}
          className={result === 'wrong' ? 'shake' : 'correct-flash'}
        >
          {result === 'full' && 'Perfekt! +1 Tiefe Bonus! 🎯'}
          {result === 'partial' && 'Teilweise richtig (Verb auf Position 2) — Normaler Zug'}
          {result === 'wrong' && `Falsch! Richtig: ${task.words_correct.join(' ')}`}
          {result === 'wrong' && ' — Keine Figuren umgedreht!'}
        </div>
      )}
    </div>
  );
}
