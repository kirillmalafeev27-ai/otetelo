export function getPrompt(level, age, topic, count) {
  let difficulty = 'easy';
  let wordRange = '3-4';
  if (level === 'A2') { difficulty = 'easy bis medium'; wordRange = '4-5'; }
  if (level === 'B1') { difficulty = 'medium'; wordRange = '5-7'; }
  if (level === 'B2') { difficulty = 'medium bis hard'; wordRange = '6-8'; }
  if (level === 'C1') { difficulty = 'hard'; wordRange = '7-10'; }

  return `Du bist ein Deutsch-Lehrer. Generiere ${count} deutsche Sätze für die Übung der Wortstellung. Schüler auf Niveau ${level}, Alter ${age}, Thema: "${topic}".

Anforderungen:
- Sätze mit ${wordRange} Wörtern
- Schwierigkeit: ${difficulty}
- words_shuffled muss eine zufällige Reihenfolge der Wörter enthalten
- words_correct enthält die korrekte Reihenfolge
- Beachte die V2-Regel (Verb auf Position 2 in Hauptsätzen)
- Niveau ${level}: passende Grammatik

Respond ONLY with valid JSON, no markdown, no explanation.
Format: [{"words_shuffled": ["Buch", "liest", "ein", "Er"], "words_correct": ["Er", "liest", "ein", "Buch"], "difficulty": "easy"}, ...]

Generiere genau ${count} Einträge.`;
}
