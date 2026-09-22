import { CATEGORY_BY_ID } from './data/categories.js';
import { CITIES, CITY_BY_ID, HOOD_BY_ID } from './data/places.js';
import { analyzeYear } from './engine/classify.js';
import { demoPosts } from './engine/demo.js';
import { allocate, currencyFor, recommend } from './engine/match.js';
import { isContentFile, lastYear, parseExportFiles } from './engine/parse.js';
import { readZip } from './engine/zip.js';

const $ = (id) => document.getElementById(id);
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const state = {
  source: null, // 'demo' | 'export'
  handle: '',
  summary: null,
  cityId: null,
  recs: [],
  selected: new Set(),
  budget: 50, // number, or 'post' for a buck a post
  customBudget: null,
  split: 'year', // 'year' | 'even'
  given: new Set(),
};

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) node.setAttribute(k, v === true ? '' : v);
  }
  for (const child of children.flat()) if (child != null && child !== false) node.append(child);
  return node;
}

function show(screen) {
  for (const s of document.querySelectorAll('.screen')) s.hidden = s.id !== `screen-${screen}`;
  $('basket').hidden = screen !== 'results' || !state.recs.length;
  $('restart').hidden = screen === 'start';
  document.body.dataset.screen = screen;
  window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
}

const cur = () => currencyFor(state.cityId);
const money = (n) => `${cur()}${n.toLocaleString()}`;
const cityName = (id) => (id ? CITY_BY_ID[id].name : 'wherever you are');

// ── Getting posts in ────────────────────────────────────────────────────────

$('handle-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const handle = $('handle').value.trim().replace(/^@+/, '');
  if (!handle) return;
  const { posts } = demoPosts(handle);
  start({ source: 'demo', handle, posts });
});

async function readFiles(fileList) {
  const texts = [];
  for (const file of fileList) {
    if (/\.zip$/i.test(file.name) || file.type.includes('zip')) {
      const entries = readZip(await file.arrayBuffer(), (name) => name.endsWith('.json') && isContentFile(name));
      for (const entry of entries) texts.push({ name: entry.name, text: await entry.text() });
    } else {
      texts.push({ name: file.name, text: await file.text() });
    }
  }
  return lastYear(parseExportFiles(texts));
}

async function handleFiles(fileList) {
  const error = $('file-error');
  error.hidden = true;
  if (!fileList.length) return;
  try {
    const posts = await readFiles([...fileList]);
    if (!posts.length) throw new Error('We couldn’t find any posts in that. Make sure you picked JSON (not HTML) when you downloaded your information.');
    start({ source: 'export', handle: '', posts });
  } catch (err) {
    error.textContent = err.message || 'Something went wrong reading that file.';
    error.hidden = false;
    show('start');
  }
}

const dropzone = $('dropzone');
$('file-input').addEventListener('change', (e) => handleFiles(e.target.files));
for (const type of ['dragenter', 'dragover']) {
  dropzone.addEventListener(type, (e) => {
    e.preventDefault();
    dropzone.classList.add('is-over');
  });
}
for (const type of ['dragleave', 'drop']) dropzone.addEventListener(type, () => dropzone.classList.remove('is-over'));
dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  handleFiles(e.dataTransfer.files);
});

$('preview-upload').addEventListener('click', () => {
  show('start');
  $('file-input').click();
});
$('restart').addEventListener('click', () => show('start'));
$('back-to-picks').addEventListener('click', () => show('results'));

// ── Scan ────────────────────────────────────────────────────────────────────

function scan(summary) {
  show('scan');
  const lines = [
    'Scrubbing your grid…',
    ...summary.categories.slice(0, 4).map((c) => `Found ${c.count} ${CATEGORY_BY_ID[c.id].noun}…`),
    summary.hoods[0] ? `Mapping your hoods… ${HOOD_BY_ID[summary.hoods[0].id].name}, huh?` : 'Mapping your hoods…',
    'Matching you with causes…',
  ].filter(Boolean);

  const duration = reducedMotion ? 400 : 1400 + lines.length * 350;
  const startTime = performance.now();
  return new Promise((resolve) => {
    const tick = (now) => {
      const t = Math.min(1, (now - startTime) / duration);
      $('scan-count').textContent = Math.round(summary.totalPosts * (1 - (1 - t) ** 3)).toLocaleString();
      $('scan-line').textContent = lines[Math.min(lines.length - 1, Math.floor(t * lines.length))];
      if (t < 1) requestAnimationFrame(tick);
      else setTimeout(resolve, reducedMotion ? 0 : 400);
    };
    requestAnimationFrame(tick);
  });
}

