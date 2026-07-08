// Demó-mód (DEMO_LOREM=1): determinisztikus magyar VAKSZÖVEG-transzformáció.
// A szöveg helyére semleges, önmagát helykitöltőként azonosító magyar mondatok
// kerülnek, az eredetihez közeli hosszban — így a tipográfia és a tördelés a
// valódi tartalommal azonos képet ad, de egyértelmű, hogy a szöveg nem végleges.

export const DEMO_LOREM = process.env.DEMO_LOREM === "1";

// Mondatkészlet hosszú szövegekhez (bekezdések, leírások)
const SENTENCES = [
  "Ez a bekezdés helykitöltő vakszöveg, a végleges tananyag szakmai és jogi lektorálás után kerül a helyére.",
  "A vakszöveg célja, hogy a tipográfia, a sortávolságok és a tördelés a valódi tartalommal azonos képet adjon.",
  "A mintaszöveg nem hordoz tartalmi jelentést, kizárólag a szövegkép megítélését szolgálja.",
  "A bekezdések hossza és ritmusa a készülő tananyagot követi, így az oldal képe életszerű marad.",
  "A kiemelések, felsorolások és hivatkozások helye a végleges változatban is itt lesz.",
  "Az itt olvasható sorok a felület véleményezéséhez készültek.",
  "A szakaszok tagolása a szerkesztői mesterpéldány szerkezetét tükrözi.",
  "A végleges szövegezés a lektorálás lezárultáig még változhat.",
  "Minden fejezethez ábrák, gyakorlati példák és önellenőrző kérdések tartoznak majd.",
  "A helykitöltő mondatok ismétlődhetnek, ez a próbanézet természetes velejárója.",
  "A képernyőképek és videók helyét semleges minták jelölik.",
  "A gombok, menük és visszajelzések működése a végleges felülettel megegyezik.",
];

// Rövid készlet címekhez, feliratokhoz, válaszlehetőségekhez
const PHRASES = [
  "Helykitöltő cím",
  "Mintaszakasz",
  "Vakszöveg-fejezet",
  "Próbanézeti alcím",
  "Helykitöltő szövegrész",
  "Minta megnevezés",
  "Vakszöveges mintaelem",
  "Minta válaszlehetőség",
  "Helykitöltő felirat",
  "Mintaszöveg",
  "Helykitöltő fejezetcím a próbanézethez",
  "Mintaszakasz a felület véleményezéséhez",
  "Vakszöveges cím a tördelés bemutatásához",
  "Helykitöltő megnevezés a szövegkép teszteléséhez",
];

function seedOf(s: string): number {
  let h = s.length;
  for (let i = 0; i < Math.min(s.length, 32); i++) h = (h * 31 + s.charCodeAt(i)) % 100003;
  return h;
}

/** A célhosszhoz illő elem a készletből — a tűrésen belüliek közül a seed választ,
    hogy az azonos hosszúságú szövegek ne mindig ugyanazt a mintát kapják. */
function bestFit(pool: string[], target: number, seed: number): string {
  const tolerance = Math.max(10, target * 0.4);
  const close = pool.filter((p) => Math.abs(p.length - target) <= tolerance);
  if (close.length) return close[seed % close.length];
  let best = pool[0];
  let bestDiff = Math.abs(best.length - target);
  for (const cand of pool) {
    const diff = Math.abs(cand.length - target);
    if (diff < bestDiff) { best = cand; bestDiff = diff; }
  }
  return best;
}

/** Egy szöveg (HTML nélkül) vakszövegesítése az eredetihez közeli hosszban. */
export function loremText(s: string): string {
  const target = s.trim().length;
  if (target === 0) return s;
  let seed = seedOf(s);

  // rövid szöveg (cím, felirat, opció): egyetlen illő kifejezés
  if (target < 75) {
    let out = bestFit(PHRASES, target, seed);
    if (/^[a-záéíóöőúüű]/.test(s.trim())) out = out.charAt(0).toLowerCase() + out.slice(1);
    return out;
  }

  // hosszú szöveg: mondatokból építkezünk a célhosszig
  const parts: string[] = [];
  let len = 0;
  while (len < target - 20) {
    const next = bestFit(SENTENCES, Math.min(target - len, 110), seed);
    parts.push(next);
    len += next.length + 1;
    seed = (seed * 7 + 13) % 100003;
  }
  if (parts.length === 0) parts.push(SENTENCES[seed % SENTENCES.length]);
  return parts.join(" ");
}

/** HTML-tartalom vakszövegesítése: csak a címkéken kívüli szövegrészek cserélődnek. */
export function loremHtml(html: string): string {
  return html.replace(/>([^<]+)</g, (_, txt: string) =>
    ">" + (txt.trim() ? loremText(txt) : txt) + "<"
  ).replace(/^([^<]+)/, (m) => (m.trim() ? loremText(m) : m));
}

/** Demó-módban vakszövegesített, egyébként változatlan szöveg (UI-szövegekhez). */
export function demoText(s: string): string {
  return DEMO_LOREM ? loremText(s) : s;
}
