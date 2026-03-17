import React, { useState, useRef, useEffect } from 'react';

const styles = {
  container: {
    textAlign: 'center',
  },
  header: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.9rem',
    color: 'var(--player2)',
    marginBottom: '12px',
  },
  chain: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  chainPiece: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.65rem',
    fontWeight: 700,
    border: '2px solid var(--card-border)',
    transition: 'all 0.4s',
    color: 'var(--text)',
  },
  active: {
    border: '2px solid var(--success)',
    boxShadow: '0 0 15px rgba(46, 204, 113, 0.5)',
    transform: 'scale(1.2)',
  },
  done: {
    border: '2px solid var(--success)',
    opacity: 0.6,
  },
  broken: {
    border: '2px solid var(--error)',
    opacity: 0.3,
  },
  verb: {
    fontFamily: 'var(--font-german)',
    fontSize: '1.6rem',
    color: 'var(--text-bright)',
    marginBottom: '4px',
    fontStyle: 'italic',
  },
  pronoun: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1rem',
    color: 'var(--player2)',
    marginBottom: '12px',
  },
  inputRow: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    maxWidth: '350px',
    margin: '0 auto',
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    fontSize: '1.1rem',
    fontFamily: 'var(--font-german)',
    background: 'var(--input-bg)',
    border: '2px solid var(--input-border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text-bright)',
    textAlign: 'center',
  },
  btn: {
    padding: '10px 20px',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    background: 'var(--btn-bg)',
    border: '2px solid var(--success)',
    borderRadius: 'var(--radius)',
    color: 'var(--success)',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
};

export default function ChainResolver({ chainFlips, chainIndex, boardMeta, task, onAnswer }) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    setValue('');
    if (inputRef.current) inputRef.current.focus();
  }, [chainIndex]);

  if (!chainFlips || chainFlips.length === 0 || !task) return null;

  const currentFlip = chainFlips[chainIndex];
  if (!currentFlip) return null;

  const pronoun = boardMeta?.[currentFlip.r]?.[currentFlip.c]?.pronoun || 'ich';

  const handleSubmit = () => {
    if (!value.trim()) return;
    onAnswer(value.trim(), task);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        KONJUGATIONSKETTE — {chainIndex + 1} / {chainFlips.length}
      </div>

      <div style={styles.chain}>
        {chainFlips.map((flip, i) => {
          const p = boardMeta?.[flip.r]?.[flip.c]?.pronoun || '?';
          let pieceStyle = { ...styles.chainPiece };
          if (i === chainIndex) pieceStyle = { ...pieceStyle, ...styles.active };
          else if (i < chainIndex) pieceStyle = { ...pieceStyle, ...styles.done };
          else pieceStyle = { ...pieceStyle, opacity: 0.4 };

          return (
            <div key={i} style={pieceStyle}>
              {p.slice(0, 3)}
            </div>
          );
        })}
      </div>

      <div style={styles.verb}>{task.verb}</div>
      <div style={styles.pronoun}>{pronoun} ___?</div>

      <div style={styles.inputRow}>
        <input
          ref={inputRef}
          style={styles.input}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Konjugierte Form..."
        />
        <button style={styles.btn} onClick={handleSubmit}>OK</button>
      </div>
    </div>
  );
}
