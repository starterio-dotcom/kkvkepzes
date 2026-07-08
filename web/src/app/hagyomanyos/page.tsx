import CourseOverview from "@/components/CourseOverview";
import { demoText as dt } from "@/lib/lorem";

export const metadata = {
  title: dt("Közbeszerzési szakmai tananyag"),
  description: dt("Tanuld meg a közbeszerzést a gyakorlatban: olvasmányos leckék, képernyőképek, esettanulmányok és modulzáró kvízek — ingyen, saját tempóban, oklevéllel."),
};

export default function Page() {
  return <CourseOverview variant="hagyomanyos" />;
}
