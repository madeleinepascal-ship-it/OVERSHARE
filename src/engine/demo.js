// A believable sample year for when someone types a handle instead of
// uploading their export. Seeded from the handle, so the same handle always
// gets the same year. Every result built from this is labelled as a preview.

import { HOODS } from '../data/places.js';

const TEMPLATES = {
  food: [
    'Sunday brunch in {hood} hits different 🥞 #brunch #nyceats',
    'Best ramen of my life?? {hood} you’ve done it again 🍜',
    'Dollar slice > everything #nycpizza',
    'Pizza on the stoop in {hood} 🍕',
    'Dim sum run, no notes #nycfood',
    'Birthday dinner at our fave spot in {hood} 🥂',
    'Bodega egg and cheese is a food group #nyceats',
    'Bagel run before the chaos #nycfood',
    'Smorgasburg tacos, sunburn included 🌮',
  ],
  drinks: [
    'Negroni o’clock in {hood} 🍸',
    'Natty wine and bad decisions #nycnightlife',
    'Happy hour turned into happy night in {hood}',
    'This bartender deserves a raise. And a medal. #cocktails',
    'Rooftop spritz, skyline, no complaints 🍹',
    'Speakeasy behind a phone booth?? only in {hood} #cocktailbar',
  ],
  music: [
    'FRONT ROW. I’m not okay 🎸 #livemusic',
    'Tiny venue, huge band. {hood} never misses #gig',
    'DJ set till 4am, sorry to my calves #brooklyntechno',
    'SummerStage in the park, free and perfect #concert',
    'Jazz on a Tuesday in {hood} 🎷',
    'Encore was a whole second show #nycconcert',
  ],
  coffee: [
    'but first, coffee ☕ #nyccoffee',
    'Found the best flat white in {hood}',
    'Matcha era continues 🍵',
    'Laptop, cortado, pretending to work in {hood}',
  ],
  art: [
    'Lost two hours in this gallery in {hood} 🖼️',
    'Museum date > dinner date #art',
    'This mural in {hood} 😍 #streetart',
    'Rush tickets for a Broadway show, crying in the mezzanine #theater',
    'Saw the new exhibition, still thinking about it #museum',
  ],
  outdoors: [
    'Golden hour in the park 🌅 #nycparks',
    'Picnic szn in {hood} 🧺',
    'Sunset on the waterfront, not a filter #sunset',
    'Beach day at Rockaway 🏖️',
    'Ferry to nowhere, just for the view #nycsunset',
  ],
  movement: [
    'Run club Tuesdays, {hood} crew 🏃 #runclub',
    'Half marathon DONE 🏅 #running',
    'Pilates girlie arc #pilates',
    '6am yoga in {hood}, who am I',
    'Citi Bike cycling to the beach, legs gone #cycling',
  ],
  style: [
    'Thrifted the whole fit 🧥 #thrift #ootd',
    'Vintage haul from {hood} #vintage',
    'Fit check before the party #fitcheck',
  ],
  books: [
    'Bookstore crawl in {hood} 📚 #bookstagram',
    'Currently reading on the G train (it was late, again) #books',
    'Book club was mostly wine, some book #bookclub',
  ],
  pets: [
    'Dog run politics in {hood} 🐕',
    'Good boy of the year award goes to… #dogsofinstagram',
    'Adopted this little menace a year ago today 🐶 #adoptdontshop',
  ],
  other: [
    'Photo dump 📸',
    'Life lately',
    'No caption, just vibes',
    'Home for the holidays ✨',
    'Birthday week recap 🎂',
    'Missed the train, found this',
  ],
};

// Roughly where Instagram-posting New Yorkers live and hang out.
const BOROUGH_WEIGHTS = { brooklyn: 4, manhattan: 3.5, queens: 1.6, bronx: 0.6, 'staten-island': 0.3 };

function seededRandom(seed) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = (rand, list) => list[Math.floor(rand() * list.length)];

function weightedPick(rand, weights) {
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  let r = rand() * total;
  for (const [key, w] of Object.entries(weights)) {
    if ((r -= w) <= 0) return key;
  }
  return Object.keys(weights)[0];
}

export function demoPosts(handle, { now = Date.now(), count } = {}) {
  const rand = seededRandom(handle.trim().toLowerCase().replace(/^@/, '') || 'overshare');
  const homeBorough = weightedPick(rand, BOROUGH_WEIGHTS);
  const shuffle = (list) => [...list].sort(() => rand() - 0.5);
  // Three spots near home, one across the river.
  const hoods = [
    ...shuffle(HOODS.filter((h) => h.borough === homeBorough)).slice(0, 3),
    pick(rand, HOODS.filter((h) => h.borough !== homeBorough)),
  ];

  // Everyone has a couple of things they post about far more than the rest.
  const weights = { other: 3 };
  for (const id of Object.keys(TEMPLATES)) if (id !== 'other') weights[id] = 0.3 + rand() * 1.2;
  const favorites = shuffle(Object.keys(weights).filter((k) => k !== 'other'));
  weights[favorites[0]] += 4;
  weights[favorites[1]] += 2.5;
  weights[favorites[2]] += 1.5;

  const total = count ?? 110 + Math.floor(rand() * 60);
  const yearMs = 365 * 24 * 60 * 60 * 1000;
  const posts = [];
  for (let i = 0; i < total; i++) {
    const kind = weightedPick(rand, weights);
    // Lean on a favorite neighborhood so the year has a clear home turf.
    const hood = rand() < 0.5 ? hoods[0] : pick(rand, hoods);
    let caption = pick(rand, TEMPLATES[kind]).replaceAll('{hood}', hood.name);
    if (!caption.includes(hood.name) && kind !== 'other' && rand() < 0.45) caption += ` 📍${hood.name}`;
    posts.push({ caption, timestamp: Math.round(now - rand() * yearMs) });
  }
  return { homeBorough, posts: posts.sort((a, b) => a.timestamp - b.timestamp) };
}
