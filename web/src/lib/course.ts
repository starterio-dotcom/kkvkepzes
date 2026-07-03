import staticData from "@/data/course.json";

export type Lesson = {
  id: string;
  num: string;
  title: string;
  shortTitle: string;
  paragraphs: string[];
  durationMin: number;
  image: string | null;
  sourceUrl: string | null;
  lessonId?: number; // Moodle lesson instance id (élő tartalom lekéréshez)
};
export type Section = { key: string; title: string; lessons: Lesson[] };
export type Course = {
  title: string;
  source: string;
  exportedAt?: string;
  totalLessons: number;
  images: string[];
  sections: Section[];
  dataSource?: "live" | "static";
};
export type FlatLesson = Lesson & { sectionKey: string; sectionTitle: string; index: number };

export const staticCourse = staticData as Course;

/* ---- tiszta segédfüggvények (a course-t paraméterként kapják) ---- */
export function flatten(course: Course): FlatLesson[] {
  const out: FlatLesson[] = [];
  let i = 0;
  for (const s of course.sections)
    for (const l of s.lessons)
      out.push({ ...l, sectionKey: s.key, sectionTitle: s.title, index: i++ });
  return out;
}
export function findLesson(course: Course, id: string): FlatLesson | undefined {
  return flatten(course).find((l) => l.id === id);
}
export function siblingsOf(course: Course, id: string): { prev?: FlatLesson; next?: FlatLesson } {
  const all = flatten(course);
  const i = all.findIndex((l) => l.id === id);
  return { prev: i > 0 ? all[i - 1] : undefined, next: i >= 0 && i < all.length - 1 ? all[i + 1] : undefined };
}
export function firstLessonId(course: Course): string {
  return course.sections[0]?.lessons[0]?.id ?? "";
}
export function totalMinutes(course: Course): number {
  return flatten(course).reduce((a, l) => a + l.durationMin, 0);
}

/** Statikus törzs-szöveg és kép szám-prefix szerint (élő WS-hez merge-höz). */
export const staticByNum = new Map(flatten(staticCourse).map((l) => [l.num, l]));

/* ---- Kvíz: valós kérdések a tervekből ---- */
export type Quiz = {
  question: string;
  options: { key: string; label: string }[];
  correct: string;
  ok: string;
  no: string;
};
const QUIZZES: Quiz[] = [
  {
    question: "Mikortól kötelező főszabály szerint az EKR használata a közbeszerzési eljárásokban?",
    options: [
      { key: "a", label: "2018. április 15-étől" },
      { key: "b", label: "2016. november 1-jétől" },
      { key: "c", label: "2020. január 1-jétől" },
    ],
    correct: "a",
    ok: "Helyes! 2018. április 15-étől kötelező.",
    no: "Nem pontos — a helyes válasz: 2018. április 15.",
  },
  {
    question: "Mi szükséges az EKR-ben ajánlat benyújtásához?",
    options: [
      { key: "a", label: "Regisztráció és belépés" },
      { key: "b", label: "Csak a nyitóoldal megnyitása" },
      { key: "c", label: "Semmilyen azonosítás" },
    ],
    correct: "a",
    ok: "Így van — regisztráció és belépés is szükséges.",
    no: "A helyes válasz: regisztráció és belépés.",
  },
  {
    question: "Mit jelent az érdeklődés jelzése egy eljárásnál?",
    options: [
      { key: "a", label: "Értesítést kérsz a fejleményekről, kötelezettség nélkül" },
      { key: "b", label: "Kötelezően ajánlatot kell benyújtanod" },
      { key: "c", label: "Lemondasz a részvételről" },
    ],
    correct: "a",
    ok: "Pontosan — értesítést kapsz, de nem vállalsz kötelezettséget.",
    no: "A helyes válasz: értesítést kérsz, kötelezettség nélkül.",
  },
];
export function getQuiz(lesson: FlatLesson): Quiz {
  return QUIZZES[lesson.index % QUIZZES.length];
}
