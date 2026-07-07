import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { allVideoPlans, getOutline, totalLessons, totalModules } from "@/lib/tananyag";
import { getSession } from "@/lib/auth";

export const metadata = {
  title: "Kurzusok",
  description:
    "Felvehető ingyenes közbeszerzési képzések: hagyományos és videókkal bővített tanfolyam a teljes tematikával, valamint élő képzések.",
};

export default async function Page() {
  const user = await getSession();
  const outline = getOutline("hagyomanyos");
  const videoCount = allVideoPlans().length;

  return (
    <>
      <Header user={user} />
      <main id="main">

      <section className="pagehead" style={{ ["--cover" as string]: "url(/covers/merleg.webp)" } as React.CSSProperties}>
        <div className="container">
          <div className="eyebrow light">Kurzusok</div>
          <h1 className="h1 white">Felvehető kurzusok</h1>
          <p className="pagehead-lead">
            Ingyenes, nyilvántartott képzések a közbeszerzés gyakorlati elsajátításához —
            saját tempóban vagy élő, vezetett formában.
          </p>
        </div>
      </section>

      <section className="sec">
        <div className="container">
          <div className="course-grid three">
            <div className="ccard">
              <div className="ccard-banner indigo" style={{ ["--cbcover" as string]: "url(/covers/merleg.webp)" } as React.CSSProperties}><span className="ccard-tag">Szakmai tananyag</span><i className="ri-book-open-line" /></div>
              <div className="ccard-body">
                <h3 className="h4">Közbeszerzési szakmai tananyag</h3>
                <p className="body">A teljes, folyamatalapú tananyag olvasmányos leckékkel, képernyőképekkel, esettanulmány-fonállal és modulzáró kvízekkel.</p>
                <div className="ccard-meta">
                  <span><i className="ri-stack-line" /> {totalModules} modul</span>
                  <span><i className="ri-list-check-2" /> {totalLessons} lecke</span>
                  <span><i className="ri-award-line" /> Oklevél</span>
                </div>
                <Link href="/hagyomanyos" className="btn btn-primary btn-block">Részletek <i className="ri-arrow-right-line" /></Link>
              </div>
            </div>
            <div className="ccard">
              <div className="ccard-banner teal" style={{ ["--cbcover" as string]: "url(/covers/merleg.webp)" } as React.CSSProperties}><span className="ccard-tag">Videókkal bővítve</span><i className="ri-play-circle-line" /></div>
              <div className="ccard-body">
                <h3 className="h4">Közbeszerzési szakmai tananyag (videókkal bővítve)</h3>
                <p className="body">Ugyanaz a teljes tananyag, kiegészítve képernyős videókkal a legfontosabb EKR-műveletekhez — a szöveges tartalom is elérhető.</p>
                <div className="ccard-meta">
                  <span><i className="ri-film-line" /> {videoCount} videó</span>
                  <span><i className="ri-list-check-2" /> {totalLessons} lecke</span>
                  <span><i className="ri-award-line" /> Oklevél</span>
                </div>
                <Link href="/videos" className="btn btn-primary btn-block">Részletek <i className="ri-arrow-right-line" /></Link>
              </div>
            </div>
            <div className="ccard">
              <div className="ccard-banner green" style={{ ["--cbcover" as string]: "url(/covers/podium.webp)" } as React.CSSProperties}><span className="ccard-tag">Élő képzés</span><i className="ri-team-line" /></div>
              <div className="ccard-body">
                <h3 className="h4">Ingyenes Közbeszerzési Képzések</h3>
                <p className="body">Online és személyes formában megrendezett, jelentkezéshez kötött ingyenes képzések gyakorló szakemberek vezetésével.</p>
                <div className="ccard-meta">
                  <span><i className="ri-calendar-event-line" /> 2 alkalom</span>
                  <span><i className="ri-global-line" /> Online + személyes</span>
                  <span><i className="ri-checkbox-circle-line" /> Igazolás</span>
                </div>
                <Link href="/elerhetosegek" className="btn btn-outline btn-block">Jelentkezés <i className="ri-arrow-right-line" /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec sec-alt">
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: "var(--space-300)" }}>Tematika</div>
          <h2 className="h2" style={{ marginBottom: "var(--space-200)" }}>Közbeszerzési szakmai tananyag</h2>
          <p className="body" style={{ marginBottom: "var(--space-1200)" }}>
            {totalModules} modul · {totalLessons} lecke · folyamatalapú felépítés — a teljes anyag ingyenes.
          </p>
          <div className="curric">
            {outline.map((m) => (
              <div className="curric-sec" key={m.key}>
                <div className="curric-head">
                  <span className="curric-num">{m.badge}</span>
                  <div>
                    <h3 className="h5">{m.title}</h3>
                    <p className="meta">{m.lessons.length} lecke</p>
                  </div>
                  <Link href={`/hagyomanyos/tanulas/${m.lessons[0].id}`} className="btn btn-outline btn-sm">Megnyitom</Link>
                </div>
                <ul className="curric-list">
                  {m.lessons.slice(0, 5).map((l) => (
                    <li key={l.id}>
                      <i className="ri-file-text-line" />
                      <Link href={`/hagyomanyos/tanulas/${l.id}`}>{l.title}</Link>
                      <span className="meta">{l.durationMin} perc</span>
                    </li>
                  ))}
                  {m.lessons.length > 5 && (
                    <li className="more"><i className="ri-more-line" /> +{m.lessons.length - 5} további lecke</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}
