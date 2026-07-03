// SZERVER-OLDALI Moodle Web Services kliens. Soha ne importáld kliens-komponensből
// (a token env-változó csak a szerveren érhető el).
import { staticCourse, staticByNum, type Course, type Section, type Lesson } from "./course";

const MOODLE_URL = process.env.MOODLE_URL;
const TOKEN = process.env.MOODLE_WS_TOKEN;
const COURSE_ID = process.env.MOODLE_COURSE_ID ?? "2";

type WSModule = { id: number; instance?: number; name: string; modname: string; url?: string };
type WSSection = { section: number; name: string; modules: WSModule[] };

async function ws<T>(wsfunction: string, params: Record<string, string> = {}): Promise<T> {
  const qs = new URLSearchParams({
    wstoken: TOKEN!,
    wsfunction,
    moodlewsrestformat: "json",
    ...params,
  });
  const res = await fetch(`${MOODLE_URL}/webservice/rest/server.php?${qs}`, {
    next: { revalidate: 60 },
  });
  const json = await res.json();
  if (json && json.exception) {
    throw new Error(`Moodle WS ${wsfunction}: ${json.errorcode} – ${json.message}`);
  }
  return json as T;
}

const romanKey = (name: string) => name.match(/^([IVXLC]+)\./)?.[1] ?? "";
const lessonNum = (name: string) => name.match(/^([IVXLC]+\.\d+)/)?.[1] ?? "";
const stripNum = (name: string) => name.replace(/^[IVXLC]+\.\d+\.\s*/, "").trim();

/** Élő kurzus a Moodle-ból; hiba/hiányzó token esetén statikus fallback. */
export async function getCourse(): Promise<Course> {
  if (!MOODLE_URL || !TOKEN) {
    return { ...staticCourse, dataSource: "static" };
  }
  try {
    const contents = await ws<WSSection[]>("core_course_get_contents", { courseid: COURSE_ID });
    const sections: Section[] = contents
      .map((s): Section => {
        const key = romanKey(s.name);
        const lessons: Lesson[] = (s.modules ?? [])
          .filter((m) => m.modname === "lesson")
          .map((m): Lesson => {
            const num = lessonNum(m.name) || m.name;
            const cached = staticByNum.get(num);
            return {
              id: `cm${m.id}`,
              num,
              title: m.name,
              shortTitle: stripNum(m.name) || m.name,
              paragraphs: cached?.paragraphs ?? [],
              durationMin: cached?.durationMin ?? Math.max(3, Math.round(m.name.length / 8)),
              image: cached?.image ?? null,
              sourceUrl: m.url ?? null,
              lessonId: m.instance,
            };
          });
        return { key, title: s.name, lessons };
      })
      .filter((s) => s.lessons.length > 0);

    if (sections.length === 0) return { ...staticCourse, dataSource: "static" };

    const totalLessons = sections.reduce((a, s) => a + s.lessons.length, 0);
    return {
      title: staticCourse.title,
      source: `${MOODLE_URL} (course ${COURSE_ID})`,
      totalLessons,
      images: staticCourse.images,
      sections,
      dataSource: "live",
    };
  } catch (err) {
    console.error("[moodle] WS hiba, statikus fallback:", (err as Error).message);
    return { ...staticCourse, dataSource: "static" };
  }
}

/* ---- Teljes kurzus-vázlat a fiókhoz (minden szekció + modul) ---- */
export type OutlineItem = { id: string; name: string; modname: string; isLesson: boolean; href: string | null };
export type OutlineSection = { name: string; items: OutlineItem[] };

export async function getOutline(): Promise<OutlineSection[]> {
  if (!MOODLE_URL || !TOKEN) return [];
  try {
    const contents = await ws<WSSection[]>("core_course_get_contents", { courseid: COURSE_ID });
    return contents
      .map((s) => ({
        name: s.name,
        items: (s.modules ?? [])
          .filter((m) => !["label"].includes(m.modname))
          .map((m) => ({
            id: `cm${m.id}`,
            name: m.name,
            modname: m.modname,
            isLesson: m.modname === "lesson",
            href: m.modname === "lesson" ? `/hagyomanyos/tanulas/cm${m.id}` : null,
          })),
      }))
      .filter((s) => s.items.length > 0);
  } catch {
    return [];
  }
}

/* ---- Lecke-oldalak élő HTML tartalma (sanitizálva, kép-proxyval) ---- */
type WSLessonPage = { page?: { title?: string; contents?: string; type?: number } };

function sanitizeMoodleHtml(html: string): string {
  let h = html;
  h = h.replace(/<script[\s\S]*?<\/script>/gi, "");
  h = h.replace(/<iframe[\s\S]*?<\/iframe>/gi, '<p class="embed-note"><em>[Beágyazott videó — a kurzus lejátszójában]</em></p>');
  h = h.replace(/\son\w+="[^"]*"/gi, "").replace(/\son\w+='[^']*'/gi, "");
  h = h.replace(/\s(style|class|lang|dir|role|align|valign|width|height|border|cellpadding|cellspacing|bgcolor)="[^"]*"/gi, "");
  h = h.replace(/\sdata-[\w-]+="[^"]*"/gi, "");
  h = h.replace(/<\/?span[^>]*>/gi, "").replace(/<\/?o:p[^>]*>/gi, "");
  const host = (MOODLE_URL || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (host) {
    h = h.replace(new RegExp(host + "/(?:webservice/)?pluginfile\\.php/([^\"'\\s>]+)", "gi"), "/api/mfile?p=$1");
  }
  h = h.replace(/@@PLUGINFILE@@\/([^"'\s>]+)/gi, "/api/mfile?p=$1");
  h = h.replace(/<p>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, "");
  return h.trim();
}

export type LessonPage = { title: string; html: string };

// Cím normalizálása összevetéshez (római sorszám-prefix + whitespace levágása).
const normTitle = (s: string) =>
  s.replace(/^[IVXLC]+\.\d+\.\s*/i, "").replace(/\s+/g, " ").trim().toLowerCase();

/**
 * Egy lecke oldalai: minden oldalhoz a törzs első címsorát emeljük ki fejlécnek
 * (a Moodle oldal-„címe" itt csak sorszám, pl. „10/1", ezért haszontalan).
 * A lecke címét visszhangzó vezető címsorokat átugorjuk, hogy ne ismétlődjön.
 */
export async function getLessonPages(lessonId?: number, lessonTitle = ""): Promise<LessonPage[] | null> {
  if (!lessonId || !MOODLE_URL || !TOKEN) return null;
  const echo = normTitle(lessonTitle);
  try {
    const data = await ws<{ pages: WSLessonPage[] }>("mod_lesson_get_pages", { lessonid: String(lessonId) });
    const pages = (data.pages || [])
      .map((p) => {
        let html = sanitizeMoodleHtml(p.page?.contents || "");
        let title = "";
        // Vezető címsorok leszedése: a lecke-címet visszhangzót eldobjuk, az első
        // érdemi címsor lesz az oldal fejléce (a többit meghagyjuk a törzsben).
        for (;;) {
          const m = html.match(/^\s*<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i);
          if (!m) break;
          const t = m[1].replace(/<[^>]+>/g, "").trim();
          html = html.slice(m.index! + m[0].length).trim();
          if (echo && normTitle(t) === echo) continue; // csak visszhang – ugord át
          title = t;
          break;
        }
        return { title, html };
      })
      .filter((p) => p.html || p.title);
    return pages.length ? pages : null;
  } catch (err) {
    console.error("[moodle] lecke-tartalom hiba:", (err as Error).message);
    return null;
  }
}
