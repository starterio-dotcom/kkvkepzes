"use client";
import { useState } from "react";
import Link from "next/link";
import type { Section } from "@/lib/course";

export default function CourseTree({
  variant,
  activeId,
  sections,
}: {
  variant: "hagyomanyos" | "videos";
  activeId: string;
  sections: Section[];
}) {
  const flat = sections.flatMap((s) => s.lessons.map((l) => ({ id: l.id, sec: s.key })));
  const activeIndex = flat.findIndex((l) => l.id === activeId);
  const activeSection = flat[activeIndex]?.sec;
  const [open, setOpen] = useState<Record<string, boolean>>(
    Object.fromEntries(sections.map((s) => [s.key, s.key === activeSection]))
  );
  const donePct = flat.length ? Math.round((activeIndex / flat.length) * 100) : 0;
  const icon = variant === "videos" ? "ri-play-fill" : "ri-file-text-line";

  return (
    <aside className="tree">
      <div className="tree-progress">
        <div className="tree-progress-row">
          <span>Kurzus haladás</span>
          <b>{donePct}%</b>
        </div>
        <div className="bar"><span style={{ width: `${donePct}%` }} /></div>
      </div>

      <div className="tree-scroll">
        {sections.map((s) => {
          const isOpen = open[s.key];
          return (
            <div className="tree-sec" key={s.key}>
              <button
                className="tree-sec-head"
                onClick={() => setOpen((o) => ({ ...o, [s.key]: !o[s.key] }))}
                aria-expanded={isOpen}
              >
                <span className="tree-sec-num">{s.key}</span>
                <span className="tree-sec-title">{s.title}</span>
                <i className={isOpen ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"} />
              </button>
              {isOpen && (
                <ul className="tree-items">
                  {s.lessons.map((l) => {
                    const gi = flat.findIndex((x) => x.id === l.id);
                    const state = gi < activeIndex ? "done" : gi === activeIndex ? "active" : "todo";
                    return (
                      <li key={l.id} className={state}>
                        <Link href={`/${variant}/tanulas/${l.id}`}>
                          <i className={
                            state === "done" ? "ri-checkbox-circle-fill"
                            : state === "active" ? icon
                            : "ri-circle-line"
                          } />
                          <span>{l.num}. {l.shortTitle}</span>
                          <em>{l.durationMin}p</em>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
