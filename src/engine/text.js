// Small text-matching helpers shared by the classifier.

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const isShouty = (s) => /[A-Z]/.test(s) && s === s.toUpperCase();

// Builds a matcher that finds whole-word/phrase occurrences of any term.
// ALL-CAPS terms are matched case-sensitively; everything else ignores case.
export function phraseMatcher(terms) {
  const loose = terms.filter((t) => !isShouty(t));
  const strict = terms.filter(isShouty);
  const build = (list, flags) =>
    list.length
      ? new RegExp(`(?<![\\p{L}\\p{N}])(?:${list.map(escapeRegex).join('|')})(?![\\p{L}\\p{N}])`, flags)
      : null;
  const looseRe = build(loose, 'iu');
  const strictRe = build(strict, 'u');
  return (text) => Boolean((looseRe && looseRe.test(text)) || (strictRe && strictRe.test(text)));
}

// True if any tag starts or ends a hashtag. Tags shorter than `minLoose`
// must match exactly (allowing a plural "s") to avoid #party → "art".
export function hashtagMatcher(tags, { minLoose = 4 } = {}) {
  const short = new Set(tags.filter((t) => t.length < minLoose));
  const long = tags.filter((t) => t.length >= minLoose);
  return (hashtags) =>
    hashtags.some(
      (h) =>
        short.has(h) ||
        (h.endsWith('s') && short.has(h.slice(0, -1))) ||
        long.some((t) => h.startsWith(t) || h.endsWith(t)),
    );
}

export function extractHashtags(text) {
  return [...text.matchAll(/#([\p{L}\p{N}_]+)/gu)].map((m) => m[1].toLowerCase());
}

// Instagram's JSON export stores UTF-8 text as if each byte were a Latin-1
// character ("cafÃ©" for "café"). Undo that when we can; leave text alone
// if it doesn't look double-encoded.
export function fixMojibake(s) {
  if (typeof s !== 'string' || !/[À-ÿ][\u0080-¿]/.test(s)) return s;
  for (let i = 0; i < s.length; i++) if (s.charCodeAt(i) > 0xff) return s;
  try {
    const bytes = Uint8Array.from(s, (c) => c.charCodeAt(0));
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return s;
  }
}

// Great-circle distance in kilometres.
export function distanceKm(a, b) {
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}
