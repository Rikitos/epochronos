// ── events.js ──────────────────────────────────────────────────────────────
// Entry point for all event data and game logic.
//
// Raw event arrays live in ./events/ split by primary region:
//   ancient.js  — ancient Greece and Rome
//   england.js  — English / British history
//   france.js   — French history
//   poland.js   — Polish history
//   europe.js   — pan-European and world events
//
// To add new events: edit the appropriate region file, or create a new one
// and import it here. This file owns all constants, helpers, and image/colour
// maps; the region files are purely data (no imports needed).
//
// Event data shape: { id, title, year, description, categories, scope, image? }
//   year        — integer; negative = BC (e.g. -490 = 490 BC)
//   id          — stable slug used as React key and dnd-kit draggable id
//   categories  — ordered array; categories[0] must be a theme slug
//   scope       — 'global' | 'regional' | 'national'
//   image       — optional '/img/...' path; pins a specific image to this event,
//                 overriding the category/era lookup entirely
// ───────────────────────────────────────────────────────────────────────────

import { ancientEvents } from './events/ancient';
import { englandEvents } from './events/england';
import { franceEvents  } from './events/france';
import { polandEvents  } from './events/poland';
import { europeEvents  } from './events/europe';

// Merge all region arrays into a single pool; order within the array doesn't
// matter because getRandomRound always shuffles before dealing.
export const events = [
  ...ancientEvents,
  ...englandEvents,
  ...franceEvents,
  ...polandEvents,
  ...europeEvents,
];

// The 5 canonical themes — first category on every event must be one of these.
// The card's "show categories" label displays the theme, not the region.
export const THEMES = ['warfare', 'politics', 'science', 'trade', 'society'];

// Human-readable labels for theme slugs used on card faces and filter chips.
export const THEME_LABELS = {
  warfare:  'Warfare',
  politics: 'Politics',
  science:  'Science & Discovery',
  trade:    'Trade & Economy',
  society:  'Society',
};

// Region slugs used for the filter UI alongside themes and eras.
export const ALL_CATEGORIES = [
  ...THEMES,
  'europe', 'greece', 'rome', 'france', 'england', 'poland', 'germany',
];

// Scope levels ordered from broadest to most specific.
// An event's scope describes how far its significance reaches.
export const SCOPE_LEVELS = [
  { slug: 'global',   name: 'Global',   desc: 'Only world-changing, must-know events' },
  { slug: 'regional', name: 'Regional', desc: 'Regional and global significance — broader pool' },
  { slug: 'national', name: 'National', desc: 'All events, including country-specific ones' },
];

// ── Era definitions ───────────────────────────────────────────────────────────
// Each era has a display name and an inclusive date range.
// start is undefined for the first era (covers everything before end).
// end is undefined for an open-ended era.
// Events are assigned to an era by year at runtime — no era tag needed on the event itself.
export const ERA_RANGES = [
  { slug: 'ancient',            name: 'Ancient',            end: 475 },
  { slug: 'early-medieval',     name: 'Early Medieval',     start: 476,  end: 999  },
  { slug: 'medieval',           name: 'Medieval',           start: 1000, end: 1399 },
  { slug: 'renaissance',        name: 'Renaissance',        start: 1400, end: 1516 },
  { slug: 'reformation',        name: 'Reformation',        start: 1517, end: 1649 },
  { slug: 'enlightenment',      name: 'Enlightenment',      start: 1650, end: 1774 },
  { slug: 'age-of-revolutions', name: 'Age of Revolutions', start: 1775, end: 1824 },
  { slug: 'victorian',          name: 'Victorian',          start: 1825, end: 1909 },
  { slug: 'world-wars',         name: 'World Wars',         start: 1910, end: 1945 },
  { slug: 'cold-war',           name: 'Cold War',           start: 1946, end: 1991 },
];

// Return the era slug for a given year by matching against ERA_RANGES.
// Returns null for years outside all defined ranges (e.g. post-1991).
export function getEraFromYear(year) {
  for (const era of ERA_RANGES) {
    const afterStart = era.start === undefined || year >= era.start;
    const beforeEnd  = era.end   === undefined || year <= era.end;
    if (afterStart && beforeEnd) return era.slug;
  }
  return null;
}

