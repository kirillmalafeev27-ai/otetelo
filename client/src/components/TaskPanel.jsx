import React, { useState, useEffect } from 'react';
import { MODES, TIMING } from '../utils/constants.js';
import GenderPicker from './GenderPicker.jsx';
import CasePicker from './CasePicker.jsx';
import ConjugationInput from './ConjugationInput.jsx';
import SentenceBuilder from './SentenceBuilder.jsx';

const styles = {
  panel: {
    background: 'var(--card-bg)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid var(--card-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '22px',
    marginBottom: '14px',
    minHeight: '110px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
  },
  panelGlow: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse at 50% 0%, rgba(100, 140, 255, 0.04) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  panelBorder: {
    position: 'absolute',
    inset: 0,
    borderRadius: 'var(--radius-lg)',
    padding: '1px',
    background: 'linear-gradient(135deg, rgba(61, 184, 232, 0.15) 0%, rgba(100, 140, 255, 0.05) 50%, rgba(232, 54, 93, 0.1) 100%)',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    pointerEvents: 'none',
    opacity: 0.5,
  },
  aiPanel: {
    background: 'rgba(61, 184, 232, 0.04)',
    border: '1px solid rgba(61, 184, 232, 0.12)',
    borderRadius: 'var(--radius)',
    padding: '12px 16px',
    marginTop: '14px',
    backdropFilter: 'blur(4px)',
  },
  aiLabel: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.65rem',
    color: 'var(--player2)',
    marginBottom: '4px',
    letterSpacing: '0.1em',
    opacity: 0.7,
  },
  aiAnswer: {
    fontFamily: 'var(--font-german)',
    fontSize: '1.05rem',
  },
  message: {
    textAlign: 'center',
    padding: '16px',
    fontFamily: 'var(--font-heading)',
    fontSize: '0.95rem',
    letterSpacing: '0.03em',
    position: 'relative',
    zIndex: 1,
  },
  placeholder: {
    textAlign: 'center',
    color: 'var(--text-muted)',
    padding: '16px',
    fontSize: '0.85rem',
    letterSpacing: '0.03em',
    position: 'relative',
    zIndex: 1,
  },
};

function TypewriterText({ text, speed = TIMING.TYPEWRITER_SPEED }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayed}</span>;
}

export default function TaskPanel({
  mode, task, gamePhase, onGenderAnswer, onCaseAnswer,
  onConjugationAnswer, onSentenceAnswer, aiAnswer, message,
  conjugationPronouns,
}) {
  if (message) {
    return (
      <div style={styles.panel}>
        <div style={styles.panelGlow} />
        <div style={styles.panelBorder} />
        <div style={{
          ...styles.message,
          color: message.type === 'error' ? 'var(--error)' : message.type === 'info' ? 'var(--player2)' : 'var(--text)',
        }}>
          {message.text}
          {message.text.includes('denkt') && (
            <span className="thinking-dots">
              <span>.</span><span>.</span><span>.</span>
            </span>
          )}
        </div>
      </div>
    );
  }

  if (!task || gamePhase === 'playing' || gamePhase === 'animating') {
    return (
      <div style={styles.panel}>
        <div style={styles.panelGlow} />
        <div style={styles.panelBorder} />
        <div style={styles.placeholder}>
          W\u00e4hle ein Feld auf dem Brett
        </div>
      </div>
    );
  }

  return (
    <div style={styles.panel} className="slide-up">
      <div style={styles.panelGlow} />
      <div style={styles.panelBorder} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {mode === MODES.GENDER && (
          <GenderPicker task={task} onAnswer={onGenderAnswer} />
        )}
        {mode === MODES.CASE && (
          <CasePicker task={task} onAnswer={onCaseAnswer} />
        )}
        {mode === MODES.CONJUGATION && (
          <ConjugationInput task={task} flipPronouns={conjugationPronouns} onAnswer={onConjugationAnswer} />
        )}
        {mode === MODES.SENTENCE && (
          <SentenceBuilder task={task} onAnswer={onSentenceAnswer} />
        )}
      </div>

      {aiAnswer && (
        <div style={styles.aiPanel}>
          <div style={styles.aiLabel}>KI-ANTWORT:</div>
          <div style={{
            ...styles.aiAnswer,
            color: aiAnswer.correct ? 'var(--success)' : 'var(--error)',
          }}>
            {typeof aiAnswer.answer === 'string' ? aiAnswer.answer : JSON.stringify(aiAnswer.answer)}
            {aiAnswer.correct ? ' \u2713' : ' \u2717'}
          </div>
        </div>
      )}
    </div>
  );
}
