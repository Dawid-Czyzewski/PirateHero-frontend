// scripts/check-responsive.mjs — samokontrola responsywności, wersja 3 (Playwright).
// Użycie:  npm run dev   (w drugim terminalu)
//          node scripts/check-responsive.mjs http://localhost:3000
//          node scripts/check-responsive.mjs http://localhost:3000 --shots   (zrzuty do ./responsive-shots)
//          node scripts/check-responsive.mjs http://localhost:3000 --only=/login,/o-grze --sizes=1024x520,1366x768
// Kończy się kodem 1, jeśli znajdzie choć jeden błąd. Wymaga: npm i -D playwright && npx playwright install chromium
//
// Reguły (v3):
//  1. brak poziomego scrolla (także ukrytego przez overflow-x:clip na html/body),
//  2. treść (logo, panele, nagłówki, przyciski, pola) nie wychodzi poza ekran i nie jest ucięta,
//  3. postać w kafelku (/o-grze „Świat gry”, /contact) mieści się w WEWNĘTRZNYM prostokącie ramy:
//     nie wchodzi na ramę ani na nity w narożnikach, dół kadru przy wewnętrznej dolnej krawędzi (≤ 6 px),
//     głowa nie jest ucięta, postać zajmuje ≥ 75% wysokości wnętrza i nie nachodzi na inne kafelki,
//  4. /login i /register (desktop): postać stoi na stopce (±2 px), brak pustego pasa > 80 px u góry sceny,
//  5. strona główna (desktop): zawodnik zajmuje ≥ 80% wysokości hero i dotyka jego dołu, podtytuł ≤ 2 linie,
//  6. na /o-grze nie ma sekcji „Skracanie czasu”,
//  7. baner cookies nie zasłania stopki.
import { chromium, devices } from 'playwright';
import fs from 'node:fs';

const arg = n => (process.argv.find(a => a.startsWith(`--${n}=`)) || '').split('=')[1];
const BASE = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');
const SHOTS = process.argv.includes('--shots');
const MAP = JSON.parse(process.env.ROUTE_MAP || '{}'); // np. dla statycznego wzoru: {"/":"/index.html",...}
let ROUTES = ['/', '/o-grze', '/contact', '/login', '/register', '/privacy', '/terms', '/cookies'];
let SIZES = ['360x740', 'iphone13', '430x932', '768x1024', '820x1180', '800x640', '1000x800', '1000x1000',
  '1024x520', '1024x527', '1024x768', '1024x866', '1180x820', '1280x631', '1280x800', '1366x657', '1366x768',
  '1440x900', '1536x864', '1600x900', '1920x1080', '2560x1440'];
if (arg('only')) ROUTES = arg('only').split(',');
if (arg('sizes')) SIZES = arg('sizes').split(',');
const BANNER_ROUTES = ['/', '/login', '/o-grze'].filter(r => ROUTES.includes(r));
const CONSENT = `try{localStorage.setItem('fl-cookie-consent',JSON.stringify({v:1,necessary:true,analytics:false,marketing:false,date:new Date().toISOString()}))}catch(e){}`;

const ctxOpts = s => {
  if (s === 'iphone13') return { ...devices['iPhone 13'] };
  const [w, h] = s.split('x').map(Number);
  // headless Chrome na Windows nie zejdzie poniżej ~500 px okna -> emulacja telefonu
  if (w < 500) return { viewport: { width: w, height: h }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, userAgent: devices['iPhone 13'].userAgent };
  return { viewport: { width: w, height: h } };
};

