"use client";
import { useState } from "react";
import Quiz from "./Quiz";
import type { FlatLesson, Quiz as QuizT } from "@/lib/course";

const TABS = [
  { key: "attekintes", label: "Áttekintés", icon: "ri-file-list-2-line" },
  { key: "forrasok", label: "Források", icon: "ri-folder-3-line" },
  { key: "atirat", label: "Átirat", icon: "ri-double-quotes-l" },
  { key: "jegyzet", label: "Jegyzeteim", icon: "ri-sticky-note-line" },
];

export default function VideoStage({
  lesson,
  quiz,
  contentHtml,
}: {
  lesson: FlatLesson;
  quiz: QuizT;
  contentHtml?: string | null;
}) {
  const [tab, setTab] = useState("attekintes");
  const [playing, setPlaying] = useState(false);
  const [notes, setNotes] = useState("");
  const paras = lesson.paragraphs.length ? lesson.paragraphs : [
    "Ebben a videóban az EKR kapcsolódó felületét mutatjuk be a valós rendszeren, magyar felirattal.",
  ];

  return (
    <div className="vstage">
      {/* Videó */}
      <div className="video">
        {lesson.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="video-poster" src={lesson.image} alt="" />
        )}
        <button className={`video-play ${playing ? "playing" : ""}`} onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Szünet" : "Lejátszás"}>
          <i className={playing ? "ri-pause-fill" : "ri-play-fill"} />
        </button>
        <div className="video-bar">
          <i className={playing ? "ri-pause-line" : "ri-play-line"} onClick={() => setPlaying((p) => !p)} style={{ cursor: "pointer" }} />
          <div className="video-track"><span style={{ width: playing ? "34%" : "0%" }} /></div>
          <span className="video-time">04:12 / {String(lesson.durationMin).padStart(2, "0")}:00</span>
          <span className="video-chip">1.0×</span>
          <i className="ri-closed-captioning-line" title="Magyar felirat" />
          <i className="ri-fullscreen-line" />
        </div>
      </div>

      {/* Cím + meta */}
      <div className="vmeta">
        <h1 className="h4">{lesson.num}. {lesson.shortTitle}</h1>
        <div className="vmeta-row">
          <span><i className="ri-user-star-line" /> Előadó: KKV Képzés oktatói csapat</span>
          <span><i className="ri-closed-captioning-line" /> Magyar felirat</span>
          <span><i className="ri-time-line" /> {lesson.durationMin} perc</span>
        </div>
      </div>

      {/* Fülek */}
      <div className="vtabs">
        {TABS.map((t) => (
          <button key={t.key} className={tab === t.key ? "on" : ""} onClick={() => setTab(t.key)}>
            <i className={t.icon} /> {t.label}
          </button>
        ))}
      </div>

      <div className="vtab-body">
        {tab === "attekintes" && (
          <>
            <h5 className="h5" style={{ marginBottom: "var(--space-300)" }}>Mit tanulsz meg ebben a videóban</h5>
            <p className="body" style={{ marginBottom: "var(--space-500)" }}>
              {lesson.shortTitle} — gyakorlati bemutató az EKR valós felületén, magyar felirattal.
              A részletes, kereshető szöveget az <b>Átirat</b> fülön találod.
            </p>
            <Quiz quiz={quiz} embedded />
          </>
        )}
        {tab === "forrasok" && (
          <ul className="reslist">
            <li><i className="ri-file-pdf-2-line" /> <span>Vázlatos olvasmány – {lesson.shortTitle}</span> <em>PDF · 240 kB</em></li>
            <li><i className="ri-image-line" /> <span>Képernyőfotó-csomag a leckéhez</span> <em>ZIP · 1,2 MB</em></li>
            <li><i className="ri-links-line" /> <span>EKR – kapcsolódó felület</span> <em>ekr.gov.hu</em></li>
          </ul>
        )}
        {tab === "atirat" && (
          contentHtml ? (
            <div className="moodle-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />
          ) : (
            <div className="transcript">
              {paras.map((p, i) => (
                <p key={i}><em>{String(Math.floor(i * 1.5)).padStart(2, "0")}:{String((i * 37) % 60).padStart(2, "0")}</em> {p}</p>
              ))}
            </div>
          )
        )}
        {tab === "jegyzet" && (
          <div className="notes">
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Írd ide a jegyzeteidet ehhez a leckéhez…" />
            <p className="meta"><i className="ri-lock-line" /> A jegyzeteid ehhez a leckéhez tartoznak, és csak neked láthatók.</p>
          </div>
        )}
      </div>
    </div>
  );
}
