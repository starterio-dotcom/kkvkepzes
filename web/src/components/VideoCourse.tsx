"use client";
import { useState } from "react";
import Link from "next/link";
import {
  videoCourse, findV, siblingsV, totalVLessons, defaultDone,
  type FlatV, type QuizQ,
} from "@/data/videocourse";
import { useStoredSet } from "@/lib/useStoredSet";

const LS_KEY = "kkv_done";
const RES = ["ri-file-pdf-2-line", "ri-image-line"];

export default function VideoCourse({ activeId }: { activeId: string }) {
  const lesson = findV(activeId) as FlatV;
  const { prev, next } = siblingsV(activeId);

  const [done, markDone] = useStoredSet(LS_KEY, defaultDone);

  const donePct = Math.round((done.size / totalVLessons) * 100);
  const doneCount = done.size;

  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(videoCourse.sections.map((s) => [s.key, s.key === lesson.sectionKey]))
  );

  return (
    <>
      {/* Al-fejléc */}
      <div className="vtop">
        <div className="container-wide vtop-inner">
          <div className="vtop-left">
            <Link href="/kurzusok" className="vtop-back"><i className="ri-arrow-left-line" /> Vissza a kurzushoz</Link>
            <div className="vtop-title">
              <span className="vtop-eyebrow">Videós kurzus</span>
              <b>{videoCourse.title}</b>
            </div>
          </div>
          <div className="vtop-prog">
            <div className="vtop-prog-txt"><b>{donePct}% teljesítve</b><span>{doneCount} / {totalVLessons} lecke</span></div>
            <Ring pct={donePct} />
          </div>
        </div>
      </div>

      <div className="vcourse">
        {/* Oldalsáv */}
        <aside className="vside">
          <div className="vside-head">
            <div className="vside-head-row"><span>Kurzus tartalma</span><b>{donePct}%</b></div>
            <div className="bar"><span style={{ width: `${donePct}%` }} /></div>
            <p className="meta">{videoCourse.sections.length} szekció · {totalVLessons} lecke</p>
          </div>
          <div className="vside-scroll">
            {videoCourse.sections.map((s) => {
              const secDone = s.lessons.filter((l) => done.has(l.id)).length;
              const secTotal = s.lessons.length;
              const complete = secDone === secTotal;
              const hasActive = s.lessons.some((l) => l.id === activeId);
              const isOpen = open[s.key];
              return (
                <div className={`vsec${complete ? " done" : ""}${hasActive ? " current" : ""}`} key={s.key}>
                  <button className="vsec-head" onClick={() => setOpen((o) => ({ ...o, [s.key]: !o[s.key] }))} aria-expanded={isOpen}>
                    <span className="vsec-badge">{complete ? <i className="ri-check-line" /> : s.num}</span>
                    <span className="vsec-info">
                      <b>{s.title}</b>
                      <span className="vsec-prog">
                        <span className="vsec-bar"><span style={{ width: `${(secDone / secTotal) * 100}%` }} /></span>
                        <em>{secDone} / {secTotal} kész</em>
                      </span>
                    </span>
                    <i className={isOpen ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"} />
                  </button>
                  {isOpen && (
                    <ul className="vsec-lessons">
                      {s.lessons.map((l) => {
                        const st = done.has(l.id) ? "done" : l.id === activeId ? "active" : "todo";
                        return (
                          <li key={l.id} className={st}>
                            <Link href={`/videos/tanulas/${l.id}`}>
                              <span className="vl-ico"><i className={
                                st === "done" ? "ri-checkbox-circle-fill"
                                : st === "active" ? "ri-pause-circle-fill"
                                : l.type === "quiz" ? "ri-questionnaire-line" : "ri-play-circle-line"
                              } /></span>
                              <span className="vl-txt">
                                <b>{l.name}</b>
                                <em>{l.type === "video" ? `Videó · ${l.duration}` : `Kvíz · ${l.questions} kérdés`}</em>
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
            <i className={lesson.type === "quiz" ? "ri-questionnaire-line" : "ri-play-circle-line"} />
            <span>{lesson.sectionTitle}</span><span className="sep">·</span>
            <span className="meta">{lesson.type === "quiz" ? "Interaktív feladat" : "Videós lecke"}</span>
          </nav>

          {lesson.type === "video"
            ? <VideoBlock key={lesson.id} lesson={lesson} isDone={done.has(lesson.id)} onDone={() => markDone(lesson.id)} />
            : <QuizBlock key={lesson.id} lesson={lesson} onPass={() => markDone(lesson.id)} />}

          <div className="vnav">
            {prev ? (
              <Link href={`/videos/tanulas/${prev.id}`} className="vnav-card prev">
                <span className="vnav-lbl"><i className="ri-arrow-left-line" /> Előző</span>
                <b>{prev.name}</b>
              </Link>
            ) : <span />}
            {next ? (
              <Link href={`/videos/tanulas/${next.id}`} className="vnav-card next">
                <span className="vnav-lbl">Következő <i className="ri-arrow-right-line" /></span>
                <b>{next.name}</b>
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

/* ---- Haladás-gyűrű (SVG) ---- */
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

/* ---- Videó lecke ---- */
const TABS = [
  { key: "attekintes", label: "Áttekintés", icon: "ri-file-list-2-line" },
  { key: "forrasok", label: "Források", icon: "ri-folder-3-line", badge: 2 },
  { key: "atirat", label: "Átirat", icon: "ri-double-quotes-l" },
  { key: "jegyzet", label: "Jegyzeteim", icon: "ri-sticky-note-line" },
];
function VideoBlock({ lesson, isDone, onDone }: { lesson: FlatV; isDone: boolean; onDone: () => void }) {
  const [tab, setTab] = useState("attekintes");
  const [playing, setPlaying] = useState(false);
  const [notes, setNotes] = useState("");
  return (
    <>
      <div className="vvideo">
        <span className="vvideo-tag"><i className="ri-play-circle-fill" /> Videós lecke · képernyős bemutató</span>
        <div className="vvideo-mock">
          <div className="vvideo-mock-bar"><i /><i /><i /><span>ekr.gov.hu</span></div>
          <div className="vvideo-mock-body"><span className="w1" /><span /><span /><span className="half" /><span className="half" /></div>
        </div>
        <button className={`vvideo-play${playing ? " on" : ""}`} onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Szünet" : "Lejátszás"}>
          <i className={playing ? "ri-pause-fill" : "ri-play-fill"} />
        </button>
        <div className="vvideo-title">{lesson.name}</div>
        <div className="vvideo-ctrl">
          <i className={playing ? "ri-pause-line" : "ri-play-line"} onClick={() => setPlaying((p) => !p)} style={{ cursor: "pointer" }} />
          <i className="ri-volume-up-line" />
          <span className="vvideo-time">0:00 / {lesson.duration}</span>
          <div className="vvideo-track"><span style={{ width: playing ? "22%" : "0%" }} /></div>
          <span className="vvideo-chip">1.0×</span>
          <i className="ri-closed-captioning-line" />
          <i className="ri-fullscreen-line" />
        </div>
      </div>

      <div className="vmeta-row">
        <div className="vmeta-title">
          <h1 className="h3">{lesson.name}</h1>
          <div className="vmeta-sub">
            <span><i className="ri-time-line" /> {lesson.duration}</span>
            <span><i className="ri-user-star-line" /> Előadó: KKV Képzés oktatói csapat</span>
            <span><i className="ri-closed-captioning-line" /> Magyar felirat</span>
          </div>
        </div>
        <button className={`btn btn-sm mark${isDone ? " marked" : " btn-outline"}`} onClick={onDone} disabled={isDone}>
          <i className={isDone ? "ri-checkbox-circle-fill" : "ri-check-line"} /> {isDone ? "Kész" : "Megjelölöm késznek"}
        </button>
      </div>

      <div className="vtabs">
        {TABS.map((t) => (
          <button key={t.key} className={tab === t.key ? "on" : ""} onClick={() => setTab(t.key)}>
            <i className={t.icon} /> {t.label}{t.badge ? <span className="vtab-badge">{t.badge}</span> : null}
          </button>
        ))}
      </div>
      <div className="vtab-body">
        {tab === "attekintes" && (
          <>
            <p className="body" style={{ marginBottom: "var(--space-500)" }}>{lesson.desc}</p>
            <h5 className="vlearn-h">Mit tanulsz meg ebben a videóban</h5>
            <ul className="vlearn">
              {(lesson.learn ?? []).map((x, i) => <li key={i}><i className="ri-checkbox-circle-fill" /> {x}</li>)}
            </ul>
          </>
        )}
        {tab === "forrasok" && (
          <ul className="reslist">
            <li><i className={RES[0]} /> <span>Vázlatos olvasmány – {lesson.name}</span> <em>PDF · 240 kB</em></li>
            <li><i className={RES[1]} /> <span>Képernyőfotó-csomag a leckéhez</span> <em>ZIP · 1,2 MB</em></li>
          </ul>
        )}
        {tab === "atirat" && <p className="body">{lesson.desc}</p>}
        {tab === "jegyzet" && (
          <div className="notes">
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Írd ide a jegyzeteidet ehhez a leckéhez…" />
            <p className="meta"><i className="ri-lock-line" /> A jegyzeteid ehhez a leckéhez tartoznak, és csak neked láthatók.</p>
          </div>
        )}
      </div>
    </>
  );
}

/* ---- Kvíz / interaktív feladat ---- */
// Véletlen minta a kérdésbankból (Fisher–Yates keverés + levágás).
function drawSample(bank: QuizQ[], n: number): QuizQ[] {
  const a = [...bank];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}

function QuizBlock({ lesson, onPass }: { lesson: FlatV; onPass: () => void }) {
  const bank: QuizQ[] = lesson.quiz ?? [];
  const sampleN = lesson.sampleSize && lesson.sampleSize < bank.length ? lesson.sampleSize : bank.length;
  const [quiz, setQuiz] = useState<QuizQ[]>(bank);
  const [started, setStarted] = useState(false);
  const [qi, setQi] = useState(0);
  const [picks, setPicks] = useState<Set<string>>(new Set());
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const cur = quiz[qi];
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
    if (qi + 1 >= quiz.length) {
      setFinished(true);
      const pct = Math.round((score / quiz.length) * 100);
      if (pct >= (lesson.passPct ?? 60)) onPass();
    } else { setQi((i) => i + 1); setPicks(new Set()); setChecked(false); }
  };
  // Indítás/újrapróbálás: minden nekifutás ÚJ véletlen mintát húz a bankból.
  // Csak kattintásra fut (hidratálás után), így nincs SSR-eltérés.
  const begin = () => {
    setQuiz(drawSample(bank, sampleN));
    setStarted(true); setQi(0); setPicks(new Set()); setChecked(false); setScore(0); setFinished(false);
  };

  if (!started) {
    return (
      <div className="qintro">
        <div className="qintro-top">
          <span className="qintro-tag"><i className="ri-questionnaire-fill" /> Interaktív feladat</span>
          <h1 className="h2 white">{lesson.name}</h1>
          <p className="qintro-desc">{lesson.quizIntro}</p>
          <div className="qintro-badges">
            <span><i className="ri-list-check-2" /> {sampleN} kérdés</span>
            <span><i className="ri-time-line" /> ~ {Math.max(2, sampleN)} perc</span>
            <span><i className="ri-flag-line" /> Sikeres: {lesson.passPct ?? 60}%+</span>
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
    const pct = Math.round((score / quiz.length) * 100);
    const pass = pct >= (lesson.passPct ?? 60);
    return (
      <div className={`qresult ${pass ? "pass" : "fail"}`}>
        <div className="qresult-ico"><i className={pass ? "ri-checkbox-circle-fill" : "ri-error-warning-fill"} /></div>
        <h2 className="h3">{pass ? "Sikeres teljesítés!" : "Majdnem megvan!"}</h2>
        <p className="qresult-score">{score} / {quiz.length} helyes · {pct}%</p>
        <p className="body">{pass ? "Teljesítetted a modulzáró tesztet. A lecke készként megjelölve." : `A sikeres teljesítéshez ${lesson.passPct ?? 60}% szükséges. Nézd át a leckéket, és próbáld újra!`}</p>
        <button className="btn btn-outline" onClick={begin}><i className="ri-restart-line" /> Újrapróbálom {sampleN < bank.length ? "(új kérdésekkel)" : ""}</button>
      </div>
    );
  }

  return (
    <div className="qcard">
      <div className="qcard-top">
        <span className="qcard-idx">Kérdés {qi + 1} / {quiz.length}</span>
        <div className="qcard-bar"><span style={{ width: `${((qi + (checked ? 1 : 0)) / quiz.length) * 100}%` }} /></div>
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
          ? <button className="btn btn-primary" onClick={nextQ}>{qi + 1 >= quiz.length ? "Eredmény" : "Következő kérdés"} <i className="ri-arrow-right-line" /></button>
          : <button className="btn btn-primary" disabled={!picks.size} onClick={check}><i className="ri-check-line" /> Ellenőrzés</button>}
      </div>
    </div>
  );
}