async function start({ source, handle, posts }) {
  const summary = analyzeYear(posts);
  Object.assign(state, { source, handle, summary, given: new Set() });
  setCity(summary.homeCityId);
  await scan(summary);
  renderResults();
  show('results');
}

// ── Results ─────────────────────────────────────────────────────────────────

function setCity(cityId) {
  state.cityId = cityId;
  state.recs = recommend(state.summary, cityId);
  // Start with three picks, leaning toward the most local matches, then your biggest things.
  const localness = { hood: 0, city: 1, country: 2, global: 3 };
  const tops = state.recs.map((r, i) => ({ id: r.charities[0].id, rank: localness[r.charities[0].local], i }));
  tops.sort((a, b) => a.rank - b.rank || a.i - b.i);
  state.selected = new Set(tops.slice(0, 3).map((t) => t.id));
}

function formatRange(from, to) {
  const f = new Date(from);
  const t = new Date(to);
  const fmt = (d) => d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
  return `${fmt(f)} – ${fmt(t)}`;
}

function renderResults() {
  const { summary, source, handle } = state;
  $('preview-banner').hidden = source !== 'demo';
  $('preview-handle').textContent = `@${handle}`;
  $('range').textContent = [handle && `@${handle}`, summary.from && formatRange(summary.from, summary.to)].filter(Boolean).join(' · ');

  const topHood = summary.hoods[0];
  const turf = topHood ? HOOD_BY_ID[topHood.id].name : summary.homeCityId ? CITY_BY_ID[summary.homeCityId].name : '—';
  const stats = [
    [summary.totalPosts.toLocaleString(), 'posts scrubbed'],
    [summary.matchedPosts.toLocaleString(), 'out in the world'],
    [turf, 'home turf'],
    [summary.busiestMonth != null ? MONTHS[summary.busiestMonth] : '—', 'busiest month'],
  ];
  $('stats').replaceChildren(...stats.map(([value, label]) => el('div', { class: 'stat' }, el('b', {}, value), el('span', {}, label))));

  const max = summary.categories[0]?.count || 1;
  $('bars').replaceChildren(
    ...summary.categories.map((c) => {
      const cat = CATEGORY_BY_ID[c.id];
      const hood = c.hoods[0] && HOOD_BY_ID[c.hoods[0].id].name;
      return el(
        'li',
        { style: `--w:${Math.max(6, (c.count / max) * 100)}%` },
        el('span', { class: 'bar-emoji', 'aria-hidden': 'true' }, cat.emoji),
        el('span', { class: 'bar-label' }, el('b', {}, cat.label), ` ${c.count} ${cat.noun}${hood ? ` · mostly ${hood}` : ''}`),
        el('span', { class: 'bar-fill', 'aria-hidden': 'true' }),
      );
    }),
  );

  renderCitySelect();
  renderPicks();
  renderBasket();
}

function renderCitySelect() {
  const select = $('city');
  const options = CITIES.map((c) => el('option', { value: c.id, selected: c.id === state.cityId }, c.name));
  options.push(el('option', { value: '', selected: !state.cityId }, 'Somewhere else (national & global)'));
  select.replaceChildren(...options);
}

$('city').addEventListener('change', (e) => {
  setCity(e.target.value || null);
  renderPicks();
  renderBasket();
});

function renderPicks() {
  const container = $('picks');
  if (!state.recs.length) {
    container.replaceChildren(
      el('div', { class: 'empty' },
        el('p', {}, 'We couldn’t spot much in your captions — Overshare reads what you wrote and where you were.'),
        el('p', {}, 'Try your full export (stories and reels too), or type a handle for a preview.'),
      ),
    );
    return;
  }

  container.replaceChildren(
    ...state.recs.map((rec) => {
      const where = rec.topHood ? ` mostly in ${HOOD_BY_ID[rec.topHood.id].name}` : state.cityId ? ` in ${cityName(state.cityId)}` : '';
      return el('article', { class: 'pick-group' },
        el('header', {},
          el('span', { class: 'pick-emoji', 'aria-hidden': 'true' }, rec.category.emoji),
          el('div', {},
            el('p', { class: 'pick-count' }, `${rec.count} ${rec.category.noun}${where}`),
            el('h3', {}, rec.category.cause),
            el('p', { class: 'pick-pitch' }, rec.category.pitch),
          ),
        ),
        el('div', { class: 'charity-grid' }, ...rec.charities.map((c) => charityCard(c))),
      );
    }),
  );
}

