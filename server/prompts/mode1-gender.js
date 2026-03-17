export function getPrompt(level, age, topic, count) {
  return `Du bist ein Deutsch-Lehrer. Generiere ${count} deutsche Substantive mit Artikeln für einen Schüler auf dem Niveau ${level}, Alter ${age}, Thema: "${topic}".

Anforderungen:
- Alle Substantive müssen zum Thema "${topic}" passen
- Niveau ${level}: verwende entsprechend schwierige Wörter
- Mische der/die/das gleichmäßig (ca. 33% jedes Genus)
- Keine Wiederholungen

Respond ONLY with valid JSON, no markdown, no explanation.
Format: [{"word": "Tisch", "gender": "der"}, {"word": "Lampe", "gender": "die"}, {"word": "Buch", "gender": "das"}, ...]

Generiere genau ${count} Einträge.`;
}
