// ── GameBoard.jsx ──────────────────────────────────────────────────────────
// Renders the interactive card list during the 'playing' phase.
//
// Props:
//   cards        — current ordered array of event objects from useGame
//   setCards     — direct setter used by dnd-kit's arrayMove after a drag
//   onMoveCard   — arrow-button handler from useGame (swap by index)
//   onSubmit     — called when the player is happy with their order
//   onCardInfo   — opens the event info bottom sheet for a given event
//   isVertical   — true on mobile (< 640px); EventCard shows ▲▼ arrows
//   isWide       — true on large screens (1100px+); triggers 2-row grid logic
//   timedSeconds — seconds for countdown timer; 0 = timer off
//   showImages   — when true, EventCard shows SVG/photo instead of gradient
//
// Sort strategy selection:
//   isVertical → verticalListSortingStrategy   (single column)
//   isWide && cards.length ≥ 7 → rectSortingStrategy   (2-row grid)
//   otherwise → horizontalListSortingStrategy  (single scrollable row)
//
// Drag-end reordering calls setCards directly with arrayMove because dnd-kit
// provides old/new indices and arrayMove is the idiomatic pattern.
// ───────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react';
import {
  DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { EventCard } from './EventCard';

export function GameBoard({ cards, setCards, onMoveCard, onSubmit, onCardInfo, isVertical, isWide, timedSeconds, showImages, showCategories }) {
  // PointerSensor: 5px movement required before activating drag (prevents stealing clicks)
  // TouchSensor: 150ms delay + 5px tolerance to distinguish drag from scroll
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  // True when the large-screen grid should show 2 rows instead of 1
  const isTwoRow = isWide && cards.length >= 7;

  // For 2-row grid: compute columns as ceil(count/2) so items flow row-major
  // (1,2,3,4 on row 1 then 5,6,7,8 on row 2) rather than column-major.
  const twoRowStyle = isTwoRow
    ? { gridTemplateColumns: `repeat(${Math.ceil(cards.length / 2)}, 170px)` }
    : undefined;

  // Pick the dnd-kit sort strategy that matches the active CSS layout
  const strategy = isVertical
    ? verticalListSortingStrategy
    : isTwoRow
      ? rectSortingStrategy
      : horizontalListSortingStrategy;

  // ── Countdown timer ───────────────────────────────────────────────────────
  // timeLeft counts down from timedSeconds to 0, then auto-submits.
  // GameBoard unmounts between rounds so each mount starts a fresh countdown.
  const [timeLeft, setTimeLeft] = useState(timedSeconds);

  // Keep a ref to onSubmit so the interval callback always calls the latest version
  // without needing it as an effect dependency (which would restart the timer on
  // every card move, since submit is a useCallback that depends on cards).
  const submitRef = useRef(onSubmit);
  useEffect(() => { submitRef.current = onSubmit; }, [onSubmit]);

  useEffect(() => {
    if (!timedSeconds) return; // timer is off
    setTimeLeft(timedSeconds);
    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(id);
          submitRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timedSeconds]); // re-runs only when timedSeconds changes (new round = remount anyway)

  // Colour shifts green → amber → red as time runs low
  const timerColor = timeLeft <= 10
    ? 'var(--incorrect)'
    : timeLeft <= Math.ceil(timedSeconds * 0.4)
      ? '#c9a830'
      : 'var(--correct)';

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = cards.findIndex(c => c.id === active.id);
    const newIndex = cards.findIndex(c => c.id === over.id);
    setCards(arrayMove(cards, oldIndex, newIndex));
  }

  return (
    <div className="game-board">
      {/* Countdown bar — only shown when timed mode is active */}
      {timedSeconds > 0 && (
        <div className="timer">
          <div className="timer-bar">
            <div
              className="timer-fill"
              style={{
                width: `${(timeLeft / timedSeconds) * 100}%`,
                background: timerColor,
              }}
            />
          </div>
          <span className="timer-text" style={{ color: timerColor }}>{timeLeft}s</span>
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {/* card-list--two-row enables the 2-row CSS grid when cards ≥ 7 on wide screens */}
        <SortableContext items={cards.map(c => c.id)} strategy={strategy}>
          <div className={`card-list${isTwoRow ? ' card-list--two-row' : ''}`} style={twoRowStyle}>
            {cards.map((event, i) => (
              <EventCard
                key={event.id}
                event={event}
                index={i}
                total={cards.length}
                onMoveUp={() => onMoveCard(i, i - 1)}
                onMoveDown={() => onMoveCard(i, i + 1)}
                showResult={false}
                onInfo={onCardInfo}
                isVertical={isVertical}
                showImages={showImages}
                showCategories={showCategories}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button className="btn-submit" onClick={onSubmit}>Submit Order</button>
    </div>
  );
}
