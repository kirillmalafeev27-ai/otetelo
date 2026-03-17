export function getPrompt(level, age, topic, count) {
  const caseSets = {
    'A1': { cases: ['Nominativ', 'Akkusativ'], desc: 'nur Nominativ und Akkusativ' },
    'A2': { cases: ['Nominativ', 'Akkusativ', 'Dativ'], desc: 'Nominativ, Akkusativ und Dativ' },
    'B1': { cases: ['Nominativ', 'Akkusativ', 'Dativ', 'Genitiv'], desc: 'alle 4 Fälle' },
    'B2': { cases: ['Nominativ', 'Akkusativ', 'Dativ', 'Genitiv'], desc: 'alle 4 Fälle' },
  };

  const config = caseSets[level] || caseSets['A1'];
  const caseList = config.cases.join(', ');

  return `Du bist ein erfahrener Deutsch-Lehrer. Generiere genau ${count} Sätze für die Übung deutscher Fälle (${config.desc}).

Schüler: Niveau ${level}, Alter ${age}, Thema: "${topic}".

STRIKTE REGELN:
1. Jeder Satz hat GENAU EINE Lücke, markiert mit ___
2. Die Lücke ist IMMER ein bestimmter oder unbestimmter Artikel: der/die/das/dem/den/des/ein/eine/einen/einem/eines/einer
3. NIEMALS andere Wörter als Lücke verwenden! Keine Possessivpronomen (mein/dein/sein), keine Adjektive, keine Namen, keine Substantive!
4. Die 4 Antwortoptionen müssen ALLE Artikelformen sein (z.B. dem/den/der/des oder einem/einen/einer/eines)
5. Die Fälle MÜSSEN gleichmäßig verteilt und DURCHMISCHT sein — NICHT mehrere gleiche Fälle hintereinander!
6. Erlaubte Fälle: ${caseList}
7. Jeder Satz muss einzigartig sein — keine Wiederholungen!
8. Verwende verschiedene Substantive mit verschiedenen Genera (der/die/das gemischt)

FALSCH (VERBOTEN):
- "___ Schüler Max ist krank" mit Optionen "Maxi/Maxs" ← ABSOLUT VERBOTEN
- "Das Buch ___ Lehrerin" mit Optionen "meine/deine" ← VERBOTEN, nur Artikel!

RICHTIG (BEISPIELE):
- "___ Hund liegt im Garten." → Antwort: "Der" (Nominativ), Optionen: ["Der", "Den", "Dem", "Des"]
- "Ich gebe ___ Kind einen Ball." → Antwort: "dem" (Dativ), Optionen: ["dem", "den", "das", "des"]
- "Sie sieht ___ Katze." → Antwort: "die" (Akkusativ), Optionen: ["die", "der", "dem", "des"]

REIHENFOLGE: Mische die Fälle gut durch! Beispiel für ${config.cases.length} Fälle: ${config.cases.join(', ')} in ZUFÄLLIGER Reihenfolge, NICHT gruppiert.

Antworte NUR mit validem JSON, kein Markdown, keine Erklärung.
Format: [{"sentence": "...", "answer": "...", "case": "...", "options": ["...", "...", "...", "..."]}, ...]

Generiere genau ${count} Einträge mit gleichmäßiger Verteilung der Fälle: ${caseList}.`;
}
