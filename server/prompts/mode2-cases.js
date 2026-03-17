export function getPrompt(level, age, topic, count) {
  return `Du bist ein Deutsch-Lehrer. Generiere ${count} Sätze mit Lücken für die Übung deutscher Fälle. Schüler auf Niveau ${level}, Alter ${age}, Thema: "${topic}".

Verteilung der Fälle: 30% Nominativ, 30% Akkusativ, 25% Dativ, 15% Genitiv.

Anforderungen:
- Jeder Satz hat genau eine Lücke (markiert mit ___)
- 4 Antwortmöglichkeiten pro Satz, eine davon korrekt
- Niveau ${level}: passende Grammatik und Vokabular
- Thema: "${topic}"

Respond ONLY with valid JSON, no markdown, no explanation.
Format: [{"sentence": "Ich gebe ___ Lehrer das Buch.", "answer": "dem", "case": "Dativ", "options": ["dem", "den", "der", "des"]}, ...]

Generiere genau ${count} Einträge.`;
}
