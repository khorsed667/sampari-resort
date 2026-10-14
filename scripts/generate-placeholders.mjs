import { writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";

const COLORS = {
  forest: "#183C32",
  mountain: "#3F6652",
  sage: "#71816B",
  cream: "#F5F1E7",
  mist: "#FAF9F5",
  sand: "#D9C8AE",
  brown: "#765C48",
};

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ridge(rand, width, height, baseY, amplitude, points = 7) {
  const step = width / (points - 1);
  let d = `M0,${height} L0,${baseY}`;
  for (let i = 0; i < points; i++) {
    const x = i * step;
    const y = baseY - rand() * amplitude - Math.sin(i * 1.3) * amplitude * 0.3;
    d += ` L${x.toFixed(1)},${y.toFixed(1)}`;
  }
  d += ` L${width},${height} Z`;
  return d;
}

function cloudPath(cx, cy, scale, rand) {
  const r = 1 * scale;
  return `M${cx - 2.4 * r},${cy}
    c0,-${1.1 * r} ${0.9 * r},-${1.9 * r} ${1.8 * r},-${1.6 * r}
    c${0.2 * r},-${1.3 * r} ${2.4 * r},-${1.3 * r} ${2.7 * r},-${0.1 * r}
    c${1.2 * r},-${0.4 * r} ${2.3 * r},${0.6 * r} ${1.8 * r},${1.7 * r}
    c${0.9 * r},${0.5 * r} ${0.5 * r},${1.8 * r} -${0.6 * r},${1.8 * r}
    l-${5.5 * r},0
    c-${1.1 * r},0 -${1.4 * r},-${1.1 * r} -${0.6 * r},-${1.8 * r}
    Z`;
}

function svgWrap(width, height, inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice">${inner}</svg>`;
}

// Layered mountain scene — used for hero, gallery mountain shots, about section
function mountainScene(seed, width = 1600, height = 1000, opts = {}) {
  const rand = mulberry32(seed);
  const { warm = false, misty = true, showCottage = false } = opts;

  const skyTop = warm ? COLORS.sand : COLORS.mist;
  const skyBottom = COLORS.cream;

  let svg = `
  <defs>
    <linearGradient id="sky${seed}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${skyTop}" />
      <stop offset="100%" stop-color="${skyBottom}" />
    </linearGradient>
    <linearGradient id="sun${seed}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F0DAB0" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#F0DAB0" stop-opacity="0" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#sky${seed})" />
  `;

  if (warm) {
    svg += `<circle cx="${width * 0.78}" cy="${height * 0.28}" r="${height * 0.5}" fill="url(#sun${seed})" />`;
    svg += `<circle cx="${width * 0.78}" cy="${height * 0.28}" r="${height * 0.09}" fill="${COLORS.sand}" opacity="0.85" />`;
  }

  // three ridge layers, back to front
  const ridgeColors = [COLORS.sage, COLORS.mountain, COLORS.forest];
  ridgeColors.forEach((color, i) => {
    const baseY = height * (0.45 + i * 0.16);
    const amplitude = height * (0.12 - i * 0.02);
    svg += `<path d="${ridge(rand, width, height, baseY, amplitude, 8)}" fill="${color}" opacity="${0.92 - i * 0.02}" />`;
  });

  if (misty) {
    for (let i = 0; i < 3; i++) {
      const cy = height * (0.5 + i * 0.13) + rand() * 20;
      svg += `<rect x="0" y="${cy - 18}" width="${width}" height="42" fill="${COLORS.mist}" opacity="${0.35 - i * 0.08}" />`;
    }
  }

  // drifting cloud shapes
  for (let i = 0; i < 3; i++) {
    const cx = width * (0.15 + i * 0.32) + rand() * 60;
    const cy = height * (0.28 + rand() * 0.15);
    const scale = 26 + rand() * 18;
    svg += `<path d="${cloudPath(cx, cy, scale, rand)}" fill="${COLORS.mist}" opacity="0.8" />`;
  }

  if (showCottage) {
    const cw = width * 0.14;
    const ch = height * 0.1;
    const cx = width * 0.5 - cw / 2;
    const cy = height * 0.72;
    svg += `
    <rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" fill="${COLORS.brown}" opacity="0.9" />
    <polygon points="${cx - 6},${cy} ${cx + cw / 2},${cy - ch * 0.55} ${cx + cw + 6},${cy}" fill="${COLORS.forest}" />
    <rect x="${cx + cw * 0.4}" y="${cy + ch * 0.3}" width="${cw * 0.2}" height="${ch * 0.5}" fill="${COLORS.cream}" opacity="0.85" />
    `;
  }

  return svgWrap(width, height, svg);
}

// Interior / room scene — abstract window-with-a-view motif
function interiorScene(seed, width = 1200, height = 900) {
  const rand = mulberry32(seed);
  let svg = `
  <defs>
    <linearGradient id="wall${seed}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${COLORS.sand}" />
      <stop offset="100%" stop-color="${COLORS.cream}" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#wall${seed})" />
  `;
  // wood plank texture (subtle horizontal lines lower third)
  for (let i = 0; i < 10; i++) {
    const y = height * 0.72 + i * (height * 0.028);
    svg += `<rect x="0" y="${y}" width="${width}" height="2" fill="${COLORS.brown}" opacity="0.12" />`;
  }
  svg += `<rect x="0" y="${height * 0.7}" width="${width}" height="${height * 0.3}" fill="${COLORS.brown}" opacity="0.25" />`;

  // window frame with mountain view inside
  const wx = width * 0.18;
  const wy = height * 0.12;
  const ww = width * 0.64;
  const wh = height * 0.5;
  svg += `<rect x="${wx - 14}" y="${wy - 14}" width="${ww + 28}" height="${wh + 28}" fill="${COLORS.forest}" opacity="0.9" rx="4" />`;
  svg += `<clipPath id="win${seed}"><rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" /></clipPath>`;
  svg += `<g clip-path="url(#win${seed})">`;
  const mountainInner = mountainScene(seed + 7, ww, wh, { warm: true, misty: true });
  svg += mountainInner.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
  svg += `</g>`;
  svg += `<rect x="${wx + ww / 2 - 3}" y="${wy}" width="6" height="${wh}" fill="${COLORS.forest}" />`;

  return svgWrap(width, height, svg);
}

// Warm ambient scene (bonfire, food, evening) — soft radial glow composition
function ambientScene(seed, width = 1200, height = 900, night = false) {
  const rand = mulberry32(seed);
  const bg = night ? COLORS.forest : COLORS.sand;
  let svg = `
  <defs>
    <radialGradient id="glow${seed}" cx="50%" cy="65%" r="60%">
      <stop offset="0%" stop-color="${night ? "#E8B36A" : COLORS.cream}" stop-opacity="0.9" />
      <stop offset="100%" stop-color="${bg}" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="${bg}" />
  <rect width="${width}" height="${height}" fill="url(#glow${seed})" />
  `;
  if (night) {
    for (let i = 0; i < 40; i++) {
      const x = rand() * width;
      const y = rand() * height * 0.6;
      svg += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(rand() * 1.4 + 0.4).toFixed(1)}" fill="${COLORS.mist}" opacity="${(rand() * 0.6 + 0.3).toFixed(2)}" />`;
    }
  }
  svg += `<path d="${ridge(rand, width, height, height * 0.78, height * 0.08, 6)}" fill="${COLORS.forest}" opacity="0.95" />`;
  return svgWrap(width, height, svg);
}

