import { notFound } from "next/navigation";
import Header from "@/components/Header";
import LessonPlayer from "@/components/LessonPlayer";
import { getCourse, getLessonPages, getOutline } from "@/lib/moodle";
import { flatten, findLesson, siblingsOf, getQuiz } from "@/lib/course";
import { requireAuth } from "@/lib/auth";

export default async function Page({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const user = await requireAuth(`/hagyomanyos/tanulas/${lessonId}`);
  const course = await getCourse();
  const lesson = findLesson(course, lessonId);
  if (!lesson) notFound();

  const [outline, pages] = await Promise.all([getOutline(), getLessonPages(lesson.lessonId, lesson.title)]);
  const { prev, next } = siblingsOf(course, lessonId);
  const flat = flatten(course).map((l) => ({ id: l.id, num: l.num, shortTitle: l.shortTitle, sectionKey: l.sectionKey }));

  return (
    <>
      <Header user={user} />
      <LessonPlayer
        outline={outline}
        lessons={flat}
        lesson={lesson}
        prevId={prev?.id}
        nextId={next?.id}
        pages={pages}
        quiz={getQuiz(lesson)}
        totalLessons={course.totalLessons}
      />
    </>
  );
}
