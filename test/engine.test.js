import assert from 'node:assert/strict';
import { test } from 'node:test';

import { CHARITIES } from '../src/data/charities.js';
import { CATEGORY_BY_ID } from '../src/data/categories.js';
import { CITY_BY_ID, HOOD_BY_ID } from '../src/data/places.js';
import { analyzeYear, readPost } from '../src/engine/classify.js';
import { demoPosts } from '../src/engine/demo.js';
import { allocate, recommend } from '../src/engine/match.js';
import { isContentFile, lastYear, parseExportFiles } from '../src/engine/parse.js';
import { fixMojibake, hashtagMatcher, phraseMatcher } from '../src/engine/text.js';
import { readZip } from '../src/engine/zip.js';

const day = 24 * 60 * 60 * 1000;
const at = (i) => Date.UTC(2026, 0, 1) + i * day;
const posts = (...captions) => captions.map((caption, i) => ({ caption, timestamp: at(i) }));

test('phrases match whole words, and ALL-CAPS aliases only in caps', () => {
  const m = phraseMatcher(['bar', 'happy hour', 'LES']);
  assert.ok(m('great bar tonight'));
  assert.ok(m('Happy Hour!!'));
  assert.ok(!m('barbecue'));
  assert.ok(m('drinks on the LES'));
  assert.ok(!m('les amis'));
});

test('hashtags match at either end; short tags must be exact', () => {
  const m = hashtagMatcher(['foodie', 'art', 'cat']);
  assert.ok(m(['nycfoodie']));
  assert.ok(m(['foodiegram']));
  assert.ok(m(['art']));
  assert.ok(m(['cats']));
  assert.ok(!m(['party']));
  assert.ok(!m(['staycation']));
});

test('undoes Instagram export double-encoding', () => {
  assert.equal(fixMojibake('cafÃ© ð\u009f\u008d\u009c'), 'café 🍜');
  assert.equal(fixMojibake('plain café'), 'plain café');
});

test('reads posts, stories and GPS from an export, and skips non-content files', () => {
  const postsJson = [
    {
      title: 'Brunch in Williamsburg ð\u009f¥\u009e',
      creation_timestamp: 1767225600,
      media: [
        { uri: 'a.jpg', creation_timestamp: 1767225600, title: '' },
        { uri: 'b.jpg', creation_timestamp: 1767225600, title: '', media_metadata: { photo_metadata: { exif_data: [{ latitude: 51.5265, longitude: -0.0786 }] } } },
      ],
    },
    { media: [{ uri: 'c.jpg', creation_timestamp: 1767312000, title: 'Gig night #livemusic' }] },
  ];
  const stories = { ig_stories: [{ uri: 's.mp4', creation_timestamp: 1767398400, title: 'coffee first' }] };

  const parsed = parseExportFiles([
    { name: 'posts_1.json', text: JSON.stringify(postsJson) },
    { name: 'stories.json', text: JSON.stringify(stories) },
    { name: 'stories-copy.json', text: JSON.stringify(stories) },
    { name: 'broken.json', text: '{nope' },
  ]);
  assert.deepEqual(parsed.map((p) => p.caption), ['Brunch in Williamsburg 🥞', 'Gig night #livemusic', 'coffee first']);
  assert.equal(parsed[0].lat, 51.5265);

  assert.ok(isContentFile('your_instagram_activity/content/posts_1.json'));
  assert.ok(isContentFile('content/stories.json'));
  assert.ok(!isContentFile('your_instagram_activity/messages/inbox/x/message_1.json'));
  assert.ok(!isContentFile('ads_information/ads.json'));
});

test('lastYear keeps the twelve months up to the newest post', () => {
  const kept = lastYear([{ timestamp: at(0) }, { timestamp: at(100) }, { timestamp: at(500) }]);
  assert.deepEqual(kept.map((p) => p.timestamp), [at(500)]);
});

test('classifies activities and places from captions', () => {
  const read = readPost({ caption: 'Negroni and dumplings in Greenpoint #nycfoodie', timestamp: at(0) });
  assert.deepEqual(read.categories.sort(), ['drinks', 'food']);
  assert.deepEqual(read.cities, ['nyc']);
  assert.equal(read.hoodCandidates[0].id, 'greenpoint');
});

test('ambiguous neighbourhoods resolve to your home city', () => {
  const summary = analyzeYear(
    posts('Pints in Peckham', 'Brixton brunch', 'Dinner in Soho', 'london london london', 'gig in Dalston'),
  );
  assert.equal(summary.homeCityId, 'london');
  const food = summary.categories.find((c) => c.id === 'food');
  assert.deepEqual(food.hoods.map((h) => h.id).sort(), ['brixton', 'soho-london']);
});

test('photo GPS places a post in the nearest neighbourhood', () => {
  const summary = analyzeYear([{ caption: 'ramen', timestamp: at(0), lat: 40.7085, lng: -73.958 }]);
  assert.equal(summary.homeCityId, 'nyc');
  assert.deepEqual(summary.categories[0].hoods, [{ id: 'williamsburg', count: 1 }]);
});

