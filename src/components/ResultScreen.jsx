// ── ResultScreen.jsx ───────────────────────────────────────────────────────
// Shown after the player submits their card order (results phase).
// Displays each card with correct/incorrect highlighting and the real year
// revealed, a round summary, the cumulative session score, and buttons to
// start the next round or open the New Game modal.
//
// Props:
//   results        — enriched card array: { ...event, isCorrect, correctPosition }
//                    in the order the player submitted (not the correct order)
//   score          — session totals: { correct: number, total: number }
//   onNext         — callback to trigger the next round (same settings)
//   onNewGame      — callback to open the Start modal (resets score)
//   onCardInfo     — opens the event info bottom sheet for a given event
//   isVertical     — forwarded to EventCard to switch arrow labels (▲▼ vs ◀▶)
//   showImages     — forwarded to EventCard
//   showCategories — forwarded to EventCard
// ───────────────────────────────────────────────────────────────────────────

import { EventCard } from './EventCard';

export function ResultScreen({ results, score, onNext, onNewGame, onCardInfo, isVertical, isWide, showImages, showCategories }) {
  // Derive round summary from results — always computable, no extra state needed
  const correctCount = results.filter(r => r.isCorrect).length;
  const total = results.length;
  const perfect = correctCount === total; // true only if every card was in the right slot

  return (
    <div className="result-screen">
      <div className="result-header">
        <h2 className="result-title">
          {/* Special message for a perfect round */}
          {perfect ? 'Perfect round!' : `${correctCount} of ${total} correct`}
        </h2>
        <p className="result-score">Total score: {score.correct} / {score.total}</p>
      </div>

      {/* Cards in the player's submitted order so they see their own mistakes in context.
          showResult=true reveals years and applies correct/incorrect border colours.
          Arrow buttons and drag are inactive (no-op handlers, no DndContext). */}
      <div
        className={`card-list${isWide && results.length >= 7 ? ' card-list--two-row' : ''}`}
        style={
          isWide && results.length >= 7
            ? { gridTemplateColumns: `repeat(${Math.ceil(results.length / 2)}, 170px)` }
            : undefined
        }
      >
        {results.map((event, i) => (
          <EventCard
            key={event.id}
            event={event}
            index={i}
            total={results.length}
            onMoveUp={() => {}}
            onMoveDown={() => {}}
            showResult={true}
            isCorrect={event.isCorrect}
            onInfo={onCardInfo}
            isVertical={isVertical}
            showImages={showImages}
            showCategories={showCategories}
          />
        ))}
      </div>

      {/* Next round (primary) + New Game (secondary) */}
      <div className="result-actions">
        <button className="btn-submit btn-next-round" onClick={onNext}>Next Round</button>
        <button className="btn-new-game" onClick={onNewGame}>New Game</button>
      </div>
    </div>
  );
}
