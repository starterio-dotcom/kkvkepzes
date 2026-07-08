"use client";
// Egységes kurzus-lejátszó mindkét tanfolyamhoz (hagyományos + videós).
// Dizájn: a korábbi videós lejátszó fejléce + bal oldali szekció-kártyás sáv.
// A tartalom szerver-oldalról jön propként (a teljes tananyag-JSON nem kerül a bundle-be).
import { useState } from "react";
import Link from "next/link";
import type { Block, LessonQuiz, OutlineModule, QuizQ, TLesson, Variant, VideoPlan } from "@/lib/tananyag";
import { useStoredSet } from "@/lib/useStoredSet";
import YouTubeEmbed from "./YouTubeEmbed";

export type PlayerLesson = TLesson & { moduleKey: string; moduleTitle: string };
export type NavMeta = { id: string; title: string } | null;

const KIND_LABEL: Record<string, string> = {
  lecke: "Lecke",
  esettanulmany: "Esettanulmány",
  modulzaro: "Modulzáró kvíz",
  segedlet: "Segédlet",
  fogalomtar: "Fogalomtár",
};
const KIND_ICON: Record<string, string> = {
  lecke: "ri-article-line",
  esettanulmany: "ri-briefcase-4-line",
  modulzaro: "ri-questionnaire-line",
  segedlet: "ri-tools-line",
  fogalomtar: "ri-book-2-line",
};