test('January posts count toward the busiest month', () => {
  const summary = analyzeYear(posts('a', 'b', 'c'));
  assert.equal(summary.busiestMonth, 0);
});

test('neighbourhood charities outrank city, national and global ones', () => {
  const summary = analyzeYear(posts('Picnic in Prospect Park', 'Park Slope sunset', 'Hike upstate', 'brooklyn'));
  const outdoors = recommend(summary).find((r) => r.category.id === 'outdoors');
  assert.equal(outdoors.charities[0].id, 'prospect-park-alliance');
  assert.match(outdoors.charities[0].reason, /2 of your days outside were in (Park Slope|Prospect Heights)/);
  assert.ok(outdoors.charities.every((c) => c.city === undefined || c.city === 'nyc'));
});

test('never recommends another country’s national charities', () => {
  const summary = analyzeYear(posts('Pints in Peckham', 'London pub crawl', 'cocktails in Hackney'));
  const drinks = recommend(summary).find((r) => r.category.id === 'drinks');
  assert.ok(drinks.charities.length > 0);
  assert.ok(drinks.charities.every((c) => c.country === 'UK'));
});

test('allocate always adds up to the total', () => {
  const split = allocate(100, [{ weight: 1 }, { weight: 1 }, { weight: 1 }]);
  assert.deepEqual(split.map((s) => s.amount), [34, 33, 33]);
  const weighted = allocate(57, [{ weight: 23 }, { weight: 9 }, { weight: 4 }, { weight: 1 }]);
  assert.equal(weighted.reduce((n, s) => n + s.amount, 0), 57);
  assert.deepEqual(allocate(0, [{ weight: 1 }]).map((s) => s.amount), [0]);
});

test('demo years are deterministic and land in one city', () => {
  const a = demoPosts('@maddie', { now: at(365) });
  const b = demoPosts('maddie', { now: at(365) });
  assert.deepEqual(a, b);
  assert.equal(analyzeYear(a.posts).homeCityId, a.cityId);
});

test('charity data is consistent', () => {
  const ids = new Set();
  for (const c of CHARITIES) {
    assert.ok(!ids.has(c.id), `duplicate id ${c.id}`);
    ids.add(c.id);
    assert.ok(CATEGORY_BY_ID[c.category], `${c.id}: unknown category`);
    assert.match(c.url, /^https:\/\//, `${c.id}: url must be https`);
    if (c.scope === 'city' || c.scope === 'hood') assert.ok(CITY_BY_ID[c.city], `${c.id}: unknown city`);
    if (c.scope === 'hood') {
      for (const h of c.hoods) assert.equal(HOOD_BY_ID[h]?.cityId, c.city, `${c.id}: hood ${h} not in ${c.city}`);
    }
    if (c.scope === 'country') assert.ok(['US', 'UK'].includes(c.country), `${c.id}: unknown country`);
  }
});

// Build a tiny zip in memory (one stored and one deflated entry).
async function makeZip(files) {
  const enc = new TextEncoder();
  const chunks = [];
  const central = [];
  let offset = 0;
  for (const { name, text, deflate } of files) {
    const nameBytes = enc.encode(name);
    let data = enc.encode(text);
    if (deflate) {
      const stream = new Blob([data]).stream().pipeThrough(new CompressionStream('deflate-raw'));
      data = new Uint8Array(await new Response(stream).arrayBuffer());
    }
    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(8, deflate ? 8 : 0, true);
    local.setUint32(18, data.length, true);
    local.setUint16(26, nameBytes.length, true);
    chunks.push(new Uint8Array(local.buffer), nameBytes, data);

    const cd = new DataView(new ArrayBuffer(46));
    cd.setUint32(0, 0x02014b50, true);
    cd.setUint16(10, deflate ? 8 : 0, true);
    cd.setUint32(20, data.length, true);
    cd.setUint16(28, nameBytes.length, true);
    cd.setUint32(42, offset, true);
    central.push(new Uint8Array(cd.buffer), nameBytes);
    offset += 30 + nameBytes.length + data.length;
  }
  const cdSize = central.reduce((n, c) => n + c.length, 0);
  const eocd = new DataView(new ArrayBuffer(22));
  eocd.setUint32(0, 0x06054b50, true);
  eocd.setUint16(10, files.length, true);
  eocd.setUint32(12, cdSize, true);
  eocd.setUint32(16, offset, true);
  return (await new Blob([...chunks, ...central, new Uint8Array(eocd.buffer)]).arrayBuffer());
}

test('reads stored and deflated zip entries, filtered by name', async () => {
  const zip = await makeZip([
    { name: 'content/posts_1.json', text: '[{"title":"hi","creation_timestamp":1}]', deflate: true },
    { name: 'messages/inbox.json', text: 'secret' },
    { name: 'content/stories.json', text: '{"ig_stories":[]}' },
  ]);
  const entries = readZip(zip, isContentFile);
  assert.deepEqual(entries.map((e) => e.name), ['content/posts_1.json', 'content/stories.json']);
  assert.equal(await entries[0].text(), '[{"title":"hi","creation_timestamp":1}]');
  assert.equal(await entries[1].text(), '{"ig_stories":[]}');
});
