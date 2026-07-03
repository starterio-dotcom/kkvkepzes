#!/usr/bin/env node
// Tartalom-pipeline: a helyi Moodle WS-ből statikus fallback-adatot generál a webhez.
//
//   node scripts/export-course.mjs
//
// Bemenet:  web/.env.local (MOODLE_URL, MOODLE_WS_TOKEN, MOODLE_COURSE_ID)
// Kimenet:  web/src/data/course-pages.json   — mind a 49 lecke összes oldala (cím + HTML,
//                                              képek lokalizálva a /course/pages/ alá)
//           web/src/data/course.json         — kurzus-szerkezet (szekciók, leckék, metaadatok)
//           web/public/course/pages/*        — a lecke-HTML-ekben hivatkozott képek
//
// A HTML-t nyersen tároljuk: a sanitizálást/fejléc-kiemelést kérés-időben ugyanaz a kód
// (web/src/lib/moodle.ts) végzi, mint az élő Moodle-adatnál — így nincs logika-kettőzés.
// Egyetlen export-időbeli átalakítás: a pluginfile kép-URL-ek helyi fájlra cserélése,
// hogy a fallback a Moodle nélkül (offline) is teljes legyen.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const webDir = join(root, "web");
const imgDir = join(webDir, "public", "course", "pages");

// --- env a web/.env.local-ból (process.env felülírhatja) ---
const envFile = join(webDir, ".env.local");
const fileEnv = existsSync(envFile)
  ? Object.fromEntries(
      readFileSync(envFile, "utf8")
        .split(/\r?\n/)
        .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
        .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
    )
  : {};
const MOODLE_URL = process.env.MOODLE_URL ?? fileEnv.MOODLE_URL;
const TOKEN = process.env.MOODLE_WS_TOKEN ?? fileEnv.MOODLE_WS_TOKEN;
const COURSE_ID = process.env.MOODLE_COURSE_ID ?? fileEnv.MOODLE_COURSE_ID ?? "2";
if (!MOODLE_URL || !TOKEN) {
  console.error("Hiányzó MOODLE_URL / MOODLE_WS_TOKEN (web/.env.local).");
  process.exit(1);
}

async function ws(fn, params = {}) {
  const qs = new URLSearchParams({ wstoken: TOKEN, wsfunction: fn, moodlewsrestformat: "json", ...params });
  const res = await fetch(`${MOODLE_URL}/webservice/rest/server.php?${qs}`);
  const json = await res.json();
  if (json && json.exception) throw new Error(`Moodle WS ${fn}: ${json.errorcode} – ${json.message}`);
  return json;
}

const lessonNum = (name) => name.match(/^([IVXLC]+\.\d+)/)?.[1] ?? "";
const stripNum = (name) => name.replace(/^[IVXLC]+\.\d+\.\s*/, "").trim();
const romanKey = (name) => name.match(/^([IVXLC]+)\./)?.[1] ?? "";
const plainText = (html) =>
  html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();

// Ékezet- és szóközmentes, ütközésbiztos helyi fájlnév a pluginfile-okhoz.
function localName(pageId, rawFile) {
  const decoded = decodeURIComponent(rawFile).replace(/\?.*$/, "");
  const ascii = decoded.normalize("NFD").replace(/[̀-ͯ]/g, "");
  const safe = ascii.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "");
  return `p${pageId}-${safe || "file"}`;
}

// --- kurzus-szerkezet ---
const contents = await ws("core_course_get_contents", { courseid: COURSE_ID });
const host = new URL(MOODLE_URL).host;
console.log(`Forrás: ${host}, kurzus #${COURSE_ID} — ${contents.length} szekció`);

// A meglévő course.json-ból megtartjuk a kézzel gondozott mezőket (kép, cím, borítók).
const oldCoursePath = join(webDir, "src", "data", "course.json");
const oldCourse = existsSync(oldCoursePath) ? JSON.parse(readFileSync(oldCoursePath, "utf8")) : {};
const oldByNum = new Map();
for (const s of oldCourse.sections ?? [])
  for (const l of s.lessons ?? []) if (l.num) oldByNum.set(l.num, l);

