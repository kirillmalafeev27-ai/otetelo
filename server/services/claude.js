import Anthropic from '@anthropic-ai/sdk';
import { getPrompt as getMode1Prompt } from '../prompts/mode1-gender.js';
import { getPrompt as getMode2Prompt } from '../prompts/mode2-cases.js';
import { getPrompt as getMode3Prompt } from '../prompts/mode3-conjugation.js';
import { getPrompt as getMode4Prompt } from '../prompts/mode4-sentences.js';

let client = null;

function getClient() {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

const promptBuilders = {
  1: getMode1Prompt,
  2: getMode2Prompt,
  3: getMode3Prompt,
  4: getMode4Prompt,
};

export async function generateTasks(mode, level, age, topic, count) {
  const buildPrompt = promptBuilders[mode];
  if (!buildPrompt) throw new Error(`Unknown mode: ${mode}`);

  const prompt = buildPrompt(level, age, topic, count);

  try {
    const anthropic = getClient();
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].text.trim();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No JSON array found in response');
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error('Claude API error, using fallback tasks:', err.message);
    return getFallbackTasks(mode, count);
  }
}

export async function checkConjugation(verb, tense, pronoun, answer) {
  const normalized = answer.trim().toLowerCase();
  try {
    const anthropic = getClient();
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 256,
      messages: [{
        role: 'user',
        content: `Is "${answer}" the correct ${tense} conjugation of "${verb}" for "${pronoun}"? Respond ONLY with JSON: {"correct": true/false, "correctAnswer": "..."}`
      }],
    });
    const text = message.content[0].text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error('Conjugation check error:', err.message);
  }
  return { correct: false, correctAnswer: null };
}

