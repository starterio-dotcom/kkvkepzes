import { notFound } from "next/navigation";
import Header from "@/components/Header";
import VideoCourse from "@/components/VideoCourse";
import { findV } from "@/data/videocourse";
import { requireAuth } from "@/lib/auth";

export default async function Page({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const user = await requireAuth(`/videos/tanulas/${lessonId}`);
  if (!findV(lessonId)) notFound();

  return (
    <>
      <Header user={user} />
      <VideoCourse activeId={lessonId} />
    </>
  );
}
