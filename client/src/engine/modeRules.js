import { DIRECTIONS, PRONOUNS, BOARD_SIZE } from '../utils/constants.js';
import { inBounds, randomChoice } from '../utils/helpers.js';

export function calculateShields(caseType) {
  switch (caseType) {
    case 'Nominativ': return { shields: 0, dativProtect: false, fragile: false };
    case 'Akkusativ': return { shields: 1, dativProtect: false, fragile: false };
    case 'Dativ': return { shields: 1, dativProtect: true, fragile: false };
    case 'Genitiv': return { shields: 2, dativProtect: false, fragile: false };
    default: return { shields: 0, dativProtect: false, fragile: true };
  }
}

export function assignPronoun(boardMeta, r, c) {
  let pronoun = randomChoice(PRONOUNS);
  let attempts = 0;

  while (attempts < 10 && hasThreeInARow(boardMeta, r, c, pronoun)) {
    pronoun = randomChoice(PRONOUNS);
    attempts++;
  }

  return pronoun;
}

function hasThreeInARow(boardMeta, r, c, pronoun) {
  for (const [dr, dc] of DIRECTIONS) {
    let count = 0;
    for (let step = 1; step <= 2; step++) {
      const nr = r + dr * step;
      const nc = c + dc * step;
      if (inBounds(nr, nc) && boardMeta[nr][nc].pronoun === pronoun) {
        count++;
      } else {
        break;
      }
    }
    for (let step = 1; step <= 2; step++) {
      const nr = r - dr * step;
      const nc = c - dc * step;
      if (inBounds(nr, nc) && boardMeta[nr][nc].pronoun === pronoun) {
        count++;
      } else {
        break;
      }
    }
    if (count >= 2) return true;
  }
  return false;
}

export function checkWordOrder(submitted, correct) {
  if (submitted.length !== correct.length) return 'wrong';

  const exactMatch = submitted.every((w, i) => w === correct[i]);
  if (exactMatch) return 'full';

  if (submitted.length >= 2 && correct.length >= 2) {
    if (submitted[1] === correct[1]) return 'partial';
  }

  return 'wrong';
}

export function getRandomPieceType() {
  const types = ['der', 'die', 'das'];
  return randomChoice(types);
}

/**
 * Ensure pronouns on a flip line are unique.
 * If duplicates exist, replace them with unused pronouns.
 */
export function ensureUniquePronounsOnFlips(flips, boardMeta) {
  const usedPronouns = new Set();
  const result = [];

  for (const flip of flips) {
    let pronoun = boardMeta[flip.r]?.[flip.c]?.pronoun || 'ich';

    if (usedPronouns.has(pronoun)) {
      // Find an unused pronoun
      const available = PRONOUNS.filter(p => !usedPronouns.has(p));
      if (available.length > 0) {
        pronoun = randomChoice(available);
      }
    }

    usedPronouns.add(pronoun);
    result.push({ ...flip, pronoun });
  }

  return result;
}
