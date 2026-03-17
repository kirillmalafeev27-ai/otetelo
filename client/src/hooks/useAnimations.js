import { useState, useCallback, useRef } from 'react';
import { TIMING } from '../utils/constants.js';
import { delay } from '../utils/helpers.js';

export function useAnimations() {
  const [animating, setAnimating] = useState(false);
  const [flippingCells, setFlippingCells] = useState(new Set());
  const [newPiece, setNewPiece] = useState(null);
  const [chainHighlight, setChainHighlight] = useState(null);
  const animRef = useRef(false);

  const animatePlacement = useCallback(async (r, c) => {
    setNewPiece(`${r}-${c}`);
    await delay(TIMING.PIECE_APPEAR);
    setNewPiece(null);
  }, []);

  const animateFlips = useCallback(async (flips) => {
    setAnimating(true);
    animRef.current = true;

    for (let i = 0; i < flips.length; i++) {
      if (!animRef.current) break;
      const flip = flips[i];
      const key = `${flip.r}-${flip.c}`;
      setFlippingCells(prev => new Set([...prev, key]));
      await delay(TIMING.FLIP_DELAY);
    }

    await delay(TIMING.PIECE_FLIP);
    setFlippingCells(new Set());
    setAnimating(false);
    animRef.current = false;
  }, []);

  const highlightChain = useCallback((index) => {
    setChainHighlight(index);
  }, []);

  const clearChainHighlight = useCallback(() => {
    setChainHighlight(null);
  }, []);

  return {
    animating,
    flippingCells,
    newPiece,
    chainHighlight,
    animatePlacement,
    animateFlips,
    highlightChain,
    clearChainHighlight,
  };
}
