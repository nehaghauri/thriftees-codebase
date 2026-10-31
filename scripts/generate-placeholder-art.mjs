/**
 * Generates the placeholder product illustrations in /public/products.
 *
 * These are STAND-INS for real photography. When you have your own photos:
 *   1. drop them in /public/products (or use full URLs),
 *   2. point each product's `images` array at them in src/data/products.ts,
 *   3. delete this script and the placeholder SVGs.
 *
 * Run with: npm run art
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'products');
mkdirSync(OUT, { recursive: true });

const INK = '#151B3B';
const BG = {
  butter: '#F7D94C',
  mint: '#BDE5CF',
  pink: '#F6C3D0',
  sky: '#B9CDF2',
  lilac: '#D5C8F0',
  tomato: '#EE6A55',
};

// ---------- colour helpers ----------
const toRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const toHex = (a) => '#' + a.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
const mix = (a, b, t) => { const A = toRgb(a), B = toRgb(b); return toHex(A.map((v, i) => v + (B[i] - v) * t)); };
const dark = (c, t = 0.25) => mix(c, '#000000', t);
const light = (c, t = 0.25) => mix(c, '#ffffff', t);

const S = `stroke="${INK}" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"`;
const line = (d, col = INK, w = 2.4, extra = '') => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const dashed = (d, col, w = 2.2) => line(d, col, w, 'stroke-dasharray="7 6"');
const button = (x, y, c) => `<circle cx="${x}" cy="${y}" r="6" fill="${light(c, 0.5)}" ${S}/><circle cx="${x - 1.5}" cy="${y - 1.5}" r="1.2" fill="${INK}"/><circle cx="${x + 1.5}" cy="${y + 1.5}" r="1.2" fill="${INK}"/>`;
const mirror = (s) => s; // (kept for readability: coordinates below are mirrored by hand around x=300)

// ---------- garments ----------
// Each returns { back, body: [paths], front, chest: [x, y], dy }
const G = {
  tshirt(c) {
    const d = dark(c, 0.3);
    return {
      body: ['M 215 175 L 255 160 Q 300 200 345 160 L 385 175 L 475 235 L 440 305 L 392 282 L 392 590 L 208 590 L 208 282 L 160 305 L 125 235 Z'],
      front: line('M 252 162 Q 300 212 348 162', d, 11) + line('M 215 175 L 208 282 M 385 175 L 392 282', d, 2) +
        dashed('M 208 568 L 392 568', d) + dashed('M 137 232 L 170 296 M 463 232 L 430 296', d),
      chest: [300, 360], dy: 0,
    };
  },
  shirt(c) {
    const d = dark(c, 0.3);
    let btn = '';
    for (let i = 0; i < 6; i++) btn += button(300, 255 + i * 66, c);
    return {
      body: ['M 220 170 L 262 158 L 300 190 L 338 158 L 380 170 L 440 200 L 500 520 L 452 530 L 395 330 L 392 600 L 208 600 L 205 330 L 148 530 L 100 520 L 160 200 Z'],
      front: line('M 300 190 L 300 600', d, 2.2) +
        `<path d="M 262 158 L 300 190 L 258 232 L 226 192 Z" fill="${light(c, 0.15)}" ${S}/><path d="M 338 158 L 300 190 L 342 232 L 374 192 Z" fill="${light(c, 0.15)}" ${S}/>` +
        `<path d="M 322 300 L 374 300 L 374 350 L 348 362 L 322 350 Z" fill="none" stroke="${d}" stroke-width="2.4" stroke-linejoin="round"/>` +
        line('M 104 492 L 152 503 M 496 492 L 448 503', d, 2.4) + line('M 220 170 L 205 330 M 380 170 L 395 330', d, 2) + btn,
      chest: [260, 410], dy: -5,
    };
  },
  hoodie(c) {
    const d = dark(c, 0.3);
    return {
      back: `<path d="M 235 180 Q 222 92 300 84 Q 378 92 365 180 Q 332 220 300 220 Q 268 220 235 180 Z" fill="${c}" ${S}/>`,
      body: ['M 225 185 L 262 180 Q 300 228 338 180 L 375 185 L 450 240 L 470 540 L 415 548 L 395 330 L 395 600 L 205 600 L 205 330 L 185 548 L 130 540 L 150 240 Z'],
      front: `<path d="M 262 180 Q 300 228 338 180 Q 332 122 300 120 Q 268 122 262 180 Z" fill="${d}" ${S}/>` +
        line('M 284 218 L 280 310 M 316 218 L 320 310', light(c, 0.7), 3.5) + `<circle cx="280" cy="314" r="4" fill="${INK}"/><circle cx="320" cy="314" r="4" fill="${INK}"/>` +
        `<path d="M 245 455 L 355 455 L 385 568 L 215 568 Z" fill="none" stroke="${d}" stroke-width="2.6" stroke-linejoin="round"/>` +
        line('M 205 576 L 395 576', d, 2.4) + line('M 134 515 L 187 526 M 466 515 L 413 526', d, 2.4),
      chest: [300, 385], dy: 5,
    };
  },
  sweater(c) {
    const d = dark(c, 0.28);
    return {
      body: ['M 220 185 L 262 170 Q 300 208 338 170 L 380 185 L 450 250 L 462 540 L 408 550 L 395 330 L 395 590 L 205 590 L 205 330 L 192 550 L 138 540 L 150 250 Z'],
      front: line('M 258 170 Q 300 218 342 170', d, 15) + line('M 205 556 L 395 556', d, 2.4) + line('M 140 516 L 192 527 M 460 516 L 408 527', d, 2.4) +
        line('M 218 192 L 205 330 M 382 192 L 395 330', d, 2),
      chest: [300, 360], dy: 5,
    };
  },
  cardigan(c) {
    const d = dark(c, 0.28);
    let btn = '';
    for (let i = 0; i < 5; i++) btn += button(300, 312 + i * 58, c);
    return {
      body: ['M 220 185 L 262 170 Q 300 208 338 170 L 380 185 L 450 250 L 462 540 L 408 550 L 395 330 L 395 590 L 205 590 L 205 330 L 192 550 L 138 540 L 150 250 Z'],
      front: line('M 262 170 L 300 266 L 338 170', d, 13) + line('M 300 266 L 300 590', d, 2.4) + line('M 205 556 L 395 556', d, 2.4) +
        line('M 140 516 L 192 527 M 460 516 L 408 527', d, 2.4) +
        `<path d="M 222 430 L 272 430 L 272 492 L 222 492 Z M 328 430 L 378 430 L 378 492 L 328 492 Z" fill="none" stroke="${d}" stroke-width="2.4" stroke-linejoin="round"/>` + btn,
      chest: [255, 345], dy: 5,
    };
  },
  jacket(c, o = {}) {
    const d = dark(c, 0.3);
    let hw = '';
    if (o.zip) {
      for (let y = 200; y < 585; y += 14) hw += line(`M 295 ${y} L 305 ${y}`, d, 2);
      hw += `<rect x="293" y="205" width="14" height="26" rx="3" fill="${light(c, 0.5)}" ${S}/>`;
    } else {
      for (let i = 0; i < 5; i++) hw += button(300, 285 + i * 58, c);
    }
    return {
      body: ['M 215 175 L 262 160 L 300 195 L 338 160 L 385 175 L 445 215 L 478 540 L 420 552 L 398 330 L 398 590 L 202 590 L 202 330 L 180 552 L 122 540 L 155 215 Z'],
      front: line('M 300 195 L 300 590', d, 2.4) +
        `<path d="M 262 160 L 300 195 L 272 240 L 226 206 Z" fill="${light(c, 0.12)}" ${S}/><path d="M 338 160 L 300 195 L 328 240 L 374 206 Z" fill="${light(c, 0.12)}" ${S}/>` +
        `<path d="M 226 282 L 272 282 L 272 322 L 226 322 Z M 328 282 L 374 282 L 374 322 L 328 322 Z M 222 420 L 276 420 L 276 462 L 222 462 Z M 324 420 L 378 420 L 378 462 L 324 462 Z" fill="none" stroke="${d}" stroke-width="2.6" stroke-linejoin="round"/>` +
        line('M 215 175 L 202 330 M 385 175 L 398 330', d, 2) + line('M 126 505 L 176 516 M 474 505 L 424 516', d, 2.4) + dashed('M 202 568 L 398 568', d) + hw,
      chest: [300, 380], dy: 0,
    };
  },
  jeans(c) {
    const d = dark(c, 0.3);
    const st = '#E5B04B';
    return {
      body: ['M 200 130 L 400 130 L 425 640 L 322 640 L 300 270 L 278 640 L 175 640 Z'],
      front: `<path d="M 200 130 L 400 130 L 402 168 L 198 168 Z" fill="${light(c, 0.06)}" ${S}/>` +
        `<rect x="214" y="122" width="12" height="54" rx="3" fill="${c}" ${S}/><rect x="374" y="122" width="12" height="54" rx="3" fill="${c}" ${S}/><rect x="294" y="122" width="12" height="54" rx="3" fill="${c}" ${S}/>` +
        `<circle cx="300" cy="185" r="6" fill="${st}" ${S}/>` +
        dashed('M 300 170 L 300 258 Q 300 270 283 267', st) + dashed('M 206 172 C 210 238 240 256 274 253 M 394 172 C 390 238 360 256 326 253', st) +
        `<circle cx="205" cy="172" r="3.5" fill="${st}" ${S}/><circle cx="395" cy="172" r="3.5" fill="${st}" ${S}/>` +
        line('M 176 618 L 279 618 M 321 618 L 424 618', d, 2.4),
      chest: [300, 330], dy: 15,
    };
  },
  trousers(c) {
    const d = dark(c, 0.3);
    return {
      body: ['M 196 130 L 404 130 L 424 655 L 320 655 L 300 300 L 280 655 L 176 655 Z'],
      front: `<path d="M 196 130 L 404 130 L 405 166 L 195 166 Z" fill="${light(c, 0.06)}" ${S}/>` +
        `<rect x="214" y="122" width="11" height="52" rx="3" fill="${c}" ${S}/><rect x="375" y="122" width="11" height="52" rx="3" fill="${c}" ${S}/>` +
        line('M 300 168 L 300 290', d, 2.2) + `<circle cx="300" cy="182" r="6" fill="${light(c, 0.5)}" ${S}/>` +
        line('M 256 168 L 250 262 M 344 168 L 350 262', d, 2.2) + line('M 198 172 L 224 236 M 402 172 L 376 236', d, 2.4) +
        line('M 246 300 L 229 650 M 354 300 L 371 650', d, 1.8, 'opacity=".55"') + line('M 177 632 L 280 632 M 320 632 L 423 632', d, 2.4),
      chest: [300, 330], dy: 5,
    };
  },
  shorts(c) {
    const d = dark(c, 0.3);
    const st = '#E5B04B';
    return {
      body: ['M 198 130 L 402 130 L 432 395 L 322 395 L 300 262 L 278 395 L 168 395 Z'],
      front: `<path d="M 198 130 L 402 130 L 403 166 L 197 166 Z" fill="${light(c, 0.06)}" ${S}/>` +
        `<rect x="214" y="122" width="11" height="52" rx="3" fill="${c}" ${S}/><rect x="375" y="122" width="11" height="52" rx="3" fill="${c}" ${S}/>` +
        `<circle cx="300" cy="182" r="6" fill="${light(c, 0.5)}" ${S}/>` + line('M 300 168 L 300 252', d, 2.2) +
        dashed('M 204 172 C 208 232 236 248 268 245 M 396 172 C 392 232 364 248 332 245', st) + line('M 171 372 L 282 372 M 318 372 L 429 372', d, 2.4),
      chest: [300, 320], dy: 125,
    };
  },
  croptop(c) {
    const d = dark(c, 0.3);
    return {
      body: ['M 225 215 L 262 205 Q 300 238 338 205 L 375 215 L 440 260 L 410 322 L 385 302 L 385 440 L 215 440 L 215 302 L 190 322 L 160 260 Z'],
      front: line('M 258 207 Q 300 248 342 207', d, 9) + line('M 215 428 L 385 428', d, 2.4) + dashed('M 168 262 L 194 312 M 432 262 L 406 312', d),
      chest: [300, 330], dy: 70,
    };
  },
  top(c, o = {}) {
    const d = dark(c, 0.3);
    return {
      back: o.puff ? `<ellipse cx="222" cy="218" rx="46" ry="38" fill="${c}" ${S}/><ellipse cx="378" cy="218" rx="46" ry="38" fill="${c}" ${S}/>` : '',
      body: ['M 245 160 L 268 160 L 300 255 L 332 160 L 355 160 L 372 270 Q 372 312 392 346 L 392 590 L 208 590 L 208 346 Q 228 312 228 270 Z'],
      front: (o.puff ? line('M 188 238 Q 222 262 258 240 M 342 240 Q 378 262 412 238', d, 2.4) : '') +
        dashed('M 208 568 L 392 568', d) + line('M 268 160 L 300 255 L 332 160', d, 2.6),
      chest: [300, 400], dy: 15,
    };
  },
  skirt(c, o = {}) {
    const d = dark(c, 0.3);
    const hem = o.mini ? 470 : 640;
    const lx = (y) => 225 - (90 * (y - 185)) / 455;
    const rx = (y) => 375 + (90 * (y - 185)) / 455;
    let pleats = '';
    for (let k = 1; k < 8; k++) {
      const t = k / 8;
      pleats += line(`M ${225 + 150 * t} 185 L ${lx(hem) + (rx(hem) - lx(hem)) * t} ${hem - 4}`, d, 1.8, 'opacity=".6"');
    }
    return {
      body: [`M 225 150 L 375 150 L 375 185 L ${rx(hem)} ${hem} L ${lx(hem)} ${hem} L 225 185 Z`],
      front: `<path d="M 225 150 L 375 150 L 375 185 L 225 185 Z" fill="${light(c, 0.08)}" ${S}/>` + pleats + line(`M ${lx(hem - 16)} ${hem - 16} L ${rx(hem - 16)} ${hem - 16}`, d, 2.2),
      chest: [300, 300], dy: o.mini ? 85 : 0,
    };
  },
  dress(c) {
    const d = dark(c, 0.3);
    let pleats = '';
    for (let k = 1; k < 7; k++) {
      const t = k / 7;
      pleats += line(`M ${232 + 136 * t} 296 L ${150 + 300 * t} 694`, d, 1.8, 'opacity=".5"');
    }
    return {
      body: ['M 255 100 L 275 100 L 300 190 L 325 100 L 345 100 L 362 215 Q 355 255 368 292 L 450 700 L 150 700 L 232 292 Q 245 255 238 215 Z'],
      front: line('M 275 100 L 300 190 L 325 100', d, 2.6) + `<path d="M 232 292 L 368 292 L 369 312 L 231 312 Z" fill="${light(c, 0.06)}" ${S}/>` + pleats + dashed('M 154 676 L 446 676', d),
      chest: [300, 240], dy: -5,
    };
  },
  shawl(c) {
    const d = dark(c, 0.3);
    let fringe = '';
    for (let i = 0; i <= 26; i++) {
      const t = i / 26;
      const x = (1 - t) ** 2 * 480 + 2 * (1 - t) * t * 300 + t ** 2 * 120;
      const y = (1 - t) ** 2 * 560 + 2 * (1 - t) * t * 640 + t ** 2 * 560;
      fringe += line(`M ${x.toFixed(1)} ${y.toFixed(1)} L ${x.toFixed(1)} ${(y + 36).toFixed(1)}`, d, 3);
    }
    return {
      back: fringe,
      body: ['M 95 210 Q 300 140 505 210 L 480 560 Q 300 640 120 560 Z'],
      front: line('M 190 172 Q 230 380 180 590', d, 2.4, 'opacity=".5"') + line('M 300 156 Q 330 380 300 624', d, 2.4, 'opacity=".5"') + line('M 410 172 Q 370 380 418 590', d, 2.4, 'opacity=".5"'),
      chest: [300, 330], dy: -5,
    };
  },
  tote(c) {
    const d = dark(c, 0.3);
    return {
      back: `<path d="M 225 310 C 225 150 375 150 375 310" fill="none" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M 225 310 C 225 150 375 150 375 310" fill="none" stroke="${d}" stroke-width="13" stroke-linecap="round"/>`,
      body: ['M 165 300 L 435 300 L 455 640 L 145 640 Z'],
      front: `<path d="M 235 440 L 365 440 L 369 520 L 231 520 Z" fill="none" stroke="${d}" stroke-width="2.6" stroke-linejoin="round"/>` + dashed('M 168 322 L 432 322', d),
      chest: [300, 380], dy: 0,
    };
  },
  cap(c) {
    const d = dark(c, 0.3);
    return {
      body: ['M 150 410 C 140 240 460 240 450 410 Z', 'M 150 410 C 110 446 150 480 300 476 C 430 472 480 444 450 410 Z'],
      front: line('M 300 275 C 268 310 252 360 248 410 M 300 275 L 300 410 M 300 275 C 332 310 348 360 352 410', d, 2.2) +
        `<circle cx="300" cy="270" r="9" fill="${d}" ${S}/>` + line('M 152 412 C 200 428 400 428 448 412', d, 2.6),
      chest: [300, 345], dy: -10,
    };
  },
  belt(c) {
    const d = dark(c, 0.3);
    let holes = '';
    for (let i = 0; i < 5; i++) holes += `<circle cx="${360 + i * 34}" cy="385" r="6" fill="${d}" ${S}/>`;
    return {
      body: ['M 80 358 L 520 358 L 520 412 L 80 412 Z'],
      front: dashed('M 90 366 L 510 366', d) + dashed('M 90 404 L 510 404', d) + holes +
        `<rect x="228" y="330" width="86" height="110" rx="10" fill="none" stroke="${INK}" stroke-width="12"/><rect x="228" y="330" width="86" height="110" rx="10" fill="none" stroke="#E5B04B" stroke-width="6"/>` +
        `<path d="M 271 360 L 271 410" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`,
      chest: [300, 385], dy: 0,
    };
  },
  shades(c) {
    return {
      body: ['M 120 330 Q 120 322 135 322 L 262 322 Q 285 322 285 350 L 285 392 Q 285 430 250 430 L 160 430 Q 120 430 120 392 Z', 'M 315 350 Q 315 322 338 322 L 465 322 Q 480 322 480 330 L 480 392 Q 480 430 440 430 L 350 430 Q 315 430 315 392 Z'],
      front: `<path d="M 285 346 Q 300 330 315 346" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>` +
        line('M 120 336 L 76 322 M 480 336 L 524 322', INK, 9) + line('M 150 352 L 190 352 M 345 352 L 385 352', '#ffffff', 5, 'opacity=".5"'),
      chest: [300, 380], dy: 0,
    };
  },
  beanie(c) {
    const d = dark(c, 0.25);
    let ribs = '';
    for (let x = 175; x <= 425; x += 25) ribs += line(`M ${x} 482 L ${x} 538`, d, 2.2);
    return {
      back: `<circle cx="300" cy="226" r="40" fill="${light(c, 0.2)}" ${S}/>`,
      body: ['M 158 490 C 158 235 442 235 442 490 Z', 'M 150 482 L 450 482 L 450 545 L 150 545 Z'],
      front: ribs + line('M 150 482 L 450 482', INK, 3.2) + line('M 230 330 C 230 300 270 270 300 262', d, 2, 'opacity=".5"'),
      chest: [300, 400], dy: 0,
    };
  },
};

// ---------- patterns (clipped to the garment) ----------
function pattern(kind, acc, c, id, chest) {
  switch (kind) {
    case 'stripe':
      return `<defs><pattern id="p${id}" width="60" height="46" patternUnits="userSpaceOnUse"><rect y="0" width="60" height="15" fill="${acc}"/></pattern></defs><rect width="600" height="750" fill="url(#p${id})"/>`;
    case 'plaid':
      return `<defs><pattern id="p${id}" width="84" height="84" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="84" height="22" fill="${acc}" opacity=".38"/><rect x="0" y="0" width="22" height="84" fill="${acc}" opacity=".38"/><rect x="40" y="0" width="3" height="84" fill="${INK}" opacity=".35"/><rect x="0" y="40" width="84" height="3" fill="${INK}" opacity=".35"/></pattern></defs><rect width="600" height="750" fill="url(#p${id})"/>`;
    case 'dots':
      return `<defs><pattern id="p${id}" width="38" height="38" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="5" fill="${acc}"/><circle cx="29" cy="29" r="5" fill="${acc}"/></pattern></defs><rect width="600" height="750" fill="url(#p${id})"/>`;
    case 'knit':
      return `<defs><pattern id="p${id}" width="14" height="16" patternUnits="userSpaceOnUse"><path d="M 1 2 L 7 12 L 13 2" fill="none" stroke="${INK}" stroke-width="1.6" opacity=".22"/></pattern></defs><rect width="600" height="750" fill="url(#p${id})"/>`;
    case 'floral':
      return `<defs><pattern id="p${id}" width="74" height="74" patternUnits="userSpaceOnUse"><g fill="${acc}"><circle cx="18" cy="12" r="5"/><circle cx="26" cy="18" r="5"/><circle cx="24" cy="27" r="5"/><circle cx="13" cy="27" r="5"/><circle cx="10" cy="18" r="5"/></g><circle cx="18" cy="20" r="3.5" fill="${INK}"/><g fill="${acc}" opacity=".8"><circle cx="55" cy="50" r="4"/><circle cx="62" cy="56" r="4"/><circle cx="59" cy="64" r="4"/><circle cx="50" cy="64" r="4"/><circle cx="48" cy="56" r="4"/></g><circle cx="55" cy="57" r="2.8" fill="${INK}"/></pattern></defs><rect width="600" height="750" fill="url(#p${id})"/>`;
    case 'wash':
      return `<defs><radialGradient id="p${id}" cx="50%" cy="48%" r="45%"><stop offset="0" stop-color="#fff" stop-opacity=".3"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="600" height="750" fill="url(#p${id})"/>`;
    case 'graphic': {
      const [x, y] = chest;
      let rays = '';
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        rays += line(`M ${x + Math.cos(a) * 38} ${y + Math.sin(a) * 38} L ${x + Math.cos(a) * 54} ${y + Math.sin(a) * 54}`, acc, 5);
      }
      return rays + `<circle cx="${x}" cy="${y}" r="30" fill="${acc}" ${S}/><path d="M ${x - 15} ${y + 2} Q ${x} ${y + 18} ${x + 15} ${y + 2}" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/><circle cx="${x - 10}" cy="${y - 8}" r="3" fill="${INK}"/><circle cx="${x + 10}" cy="${y - 8}" r="3" fill="${INK}"/>`;
    }
    default:
      return '';
  }
}

// ---------- backdrop ----------
function backdrop(bg, deco) {
  const l = light(bg, 0.4);
  let shape = '';
  if (deco === 0) shape = `<circle cx="300" cy="385" r="250" fill="${l}"/>`;
  if (deco === 1) shape = `<path d="M 90 740 L 90 330 A 210 210 0 0 1 510 330 L 510 740 Z" fill="${l}"/>`;
  if (deco === 2) shape = [0, 1, 2, 3, 4, 5].map((i) => `<rect x="0" y="${80 + i * 120}" width="600" height="46" fill="${l}"/>`).join('');
  if (deco === 3) shape = `<circle cx="470" cy="150" r="90" fill="${l}"/><circle cx="110" cy="640" r="60" fill="${l}"/>`;
  return `<rect width="600" height="750" fill="${bg}"/>${shape}`;
}

function render(spec, side) {
  const [id, type, color, pat, acc, bgName, opt = {}] = spec;
  const num = id.replace('thr-', '');
  const g = G[type](color, opt);
  const bgKeys = Object.keys(BG);
  const bgIdx = bgKeys.indexOf(bgName);
  const bg = BG[side === 'a' ? bgName : bgKeys[(bgIdx + 2) % bgKeys.length]];
  const deco = (Number(num) + (side === 'a' ? 0 : 2)) % 4;
  const clipId = `c${num}${side}`;
  const body = g.body.map((d) => `<path d="${d}" fill="${color}" ${S}/>`).join('');
  const outline = g.body.map((d) => `<path d="${d}" fill="none" ${S}/>`).join('');
  const clip = `<clipPath id="${clipId}">${g.body.map((d) => `<path d="${d}"/>`).join('')}</clipPath>`;
  const tf = side === 'a' ? `translate(0 ${g.dy})` : `translate(300 ${390 + g.dy}) rotate(-7) scale(1.06) translate(-300 -390)`;
  const tag = side === 'b'
    ? `<g transform="translate(402 604) rotate(8)"><path d="M 0 22 L 22 0 L 150 0 L 150 96 L 22 96 L 0 74 Z" fill="#F4F1EA" ${S}/><circle cx="22" cy="48" r="6" fill="${bg}" ${S}/><text x="40" y="34" font-family="Menlo, Consolas, monospace" font-size="15" font-weight="700" fill="${INK}">thriftees</text><text x="40" y="56" font-family="Menlo, Consolas, monospace" font-size="12" fill="${INK}">pre-loved</text><text x="40" y="78" font-family="Menlo, Consolas, monospace" font-size="12" fill="${INK}">no. ${num}</text></g>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750" role="img" aria-label="Illustration of ${type}">
<defs><filter id="sh${num}${side}" x="-10%" y="-10%" width="130%" height="130%"><feDropShadow dx="9" dy="12" stdDeviation="0" flood-color="${INK}" flood-opacity=".16"/></filter>${clip}</defs>
${backdrop(bg, deco)}
<g transform="${tf}">
<g filter="url(#sh${num}${side})">${g.back ?? ''}${body}</g>
<g clip-path="url(#${clipId})">${pattern(pat, acc, color, num + side, g.chest)}</g>
${outline}
${g.front}
</g>
${tag}
</svg>
`;
}

// [id, garment, colour, pattern, accent, backdrop, options]
const SPECS = [
  ['thr-001', 'tshirt', '#33322F', 'graphic', '#F7D94C', 'mint'],
  ['thr-002', 'tshirt', '#EFE6D2', 'stripe', '#D63A28', 'sky'],
  ['thr-003', 'shirt', '#2F4A6B', 'none', '#fff', 'butter'],
  ['thr-004', 'shirt', '#6B7A4B', 'plaid', '#D63A28', 'pink'],
  ['thr-005', 'hoodie', '#4A4945', 'graphic', '#EFE6D2', 'pink'],
  ['thr-006', 'hoodie', '#C4573A', 'none', '#fff', 'sky'],
  ['thr-007', 'sweater', '#E8DFC9', 'knit', '#fff', 'mint'],
  ['thr-008', 'sweater', '#3F5B46', 'knit', '#fff', 'butter'],
  ['thr-009', 'jacket', '#6E8BAA', 'wash', '#fff', 'butter', { zip: false }],
  ['thr-010', 'jacket', '#5E6B45', 'none', '#fff', 'lilac', { zip: true }],
  ['thr-011', 'jeans', '#6F90B3', 'wash', '#fff', 'pink'],
  ['thr-012', 'jeans', '#2B2B33', 'wash', '#fff', 'mint'],
  ['thr-013', 'trousers', '#C2A878', 'none', '#fff', 'sky'],
  ['thr-014', 'trousers', '#4B4B53', 'none', '#fff', 'butter'],
  ['thr-015', 'shorts', '#8FB0CE', 'wash', '#fff', 'pink'],
  ['thr-016', 'shorts', '#77805A', 'none', '#fff', 'lilac'],
  ['thr-017', 'cap', '#2F4A6B', 'none', '#fff', 'butter'],
  ['thr-018', 'belt', '#7A4A2B', 'none', '#fff', 'mint'],
  ['thr-019', 'croptop', '#F0D56E', 'knit', '#fff', 'pink'],
  ['thr-020', 'croptop', '#F4EFE4', 'graphic', '#D63A28', 'mint'],
  ['thr-021', 'top', '#F2E6D0', 'floral', '#D63A28', 'sky', { puff: true }],
  ['thr-022', 'top', '#25242A', 'none', '#fff', 'pink'],
  ['thr-023', 'tshirt', '#8A8984', 'graphic', '#F7D94C', 'tomato'],
  ['thr-024', 'tshirt', '#BFD3E0', 'stripe', '#2F4A6B', 'butter'],
  ['thr-025', 'sweater', '#D9C7A5', 'knit', '#fff', 'mint'],
  ['thr-026', 'sweater', '#E3B5A8', 'knit', '#fff', 'sky'],
  ['thr-027', 'hoodie', '#8FA383', 'graphic', '#F4EFE4', 'pink'],
  ['thr-028', 'cardigan', '#5A3B2E', 'knit', '#fff', 'butter'],
  ['thr-029', 'cardigan', '#EFE6D2', 'knit', '#fff', 'pink'],
  ['thr-030', 'jacket', '#A8663A', 'none', '#fff', 'mint', { zip: false }],
  ['thr-031', 'jacket', '#2B2523', 'none', '#fff', 'butter', { zip: true }],
  ['thr-032', 'jeans', '#7FA0C2', 'wash', '#fff', 'pink'],
  ['thr-033', 'jeans', '#34476B', 'wash', '#fff', 'butter'],
  ['thr-034', 'trousers', '#E8DFC9', 'none', '#fff', 'mint'],
  ['thr-035', 'skirt', '#3F5B46', 'plaid', '#D63A28', 'pink', { mini: true }],
  ['thr-036', 'skirt', '#6F90B3', 'wash', '#fff', 'butter'],
  ['thr-037', 'dress', '#E9C9B8', 'floral', '#8A3B2A', 'sky'],
  ['thr-038', 'dress', '#232226', 'none', '#fff', 'butter'],
  ['thr-039', 'shawl', '#B8573A', 'dots', '#F7D94C', 'mint'],
  ['thr-040', 'shawl', '#D9A93C', 'plaid', '#5A3B2E', 'sky'],
  ['thr-041', 'tote', '#E8DFC9', 'stripe', '#3F5B46', 'pink'],
  ['thr-042', 'shades', '#5A3B2E', 'none', '#fff', 'butter'],
];

for (const spec of SPECS) {
  for (const side of ['a', 'b']) {
    writeFileSync(join(OUT, `${spec[0]}-${side}.svg`), render(spec, side));
  }
}
console.log(`Wrote ${SPECS.length * 2} placeholder images to public/products`);
