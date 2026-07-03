import Link from "next/link";

const COLS = [
  {
    title: "Menü",
    links: [
      { label: "Kezdőoldal", href: "/hagyomanyos" },
      { label: "Hírek", href: "/hirek" },
      { label: "Kurzusok", href: "/kurzusok" },
      { label: "Elérhetőségek", href: "/elerhetosegek" },
    ],
  },
  {
    title: "Tájékoztatók",
    links: [
      { label: "Panaszkezelés", href: "/hamarosan" },
      { label: "Adatkezelés", href: "/hamarosan" },
      { label: "Sütik használata", href: "/hamarosan" },
      { label: "Impresszum", href: "/hamarosan" },
    ],
  },
  {
    title: "Nyereményjáték",
    links: [
      { label: "Játékszabályzat", href: "/hamarosan" },
      { label: "Adatvédelmi tájékoztató", href: "/hamarosan" },
      { label: "Szabályzatok", href: "/hamarosan" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-wide">
        <div className="cols">
          <div className="foot-brand">
            <div className="brand" style={{ marginBottom: "var(--space-400)" }}>
              <span className="mark"><i className="ri-graduation-cap-fill" /></span>
              <span className="wm">
                <b style={{ color: "#fff" }}>KKV <span className="accent">Képzés</span></b>
                <span>Közbeszerzési képzések</span>
              </span>
            </div>
            <p className="foot-desc">
              Ingyenes e-learning kis- és középvállalkozásoknak. Az állam veled van a
              vállalkozásod sikeréért.
            </p>
            <div className="foot-social">
              <Link href="/hamarosan" aria-label="Facebook"><i className="ri-facebook-fill" /></Link>
              <Link href="/hamarosan" aria-label="YouTube"><i className="ri-youtube-fill" /></Link>
              <Link href="/hamarosan" aria-label="LinkedIn"><i className="ri-linkedin-fill" /></Link>
            </div>
          </div>
          {COLS.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <p className="foot-col-title">{c.title}</p>
              {c.links.map((l) => (
                <Link key={l.label} href={l.href}>{l.label}</Link>
              ))}
            </nav>
          ))}
        </div>

        <div className="foot-legal-note">
          Felnőttképzési nyilvántartásba vételi szám: E/2025/000043 · Az e-learning rendszer
          fejlesztése az RRF-9.4.7-22-2022-00001 projekt támogatásával valósult meg.
        </div>
        <div className="legal">
          <span>© 2026 KKV Képzés · Digitális Állampolgárság Program</span>
          <span className="gov-badge"><i className="ri-verified-badge-fill" /> Magyarorszag.hu hivatalos weboldala</span>
        </div>
      </div>
    </footer>
  );
}