mkdirSync(imgDir, { recursive: true });
const pluginfileRe = new RegExp(
  MOODLE_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
    "/(?:webservice/)?pluginfile\\.php/(\\d+)/mod_lesson/page_contents/(\\d+)/([^\"'\\s>]+)",
  "gi"
);

let imgOk = 0, imgFail = 0, totalPages = 0, totalChars = 0;
const downloaded = new Map(); // eredeti URL -> helyi útvonal

async function localizeImages(html) {
  const jobs = [];
  html = html.replace(pluginfileRe, (full, ctx, pageId, file) => {
    if (downloaded.has(full)) return downloaded.get(full);
    const name = localName(pageId, file);
    const local = `/course/pages/${name}`;
    downloaded.set(full, local);
    jobs.push({ full, ctx, pageId, file, name });
    return local;
  });
  for (const j of jobs) {
    try {
      const url = `${MOODLE_URL}/webservice/pluginfile.php/${j.ctx}/mod_lesson/page_contents/${j.pageId}/${j.file.replace(/\?.*$/, "")}?token=${TOKEN}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 100 || buf.slice(0, 20).toString().includes("exception"))
        throw new Error("hibaválasz érkezett fájl helyett");
      writeFileSync(join(imgDir, j.name), buf);
      imgOk++;
    } catch (e) {
      imgFail++;
      console.error(`  KÉP HIBA (${j.name}): ${e.message}`);
    }
  }
  return html;
}

// --- leckék végigjárása ---
const pagesOut = { generatedAt: new Date().toISOString(), source: `${host} (course ${COURSE_ID})`, lessons: {} };
const sections = [];
for (const s of contents) {
  const lessons = [];
  for (const m of s.modules ?? []) {
    if (m.modname !== "lesson") continue;
    const num = lessonNum(m.name) || m.name;
    const data = await ws("mod_lesson_get_pages", { lessonid: String(m.instance) });
    const pages = [];
    let chars = 0;
    for (const p of data.pages || []) {
      const contentsHtml = await localizeImages(p.page?.contents || "");
      const title = (p.page?.title || "").trim();
      if (!contentsHtml && !title) continue;
      chars += plainText(contentsHtml).length;
      pages.push({ title, contents: contentsHtml });
    }
    totalPages += pages.length;
    totalChars += chars;
    pagesOut.lessons[num] = { cmid: m.id, instance: m.instance, title: m.name, pages };

    const paras = [];
    for (const p of pages) {
      for (const m2 of p.contents.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)) {
        const t = plainText(m2[1]);
        if (t.length > 60) paras.push(t);
        if (paras.length >= 2) break;
      }
      if (paras.length >= 2) break;
    }
    const old = oldByNum.get(num);
    lessons.push({
      id: `cm${m.id}`,
      num,
      title: m.name,
      shortTitle: stripNum(m.name) || m.name,
      paragraphs: paras,
      durationMin: Math.min(30, Math.max(3, Math.round(chars / 1100))),
      image: old?.image ?? null,
      sourceUrl: m.url ?? null,
      lessonId: m.instance,
    });
    console.log(`  ${num}: ${pages.length} oldal, ${chars} karakter`);
  }
  if (lessons.length) sections.push({ key: romanKey(s.name), title: s.name, lessons });
}

const courseOut = {
  title: oldCourse.title ?? "Közbeszerzési szakmai tananyag",
  source: `${host} (course ${COURSE_ID})`,
  exportedAt: pagesOut.generatedAt,
  totalLessons: sections.reduce((a, s) => a + s.lessons.length, 0),
  images: oldCourse.images ?? [],
  sections,
};

writeFileSync(join(webDir, "src", "data", "course-pages.json"), JSON.stringify(pagesOut, null, 1) + "\n", "utf8");
writeFileSync(oldCoursePath, JSON.stringify(courseOut, null, 2) + "\n", "utf8");

console.log("---");
console.log(`Kész: ${courseOut.totalLessons} lecke, ${totalPages} oldal, ${totalChars} szöveg-karakter`);
console.log(`Képek: ${imgOk} letöltve${imgFail ? `, ${imgFail} HIBA` : ""} → web/public/course/pages/`);
console.log("Kimenet: web/src/data/course-pages.json + web/src/data/course.json");
if (imgFail) process.exit(2);
