import CourseOverview from "@/components/CourseOverview";

export const metadata = {
  title: "Közbeszerzési szakmai tananyag (videókkal bővítve)",
  description:
    "A teljes közbeszerzési tananyag képernyős videó-végigvezetésekkel az EKR legfontosabb műveleteihez — a videós leckékben a szöveges tartalom is elérhető.",
};

export default function Page() {
  return <CourseOverview variant="videos" />;
}
