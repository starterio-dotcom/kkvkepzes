import Landing from "@/components/Landing";

export const metadata = {
  title: { absolute: "KKV Képzés – Ingyenes közbeszerzési képzés" },
  description:
    "Tanuld meg a közbeszerzést a gyakorlatban: két ingyenes tanfolyam (hagyományos és videókkal bővített), esettanulmányokkal, kvízekkel és letölthető oklevéllel.",
};

export default function Home() {
  return <Landing />;
}
