import { notFound } from "next/navigation";
import Header from "@/components/Header";
import CoursePlayer from "@/components/CoursePlayer";
import { courseTitle, findLesson, getOutline, siblings, totalLessons } from "@/lib/tananyag";
import { requireAuth } from "@/lib/auth";

export default async function Page({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const user = await requireAuth(`/hagyomanyos/tanulas/${lessonId}`);
  const lesson = findLesson(lessonId);
  if (!lesson) notFound();

  const { prev, next } = siblings(lessonId);

  return (
    <>
      <Header user={user} />
      <CoursePlayer
        variant="hagyomanyos"
        outline={getOutline("hagyomanyos")}
        lesson={lesson}
        prev={prev ? { id: prev.id, title: prev.title } : null}
        next={next ? { id: next.id, title: next.title } : null}
        courseTitle={courseTitle}
        courseLabel="Hagyományos tanfolyam"
        totalLessons={totalLessons}
      />
    </>
  );
}