function getFallbackTasks(mode, count) {
  const fallbacks = {
    1: [
      { word: 'Tisch', gender: 'der' }, { word: 'Lampe', gender: 'die' },
      { word: 'Buch', gender: 'das' }, { word: 'Stuhl', gender: 'der' },
      { word: 'Tasche', gender: 'die' }, { word: 'Fenster', gender: 'das' },
      { word: 'Hund', gender: 'der' }, { word: 'Katze', gender: 'die' },
      { word: 'Auto', gender: 'das' }, { word: 'Baum', gender: 'der' },
      { word: 'Blume', gender: 'die' }, { word: 'Haus', gender: 'das' },
      { word: 'Schuh', gender: 'der' }, { word: 'Uhr', gender: 'die' },
      { word: 'Kind', gender: 'das' }, { word: 'Freund', gender: 'der' },
      { word: 'Schule', gender: 'die' }, { word: 'Bett', gender: 'das' },
      { word: 'Apfel', gender: 'der' }, { word: 'Milch', gender: 'die' },
      { word: 'Brot', gender: 'das' }, { word: 'Ball', gender: 'der' },
      { word: 'Tür', gender: 'die' }, { word: 'Glas', gender: 'das' },
      { word: 'Berg', gender: 'der' }, { word: 'Stadt', gender: 'die' },
      { word: 'Wasser', gender: 'das' }, { word: 'Kuchen', gender: 'der' },
      { word: 'Straße', gender: 'die' }, { word: 'Fahrrad', gender: 'das' },
      { word: 'Lehrer', gender: 'der' }, { word: 'Klasse', gender: 'die' },
      { word: 'Mädchen', gender: 'das' }, { word: 'Bruder', gender: 'der' },
      { word: 'Schwester', gender: 'die' }, { word: 'Handy', gender: 'das' },
      { word: 'Tee', gender: 'der' }, { word: 'Musik', gender: 'die' },
      { word: 'Kino', gender: 'das' }, { word: 'Computer', gender: 'der' },
      { word: 'Zeitung', gender: 'die' }, { word: 'Telefon', gender: 'das' },
      { word: 'Schlüssel', gender: 'der' }, { word: 'Brücke', gender: 'die' },
      { word: 'Hemd', gender: 'das' }, { word: 'Garten', gender: 'der' },
      { word: 'Küche', gender: 'die' }, { word: 'Zimmer', gender: 'das' },
      { word: 'Vogel', gender: 'der' }, { word: 'Sonne', gender: 'die' },
      { word: 'Meer', gender: 'das' }, { word: 'Film', gender: 'der' },
      { word: 'Nacht', gender: 'die' }, { word: 'Spiel', gender: 'das' },
      { word: 'Arzt', gender: 'der' }, { word: 'Farbe', gender: 'die' },
      { word: 'Lied', gender: 'das' }, { word: 'Platz', gender: 'der' },
      { word: 'Kirche', gender: 'die' }, { word: 'Dorf', gender: 'das' },
      { word: 'Mond', gender: 'der' }, { word: 'Wolke', gender: 'die' },
      { word: 'Pferd', gender: 'das' }, { word: 'Wald', gender: 'der' },
      { word: 'Rose', gender: 'die' }, { word: 'Ei', gender: 'das' },
    ],
    2: [
      { sentence: 'Ich gebe ___ Lehrer das Buch.', answer: 'dem', case: 'Dativ', options: ['dem', 'den', 'der', 'des'] },
      { sentence: '___ Hund ist groß.', answer: 'Der', case: 'Nominativ', options: ['Der', 'Den', 'Dem', 'Des'] },
      { sentence: 'Ich sehe ___ Mann.', answer: 'den', case: 'Akkusativ', options: ['den', 'der', 'dem', 'des'] },
      { sentence: 'Das ist das Auto ___ Vaters.', answer: 'des', case: 'Genitiv', options: ['des', 'dem', 'den', 'der'] },
      { sentence: '___ Frau liest ein Buch.', answer: 'Die', case: 'Nominativ', options: ['Die', 'Der', 'Den', 'Dem'] },
      { sentence: 'Er hilft ___ Mutter.', answer: 'der', case: 'Dativ', options: ['der', 'die', 'den', 'des'] },
      { sentence: 'Wir kaufen ___ Kuchen.', answer: 'den', case: 'Akkusativ', options: ['den', 'der', 'dem', 'des'] },
      { sentence: '___ Kind spielt im Garten.', answer: 'Das', case: 'Nominativ', options: ['Das', 'Den', 'Dem', 'Des'] },
      { sentence: 'Sie gibt ___ Kind einen Ball.', answer: 'dem', case: 'Dativ', options: ['dem', 'den', 'das', 'des'] },
      { sentence: 'Die Farbe ___ Hauses ist blau.', answer: 'des', case: 'Genitiv', options: ['des', 'dem', 'den', 'der'] },
    ],
    3: [
      { verb: 'spielen', tense: 'Präsens', conjugation: { ich: 'spiele', du: 'spielst', 'er/sie/es': 'spielt', wir: 'spielen', ihr: 'spielt', 'sie/Sie': 'spielen' } },
      { verb: 'fahren', tense: 'Präsens', conjugation: { ich: 'fahre', du: 'fährst', 'er/sie/es': 'fährt', wir: 'fahren', ihr: 'fahrt', 'sie/Sie': 'fahren' } },
      { verb: 'lesen', tense: 'Präsens', conjugation: { ich: 'lese', du: 'liest', 'er/sie/es': 'liest', wir: 'lesen', ihr: 'lest', 'sie/Sie': 'lesen' } },
      { verb: 'geben', tense: 'Präsens', conjugation: { ich: 'gebe', du: 'gibst', 'er/sie/es': 'gibt', wir: 'geben', ihr: 'gebt', 'sie/Sie': 'geben' } },
      { verb: 'sprechen', tense: 'Präsens', conjugation: { ich: 'spreche', du: 'sprichst', 'er/sie/es': 'spricht', wir: 'sprechen', ihr: 'sprecht', 'sie/Sie': 'sprechen' } },
      { verb: 'schreiben', tense: 'Präsens', conjugation: { ich: 'schreibe', du: 'schreibst', 'er/sie/es': 'schreibt', wir: 'schreiben', ihr: 'schreibt', 'sie/Sie': 'schreiben' } },
      { verb: 'werden', tense: 'Präsens', conjugation: { ich: 'werde', du: 'wirst', 'er/sie/es': 'wird', wir: 'werden', ihr: 'werdet', 'sie/Sie': 'werden' } },
      { verb: 'nehmen', tense: 'Präsens', conjugation: { ich: 'nehme', du: 'nimmst', 'er/sie/es': 'nimmt', wir: 'nehmen', ihr: 'nehmt', 'sie/Sie': 'nehmen' } },
      { verb: 'kommen', tense: 'Präsens', conjugation: { ich: 'komme', du: 'kommst', 'er/sie/es': 'kommt', wir: 'kommen', ihr: 'kommt', 'sie/Sie': 'kommen' } },
      { verb: 'sehen', tense: 'Präsens', conjugation: { ich: 'sehe', du: 'siehst', 'er/sie/es': 'sieht', wir: 'sehen', ihr: 'seht', 'sie/Sie': 'sehen' } },
    ],
    4: [
      { words_shuffled: ['Buch', 'liest', 'ein', 'Er'], words_correct: ['Er', 'liest', 'ein', 'Buch'], difficulty: 'easy' },
      { words_shuffled: ['Schule', 'die', 'gehe', 'in', 'Ich'], words_correct: ['Ich', 'gehe', 'in', 'die', 'Schule'], difficulty: 'easy' },
      { words_shuffled: ['gut', 'Deutsch', 'spricht', 'Sie'], words_correct: ['Sie', 'spricht', 'gut', 'Deutsch'], difficulty: 'easy' },
      { words_shuffled: ['Kaffee', 'trinkt', 'einen', 'Morgen', 'Am', 'er'], words_correct: ['Am', 'Morgen', 'trinkt', 'er', 'einen', 'Kaffee'], difficulty: 'medium' },
      { words_shuffled: ['krank', 'weil', 'ist', 'bleibt', 'sie', 'er', 'zu Hause'], words_correct: ['Er', 'bleibt', 'zu Hause', 'weil', 'sie', 'krank', 'ist'], difficulty: 'hard' },
    ],
  };
  const pool = fallbacks[mode] || fallbacks[1];
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(pool[i % pool.length]);
  }
  return result;
}
