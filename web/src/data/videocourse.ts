// Kurált videós kurzus-szerkezet (a design szerint: 5 szekció · 21 lecke, kevert videó/kvíz).
export type QuizQ = { q: string; options: { key: string; label: string }[]; correct: string; ok: string; no: string };
export type VLesson = {
  id: string;
  name: string;
  type: "video" | "quiz";
  duration?: string; // videóhoz
  questions?: number; // kvízhez
  desc: string;
  learn?: string[];
  quiz?: QuizQ[];
  quizIntro?: string;
  passPct?: number;
};
export type VSection = { key: string; num: string; title: string; lessons: VLesson[] };

const Q_EKR: QuizQ[] = [
  {
    q: "Az alábbiak közül melyik érhető el az EKR-ben regisztráció NÉLKÜL is?",
    options: [
      { key: "a", label: "Ajánlat benyújtása" },
      { key: "b", label: "Nyilvános eljárások és hirdetmények keresése" },
      { key: "c", label: "Szervezethez tartozó jogosultságok kiosztása" },
    ],
    correct: "b",
    ok: "Így van — a nyilvános eljárások és hirdetmények regisztráció nélkül böngészhetők.",
    no: "A helyes válasz: a nyilvános eljárások és hirdetmények keresése.",
  },
  {
    q: "Mikortól kötelező főszabály szerint az EKR használata a közbeszerzési eljárásokban?",
    options: [
      { key: "a", label: "2018. április 15-étől" },
      { key: "b", label: "2016. november 1-jétől" },
      { key: "c", label: "2020. január 1-jétől" },
    ],
    correct: "a",
    ok: "Helyes! 2018. április 15-étől kötelező.",
    no: "Nem pontos — a helyes válasz: 2018. április 15.",
  },
  {
    q: "Mi szükséges az EKR-ben ajánlat benyújtásához?",
    options: [
      { key: "a", label: "Regisztráció és belépés" },
      { key: "b", label: "Csak a nyitóoldal megnyitása" },
      { key: "c", label: "Semmilyen azonosítás" },
    ],
    correct: "a",
    ok: "Így van — regisztráció és belépés is szükséges.",
    no: "A helyes válasz: regisztráció és belépés.",
  },
];

const v = (id: string, name: string, duration: string, desc: string, learn?: string[]): VLesson => ({ id, name, type: "video", duration, desc, learn });
const q = (id: string, name: string, questions: number, quizIntro: string, quiz: QuizQ[]): VLesson => ({
  id, name, type: "quiz", questions, desc: quizIntro, quizIntro, quiz, passPct: 60,
});

