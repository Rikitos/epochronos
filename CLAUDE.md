# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Commands

```bash
npm run dev      # Vite dev server with HMR on localhost:5173
npm run build    # vite build (bundle for production)
npm run preview  # Serve the built dist/
```

No test runner configured — testing is done visually in the browser via the dev server.

## Stack

React 19 · JavaScript (JSX) · Plain CSS · Vite 8 · @dnd-kit/core + @dnd-kit/sortable

## Architecture

```
src/
  data/events.js              — Pool of historical events, getRandomRound(), formatYear()
  hooks/useGame.js            — All game state: cards, phase, score, results, moveCard, submit, nextRound
  components/
    EventCard.jsx             — Single draggable card; shows correct/incorrect + year after submit
    GameBoard.jsx             — dnd-kit SortableContext wrapper, hint text, Submit button
    ResultScreen.jsx          — Post-submit view: highlighted cards, score, Next Round button
  App.jsx                     — Composes header + GameBoard or ResultScreen based on phase
  App.css                     — All component styles, dark historical theme
  index.css                   — CSS variables (dark theme), reset, global typography
```

## Game flow

`phase` in `useGame` drives everything:
- `'playing'` — player reorders cards via drag or arrows
- `'results'` — `submit()` compares player order to year-sorted order, sets `isCorrect` per card, reveals dates

Score is cumulative across rounds and never resets in a session.

## JavaScript Comment Style

Write comments proactively and in detail.

### Every file must have a header block explaining:
- What the module/component/hook does
- What data it expects and what it returns/renders
- Any non-obvious design decisions

### Every function and hook needs a one-line purpose comment unless the name is completely self-explanatory.

### Inline comments are required for:
- **Algorithms** — name the technique (e.g. "compare position-by-position after sorting by year")
- **Priority/order logic** — explain why things happen in that order
- **Snapshot patterns** — explain why a copy is taken instead of mutating state directly
- **Branching on phase/state** — explain what each branch handles
- **Magic numbers** — explain what the value means (e.g. `6 // cards per round`)
- **Non-obvious state shape** — explain valid values and what transitions them

### Hook and component files:
- Add a comment above each `useState` / `useCallback` / `useEffect` explaining what it tracks or does
- Group related state with a `// ── Group name ──` section comment if more than ~3 pieces of state
