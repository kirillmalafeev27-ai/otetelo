import { Router } from 'express';
import { generateTasks, checkConjugation } from '../services/claude.js';

const router = Router();

router.post('/generate-tasks', async (req, res) => {
  try {
    const { mode, level, age, topic, count } = req.body;
    if (!mode || !level) {
      return res.status(400).json({ error: 'mode and level are required' });
    }
    const tasks = await generateTasks(mode, level || 'A1', age || 16, topic || 'Alltag', count || 30);
    res.json({ tasks });
  } catch (err) {
    console.error('Task generation error:', err);
    res.status(500).json({ error: 'Failed to generate tasks' });
  }
});

router.post('/check-conjugation', async (req, res) => {
  try {
    const { verb, pronoun, answer, tense } = req.body;
    const result = await checkConjugation(verb, tense || 'Präsens', pronoun, answer);
    res.json(result);
  } catch (err) {
    console.error('Conjugation check error:', err);
    res.status(500).json({ error: 'Failed to check conjugation' });
  }
});

export default router;
