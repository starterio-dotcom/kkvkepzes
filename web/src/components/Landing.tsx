import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import FeaturedCard from "./FeaturedCard";
import YouTubeEmbed from "./YouTubeEmbed";
import NewsletterForm from "./NewsletterForm";
import { allVideoPlans, firstLessonId, totalLessons, totalModules } from "@/lib/tananyag";
import { getSession } from "@/lib/auth";

const FEATURES = [
  { icon: "ri-price-tag-3-line", cls: "green", title: "100%-ban ingyenes", text: "Minden kurzus és a kiállított oklevél is teljesen díjmentes, uniós támogatásból." },
  { icon: "ri-time-line", cls: "blue", title: "Saját tempóban", text: "Bármikor, bárhonnan tanulhatsz — a modulok tetszőleges sorrendben elvégezhetők." },
  { icon: "ri-award-line", cls: "orange", title: "Letölthető oklevél", text: "A sikeres teljesítés után PDF formátumú oklevelet állítunk ki a nevedre." },
  { icon: "ri-graduation-cap-line", cls: "indigo", title: "Gyakorlati EKR-tudás", text: "Az Elektronikus Közbeszerzési Rendszer használata lépésről lépésre, érthetően." },
];

const STEPS = [
  { n: 1, title: "Regisztrálj", text: "Lépj be Ügyfélkapu+ azonosítással — mindössze pár másodperc." },
  { n: 2, title: "Tanulj a modulokból", text: "Interaktív leckék, saját tempóban, bárhonnan elérhetően." },
  { n: 3, title: "Töltsd le az oklevelet", text: "A modul teljesítése után PDF oklevél jár, letölthető formában." },
];

const NEWS = [
  { tag: "Esemény", date: "2026. 04. 30.", cls: "indigo", title: "Sikeresen lezajlott a projekt zárórendezvénye", text: "Köszönjük mindenkinek a részvételt és a közreműködést! A rendezvényről készült összefoglaló elérhető." },
  { tag: "Képzés", date: "2026. 03. 12.", cls: "green", title: "Új ingyenes közbeszerzési képzések indulnak tavasszal", text: "Bővül a kínálat: online és személyes alkalmakra is lehet jelentkezni a felületen." },
  { tag: "Útmutató", date: "2026. 02. 20.", cls: "teal", title: "Így regisztrálj első alkalommal az EKR-ben", text: "Lépésről lépésre bemutatjuk az Elektronikus Közbeszerzési Rendszer regisztrációját." },
];

