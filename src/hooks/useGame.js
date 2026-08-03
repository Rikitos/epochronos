// ── useGame.js ─────────────────────────────────────────────────────────────
// Central game state hook. Owns everything that changes during a session:
// the current card order, which phase the game is in, the running score,
// and the per-card result objects shown after submit.
//
// Phase transitions:
//   'playing' → submit() → 'results'
//   'results' → nextRound() → 'playing'
//
// Score is cumulative across rounds for the lifetime of the session;
// it is never reset (no reset function is intentionally exposed).
// ───────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from 'react';
import { getRandomRound } from '../data/events';

// cardsPerRound: how many cards to deal each round (4–12)
// allowedCategories: string[] of era/theme/region slugs to draw from; [] = all
// allowedScopes: string[] of scope slugs ('global'|'regional'|'national'); [] = all
export function useGame(cardsPerRound = 6, allowedCategories = null, allowedScopes = null) {
  // ── Round state ──────────────────────────────────────────────────────────
  // cards: the player's current ordering of event objects
  // Lazy initialiser runs getRandomRound once on mount instead of every render
  const [cards, setCards] = useState(() => getRandomRound(cardsPerRound, allowedCategories, allowedScopes));

  // phase: controls which screen is rendered ('playing' | 'results')
  const [phase, setPhase] = useState('playing');

  // ── Session state ─────────────────────────────────────────────────────────
  // score.correct: total cards placed correctly across all rounds
  // score.total: total cards evaluated across all rounds
  const [score, setScore] = useState({ correct: 0, total: 0 });

  // results: enriched card objects set after submit; empty during 'playing'
  // Shape: { ...event, isCorrect: bool, correctPosition: number }
  const [results, setResults] = useState([]);

  // Reorder a card by swapping it from one index to another.
  // Used by the arrow buttons; drag-and-drop uses setCards + arrayMove directly.
  const moveCard = useCallback((fromIndex, toIndex) => {
    setCards(prev => {
      const next = [...prev]; // copy - never mutate state directly
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  // Evaluate the player's current card order against the correct chronological order.
  // Algorithm: sort a copy of cards by year, then compare position-by-position -
  // a card is correct only if it ended up in the exact same slot as the sorted version.
  const submit = useCallback(() => {
    const correct = [...cards].sort((a, b) => a.year - b.year); // copy before sorting

    // Annotate each card with its result; preserve the player's display order
    const roundResults = cards.map((card, i) => ({
      ...card,
      isCorrect: card.id === correct[i].id,
      // 1-based position in the correct order (used for potential future feedback UI)
      correctPosition: correct.findIndex(c => c.id === card.id) + 1,
    }));

    const correctCount = roundResults.filter(r => r.isCorrect).length;

    setResults(roundResults);

    // Accumulate into session score - functional update to avoid stale closure
    setScore(prev => ({
      correct: prev.correct + correctCount,
      total: prev.total + cards.length,
    }));

    setPhase('results');
  }, [cards]); // depends on cards so evaluation always uses the latest order

  // Reset round state and deal a fresh set of scrambled cards.
  const nextRound = useCallback(() => {
    setCards(getRandomRound(cardsPerRound, allowedCategories, allowedScopes));
    setResults([]);
    setPhase('playing');
  }, [cardsPerRound, allowedCategories, allowedScopes]);

  // Full game reset triggered by the New Game modal - wipes the session score
  // and deals a fresh round with the settings chosen in the modal.
  // Takes explicit arguments so App can pass the new values without waiting
  // for its own state to flush (React batches the updates in the same event).
  const resetGame = useCallback((newCardsPerRound, newCategories, newScopes) => {
    setCards(getRandomRound(newCardsPerRound, newCategories, newScopes));
    setScore({ correct: 0, total: 0 });
    setResults([]);
    setPhase('playing');
  }, []);

  return { cards, setCards, phase, score, results, moveCard, submit, nextRound, resetGame };
}
