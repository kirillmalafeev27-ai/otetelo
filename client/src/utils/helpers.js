import { BOARD_SIZE } from './constants.js';

export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function inBounds(r, c) {
  return r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE;
}

export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function colLabel(c) {
  return String.fromCharCode(65 + c);
}

export function rowLabel(r) {
  return String(r + 1);
}
