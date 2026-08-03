// ── events/europe.js ─────────────────────────────────────────────────────────
// Pan-European events with no single dominant home country, plus events whose
// significance transcends any one nation (world wars, Reformation, etc.).
// Country-specific events live in their own file (england.js, france.js, etc.).
//
// Data shape: { id, title, year, description, categories, scope }
//   categories[0] - must be a theme slug (warfare | politics | science | trade | society)
//   scope         - 'global' | 'regional' | 'national'
// ─────────────────────────────────────────────────────────────────────────────

export const europeEvents = [
  {
    id: 'slavic-migration',
    title: 'Slavic Peoples Expand Across Europe',
    year: 550,
    description: "Between roughly 500 and 700 AD, Slavic-speaking peoples - previously confined to a heartland somewhere in modern Poland and Ukraine - expand in three great waves: westward into Germany and the Balkans, southward into Greece and Anatolia, and eastward across the Russian plain to the Urals. The migration is the most consequential demographic shift in European history after the Germanic invasions of the 4th–5th centuries: Slavic languages today are spoken by more Europeans than any other language family. The Eastern Slavs who settle the Russian plain become the ancestors of the Russians, Ukrainians, and Belarusians; the Southern Slavs become the Bulgarians, Serbs, Croats, and Slovenes; the Western Slavs become the Poles, Czechs, and Slovaks.",
    categories: ['society', 'europe', 'russia', 'poland'],
    scope: 'regional',
  },
  {
    id: 'black-death',
    title: 'Black Death Reaches Europe',
    year: 1347,
    description: "The Black Death arrives in Sicily in October 1347 aboard Genoese trading ships from Caffa on the Black Sea, where Mongol forces had reportedly catapulted plague-infected corpses over the walls. It spreads through every Mediterranean port within months, reaching France and England in 1348, Scandinavia and Russia by 1350. The bacterium Yersinia pestis kills in bubonic form (swollen lymph nodes), septicaemic form (blood poisoning), and pneumonic form (lung infection), the last spreading person-to-person through the air; most victims die within days of the first symptoms. Contemporaries have no framework to explain it: Jewish communities are massacred across the Rhineland, accused of poisoning wells; flagellant brotherhoods march from town to town whipping themselves in public penance; Pope Clement VI issues bulls condemning the persecution of Jews and explaining (correctly) that the plague kills Jews and Christians alike — both are ignored. Estimates of European mortality range from 30 to 60 percent; between 25 and 50 million people die. The demographic collapse transforms European society: labour becomes scarce, peasants gain bargaining power, feudal structures crack, wages rise. The plague returns in waves through the 15th century; Europe does not recover its pre-1347 population until the 16th century.",
    categories: ['society', 'spain', 'russia', 'europe'],
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
    categories: ['warfare', 'russia', 'europe'],
    scope: 'global',
  },
  {
    id: 'ww1-end',
    title: 'World War I Ends',
    year: 1918,
    description: 'Armistice signed on 11 November, ending four years of war.',
    categories: ['warfare', 'russia', 'europe'],
    scope: 'global',
  },
  {
    id: 'ww2-end',
    title: 'World War II Ends',
    year: 1945,
    description: 'Germany surrenders in May; Japan in September after atomic bombs.',
    categories: ['warfare', 'russia', 'europe'],
    scope: 'global',
  },
  {
    id: 'berlin-wall',
    title: 'Berlin Wall Falls',
    year: 1989,
    description: 'East Germany opens the border; crowds tear down the wall.',
    categories: ['politics', 'europe', 'germany', 'russia'],
    scope: 'global',
  },
];
