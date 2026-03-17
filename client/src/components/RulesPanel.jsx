import React from 'react';

const styles = {
  container: {
    background: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '12px',
  },
  title: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.8rem',
    color: 'var(--text-dim)',
    marginBottom: '10px',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  rule: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px',
    marginBottom: '6px',
    borderRadius: '6px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid transparent',
  },
  icon: {
    fontSize: '1.4rem',
    width: '32px',
    textAlign: 'center',
    flexShrink: 0,
  },
  info: {
    flex: 1,
  },
  name: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.85rem',
    fontWeight: 700,
  },
  desc: {
    fontSize: '0.7rem',
    color: 'var(--text-dim)',
    marginTop: '2px',
  },
};

const rules = [
  {
    icon: '♦',
    name: 'der — Ромб',
    desc: 'Переворачивает по прямым: ↑ ↓ ← →',
    color: '#ff006e',
  },
  {
    icon: '●',
    name: 'die — Круг',
    desc: 'Переворачивает по диагоналям: ↗ ↘ ↙ ↖',
    color: '#00d4ff',
  },
  {
    icon: '■',
    name: 'das — Квадрат',
    desc: 'Все 8 направлений, но только на 1 клетку',
    color: '#f39c12',
  },
];

export default function RulesPanel() {
  return (
    <div style={styles.container}>
      <div style={styles.title}>Типы фигур</div>
      {rules.map((rule, i) => (
        <div key={i} style={{ ...styles.rule, borderColor: `${rule.color}33` }}>
          <span style={{ ...styles.icon, color: rule.color }}>{rule.icon}</span>
          <div style={styles.info}>
            <div style={{ ...styles.name, color: rule.color }}>{rule.name}</div>
            <div style={styles.desc}>{rule.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
