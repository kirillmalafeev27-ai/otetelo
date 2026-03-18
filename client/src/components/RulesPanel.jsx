import React from 'react';

const styles = {
  container: {
    background: 'var(--card-bg)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid var(--card-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '14px',
    position: 'relative',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse at 50% 0%, rgba(100, 140, 255, 0.03) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  title: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    marginBottom: '12px',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    position: 'relative',
    zIndex: 1,
  },
  rule: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 10px',
    marginBottom: '5px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid transparent',
    transition: 'all 0.3s ease',
    position: 'relative',
    zIndex: 1,
  },
  icon: {
    fontSize: '1.2rem',
    width: '28px',
    textAlign: 'center',
    flexShrink: 0,
  },
  info: {
    flex: 1,
  },
  name: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.78rem',
    fontWeight: 700,
    letterSpacing: '0.03em',
  },
  desc: {
    fontSize: '0.68rem',
    color: 'var(--text-dim)',
    marginTop: '2px',
  },
};

const rules = [
  {
    icon: '\u2666',
    name: 'der \u2014 \u0420\u043e\u043c\u0431',
    desc: '\u041f\u0435\u0440\u0435\u0432\u043e\u0440\u0430\u0447\u0438\u0432\u0430\u0435\u0442 \u043f\u043e \u043f\u0440\u044f\u043c\u044b\u043c: \u2191 \u2193 \u2190 \u2192',
    color: '#e8365d',
  },
  {
    icon: '\u25cf',
    name: 'die \u2014 \u041a\u0440\u0443\u0433',
    desc: '\u041f\u0435\u0440\u0435\u0432\u043e\u0440\u0430\u0447\u0438\u0432\u0430\u0435\u0442 \u043f\u043e \u0434\u0438\u0430\u0433\u043e\u043d\u0430\u043b\u044f\u043c: \u2197 \u2198 \u2199 \u2196',
    color: '#3db8e8',
  },
  {
    icon: '\u25a0',
    name: 'das \u2014 \u041a\u0432\u0430\u0434\u0440\u0430\u0442',
    desc: '\u0412\u0441\u0435 8 \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0439, \u043d\u043e \u0442\u043e\u043b\u044c\u043a\u043e \u043d\u0430 1 \u043a\u043b\u0435\u0442\u043a\u0443',
    color: '#e8a832',
  },
];

export default function RulesPanel() {
  return (
    <div style={styles.container}>
      <div style={styles.glow} />
      <div style={styles.title}>Типы фигур</div>
      {rules.map((rule, i) => (
        <div
          key={i}
          style={{ ...styles.rule, borderColor: `${rule.color}18` }}
          onMouseEnter={e => {
            e.currentTarget.style.background = `${rule.color}08`;
            e.currentTarget.style.borderColor = `${rule.color}25`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
            e.currentTarget.style.borderColor = `${rule.color}18`;
          }}
        >
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