export default async function Landing() {
  const user = await getSession();
  const startHref = `/hagyomanyos/tanulas/${firstLessonId}`;
  const ctaHref = user ? startHref : `/belepes?vissza=${encodeURIComponent(startHref)}`;
  const videoCount = allVideoPlans().length;

  return (
    <>
      <Header user={user} />
      <main id="main">

      {/* ---------- HERO ---------- */}
      <section className="hero2">
        <div className="container-wide hero2-grid">
          <div className="hero2-copy">
            <div className="hero2-eyebrow"><i className="ri-shield-check-line" /> Ingyenes online képzés · KKV-knak</div>
            <h1 className="hero2-title">Közbeszerzés,<br />érthetően.</h1>
            <p className="hero2-lead">
              Ismerd meg a közbeszerzési eljárások törvényes keretét és az EKR használatát —
              saját tempóban, ingyen. A modulok végén letölthető oklevél jár.
            </p>
            <div className="hero2-cta">
              <Link href={ctaHref} className="btn btn-light btn-lg">Kezdd el ingyen <i className="ri-arrow-right-line" /></Link>
              <Link href="#kurzusok" className="btn btn-outline-light btn-lg"><i className="ri-book-open-line" /> Böngészd a kurzusokat</Link>
            </div>
            <div className="hero2-tags">
              <span><i className="ri-checkbox-circle-line" /> Ingyenes</span>
              <span><i className="ri-award-line" /> Oklevéllel</span>
              <span><i className="ri-time-line" /> Saját tempóban</span>
            </div>
          </div>

          {/* Kiemelt kurzus – animált haladás-demó (a terv szerint) */}
          <FeaturedCard href={ctaHref} />
        </div>
      </section>

      {/* ---------- MIÉRT ÉRDEMES ---------- */}
      <section className="sec">
        <div className="container">
          <div className="sec-head center">
            <div className="eyebrow">Miért érdemes</div>
            <h2 className="h2">Képzés, ami a vállalkozásod<br />sikeréért van</h2>
          </div>
          <div className="feature-grid">
            {FEATURES.map((f) => (
              <div className="feature-card" key={f.title}>
                <div className={`feature-ico ${f.cls}`}><i className={f.icon} /></div>
                <h3 className="h5">{f.title}</h3>
                <p className="meta">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FELVEHETŐ KURZUSOK ---------- */}
      <section className="sec sec-alt" id="kurzusok">
        <div className="container">
          <div className="sec-head row">
            <div>
              <div className="eyebrow">Felvehető kurzusok</div>
              <h2 className="h2">Kifejezetten KKV-knak kialakítva</h2>
            </div>
            <Link href="/kurzusok" className="sec-link">Összes kurzus <i className="ri-arrow-right-line" /></Link>
          </div>
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

      {/* ---------- ÍGY MŰKÖDIK ---------- */}
      <section className="sec">
        <div className="container">
          <div className="sec-head center">
            <div className="eyebrow">Három lépés</div>
            <h2 className="h2">Így működik</h2>
          </div>
          <div className="steps">
            {STEPS.map((s) => (
              <div className="step" key={s.n}>
                <div className="step-num">{s.n}</div>
                <h3 className="h5">{s.title}</h3>
                <p className="meta">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- BEMUTATÓ (sötét) ---------- */}
      <section className="demo">
        <div className="container-wide demo-grid">
          <div className="demo-copy">
            <div className="eyebrow light">Bemutató</div>
            <h2 className="h2 white">Nézd meg, miről szól a program</h2>
            <p className="demo-lead">Rövid bemutató a közbeszerzési eljárások alapjairól és arról, hogyan segít a képzés a mindennapi ügyintézésben.</p>
            <Link href={ctaHref} className="btn btn-light btn-lg"><i className="ri-play-circle-line" /> Kezdd el a tanulást</Link>
          </div>
          <YouTubeEmbed id="G8cNcVRpmAY" title="Bemutató videó" />
        </div>
      </section>

      {/* ---------- STATISZTIKA ---------- */}
      <section className="statbar">
        <div className="container-wide stat-grid">
          <div className="stat"><b>{totalModules}</b><span>tananyag-modul</span></div>
          <div className="stat"><b>{totalLessons}</b><span>interaktív lecke</span></div>
          <div className="stat"><b>PDF</b><span>letölthető oklevél</span></div>
          <div className="stat"><b>0 Ft</b><span>részvételi díj</span></div>
        </div>
      </section>

      {/* ---------- HÍREK ---------- */}
      <section className="sec sec-alt">
        <div className="container">
          <div className="sec-head row">
            <div>
              <div className="eyebrow">Hírek</div>
              <h2 className="h2">Ami a programban történik</h2>
            </div>
            <Link href="/hirek" className="sec-link">Összes hír <i className="ri-arrow-right-line" /></Link>
          </div>
          <div className="news-grid">
            {NEWS.map((n) => (
              <article className={`news-card ${n.cls}`} key={n.title}>
                <div className="news-meta"><span className="news-tag">{n.tag}</span><span className="meta">{n.date}</span></div>
                <h3 className="h5">{n.title}</h3>
                <p className="meta">{n.text}</p>
                <Link href="/hirek" className="news-link">Tovább <i className="ri-arrow-right-line" /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- HÍRLEVÉL ---------- */}
      <section className="sec">
        <div className="container">
          <div className="newsletter">
            <div>
              <h2 className="h3 white">Iratkozz fel a hírlevelünkre</h2>
              <p className="newsletter-lead">Friss hírek a képzésekről és modulokról — havonta legfeljebb egyszer, spam nélkül.</p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}