function charityCard(charity) {
  const checked = state.selected.has(charity.id);
  const input = el('input', {
    type: 'checkbox',
    checked,
    onchange: (e) => {
      if (e.target.checked) state.selected.add(charity.id);
      else state.selected.delete(charity.id);
      e.target.closest('.charity').classList.toggle('is-selected', e.target.checked);
      renderBasket();
    },
  });
  return el('label', { class: `charity${checked ? ' is-selected' : ''}` },
    input,
    el('span', { class: `chip chip-${charity.local}` }, charity.reason),
    el('b', {}, charity.name),
    el('span', { class: 'charity-blurb' }, charity.blurb),
    el('a', { href: charity.url, target: '_blank', rel: 'noopener', class: 'charity-link', onclick: (e) => e.stopPropagation() }, 'About ↗'),
  );
}

// ── Basket ──────────────────────────────────────────────────────────────────

function selectedPicks() {
  const picks = [];
  for (const rec of state.recs) {
    const chosen = rec.charities.filter((c) => state.selected.has(c.id));
    for (const c of chosen) {
      picks.push({ charity: c, category: rec.category, weight: state.split === 'even' ? 1 : rec.count / chosen.length });
    }
  }
  return picks;
}

function budgetTotal() {
  if (state.budget === 'post') return state.summary.matchedPosts;
  if (state.budget === 'custom') return state.customBudget || 0;
  return state.budget;
}

function chip(label, active, onclick) {
  return el('button', { type: 'button', class: `chip-btn${active ? ' is-active' : ''}`, 'aria-pressed': String(active), onclick }, label);
}

function renderBasket() {
  if (!state.summary) return;
  const setBudget = (b) => () => {
    state.budget = b;
    renderBasket();
    if (b === 'custom') $('custom-budget')?.focus();
  };
  const custom =
    state.budget === 'custom'
      ? el('input', {
          id: 'custom-budget',
          class: 'chip-input',
          type: 'number',
          min: '1',
          inputmode: 'numeric',
          placeholder: `${cur()} amount`,
          'aria-label': 'Custom amount',
          value: state.customBudget ?? '',
          oninput: (e) => {
            state.customBudget = Math.max(0, Math.floor(Number(e.target.value) || 0));
            renderLines();
          },
        })
      : chip('Custom', false, setBudget('custom'));
  $('budget-chips').replaceChildren(
    chip(`${cur()}1 a post · ${money(state.summary.matchedPosts)}`, state.budget === 'post', setBudget('post')),
    ...[25, 50, 100].map((n) => chip(money(n), state.budget === n, setBudget(n))),
    custom,
  );
  $('split-chips').replaceChildren(
    chip('Match my year', state.split === 'year', () => ((state.split = 'year'), renderBasket())),
    chip('Even split', state.split === 'even', () => ((state.split = 'even'), renderBasket())),
  );
  renderLines();
}

function currentAllocation() {
  return allocate(budgetTotal(), selectedPicks()).filter((a) => a.amount > 0);
}

function renderLines() {
  const lines = currentAllocation();
  const total = lines.reduce((n, l) => n + l.amount, 0);
  $('basket-lines').replaceChildren(
    ...(lines.length
      ? lines.map((l) => el('li', {}, el('span', {}, `${l.category.emoji} ${l.charity.name}`), el('b', {}, money(l.amount))))
      : [el('li', { class: 'muted' }, selectedPicks().length ? 'Set an amount to see your split.' : 'Pick a cause or two above.')]),
  );
  const btn = $('checkout');
  btn.disabled = !lines.length;
  btn.textContent = lines.length ? `Overshare ${money(total)} →` : 'Overshare';
}

$('checkout').addEventListener('click', () => {
  renderGive();
  show('give');
});

// ── Give ────────────────────────────────────────────────────────────────────