function ensureDirAndWrite(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf-8");
  console.log("wrote", path);
}

const root = "public/images";

// Hero
ensureDirAndWrite(`${root}/hero/hero-main.svg`, mountainScene(101, 1920, 1280, { warm: true, misty: true, showCottage: true }));

// About
ensureDirAndWrite(`${root}/about/about-main.svg`, mountainScene(202, 1000, 1250, { warm: false, misty: true, showCottage: true }));

// Rooms
const roomSeeds = {
  rod: 11, brishti: 12, megh: 13, chhaya: 14,
  kp1: 15, kp2: 16, kt1: 17, kt2: 18, ch1: 19, ch2: 20, ch3: 21,
};
Object.entries(roomSeeds).forEach(([name, seed], i) => {
  const content = i % 2 === 0
    ? interiorScene(seed, 1200, 900)
    : mountainScene(seed, 1200, 900, { warm: seed % 3 === 0, misty: true, showCottage: true });
  ensureDirAndWrite(`${root}/rooms/${name}.svg`, content);
});

// Gallery
ensureDirAndWrite(`${root}/gallery/exterior-1.svg`, mountainScene(41, 1400, 1000, { warm: true, showCottage: true }));
ensureDirAndWrite(`${root}/gallery/cottage-1.svg`, interiorScene(42, 900, 1200));
ensureDirAndWrite(`${root}/gallery/mountain-1.svg`, mountainScene(43, 1600, 900, { misty: true }));
ensureDirAndWrite(`${root}/gallery/room-1.svg`, interiorScene(44, 1000, 1000));
ensureDirAndWrite(`${root}/gallery/balcony-1.svg`, mountainScene(45, 900, 1200, { warm: true, misty: true }));
ensureDirAndWrite(`${root}/gallery/mountain-2.svg`, mountainScene(46, 1600, 900, { warm: true }));
ensureDirAndWrite(`${root}/gallery/food-1.svg`, ambientScene(47, 1000, 1000, false));
ensureDirAndWrite(`${root}/gallery/evening-1.svg`, ambientScene(48, 1600, 900, true));
ensureDirAndWrite(`${root}/gallery/guests-1.svg`, ambientScene(49, 1000, 1000, false));
ensureDirAndWrite(`${root}/gallery/cottage-2.svg`, interiorScene(50, 900, 1200));

console.log("Done generating placeholder artwork.");
