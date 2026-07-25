// ── events/ancient.js ────────────────────────────────────────────────────────
// Historical events from the ancient world (pre-476 AD).
// Covers Greek city-states and the Roman Republic/Empire.
//
// Data shape: { id, title, year, description, categories, scope }
//   categories[0] — must be a theme slug (warfare | politics | science | trade | society)
//   scope         — 'global' | 'regional' | 'national'
// ─────────────────────────────────────────────────────────────────────────────

export const ancientEvents = [
  {
    id: 'marathon',
    title: 'Battle of Marathon',
    year: -490,
    description: 'Greeks defeat Persian forces on the plain of Marathon.',
    categories: ['warfare', 'greece'],
    scope: 'regional',
  },
  {
    id: 'thermopylae',
    title: 'Battle of Thermopylae',
    year: -480,
    description: '300 Spartans and allies hold the pass against Xerxes.',
    categories: ['warfare', 'greece'],
    scope: 'regional',
  },
  {
    id: 'caesar',
    title: 'Assassination of Julius Caesar',
    year: -44,
    description: 'Caesar is stabbed on the Ides of March in the Senate.',
    categories: ['politics', 'rome'],
    scope: 'global',
  },
];