export default function CoursePlayer({
  variant, outline, lesson, prev, next, courseTitle, courseLabel, totalLessons,
}: {
  variant: Variant;
  outline: OutlineModule[];
  lesson: PlayerLesson;
  prev: NavMeta;
  next: NavMeta;
  courseTitle: string;
  courseLabel: string;
  totalLessons: number;
}) {
  const lsKey = variant === "videos" ? "kkv2_done_v" : "kkv2_done_h";
  const [done, markDone] = useStoredSet(lsKey, []);
  const base = `/${variant}/tanulas`;

  const donePct = Math.round((done.size / totalLessons) * 100);
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(outline.map((m) => [m.key, m.key === lesson.moduleKey]))
  );

  const isDone = done.has(lesson.id);

  return (
    <>
      {/* Al-fejléc haladás-gyűrűvel */}
      <div className="vtop">
        <div className="container-wide vtop-inner">
          <div className="vtop-left">
            <Link href={`/${variant}`} className="vtop-back"><i className="ri-arrow-left-line" /> Vissza a kurzushoz</Link>
            <div className="vtop-title">
              <span className="vtop-eyebrow">{courseLabel}</span>
              <b>{courseTitle}</b>
            </div>
          </div>
          <div className="vtop-prog">
            <div className="vtop-prog-txt"><b>{donePct}% teljesítve</b><span>{done.size} / {totalLessons} lecke</span></div>
            <Ring pct={donePct} />
          </div>
        </div>
      </div>

      <div className="vcourse">
        {/* Bal oldalsáv: modul-kártyák */}
        <aside className="vside">
          <div className="vside-head">
            <div className="vside-head-row"><span>Kurzus tartalma</span><b>{donePct}%</b></div>
            <div className="bar"><span style={{ width: `${donePct}%` }} /></div>
            <p className="meta">{outline.length} szakasz · {totalLessons} lecke</p>
          </div>
          <div className="vside-scroll">
            {outline.map((m) => {
              const secDone = m.lessons.filter((l) => done.has(l.id)).length;
              const secTotal = m.lessons.length;
              const complete = secDone === secTotal;
              const hasActive = m.lessons.some((l) => l.id === lesson.id);
              const isOpen = open[m.key];
              return (
                <div className={`vsec${complete ? " done" : ""}${hasActive ? " current" : ""}${isOpen ? " open" : ""}`} key={m.key}>
                  <button className="vsec-head" onClick={() => setOpen((o) => ({ ...o, [m.key]: !o[m.key] }))} aria-expanded={isOpen}>
                    <span className="vsec-badge">{complete ? <i className="ri-check-line" /> : m.badge}</span>
                    <span className="vsec-info">
                      <b>{m.title}</b>
                      <span className="vsec-prog">
                        <span className="vsec-bar"><span style={{ width: `${(secDone / secTotal) * 100}%` }} /></span>
                        <em>{secDone} / {secTotal} kész</em>
                      </span>
                    </span>
                    <i className={isOpen ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"} />
                  </button>
                  {isOpen && (
                    <ul className="vsec-lessons">
                      {m.lessons.map((l) => {
                        const st = done.has(l.id) ? "done" : l.id === lesson.id ? "active" : "todo";
                        return (
                          <li key={l.id} className={st}>
                            <Link href={`${base}/${l.id}`}>
                              <span className="vl-ico"><i className={
                                st === "done" ? "ri-checkbox-circle-fill"
                                : st === "active" ? "ri-pause-circle-fill"
                                : l.hasVideo ? "ri-play-circle-line"
                                : KIND_ICON[l.kind]
                              } /></span>
                              <span className="vl-txt">
                                <b>{l.title}</b>
                                <em>
                                  {l.kind === "modulzaro" ? `Kvíz · ${l.quizCount} kérdés`
                                    : l.hasVideo ? `Videó + lecke · ${l.durationMin} perc`
                                    : `${KIND_LABEL[l.kind]} · ${l.durationMin} perc`}
                                </em>
                              </span>
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

        {/* Fő terület */}
        <main id="main" className="vmain">
          <nav className="vcrumb">
            <i className={KIND_ICON[lesson.kind]} />
            <span>{lesson.moduleTitle}</span><span className="sep">·</span>
            <span className="meta">{lesson.videos.length && variant === "videos" ? "Videós lecke" : KIND_LABEL[lesson.kind]}</span>
          </nav>

          {lesson.kind === "modulzaro" && lesson.quiz ? (
            <QuizBlock
              key={lesson.id}
              title={lesson.title}
              intro={`A(z) ${lesson.moduleTitle} anyagát lefedő ellenőrző kérdések. Minden kérdésnél azonnali, indoklással kísért visszajelzést kapsz.`}
              quiz={lesson.quiz}
              onPass={() => markDone(lesson.id)}
            />
          ) : (
            <LessonBody
              key={lesson.id}
              lesson={lesson}
              variant={variant}
              isDone={isDone}
              onDone={() => markDone(lesson.id)}
            />
          )}

          <div className="vnav">
            {prev ? (
              <Link href={`${base}/${prev.id}`} className="vnav-card prev">
                <span className="vnav-lbl"><i className="ri-arrow-left-line" /> Előző</span>
                <b>{prev.title}</b>
              </Link>
            ) : <span />}
            {next ? (
              <Link href={`${base}/${next.id}`} className="vnav-card next">
                <span className="vnav-lbl">Következő <i className="ri-arrow-right-line" /></span>
                <b>{next.title}</b>
              </Link>
            ) : (
              <span className="vnav-card next done"><span className="vnav-lbl">Kész <i className="ri-award-line" /></span><b>Kurzus vége</b></span>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

/* ---- Haladás-gyűrű ---- */
function Ring({ pct }: { pct: number }) {
  const r = 17, c = 2 * Math.PI * r, off = c * (1 - pct / 100);
  return (
    <svg className="vring" width="42" height="42" viewBox="0 0 42 42">
      <circle cx="21" cy="21" r={r} fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="4" />
      <circle cx="21" cy="21" r={r} fill="none" stroke="var(--semantic-green-500)" strokeWidth="4"
        strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} transform="rotate(-90 21 21)" />
    </svg>
  );
}

/* ---- Lecke-törzs: cím, célok, blokkok, kész-gomb ---- */
function LessonBody({ lesson, variant, isDone, onDone }: {
  lesson: PlayerLesson; variant: Variant; isDone: boolean; onDone: () => void;
}) {
  // Videós kurzus: a tervezett videó(k) a lecke ELEJÉN, a szöveges tartalom alattuk.
  const showVideosOnTop = variant === "videos" && lesson.videos.length > 0;
  // A frissítésként gyártandó videó a meglévő (régi) videót váltja ki — a chipje elhagyható.
  const hideExistingVideoChip = lesson.videos.some((v) => v.refresh);
  const bodyBlocks = lesson.blocks.filter((b) => {
    if (showVideosOnTop && b.t === "video") return false;
    if (hideExistingVideoChip && b.t === "h5p" && b.kind === "video") return false;
    return true;
  });

  return (
    <>
      <div className="vmeta-row">
        <div className="vmeta-title">
          <h1 className="h3">{lesson.num ? `${lesson.num} ${lesson.title}` : lesson.title}</h1>
          {lesson.kind === "segedlet" && lesson.download && (
            <div className="vmeta-sub">
              <a href={lesson.download} className="ldl" download>
                <i className="ri-download-2-line" /> Letöltés (DOCX)
              </a>
            </div>
          )}
        </div>
        <button className={`btn btn-sm mark${isDone ? " marked" : " btn-outline"}`} onClick={onDone} disabled={isDone}>
          <i className={isDone ? "ri-checkbox-circle-fill" : "ri-check-line"} /> {isDone ? "Kész" : "Megjelölöm késznek"}
        </button>
      </div>

      {showVideosOnTop && lesson.videos.map((v, i) => <VideoPlanCard key={i} v={v} />)}

      {lesson.objectives.length > 0 && (
        <div className="lgoals">
          <b><i className="ri-focus-2-line" /> A lecke végére Ön képes lesz…</b>
          <ul>
            {lesson.objectives.map((o, i) => <li key={i} dangerouslySetInnerHTML={{ __html: o }} />)}
          </ul>
        </div>
      )}

      <div className="lcontent">
        {bodyBlocks.map((b, i) => (
          <BlockView key={i} b={b} lesson={lesson} variant={variant} />
        ))}
      </div>

      {lesson.kind === "fogalomtar" && <Glossary entries={lesson.glossary ?? []} />}
    </>
  );
}

/* ---- Egy tartalomblokk ---- */
function BlockView({ b, lesson, variant }: { b: Block; lesson: PlayerLesson; variant: Variant }) {
  switch (b.t) {
    case "p":
      return <p dangerouslySetInnerHTML={{ __html: b.html }} />;
    case "h": {
      const practical = b.text.startsWith("Gyakorlati feladat");
      return practical
        ? <h3 className="lpractical"><i className="ri-flag-2-line" /> {b.text}</h3>
        : <h3>{b.text}</h3>;
    }
    case "list":
      return b.ordered
        ? <ol>{b.items.map((it, i) => <li key={i} dangerouslySetInnerHTML={{ __html: it }} />)}</ol>
        : <ul>{b.items.map((it, i) => <li key={i} dangerouslySetInnerHTML={{ __html: it }} />)}</ul>;
    case "transition":
      return <blockquote className="ltrans" dangerouslySetInnerHTML={{ __html: b.html }} />;
    case "foot":
      return <p className="lfoot" dangerouslySetInnerHTML={{ __html: b.html }} />;
    case "note":
      return (
        <div className={`lnote ${b.kind}`}>
          <span className="lnote-label">
            <i className={b.kind === "warn" ? "ri-alarm-warning-line" : "ri-information-line"} />
            {b.kind === "warn" ? "Fontos" : "Jó tudni"}
          </span>
          <p dangerouslySetInnerHTML={{ __html: b.html }} />
        </div>
      );
    case "think":
      return (
        <div className="lthink">
          <b><i className="ri-lightbulb-flash-line" /> {b.title}</b>
          {b.items.map((it, i) => <p key={i} dangerouslySetInnerHTML={{ __html: it }} />)}
        </div>
      );
    case "img":
      return (
        <details className="limg">
          <summary><i className="ri-image-line" /> {b.label || "Kapcsolódó képernyőkép"} <em>— kattints a megtekintéshez</em></summary>
          <div className="limg-body">
            {b.srcs.map((s, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={s} alt={b.label || "Képernyőkép"} loading="lazy" />
            ))}
          </div>
        </details>
      );
    case "imgph":
      return (
        <div className="limgph">
          <i className="ri-image-add-line" />
          <span><b>{b.label || "Képernyőkép"}</b> — a képernyőkép beillesztése folyamatban.</span>
        </div>
      );
    case "h5p":
      if (b.kind === "kviz") {
        return lesson.quiz
          ? <InlineQuiz quiz={lesson.quiz} />
          : <div className="lchip"><i className="ri-questionnaire-line" /> Interaktív kvíz — átemelés alatt a Moodle-ból.</div>;
      }
      if (b.kind === "quiz" && b.quiz) {
        return <InlineQuiz quiz={b.quiz} />;
      }
      if (b.kind === "accordion" && b.panels) {
        return (
          <div className="laccordion">
            {b.panels.map((p, i) => (
              <details key={i}>
                <summary><i className="ri-arrow-right-s-line" /> {p.title}</summary>
                <div className="laccordion-body" dangerouslySetInnerHTML={{ __html: p.html }} />
              </details>
            ))}
          </div>
        );
      }
      if (b.kind === "video") {
        if (variant !== "videos") return null;
        if (b.youtubeId) {
          return (
            <div className="lvideo">
              <YouTubeEmbed id={b.youtubeId} title="Videó a leckéhez" />
            </div>
          );
        }
        return (
          <div className="vplan">
            <VideoFrame title={b.title ?? "Videó a leckéhez"} genre="videó" length="—" />
          </div>
        );
      }
      return <div className="lchip"><i className="ri-drag-drop-line" /> Interaktív gyakorlat (H5P) — a Moodle-változatban érhető el.</div>;
    case "video":
      if (variant !== "videos") return null;
      return <VideoPlanCard v={lesson.videos[b.i]} />;
    case "table":
      return <TableBlock rows={b.rows} />;
    case "callout":
      return <div className="lcallout"><i className="ri-error-warning-line" /><span dangerouslySetInnerHTML={{ __html: b.html }} /></div>;
    default:
      return null;
  }
}

/* ---- Táblázat; a ☐-sorok pipálható ellenőrzőlistává válnak ---- */
function TableBlock({ rows }: { rows: string[][] }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const isChecklist = rows.some((r) => (r[0] ?? "").trim() === "☐");

  if (!isChecklist) {
    return (
      <div className="ltable-wrap">
        <table className="ltable">
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {r.map((c, j) => <td key={j} dangerouslySetInnerHTML={{ __html: c }} />)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const toggle = (i: number) =>
    setChecked((prev) => {
      const s = new Set(prev);
      if (s.has(i)) s.delete(i); else s.add(i);
      return s;
    });

  return (
    <div className="ltable-wrap">
      <table className="ltable check">
        <tbody>
          {rows.map((r, i) => {
            if ((r[0] ?? "").trim() !== "☐") {
              return (
                <tr key={i} className="lth">
                  {r.map((c, j) => <td key={j} dangerouslySetInnerHTML={{ __html: c }} />)}
                </tr>
              );
            }
            const on = checked.has(i);
            return (
              <tr key={i} className={on ? "done" : ""} onClick={() => toggle(i)}>
                <td><input type="checkbox" checked={on} onChange={() => toggle(i)} aria-label="Ellenőrzési pont kipipálása" /></td>
                {r.slice(1).map((c, j) => <td key={j} dangerouslySetInnerHTML={{ __html: c }} />)}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ---- A videós lejátszó kerete "Hamarosan" jelzéssel (tervezett/demó videó) ---- */
function VideoFrame({ title, genre, length }: { title: string; genre: string; length: string }) {
  return (
    <div className="vvideo">
      <span className="vvideo-tag"><i className="ri-play-circle-fill" /> Videós lecke · {genre}</span>
      <div className="vvideo-mock">
        <div className="vvideo-mock-bar"><i /><i /><i /><span>ekr.gov.hu</span></div>
        <div className="vvideo-mock-body"><span className="w1" /><span /><span /><span className="half" /><span className="half" /></div>
      </div>
      <div className="vvideo-play soon" aria-hidden="true"><i className="ri-play-fill" /></div>
      <div className="vvideo-soon"><b>Hamarosan</b><span>A videó gyártás alatt áll</span></div>
      <div className="vvideo-title">{title}</div>
      <div className="vvideo-ctrl">
        <i className="ri-play-line" />
        <i className="ri-volume-up-line" />
        <span className="vvideo-time">0:00 / {length}</span>
        <div className="vvideo-track"><span style={{ width: "0%" }} /></div>
        <span className="vvideo-chip">1.0×</span>
        <i className="ri-closed-captioning-line" />
        <i className="ri-fullscreen-line" />
      </div>
    </div>
  );
}

/* ---- Tervezett videó kártyája: keret + tartalmi leírás ---- */
function VideoPlanCard({ v }: { v: VideoPlan }) {
  if (!v) return null;
  return (
    <div className="vplan">
      <VideoFrame title={v.title} genre={v.genre} length={v.length} />
      <div className="vplan-info">
        <p>{v.desc}</p>
        <div className="vplan-meta">
          <span><i className="ri-movie-2-line" /> {v.genre}</span>
          <span><i className="ri-time-line" /> {v.length}</span>
          <span><i className="ri-closed-captioning-line" /> felirattal készül</span>
          {v.priority && <span className="vplan-prio">{v.priority}. prioritás{v.optional ? " · opcionális" : ""}</span>}
        </div>
      </div>
    </div>
  );
}

/* ---- Egyesített fogalomtár: kereshető szócikklista ---- */
function Glossary({ entries }: { entries: { concept: string; definition: string }[] }) {
  const [q, setQ] = useState("");
  if (!entries.length) {
    return (
      <div className="lcallout info">
        <i className="ri-book-2-line" />
        <span>A fogalomtár szócikkeinek átemelése folyamatban van.</span>
      </div>
    );
  }
  const norm = (s: string) => s.toLowerCase();
  const hits = q.trim()
    ? entries.filter((e) => norm(e.concept).includes(norm(q)) || norm(e.definition).includes(norm(q)))
    : entries;
  return (
    <div className="lgloss">
      <div className="lcallout">
        <i className="ri-error-warning-line" />
        <span>Munkapéldány a tananyag szövege alapján — közzététel előtt közbeszerzési szakjogász általi lektorálás szükséges.</span>
      </div>
      <div className="lgloss-search">
        <i className="ri-search-line" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Keresés a fogalmak között…"
          aria-label="Keresés a fogalomtárban"
        />
        <span className="meta">{hits.length} / {entries.length} szócikk</span>
      </div>
      <dl className="lgloss-list">
        {hits.map((e) => (
          <div className="lgloss-item" key={e.concept}>
            <dt>{e.concept}</dt>
            <dd>{e.definition}</dd>
          </div>
        ))}
      </dl>
      {!hits.length && <p className="meta">Nincs találat a keresésre.</p>}
    </div>
  );
}

/* ---- Beágyazott lecke-kvíz (kis bank, minta nélkül) ---- */
function InlineQuiz({ quiz }: { quiz: LessonQuiz }) {
  return (
    <div className="linlinequiz">
      <QuizBlock
        title="Ellenőrizd a tudásod!"
        intro="Rövid önellenőrző kérdések a leckéhez — az eredmény nem feltétele a továbbhaladásnak."
        quiz={quiz}
        compact
      />
    </div>
  );
}

/* ---- Kvízmotor (Fisher–Yates minta a bankból, kattintásra indul) ---- */
function drawSample(bank: QuizQ[], n: number): QuizQ[] {
  const a = [...bank];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}

function QuizBlock({ title, intro, quiz, onPass, compact }: {
  title: string; intro: string; quiz: LessonQuiz; onPass?: () => void; compact?: boolean;
}) {
  const bank = quiz.questions;
  const sampleN = quiz.sampleSize && quiz.sampleSize < bank.length ? quiz.sampleSize : bank.length;
  const passPct = quiz.passPct ?? 60;
  const [qs, setQs] = useState<QuizQ[]>(bank);
  const [started, setStarted] = useState(false);
  const [qi, setQi] = useState(0);
  const [picks, setPicks] = useState<Set<string>>(new Set());
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const cur = qs[qi];
  const isCorrect = cur ? cur.correct.length === picks.size && cur.correct.every((k) => picks.has(k)) : false;

  const toggle = (key: string) => {
    if (checked) return;
    setPicks((prev) => {
      if (!cur.multi) return new Set([key]);
      const s = new Set(prev);
      if (s.has(key)) s.delete(key); else s.add(key);
      return s;
    });
  };
  const check = () => {
    if (!picks.size) return;
    setChecked(true);
    if (isCorrect) setScore((s) => s + 1);
  };
  const nextQ = () => {
    if (qi + 1 >= qs.length) {
      setFinished(true);
      const pct = Math.round((score / qs.length) * 100);
      if (pct >= passPct) onPass?.();
    } else { setQi((i) => i + 1); setPicks(new Set()); setChecked(false); }
  };
  const begin = () => {
    setQs(drawSample(bank, sampleN));
    setStarted(true); setQi(0); setPicks(new Set()); setChecked(false); setScore(0); setFinished(false);
  };

  if (!started) {
    return (
      <div className={`qintro${compact ? " compact" : ""}`}>
        <div className="qintro-top">
          <span className="qintro-tag"><i className="ri-questionnaire-fill" /> {compact ? "Önellenőrzés" : "Interaktív feladat"}</span>
          <h2 className={compact ? "h4 white" : "h2 white"}>{title}</h2>
          <p className="qintro-desc">{intro}</p>
          <div className="qintro-badges">
            <span><i className="ri-list-check-2" /> {sampleN} kérdés</span>
            <span><i className="ri-time-line" /> ~ {Math.max(2, sampleN)} perc</span>
            {!compact && <span><i className="ri-flag-line" /> Sikeres: {passPct}%+</span>}
            {sampleN < bank.length && <span><i className="ri-shuffle-line" /> véletlen válogatás {bank.length} kérdésből</span>}
          </div>
        </div>
        <div className="qintro-foot">
          <p className="meta"><i className="ri-flashlight-line" /> Minden kérdésnél azonnali, indoklással kísért visszajelzést kapsz.</p>
          <button className="btn btn-primary" onClick={begin}><i className="ri-play-fill" /> Kvíz indítása</button>
        </div>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((score / qs.length) * 100);
    const pass = pct >= passPct;
    return (
      <div className={`qresult ${pass ? "pass" : "fail"}`}>
        <div className="qresult-ico"><i className={pass ? "ri-checkbox-circle-fill" : "ri-error-warning-fill"} /></div>
        <h2 className="h3">{pass ? "Sikeres teljesítés!" : "Majdnem megvan!"}</h2>
        <p className="qresult-score">{score} / {qs.length} helyes · {pct}%</p>
        <p className="body">{pass
          ? (compact ? "Szép munka — a lecke anyaga ül." : "Teljesítetted a modulzáró tesztet. A lecke készként megjelölve.")
          : `A sikeres teljesítéshez ${passPct}% szükséges. Nézd át a leckéket, és próbáld újra!`}</p>
        <button className="btn btn-outline" onClick={begin}><i className="ri-restart-line" /> Újrapróbálom {sampleN < bank.length ? "(új kérdésekkel)" : ""}</button>
      </div>
    );
  }

  return (
    <div className="qcard">
      <div className="qcard-top">
        <span className="qcard-idx">Kérdés {qi + 1} / {qs.length}</span>
        <div className="qcard-bar"><span style={{ width: `${((qi + (checked ? 1 : 0)) / qs.length) * 100}%` }} /></div>
      </div>
      <p className="qcard-q">{cur.q}</p>
      {cur.multi && <p className="meta" style={{ marginBottom: "var(--space-300)" }}><i className="ri-checkbox-multiple-line" /> Több helyes válasz is lehet!</p>}
      <div className="qcard-opts">
        {cur.options.map((o) => {
          const isPick = picks.has(o.key);
          const isOk = cur.correct.includes(o.key);
          let cls = "qopt";
          if (checked && isOk) cls += " ok";
          else if (checked && isPick) cls += " no";
          else if (isPick) cls += " sel";
          return (
            <button key={o.key} className={cls} disabled={checked} onClick={() => toggle(o.key)}>
              <span className="qopt-key">{o.key.toUpperCase()}</span>
              <span>{o.label}</span>
              {checked && isOk && <i className="ri-check-line" />}
              {checked && isPick && !isOk && <i className="ri-close-line" />}
            </button>
          );
        })}
      </div>
      {checked && (
        <div className={`qfb ${isCorrect ? "ok" : "no"}`}>
          <i className={isCorrect ? "ri-checkbox-circle-fill" : "ri-error-warning-fill"} />
          <span>{isCorrect ? cur.ok : cur.no}</span>
        </div>
      )}
      <div className="qcard-foot">
        <span className="meta">{checked ? "" : picks.size ? "Ellenőrizd a válaszod" : cur.multi ? "Jelöld be az összes helyes választ" : "Válassz egy lehetőséget"}</span>
        {checked
          ? <button className="btn btn-primary" onClick={nextQ}>{qi + 1 >= qs.length ? "Eredmény" : "Következő kérdés"} <i className="ri-arrow-right-line" /></button>
          : <button className="btn btn-primary" disabled={!picks.size} onClick={check}><i className="ri-check-line" /> Ellenőrzés</button>}
      </div>
    </div>
  );
}
