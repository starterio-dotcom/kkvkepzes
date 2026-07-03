import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSession } from "@/lib/auth";

export const metadata = {
  title: "Hírek",
  description: "Program hírek és tájékoztatók: események, új ingyenes közbeszerzési képzések és lépésről lépésre útmutatók.",
};

const FEATURED = {
  tag: "Esemény",
  date: "2026. 04. 30.",
  title: "Sikeresen lezajlott a projekt zárórendezvénye",
  text: "2026. április 30-án lezajlott a projekt zárórendezvénye. Köszönjük mindenkinek a részvételt és a közreműködést! A rendezvényről készült összefoglaló elérhető a program felületén.",
  cta: "Összefoglaló megtekintése",
  icon: "ri-calendar-event-line",
};

const NEWS = [
  { tag: "Képzés", date: "2026. 03. 12.", cls: "green", title: "Új ingyenes közbeszerzési képzések indulnak tavasszal", text: "Bővül a kínálat: online és személyes alkalmakra is lehet jelentkezni a felületen." },
  { tag: "Útmutató", date: "2026. 02. 20.", cls: "teal", title: "Így regisztrálj első alkalommal az EKR-ben", text: "Lépésről lépésre bemutatjuk az Elektronikus Közbeszerzési Rendszer regisztrációját." },
  { tag: "GYIK", date: "2026. 01. 15.", cls: "orange", title: "A leggyakoribb kérdések az ajánlattételről", text: "Összegyűjtöttük a KKV-kat leginkább foglalkoztató kérdéseket és a rájuk adott válaszokat." },
];

export default async function Page() {
  const user = await getSession();
  return (
    <>
      <Header user={user} />
      <main id="main">

      <section className="pagehead" style={{ ["--cover" as string]: "url(/covers/novekedes.webp)" } as React.CSSProperties}>
        <div className="container">
          <div className="eyebrow light">Hírek</div>
          <h1 className="h1 white">Program hírek és tájékoztatók</h1>
        </div>
      </section>

      <section className="sec">
        <div className="container">
          <article className="news-featured">
            <div className="news-featured-media">
              <span className="news-tag light">{FEATURED.tag}</span>
              <i className={FEATURED.icon} />
            </div>
            <div className="news-featured-body">
              <span className="meta">{FEATURED.date}</span>
              <h2 className="h3">{FEATURED.title}</h2>
              <p className="body">{FEATURED.text}</p>
              <Link href="/hamarosan" className="btn btn-primary">{FEATURED.cta} <i className="ri-arrow-right-line" /></Link>
            </div>
          </article>

          <div className="news-grid" style={{ marginTop: "var(--space-600)" }}>
            {NEWS.map((n) => (
              <article className={`news-card ${n.cls}`} key={n.title}>
                <div className="news-meta"><span className="news-tag">{n.tag}</span><span className="meta">{n.date}</span></div>
                <h3 className="h5">{n.title}</h3>
                <p className="meta">{n.text}</p>
                <Link href="/hamarosan" className="news-link">Tovább olvasom <i className="ri-arrow-right-line" /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </>
  );
}
