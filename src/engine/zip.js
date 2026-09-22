// Minimal ZIP reader so people can drop the Instagram export .zip straight
// in, with nothing uploaded anywhere. Uses the platform DecompressionStream
// (all modern browsers, Node 18+). Supports stored and deflated entries,
// which is everything Instagram produces.

const EOCD_SIG = 0x06054b50;
const CENTRAL_SIG = 0x02014b50;
const LOCAL_SIG = 0x04034b50;

function findEndOfCentralDirectory(view) {
  // The EOCD record is at least 22 bytes and may be followed by a comment of up to 64KB.
  const stop = Math.max(0, view.byteLength - 22 - 0xffff);
  for (let i = view.byteLength - 22; i >= stop; i--) {
    if (view.getUint32(i, true) === EOCD_SIG) return i;
  }
  throw new Error('That doesn’t look like a zip file.');
}

async function inflateRaw(bytes) {
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

// Returns [{ name, text() }] for entries whose name passes `filter`.
export function readZip(buffer, filter = () => true) {
  const view = new DataView(buffer);
  const eocd = findEndOfCentralDirectory(view);
  const count = view.getUint16(eocd + 10, true);
  let offset = view.getUint32(eocd + 16, true);
  const decoder = new TextDecoder();
  const entries = [];

  for (let i = 0; i < count; i++) {
    if (view.getUint32(offset, true) !== CENTRAL_SIG) throw new Error('Corrupt zip central directory.');
    const method = view.getUint16(offset + 10, true);
    const compressedSize = view.getUint32(offset + 20, true);
    const nameLength = view.getUint16(offset + 28, true);
    const extraLength = view.getUint16(offset + 30, true);
    const commentLength = view.getUint16(offset + 32, true);
    const localOffset = view.getUint32(offset + 42, true);
    const name = decoder.decode(new Uint8Array(buffer, offset + 46, nameLength));
    offset += 46 + nameLength + extraLength + commentLength;

    if (name.endsWith('/') || !filter(name)) continue;
    if (view.getUint32(localOffset, true) !== LOCAL_SIG) throw new Error('Corrupt zip entry.');
    const dataStart =
      localOffset + 30 + view.getUint16(localOffset + 26, true) + view.getUint16(localOffset + 28, true);
    const data = new Uint8Array(buffer, dataStart, compressedSize);

    entries.push({
      name,
      async text() {
        if (method === 0) return decoder.decode(data);
        if (method === 8) return decoder.decode(await inflateRaw(data));
        throw new Error(`Unsupported zip compression (${method}) in ${name}.`);
      },
    });
  }
  return entries;
}
