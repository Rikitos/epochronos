// ── App.jsx ────────────────────────────────────────────────────────────────
// Root component. Owns theme, all game settings, the start/new-game modal,
// and the bottom sheet.
//
// Settings state lives here so both the StartModal and the Settings sheet
// can read and write them. The modal operates on a local draft copy until
// "Start Game" is confirmed; settings sheet changes apply immediately.
//
// Layout is responsive:
//   < 640px    — vertical stack (mobile portrait)
//   640–1099px — horizontal scrollable row
//   1100px+    — 1 row (≤ 6 cards) or 2-row grid (≥ 7 cards)
//
// Sheet types:
//   'howToPlay' — header ⓘ
//   'eventInfo' — card ⓘ / card tap
//   'settings'  — header ⚙
// ───────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';
import { useGame } from './hooks/useGame';
import { GameBoard } from './components/GameBoard';
import { ResultScreen } from './components/ResultScreen';
import { BottomSheet } from './components/BottomSheet';
import { StartModal } from './components/StartModal';
import { InfoIcon } from './components/InfoIcon';
import { SettingsIcon } from './components/SettingsIcon';
import { formatYear, ALL_CATEGORIES, ERA_RANGES, SCOPE_LEVELS, THEME_LABELS, getCategoryImage, getCategoryStyle } from './data/events';

// Maps era slugs (e.g. 'age-of-revolutions') to display names ('Age of Revolutions')
// so the settings filter chips show human-readable labels instead of raw slugs.
const ERA_LABEL = Object.fromEntries(ERA_RANGES.map(e => [e.slug, e.name]));
import './App.css';

// Returns true while the CSS media query matches; re-renders on change.
function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);
  return matches;
}

// Preset values for the timed mode stepper; 0 = off
const TIMER_OPTIONS = [0, 15, 30, 45, 60, 90, 120];

// ── Sheet content components ─────────────────────────────────────────────────

function HowToPlay() {
  return (
    <>
      <h2>How to play</h2>
      <p>Historical events are dealt in a random order. Sort them from oldest to most recent, then hit Submit.</p>
      <ul>
        <li>Drag a card to reorder it</li>
        <li>Use the arrow buttons to nudge one step at a time</li>
        <li>Tap a card or its ⓘ to learn more about that event</li>
        <li>Your score builds up across rounds — no reset!</li>
      </ul>
    </>
  );
}

