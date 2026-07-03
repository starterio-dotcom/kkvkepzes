#!/usr/bin/env node
// Kvíz-pipeline: a Moodle-leckékbe és szekció-szövegdobozokba ágyazott H5P-kvízeket
// (H5P.QuestionSet) nyeri ki az app kvíz-formátumába.
//
//   node scripts/export-quizzes.mjs
//
// Bemenet:  web/.env.local (MOODLE_URL, MOODLE_WS_TOKEN, MOODLE_COURSE_ID)
//           web/src/data/course-pages.json (a lecke-HTML-ekben lévő H5P-iframe-ek)
// Kimenet:  web/src/data/quizzes.json         — leckénkénti kvízek + modulzárók (szerver-oldali)
//           web/src/data/module-quizzes.json  — csak a 4 modulzáró (kliens-oldali, videós kurzus)
//
// A .h5p fájl egy zip: a content/content.json tartalmazza a kérdéseket. A kibontáshoz
// a Windows beépített bsdtar-ját használjuk (tar -xf).

import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { execSync } from "node:child_process";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const webDir = join(root, "web");

const fileEnv = Object.fromEntries(
  readFileSync(join(webDir, ".env.local"), "utf8").split(/\r?\n/)
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
);
const MOODLE_URL = process.env.MOODLE_URL ?? fileEnv.MOODLE_URL;
const TOKEN = process.env.MOODLE_WS_TOKEN ?? fileEnv.MOODLE_WS_TOKEN;
const COURSE_ID = process.env.MOODLE_COURSE_ID ?? fileEnv.MOODLE_COURSE_ID ?? "2";
if (!MOODLE_URL || !TOKEN) { console.error("Hiányzó MOODLE_URL / MOODLE_WS_TOKEN."); process.exit(1); }

async function ws(fn, params = {}) {
  const qs = new URLSearchParams({ wstoken: TOKEN, wsfunction: fn, moodlewsrestformat: "json", ...params });
  const res = await fetch(`${MOODLE_URL}/webservice/rest/server.php?${qs}`);
  const json = await res.json();
  if (json && json.exception) throw new Error(`Moodle WS ${fn}: ${json.errorcode} – ${json.message}`);
  return json;
}

