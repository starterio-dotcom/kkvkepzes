// Az új, 6+ modulos tananyag adatrétege (forrás: scripts/import-tananyag.py
// → web/src/data/tananyag.json + segedletek.json). Szerver-oldali használatra:
// a kliens csak az aktív leckét és a könnyű vázlatot kapja propként.
import tananyagData from "@/data/tananyag.json";
import segedletekData from "@/data/segedletek.json";
import { DEMO_LOREM, loremHtml, loremText } from "@/lib/lorem";

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
  | { t: "note"; kind: "warn" | "info"; html: string }
  | { t: "foot"; html: string }
  | { t: "think"; title: string; items: string[] }
  | { t: "img"; label?: string; srcs: string[] }
  | { t: "imgph"; label?: string }
  | {
      t: "h5p";
      kind: "video" | "kviz" | "interaktiv" | "quiz" | "accordion";
      file: string;
      title?: string;
      youtubeId?: string;                        // feloldott videó (YouTube)
      panels?: { title: string; html: string }[]; // feloldott accordion
      quiz?: LessonQuiz;                          // feloldott kvíz (pl. videó-utáni "plus")
    }
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
  glossary?: { concept: string; definition: string }[]; // fogalomtár-leckénél
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

/* ---- Demó-mód (DEMO_LOREM=1): a tartalom lorem ipsumra cserélve ----
   A szerkezet (modulok, blokkok, hosszak) megmarad; a valódi tartalom a
   forrás-JSON-okban érintetlen — a transzformáció csak betöltéskor fut. */
function loremBlock(b: Block): Block {
  const x = { ...b } as Block & Record<string, unknown>;
  if ("html" in x && typeof x.html === "string") x.html = loremHtml(x.html);
  if ("text" in x && typeof x.text === "string") x.text = loremText(x.text as string);
  if ("label" in x && typeof x.label === "string") x.label = loremText(x.label as string);
  if ("title" in x && typeof x.title === "string") x.title = loremText(x.title as string);
  if ("items" in x && Array.isArray(x.items)) x.items = (x.items as string[]).map(loremHtml);
  if ("rows" in x && Array.isArray(x.rows)) x.rows = (x.rows as string[][]).map((r) => r.map(loremHtml));
  if ("panels" in x && Array.isArray(x.panels))
    x.panels = (x.panels as { title: string; html: string }[]).map((p) => ({ title: loremText(p.title), html: loremHtml(p.html) }));
  if ("quiz" in x && x.quiz) x.quiz = loremQuiz(x.quiz as LessonQuiz);
  if (x.t === "img") {
    // képernyőképek helyett semleges placeholder
    (x as { srcs: string[] }).srcs = ["/demo/placeholder.svg"];
  }
  if (x.t === "h5p" && "youtubeId" in x) {
    // meglévő videók helyett "Hamarosan" keret jelenik meg
    delete (x as Record<string, unknown>).youtubeId;
  }
  return x as Block;
}

function loremQuiz(q: LessonQuiz): LessonQuiz {
  return {
    ...q,
    questions: q.questions.map((question) => ({
      ...question,
      q: loremText(question.q),
      options: question.options.map((o) => ({ ...o, label: loremText(o.label) })),
      ok: loremText(question.ok),
      no: loremText(question.no),
    })),
  };
}

function loremize(data: Raw): Raw {
  return {
    ...data,
    title: loremText(data.title),
    modules: data.modules.map((m) => ({
      ...m,
      title: loremText(m.title),
      intro: loremText(m.intro),
      lessons: m.lessons.map((l) => ({
        ...l,
        title: loremText(l.title),
        objectives: l.objectives.map(loremHtml),
        blocks: l.blocks.map(loremBlock),
        videos: l.videos.map((v) => ({ ...v, title: loremText(v.title), desc: loremText(v.desc) })),
        quiz: l.quiz ? loremQuiz(l.quiz) : undefined,
      })),
    })),
    glossary: data.glossary.map((g) => ({ concept: loremText(g.concept), definition: loremText(g.definition) })),
  };
}

function loremizeSeg(data: RawSeg): RawSeg {
  return {
    items: data.items.map((s) => ({
      ...s,
      title: loremText(s.title),
      blocks: s.blocks.map(loremBlock),
    })),
  };
}

const src = DEMO_LOREM ? loremize(raw) : raw;
const segSrc = DEMO_LOREM ? loremizeSeg(segRaw) : segRaw;

/* ---- segédletek beszúrása a moduljuk végére, egyszeri összeállítás ---- */
function buildModules(): TModule[] {
  const modules = src.modules.map((m) => ({ ...m, lessons: [...m.lessons] }));
  // a fogalomtár-lecke megkapja a szócikkeket
  for (const m of modules)
    for (const l of m.lessons)
      if (l.kind === "fogalomtar") l.glossary = src.glossary;
  for (const s of segSrc.items) {
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

export const courseTitle = src.title;
export const glossary = src.glossary;

/** A tanfolyam megjelenített neve variánsonként. */
export function courseName(variant: Variant): string {
  return variant === "videos" ? `${src.title} (videókkal bővítve)` : src.title;
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
      hasVideo: variant === "videos" && (l.videos.length > 0 || l.blocks.some((b) => b.t === "h5p" && !!b.youtubeId)),
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
