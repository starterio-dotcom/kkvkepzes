import Landing from "@/components/Landing";

export const metadata = {
  title: "Videós kurzus",
  description:
    "Nézd végig a közbeszerzést lépésről lépésre: rövid videós leckék az EKR valós felületén, magyar felirattal és beágyazott ellenőrző kérdésekkel.",
};

export default function Page() {
  return <Landing variant="videos" />;
}
