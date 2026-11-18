import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DOCS_POBRANE = path.resolve(ROOT, "..", "freak-legends-docs", "pobrane");
const SOURCE = process.env.FL_ASSETS_SRC ? path.resolve(process.env.FL_ASSETS_SRC) : DOCS_POBRANE;
const OUT_CHARACTER = path.join(ROOT, "public", "character");
const OUT_ICONS = path.join(ROOT, "public", "icons");

const FRAME = { width: 1024, height: 1536 };
const ICON = { width: 512, height: 512 };
const BANNER = { width: 1536, height: 512 };
const GREEN = { r: 0, g: 255, b: 0 };
const GREEN_DISTANCE = 90;

const SHEETS = {
  "01-cialo-skora": { prefix: "cialo", count: 5, grid: null },
  "02-twarze": { prefix: "twarz", count: 8, grid: null },
  "03-wlosy": { prefix: "wlosy", count: 8, grid: null },
  "04-brody": { prefix: "broda", count: 8, grid: null },
  "05-tatuaze": { prefix: "tatuaz", count: 8, grid: null },
};

const SINGLES = [
  { file: "06-naglowek.jpg", out: "naglowek", kind: "banner" },
  { file: "06-tlo-sceny.jpg", out: "tlo-sceny", kind: "scene" },
  { file: "09-naglowek-postac.jpg", out: "naglowek-postac", kind: "banner", trim: true },
];

const ICONS = [
  { source: "07-ikona-cebuliony", out: "ikona-cebuliony.png" },
  { source: "07-ikona-zlote-zeby", out: "ikona-zlote-zeby.png" },
  { source: "07-ikona-kondycha", out: "ikona-kondycha.png" },
  { source: "07-ikona-zasiegi", out: "ikona-zasiegi.png" },
  { source: "07-ikona-medale", out: "ikona-medale.png" },
  { source: "07-slot-ekwipunku", out: "slot-ekwipunku.png" },
  { source: "08-menu-postac", out: "menu-character.png" },
  { source: "08-menu-trening", out: "menu-training.png" },
  { source: "08-menu-zlecenia", out: "menu-jobs.png" },
  { source: "08-menu-oktagon", out: "menu-octagon.png" },
  { source: "08-menu-ranking", out: "menu-ranking.png" },
  { source: "08-menu-sklep", out: "menu-shop.png" },
];

const ICON_SOURCE_EXTENSIONS = [".jpg", ".png"];

const ARGS = process.argv.slice(2);
const ONLY_PREFIX = "--only=";
const ONLY = new Set(ARGS.filter((arg) => arg.startsWith(ONLY_PREFIX)).map((arg) => arg.slice(ONLY_PREFIX.length)));
const STAGES = new Set(ARGS.filter((arg) => !arg.startsWith("--")));

function isGreen(r, g, b, distance = GREEN_DISTANCE) {
  const dr = r - GREEN.r;
  const dg = g - GREEN.g;
  const db = b - GREEN.b;
  return Math.sqrt(dr * dr + dg * dg + db * db) <= distance;
}

function cleanBannerRgba(rgba) {
  const keyed = chromaKey({ ...rgba, data: Buffer.from(rgba.data) }, 120);
  const { data, width, height } = keyed;

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a === 0) continue;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const despilled = Math.round((r + b) / 2);
    if (g > despilled + 12) {
      data[i + 1] = despilled;
    }

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    const isGlow =
      a < 220 &&
      sat > 0.25 &&
      ((g > r + 8 && g > b + 8) || (r > 70 && r > g * 1.35 && r > b * 1.35 && g < 110));
    if (isGlow) {
      data[i + 3] = 0;
      continue;
    }

    if (max < 28) data[i + 3] = 0;
  }

  let contentMaxY = 0;
  for (let y = 0; y < height; y++) {
    let solid = 0;
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (data[i + 3] < 40) continue;
      const max = Math.max(data[i], data[i + 1], data[i + 2]);
      if (max > 55) solid += 1;
    }
    if (solid > width * 0.02) contentMaxY = y;
  }
  const cutY = Math.min(height - 1, contentMaxY + Math.round(height * 0.04));
  for (let y = cutY + 1; y < height; y++) {
    for (let x = 0; x < width; x++) data[(y * width + x) * 4 + 3] = 0;
  }

  return { data, width, height, opaque: keyed.opaque, bbox: keyed.bbox };
}

