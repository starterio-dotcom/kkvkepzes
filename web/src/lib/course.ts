import staticData from "@/data/course.json";
import quizzesData from "@/data/quizzes.json";

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

/* ---- Kvíz: a Moodle H5P-kvízekből kinyert valós kérdések ---- */
export type QuizQuestion = {
  q: string;
  options: { key: string; label: string }[];
  correct: string[]; // egy vagy több helyes kulcs
  multi: boolean;
  ok: string;
  no: string;
};
export type Quiz = { passPct: number; questions: QuizQuestion[] };

const quizzes = quizzesData as unknown as { lessons: Record<string, Quiz> };

/** A lecke saját (H5P-ből kinyert) kvíze; null, ha a leckében nincs kvíz. */
export function getQuiz(lesson: FlatLesson): Quiz | null {
  return quizzes.lessons[lesson.num] ?? null;
}
