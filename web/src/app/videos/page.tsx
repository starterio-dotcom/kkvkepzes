import CourseOverview from "@/components/CourseOverview";

export const metadata = {
  title: "Videókkal bővített tanfolyam",
  description:
    "A teljes közbeszerzési tananyag képernyős videó-végigvezetésekkel az EKR legfontosabb műveleteihez — a videós leckékben a szöveges tartalom is elérhető.",
};

export default function Page() {
  return <CourseOverview variant="videos" />;
}
