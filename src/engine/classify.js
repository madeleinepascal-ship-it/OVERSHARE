// Reads a year of posts and works out what you did and where in New York you did it.

import { CATEGORIES } from '../data/categories.js';
import { BOROUGHS, HOODS, NYC } from '../data/places.js';
import { distanceKm, extractHashtags, hashtagMatcher, phraseMatcher } from './text.js';

const HOOD_RADIUS_KM = 1.5;
const BOROUGH_RADIUS_KM = 5;
const NYC_RADIUS_KM = 35;

const categoryMatchers = CATEGORIES.map((c) => ({
  id: c.id,
  words: phraseMatcher(c.keywords),
  tags: hashtagMatcher(c.tags),
}));

// Place tags are distinctive even when short (#nycfoodie, #brooklynbrunch).
const nycMatcher = { words: phraseMatcher(NYC.aliases), tags: hashtagMatcher(NYC.tags, { minLoose: 2 }) };
const boroughMatchers = BOROUGHS.map((b) => ({
  id: b.id,
  words: phraseMatcher(b.aliases),
  tags: hashtagMatcher(b.tags, { minLoose: 2 }),
}));
const hoodMatchers = HOODS.map((h) => ({ hood: h, words: phraseMatcher(h.aliases) }));

// Where a photo was taken: the nearest neighborhood if it's close, else just
// the borough of the nearest one, else "somewhere in NYC", else outside.
function placeFromGps(point) {
  if (distanceKm(point, NYC) > NYC_RADIUS_KM) return { inNyc: false, hoodId: null, boroughId: null };
  let nearest = null;
  let best = Infinity;
  for (const hood of HOODS) {
    const d = distanceKm(point, hood);
    if (d < best) [nearest, best] = [hood, d];
  }
  return {
    inNyc: true,
    hoodId: best <= HOOD_RADIUS_KM ? nearest.id : null,
    boroughId: best <= BOROUGH_RADIUS_KM ? nearest.borough : null,
  };
}

function placeFromText(text, hashtags) {
  const hood = hoodMatchers.find((m) => m.words(text))?.hood;
  const borough = boroughMatchers.find((m) => m.words(text) || m.tags(hashtags))?.id;
  const nyc = nycMatcher.words(text) || nycMatcher.tags(hashtags);
  return {
    inNyc: Boolean(hood || borough || nyc),
    hoodId: hood?.id ?? null,
    boroughId: hood?.borough ?? borough ?? null,
  };
}

// Everything we can tell from a single post. Photo GPS wins over captions:
// "missing Williamsburg" posted from Lisbon happened in Lisbon.
export function readPost(post) {
  const text = post.caption || '';
  const hashtags = extractHashtags(text);
  const categories = categoryMatchers.filter((m) => m.words(text) || m.tags(hashtags)).map((m) => m.id);
  const place = typeof post.lat === 'number' ? placeFromGps(post) : placeFromText(text, hashtags);
  return { ...post, categories, ...place };
}

function tally(map, key, n = 1) {
  if (key != null) map.set(key, (map.get(key) || 0) + n);
}

const ranked = (map) =>
  [...map.entries()].sort((a, b) => b[1] - a[1]).map(([id, count]) => ({ id, count }));

// posts: [{ caption, timestamp, lat?, lng? }]
export function analyzeYear(posts) {
  const hoods = new Map();
  const boroughs = new Map();
  const months = new Map();
  const byCategory = new Map(
    CATEGORIES.map((c) => [c.id, { count: 0, nycCount: 0, hoods: new Map(), boroughs: new Map() }]),
  );
  let matchedPosts = 0;
  let nycPosts = 0;

  for (const read of posts.map(readPost)) {
    tally(hoods, read.hoodId);
    tally(boroughs, read.boroughId);
    tally(months, new Date(read.timestamp).getMonth());
    if (read.categories.length) matchedPosts++;
    if (read.inNyc) nycPosts++;

    for (const id of read.categories) {
      const bucket = byCategory.get(id);
      bucket.count++;
      if (read.inNyc) bucket.nycCount++;
      tally(bucket.hoods, read.hoodId);
      tally(bucket.boroughs, read.boroughId);
    }
  }

  const categories = CATEGORIES.map((c) => {
    const b = byCategory.get(c.id);
    return { id: c.id, count: b.count, nycCount: b.nycCount, hoods: ranked(b.hoods), boroughs: ranked(b.boroughs) };
  })
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);

  return {
    totalPosts: posts.length,
    matchedPosts,
    nycPosts,
    hoods: ranked(hoods),
    boroughs: ranked(boroughs),
    busiestMonth: ranked(months)[0]?.id ?? null,
    categories,
    from: posts.length ? posts.reduce((min, p) => Math.min(min, p.timestamp), Infinity) : null,
    to: posts.length ? posts.reduce((max, p) => Math.max(max, p.timestamp), -Infinity) : null,
  };
}
