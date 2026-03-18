export function getPrompt(level, age, topic, count) {
  const tenseConfig = {
    'A1': { tenses: ['Präsens'], desc: 'nur Präsens, regelmäßige Verben' },
    'A2': { tenses: ['Präsens'], desc: 'Präsens, regelmäßige UND unregelmäßige Verben' },
    'B1': { tenses: ['Präsens', 'Perfekt'], desc: 'Präsens und Perfekt (haben/sein + Partizip II)' },
    'B2': { tenses: ['Präsens', 'Perfekt', 'Präteritum'], desc: 'Präsens, Perfekt und Präteritum gemischt' },
  };

  const config = tenseConfig[level] || tenseConfig['A1'];
  const tenseList = config.tenses.join(', ');

  return `Du bist ein erfahrener Deutsch-Lehrer. Generiere genau ${count} deutsche Verben mit vollständiger Konjugation.

Schüler: Niveau ${level}, Alter ${age}, Thema: "${topic}".

STRIKTE REGELN:
1. Tempora: ${config.desc}
2. Die Tempora MÜSSEN DURCHMISCHT sein — NICHT alle gleich hintereinander!
3. Mische regelmäßige und unregelmäßige Verben
4. Jeder Eintrag braucht das Verb, das Tempus und die Konjugation für ALLE 6 Personen
5. Bei Perfekt: die konjugierte Form ist z.B. "habe gespielt", "ist gefahren" (Hilfsverb + Partizip II)
6. Bei Präteritum: z.B. "spielte", "fuhr", "ging"
7. Jedes Verb darf nur EINMAL pro Tempus vorkommen!
8. Verwende verschiedene, alltagstaugliche Verben passend zum Thema "${topic}"

${config.tenses.length > 1 ? `WICHTIG: Mische die Tempora (${tenseList}) in ZUFÄLLIGER Reihenfolge! Nicht erst alle Präsens, dann alle Perfekt usw.` : ''}

Antworte NUR mit validem JSON, kein Markdown, keine Erklärung.
Format: [{"verb": "fahren", "tense": "Präsens", "conjugation": {"ich": "fahre", "du": "fährst", "er/sie/es": "fährt", "wir": "fahren", "ihr": "fahrt", "sie/Sie": "fahren"}}, ...]

Generiere genau ${count} Einträge mit gleichmäßiger Verteilung der Tempora: ${tenseList}.`;
}
