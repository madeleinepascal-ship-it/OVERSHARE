// Reads a year of posts and works out what you did and where you did it.

import { CATEGORIES } from '../data/categories.js';
import { CITIES, CITY_BY_ID, HOOD_BY_ID } from '../data/places.js';
import { distanceKm, extractHashtags, hashtagMatcher, phraseMatcher } from './text.js';

const HOOD_RADIUS_KM = 2.5;
const CITY_RADIUS_KM = 60;

const categoryMatchers = CATEGORIES.map((c) => ({
  id: c.id,
  words: phraseMatcher(c.keywords),
  tags: hashtagMatcher(c.tags),
}));

// City tags are distinctive even when short (#nycfoodie, #sfeats).
const cityMatchers = CITIES.map((c) => ({
  id: c.id,
  words: phraseMatcher(c.aliases),
  tags: hashtagMatcher(c.tags, { minLoose: 2 }),
}));

const hoodMatchers = CITIES.flatMap((city) =>
  city.hoods.map((hood) => ({ id: hood.id, cityId: city.id, words: phraseMatcher(hood.aliases) })),
);

function nearestPlace(point) {
  let best = null;
  for (const city of CITIES) {
    if (distanceKm(point, city) > CITY_RADIUS_KM) continue;
    for (const hood of city.hoods) {
      const d = distanceKm(point, hood);
      if (d <= HOOD_RADIUS_KM && (!best || d < best.d)) best = { d, cityId: city.id, hoodId: hood.id };
    }
    if (!best) best = { d: Infinity, cityId: city.id, hoodId: null };
  }
  return best;
}

// First pass: everything we can tell from a single post on its own.
export function readPost(post) {
  const text = post.caption || '';
  const hashtags = extractHashtags(text);
  const categories = categoryMatchers.filter((m) => m.words(text) || m.tags(hashtags)).map((m) => m.id);
  const cities = cityMatchers.filter((m) => m.words(text) || m.tags(hashtags)).map((m) => m.id);
  const hoods = hoodMatchers.filter((m) => m.words(text));
  const geo = typeof post.lat === 'number' ? nearestPlace(post) : null;
  return { ...post, categories, cities, hoodCandidates: hoods, geo };
}

// Second pass: resolve each post to at most one city and neighbourhood.
// Neighbourhood names that exist in several cities (Soho, Hyde Park…) are
// settled by the post's own city mentions, then by your home city.
function place(read, homeCityId) {
  if (read.geo) return { cityId: read.geo.cityId, hoodId: read.geo.hoodId };
  const candidates = read.hoodCandidates;
  const pick =
    candidates.find((h) => read.cities.includes(h.cityId)) ||
    candidates.find((h) => h.cityId === homeCityId) ||
    candidates[0];
  if (pick) return { cityId: pick.cityId, hoodId: pick.id };
  return { cityId: read.cities[0] || null, hoodId: null };
}

function tally(map, key, n = 1) {
  if (key != null) map.set(key, (map.get(key) || 0) + n);
}

const ranked = (map) =>
  [...map.entries()].sort((a, b) => b[1] - a[1]).map(([id, count]) => ({ id, count }));

export function guessHomeCity(reads) {
  const votes = new Map();
  for (const r of reads) {
    if (r.geo) tally(votes, r.geo.cityId, 2);
    for (const c of r.cities) tally(votes, c, 1);
    // A neighbourhood name only counts toward a city if it's unambiguous.
    const hoodCities = new Set(r.hoodCandidates.map((h) => h.cityId));
    if (hoodCities.size === 1) tally(votes, [...hoodCities][0], 1);
  }
  return ranked(votes)[0]?.id || null;
}

// posts: [{ caption, timestamp, lat?, lng? }]
export function analyzeYear(posts) {
  const reads = posts.map(readPost);
  const homeCityId = guessHomeCity(reads);

  const cityCounts = new Map();
  const hoodCounts = new Map();
  const monthCounts = new Map();
  const byCategory = new Map(CATEGORIES.map((c) => [c.id, { count: 0, hoods: new Map(), cities: new Map(), examples: [] }]));
  let matchedPosts = 0;

  for (const read of reads) {
    const { cityId, hoodId } = place(read, homeCityId);
    tally(cityCounts, cityId);
    tally(hoodCounts, hoodId);
    tally(monthCounts, new Date(read.timestamp).getMonth());
    if (read.categories.length) matchedPosts++;

    for (const id of read.categories) {
      const bucket = byCategory.get(id);
      bucket.count++;
      tally(bucket.hoods, hoodId);
      tally(bucket.cities, cityId);
      if (bucket.examples.length < 3 && read.caption) bucket.examples.push(read.caption);
    }
  }

  const categories = CATEGORIES.map((c) => {
    const b = byCategory.get(c.id);
    return { id: c.id, count: b.count, hoods: ranked(b.hoods), cities: ranked(b.cities), examples: b.examples };
  })
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);

  return {
    totalPosts: posts.length,
    matchedPosts,
    homeCityId,
    homeCountry: homeCityId ? CITY_BY_ID[homeCityId].country : null,
    cities: ranked(cityCounts),
    hoods: ranked(hoodCounts).map((h) => ({ ...h, cityId: HOOD_BY_ID[h.id].cityId })),
    busiestMonth: ranked(monthCounts)[0]?.id ?? null,
    categories,
    from: posts.length ? posts.reduce((min, p) => Math.min(min, p.timestamp), Infinity) : null,
    to: posts.length ? posts.reduce((max, p) => Math.max(max, p.timestamp), -Infinity) : null,
  };
}
