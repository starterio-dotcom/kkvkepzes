"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header({ user }: { user?: { name: string } | null }) {
  const path = usePathname();
  const isVideo = path.startsWith("/videos");
  const base = isVideo ? "/videos" : "/hagyomanyos";
  const [open, setOpen] = useState(false);

  const nav = [
    { href: base, label: "Kezdőoldal", active: path.startsWith("/hagyomanyos") || path.startsWith("/videos") },
    { href: "/kurzusok", label: "Kurzusok", active: path.startsWith("/kurzusok") },
    { href: "/hirek", label: "Hírek", active: path.startsWith("/hirek") },
    { href: "/elerhetosegek", label: "Elérhetőségek", active: path.startsWith("/elerhetosegek") },
  ];

  return (
    <header className="site-header">
      <div className="container-wide header-bar">
        <Link href={base} className="brand" aria-label="KKV Képzés kezdőoldal">
          <span className="mark"><i className="ri-graduation-cap-fill" /></span>
          <span className="wm">
            <b>KKV <span className="accent">Képzés</span></b>
            <span>Közbeszerzési képzések</span>
          </span>
        </Link>

        <nav className="nav" aria-label="Fő menü">
          {nav.map((n) => (
            <Link key={n.label} href={n.href} className={n.active ? "active" : ""}>{n.label}</Link>
          ))}
        </nav>

        <div className="header-actions">
          <span className="lang"><i className="ri-global-line" /> HU</span>
          {user ? (
            <>
              <Link href="/kurzusok" className="btn btn-primary btn-sm login-cta"><i className="ri-booklet-fill" /> Tanulásom</Link>
              <a href="/api/kilepes" className="logout" title="Kilépés" aria-label="Kilépés"><i className="ri-logout-box-r-line" /></a>
            </>
          ) : (
            <Link href={`/belepes?vissza=${encodeURIComponent(path)}`} className="btn btn-primary btn-sm login-cta"><i className="ri-shield-user-fill" /> Belépés</Link>
          )}
          <button className="hamburger" aria-label={open ? "Menü bezárása" : "Menü megnyitása"} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <i className={open ? "ri-close-line" : "ri-menu-line"} />
          </button>
        </div>
      </div>

      {open && (
        <nav className="mobile-nav" aria-label="Mobil menü">
          {nav.map((n) => (
            <Link key={n.label} href={n.href} className={n.active ? "active" : ""} onClick={() => setOpen(false)}>
              {n.label}<i className="ri-arrow-right-s-line" />
            </Link>
          ))}
          <div className="mobile-nav-actions">
            {user ? (
              <>
                <Link href="/kurzusok" className="btn btn-primary btn-block" onClick={() => setOpen(false)}><i className="ri-booklet-fill" /> Tanulásom</Link>
                <a href="/api/kilepes" className="btn btn-ghost btn-block"><i className="ri-logout-box-r-line" /> Kilépés</a>
              </>
            ) : (
              <Link href={`/belepes?vissza=${encodeURIComponent(path)}`} className="btn btn-primary btn-block" onClick={() => setOpen(false)}><i className="ri-shield-user-fill" /> Belépés</Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
