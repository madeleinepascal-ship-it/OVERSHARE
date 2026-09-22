import assert from 'node:assert/strict';
import { test } from 'node:test';

import { CHARITIES } from '../src/data/charities.js';
import { CATEGORY_BY_ID } from '../src/data/categories.js';
import { BOROUGH_BY_ID, HOOD_BY_ID, HOODS } from '../src/data/places.js';
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
        { uri: 'b.jpg', creation_timestamp: 1767225600, title: '', media_metadata: { photo_metadata: { exif_data: [{ latitude: 40.7081, longitude: -73.9571 }] } } },
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
  assert.equal(parsed[0].lat, 40.7081);

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
  const read = readPost({ caption: 'Negroni and dumplings in Greenpoint', timestamp: at(0) });
  assert.deepEqual(read.categories.sort(), ['drinks', 'food']);
  assert.equal(read.hoodId, 'greenpoint');
  assert.equal(read.boroughId, 'brooklyn');
  assert.equal(read.inNyc, true);
});

test('borough and city mentions place a post without a neighborhood', () => {
  assert.deepEqual(
    [readPost({ caption: 'Bronx bound #bronxeats', timestamp: 0 })].map((r) => [r.inNyc, r.hoodId, r.boroughId]),
    [[true, null, 'bronx']],
  );
  const nyc = readPost({ caption: 'best bagel #nycfood', timestamp: 0 });
  assert.deepEqual([nyc.inNyc, nyc.boroughId], [true, null]);
  const away = readPost({ caption: 'pasta in Rome', timestamp: 0 });
  assert.equal(away.inNyc, false);
});

test('photo GPS wins over the caption', () => {
  const wburg = readPost({ caption: 'ramen', timestamp: 0, lat: 40.7085, lng: -73.958 });
  assert.deepEqual([wburg.hoodId, wburg.boroughId, wburg.inNyc], ['williamsburg', 'brooklyn', true]);
  const lisbon = readPost({ caption: 'missing Williamsburg', timestamp: 0, lat: 38.72, lng: -9.14 });
  assert.deepEqual([lisbon.hoodId, lisbon.inNyc], [null, false]);
});

test('January posts count toward the busiest month', () => {
  const summary = analyzeYear(posts('a', 'b', 'c'));
  assert.equal(summary.busiestMonth, 0);
});

test('neighborhood charities outrank borough, city, national and global ones', () => {
  const summary = analyzeYear(posts('Picnic in Prospect Park', 'Park Slope sunset', 'Hike upstate', 'brooklyn'));
  const outdoors = recommend(summary).find((r) => r.category.id === 'outdoors');
  assert.equal(outdoors.charities[0].id, 'prospect-park-alliance');
  assert.equal(outdoors.charities[0].local, 'hood');
  assert.match(outdoors.charities[0].reason, /2 of your days outside were in (Park Slope|Prospect Heights)/);
});

test('borough charities beat citywide ones when you were in that borough', () => {
  const summary = analyzeYear(posts('Book club in the Bronx', 'reading #bronx', 'new books from the library'));
  const books = recommend(summary).find((r) => r.category.id === 'books');
  assert.equal(books.charities[0].id, 'nypl');
  assert.match(books.charities[0].reason, /2 of your reads were in the Bronx/);
});

test('citywide charities count your NYC posts', () => {
  const summary = analyzeYear(posts('dinner in Astoria', 'lunch downtown #nyc', 'pizza in Rome'));
  const food = recommend(summary).find((r) => r.category.id === 'food');
  const cityHarvest = food.charities.find((c) => c.id === 'city-harvest');
  assert.equal(cityHarvest.reason, '2 of your meals out were in NYC');
});

test('allocate always adds up to the total', () => {
  const split = allocate(100, [{ weight: 1 }, { weight: 1 }, { weight: 1 }]);
  assert.deepEqual(split.map((s) => s.amount), [34, 33, 33]);
  const weighted = allocate(57, [{ weight: 23 }, { weight: 9 }, { weight: 4 }, { weight: 1 }]);
  assert.equal(weighted.reduce((n, s) => n + s.amount, 0), 57);
  assert.deepEqual(allocate(0, [{ weight: 1 }]).map((s) => s.amount), [0]);
});

test('demo years are deterministic and centered on one borough', () => {
  const a = demoPosts('@maddie', { now: at(365) });
  const b = demoPosts('maddie', { now: at(365) });
  assert.deepEqual(a, b);
  const summary = analyzeYear(a.posts);
  assert.equal(summary.boroughs[0].id, a.homeBorough);
  assert.ok(summary.nycPosts > summary.totalPosts / 3);
});

test('place data is consistent', () => {
  const ids = new Set();
  for (const h of HOODS) {
    assert.ok(!ids.has(h.id), `duplicate hood ${h.id}`);
    ids.add(h.id);
    assert.ok(BOROUGH_BY_ID[h.borough], `${h.id}: unknown borough`);
    assert.ok(h.lat > 40.4 && h.lat < 41 && h.lng > -74.3 && h.lng < -73.6, `${h.id}: outside NYC`);
  }
});

test('charity data is consistent', () => {
  const ids = new Set();
  for (const c of CHARITIES) {
    assert.ok(!ids.has(c.id), `duplicate id ${c.id}`);
    ids.add(c.id);
    assert.ok(CATEGORY_BY_ID[c.category], `${c.id}: unknown category`);
    assert.match(c.url, /^https:\/\//, `${c.id}: url must be https`);
    assert.ok(['hood', 'borough', 'city', 'country', 'global'].includes(c.scope), `${c.id}: unknown scope`);
    if (c.scope === 'hood') for (const h of c.hoods) assert.ok(HOOD_BY_ID[h], `${c.id}: unknown hood ${h}`);
    if (c.scope === 'borough') for (const b of c.boroughs) assert.ok(BOROUGH_BY_ID[b], `${c.id}: unknown borough ${b}`);
  }
});

test('every activity has at least one New York charity, except coffee', () => {
  for (const id of Object.keys(CATEGORY_BY_ID)) {
    if (id === 'coffee') continue;
    assert.ok(
      CHARITIES.some((c) => c.category === id && ['hood', 'borough', 'city'].includes(c.scope)),
      `${id} has no NYC charity`,
    );
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
