import Landing from "@/components/Landing";
import { demoText as dt } from "@/lib/lorem";

export const metadata = {
  title: { absolute: dt("KKV Képzés – Ingyenes közbeszerzési képzés") },
  description: dt("Tanuld meg a közbeszerzést a gyakorlatban: két ingyenes tanfolyam (hagyományos és videókkal bővített), esettanulmányokkal, kvízekkel és letölthető oklevéllel."),
};

export default function Home() {
  return <Landing />;
}
