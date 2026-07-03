"use client";
import { useState } from "react";
import type { Quiz as QuizT } from "@/lib/course";

export default function Quiz({ quiz, embedded = false }: { quiz: QuizT; embedded?: boolean }) {
  const [pick, setPick] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const correct = pick === quiz.correct;

  return (
    <div className={embedded ? "quiz quiz-embedded" : "quiz"}>
      <div className="quiz-label">
        <i className="ri-question-line" /> {embedded ? "Beágyazott ellenőrző kérdés" : "Ellenőrizd a tudásod"}
      </div>
      <p className="quiz-q">{quiz.question}</p>
      <div className="quiz-opts">
        {quiz.options.map((o) => {
          const isPick = pick === o.key;
          let cls = "quiz-opt";
          if (checked && o.key === quiz.correct) cls += " ok";
          else if (checked && isPick) cls += " no";
          else if (isPick) cls += " sel";
          return (
            <button key={o.key} className={cls} onClick={() => !checked && setPick(o.key)} disabled={checked}>
              <span className="quiz-key">{o.key.toUpperCase()}</span>
              <span>{o.label}</span>
              {checked && o.key === quiz.correct && <i className="ri-check-line" />}
              {checked && isPick && o.key !== quiz.correct && <i className="ri-close-line" />}
            </button>
          );
        })}
      </div>
      {!checked ? (
        <button className="btn btn-primary btn-sm" disabled={!pick} onClick={() => setChecked(true)}>
          Ellenőrzés
        </button>
      ) : (
        <div className={correct ? "quiz-fb ok" : "quiz-fb no"}>
          <i className={correct ? "ri-checkbox-circle-fill" : "ri-error-warning-fill"} />
          <span>{correct ? quiz.ok : quiz.no}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => { setChecked(false); setPick(null); }}>
            Újrapróbálom
          </button>
        </div>
      )}
    </div>
  );
}
