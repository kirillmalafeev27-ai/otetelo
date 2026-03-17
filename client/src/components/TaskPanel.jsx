import React, { useState, useEffect } from 'react';
import { MODES, TIMING } from '../utils/constants.js';
import GenderPicker from './GenderPicker.jsx';
import CasePicker from './CasePicker.jsx';
import ConjugationInput from './ConjugationInput.jsx';
import SentenceBuilder from './SentenceBuilder.jsx';

const styles = {
  panel: {
    background: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px',
    marginBottom: '12px',
    minHeight: '120px',
    position: 'relative',
    overflow: 'hidden',
  },
  aiPanel: {
    background: 'rgba(0, 212, 255, 0.05)',
    border: '1px solid rgba(0, 212, 255, 0.2)',
    borderRadius: 'var(--radius)',
    padding: '12px 16px',
    marginTop: '12px',
  },
  aiLabel: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.7rem',
    color: 'var(--player2)',
    marginBottom: '4px',
  },
  aiAnswer: {
    fontFamily: 'var(--font-german)',
    fontSize: '1.1rem',
  },
  message: {
    textAlign: 'center',
    padding: '16px',
    fontFamily: 'var(--font-heading)',
    fontSize: '1rem',
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
}) {
  if (message) {
    return (
      <div style={styles.panel}>
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
        <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '16px' }}>
          Wähle ein Feld auf dem Brett
        </div>
      </div>
    );
  }

  return (
    <div style={styles.panel} className="slide-up">
      {mode === MODES.GENDER && (
        <GenderPicker task={task} onAnswer={onGenderAnswer} />
      )}
      {mode === MODES.CASE && (
        <CasePicker task={task} onAnswer={onCaseAnswer} />
      )}
      {mode === MODES.CONJUGATION && (
        <ConjugationInput task={task} onAnswer={onConjugationAnswer} />
      )}
      {mode === MODES.SENTENCE && (
        <SentenceBuilder task={task} onAnswer={onSentenceAnswer} />
      )}

      {aiAnswer && (
        <div style={styles.aiPanel}>
          <div style={styles.aiLabel}>KI-ANTWORT:</div>
          <div style={{
            ...styles.aiAnswer,
            color: aiAnswer.correct ? 'var(--success)' : 'var(--error)',
          }}>
            {typeof aiAnswer.answer === 'string' ? aiAnswer.answer : JSON.stringify(aiAnswer.answer)}
            {aiAnswer.correct ? ' ✓' : ' ✗'}
          </div>
        </div>
      )}
    </div>
  );
}
