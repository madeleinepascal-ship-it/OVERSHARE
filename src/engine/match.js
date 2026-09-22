// Turns "what you did and where" into New York charities you can give to,
// and splits a budget across the ones you pick.

import { CATEGORY_BY_ID } from '../data/categories.js';
import { CHARITIES } from '../data/charities.js';
import { BOROUGH_BY_ID, HOOD_BY_ID } from '../data/places.js';

const PER_CATEGORY = 4;

// Charities are ranked in tiers — the block you were on beats the borough,
// which beats the whole city — and by how many of your posts they match
// within a tier.
const TIER = { hood: 5, borough: 4, city: 3, nearby: 2, country: 1, global: 0 };

function sumMatching(counts, ids) {
  const hits = counts.filter((c) => ids.includes(c.id));
  return { hits, posts: hits.reduce((n, h) => n + h.count, 0) };
}

// "3 of your gigs were in Bushwick" / "One of your gigs was in Bushwick".
const tally = (n, noun, place) => (n === 1 ? `One of your ${noun} was in ${place}` : `${n} of your ${noun} were in ${place}`);

function score(charity, category) {
  const noun = CATEGORY_BY_ID[category.id].noun;
  const tier = (local, n, reason) => ({ score: TIER[local] * 1000 + n, local, reason });

  switch (charity.scope) {
    case 'hood': {
      const { hits, posts } = sumMatching(category.hoods, charity.hoods);
      if (posts) return tier('hood', posts, tally(posts, noun, HOOD_BY_ID[hits[0].id].name));
      return tier('nearby', 0, `Based in ${HOOD_BY_ID[charity.hoods[0]].name}`);
    }
    case 'borough': {
      const { hits, posts } = sumMatching(category.boroughs, charity.boroughs);
      if (posts) return tier('borough', posts, tally(posts, noun, BOROUGH_BY_ID[hits[0].id].name));
      return tier('nearby', 0, `Serving ${BOROUGH_BY_ID[charity.boroughs[0]].name}`);
    }
    case 'city': {
      const n = category.nycCount;
      return tier('city', n, n ? tally(n, noun, 'NYC') : 'Across all five boroughs');
    }
    case 'country':
      return tier('country', 0, 'Works across the US');
    default:
      return tier('global', 0, 'Works worldwide');
  }
}

// Returns one entry per category you were active in, most active first:
// { category, count, topHood, charities: [{ ...charity, reason, local }] }
export function recommend(summary) {
  return summary.categories
    .map((category) => {
      const charities = CHARITIES.filter((c) => c.category === category.id)
        .map((c) => ({ charity: c, s: score(c, category) }))
        .sort((a, b) => b.s.score - a.s.score)
        .slice(0, PER_CATEGORY)
        .map(({ charity, s }) => ({ ...charity, reason: s.reason, local: s.local }));
      return { category: CATEGORY_BY_ID[category.id], count: category.count, topHood: category.hoods[0] || null, charities };
    })
    .filter((r) => r.charities.length);
}

// Split `total` whole dollars across picks in proportion to their weights,
// using largest remainders so the parts always add up to the total.
export function allocate(total, picks) {
  const weightSum = picks.reduce((n, p) => n + p.weight, 0);
  if (!picks.length || total <= 0 || weightSum <= 0) return picks.map((p) => ({ ...p, amount: 0 }));
  const raw = picks.map((p) => (total * p.weight) / weightSum);
  const amounts = raw.map(Math.floor);
  let left = total - amounts.reduce((a, b) => a + b, 0);
  const order = raw.map((r, i) => [r - Math.floor(r), i]).sort((a, b) => b[0] - a[0]);
  for (let k = 0; left > 0; k = (k + 1) % order.length, left--) amounts[order[k][1]]++;
  return picks.map((p, i) => ({ ...p, amount: amounts[i] }));
}