// Year is only shown in results phase — revealing it mid-round would be cheating
function EventInfo({ event, showYear }) {
  // Always show the image in the info sheet regardless of the game "show images" toggle.
  // SVGs have their own dark background rect so no gradient fill is needed behind them.
  const imageUrl = getCategoryImage(event.categories, event.id, event.year, event.image);
  const fallbackGradient = getCategoryStyle(event.categories, event.year);
  const imageBg = imageUrl
    ? { backgroundImage: `url(${imageUrl})`, backgroundSize: 'contain', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat' }
    : { background: fallbackGradient };

  return (
    <>
      <div className="sheet-event-image" style={imageBg} />
      <p className="sheet-event-title">{event.title}</p>
      {showYear && <p className="sheet-event-year">{formatYear(event.year)}</p>}
      <p>{event.description}</p>
      <p className="sheet-placeholder">More details coming soon.</p>
    </>
  );
}

function SettingsSheet({
  theme, onToggleTheme,
  cardsPerRound, onSetCards,
  timedSeconds, onSetTimer,
  showImages, onToggleImages,
  showCategories, onToggleCategories,
  allowedCategories, onToggleCategory, onClearCategories,
  allowedScopes, onSetScope,
}) {
  const timerIdx = TIMER_OPTIONS.indexOf(timedSeconds);

  return (
    <>
      <h2>Settings</h2>

      {/* Theme toggle */}
      <div className="setting-row">
        <span className="setting-label">Theme</span>
        <button className="setting-toggle" onClick={onToggleTheme}>
          {theme === 'dark' ? '☾ Dark' : '☀ Light'}
        </button>
      </div>

      {/* Cards per round stepper */}
      <div className="setting-row">
        <span className="setting-label">Cards per round</span>
        <div className="setting-stepper">
          <button onClick={() => onSetCards(n => Math.max(4, n - 1))} disabled={cardsPerRound <= 4}>−</button>
          <span>{cardsPerRound}</span>
          <button onClick={() => onSetCards(n => Math.min(12, n + 1))} disabled={cardsPerRound >= 12}>+</button>
        </div>
      </div>

      {/* Timed mode stepper — cycles through TIMER_OPTIONS */}
      <div className="setting-row">
        <span className="setting-label">Timed mode</span>
        <div className="setting-stepper">
          <button
            onClick={() => onSetTimer(TIMER_OPTIONS[Math.max(0, timerIdx - 1)])}
            disabled={timerIdx === 0}
          >−</button>
          <span style={{ minWidth: 36 }}>
            {timedSeconds === 0 ? 'Off' : `${timedSeconds}s`}
          </span>
          <button
            onClick={() => onSetTimer(TIMER_OPTIONS[Math.min(TIMER_OPTIONS.length - 1, timerIdx + 1)])}
            disabled={timerIdx === TIMER_OPTIONS.length - 1}
          >+</button>
        </div>
      </div>

      {/* Images toggle */}
      <div className="setting-row">
        <span className="setting-label">Show images</span>
        <button className="setting-toggle" onClick={onToggleImages}>
          {showImages ? '✓ On' : 'Off'}
        </button>
      </div>

      {/* Categories label toggle */}
      <div className="setting-row">
        <span className="setting-label">Show categories</span>
        <button className="setting-toggle" onClick={onToggleCategories}>
          {showCategories ? '✓ On' : 'Off'}
        </button>
      </div>

      {/* Era / theme / region filter */}
      <div className="setting-row setting-row--col">
        <div className="setting-row-head">
          <span className="setting-label">Filter</span>
          {allowedCategories.length > 0 && (
            <button className="setting-toggle" onClick={onClearCategories}>Clear all</button>
          )}
        </div>
        <p className="setting-filter-hint">
          {allowedCategories.length === 0
            ? 'All of history — no filter applied'
            : `${allowedCategories.length} filter${allowedCategories.length !== 1 ? 's' : ''} active — next round`}
        </p>

        {/* Era chips — labelled from ERA_RANGES so names stay in sync */}
        <p className="setting-filter-group-label">Era</p>
        <div className="category-chips">
          {ERA_RANGES.map(({ slug, name }) => (
            <button
              key={slug}
              className={`category-chip${allowedCategories.includes(slug) ? ' selected' : ''}`}
              onClick={() => onToggleCategory(slug)}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Theme & Region chips — theme labels come from THEME_LABELS for readability */}
        <p className="setting-filter-group-label">Theme &amp; Region</p>
        <div className="category-chips">
          {ALL_CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`category-chip${allowedCategories.includes(cat) ? ' selected' : ''}`}
              onClick={() => onToggleCategory(cat)}
            >
              {THEME_LABELS[cat] ?? cat}
            </button>
          ))}
        </div>
      </div>

      {/* Significance / scope ceiling — selecting a level includes it and everything above */}
      <div className="setting-row setting-row--col">
        <div className="setting-row-head">
          <span className="setting-label">Significance</span>
        </div>
        <p className="setting-filter-hint">
          {allowedScopes[0] === 'global'   ? 'World-changing events only'         :
           allowedScopes[0] === 'regional' ? 'Regional and global events'         :
                                             'All events — including local history'}
        </p>
        <div className="category-chips">
          {SCOPE_LEVELS.map(({ slug, name, desc }) => (
            <button
              key={slug}
              className={`category-chip${allowedScopes.includes(slug) ? ' selected' : ''}`}
              onClick={() => onSetScope(slug)}
              title={desc}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  // ── Settings state ────────────────────────────────────────────────────────
  const [cardsPerRound,     setCardsPerRound]     = useState(6);
  const [timedSeconds,      setTimedSeconds]      = useState(0);
  const [showImages,        setShowImages]        = useState(true);
  // showCategories: display the primary category tag on each card
  const [showCategories,    setShowCategories]    = useState(true);
  // allowedCategories: [] = all; populated = only those categories drawn
  const [allowedCategories, setAllowedCategories] = useState([]);
  // allowedScopes: single-element array with the chosen ceiling ('global'|'regional'|'national')
  // 'global' = world-significant events only (default); 'national' = all events including local
  const [allowedScopes,     setAllowedScopes]     = useState(['global']);

  const toggleCategory = (cat) =>
    setAllowedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );

  // Scope is a ceiling, not a toggle — clicking always sets exactly one level
  const setScope = (scope) => setAllowedScopes([scope]);

  const { cards, setCards, phase, score, results, moveCard, submit, nextRound, resetGame } =
    useGame(cardsPerRound, allowedCategories, allowedScopes);

  // ── Start modal ───────────────────────────────────────────────────────────
  // showModal: true on first load and whenever "New Game" is triggered
  const [showModal, setShowModal] = useState(true);

  // Called when the player confirms settings in the StartModal.
  // Updates all settings state and resets the game with the new values.
  function handleStart(settings) {
    setCardsPerRound(settings.cardsPerRound);
    setTimedSeconds(settings.timedSeconds);
    setShowImages(settings.showImages);
    setShowCategories(settings.showCategories);
    setAllowedCategories(settings.allowedCategories);
    setAllowedScopes(settings.allowedScopes ?? ['global']);
    // Pass new values directly — don't rely on the state setters above having flushed yet
    resetGame(settings.cardsPerRound, settings.allowedCategories, settings.allowedScopes ?? []);
    setShowModal(false);
  }

  // ── Theme ─────────────────────────────────────────────────────────────────
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') ?? 'dark');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  // ── Layout detection ──────────────────────────────────────────────────────
  const isVertical = useMediaQuery('(max-width: 639px)');
  const isWide     = useMediaQuery('(min-width: 1100px)');

  // ── Bottom sheet ──────────────────────────────────────────────────────────
  const [sheet, setSheet] = useState(null);
  const closeSheet = () => setSheet(null);

  const openHowToPlay = () => setSheet({ type: 'howToPlay' });
  const openSettings  = () => setSheet({ type: 'settings' });
  const openEventInfo = (event) =>
    setSheet({ type: 'eventInfo', event, showYear: phase === 'results' });

  return (
    <div className="app">
      <header className="app-header">
        <button className="header-icon-btn" onClick={openHowToPlay} aria-label="How to play">
          <InfoIcon size={15} />
        </button>

        <h1 className="app-title">Epochronos</h1>

        {score.total > 0 && (
          <span className="header-score">{score.correct} / {score.total}</span>
        )}

        <button className="header-icon-btn header-icon-btn--right" onClick={openSettings} aria-label="Settings">
          <SettingsIcon size={15} />
        </button>
      </header>

      <main className="app-main">
        {phase === 'playing' ? (
          <GameBoard
            cards={cards}
            setCards={setCards}
            onMoveCard={moveCard}
            onSubmit={submit}
            onCardInfo={openEventInfo}
            isVertical={isVertical}
            isWide={isWide}
            timedSeconds={timedSeconds}
            showImages={showImages}
            showCategories={showCategories}
          />
        ) : (
          <ResultScreen
            results={results}
            score={score}
            onNext={nextRound}
            onNewGame={() => setShowModal(true)}
            onCardInfo={openEventInfo}
            isVertical={isVertical}
            isWide={isWide}
            showImages={showImages}
            showCategories={showCategories}
          />
        )}
      </main>

      {/* Start / New Game modal — shown on first load and on restart */}
      {showModal && (
        <StartModal
          defaults={{
            cardsPerRound,
            timedSeconds,
            showImages,
            showCategories,
            allowedCategories,
            allowedScopes,
          }}
          onStart={handleStart}
        />
      )}

      <BottomSheet open={sheet !== null} onClose={closeSheet}>
        {sheet?.type === 'howToPlay' && <HowToPlay />}
        {sheet?.type === 'eventInfo' && (
          <EventInfo event={sheet.event} showYear={sheet.showYear} />
        )}
        {sheet?.type === 'settings' && (
          <SettingsSheet
            theme={theme}
            onToggleTheme={toggleTheme}
            cardsPerRound={cardsPerRound}
            onSetCards={setCardsPerRound}
            timedSeconds={timedSeconds}
            onSetTimer={setTimedSeconds}
            showImages={showImages}
            onToggleImages={() => setShowImages(v => !v)}
            showCategories={showCategories}
            onToggleCategories={() => setShowCategories(v => !v)}
            allowedCategories={allowedCategories}
            onToggleCategory={toggleCategory}
            onClearCategories={() => setAllowedCategories([])}
            allowedScopes={allowedScopes}
            onSetScope={setScope}
          />
        )}
      </BottomSheet>
    </div>
  );
}
