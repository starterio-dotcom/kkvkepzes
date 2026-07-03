# KKV Képzés – Moodle oktatási platform (headless)

Közbeszerzési / KKV szakmai képzési platform. A **publikus arculat** le van választva
a Moodle-ról: a látogatók egy modern, szabadon formálható fronton érkeznek, a tényleges
tanulást a **Moodle 5.2** motor szolgálja ki. A kettőt **egységes belépés (SSO)** köti össze.

---

## Stack

| Komponens | Verzió / image | Megjegyzés |
|-----------|----------------|------------|
| Moodle    | 5.2.1 (Build 20260608) | Forrás: `moodle/` (git, `v5.2.1`) – **nincs verziózva** |
| PHP/Apache| `moodlehq/moodle-php-apache:8.4-bookworm` | Docroot: `moodle/public/` |
| Adatbázis | `mariadb:11.4` | utf8mb4 |
| Frontend  | *(készül – Claude Design)* | Külön app, headless |

> **Moodle 5.x újdonság:** a webgyökér a `public/` alkönyvtár, a `config.php` a Moodle
> gyökerében van (`moodle/config.php`). Ezért `APACHE_DOCUMENT_ROOT=/var/www/html/public`.

---

## Indítás

```bash
cp .env.example .env      # töltsd ki a jelszavakat (nálunk már kész: .env)
docker compose up -d
```

Elérés: **http://localhost:8080** — admin: `admin` (jelszó a `.env`-ben).

### Hasznos parancsok

```bash
docker compose ps
docker compose logs -f moodle
docker compose exec -u www-data moodle php admin/cli/cron.php     # cron kézzel
docker compose exec -u www-data moodle php admin/cli/purge_caches.php
```

> **Windows / Git Bash figyelmeztetés:** a Moodle CLI abszolút útvonalas kapcsolóit
> (`--dataroot=/…`, `--file=/…`) a Git Bash átírja Windows-úttá. Ezért a telepítő/restore
> parancsokat `MSYS_NO_PATHCONV=1` előtaggal futtasd.

---

## Újratelepítés nulláról (referencia)

```bash
# 1) DB tiszta
docker compose exec -u root db mariadb -uroot -p"$DB_ROOT_PASSWORD" \
  -e "DROP DATABASE IF EXISTS moodle; CREATE DATABASE moodle DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; GRANT ALL ON moodle.* TO 'moodle'@'%';"

# 2) Telepítés
MSYS_NO_PATHCONV=1 docker compose exec -u www-data moodle php admin/cli/install.php \
  --lang=en --wwwroot=http://localhost:8080 --dataroot=/var/www/moodledata \
  --dbtype=mariadb --dbhost=db --dbname=moodle --dbuser=moodle --dbpass="$DB_PASSWORD" \
  --fullname="KKV Kepzes" --shortname="kkvkepzes" \
  --adminuser=admin --adminpass="$MOODLE_ADMIN_PASS" --adminemail="$MOODLE_ADMIN_EMAIL" \
  --non-interactive --agree-license
```

## Backup visszaállítás (.mbz)

A `backups/course-3.mbz` (Moodle 4.5-ben készült mentés) új kurzusként áll vissza:

```bash
MSYS_NO_PATHCONV=1 docker compose exec -u www-data moodle \
  php admin/cli/restore_backup.php --file=/backups/course-3.mbz --categoryid=1
```

---

## Teljesítmény (fontos!)

A `moodle/` forrás **Windows bind mount**-ként van becsatolva → a fájlrendszer lassú.
Ellensúlyozás a `docker/php-overrides.ini`-ben: nagy **OPcache** (256M, 20000 fájl) +
realpath cache. Hidegen az első oldalbetöltés lassú (~3–25s), **melegen ~0,6s**.

Ha éles/gyorsabb kell: a Moodle kódot érdemes named volume-ba vagy image-be tenni
(bind mount helyett), vagy a repót a WSL2 fájlrendszerére költöztetni.

---

## Több verzió párhuzamos bemutatása (több példány)

Minden Moodle-példány a saját `wwwroot`-jához (porthoz) van kötve, ezért két verziót
**külön, izolált stackként** kell futtatni. A compose paraméterezett: `MOODLE_PORT`,
`MOODLE_SRC` (kódkönyvtár), és a projektnév (`-p`) különbözteti meg őket. Így külön a
**kód (`config.php`!)**, az **adatbázis** és a **`moodledata`** is – nem keverednek.

| Példány | Projekt (`-p`) | Env | Kód | Port |
|---------|----------------|-----|-----|------|
| A (alap)| `kkvkepzes`    | `.env`   | `./moodle`   | 8080 |
| B       | `kkvkepzes_b`  | `.env.b` | `./moodle-b` | 8081 |

Kezelés a `scripts/instance.sh`-val:

```bash
# GYORS: 'a' tartalmának független másolata 'b'-be (azonos verzió, ~perc)
scripts/instance.sh bootstrap-clone b a

# FRISS: teljesen új példány saját telepítéssel (lassú ~30-40p a bind mount miatt)
scripts/instance.sh bootstrap-fresh b            # vagy más verzió: bootstrap-fresh b v5.1.5
scripts/instance.sh restore b                    # opcionális: ugyanaz a tananyag

scripts/instance.sh up b | down b | ps b | logs b
```

