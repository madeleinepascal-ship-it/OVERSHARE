// Turns an Instagram "Download your information" export (JSON format) into a
// flat list of posts: { caption, timestamp, lat?, lng? }.
//
// Instagram has changed the export layout several times (posts_1.json,
// stories.json, reels.json, content/…), so rather than hard-coding paths we
// walk the JSON and pick out anything that looks like a piece of content:
// an object with a `creation_timestamp` and a caption (`title`) or GPS.

import { fixMojibake } from './text.js';

// Files in the export that describe *your* content. Everything else
// (ads, logins, followers, messages…) is skipped so we never touch it.
const CONTENT_FILE = /(^|\/)(posts|stories|reels|profile_photos|archived_posts|igtv_videos|content)[^/]*\.json$|(^|\/)your_instagram_activity\/content\/[^/]+\.json$/i;

export function isContentFile(name) {
  return CONTENT_FILE.test(name);
}

function findCoords(node, depth = 0) {
  if (!node || typeof node !== 'object' || depth > 6) return null;
  const lat = node.latitude ?? node.lat;
  const lng = node.longitude ?? node.lng ?? node.lon;
  if (typeof lat === 'number' && typeof lng === 'number' && (lat !== 0 || lng !== 0)) return { lat, lng };
  for (const value of Object.values(node)) {
    const found = findCoords(value, depth + 1);
    if (found) return found;
  }
  return null;
}

function toPost(node, inheritedCaption) {
  const caption = fixMojibake(typeof node.title === 'string' && node.title ? node.title : inheritedCaption || '');
  const seconds = node.creation_timestamp;
  if (typeof seconds !== 'number') return null;
  const coords = findCoords(node.media_metadata) || findCoords(node.location);
  if (!caption && !coords) return null;
  return { caption, timestamp: seconds * 1000, ...(coords || {}) };
}

// A post with several photos appears as { title, creation_timestamp, media: [...] },
// and each media item repeats the timestamp with an empty title. We emit one
// post per container and only fall through to the children when the
// container itself has no timestamp.
function walk(node, out, inheritedCaption = '') {
  if (Array.isArray(node)) {
    for (const item of node) walk(item, out, inheritedCaption);
    return;
  }
  if (!node || typeof node !== 'object') return;

  const caption = typeof node.title === 'string' && node.title ? node.title : inheritedCaption;
  if (typeof node.creation_timestamp === 'number') {
    const post = toPost(node, inheritedCaption);
    if (Array.isArray(node.media) && post && !post.lat) {
      const coords = node.media.map((m) => findCoords(m.media_metadata)).find(Boolean);
      if (coords) Object.assign(post, coords);
    }
    if (post) {
      out.push(post);
      return;
    }
  }
  for (const value of Object.values(node)) {
    if (value && typeof value === 'object') walk(value, out, caption);
  }
}

export function parseExportJson(json) {
  const out = [];
  walk(json, out);
  return out;
}

// files: [{ name, text }] — returns deduplicated posts, oldest first.
export function parseExportFiles(files) {
  const seen = new Set();
  const posts = [];
  for (const file of files) {
    let json;
    try {
      json = JSON.parse(file.text);
    } catch {
      continue;
    }
    for (const post of parseExportJson(json)) {
      const key = `${post.timestamp}|${post.caption}`;
      if (seen.has(key)) continue;
      seen.add(key);
      posts.push(post);
    }
  }
  return posts.sort((a, b) => a.timestamp - b.timestamp);
}

// Keep the most recent twelve months of posts, ending at the newest one.
export function lastYear(posts) {
  if (!posts.length) return posts;
  const end = posts.reduce((max, p) => Math.max(max, p.timestamp), 0);
  const start = end - 365 * 24 * 60 * 60 * 1000;
  return posts.filter((p) => p.timestamp > start);
}