export const videoCourse: { title: string; sections: VSection[] } = {
  title: "Közbeszerzési szakmai tananyag",
  sections: [
    {
      key: "0", num: "B", title: "Bevezető szekció",
      lessons: [
        v("b1", "Képzésbevezető — a projekt és a kurzus célja", "6:12", "A képzés felépítése, céljai és az, hogyan segít a mindennapi ügyintézésben.", ["A kurzus felépítése és tanulási útvonal", "Az oklevél megszerzésének feltételei"]),
        q("b2", "Belépési tudásszint-felmérő kérdőív", 4, "Rövid felmérő, hogy testre szabhassuk a tanulási utat. Nincs jó vagy rossz válasz.", Q_EKR.slice(0, 2)),
      ],
    },
    {
      key: "1", num: "1", title: "Az EKR alapjai",
      lessons: [
        v("e1", "Mi az az EKR?", "8:40", "Az Elektronikus Közbeszerzési Rendszer szerepe, a nyilvános és a bejelentkezést igénylő felületek.", ["Mi az EKR és mire használjuk", "Regisztráció nélkül elérhető funkciók"]),
        v("e2", "Regisztráció és jogosultságok", "11:20", "Személyes fiók létrehozása, szervezet regisztrációja és a szervezethez való csatlakozás lépésről lépésre. Bemutatjuk az EKR-es szerepköröket (pl. ajánlatszerkesztő, szuper user) és azok kiosztását.", ["Személyes fiók és szervezeti regisztráció menete", "Szerepkörök és jogosultságok kiosztása", "Elfelejtett jelszó kezelése"]),
        v("e3", "Tájékozódás az EKR-ben", "7:35", "Az eljárások keresése, az érdeklődés jelzése és a dokumentumok letöltése a felületen.", ["Eljárások és hirdetmények keresése", "Érdeklődés jelzése egy eljárásnál"]),
        q("e4", "Modulzáró — interaktív ellenőrző teszt", 3, "Az 1. hét anyagát lefedő interaktív ellenőrző teszt: EKR-felület, regisztráció, jogosultságok és a kommunikációs alapok.", Q_EKR),
      ],
    },
    {
      key: "2", num: "2", title: "Ajánlattétel a gyakorlatban",
      lessons: [
        v("a1", "Ajánlat összeállítása lépésről lépésre", "9:10", "Gazdasági szereplők rögzítése és az ajánlat felépítése az EKR-ben.", ["Gazdasági szereplők rögzítése", "Az ajánlat szerkezete"]),
        v("a2", "Elektronikus űrlapok és dokumentumok", "8:05", "Az elektronikus űrlapok kitöltése, dokumentumok feltöltése, EEKD és felolvasólap.", ["Űrlapok kitöltése", "Dokumentumok feltöltése"]),
        v("a3", "Sablonok használata az EKR-ben", "5:40", "Sablonok létrehozása és újrahasznosítása a gyorsabb ajánlatkészítéshez.", ["Sablonok mentése és használata"]),
        v("a4", "Ajánlat benyújtása és visszavonása", "7:20", "A benyújtás menete, az ajánlati kötöttség és a visszavonás/módosítás lehetőségei.", ["Ajánlat benyújtása", "Visszavonás és módosítás"]),
        q("a5", "Modulzáró kvíz", 3, "A 2. modul anyagát lefedő ellenőrző kérdések az ajánlattételről.", Q_EKR),
      ],
    },
    {
      key: "3", num: "3", title: "Szerződések teljesítése",
      lessons: [
        v("sz1", "A szerződés teljesítésének szakaszai", "6:30", "A teljesítés főbb lépései és a kapcsolódó kötelezettségek.", ["Teljesítési szakaszok áttekintése"]),
        v("sz2", "Teljesítésigazolás az EKR-ben", "5:50", "A teljesítésigazolás kiállítása és kezelése a felületen.", ["Teljesítésigazolás menete"]),
        v("sz3", "Szerződésmódosítás kezelése", "7:10", "Mikor és hogyan módosítható a szerződés; a dokumentáció kezelése.", ["Szerződésmódosítás feltételei"]),
        v("sz4", "Kifizetések és dokumentáció", "6:05", "A kifizetésekhez kapcsolódó dokumentumok és nyilvántartás.", ["Kifizetési dokumentáció"]),
        q("sz5", "Modulzáró kvíz", 3, "A 3. modul anyagát lefedő ellenőrző kérdések a teljesítésről.", Q_EKR),
      ],
    },
    {
      key: "4", num: "4", title: "Jogorvoslat",
      lessons: [
        v("j1", "A jogorvoslat alapjai", "8:15", "A jogorvoslat célja, szereplői és alapfogalmai.", ["Mi a jogorvoslat és mikor van rá lehetőség"]),
        v("j2", "Előzetes vitarendezés", "6:40", "Az előzetes vitarendezési kérelem benyújtása az EKR-ben.", ["Előzetes vitarendezés menete"]),
        v("j3", "A jogorvoslati eljárás menete", "9:25", "A Közbeszerzési Döntőbizottság előtti eljárás lépései.", ["A jogorvoslati eljárás szakaszai"]),
        v("j4", "Jogkövetkezmények és költségek", "5:35", "A lehetséges jogkövetkezmények és az eljárási költségek.", ["Jogkövetkezmények", "Eljárási költségek"]),
        q("j5", "Záró kvíz", 4, "A teljes anyagot lefedő záró ellenőrző teszt.", Q_EKR),
      ],
    },
  ],
};

/* ---- segédfüggvények ---- */
export type FlatV = VLesson & { sectionKey: string; sectionTitle: string; index: number };
export function flatV(): FlatV[] {
  const out: FlatV[] = [];
  let i = 0;
  for (const s of videoCourse.sections)
    for (const l of s.lessons) out.push({ ...l, sectionKey: s.key, sectionTitle: s.title, index: i++ });
  return out;
}
export function findV(id: string) { return flatV().find((l) => l.id === id); }
export function siblingsV(id: string) {
  const all = flatV();
  const i = all.findIndex((l) => l.id === id);
  return { prev: i > 0 ? all[i - 1] : undefined, next: i >= 0 && i < all.length - 1 ? all[i + 1] : undefined };
}
export const firstVideoLessonId = videoCourse.sections[0].lessons[0].id;
export const totalVLessons = flatV().length;
/** Alap demó-állapot: az első 3 lecke kész (14%). */
export const defaultDone = ["b1", "b2", "e1"];
