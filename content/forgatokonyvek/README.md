# Screencast-forgatókönyvek — top 3 videó

A videógyártási javaslat (`content/videogyartasi_javaslat.docx`) szerinti első gyártási
kör forgatókönyvei. **A forgatás csak a jogi lektor által jóváhagyott forgatókönyv
birtokában indulhat** — a lektorálás tárgya ez a három dokumentum.

| Prio | Forgatókönyv | Klipek | Összhossz | Lecke |
|------|--------------|--------|-----------|-------|
| 2. | [Ajánlat összeállítása és benyújtása végigjátszva](modul-2-ajanlat-benyujtas.md) | 4 | 8–10 perc | 2.6–2.7 |
| 3. | [Hirdetményfigyelés beállítása](modul-1-hirdetmenyfigyeles.md) | 1 | 3–4 perc | 1.6 |
| 4. | [Hiánypótlás megválaszolása](modul-3-hianypotlas.md) | 1 | 4–5 perc | 3.2 |

## Közös gyártási irányelvek (a videógyártási javaslatból)

- **Szigorúan rendszerhasználat.** A narráció EKR-műveletet mutat be; jogi állítás,
  jogszabályhely, törvényi határidő NEM hangzik el — a jogi hátteret a lecke szövege
  adja. Így Kbt.-módosítás nem, csak EKR-felületváltás kényszerít újraforgatásra.
- **Demókörnyezet.** Felvétel az EKR nyilvános/oktató felületén, kitalált cégadatokkal.
  Egységes fiktív szereplők (az esettanulmány-fonálhoz igazítva):
  - Ajánlattevő: **Fenyves Kert Kft.** (fiktív), kapcsolattartó: **Kovács Éva** (fiktív)
  - Eljárás: **„Parkfenntartási szolgáltatás 2027" – Zöldliget Város Önkormányzata** (fiktív)
  - Valós eljárás, valós cégadat, valós személyes adat NEM kerülhet képernyőre.
- **Rövid, cselekményenként külön klip** — felületváltásnál csak az érintett klip
  forgatandó újra.
- **Archiválandó** videónként: forgatókönyv, narrációs szöveg, nyers felvétel, projektfájl.
- **Felirat** minden videóhoz a narrációs szövegből; a lecke oldalán rövid szöveges
  összefoglaló (a forgatókönyvek tartalmazzák).
- **H5P interakciós pontok** a forgatókönyvben előre jelölve (videóba ágyazott
  ellenőrző kérdések, a meglévő gyakorlat szerint).
- **Elnevezés** az új modulszámozás szerint: `modul-2-video-ajanlat-benyujtas-1.mp4` stb.
- **Narráció** egységesen önöző formában (a tananyag szövegével összhangban);
  tempó ~130 szó/perc, rövid mondatok, a kattintás előtt hangzik el, mit fogunk tenni.
- **Képi ajánlás:** 1920×1080, böngésző 100%-os nagyítás, kurzor-kiemelés bekapcsolva,
  kattintás-effekt; a kitakarandó (üres) területekre nem zoomolunk.

## Munkafolyamat

1. Jogi lektorálás (narrációs szövegek + képernyőn megjelenő fiktív adatok) → jóváhagyás
2. Forgatás a demókörnyezetben, klipenként
3. Vágás + felirat (narrációból) + H5P-kérdéspontok felvitele
4. Fájlnév-konvenció szerinti mentés, archiválás
5. Bekötés a webes tananyagba: a kész videó (YouTube vagy mp4) azonosítóját a
   `web/src/data/h5p-media.json`-hoz hasonló módon a videóterv-kártya helyére kötjük
   (fejlesztői lépés, ~perc)
