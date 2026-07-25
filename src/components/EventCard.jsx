// ── EventCard.jsx ──────────────────────────────────────────────────────────
// Single draggable event card. Adapts to two layout modes via CSS:
//
//   Vertical (mobile, < 640px):
//     Horizontal bar — gradient or image fills card background. A narrow
//     grip-handle strip on the left carries the dnd-kit listeners and
//     touch-action:none so the rest of the card allows page scroll.
//
//   Horizontal (desktop, 640px+):
//     Portrait tile — full gradient/image area at top, title below,
//     ◀▶ controls at the bottom. The entire card surface is the drag handle.
//
// Props:
//   event       — { id, title, year, description, categories }
//   index       — 0-based position; displayed as 1-based badge
//   total       — total cards; used to disable boundary arrow buttons
//   onMoveUp    — move earlier callback (left / up)
//   onMoveDown  — move later callback (right / down)
//   showResult  — true in results phase; reveals year and correct/incorrect style
//   isCorrect   — only meaningful when showResult is true
//   onInfo      — called with the event object when the card or ⓘ is tapped
//   isVertical  — true when the list is a vertical column; switches arrow labels
//   showImages  — when true, use SVG/photo background instead of CSS gradient
// ───────────────────────────────────────────────────────────────────────────

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { InfoIcon } from './InfoIcon';
import { getCategoryStyle, getCategoryImage, THEME_LABELS } from '../data/events';

// Six-dot grip icon — universally understood drag handle
function DragDots() {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor" aria-hidden="true">
      <circle cx="2" cy="2"  r="1.5"/>
      <circle cx="8" cy="2"  r="1.5"/>
      <circle cx="2" cy="8"  r="1.5"/>
      <circle cx="8" cy="8"  r="1.5"/>
      <circle cx="2" cy="14" r="1.5"/>
      <circle cx="8" cy="14" r="1.5"/>
    </svg>
  );
}

export function EventCard({
  event, index, total,
  onMoveUp, onMoveDown,
  showResult, isCorrect,
  onInfo, isVertical,
  showImages,
  showCategories,
}) {
  // useSortable returns empty stubs when rendered outside a DndContext (results phase)
  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging,
  } = useSortable({ id: event.id });

  // Resolve visual: era is derived from year inside both helpers — no era tag needed on the event
  const imageUrl   = showImages ? getCategoryImage(event.categories, event.id, event.year, event.image) : null;
  const bgGradient = getCategoryStyle(event.categories, event.year);

  // card-image background style — image or gradient
  const imageBg = imageUrl
    ? { backgroundImage: `url(${imageUrl})`, backgroundSize: 'contain', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat' }
    : { background: bgGradient };

  // On mobile in playing phase: background applied to the card itself (not a child element).
  // Portrait mobile always uses the CSS gradient — images only appear in landscape/desktop
  // via the card-image div. This ensures text is always readable without a scrim.
  const mobileGradient = isVertical && !showResult;
  const mobileBg = { background: bgGradient };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.45 : 1,
    ...(mobileGradient && mobileBg),
  };

  const className = [
    'event-card',
    showResult ? (isCorrect ? 'correct' : 'incorrect') : '',
    isDragging ? 'dragging' : '',
    mobileGradient ? 'mobile-bg' : '',
  ].join(' ');

  // Arrow labels match the visual movement direction in each layout
  const prevLabel     = isVertical ? '▲' : '◀';
  const nextLabel     = isVertical ? '▼' : '▶';
  const prevAriaLabel = isVertical ? 'Move up'   : 'Move left';
  const nextAriaLabel = isVertical ? 'Move down' : 'Move right';

  const stopDrag = (e) => e.stopPropagation();

  // On mobile playing phase, listeners go only on the grip handle so the card body
  // can still be swiped to scroll the page. On desktop the whole card is the surface.
  const rootListeners = mobileGradient ? {} : listeners;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={className}
      {...attributes}
      {...rootListeners}
      onClick={() => onInfo?.(event)}
    >
      {mobileGradient ? (
        /* Narrow grip strip — owns touch-action:none and the dnd-kit listeners */
        <div
          className="card-grip"
          {...listeners}
          onClick={e => e.stopPropagation()}
          aria-label="Drag to reorder"
        >
          <span className="card-grip-num">{index + 1}</span>
          <DragDots />
        </div>
      ) : (
        /* Results phase (mobile) or desktop: image/gradient in the card-image area */
        <div className="card-image" style={imageBg} />
      )}

      {/* Position badge — only outside the grip strip (desktop / results phase) */}
      {!mobileGradient && <span className="card-position">{index + 1}</span>}

      {/* Title, optional category tag, and optional year */}
      <div className="card-content">
        <p className="card-title">{event.title}</p>
        {showCategories && event.categories?.length > 0 && (
          // Display the human-readable theme label (e.g. "Politics") not the raw slug
          <span className="card-category">
            {THEME_LABELS[event.categories[0]] ?? event.categories[0]}
          </span>
        )}
        {showResult && (
          <span className="card-year">
            {event.year < 0 ? `${Math.abs(event.year)} BC` : `${event.year} AD`}
          </span>
        )}
      </div>

      {/* ⓘ button */}
      <button
        className="card-info-btn"
        onPointerDown={stopDrag}
        onClick={e => { e.stopPropagation(); onInfo?.(event); }}
        aria-label="More info"
      >
        <InfoIcon size={13} />
      </button>

      {/* Arrow controls */}
      <div className="card-controls">
        <button
          onPointerDown={stopDrag}
          onClick={e => { e.stopPropagation(); onMoveUp(); }}
          disabled={index === 0}
          aria-label={prevAriaLabel}
        >{prevLabel}</button>
        <button
          onPointerDown={stopDrag}
          onClick={e => { e.stopPropagation(); onMoveDown(); }}
          disabled={index === total - 1}
          aria-label={nextAriaLabel}
        >{nextLabel}</button>
      </div>
    </div>
  );
}
