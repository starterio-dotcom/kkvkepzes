"use client";
import { useState } from "react";
import type { Quiz as QuizT } from "@/lib/course";

// A lecke H5P-ből kinyert kvíze: kérdésenkénti ellenőrzéssel, több helyes
// válaszos (checkbox) kérdésekkel, a végén összesített eredménnyel.
export default function Quiz({ quiz }: { quiz: QuizT }) {
  const [qi, setQi] = useState(0);
  const [picks, setPicks] = useState<Set<string>>(new Set());
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const qs = quiz.questions;
  const cur = qs[qi];
  const isCorrect = cur.correct.length === picks.size && cur.correct.every((k) => picks.has(k));

  const toggle = (key: string) => {
    if (checked) return;
    setPicks((prev) => {
      if (!cur.multi) return new Set([key]);
      const s = new Set(prev);
      if (s.has(key)) s.delete(key); else s.add(key);
      return s;
    });
  };
  const check = () => { setChecked(true); if (isCorrect) setScore((s) => s + 1); };
  const next = () => {
    if (qi + 1 >= qs.length) setFinished(true);
    else { setQi((i) => i + 1); setPicks(new Set()); setChecked(false); }
  };
  const restart = () => { setQi(0); setPicks(new Set()); setChecked(false); setScore(0); setFinished(false); };

  if (finished) {
    const pct = Math.round((score / qs.length) * 100);
    const pass = pct >= quiz.passPct;
    return (
      <div className="quiz">
        <div className="quiz-label"><i className="ri-question-line" /> Ellenőrizd a tudásod</div>
        <p className="quiz-q">{pass ? "Sikeres teljesítés!" : "Majdnem megvan!"}</p>
        <div className={pass ? "quiz-fb ok" : "quiz-fb no"}>
          <i className={pass ? "ri-checkbox-circle-fill" : "ri-error-warning-fill"} />
          <span>{score} / {qs.length} helyes ({pct}%) — a sikerhez {quiz.passPct}% szükséges.</span>
          <button className="btn btn-ghost btn-sm" onClick={restart}>Újrapróbálom</button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz">
      <div className="quiz-label">
        <i className="ri-question-line" /> Ellenőrizd a tudásod · {qi + 1} / {qs.length}. kérdés
      </div>
      <p className="quiz-q">{cur.q}</p>
      {cur.multi && <p className="meta" style={{ marginBottom: "var(--space-300)" }}><i className="ri-checkbox-multiple-line" /> Több helyes válasz is lehet!</p>}
      <div className="quiz-opts">
        {cur.options.map((o) => {
          const isPick = picks.has(o.key);
          const isOk = cur.correct.includes(o.key);
          let cls = "quiz-opt";
          if (checked && isOk) cls += " ok";
          else if (checked && isPick) cls += " no";
          else if (isPick) cls += " sel";
          return (
            <button key={o.key} className={cls} onClick={() => toggle(o.key)} disabled={checked}>
              <span className="quiz-key">{o.key.toUpperCase()}</span>
              <span>{o.label}</span>
              {checked && isOk && <i className="ri-check-line" />}
              {checked && isPick && !isOk && <i className="ri-close-line" />}
            </button>
          );
        })}
      </div>
      {!checked ? (
        <button className="btn btn-primary btn-sm" disabled={picks.size === 0} onClick={check}>
          Ellenőrzés
        </button>
      ) : (
        <div className={isCorrect ? "quiz-fb ok" : "quiz-fb no"}>
          <i className={isCorrect ? "ri-checkbox-circle-fill" : "ri-error-warning-fill"} />
          <span>{isCorrect ? cur.ok : cur.no}</span>
          <button className="btn btn-ghost btn-sm" onClick={next}>
            {qi + 1 >= qs.length ? "Eredmény" : "Következő kérdés"}
          </button>
        </div>
      )}
    </div>
  );
}