// ── Category colours ──────────────────────────────────────────────────────
// Each entry is [shadowColour, highlightColour] used to build a CSS gradient
// for the card image area. Chosen to feel historically themed per category.
const CATEGORY_COLORS = {
  // ── Eras (applied by date via getEraFromYear) ──────────────────────────
  'ancient':            ['#2e1500', '#6b3a0a'],  // amber-brown
  'early-medieval':     ['#1a0830', '#401868'],  // deep purple (dark ages)
  'medieval':           ['#0a0c20', '#202860'],  // blue-purple (chivalry)
  'renaissance':        ['#081a10', '#164030'],  // forest green
  'reformation':        ['#1c0e06', '#402010'],  // burnt sienna
  'enlightenment':      ['#040e1c', '#0c2448'],  // deep navy (reason)
  'age-of-revolutions': ['#0a0618', '#20104a'],  // dark indigo (upheaval)
  'victorian':          ['#061414', '#102e2e'],  // dark teal-slate (industrial)
  'world-wars':         ['#1c0606', '#400e0e'],  // dark crimson
  'cold-war':           ['#060810', '#10182e'],  // steel blue
  // ── Themes ────────────────────────────────────────────────────────────
  warfare:  ['#1c0606', '#420e0e'],  // dark crimson-red
  politics: ['#14100a', '#382800'],  // deep gold/ochre
  science:  ['#030d14', '#0d3a4a'],  // dark teal (discovery)
  trade:    ['#181200', '#3a2c00'],  // warm amber
  society:  ['#100a18', '#28183c'],  // deep purple
  // ── Regions ───────────────────────────────────────────────────────────
  europe:  ['#080812', '#18183a'],
  greece:  ['#080e1a', '#142860'],
  rome:    ['#180a00', '#502810'],
  france:  ['#06061a', '#10105c'],
  england: ['#06101a', '#122850'],
  poland:  ['#180008', '#540018'],
  germany: ['#080808', '#222222'],
};

// ── Category images ───────────────────────────────────────────────────────
// SVG silhouettes stored in /public/img/ for the "show images" mode.
// Each category maps to an array of image paths so different events in the
// same category can show varied artwork. getCategoryImage picks deterministically
// using the event ID so the same card always shows the same image.
const CATEGORY_IMAGES = {
  // ── Era-based images (looked up by computed era slug) ─────────────────
  ancient:  [
    '/img/cat-ancient.svg',      // Greek temple with full colonnade and pediment
    '/img/cat-ancient-2.svg',    // Nefertiti / Egyptian queen bust profile
    '/img/cat-ancient-3.svg',    // Spartan / Greek warrior helmet
    '/img/cat-ancient-4.svg',    // Greek amphora urn with handles
    '/img/cat-ancient-5.svg',    // Bastet Egyptian cat goddess statue
    '/img/cat-ancient-6.svg',    // Egyptian pharaoh / human figurine
  ],
  medieval: [
    '/img/cat-medieval.svg',     // Castle with battlements
    '/img/cat-medieval-2.svg',   // Medieval knight / jouster figure
    '/img/cat-medieval-3.svg',   // Gothic cathedral with spires
    '/img/cat-medieval-4.svg',   // Heraldic shield quartered
  ],
  // ── Theme images ──────────────────────────────────────────────────────
  warfare:  [
    '/img/cat-war.svg',          // Kite shield flanked by two swords
    '/img/cat-war-2.svg',        // Warrior / archer figure
    '/img/cat-war-3.svg',        // Cannon on wheeled carriage
    '/img/cat-war-4.svg',        // Crossed swords / battle blades
  ],
  politics: [
    '/img/cat-politics.svg',     // Scroll / law document with text lines
    '/img/cat-politics-2.svg',   // Scales of justice in a globe
    '/img/cat-politics-3.svg',   // Parliament building with columns
    '/img/cat-politics-4.svg',   // Gavels / hammers crossed — authority
  ],
  science:  [
    '/img/cat-innovation.svg',   // Lightbulb with rays — idea / invention
    '/img/cat-innovation-2.svg', // Chemistry flask — science and discovery
    '/img/cat-innovation-3.svg', // Calculator with arithmetic operators
    '/img/cat-innovation-4.svg', // Atom diagram with orbital nodes
  ],
  // ── Visual sub-type images (checked before theme, never shown as filter chips) ─
  exploration: [
    '/img/cat-exploration.svg',  // Sailing ship with billowing sails
    '/img/cat-exploration-2.svg',// Tropical island with palm trees and sun
    '/img/cat-exploration-3.svg',// Compass dial with cardinal needles
    '/img/cat-exploration-4.svg',// Earth globe (blue ocean, green landmass)
  ],
  // ── Region images ─────────────────────────────────────────────────────
  france:  [
    '/img/cat-france.svg',       // French tricolor flag (blue, white, red stripes)
    '/img/cat-france-2.svg',     // Three heraldic fleur-de-lis in royal blue
  ],
  england: [
    '/img/cat-england.svg',      // St. George's Cross (England flag, white + red cross)
    '/img/cat-england-2.svg',    // Lighthouse tower with beacon lantern
  ],
  poland:  [
    '/img/cat-poland.svg',       // Polish flag (white over red horizontal stripes)
  ],
  // ── Legacy key preserved so old innovation references still resolve ───
  innovation: [
    '/img/cat-innovation.svg',   // Lightbulb with rays — idea / invention
    '/img/cat-innovation-2.svg', // Chemistry flask — science and discovery
    '/img/cat-innovation-3.svg', // Calculator with arithmetic operators — math and science
    '/img/cat-innovation-4.svg', // Atom diagram with orbital nodes — physics and discovery
  ],
};

// Backend-only sub-type tags that override the primary theme image when present.
// These are never exposed as filter chips or start-menu options.
const VISUAL_SUBTYPES = new Set(['exploration']);

