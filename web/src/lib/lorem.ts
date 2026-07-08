// Demó-mód (DEMO_LOREM=1): determinisztikus, hossz-tartó lorem ipsum transzformáció.
// A szó-alakot (hossz, kezdőbetű-nagyság, írásjelek) megőrzi, így a tipográfia és a
// tördelés a valódi tartalommal azonos képet ad — a szöveg maga viszont semleges.
// Tiszta számok (évszám, ár) változatlanok maradnak; a HTML-címkék érintetlenek.

export const DEMO_LOREM = process.env.DEMO_LOREM === "1";

const WORDS = (
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor " +
  "incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud " +
  "exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure " +
  "in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur " +
  "sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim " +
  "id est laborum perspiciatis unde omnis iste natus error voluptatem accusantium"
).split(" ");

// szavak hossz szerint csoportosítva, a hossz-tartó cseréhez
const BY_LEN = new Map<number, string[]>();
for (const w of WORDS) {
  const arr = BY_LEN.get(w.length) ?? [];
  arr.push(w);
  BY_LEN.set(w.length, arr);
}

function pick(len: number, seed: number): string {
  for (let l = len; l >= 2; l--) {
    const arr = BY_LEN.get(l);
    if (arr) return arr[seed % arr.length];
  }
  return "lorem";
}

/** Egy szöveg (HTML nélkül) loremizálása. Determinisztikus, SSR-biztos. */
export function loremText(s: string): string {
  let seed = 0;
  return s.replace(/[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű0-9]+/g, (w) => {
    if (/^\d+$/.test(w)) return w; // tiszta szám marad
    seed += w.length;
    let out = pick(Math.min(w.length, 14), seed);
    while (out.length < w.length) {
      seed++;
      out += " " + pick(Math.min(w.length - out.length - 1, 14), seed);
      if (out.length >= w.length) break;
    }
    if (/^[A-ZÁÉÍÓÖŐÚÜŰ]/.test(w)) out = out.charAt(0).toUpperCase() + out.slice(1);
    return out;
  });
}

/** HTML-tartalom loremizálása: csak a címkéken kívüli szövegrészek cserélődnek. */
export function loremHtml(html: string): string {
  return html.replace(/>([^<]+)</g, (_, txt) => ">" + loremText(txt) + "<")
    .replace(/^([^<]+)/, (m) => loremText(m));
}

/** Demó-módban loremizált, egyébként változatlan szöveg (UI-szövegekhez). */
export function demoText(s: string): string {
  return DEMO_LOREM ? loremText(s) : s;
}