function renderGive() {
  const lines = currentAllocation();
  $('give-list').replaceChildren(
    ...lines.map((l) => {
      const done = state.given.has(l.charity.id);
      const item = el('li', { class: done ? 'is-done' : '' },
        el('div', { class: 'give-amount' }, money(l.amount)),
        el('div', { class: 'give-body' },
          el('b', {}, l.charity.name),
          el('span', {}, `${l.category.emoji} ${l.charity.reason}`),
        ),
        el('a', {
          class: 'btn btn-primary',
          href: l.charity.url,
          target: '_blank',
          rel: 'noopener',
          onclick: () => {
            state.given.add(l.charity.id);
            item.classList.add('is-done');
            updateProgress(lines);
          },
        }, `Give ${money(l.amount)} ↗`),
      );
      return item;
    }),
  );
  updateProgress(lines);
  drawCard(lines);
}

function updateProgress(lines) {
  const done = lines.filter((l) => state.given.has(l.charity.id)).length;
  $('give-progress').textContent =
    done === lines.length ? 'That’s everything. You officially overshared. 💞' : `${done} of ${lines.length} done`;
}

function shareText(lines) {
  const total = lines.reduce((n, l) => n + l.amount, 0);
  const names = lines.map((l) => l.charity.name);
  const list = names.length > 2 ? `${names.slice(0, 2).join(', ')} & ${names.length - 2} more` : names.join(' & ');
  return `I shared all year, so I overshared: ${money(total)} to ${list}, matched to where I actually spent my year. All your social can make an impact. #overshare`;
}

function wrapLines(ctx, text, maxWidth) {
  const words = text.split(' ');
  const out = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      out.push(line);
      line = word;
    } else line = test;
  }
  if (line) out.push(line);
  return out;
}

async function drawCard(lines) {
  await document.fonts.ready;
  const canvas = $('share-canvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const total = lines.reduce((n, l) => n + l.amount, 0);

  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, '#ff3d7f');
  g.addColorStop(0.55, '#ff6b4a');
  g.addColorStop(1, '#ffb23f');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  const display = '"Bricolage Grotesque", system-ui, sans-serif';
  const body = 'Inter, system-ui, sans-serif';
  const pad = 90;
  ctx.fillStyle = '#1a0f14';
  ctx.textBaseline = 'top';

  ctx.font = `800 64px ${display}`;
  ctx.fillText('overshare', pad, pad);

  ctx.font = `800 132px ${display}`;
  ctx.fillText('I overshared', pad, 260);
  ctx.fillStyle = '#fff6ee';
  ctx.fillText(money(total), pad, 400);

  ctx.fillStyle = '#1a0f14';
  ctx.font = `600 44px ${body}`;
  let y = 590;
  const shown = lines.slice(0, 5);
  for (const l of shown) {
    ctx.fillText(`${l.category.emoji}  ${l.charity.name}`, pad, y);
    y += 70;
  }
  if (lines.length > shown.length) {
    ctx.fillText(`+ ${lines.length - shown.length} more`, pad, y);
    y += 70;
  }

  const top = state.recs.slice(0, 3).map((r) => `${r.count} ${r.category.noun}`).join(' · ');
  ctx.font = `500 36px ${body}`;
  for (const [i, text] of wrapLines(ctx, `Because my year was ${top}.`, W - pad * 2).entries()) {
    ctx.fillText(text, pad, Math.max(y + 40, 1020) + i * 48);
  }

  ctx.font = `800 46px ${display}`;
  ctx.fillText('You shared all year, now overshare.', pad, H - pad - 50);

  $('share-caption').textContent = shareText(lines);
}

function cardBlob() {
  return new Promise((resolve) => $('share-canvas').toBlob(resolve, 'image/png'));
}

$('download-btn').addEventListener('click', async () => {
  const url = URL.createObjectURL(await cardBlob());
  el('a', { href: url, download: 'overshare.png' }).click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

$('copy-btn').addEventListener('click', async (e) => {
  try {
    await navigator.clipboard.writeText($('share-caption').textContent);
    e.target.textContent = 'Copied ✓';
  } catch {
    e.target.textContent = 'Couldn’t copy';
  }
  setTimeout(() => (e.target.textContent = 'Copy caption'), 1800);
});

$('share-btn').addEventListener('click', async () => {
  const text = $('share-caption').textContent;
  const file = new File([await cardBlob()], 'overshare.png', { type: 'image/png' });
  try {
    if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], text });
    else if (navigator.share) await navigator.share({ text });
    else $('download-btn').click();
  } catch {
    // Share sheet dismissed — nothing to do.
  }
});