// ---- pomiar w przeglądarce ----
const MEASURE = async ({ route, withBanner }) => {
  const iw = innerWidth, ih = innerHeight, de = document.documentElement;
  const DESK = iw >= 900 && iw >= ih;
  const errors = [];
  const R = Math.round;
  const sel = e => { let s = e.tagName.toLowerCase(); if (e.id) s += '#' + e.id; const c = [...e.classList].slice(0, 2); if (c.length) s += '.' + c.join('.'); return s; };
  const path = e => { const a = []; let x = e; for (let i = 0; i < 3 && x && x !== document.body; i++) { a.unshift(sel(x)); x = x.parentElement; } return a.join(' > '); };
  const shown = e => { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false; const r = e.getBoundingClientRect(); return r.width > 1 && r.height > 1; };
  const isDeco = e => !!e.closest('[aria-hidden="true"],[class*=skip],.sr-only,.visually-hidden') || (e.tagName === 'IMG' && e.getAttribute('alt') === '' && !/logo/i.test(e.currentSrc || e.src));
  const clip = e => { // widoczny prostokąt po przycięciu przez przodków z overflow != visible
    const r = e.getBoundingClientRect(); let L = r.left, Rr = r.right, T = r.top, B = r.bottom, by = null, scroller = false;
    for (let p = e.parentElement; p && p !== document.body && p !== de; p = p.parentElement) {
      const cs = getComputedStyle(p); const ox = cs.overflowX, oy = cs.overflowY;
      if (/(auto|scroll)/.test(ox + oy)) scroller = true;
      if (ox !== 'visible' || oy !== 'visible') {
        const pr = p.getBoundingClientRect();
        const nL = ox !== 'visible' ? Math.max(L, pr.left) : L, nR = ox !== 'visible' ? Math.min(Rr, pr.right) : Rr;
        const nT = oy !== 'visible' ? Math.max(T, pr.top) : T, nB = oy !== 'visible' ? Math.min(B, pr.bottom) : B;
        if ((nL > L + 1 || nR < Rr - 1 || nT > T + 1 || nB < B - 1) && !by) by = sel(p);
        L = nL; Rr = nR; T = nT; B = nB;
      }
      if (cs.position === 'fixed') break;
    }
    return { r, L, R: Rr, T, B, by, scroller };
  };
  // nieprzezroczyste piksele obrazka we współrzędnych ekranu (object-fit/object-position, przycięcie do pudełka <img>)
  const alphaCache = new Map();
  const alphaMap = async src => {
    if (alphaCache.has(src)) return alphaCache.get(src);
    const im = new Image(); im.crossOrigin = 'anonymous'; im.src = src; await im.decode();
    const W = Math.min(160, im.naturalWidth), H = Math.max(1, Math.round(im.naturalHeight * W / im.naturalWidth));
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d'); g.drawImage(im, 0, 0, W, H);
    const d = g.getImageData(0, 0, W, H).data; const m = { W, H, a: new Uint8Array(W * H) };
    for (let i = 0; i < W * H; i++) m.a[i] = d[i * 4 + 3] > 40 ? 1 : 0;
    alphaCache.set(src, m); return m;
  };
  const art = async img => {
    const r = img.getBoundingClientRect(), cs = getComputedStyle(img), nw = img.naturalWidth || 1, nh = img.naturalHeight || 1;
    let dw = r.width, dh = r.height, ox = 0, oy = 0;
    const pos = (v, free) => v.endsWith('%') ? free * parseFloat(v) / 100 : v === 'left' || v === 'top' ? 0 : v === 'right' || v === 'bottom' ? free : v === 'center' ? free / 2 : parseFloat(v) || 0;
    if (/contain|cover|scale-down/.test(cs.objectFit)) {
      const s = cs.objectFit === 'cover' ? Math.max(r.width / nw, r.height / nh) : Math.min(r.width / nw, r.height / nh);
      dw = nw * s; dh = nh * s; const [px, py] = (cs.objectPosition + ' 50%').split(' ');
      ox = pos(px, r.width - dw); oy = pos(py, r.height - dh);
    }
    const m = await alphaMap(img.currentSrc || img.src);
    const pts = []; let top = Infinity, bot = -Infinity, cutTop = false;
    for (let y = 0; y < m.H; y++) for (let x = 0; x < m.W; x++) {
      if (!m.a[y * m.W + x]) continue;
      const X = r.left + ox + (x + .5) * dw / m.W, Y = r.top + oy + (y + .5) * dh / m.H;
      if (Y < r.top - .5) { cutTop = true; continue; }
      if (X < r.left || X > r.right || Y > r.bottom) continue;
      pts.push([X, Y]); top = Math.min(top, Y); bot = Math.max(bot, Y);
    }
    return { pts, top: top - dh / m.H / 2, bottom: bot + dh / m.H / 2, cutTop };
  };

  // 1) poziomy scroll (także ukryty przez overflow-x:clip na html/body)
  const prev = [de.style.overflowX, document.body.style.overflowX];
  de.style.overflowX = 'visible'; document.body.style.overflowX = 'visible';
  const sw = Math.max(de.scrollWidth, document.body.scrollWidth);
  de.style.overflowX = prev[0]; document.body.style.overflowX = prev[1];
  if (sw > iw + 1) errors.push(`poziomy scroll: scrollWidth ${sw} > ${iw} (gdy zdejmiesz overflow-x:clip z html/body)`);

  // 2) treść poza ekranem / ucięta przez overflow:hidden przodka
  const CONTENT = 'a,button,input,select,textarea,label,h1,h2,h3,h4,p,li,img,picture,[class*=logo],[class*=panel],form,table';
  const seen = [];
  for (const e of document.querySelectorAll(CONTENT)) {
    if (!shown(e) || isDeco(e)) continue;
    if (e.closest('nav[class*=menu],[role=dialog],[class*=cookie],[class*=Cookie],.ckb,.ckp')) continue;
    if (seen.some(x => x.contains(e))) continue;
    const c = clip(e); if (c.scroller) continue;
    const r = c.r; let msg = null;
    if (r.left < -1 || r.right > iw + 1) msg = `poza ekranem w poziomie: left ${R(r.left)}, right ${R(r.right)} (ekran ${iw})`;
    else if (r.top + scrollY < -1) msg = `ucięte u góry strony o ${R(-(r.top + scrollY))} px`;
    else if (c.by) {
      const area = r.width * r.height, vis = Math.max(0, c.R - c.L) * Math.max(0, c.B - c.T);
      if (area > 0 && vis / area < 0.97) msg = `ucięte przez ${c.by}: L${R(c.L - r.left)} R${R(r.right - c.R)} T${R(c.T - r.top)} B${R(r.bottom - c.B)} px`;
    }
    if (msg) { seen.push(e); errors.push(`${path(e)} — ${msg}`); }
  }

  if (!withBanner) {
    // 3) postać w kafelku z ramą
    const FRAMED = { '/o-grze': [['.world__fighter img', '.world']], '/contact': [['.contact__fighter-img', '.contact__fighter']] }[route] || [];
    for (const [is, bs] of FRAMED) {
      const img = [...document.querySelectorAll(is)].find(shown); if (!img) continue;
      const box = img.closest(bs); if (!box) { errors.push(`postać ${is}: brak kafelka ${bs}`); continue; }
      const b = box.getBoundingClientRect();
      const B = parseFloat(getComputedStyle(box, '::before').borderTopWidth) || 0;
      const rail = 0.32 * B, inTop = b.top + rail, inBot = b.bottom - rail;
      const a = await art(img);
      let onFrame = 0, onRivet = 0;
      for (const [X, Y] of a.pts) {
        const dl = X - b.left, dr = b.right - X, dt = Y - b.top, db = b.bottom - Y;
        if (dl < rail || dr < rail || dt < rail || db < rail) { onFrame++; continue; }
        for (const [dx, dy] of [[dl, dt], [dr, dt], [dl, db], [dr, db]]) if (dx < B && dy < B && dx + dy < 1.35 * B) { onRivet++; break; }
      }
      const tag = `postać ${is}`;
      if (onFrame) errors.push(`${tag} wchodzi na ramę kafelka ${bs} (${onFrame} pkt; góra ${R(a.top - b.top)} px, dół ${R(b.bottom - a.bottom)} px od krawędzi, rama ≈ ${R(rail)} px)`);
      if (onRivet) errors.push(`${tag} nachodzi na nity w narożniku kafelka ${bs} (${onRivet} pkt)`);
      if (a.cutTop) errors.push(`${tag}: głowa ucięta przez kadr obrazka (object-fit:cover)`);
      const gap = R(inBot - a.bottom);
      if (gap > 6) errors.push(`${tag}: dół kadru ${gap} px nad wewnętrzną dolną krawędzią ramy (max 6)`);
      const fill = (a.bottom - a.top) / (inBot - inTop);
      if (fill < 0.75) errors.push(`${tag}: zajmuje tylko ${R(fill * 100)}% wysokości wnętrza kafelka (min 75%)`);
      for (const pnl of document.querySelectorAll('.panel,[class*=card]')) {
        if (pnl === box || pnl.contains(img) || img.contains(pnl) || box.contains(pnl) || pnl.contains(box) || !shown(pnl)) continue;
        const q = pnl.getBoundingClientRect(); let n = 0;
        for (const [X, Y] of a.pts) if (X > q.left && X < q.right && Y > q.top && Y < q.bottom) n++;
        if (n) errors.push(`${tag} nachodzi na inny kafelek ${path(pnl)} (${n} pkt)`);
      }
    }
    // 4) logowanie / rejestracja (desktop)
    if ((route === '/login' || route === '/register') && DESK) {
      const scene = document.querySelector('.auth__scene'), img = document.querySelector('.auth__fighter img, img.auth__fighter');
      if (scene && img) {
        const s = scene.getBoundingClientRect(), a = await art(img), c = clip(img);
        const gap = R(s.bottom - Math.min(a.bottom, c.B));
        if (Math.abs(gap) > 2) errors.push(`postać logowania nie stoi na stopce: ${gap > 0 ? 'wisi ' + gap + ' px nad' : 'wystaje ' + (-gap) + ' px pod'} dołem sceny`);
        const tops = ['.auth__logo', '.auth__panel'].map(q => document.querySelector(q)).filter(Boolean).map(e => e.getBoundingClientRect().top);
        const first = Math.min(a.top, ...tops), logo = document.querySelector('.auth__logo');
        if (first - s.top > 80) errors.push(`pusty pas ${R(first - s.top)} px nad sceną (max 80): logo/postać/panel zaczynają się za nisko`);
        if (logo && logo.getBoundingClientRect().top - s.top > 80) errors.push(`logo ${R(logo.getBoundingClientRect().top - s.top)} px od góry sceny (max 80)`);
        const hArt = Math.min(a.bottom, s.bottom) - Math.max(a.top, s.top);
        if (hArt / s.height < 0.7) errors.push(`postać logowania mała: ${R(hArt / s.height * 100)}% wysokości sceny (min 70%)`);
      }
    }
    // 5) strona główna (desktop): duży zawodnik i podtytuł ≤ 2 linie
    if (route === '/' && DESK) {
      const hero = document.querySelector('.hero'), img = document.querySelector('.hero__fighter img');
      if (hero && img && shown(img)) {
        const h = hero.getBoundingClientRect(), a = await art(img);
        const vis = Math.min(a.bottom, h.bottom) - Math.max(a.top, h.top);
        if (vis / h.height < 0.8) errors.push(`zawodnik w hero zajmuje ${R(vis / h.height * 100)}% wysokości hero (min 80%)`);
        if (a.bottom < h.bottom - 2) errors.push(`zawodnik w hero nie dotyka dołu hero (brakuje ${R(h.bottom - a.bottom)} px)`);
      } else if (hero) errors.push('brak widocznego zawodnika w hero');
      const lead = document.querySelector('.hero__lead');
      if (lead) {
        const range = document.createRange(); range.selectNodeContents(lead);
        const lines = new Set([...range.getClientRects()].filter(q => q.width > 2).map(q => R(q.top / 4))).size;
        if (lines > 2) errors.push(`podtytuł hero łamie się na ${lines} linie (max 2)`);
      }
    }
    // 6) /o-grze bez „Skracanie czasu”
    if (route === '/o-grze' && /skracanie czasu/i.test(document.body.innerText)) errors.push('na /o-grze nadal jest „Skracanie czasu”');
  }

  // 7) stopka nie może być zasłonięta przez baner cookies po przewinięciu na dół
  scrollTo(0, 1e7); await new Promise(r => setTimeout(r, 250));
  const foot = document.querySelector('footer');
  const ban = [...document.querySelectorAll('[class*=cookie],[class*=Cookie],.ckb')].find(e => shown(e) && getComputedStyle(e).position === 'fixed' && !e.closest('[role=dialog]'));
  if (foot && ban) { const ov = R(foot.getBoundingClientRect().bottom - ban.getBoundingClientRect().top); if (ov > 1) errors.push(`baner cookies zasłania ${ov} px stopki (dodaj padding-bottom = wysokość banera)`); }
  scrollTo(0, 0);
  return errors;
};

