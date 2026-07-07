import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { getSession } from "@/lib/auth";

export const metadata = {
  title: "Elérhetőségek",
  description: "Kérdésed van a közbeszerzési képzésekről vagy a beiratkozásról? Írj nekünk, hívd az 1818 ügyfélvonalat, vagy nézd meg a gyakori kérdéseket.",
};

const INFO = [
  { icon: "ri-mail-line", label: "E-mail", value: "info@kkvkepzes.gov.hu" },
  { icon: "ri-customer-service-2-line", label: "Ügyfélszolgálat", value: "+36 1 234 5678" },
  { icon: "ri-time-line", label: "Ügyfélfogadás", value: "H–P, 8:00–16:00" },
];

const FAQ = [
  { q: "Valóban ingyenesek a képzések?", a: "Igen. Minden kurzus és a kiállított oklevél is teljesen díjmentes, uniós támogatásból finanszírozva." },
  { q: "Kell-e külön regisztrálni?", a: "A belépéshez Ügyfélkapu+ azonosítás szükséges — nincs külön jelszó vagy hosszú regisztrációs űrlap." },
  { q: "Kapok-e oklevelet a végén?", a: "Igen, a modulok sikeres teljesítése után PDF formátumú oklevelet állítunk ki a nevedre, amely letölthető." },
  { q: "Milyen sorrendben végezzem a modulokat?", a: "A modulok tetszőleges sorrendben elvégezhetők, de az oklevélhez minden modul teljesítése szükséges." },
];

export default async function Page() {
  const user = await getSession();
  return (
    <>
      <Header user={user} />
      <main id="main">

      <section className="pagehead">
        <div className="container">
          <div className="eyebrow light">Elérhetőségek</div>
          <h1 className="h1 white">Hogyan tudunk segíteni?</h1>
          <p className="pagehead-lead">
            Kérdésed van a képzésekről vagy a beiratkozásról? Írj nekünk, vagy nézd meg a gyakori kérdéseket.
          </p>
        </div>
      </section>

      <section className="sec sec-tint">
        <div className="container">
          <div className="contact-cols">
            {/* Űrlap */}
            <ContactForm />

            {/* Oldalsáv: elérhetőségek + GYIK */}
            <div className="contact-aside">
              <div className="contact-card">
                <h3 className="h5" style={{ marginBottom: "var(--space-500)" }}>Elérhetőségeink</h3>
                <ul className="info-list">
                  {INFO.map((i) => (
                    <li key={i.label}>
                      <span className="info-ico"><i className={i.icon} /></span>
                      <span className="info-txt"><em>{i.label}</em><b>{i.value}</b></span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="contact-card">
                <h3 className="h5" style={{ marginBottom: "var(--space-400)" }}>Gyakori kérdések</h3>
                <div className="faq">
                  {FAQ.map((f) => (
                    <details className="faq-item" key={f.q}>
                      <summary>{f.q}<i className="ri-add-line" /></summary>
                      <p className="body">{f.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}