async function listImages(dir) {
  const names = await readdir(dir);
  return names
    .filter((name) => /\.(png|jpe?g|webp)$/i.test(name))
    .sort((a, b) => a.localeCompare(b, "en"))
    .map((name) => path.join(dir, name));
}

async function loadRgba(filePath) {
  const { data, info } = await sharp(filePath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data: Buffer.from(data), width: info.width, height: info.height };
}

function chromaKey(rgba, distance = GREEN_DISTANCE) {
  const { data, width, height } = rgba;
  let opaque = 0;
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let i = 0; i < data.length; i += 4) {
    if (isGreen(data[i], data[i + 1], data[i + 2], distance)) {
      data[i + 3] = 0;
      continue;
    }
    opaque += 1;
    const pixel = i / 4;
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }

  return {
    data,
    width,
    height,
    opaque,
    bbox: opaque === 0 ? null : { minX, minY, maxX, maxY, w: maxX - minX + 1, h: maxY - minY + 1 },
  };
}

async function toFramePng(keyed, size) {
  return sharp(keyed.data, { raw: { width: keyed.width, height: keyed.height, channels: 4 } })
    .resize(size.width, size.height, { fit: "fill" })
    .png()
    .toBuffer();
}

async function toTrimmedPng(keyed) {
  return sharp(keyed.data, { raw: { width: keyed.width, height: keyed.height, channels: 4 } })
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 0 })
    .png()
    .toBuffer();
}

async function saveWebpAndPng(buffer, basePath) {
  await sharp(buffer).webp({ quality: 90 }).toFile(`${basePath}.webp`);
  await sharp(buffer).png().toFile(`${basePath}.png`);
}

function sliceSheet(rgba, cols, rows) {
  const cellW = Math.floor(rgba.width / cols);
  const cellH = Math.floor(rgba.height / rows);
  const cells = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const left = col * cellW;
      const top = row * cellH;
      cells.push(
        sharp(rgba.data, { raw: { width: rgba.width, height: rgba.height, channels: 4 } })
          .extract({ left, top, width: cellW, height: cellH })
          .ensureAlpha()
          .raw()
          .toBuffer({ resolveWithObject: true })
          .then(({ data, info }) => ({
            data: Buffer.from(data),
            width: info.width,
            height: info.height,
          })),
      );
    }
  }
  return Promise.all(cells);
}

async function processPartFolder(folderName, config, report) {
  const dir = path.join(SOURCE, folderName);
  const files = await listImages(dir);
  if (files.length === 0) {
    report.missing.push(`brak plików w ${folderName}`);
    return;
  }

  if (files.length === 1) {
    const meta = await sharp(files[0]).metadata();
    if ((meta.width ?? 0) > (meta.height ?? 0) * 1.2) {
      const rgba = await loadRgba(files[0]);
      const cells = await sliceSheet(rgba, 4, 2);
      for (let i = 0; i < config.count; i++) {
        const keyed = chromaKey(cells[i]);
        const png = await toFramePng(keyed, FRAME);
        const base = path.join(OUT_CHARACTER, `${config.prefix}-${i + 1}`);
        await saveWebpAndPng(png, base);
        report.written.push(`${config.prefix}-${i + 1}.webp`);
        report.bboxes.push({ id: `${config.prefix}-${i + 1}`, ...keyed.bbox, opaque: keyed.opaque });
      }
      return;
    }
  }

  const selected = files.slice(0, config.count);
  if (files.length > config.count) {
    report.warnings.push(`${folderName}: ${files.length} plików, biorę pierwsze ${config.count} (alfa): ${selected.map((f) => path.basename(f)).join(", ")}`);
  }
  if (selected.length < config.count) {
    report.missing.push(`${folderName}: oczekiwano ${config.count}, jest ${selected.length}`);
  }

  for (let i = 0; i < selected.length; i++) {
    const keyed = chromaKey(await loadRgba(selected[i]));
    const png = await toFramePng(keyed, FRAME);
    const base = path.join(OUT_CHARACTER, `${config.prefix}-${i + 1}`);
    await saveWebpAndPng(png, base);
    report.written.push(`${config.prefix}-${i + 1}.webp`);
    report.bboxes.push({
      id: `${config.prefix}-${i + 1}`,
      source: path.basename(selected[i]),
      ...keyed.bbox,
      opaque: keyed.opaque,
      fullBodyHint: keyed.opaque > keyed.width * keyed.height * 0.15,
    });
  }
}

