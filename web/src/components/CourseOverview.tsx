// Kurzus-adatlap (szerver-komponens): fejléc, "Mit tanulsz meg?", tematika,
// jobb oldali összefoglaló kártya. A két tanfolyam adatlapja egységes —
// csak a név, a leírás és az ikon tér el.
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import {
  courseName, firstLessonId, getOutline, totalLessons, totalMinutes,
  type Variant,
} from "@/lib/tananyag";
import { getSession } from "@/lib/auth";

const COPY: Record<Variant, { label: string; lead: string; icon: string }> = {
  hagyomanyos: {
    label: "Szakmai tananyag",
    lead: "Olvasmányos leckék, képernyőképek, esettanulmány-fonál és modulzáró kvízek — a teljes tananyag szövegesen, saját tempóban.",
    icon: "ri-book-open-line",
  },
  videos: {
    label: "Szakmai tananyag",
    lead: "Ugyanaz a teljes tananyag, kiegészítve képernyős videó-végigvezetésekkel a legfontosabb EKR-műveletekhez. A videós leckékben a szöveges tartalom is elérhető.",
    icon: "ri-play-circle-line",
  },
};
const CTA = "Tanfolyam indítása";

const LEARN = [
  "A közbeszerzési eljárások törvényes kereteit és alapelveit",
  "Az ajánlattétel gyakorlati lépéseit, buktatóit",
  "A hiánypótlás és a bírálati felhívások szabályos megválaszolását",
  "A nyertes szerződés jogszerű teljesítését",
  "A jogorvoslati lehetőségeket és határidőket",
  "Az Elektronikus Közbeszerzési Rendszer (EKR) használatát",
];

const FEATS = [
  { icon: "ri-list-check-2", text: "interaktív lecke", dynamic: true },
  { icon: "ri-time-line", text: "Saját tempóban, bármikor" },
  { icon: "ri-award-line", text: "PDF oklevél a végén" },
  { icon: "ri-infinity-line", text: "Korlátlan hozzáférés" },
];

const KIND_META: Record<string, { icon: string; label: string }> = {
  lecke: { icon: "ri-article-line", label: "Lecke" },
  esettanulmany: { icon: "ri-briefcase-4-line", label: "Esettanulmány" },
  modulzaro: { icon: "ri-questionnaire-line", label: "Modulzáró" },
  segedlet: { icon: "ri-tools-line", label: "Segédlet" },
  fogalomtar: { icon: "ri-book-2-line", label: "Fogalomtár" },
};

export default async function CourseOverview({ variant }: { variant: Variant }) {
  const user = await getSession();
  const copy = COPY[variant];
  // Egységes tematika: a videókat itt nem emeljük ki — mindkét adatlap
  // ugyanazt a vázlatot mutatja (azonos ikonok, azonos időadatok).
  const outline = getOutline("hagyomanyos");
  const mins = totalMinutes("hagyomanyos");
  const startHref = `/${variant}/tanulas/${firstLessonId}`;
  const ctaHref = user ? startHref : `/belepes?vissza=${encodeURIComponent(startHref)}`;

  return (
    <>
      <Header user={user} />
      <main id="main">
        <section className="pagehead">
          <div className="container">
            <Link href="/kurzusok" className="pagehead-back"><i className="ri-arrow-left-line" /> Vissza a kurzusokhoz</Link>
            <div className="pagehead-tags">
              <span className="ptag"><i className={copy.icon} /> {copy.label}</span>
              <span className="ptag green">Ingyenes</span>
            </div>
            <h1 className="h1 white">{courseName(variant)}</h1>
            <p className="pagehead-lead">{copy.lead}</p>
            <div className="ovr-meta">
              <span><i className="ri-stack-line" /> {outline.length} szakasz</span>
              <span><i className="ri-list-check-2" /> {totalLessons} lecke</span>
              <span><i className="ri-time-line" /> kb. {Math.round(mins / 60)} óra</span>
              <span><i className="ri-award-line" /> Letölthető oklevél</span>
            </div>
          </div>
        </section>

        <section className="sec">
          <div className="container ovr-grid">
            <div className="ovr-main">
              <div className="ovr-learn">
                <h2 className="h3">Mit tanulsz meg?</h2>
                <ul>
                  {LEARN.map((x) => (
                    <li key={x}><i className="ri-checkbox-circle-fill" /> {x}</li>
                  ))}
                </ul>
              </div>

              <div className="ovr-them-head">
                <h2 className="h3">Tananyag</h2>
                <span className="meta">{outline.length} szakasz · {totalLessons} lecke</span>
              </div>
              <div className="ovr-modules">
                {outline.map((m) => (
                  <details className="ovr-mod" key={m.key} open={m.key === "m0"}>
                    <summary>
                      <span className="ovr-mod-badge">{m.badge}</span>
                      <span className="ovr-mod-title">
                        <b>{m.title}</b>
                        {m.intro && <em>{m.intro}</em>}
                      </span>
                      <span className="ovr-mod-count">{m.lessons.length} lecke</span>
                      <i className="ri-arrow-down-s-line" />
                    </summary>
                    <ul>
                      {m.lessons.map((l) => (
                        <li key={l.id}>
                          <i className={KIND_META[l.kind].icon} />
                          <span>{l.title}</span>
                          <em>
                            {l.kind === "modulzaro" ? `${l.quizCount} kérdés` : `${l.durationMin} perc`}
                          </em>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            </div>

            <aside className="ovr-aside">
              <div className="ovr-card">
                <div className="ovr-card-cover" style={{ ["--cbcover" as string]: "url(/covers/merleg.webp)" } as React.CSSProperties} />
                <div className="ovr-card-body">
                  <div className="ovr-price">
                    <b>Ingyenes</b>
                    <s>Regisztrációhoz kötött</s>
                  </div>
                  <ul className="ovr-feats">
                    {FEATS.map((f) => (
                      <li key={f.text}><i className={f.icon} /> {f.dynamic ? `${totalLessons} ${f.text}` : f.text}</li>
                    ))}
                  </ul>
                  <Link href={ctaHref} className="btn btn-primary btn-block"><i className="ri-shield-user-fill" /> {CTA}</Link>
                  <p className="ovr-card-note">A beiratkozáshoz Ügyfélkapu+ azonosítás szükséges.</p>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
