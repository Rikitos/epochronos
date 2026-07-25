// ── StartModal.jsx ──────────────────────────────────────────────────────────
// Centred popup shown on first load and when "New Game" is requested.
// On desktop (≥ 640px) it renders as a centred dialog; on mobile it still
// uses the same layout but fills more of the screen.
//
// Props:
//   defaults — current setting values used to pre-populate the draft form:
//              { cardsPerRound, timedSeconds, showImages, showCategories,
//                allowedCategories, allowedScopes }
//   onStart  — called with the same shape when the player clicks Start Game
// ───────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { ERA_RANGES, SCOPE_LEVELS } from '../data/events';

// Preset timer values; 0 means off
const TIMER_OPTIONS = [0, 15, 30, 45, 60, 90, 120];

// Category filter groups shown in the modal (era / theme / region).
// Era items are generated from ERA_RANGES so they always stay in sync with events.js.
const FILTER_GROUPS = [
  {
    label: 'Era',
    // ERA_RANGES already ordered chronologically; map to {slug, label} shape
    items: ERA_RANGES.map(e => ({ slug: e.slug, label: e.name })),
  },
  {
    label: 'Theme',
    items: [
      { slug: 'warfare',  label: 'Warfare' },
      { slug: 'politics', label: 'Politics' },
      { slug: 'science',  label: 'Science & Discovery' },
      { slug: 'trade',    label: 'Trade & Economy' },
      { slug: 'society',  label: 'Society' },
    ],
  },
  {
    label: 'Region',
    items: [
      { slug: 'england', label: 'England' },
      { slug: 'france',  label: 'France' },
      { slug: 'poland',  label: 'Poland' },
      { slug: 'europe',  label: 'Europe' },
      { slug: 'greece',  label: 'Greece' },
      { slug: 'rome',    label: 'Rome' },
      { slug: 'germany', label: 'Germany' },
    ],
  },
];

export function StartModal({ defaults, onStart }) {
  // Local draft settings — changes here don't affect the running game until Start is clicked
  const [cardsPerRound,     setCardsPerRound]     = useState(defaults.cardsPerRound);
  const [timedSeconds,      setTimedSeconds]      = useState(defaults.timedSeconds);
  const [showImages,        setShowImages]        = useState(defaults.showImages);
  const [showCategories,    setShowCategories]    = useState(defaults.showCategories);
  const [allowedCategories, setAllowedCategories] = useState(defaults.allowedCategories);
  // allowedScopes: single-element ceiling ('global'|'regional'|'national'); default = 'global'
  const [allowedScopes,     setAllowedScopes]     = useState(defaults.allowedScopes ?? ['global']);

  // Index into TIMER_OPTIONS for the stepper buttons
  const timerIdx = TIMER_OPTIONS.indexOf(timedSeconds);

  // Toggle a single category slug in/out of the filter selection
  const toggleCategory = (slug) =>
    setAllowedCategories(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );

  // Scope is a ceiling selector — clicking always sets exactly one level
  const setScope = (slug) => setAllowedScopes([slug]);

  function handleStart() {
    onStart({ cardsPerRound, timedSeconds, showImages, showCategories, allowedCategories, allowedScopes });
  }

  return (
    <div className="modal-overlay">
      <div className="modal" role="dialog" aria-modal="true" aria-label="Game setup">

        {/* ── Title block ── */}
        <div className="modal-header">
          <h2 className="modal-title">Epochronos</h2>
          <p className="modal-subtitle">Sort history. Beat time.</p>
        </div>

        {/* ── Game settings ── */}
        <section className="modal-section">
          <p className="modal-section-label">Settings</p>

          {/* Cards per round stepper */}
          <div className="setting-row">
            <span className="setting-label">Cards per round</span>
            <div className="setting-stepper">
              <button onClick={() => setCardsPerRound(n => Math.max(4, n - 1))} disabled={cardsPerRound <= 4}>−</button>
              <span>{cardsPerRound}</span>
              <button onClick={() => setCardsPerRound(n => Math.min(12, n + 1))} disabled={cardsPerRound >= 12}>+</button>
            </div>
          </div>

          {/* Timed mode stepper — cycles TIMER_OPTIONS */}
          <div className="setting-row">
            <span className="setting-label">Timed mode</span>
            <div className="setting-stepper">
              <button
                onClick={() => setTimedSeconds(TIMER_OPTIONS[Math.max(0, timerIdx - 1)])}
                disabled={timerIdx === 0}
              >−</button>
              <span style={{ minWidth: 36, textAlign: 'center' }}>
                {timedSeconds === 0 ? 'Off' : `${timedSeconds}s`}
              </span>
              <button
                onClick={() => setTimedSeconds(TIMER_OPTIONS[Math.min(TIMER_OPTIONS.length - 1, timerIdx + 1)])}
                disabled={timerIdx === TIMER_OPTIONS.length - 1}
              >+</button>
            </div>
          </div>

          {/* Show images toggle */}
          <div className="setting-row">
            <span className="setting-label">Show images</span>
            <button className="setting-toggle" onClick={() => setShowImages(v => !v)}>
              {showImages ? '✓ On' : 'Off'}
            </button>
          </div>

          {/* Show categories toggle */}
          <div className="setting-row modal-section-last-row">
            <span className="setting-label">Show categories</span>
            <button className="setting-toggle" onClick={() => setShowCategories(v => !v)}>
              {showCategories ? '✓ On' : 'Off'}
            </button>
          </div>
        </section>

        {/* ── Period / region filter ── */}
        <section className="modal-section">
          <div className="modal-filter-header">
            <p className="modal-section-label">Filter by period / region</p>
            {allowedCategories.length > 0 && (
              <button className="setting-toggle" onClick={() => setAllowedCategories([])}>
                Clear all
              </button>
            )}
          </div>
          <p className="setting-filter-hint" style={{ marginBottom: 10 }}>
            {allowedCategories.length === 0
              ? 'All of history — no filter applied'
              : `${allowedCategories.length} filter${allowedCategories.length > 1 ? 's' : ''} active`}
          </p>

          {/* Era / Theme / Region chip groups */}
          {FILTER_GROUPS.map(group => (
            <div key={group.label} className="modal-filter-group">
              <span className="modal-filter-group-label">{group.label}</span>
              <div className="category-chips">
                {group.items.map(({ slug, label }) => (
                  <button
                    key={slug}
                    className={`category-chip${allowedCategories.includes(slug) ? ' selected' : ''}`}
                    onClick={() => toggleCategory(slug)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* ── Scope ceiling — selecting a level includes it and all broader scopes ── */}
        <section className="modal-section">
          <p className="modal-section-label">Significance</p>
          <p className="setting-filter-hint" style={{ marginBottom: 10 }}>
            {allowedScopes[0] === 'global'   ? 'World-changing events only'         :
             allowedScopes[0] === 'regional' ? 'Regional and global events'         :
                                               'All events — including local history'}
          </p>
          <div className="category-chips">
            {SCOPE_LEVELS.map(({ slug, name, desc }) => (
              <button
                key={slug}
                className={`category-chip${allowedScopes.includes(slug) ? ' selected' : ''}`}
                onClick={() => setScope(slug)}
                title={desc}
              >
                {name}
              </button>
            ))}
          </div>
        </section>

        {/* ── Start button ── */}
        <button className="btn-submit modal-start-btn" onClick={handleStart}>
          Start Game
        </button>
      </div>
    </div>
  );
}