async function processSingles(report) {
  for (const item of SINGLES.filter(isSelected)) {
    const src = path.join(SOURCE, item.file);
    try {
      const rgba = await loadRgba(src);
      const keyed = item.kind === "banner" ? cleanBannerRgba(rgba) : chromaKey(rgba);
      const png = item.trim ? await toTrimmedPng(keyed) : await toFramePng(keyed, item.kind === "banner" ? BANNER : FRAME);
      const base = path.join(OUT_CHARACTER, item.out);
      await saveWebpAndPng(png, base);
      report.written.push(`${item.out}.webp`);
    } catch {
      report.missing.push(item.file);
    }
  }
}

async function loadFirstRgba(basePath, extensions) {
  for (const extension of extensions) {
    try {
      return await loadRgba(`${basePath}${extension}`);
    } catch {
      continue;
    }
  }
  return null;
}

async function processIcons(report) {
  for (const item of ICONS.filter(isSelected)) {
    const rgba = await loadFirstRgba(path.join(SOURCE, item.source), ICON_SOURCE_EXTENSIONS);
    if (!rgba) {
      report.missing.push(`icons/${item.out}`);
      continue;
    }
    const png = await toFramePng(chromaKey(rgba), ICON);
    await sharp(png).png().toFile(path.join(OUT_ICONS, item.out));
    report.written.push(`icons/${item.out}`);
  }
}

function isSelected(item) {
  return ONLY.size === 0 || ONLY.has(item.out);
}

function runs(stage) {
  return STAGES.size === 0 || STAGES.has(stage);
}

function analyzeAlignment(report) {
  const bodies = report.bboxes.filter((b) => b?.id?.startsWith("cialo-") && b.w);
  if (bodies.length === 0) return;
  const ref = bodies[0];
  const drift = report.bboxes
    .filter((b) => b?.w)
    .map((b) => ({
      id: b.id,
      dMinX: b.minX - ref.minX,
      dMinY: b.minY - ref.minY,
      dW: b.w - ref.w,
      dH: b.h - ref.h,
    }))
    .filter((d) => Math.abs(d.dMinX) > 24 || Math.abs(d.dMinY) > 24 || Math.abs(d.dW) > 40 || Math.abs(d.dH) > 40);

  report.alignment = {
    reference: ref.id,
    drifted: drift,
    note:
      "Jeśli warstwy to pełne ciała (nie osobne overlaye), stackowanie w kreatorze zasłoni dolne warstwy — to problem generatora, nie kadru.",
  };
}

async function main() {
  console.log(`Źródło: ${SOURCE}`);
  await mkdir(OUT_CHARACTER, { recursive: true });
  await mkdir(OUT_ICONS, { recursive: true });

  const report = { written: [], missing: [], warnings: [], bboxes: [], alignment: null };

  if (runs("parts")) {
    for (const [folder, config] of Object.entries(SHEETS)) {
      await processPartFolder(folder, config, report);
    }
    analyzeAlignment(report);
  }
  if (runs("singles")) await processSingles(report);
  if (runs("icons")) await processIcons(report);

  if (runs("parts")) {
    const reportPath = path.join(OUT_CHARACTER, "asset-report.json");
    await writeFile(reportPath, JSON.stringify(report, null, 2));
    console.log(`Raport: ${reportPath}`);
  }
  console.log(`Zapisano ${report.written.length} plików.`);
  if (report.warnings.length) console.log("Ostrzeżenia:\n- " + report.warnings.join("\n- "));
  if (report.missing.length) console.log("Braki:\n- " + report.missing.join("\n- "));
  if (!report.alignment) return;
  if (report.alignment.drifted.length) {
    console.log("Dryf kadru względem ciała:");
    for (const d of report.alignment.drifted) console.log(`- ${d.id}: Δx=${d.dMinX} Δy=${d.dMinY}`);
  } else {
    console.log("Kadr względem ciała: OK (bez istotnego przesunięcia).");
  }
  console.log(report.alignment.note);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
