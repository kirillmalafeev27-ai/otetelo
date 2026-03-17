export function getPrompt(level, age, topic, count) {
  let tense = 'Präsens';
  if (level === 'B1') tense = 'Präsens und Perfekt';
  if (level === 'B2' || level === 'C1') tense = 'Präsens, Perfekt und Präteritum';

  return `Du bist ein Deutsch-Lehrer. Generiere ${count} deutsche Verben mit vollständiger Konjugation im ${tense} für einen Schüler auf Niveau ${level}, Alter ${age}, Thema: "${topic}".

Anforderungen:
- Mische regelmäßige und unregelmäßige Verben
- Niveau ${level}: passende Verben
- Thema: "${topic}"
- Vollständige Konjugation für alle 6 Personen

Respond ONLY with valid JSON, no markdown, no explanation.
Format: [{"verb": "fahren", "tense": "Präsens", "conjugation": {"ich": "fahre", "du": "fährst", "er/sie/es": "fährt", "wir": "fahren", "ihr": "fahrt", "sie/Sie": "fahren"}}, ...]

Generiere genau ${count} Einträge.`;
}
