// A believable sample year for when someone types a handle instead of
// uploading their export. Seeded from the handle, so the same handle always
// gets the same year. Every result built from this is labelled as a preview.

import { CITIES, CITY_BY_ID } from '../data/places.js';

const TEMPLATES = {
  food: [
    'Sunday brunch in {hood} hits different 🥞 #brunch #{tag}eats',
    'Best ramen of my life?? {hood} you’ve done it again 🍜',
    'Tasting menu night. 11 courses, zero regrets #foodie',
    'Pizza on the stoop in {hood} 🍕 #{tag}pizza',
    'dumplings > people #{tag}food',
    'Birthday dinner at our fave spot in {hood} 🥂',
    'omakase count this year: embarrassing #sushi',
    'Bagel run before the chaos #{tag}eats',
  ],
  drinks: [
    'Negroni o’clock in {hood} 🍸',
    'Natty wine and bad decisions #{tag}nights',
    'Happy hour turned into happy night in {hood}',
    'This bartender deserves a raise. And a medal. #cocktails',
    'Pints in the sun, {hood} 🍺',
    'Speakeasy behind a laundromat?? only in {hood} #cocktailbar',
  ],
  music: [
    'FRONT ROW. I’m not okay 🎸 #livemusic',
    'Tiny venue, huge band. {hood} never misses #gig',
    'DJ set till 4am, sorry to my calves #techno',
    'Festival season is my personality now #festival',
    'Jazz on a Tuesday in {hood} 🎷',
    'Encore was a whole second show #concert',
  ],
  coffee: [
    'but first, coffee ☕ #{tag}coffee',
    'Found the best flat white in {hood}',
    'Matcha era continues 🍵',
    'Laptop, cortado, pretending to work in {hood}',
  ],
  art: [
    'Lost two hours in this gallery in {hood} 🖼️',
    'Museum date > dinner date #art',
    'This mural in {hood} 😍 #streetart',
    'Saw the new exhibition, still thinking about it #museum',
  ],
  outdoors: [
    'Golden hour in the park 🌅 #{tag}parks',
    'Picnic szn in {hood} 🧺',
    'Sunset from the waterfront, not a filter #sunset',
    'Weekend hike to reset 🥾 #hiking',
  ],
  movement: [
    'Run club Tuesdays, {hood} crew 🏃 #runclub',
    'Half marathon DONE 🏅 #running',
    'Pilates girlie arc #pilates',
    '6am yoga in {hood}, who am I',
  ],
  style: [
    'Thrifted the whole fit 🧥 #thrift #ootd',
    'Vintage haul from {hood} #vintage',
    'Fit check before the party #fitcheck',
  ],
  books: [
    'Bookshop crawl in {hood} 📚 #bookstagram',
    'Currently reading and ignoring my phone (lie) #books',
    'Book club was mostly wine, some book #bookclub',
  ],
  pets: [
    'Dog park politics in {hood} 🐕',
    'Good boy of the year award goes to… #dogsofinstagram',
    'Adopted this little menace a year ago today 🐶 #adoptdontshop',
  ],
  other: [
    'Photo dump 📸',
    'Life lately',
    'No caption, just vibes',
    'Home for the holidays ✨',
    'Birthday week recap 🎂',
  ],
};

const CITY_TAG = { nyc: 'nyc', london: 'london', la: 'la', sf: 'sf', chicago: 'chicago' };

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

export function demoPosts(handle, { cityId, now = Date.now(), count } = {}) {
  const rand = seededRandom(handle.trim().toLowerCase().replace(/^@/, '') || 'overshare');
  const city = CITY_BY_ID[cityId] || pick(rand, CITIES);
  const hoods = [...city.hoods].sort(() => rand() - 0.5).slice(0, 4);

  // Everyone has a couple of things they post about far more than the rest.
  const weights = { other: 3 };
  for (const id of Object.keys(TEMPLATES)) if (id !== 'other') weights[id] = 0.3 + rand() * 1.2;
  const favourites = Object.keys(weights).filter((k) => k !== 'other').sort(() => rand() - 0.5);
  weights[favourites[0]] += 4;
  weights[favourites[1]] += 2.5;
  weights[favourites[2]] += 1.5;

  const total = count ?? 110 + Math.floor(rand() * 60);
  const yearMs = 365 * 24 * 60 * 60 * 1000;
  const posts = [];
  for (let i = 0; i < total; i++) {
    const kind = weightedPick(rand, weights);
    // Lean on a favourite neighbourhood so the year has a clear "home turf".
    const hood = rand() < 0.5 ? hoods[0] : pick(rand, hoods);
    let caption = pick(rand, TEMPLATES[kind])
      .replaceAll('{hood}', hood.name)
      .replaceAll('{tag}', CITY_TAG[city.id]);
    if (!caption.includes(hood.name) && kind !== 'other' && rand() < 0.4) caption += ` 📍${hood.name}`;
    posts.push({ caption, timestamp: Math.round(now - rand() * yearMs) });
  }
  return { cityId: city.id, posts: posts.sort((a, b) => a.timestamp - b.timestamp) };
}