Preview-ból: a `moodle-b` konfig indítja (8081). Emlékeztető: mindig szabad porttal
(`scripts/instance.sh down b` előbb, ha „port in use").

---

## Publikus frontend (`web/`) — headless, DÁP arculat

Next.js 16 (App Router, TS) app a `web/` mappában, a **DÁP (Digitális Állampolgárság
Program) design rendszerrel**. A tananyagot a `design/uploads/course-archive-v4.json`-ból
tölti (feldolgozva `web/src/data/course.json`-ba; képek `web/public/course/img/`).

```bash
cd web && npm install && npm run dev     # http://localhost:3000
```

Két bemutató verzió, ugyanarra a tananyagra:

| Verzió | Útvonal | Kurzus-élmény | Kártya CTA |
|--------|---------|----------------|------------|
| **Hagyományos** | `/hagyomanyos` | kurzus-fa + szöveg/kép/lépések + kvíz | „Beiratkozom" |
| **Videós (Coursera)** | `/videos` | videólejátszó + fülek (áttekintés/források/átirat/jegyzet) + beágyazott kvíz | „Videós kurzus indítása" |

A `/` egy választó a két verzió között; a fejlécben verzióváltó is van.

### Élő adat: Moodle Web Services (REST)

A frontend a kurzus **szerkezetét élőben** a Moodle WS-ből húzza (`core_course_get_contents`),
**szerver-oldalról** (nincs CORS, a token nem kerül a kliensbe). A lecke-törzsszöveg a
`course.json` cache-ből merge-elődik (szám-prefix alapján). Ha a Moodle/token nem elérhető,
automatikus **statikus fallback** (a landingen „Élő Moodle adat" / „Gyorsítótár" jelző mutatja).

Beállítás (`web/.env.local`, nem verziózott):
```
MOODLE_URL=http://localhost:8080
MOODLE_WS_TOKEN=<token>
MOODLE_COURSE_ID=2
```

A token egyszeri létrehozása a Moodle-ban (WS + REST + `kkv_headless` szolgáltatás + admin token):
Site administration → Server → Web services, **vagy** CLI-ből egy bootstrap PHP-scripttel
(`external_generate_token(EXTERNAL_TOKEN_PERMANENT, $serviceid, $adminid, ...)`).

**Élő lecke-tartalom:** a lecke-oldalak teljes HTML-je a `mod_lesson_get_pages`-ből jön
(sanitizálva: `<script>`/`<iframe>`/inline stílusok ki). A tartalomban lévő Moodle-képek egy
**szerver-oldali proxyn** (`/api/mfile`) át töltenek, a WS tokennel — a token nem kerül a kliensbe.

### Ügyfélkapu+ SSO (egységes belépés)

A tanulási oldalak (`/*/tanulas/*`) **belépéshez kötöttek**: belépés nélkül átirányítás a
`/belepes` (KAÜ-stílusú) oldalra, `vissza` paraméterrel; belépés után visszairányít a leckéhez.
A session httpOnly cookie-ban (`web/src/lib/auth.ts`), a belépés szerver-action.

> **Bemutató:** a valódi Ügyfélkapu+ (KAÜ) helyett **szimulált** belépés. Éles rendszerben
> OIDC/SAML federáció (Keycloak → KAÜ), a Moodle pedig `auth_oauth2`-vel ugyanahhoz az IdP-hez.

**Verifikálva:** `next build` (TypeScript + lint) hibátlan; élő WS, kép-proxy, SSO-folyamat működik.

---

## Headless architektúra (terv)

```
        ┌─────────────────┐        ┌──────────────────┐
Látogató│  Publikus front  │  SSO   │   IdP (Keycloak) │
───────▶│  (Next.js/Astro) │◀──────▶│   OAuth2 / OIDC  │
        └────────┬─────────┘        └────────┬─────────┘
                 │ Web Services REST          │ OAuth2 login
                 │ (katalógus, haladás)       ▼
                 │                    ┌──────────────────┐
                 └───────────────────▶│   Moodle 5.2     │
                     tanulás / kurzus │   (LMS motor)    │
                                      └──────────────────┘
```

- **Publikus front:** külön app (a most készülő Claude Design alapján). Marketing,
  landing, kurzuskatalógus – szabadon formálható. Adatot a Moodle **Web Services REST**
  API-ból húz (pl. `core_course_get_courses_by_field`).
- **Moodle:** a tényleges tanulás (kurzustartalom, kvízek, haladáskövetés, tanúsítvány).
- **Egységes belépés:** közös **IdP** (pl. Keycloak) elé kötve; a Moodle `auth_oauth2`
  pluginnel ugyanahhoz az IdP-hez hitelesít → a felhasználó egyszer lép be.
- **Beágyazás/átadás:** kurzusindítás LTI 1.3-mal vagy közös session/aldomainnel.

*A pontos domain- és SSO-stratégiát a design megérkezése után véglegesítjük.*
