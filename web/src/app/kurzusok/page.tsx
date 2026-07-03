import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCourse } from "@/lib/moodle";
import { firstLessonId } from "@/lib/course";
import { getSession } from "@/lib/auth";

export const metadata = {
  title: "Kurzusok",
  description: "Felvehető ingyenes közbeszerzési képzések: moduláris szakmai tananyag és élő, vezetett képzések — a teljes tematikával.",
};

export default async function Page() {
  const course = await getCourse();
  const user = await getSession();
  const startHref = user
    ? `/hagyomanyos/tanulas/${firstLessonId(course)}`
    : `/belepes?vissza=${encodeURIComponent(`/hagyomanyos/tanulas/${firstLessonId(course)}`)}`;

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
          <div className="course-grid">
            <div className="ccard">
              <div className="ccard-banner indigo" style={{ ["--cbcover" as string]: "url(/covers/merleg.webp)" } as React.CSSProperties}><span className="ccard-tag">Szakmai tananyag</span><i className="ri-scales-3-line" /></div>
              <div className="ccard-body">
                <h3 className="h4">Közbeszerzési szakmai tananyag</h3>
                <p className="body">Moduláris, teljeskörű elméleti ismeretanyag az ajánlattételtől a szerződés teljesítésén át a jogorvoslatig és az EKR használatáig.</p>
                <div className="ccard-meta">
                  <span><i className="ri-stack-line" /> {course.sections.length} modul</span>
                  <span><i className="ri-list-check-2" /> {course.totalLessons} lecke</span>
                  <span><i className="ri-award-line" /> Oklevél</span>
                </div>
                <Link href={startHref} className="btn btn-primary btn-block">Beiratkozom <i className="ri-arrow-right-line" /></Link>
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
          <h2 className="h2" style={{ marginBottom: "var(--space-200)" }}>{course.title}</h2>
          <p className="body" style={{ marginBottom: "var(--space-1200)" }}>
            {course.sections.length} modul · {course.totalLessons} lecke · a teljes anyag ingyenes.
          </p>
          <div className="curric">
            {course.sections.map((s) => (
              <div className="curric-sec" key={s.key}>
                <div className="curric-head">
                  <span className="curric-num">{s.key}</span>
                  <div>
                    <h3 className="h5">{s.title}</h3>
                    <p className="meta">{s.lessons.length} lecke</p>
                  </div>
                  <Link href={`/hagyomanyos/tanulas/${s.lessons[0].id}`} className="btn btn-outline btn-sm">Megnyitom</Link>
                </div>
                <ul className="curric-list">
                  {s.lessons.slice(0, 5).map((l) => (
                    <li key={l.id}>
                      <i className="ri-file-text-line" />
                      <Link href={`/hagyomanyos/tanulas/${l.id}`}>{l.title}</Link>
                      <span className="meta">{l.durationMin} perc</span>
                    </li>
                  ))}
                  {s.lessons.length > 5 && (
                    <li className="more"><i className="ri-more-line" /> +{s.lessons.length - 5} további lecke</li>
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
