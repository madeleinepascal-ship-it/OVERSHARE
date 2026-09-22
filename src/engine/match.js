// Turns "what you did and where" into charities you can give to, and splits
// a budget across the ones you pick.

import { CATEGORY_BY_ID } from '../data/categories.js';
import { CHARITIES } from '../data/charities.js';
import { CITY_BY_ID, HOOD_BY_ID } from '../data/places.js';

const PER_CATEGORY = 3;

const countryName = { US: 'the US', UK: 'the UK' };

function score(charity, category, cityId) {
  const city = cityId ? CITY_BY_ID[cityId] : null;
  const cityPosts = category.cities.find((c) => c.id === charity.city)?.count || 0;

  if (charity.scope === 'hood') {
    if (charity.city !== cityId) return null;
    const hits = category.hoods.filter((h) => charity.hoods.includes(h.id));
    const posts = hits.reduce((n, h) => n + h.count, 0);
    if (posts) {
      const top = HOOD_BY_ID[hits[0].id].name;
      return { score: 100 + posts, reason: `${posts} of your ${CATEGORY_BY_ID[category.id].noun} were in ${top}`, local: 'hood' };
    }
    return { score: 50, reason: `Local to ${city.name}`, local: 'city' };
  }
  if (charity.scope === 'city') {
    if (charity.city !== cityId) return null;
    const reason = cityPosts > 1 ? `${cityPosts} of your ${CATEGORY_BY_ID[category.id].noun} were in ${city.name}` : `Local to ${city.name}`;
    return { score: 70 + cityPosts, reason, local: 'city' };
  }
  if (charity.scope === 'country') {
    if (city && charity.country !== city.country) return null;
    return { score: city ? 40 : 30, reason: `Works across ${countryName[charity.country] || charity.country}`, local: 'country' };
  }
  return { score: 20, reason: 'Works worldwide', local: 'global' };
}

// Returns one entry per category you were active in, most active first:
// { category, count, topHood, charities: [{ ...charity, reason, local }] }
export function recommend(summary, cityId = summary.homeCityId) {
  return summary.categories
    .map((category) => {
      const charities = CHARITIES.filter((c) => c.category === category.id)
        .map((c) => ({ charity: c, s: score(c, category, cityId) }))
        .filter((x) => x.s)
        .sort((a, b) => b.s.score - a.s.score)
        .slice(0, PER_CATEGORY)
        .map(({ charity, s }) => ({ ...charity, reason: s.reason, local: s.local }));
      const topHood = category.hoods.find((h) => HOOD_BY_ID[h.id].cityId === cityId) || null;
      return { category: CATEGORY_BY_ID[category.id], count: category.count, topHood, charities };
    })
    .filter((r) => r.charities.length);
}

// Split `total` whole units across picks in proportion to their weights,
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

export function currencyFor(cityId) {
  return cityId && CITY_BY_ID[cityId].country === 'UK' ? '£' : '$';
}
