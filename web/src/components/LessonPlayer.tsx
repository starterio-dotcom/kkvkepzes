"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FlatLesson, Quiz as QuizT } from "@/lib/course";
import type { OutlineSection, LessonPage } from "@/lib/moodle";
import { useStoredSet } from "@/lib/useStoredSet";
import Quiz from "./Quiz";

const LS_KEY = "kkv_trad_done";
const MOD_ICON: Record<string, string> = {
  lesson: "ri-play-circle-line", quiz: "ri-questionnaire-line", feedback: "ri-survey-line",
  page: "ri-file-text-line", folder: "ri-folder-3-line", forum: "ri-discuss-line",
  glossary: "ri-book-2-line", qbank: "ri-database-2-line", url: "ri-links-line",
};

export default function LessonPlayer({
  outline, lessons, lesson, prevId, nextId, pages: livePages, quiz, totalLessons,
}: {
  outline: OutlineSection[];
  lessons: { id: string; num: string; shortTitle: string; sectionKey: string }[];
  lesson: FlatLesson;
  prevId?: string;
  nextId?: string;
  pages: LessonPage[] | null;
  quiz: QuizT | null;
  totalLessons: number;
}) {
  const router = useRouter();
  const [drawer, setDrawer] = useState(false);
  const [page, setPage] = useState(0);
  const [done, mark] = useStoredSet(LS_KEY);

  const pages = useMemo<LessonPage[]>(
    () => (livePages && livePages.length ? livePages : [{ title: lesson.shortTitle, html: "" }]),
    [livePages, lesson.shortTitle]
  );
  const total = pages.length;
  const cur = pages[Math.min(page, total - 1)];
  const html = cur?.html ?? "";
  const heading = cur?.title || lesson.shortTitle;
  const hasImg = /<img/i.test(html);
  const donePct = Math.round((done.size / Math.max(1, totalLessons)) * 100);

  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(outline.map((s) => [s.name, s.items.some((i) => i.id === lesson.id)]))
  );

  const goNext = () => {
    if (page < total - 1) { setPage((p) => p + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }
    else { mark(lesson.id); if (nextId) router.push(`/hagyomanyos/tanulas/${nextId}`); }
  };

  return (
    <>
      {/* Al-fejléc */}
      <div className="lp-top">
        <div className="container-wide lp-top-inner">
          <div className="lp-crumb">
            <button className="lp-toggle" onClick={() => setDrawer(true)}><i className="ri-menu-line" /> Tananyag</button>
            <nav aria-label="Morzsamenü" className="lp-breadcrumb">
              <span className="lp-course">Közbeszerzési szakmai tananyag</span>
              <i className="ri-arrow-right-s-line" /><span>{lesson.sectionKey}. Az EKR</span>
              <i className="ri-arrow-right-s-line" /><span className="lp-cur">{lesson.num}. {lesson.shortTitle}</span>
            </nav>
          </div>
          <div className="lp-prog"><i className="ri-focus-3-line" /> Kurzus haladás {donePct}%</div>
        </div>
      </div>

      <div className="container-wide lp-layout">
        {/* Tartalmi kártya */}
        <main id="main" className="lp-card">
          <div className="lp-card-head">
            <span className="lp-card-ico"><i className="ri-node-tree" /></span>
            <h1 className="h3">{lesson.title}</h1>
          </div>
          <div className="chip chip-grey lp-todo"><i className="ri-checkbox-circle-line" /> Teendő: A tevékenység végignézése</div>

          <div className="lp-page-head">
            <span className="lp-page-badge">{page + 1} / {total}</span>
            <h2 className="h4">{heading}</h2>
          </div>

          {!hasImg && (
            <figure className="lp-visual">
              <div className="lp-visual-inner"><i className="ri-global-line" /> <span>EKR</span></div>
              <figcaption><i className="ri-image-line" /> Az EKR belépés nélkül elérhető nyitófelülete</figcaption>
            </figure>
          )}

          {html
            ? <div className="moodle-content lp-body" dangerouslySetInnerHTML={{ __html: html }} />
            : <p className="lp-body body">Ebben a leckében az EKR kapcsolódó felületét tekintjük át, lépésről lépésre.</p>}

          {page === total - 1 && quiz && <Quiz quiz={quiz} />}

          <div className="lp-pager">
            <button className="btn btn-ghost" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
              <i className="ri-arrow-left-line" /> Előző oldal
            </button>
            <span className="meta">{page + 1} / {total} oldal</span>
            <button className="btn btn-outline" onClick={goNext}>
              {page < total - 1 ? "Következő oldal" : "Következő lecke"} <i className="ri-arrow-right-line" />
            </button>
          </div>
        </main>

        {/* Jobb oldalsáv */}
        <aside className="lp-side">
          <div className="lp-side-card">
            <span className="lp-side-label">Aktuális lecke</span>
            <div className="lp-side-lesson"><span className="lp-side-ico"><i className="ri-play-fill" /></span><b>{lesson.num}. {lesson.shortTitle}</b></div>
            <button className="btn btn-ghost btn-block" onClick={() => setDrawer(true)}><i className="ri-list-unordered" /> Teljes tananyag</button>
          </div>
          {nextId && (
            <div className="lp-side-card next">
              <span className="lp-side-label">Következő lecke</span>
              <b className="lp-next-title">{lessons.find((l) => l.id === nextId)?.num}. {lessons.find((l) => l.id === nextId)?.shortTitle}</b>
              <Link href={`/hagyomanyos/tanulas/${nextId}`} className="btn btn-light btn-block" onClick={() => mark(lesson.id)}>Tovább <i className="ri-arrow-right-line" /></Link>
            </div>
          )}
        </aside>
      </div>

      {/* Ragadós lábléc */}
      <div className="lp-bottom">
        <div className="lp-bottom-bar"><span style={{ width: `${((page + 1) / total) * 100}%` }} /></div>
        <div className="container-wide lp-bottom-inner">
          <span className="lp-bottom-title">{lesson.num}. {lesson.shortTitle}</span>
          <div className="lp-bottom-right">
            <span className="meta">{done.has(lesson.id) ? "kész" : "folyamatban"}</span>
            {prevId && <Link href={`/hagyomanyos/tanulas/${prevId}`} className="btn btn-ghost btn-sm"><i className="ri-arrow-left-line" /> Előző</Link>}
            <button className="btn btn-primary" onClick={goNext}>{page < total - 1 ? "Következő" : nextId ? "Következő lecke" : "Befejezés"} <i className="ri-arrow-right-line" /></button>
          </div>
        </div>
      </div>

      {/* Fiók (teljes tananyag) */}
      {drawer && (
        <div className="lp-drawer-wrap" onClick={() => setDrawer(false)}>
          <div className="lp-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="lp-drawer-head">
              <b>Közbeszerzési szakmai tananyag</b>
              <button className="lp-drawer-close" aria-label="Bezárás" onClick={() => setDrawer(false)}><i className="ri-close-line" /></button>
            </div>
            <div className="lp-drawer-prog">
              <div className="tree-progress-row"><span>Kurzus haladás</span><b>{donePct}%</b></div>
              <div className="bar"><span style={{ width: `${donePct}%` }} /></div>
            </div>
            <div className="lp-drawer-scroll">
              {outline.map((s) => {
                const isOpen = open[s.name];
                const secDone = s.items.filter((i) => i.isLesson && done.has(i.id)).length;
                const secLessons = s.items.filter((i) => i.isLesson).length;
                const complete = secLessons > 0 && secDone === secLessons;
                return (
                  <div className="lp-dsec" key={s.name}>
                    <button className="lp-dsec-head" onClick={() => setOpen((o) => ({ ...o, [s.name]: !o[s.name] }))} aria-expanded={isOpen}>
                      <span className={`lp-dsec-badge${complete ? " done" : ""}`}>{complete ? <i className="ri-check-line" /> : <i className="ri-node-tree" />}</span>
                      <span className="lp-dsec-name">{s.name}</span>
                      <i className={isOpen ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"} />
                    </button>
                    {isOpen && (
                      <ul className="lp-ditems">
                        {s.items.map((it) => {
                          const active = it.id === lesson.id;
                          const isDone = done.has(it.id);
                          const state = isDone ? "done" : active ? "active" : "todo";
                          const ico = isDone ? "ri-checkbox-circle-fill" : active ? "ri-play-circle-fill" : (MOD_ICON[it.modname] ?? "ri-circle-line");
                          const inner = (<><i className={ico} /><span>{it.name}</span></>);
                          return (
                            <li key={it.id} className={`${state}${it.isLesson ? "" : " nolink"}`}>
                              {it.href ? <Link href={it.href} onClick={() => setDrawer(false)}>{inner}</Link> : <span className="lp-ditem-static">{inner}</span>}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
