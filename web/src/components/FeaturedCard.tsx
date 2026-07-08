"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const DEFAULT_MODULES = [
  "A közbeszerzés mint üzleti lehetőség",
  "Belépés és eljárások keresése",
  "Az ajánlattétel",
  "A bírálati szakasz",
  "A szerződés teljesítése",
  "Vitarendezés és jogorvoslat",
];

/** Élő haladás-demó: a modulok egyesével pipálódnak, a csík lépcsőzetesen tölt (a terv szerint). */
export default function FeaturedCard({ href, title, modules }: { href: string; title?: string; modules?: string[] }) {
  const MODULES = modules ?? DEFAULT_MODULES;
  const [step, setStep] = useState(0); // teljesített modulok száma (0..4)

  useEffect(() => {
    let s = 0;
    let t: ReturnType<typeof setTimeout>;
    const loop = () => {
      const atEnd = s >= MODULES.length;
      t = setTimeout(() => {
        s = atEnd ? 0 : s + 1;
        setStep(s);
        loop();
      }, atEnd ? 2600 : 1100);
    };
    loop();
    return () => clearTimeout(t);
  }, [MODULES.length]);

  const pct = Math.round((step / MODULES.length) * 100);

  return (
    <div className="feat-card">
      <div className="feat-head">
        <span className="feat-ico"><i className="ri-scales-3-line" /></span>
        <div className="feat-head-txt">
          <span className="feat-eyebrow">Kiemelt kurzus</span>
          <p className="feat-title">{title ?? "Közbeszerzési szakmai tananyag"}</p>
        </div>
        <span className="feat-badge">{step}/{MODULES.length}</span>
      </div>

      <ul className="feat-list">
        {MODULES.map((label, i) => {
          const state = i < step ? "done" : i === step ? "active" : "locked";
          return (
            <li key={label} className={state}>
              <i className={
                state === "done" ? "ri-checkbox-circle-fill"
                : state === "active" ? "ri-loader-4-line spin"
                : "ri-lock-2-line"
              } />
              {label}
            </li>
          );
        })}
      </ul>

      <div className="feat-progress">
        <div className="feat-progress-row"><span>Összesített haladás</span><b>{pct}%</b></div>
        <div className="bar"><span style={{ width: `${pct}%` }} /></div>
      </div>

      <Link href={href} className="btn btn-primary btn-block">Megnézem a tananyagot</Link>
    </div>
  );
}
