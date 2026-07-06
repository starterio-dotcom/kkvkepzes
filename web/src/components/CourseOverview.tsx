// Kurzus-adatlap (szerver-komponens): leírás, modul-lista, indítás CTA.
// Mindkét tanfolyam ezt használja; a videósnál a videótervek is megjelennek.
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import {
  allVideoPlans, courseTitle, firstLessonId, getOutline, totalLessons, totalMinutes,
  type Variant,
} from "@/lib/tananyag";
import { getSession } from "@/lib/auth";

const COPY: Record<Variant, { label: string; lead: string; icon: string; cta: string }> = {
  hagyomanyos: {
    label: "Hagyományos tanfolyam",
    lead: "Olvasmányos leckék, képernyőképek, esettanulmány-fonál és modulzáró kvízek — a teljes tananyag szövegesen, saját tempóban.",
    icon: "ri-book-open-line",
    cta: "Tanfolyam indítása",
  },
  videos: {
    label: "Videókkal bővített tanfolyam",
    lead: "Ugyanaz a teljes tananyag, kiegészítve képernyős videó-végigvezetésekkel a legfontosabb EKR-műveletekhez. A videós leckékben a szöveges tartalom is elérhető.",
    icon: "ri-play-circle-line",
    cta: "Videós tanfolyam indítása",
  },
};

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
  const outline = getOutline(variant);
  const mins = totalMinutes(variant);
  const startHref = `/${variant}/tanulas/${firstLessonId}`;
  const ctaHref = user ? startHref : `/belepes?vissza=${encodeURIComponent(startHref)}`;
  const videos = variant === "videos" ? allVideoPlans() : [];

  return (
    <>
      <Header user={user} />
      <main id="main">
        <section className="pagehead" style={{ ["--cover" as string]: "url(/covers/merleg.webp)" } as React.CSSProperties}>
          <div className="container">
            <div className="eyebrow light"><i className={copy.icon} /> {copy.label}</div>
            <h1 className="h1 white">{courseTitle}</h1>
            <p className="pagehead-lead">{copy.lead}</p>
            <div className="ovr-meta">
              <span><i className="ri-stack-line" /> {outline.length} szakasz</span>
              <span><i className="ri-list-check-2" /> {totalLessons} lecke</span>
              <span><i className="ri-time-line" /> ~{Math.round(mins / 60)} óra</span>
              {variant === "videos" && <span><i className="ri-film-line" /> {videos.length} videó (gyártás alatt)</span>}
              <span><i className="ri-award-line" /> Oklevél</span>
            </div>
            <div className="ovr-cta">
              <Link href={ctaHref} className="btn btn-light btn-lg">{copy.cta} <i className="ri-arrow-right-line" /></Link>
              <Link href={variant === "videos" ? "/hagyomanyos" : "/videos"} className="btn btn-outline-light btn-lg">
                {variant === "videos" ? "Hagyományos változat" : "Videós változat"}
              </Link>
            </div>
          </div>
        </section>

        {variant === "videos" && (
          <section className="sec">
            <div className="container">
              <div className="sec-head center">
                <div className="eyebrow">Videó-végigvezetések</div>
                <h2 className="h2">Nézd, ahogy csinálják — az EKR valós felületén</h2>
              </div>
              <div className="ovr-vgrid">
                {videos.map((v) => (
                  <div className="ovr-vcard" key={v.title}>
                    <div className="ovr-vthumb"><i className="ri-vidicon-line" /><span>Gyártás alatt</span></div>
                    <b>{v.title}</b>
                    <p className="meta">{v.desc}</p>
                    <div className="ovr-vmeta">
                      <span><i className="ri-movie-2-line" /> {v.genre}</span>
                      <span><i className="ri-time-line" /> {v.length}</span>
                      {v.optional && <span className="opt">opcionális</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className={`sec${variant === "videos" ? " sec-alt" : ""}`}>
          <div className="container">
            <div className="sec-head center">
              <div className="eyebrow">Tematika</div>
              <h2 className="h2">Folyamatalapú felépítés — a közbeszerzés életútja</h2>
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
                        <i className={l.hasVideo ? "ri-play-circle-line video" : KIND_META[l.kind].icon} />
                        <span>{l.title}</span>
                        <em>
                          {l.kind === "modulzaro" ? `${l.quizCount} kérdés`
                            : l.hasVideo ? `videó + ${l.durationMin} perc`
                            : `${l.durationMin} perc`}
                        </em>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
            <div className="ovr-foot">
              <Link href={ctaHref} className="btn btn-primary btn-lg">{copy.cta} <i className="ri-arrow-right-line" /></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
