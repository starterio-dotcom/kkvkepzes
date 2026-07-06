import CourseOverview from "@/components/CourseOverview";

export const metadata = {
  title: "Közbeszerzési szakmai tananyag",
  description:
    "Tanuld meg a közbeszerzést a gyakorlatban: olvasmányos leckék, képernyőképek, esettanulmányok és modulzáró kvízek — ingyen, saját tempóban, oklevéllel.",
};

export default function Page() {
  return <CourseOverview variant="hagyomanyos" />;
}
