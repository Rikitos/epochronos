// ── events/europe.js ─────────────────────────────────────────────────────────
// Pan-European events with no single dominant home country, plus events whose
// significance transcends any one nation (world wars, Reformation, etc.).
// Country-specific events live in their own file (england.js, france.js, etc.).
//
// Data shape: { id, title, year, description, categories, scope }
//   categories[0] — must be a theme slug (warfare | politics | science | trade | society)
//   scope         — 'global' | 'regional' | 'national'
// ─────────────────────────────────────────────────────────────────────────────

export const europeEvents = [
  {
    id: 'black-death',
    title: 'Black Death Reaches Europe',
    year: 1347,
    description: 'The plague arrives in Sicily, killing a third of Europe.',
    categories: ['society', 'europe'],
    scope: 'global',
  },
  {
    id: 'constantinople',
    title: 'Fall of Constantinople',
    year: 1453,
    description: 'Ottoman forces take the Byzantine capital after a siege.',
    categories: ['warfare', 'europe'],
    scope: 'global',
  },
  {
    id: 'columbus',
    title: 'Columbus Reaches the Americas',
    year: 1492,
    description: 'Columbus lands in the Caribbean, opening the New World.',
    categories: ['science', 'exploration', 'europe'],
    scope: 'global',
  },
  {
    id: 'luther',
    title: "Luther's 95 Theses",
    year: 1517,
    description: 'Martin Luther sparks the Protestant Reformation.',
    categories: ['society', 'europe'],
    scope: 'global',
  },
  {
    id: 'ww1-start',
    title: 'World War I Begins',
    year: 1914,
    description: 'Assassination of Archduke Franz Ferdinand triggers war.',
    categories: ['warfare', 'europe'],
    scope: 'global',
  },
  {
    id: 'ww1-end',
    title: 'World War I Ends',
    year: 1918,
    description: 'Armistice signed on 11 November, ending four years of war.',
    categories: ['warfare', 'europe'],
    scope: 'global',
  },
  {
    id: 'ww2-end',
    title: 'World War II Ends',
    year: 1945,
    description: 'Germany surrenders in May; Japan in September after atomic bombs.',
    categories: ['warfare', 'europe'],
    scope: 'global',
  },
  {
    id: 'berlin-wall',
    title: 'Berlin Wall Falls',
    year: 1989,
    description: 'East Germany opens the border; crowds tear down the wall.',
    categories: ['politics', 'europe', 'germany'],
    scope: 'global',
  },
];