const ENTITIES = { "&nbsp;": " ", "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'" };
const plain = (html) =>
  (html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;|&#\d+;/gi, (e) => ENTITIES[e] ?? " ")
    .replace(/\s+/g, " ")
    .trim();

// --- 1) H5P-hivatkozások összegyűjtése ---
// leckékből (course-pages.json iframe-jei):
const coursePages = JSON.parse(readFileSync(join(webDir, "src", "data", "course-pages.json"), "utf8"));
const refs = new Map(); // fájlnév -> { url, owners: Set<lecke-num> }
function addRef(file, url, owner) {
  if (!refs.has(file)) refs.set(file, { url, owners: new Set() });
  refs.get(file).owners.add(owner);
}
for (const [num, l] of Object.entries(coursePages.lessons)) {
  for (const m of l.pages.flatMap((p) => [...p.contents.matchAll(/<iframe[^>]+src="([^"]+)"/gi)])) {
    const enc = m[1].match(/url=([^&"]+)/);
    if (!enc) continue;
    const url = decodeURIComponent(enc[1]);
    const file = url.match(/\/([^/]+\.h5p)$/i)?.[1];
    if (file) addRef(file, url, num);
  }
}
// szekció-szövegdobozokból (modulzáró + köztes összefoglaló):
const contents = await ws("core_course_get_contents", { courseid: COURSE_ID });
const romanKey = (name) => name.match(/^([IVXLC]+)\./)?.[1] ?? "";
for (const s of contents) {
  const key = romanKey(s.name);
  for (const m of s.modules ?? []) {
    if (m.modname !== "label" || !m.description) continue;
    for (const x of m.description.matchAll(/https?:\/\/[^"'\s]+\/([^/"'\s]+\.h5p)/gi)) {
      addRef(x[1], x[0], `LABEL:${key || s.name}`);
    }
  }
}

// videókat nem töltjük le (nagyok, nem kvízek) — minden mást igen
const toFetch = [...refs.entries()].filter(([f]) => !/video/i.test(f));
console.log(`H5P-hivatkozás összesen: ${refs.size} egyedi fájl, ebből letöltendő (nem videó): ${toFetch.length}`);

// --- 2) letöltés + kibontás + parse ---
const work = join(tmpdir(), "kkv-h5p-work");
rmSync(work, { recursive: true, force: true });
mkdirSync(work, { recursive: true });

function parseQuestion(q) {
  const lib = (q.library || "").split(" ")[0];
  if (lib === "H5P.MultiChoice") {
    const answers = q.params?.answers ?? [];
    const correctIdx = answers.map((a, i) => (a.correct ? i : -1)).filter((i) => i >= 0);
    if (correctIdx.length === 0) return { skip: "nincs helyes válasz megjelölve" };
    const options = answers.map((a, i) => ({ key: String.fromCharCode(97 + i), label: plain(a.text) }));
    const correct = correctIdx.map((i) => options[i].key);
    const multi = correct.length > 1;
    const fb = answers[correctIdx[0]].tipsAndFeedback?.chosenFeedback;
    const correctLabels = correctIdx.map((i) => options[i].label).join(" · ");
    return {
      q: plain(q.params?.question),
      options,
      correct,
      multi,
      ok: plain(fb) || "Helyes válasz!",
      no: multi ? `A helyes válaszok: ${correctLabels}` : `A helyes válasz: ${correctLabels}`,
    };
  }
  if (lib === "H5P.TrueFalse") {
    const isTrue = String(q.params?.correct) === "true";
    return {
      q: plain(q.params?.question),
      options: [{ key: "a", label: "Igaz" }, { key: "b", label: "Hamis" }],
      correct: [isTrue ? "a" : "b"],
      multi: false,
      ok: "Helyes válasz!",
      no: `A helyes válasz: ${isTrue ? "Igaz" : "Hamis"}`,
    };
  }
  return { skip: `nem támogatott kérdéstípus: ${lib}` };
}

const sets = []; // { file, title, passPct, questions, owners }
let skippedQ = 0, skippedSets = [];
for (const [file, { url, owners }] of toFetch) {
  const dest = join(work, file.replace(/[^a-z0-9.-]/gi, "_"));
  mkdirSync(dest, { recursive: true });
  const dl = `${url.replace("/pluginfile.php/", "/webservice/pluginfile.php/").replace(/\?.*$/, "")}?token=${TOKEN}`;
  const res = await fetch(dl);
  if (!res.ok) { skippedSets.push(`${file}: HTTP ${res.status}`); continue; }
  writeFileSync(join(dest, "pkg.h5p"), Buffer.from(await res.arrayBuffer()));
  try {
    execSync(`tar -xf pkg.h5p h5p.json content/content.json`, { cwd: dest, stdio: "pipe" });
  } catch {
    try { execSync(`tar -xf pkg.h5p`, { cwd: dest, stdio: "pipe" }); }
    catch (e) { skippedSets.push(`${file}: kibontási hiba`); continue; }
  }
  let meta, content;
  try {
    meta = JSON.parse(readFileSync(join(dest, "h5p.json"), "utf8"));
    content = JSON.parse(readFileSync(join(dest, "content", "content.json"), "utf8"));
  } catch { skippedSets.push(`${file}: hiányzó h5p.json/content.json`); continue; }

  let rawQuestions;
  if (meta.mainLibrary === "H5P.QuestionSet") rawQuestions = content.questions ?? [];
  else if (meta.mainLibrary === "H5P.MultiChoice" || meta.mainLibrary === "H5P.TrueFalse")
    rawQuestions = [{ library: meta.mainLibrary, params: content }];
  else { skippedSets.push(`${file}: ${meta.mainLibrary} (nem kvíz)`); continue; }

  const questions = [];
  for (const rq of rawQuestions) {
    const parsed = parseQuestion(rq);
    if (parsed.skip) { skippedQ++; console.log(`  [${file}] kihagyott kérdés: ${parsed.skip}`); }
    else questions.push(parsed);
  }
  if (!questions.length) { skippedSets.push(`${file}: 0 használható kérdés`); continue; }
  sets.push({ file, title: meta.title ?? file, passPct: content.passPercentage ?? 60, questions, owners: [...owners] });
}

// --- 3) kimenetek összeállítása ---
const lessons = {}; // num -> { passPct, questions[] } (több szett esetén összefűzve)
const modules = {}; // I..IV -> { title, passPct, questions[] } a modulzárókból
const extra = {};
for (const s of sets) {
  for (const owner of s.owners) {
    if (owner.startsWith("LABEL:")) {
      const key = owner.slice(6);
      if (/modulzaro/i.test(s.file)) modules[key] = { title: s.title, passPct: s.passPct, questions: s.questions };
      else extra[s.file] = { section: key, title: s.title, passPct: s.passPct, questions: s.questions };
    } else {
      lessons[owner] ??= { passPct: s.passPct, questions: [] };
      lessons[owner].questions.push(...s.questions);
      lessons[owner].passPct = Math.min(lessons[owner].passPct, s.passPct);
    }
  }
}

const generatedAt = new Date().toISOString();
const source = `${new URL(MOODLE_URL).host} (course ${COURSE_ID})`;
writeFileSync(join(webDir, "src", "data", "quizzes.json"),
  JSON.stringify({ generatedAt, source, lessons, modules, extra }, null, 1) + "\n", "utf8");
writeFileSync(join(webDir, "src", "data", "module-quizzes.json"),
  JSON.stringify({ generatedAt, source, modules }, null, 1) + "\n", "utf8");

const qCount = (o) => Object.values(o).reduce((a, v) => a + v.questions.length, 0);
console.log("---");
console.log(`Kvíz-szettek: ${sets.length} | leckéhez kötve: ${Object.keys(lessons).length} lecke, ${qCount(lessons)} kérdés`);
console.log(`Modulzárók: ${Object.keys(modules).sort().join(", ")} — ${qCount(modules)} kérdés | egyéb (extra): ${Object.keys(extra).length}`);
if (skippedQ) console.log(`Kihagyott kérdés: ${skippedQ}`);
if (skippedSets.length) console.log(`Kihagyott fájlok:\n  ${skippedSets.join("\n  ")}`);
console.log("Kimenet: web/src/data/quizzes.json + module-quizzes.json");
