// ── events/ancient.js ────────────────────────────────────────────────────────
// Cross-cultural ancient-world events not belonging to a single region file.
// Greek-specific events live in greece.js; Roman events live in rome.js.
// This file is kept for events that straddle multiple civilisations or
// that are significant enough to sit outside any single regional context.
//
// Data shape: { id, title, year, description, categories, scope }
//   categories[0] - must be a theme slug (warfare | politics | science | trade | society)
//   scope         - 'global' | 'regional' | 'national'
// ─────────────────────────────────────────────────────────────────────────────

export const ancientEvents = [
  {
    id: 'caesar',
    title: 'Assassination of Julius Caesar',
    year: -44,
    description: 'Caesar is stabbed on the Ides of March in the Senate.',
    categories: ['politics', 'rome'],
    scope: 'global',
  },
];
