import Landing from "@/components/Landing";

export const metadata = {
  title: { absolute: "KKV Képzés – Ingyenes közbeszerzési képzés" },
  description:
    "Tanuld meg a közbeszerzést a gyakorlatban: olvasmányos leckék, képernyőképek és lépésenkénti útmutatók az EKR-hez — ingyen, saját tempóban, letölthető oklevéllel.",
};

export default function Page() {
  return <Landing variant="hagyomanyos" />;
}
