// ── events/poland.js ─────────────────────────────────────────────────────────
// Historical events where Poland / Poland-Lithuania is the primary actor.
// Includes events that shaped Polish history even when fought on shared ground.
//
// Data shape: { id, title, year, description, categories, scope }
//   categories[0] — must be a theme slug (warfare | politics | science | trade | society)
//   scope         — 'global' | 'regional' | 'national'
// ─────────────────────────────────────────────────────────────────────────────

export const polandEvents = [
  {
    id: 'grunwald',
    title: 'Battle of Grunwald',
    year: 1410,
    description: 'Poland-Lithuania crushes the Teutonic Knights.',
    categories: ['warfare', 'poland', 'europe'],
    scope: 'regional',
  },
  {
    id: 'vienna',
    title: 'Battle of Vienna',
    year: 1683,
    description: 'Polish king Jan III Sobieski relieves the Ottoman siege.',
    categories: ['warfare', 'poland', 'europe'],
    scope: 'regional',
  },
  {
    id: 'polish-part',
    title: 'Partitions of Poland Complete',
    year: 1795,
    description: 'Poland disappears from the map, divided by three empires.',
    categories: ['politics', 'poland', 'europe'],
    scope: 'regional',
  },
  {
    id: 'ww2-start',
    title: 'World War II Begins',
    year: 1939,
    description: 'Germany invades Poland; Britain and France declare war.',
    categories: ['warfare', 'poland', 'europe'],
    scope: 'global',
  },
];