// Return an image path for this event, or null to fall back to the CSS gradient.
// Priority order: pinned image → era → visual sub-type (e.g. exploration) → theme → region.
// Sub-types are extracted and promoted so 'exploration' beats 'science' without
// changing the categories[0] = theme slug rule.
export function getCategoryImage(categories = [], eventId = '', year = null, image = null) {
  // Event-level pin overrides everything — add `image: '/img/...'` to the event object
  if (image) return image;
  const era  = year !== null ? getEraFromYear(year) : null;
  const hash = eventId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  // Hoist any visual sub-types ahead of the primary theme
  const subtypes    = categories.filter(c => VISUAL_SUBTYPES.has(c));
  const lookupOrder = era ? [era, ...subtypes, ...categories] : [...subtypes, ...categories];
  for (const cat of lookupOrder) {
    const imgs = CATEGORY_IMAGES[cat];
    if (imgs) return imgs[hash % imgs.length];
  }
  return null;
}

// Return a CSS gradient string for a card.
// Era (derived from year) always takes precedence — it is date-accurate and
// gives each historical period a distinct colour without relying on manual tags.
// Falls back to the first explicit category if the year is outside all defined eras.
export function getCategoryStyle(categories = [], year = null) {
  if (year !== null) {
    const era = getEraFromYear(year);
    if (era && CATEGORY_COLORS[era]) {
      const [dark, light] = CATEGORY_COLORS[era];
      return `linear-gradient(160deg, ${dark} 0%, ${light} 100%)`;
    }
  }
  const primary = categories[0] || 'europe';
  const [dark, light] = CATEGORY_COLORS[primary] ?? CATEGORY_COLORS.europe;
  return `linear-gradient(160deg, ${dark} 0%, ${light} 100%)`;
}

// ── Scope ceiling helpers ─────────────────────────────────────────────────────
// Scope is a ceiling, not an exact match. Selecting 'national' includes national,
// regional, and global events; 'regional' includes regional and global; 'global' = global only.
const SCOPE_RANK = { global: 0, regional: 1, national: 2 };

// Regions at country level imply national ceiling; continent level imply regional ceiling.
const COUNTRY_REGIONS    = new Set(['france', 'england', 'poland', 'greece', 'rome', 'germany']);
const CONTINENT_REGIONS  = new Set(['europe']);

// Returns the effective scope ceiling slug for filtering.
// Manual allowedScopes takes priority; otherwise derived from the selected regions.
// Default (no region, no manual scope) = 'global' — shows only world-significant events.
function getScopeCeiling(allowedCategories, allowedScopes) {
  if (allowedScopes && allowedScopes.length > 0) {
    // Use the most inclusive (highest rank) manually selected scope as the ceiling
    const maxRank = Math.max(...allowedScopes.map(s => SCOPE_RANK[s] ?? 0));
    return Object.keys(SCOPE_RANK).find(k => SCOPE_RANK[k] === maxRank) ?? 'global';
  }
  // Derive from selected regions: country → national, continent → regional, else → global
  if (allowedCategories && allowedCategories.some(c => COUNTRY_REGIONS.has(c))) return 'national';
  if (allowedCategories && allowedCategories.some(c => CONTINENT_REGIONS.has(c))) return 'regional';
  return 'global';
}

// Pick `count` random events filtered by category and scope ceiling.
// Era is computed from each event's year — no era tag needed on the event.
// allowedCategories: era/theme/region slugs to draw from; [] or null = no category filter
// allowedScopes: single-element array with the chosen ceiling slug; [] = auto-derive from regions
// If the filtered pool is smaller than count, draw as many as available (min 1).
export function getRandomRound(count = 6, allowedCategories = null, allowedScopes = null) {
  const filterCat   = allowedCategories && allowedCategories.length > 0;
  const ceiling     = getScopeCeiling(allowedCategories, allowedScopes);
  const ceilingRank = SCOPE_RANK[ceiling] ?? 0;

  const pool = events.filter(e => {
    // Scope ceiling: exclude events more local than the ceiling
    if ((SCOPE_RANK[e.scope] ?? 0) > ceilingRank) return false;
    // Category filter: event must match at least one selected era/theme/region
    if (filterCat) {
      const era = getEraFromYear(e.year);
      const effective = era ? [era, ...e.categories] : e.categories;
      if (!effective.some(c => allowedCategories.includes(c))) return false;
    }
    return true;
  });

  // Use filtered pool even if smaller than requested count; only fall back to global
  // events if the filter produced nothing at all (avoids blank rounds on narrow filters)
  const safePool  = pool.length >= 1 ? pool : events.filter(e => e.scope === 'global');
  const drawCount = Math.min(count, safePool.length);
  const shuffled  = [...safePool].sort(() => Math.random() - 0.5);
  const picked    = shuffled.slice(0, drawCount);
  return picked.sort(() => Math.random() - 0.5);
}

// Format a year integer for display, converting negatives to "X BC".
export function formatYear(year) {
  return year < 0 ? `${Math.abs(year)} BC` : `${year} AD`;
}