const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME, args: ['--no-sandbox'] } : {});
let fails = 0;
if (SHOTS) fs.mkdirSync('responsive-shots', { recursive: true });
for (const s of SIZES) {
  for (const banner of [false, true]) {
    const routes = banner ? BANNER_ROUTES : ROUTES; if (!routes.length) continue;
    const ctx = await browser.newContext(ctxOpts(s));
    if (!banner) await ctx.addInitScript(CONSENT);
    for (const route of routes) {
      const page = await ctx.newPage();
      await page.goto(BASE + (MAP[route] || route), { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForTimeout(800);
      const settle = () => page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].filter(i => !i.complete).map(i => new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 5000); }))); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); });
      await settle();
      let errs = await page.evaluate(MEASURE, { route, withBanner: banner });
      // tryb dev bywa wolny (kompilacja, ładowanie obrazków): błąd musi się powtórzyć po 2 s, żeby się liczył
      if (errs.length) { await page.waitForTimeout(2000); await settle(); errs = await page.evaluate(MEASURE, { route, withBanner: banner }); }
      const tag = `${route.padEnd(10)} ${s.padEnd(10)}${banner ? ' [baner]' : ''}`;
      if (errs.length) { fails += errs.length; console.log(`✗ ${tag}`); errs.forEach(e => console.log('    - ' + e)); }
      else console.log(`✓ ${tag}`);
      if (SHOTS) await page.screenshot({ path: `responsive-shots/${(route === '/' ? 'home' : route.slice(1))}-${s}${banner ? '-banner' : ''}.png` });
      await page.close();
    }
    await ctx.close();
  }
}
await browser.close();
console.log(fails ? `\nBŁĘDY: ${fails}` : '\nOK — brak błędów responsywności');
process.exit(fails ? 1 : 0);
