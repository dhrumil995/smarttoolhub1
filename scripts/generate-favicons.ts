import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

/**
 * Creates a valid RGBA PNG buffer of given width and height
 */
function createPng(width: number, height: number, renderPixel: (x: number, y: number) => [number, number, number, number]): Buffer {
  // 1. Signature
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // 2. IHDR Chunk (13 bytes payload)
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8-bit depth
  ihdrData.writeUInt8(6, 9); // Color type: 6 = RGBA
  ihdrData.writeUInt8(0, 10); // Compression method: deflate
  ihdrData.writeUInt8(0, 11); // Filter: standard
  ihdrData.writeUInt8(0, 12); // Interlace: none

  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // 3. Raw Scanlines
  // Each scanline begins with a filter-type byte (0 = none), followed by 4 * width bytes (RGBA)
  const scanlineLength = 1 + width * 4;
  const rawData = Buffer.alloc(scanlineLength * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // Filter byte 0 (None)

    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = renderPixel(x, y);
      const pixelOffset = rowOffset + 1 + x * 4;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  // Deflate raw scanlines
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);

  // 4. IEND Chunk
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// CRC32 calculation for PNG chunks
const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC_TABLE[n] = c;
}

function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type: string, data: Buffer): Buffer {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);

  chunk.writeUInt32BE(len, 0);
  typeBuf.copy(chunk, 4);
  data.copy(chunk, 8);

  const crcData = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(crcData);
  chunk.writeUInt32BE(crcVal, 8 + len);

  return chunk;
}

/**
 * Creates an ICO buffer containing the given PNG buffers
 */
function createIco(pngBuffers: Buffer[]): Buffer {
  const count = pngBuffers.length;
  // Header: 2 reserved, 2 type (1=ico), 2 image count
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  let offset = 6 + count * 16;
  const entries: Buffer[] = [];
  const datas: Buffer[] = [];

  for (const png of pngBuffers) {
    const entry = Buffer.alloc(16);
    // Read width and height from PNG IHDR (offset 16-24 of PNG)
    const w = png.readUInt32BE(16);
    const h = png.readUInt32BE(20);

    entry.writeUInt8(w >= 256 ? 0 : w, 0); // width
    entry.writeUInt8(h >= 256 ? 0 : h, 1); // height
    entry.writeUInt8(0, 2); // color palette (0)
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(png.length, 8); // size of PNG
    entry.writeUInt32LE(offset, 12); // offset of PNG data

    offset += png.length;
    entries.push(entry);
    datas.push(png);
  }

  return Buffer.concat([header, ...entries, ...datas]);
}

/**
 * Render Apple Shortcuts Icon pixel logic
 * Dark squircle backdrop with vibrant blue (#0a84ff) and pink (#ff4f9a) overlapping diamonds
 */
function renderShortcutsIcon(size: number, x: number, y: number): [number, number, number, number] {
  // Normalize coordinates to -1 to 1
  const nx = (x / size) * 2 - 1;
  const ny = (y / size) * 2 - 1;

  // Squircle corner check: |nx|^4 + |ny|^4 <= 0.85
  const squircle = Math.pow(Math.abs(nx), 3.8) + Math.pow(Math.abs(ny), 3.8);
  if (squircle > 0.88) {
    return [0, 0, 0, 0]; // Transparent outside squircle
  }

  // Border highlight
  if (squircle > 0.82) {
    return [255, 255, 255, 45];
  }

  // Base background: Obsidian Dark (#050713)
  let r = 5, g = 7, b = 19, a = 255;

  // Blue Diamond Center: nx ~ -0.22, ny ~ -0.22
  // Rotated coordinates for blue diamond
  const bx = (nx - (-0.22)) * Math.cos(Math.PI / 4) - (ny - (-0.22)) * Math.sin(Math.PI / 4);
  const by = (nx - (-0.22)) * Math.sin(Math.PI / 4) + (ny - (-0.22)) * Math.cos(Math.PI / 4);
  const inBlue = Math.abs(bx) < 0.36 && Math.abs(by) < 0.36;

  // Pink Diamond Center: nx ~ 0.22, ny ~ 0.22
  const px = (nx - 0.22) * Math.cos(Math.PI / 4) - (ny - 0.22) * Math.sin(Math.PI / 4);
  const py = (nx - 0.22) * Math.sin(Math.PI / 4) + (ny - 0.22) * Math.cos(Math.PI / 4);
  const inPink = Math.abs(px) < 0.36 && Math.abs(py) < 0.36;

  if (inBlue && inPink) {
    // Overlap center blend: glowing amber / violet highlight
    r = 255; g = 184; b = 64; // #ffb840 amber node
  } else if (inPink) {
    // Pink diamond (#ff4f9a)
    r = 255; g = 79; b = 154;
  } else if (inBlue) {
    // Blue diamond (#0a84ff)
    r = 10; g = 132; b = 255;
  } else {
    // Ambient aurora blur in backdrop
    const dBlue = Math.hypot(nx - (-0.25), ny - (-0.25));
    const dPink = Math.hypot(nx - 0.25, ny - 0.25);
    if (dBlue < 0.7) {
      const glow = (1 - dBlue / 0.7) * 0.4;
      r += Math.round(10 * glow);
      g += Math.round(132 * glow);
      b += Math.round(255 * glow);
    }
    if (dPink < 0.7) {
      const glow = (1 - dPink / 0.7) * 0.4;
      r += Math.round(255 * glow);
      g += Math.round(79 * glow);
      b += Math.round(154 * glow);
    }
  }

  return [Math.min(255, r), Math.min(255, g), Math.min(255, b), a];
}

async function main() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  console.log('Generating favicon PNG assets...');

  const png16 = createPng(16, 16, (x, y) => renderShortcutsIcon(16, x, y));
  fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), png16);

  const png32 = createPng(32, 32, (x, y) => renderShortcutsIcon(32, x, y));
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), png32);

  const png180 = createPng(180, 180, (x, y) => renderShortcutsIcon(180, x, y));
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);

  const png192 = createPng(192, 192, (x, y) => renderShortcutsIcon(192, x, y));
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), png192);

  const png512 = createPng(512, 512, (x, y) => renderShortcutsIcon(512, x, y));
  fs.writeFileSync(path.join(publicDir, 'logo.png'), png512);

  // Generate favicon.ico combining 16x16 and 32x32
  const icoBuf = createIco([png16, png32]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuf);

  console.log('Successfully created all favicon assets in /public:');
  console.log('- favicon.ico');
  console.log('- favicon-16x16.png');
  console.log('- favicon-32x32.png');
  console.log('- apple-touch-icon.png');
  console.log('- icon-192.png');
  console.log('- logo.png');
}

main().catch(console.error);
