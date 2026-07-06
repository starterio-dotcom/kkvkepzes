// Az új, 6+ modulos tananyag adatrétege (forrás: scripts/import-tananyag.py
// → web/src/data/tananyag.json + segedletek.json). Szerver-oldali használatra:
// a kliens csak az aktív leckét és a könnyű vázlatot kapja propként.
import tananyagData from "@/data/tananyag.json";
import segedletekData from "@/data/segedletek.json";

/* ---- kvíz (formátum azonos a korábbi H5P-exporttal) ---- */
export type QuizQ = {
  q: string;
  options: { key: string; label: string }[];
  correct: string[];
  multi: boolean;
  ok: string;
  no: string;
};
export type LessonQuiz = { passPct: number; sampleSize?: number; questions: QuizQ[] };

/* ---- tartalomblokkok ---- */
export type Block =
  | { t: "p"; html: string }
  | { t: "h"; level: number; text: string }
  | { t: "list"; ordered: boolean; items: string[] }
  | { t: "transition"; html: string }
  | { t: "think"; title: string; items: string[] }
  | { t: "img"; label?: string; srcs: string[] }
  | { t: "imgph"; label?: string }
  | { t: "h5p"; kind: "video" | "kviz" | "interaktiv"; file: string }
  | { t: "video"; i: number }
  | { t: "table"; rows: string[][] }
  | { t: "callout"; html: string };

export type VideoPlan = {
  title: string;
  priority: number | null;
  optional: boolean;
  refresh: boolean;
  genre: string;
  length: string;
  desc: string;
};

export type LessonKind = "lecke" | "esettanulmany" | "modulzaro" | "segedlet" | "fogalomtar";

export type TLesson = {
  id: string;
  num: string | null;
  title: string;
  kind: LessonKind;
  objectives: string[];
  sourceRefs: string[];
  blocks: Block[];
  videos: VideoPlan[];
  quiz?: LessonQuiz;
  download?: string; // segédletnél: letölthető docx
};
export type TModule = {
  key: string;
  num: string | null;
  title: string;
  intro: string;
  lessons: TLesson[];
};

export type Variant = "hagyomanyos" | "videos";

type Raw = { generatedAt: string; source: string; title: string; modules: TModule[]; glossary: { concept: string; definition: string }[] };
type RawSeg = { items: { id: string; module: string; title: string; download: string; blocks: Block[] }[] };

const raw = tananyagData as unknown as Raw;
const segRaw = segedletekData as unknown as RawSeg;

/* ---- segédletek beszúrása a moduljuk végére, egyszeri összeállítás ---- */
function buildModules(): TModule[] {
  const modules = raw.modules.map((m) => ({ ...m, lessons: [...m.lessons] }));
  for (const s of segRaw.items) {
    const mod = modules.find((m) => m.key === s.module);
    if (!mod) continue;
    mod.lessons.push({
      id: `sg-${s.id}`,
      num: null,
      title: s.title,
      kind: "segedlet",
      objectives: [],
      sourceRefs: [],
      blocks: s.blocks,
      videos: [],
      download: s.download,
    });
  }
  return modules;
}
const MODULES = buildModules();

export const courseTitle = raw.title;
export const glossary = raw.glossary;

/** A tanfolyam megjelenített neve variánsonként. */
export function courseName(variant: Variant): string {
  return variant === "videos" ? `${raw.title} (videókkal bővítve)` : raw.title;
}

/* ---- vázlat (könnyű, kliensnek adható) ---- */
export type OutlineLesson = {
  id: string;
  title: string;
  kind: LessonKind;
  hasVideo: boolean;
  videoLabel?: string; // pl. "3–4 perc"
  durationMin: number;
  quizCount?: number; // modulzárónál: egy nekifutás kérdésszáma
};
export type OutlineModule = {
  key: string;
  badge: string; // oldalsáv-jelvény
  title: string;
  intro: string;
  lessons: OutlineLesson[];
};

const strip = (html: string) => html.replace(/<[^>]+>/g, "");

function lessonChars(l: TLesson): number {
  let n = 0;
  for (const b of l.blocks) {
    if (b.t === "p" || b.t === "transition" || b.t === "callout") n += strip(b.html).length;
    else if (b.t === "list") n += b.items.reduce((a, x) => a + strip(x).length, 0);
    else if (b.t === "think") n += b.items.reduce((a, x) => a + strip(x).length, 0);
    else if (b.t === "table") n += b.rows.flat().reduce((a, x) => a + strip(x).length, 0);
    else if (b.t === "img") n += 400; // képnézegetés ideje
  }
  return n;
}

function videoMinutes(l: TLesson): number {
  let m = 0;
  for (const v of l.videos) {
    const match = v.length.match(/(\d+)\s*perc/) || v.length.match(/–(\d+)/);
    m += match ? parseInt(match[1], 10) : 3;
  }
  return m;
}

export function durationMin(l: TLesson, variant: Variant): number {
  if (l.kind === "modulzaro") return Math.max(3, Math.min(15, (l.quiz?.sampleSize ?? 8)));
  const base = Math.max(2, Math.round(lessonChars(l) / 900));
  return variant === "videos" ? base + videoMinutes(l) : base;
}

const BADGE: Record<string, string> = { alt: "Á", atfogo: "✦", fogalomtar: "F" };

export function getOutline(variant: Variant): OutlineModule[] {
  return MODULES.map((m) => ({
    key: m.key,
    badge: m.num ?? BADGE[m.key] ?? "•",
    title: m.title,
    intro: m.intro,
    lessons: m.lessons.map((l) => ({
      id: l.id,
      title: l.title,
      kind: l.kind,
      hasVideo: variant === "videos" && l.videos.length > 0,
      videoLabel: variant === "videos" && l.videos.length ? l.videos[0].length : undefined,
      durationMin: durationMin(l, variant),
      quizCount: l.kind === "modulzaro" ? l.quiz?.sampleSize ?? l.quiz?.questions.length : undefined,
    })),
  }));
}

/* ---- keresés / lapozás ---- */
export type FlatLesson = TLesson & { moduleKey: string; moduleTitle: string; index: number };

function flat(): FlatLesson[] {
  const out: FlatLesson[] = [];
  let i = 0;
  for (const m of MODULES)
    for (const l of m.lessons) out.push({ ...l, moduleKey: m.key, moduleTitle: m.title, index: i++ });
  return out;
}
const FLAT = flat();

export function findLesson(id: string): FlatLesson | undefined {
  return FLAT.find((l) => l.id === id);
}
export function siblings(id: string): { prev?: FlatLesson; next?: FlatLesson } {
  const i = FLAT.findIndex((l) => l.id === id);
  return { prev: i > 0 ? FLAT[i - 1] : undefined, next: i >= 0 && i < FLAT.length - 1 ? FLAT[i + 1] : undefined };
}
export const firstLessonId = FLAT[0].id;
export const totalLessons = FLAT.length;
export const totalModules = MODULES.filter((m) => m.num !== null).length; // számozott modulok

/** A kurzus összes videóterve (a videós kurzus adatlapjához). */
export function allVideoPlans(): (VideoPlan & { lessonId: string; lessonTitle: string })[] {
  const out: (VideoPlan & { lessonId: string; lessonTitle: string })[] = [];
  for (const l of FLAT)
    for (const v of l.videos) out.push({ ...v, lessonId: l.id, lessonTitle: l.title });
  return out.sort((a, b) => (a.priority ?? 9) - (b.priority ?? 9));
}

export function totalMinutes(variant: Variant): number {
  return FLAT.reduce((a, l) => a + durationMin(l, variant), 0);
}
