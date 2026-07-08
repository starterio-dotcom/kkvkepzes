import CourseOverview from "@/components/CourseOverview";
import { demoText as dt } from "@/lib/lorem";

export const metadata = {
  title: dt("Közbeszerzési szakmai tananyag (videókkal bővítve)"),
  description: dt("A teljes közbeszerzési tananyag képernyős videó-végigvezetésekkel az EKR legfontosabb műveleteihez — a videós leckékben a szöveges tartalom is elérhető."),
};

export default function Page() {
  return <CourseOverview variant="videos" />;
}
