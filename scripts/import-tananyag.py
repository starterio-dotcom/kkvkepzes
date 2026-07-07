# -*- coding: utf-8 -*-
"""
Tananyag-import: a szerkesztői mesterpéldány (docx) + segédletek → strukturált JSON.

Bemenetek:
  content/kozbeszerzesi_tananyag_mesterpeldany_videokkal.docx  (törzsanyag + videótervek)
  content/segedlet_*.docx                                       (3 modul-segédlet)
  web/src/data/course-pages.json   (régi leckék HTML-je → képcsoportok átmappelése)
  web/src/data/quizzes.json        (régi H5P-kvízbank → lecke- és modulzáró kvízek)
  backups/course-3.mbz             (Moodle-mentés → egyesített fogalomtár)

Kimenetek:
  web/src/data/tananyag.json       (modulok / leckék / tartalomblokkok / kvízek / videótervek)
  web/src/data/segedletek.json     (segédletek strukturáltan)
  content/import-report.md         (szerkesztői jegyzetek, mappelési hiányok, statisztika)

Futtatás:  python scripts/import-tananyag.py
"""
import json
import re
import sys
import tarfile
import zipfile
from datetime import datetime, timezone
from html import escape
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

MASTER = ROOT / "content" / "kozbeszerzesi_tananyag_mesterpeldany_videokkal.docx"
SEGEDLETEK = [
    ("ajanlat-ellenorzolista", "m2", ROOT / "content" / "segedlet_ajanlat_ellenorzolista.docx"),
    ("hianypotlasi-gyorssegedlet", "m3", ROOT / "content" / "segedlet_hianypotlasi_gyorssegedlet.docx"),
    ("jogorvoslati-dontesi-fa", "m5", ROOT / "content" / "segedlet_jogorvoslati_dontesi_fa.docx"),
]
PAGES = ROOT / "web" / "src" / "data" / "course-pages.json"
QUIZZES = ROOT / "web" / "src" / "data" / "quizzes.json"
H5P_MEDIA = ROOT / "web" / "src" / "data" / "h5p-media.json"
MBZ = ROOT / "backups" / "course-3.mbz"
OUT_TANANYAG = ROOT / "web" / "src" / "data" / "tananyag.json"
OUT_SEGEDLET = ROOT / "web" / "src" / "data" / "segedletek.json"
OUT_REPORT = ROOT / "content" / "import-report.md"

# Háttérszín → dobozfajta a mesterpéldányban
FILL_IMG = "E8EEF7"      # kék: képernyőkép helye
FILL_H5P = "E2F0E4"      # zöld: H5P interaktív elem
FILL_THINK = "F2F2F2"    # szürke: "Gondolja végig!"
FILL_NOTE = "FFF3C4"     # sárga: szerkesztői jegyzet
FILL_VIDEO = "F3E5F5"    # lila: gyártandó videó

URL_RE = re.compile(r"(https?://[^\s<>\"]+[^\s<>\".,;:!?)])")


# ---------------------------------------------------------------- docx alapok

def load_numbering(z):
    """numId → 'ordered'|'bullet' (az ilvl=0 numFmt alapján)."""
    try:
        xml = z.read("word/numbering.xml")
    except KeyError:
        return {}
    root = ET.fromstring(xml)
    abstract = {}
    for an in root.findall(W + "abstractNum"):
        aid = an.get(W + "abstractNumId")
        fmt = "bullet"
        lvl0 = an.find(W + "lvl")
        if lvl0 is not None:
            nf = lvl0.find(W + "numFmt")
            if nf is not None and nf.get(W + "val") in ("decimal", "lowerLetter", "upperLetter", "lowerRoman", "upperRoman"):
                fmt = "ordered"
        abstract[aid] = fmt
    mapping = {}
    for num in root.findall(W + "num"):
        nid = num.get(W + "numId")
        ref = num.find(W + "abstractNumId")
        if ref is not None:
            mapping[nid] = abstract.get(ref.get(W + "val"), "bullet")
    return mapping


def runs_to_html(p):
    """Futamok → HTML (félkövér/dőlt megtartva, URL-ek linkelve)."""
    parts = []
    for r in p.iter(W + "r"):
        text = "".join(t.text or "" for t in r.findall(W + "t"))
        if not text:
            if r.find(W + "br") is not None:
                parts.append("<br/>")
            continue
        rpr = r.find(W + "rPr")
        bold = ital = False
        if rpr is not None:
            b = rpr.find(W + "b")
            i = rpr.find(W + "i")
            bold = b is not None and b.get(W + "val") != "0" and b.get(W + "val") != "false"
            ital = i is not None and i.get(W + "val") != "0" and i.get(W + "val") != "false"
        h = escape(text)
        if bold:
            h = f"<strong>{h}</strong>"
        if ital:
            h = f"<em>{h}</em>"
        parts.append(h)
    html = "".join(parts)
    # egymást követő azonos formázású futamok összefésülése
    html = html.replace("</strong><strong>", "").replace("</em><em>", "")
    html = URL_RE.sub(r'<a href="\1" target="_blank" rel="noopener">\1</a>', html)
    return html


def para_info(p, numbering):
    """Egy w:p → (style, fill, leftBorder, listKind, text, html)."""
    ppr = p.find(W + "pPr")
    style = fill = None
    left = False
    list_kind = None
    if ppr is not None:
        st = ppr.find(W + "pStyle")
        if st is not None:
            style = st.get(W + "val")
        shd = ppr.find(W + "shd")
        if shd is not None:
            fill = shd.get(W + "fill")
        pbdr = ppr.find(W + "pBdr")
        if pbdr is not None and pbdr.find(W + "left") is not None:
            left = True
        npr = ppr.find(W + "numPr")
        if npr is not None:
            nid = npr.find(W + "numId")
            list_kind = numbering.get(nid.get(W + "val") if nid is not None else None, "bullet")
    text = "".join(t.text or "" for t in p.iter(W + "t")).strip()
    return style, fill, left, list_kind, text, runs_to_html(p)


def iter_paragraphs(path):
    with zipfile.ZipFile(path) as z:
        numbering = load_numbering(z)
        root = ET.fromstring(z.read("word/document.xml"))
        body = root.find(W + "body")
        for child in body:
            tag = child.tag.replace(W, "")
            if tag == "p":
                yield ("p",) + para_info(child, numbering)
            elif tag == "tbl":
                rows = []
                for tr in child.findall(W + "tr"):
                    cells = []
                    for tc in tr.findall(W + "tc"):
                        cell_html = " ".join(
                            h for h in (runs_to_html(p) for p in tc.findall(W + "p")) if h
                        ).strip()
                        cell_text = " ".join(
                            "".join(t.text or "" for t in p.iter(W + "t")).strip()
                            for p in tc.findall(W + "p")
                        ).strip()
                        cells.append({"html": cell_html, "text": cell_text})
                    rows.append(cells)
                yield ("tbl", None, None, False, None, "", rows)


# ------------------------------------------------------- mesterpéldány-parser

RE_MODULE = re.compile(r"^(\d)\. modul\s*–\s*(.+)$")
RE_LESSON = re.compile(r"^(\d)\.(\d+)\s+(.+)$")
RE_CASE = re.compile(r"^Esettanulmány\s*–\s*(\d)\. fejezet\s*–\s*(.+?)(?:\s*\((?:a|az)\s.+\))?$")
RE_MODQUIZ = re.compile(r"^(?:Önellenőrzés – modulzáró kvíz|Ismétlőkérdések)\s*\((\d)\. modul")
RE_SRC = re.compile(r"korábbi\s+([IVX]+)\.(\d+)")
RE_VIDEO = re.compile(
    r"^🎬\s*GYÁRTANDÓ VIDEÓ\s*·\s*(?P<title>.+?)\s*\((?P<flags>[^)]*)\)\s*·\s*"
    r"(?P<genre>[^,]+),\s*(?P<len>[\d–\-]+\s*perc)\s*[–\-]\s*(?P<desc>.+)$"
)
RE_H5P = re.compile(r"Interaktív\s+(videó|kvíz|elem\s*\(H5P\)):\s*([\w\-\.]+\.h5p)")
RE_QHEAD = re.compile(r"^(\d+)\. kérdés\s*–\s*(.+)$")
RE_QOPT = re.compile(r"^([A-F])\)\s*(✔\s*)?(.+)$")


def parse_master(path, report):
    modules = []
    cur_mod = None
    cur_lesson = None
    seen_h1 = False

    def new_module(key, num, title):
        nonlocal cur_mod, cur_lesson
        cur_mod = {"key": key, "num": num, "title": title, "intro": [], "lessons": []}
        modules.append(cur_mod)
        cur_lesson = None

    def new_lesson(lid, num, title, kind):
        nonlocal cur_lesson
        cur_lesson = {
            "id": lid, "num": num, "title": title, "kind": kind,
            "objectives": [], "sourceRefs": [], "blocks": [], "videos": [],
        }
        cur_mod["lessons"].append(cur_lesson)

    raw = []  # (lesson vagy modul-intro cél, para-adatok)
    for item in iter_paragraphs(path):
        if item[0] == "tbl":
            continue  # a mesterpéldányban nincs táblázat
        _, style, fill, left, list_kind, text, html = item
        if not text:
            continue

        if style == "Heading1":
            seen_h1 = True
            m = RE_MODULE.match(text)
            if m:
                new_module(f"m{m.group(1)}", m.group(1), m.group(2))
            elif text.startswith("Általános rész"):
                new_module("alt", None, "Általános rész")
            elif text.startswith("Átfogó lecke"):
                new_module("atfogo", None, "Átfogó lecke – Integritás a közbeszerzésben")
                new_lesson("int", None, "Integritás a közbeszerzésben", "lecke")
            elif text.startswith("Egyesített fogalomtár"):
                new_module("fogalomtar", None, "Egyesített fogalomtár")
                new_lesson("fog", None, "Egyesített fogalomtár", "fogalomtar")
            else:
                report["notes"].append(f"Ismeretlen H1: {text}")
            continue
        if not seen_h1:
            continue  # elöljáró rész (címlap, jelmagyarázat)

        if style == "Heading2":
            m = RE_LESSON.match(text)
            if m:
                new_lesson(f"{m.group(1)}.{m.group(2)}", f"{m.group(1)}.{m.group(2)}", m.group(3), "lecke")
                continue
            m = RE_CASE.match(text)
            if m:
                new_lesson(f"e{m.group(1)}", None, f"Esettanulmány – {m.group(2)}", "esettanulmany")
                continue
            m = RE_MODQUIZ.match(text)
            if m:
                new_lesson(f"mz{m.group(1)}", None, "Modulzáró kvíz", "modulzaro")
                continue
            if text.startswith("Képzésbevezető"):
                new_lesson("kb", None, "Képzésbevezető", "lecke")
                continue
            if text.startswith("Forrásszöveg"):
                # az átfogó lecke belső alcíme marad
                cur_lesson["blocks"].append({"t": "h", "level": 3, "text": text})
                continue
            report["notes"].append(f"Ismeretlen H2: {text}")
            new_lesson(re.sub(r"\W+", "-", text.lower())[:24], None, text, "lecke")
            continue

        target = cur_lesson["blocks"] if cur_lesson else cur_mod["intro"]

        if style == "Heading3":
            target.append({"t": "h", "level": 3, "text": text})
            continue
        if fill == FILL_NOTE or text.startswith("✎"):
            where = cur_lesson["id"] if cur_lesson else (cur_mod["key"] if cur_mod else "?")
            report["editorial"].append((where, text.lstrip("✎ ").strip()))
            continue
        if fill == FILL_VIDEO or text.startswith("🎬"):
            m = RE_VIDEO.match(text)
            flags = (m.group("flags") if m else "").upper()
            video = {
                "title": m.group("title") if m else text[:80],
                "priority": int(re.search(r"(\d)\. priorit", flags.lower()).group(1)) if m and re.search(r"(\d)\. priorit", flags.lower()) else None,
                "optional": "OPCION" in flags,
                "refresh": "FRISSÍTÉS" in flags,
                "genre": m.group("genre").strip() if m else "",
                "length": m.group("len").strip() if m else "",
                "desc": m.group("desc").strip() if m else text,
            }
            cur_lesson["videos"].append(video)
            target.append({"t": "video", "i": len(cur_lesson["videos"]) - 1})
            continue
        if fill == FILL_IMG or text.startswith("🖼"):
            label = re.sub(r"^🖼\s*\[[^\]]*\]\s*", "", text)
            label = re.sub(r"\s*[–\-]\s*a megtekintéshez kattintson ide!?\s*$", "", label).strip()
            target.append({"t": "imgph", "label": label})
            continue
        if fill == FILL_H5P or text.startswith("▶"):
            m = RE_H5P.search(text)
            if m:
                kind = {"videó": "video", "kvíz": "kviz"}.get(m.group(1), "interaktiv")
                target.append({"t": "h5p", "kind": kind, "file": m.group(2)})
            else:
                report["notes"].append(f"H5P doboz nem értelmezhető: {text[:90]}")
            continue
        if fill == FILL_THINK:
            target.append({"t": "_think_raw", "html": html, "text": text})
            continue
        if text.startswith("◈"):
            if cur_lesson is not None:
                for rm in RE_SRC.finditer(text):
                    ref = f"{rm.group(1)}.{rm.group(2)}"
                    if ref not in cur_lesson["sourceRefs"]:
                        cur_lesson["sourceRefs"].append(ref)
            continue
        if left and cur_lesson is not None:
            target.append({"t": "transition", "html": html})
            continue
        if list_kind:
            target.append({"t": "_li", "kind": list_kind, "html": html, "text": text})
            continue
        target.append({"t": "p", "html": html, "text": text})

    # utófeldolgozás leckénként
    for mod in modules:
        mod["intro"] = " ".join(b.get("text", "") for b in mod["intro"] if b.get("t") == "p").strip()
        for lesson in mod["lessons"]:
            lesson["blocks"] = post_blocks(lesson, report)
    return modules


def post_blocks(lesson, report):
    """Listák/gondolkodtatók csoportosítása, tanulási célok kiemelése, kvíz-parse."""
    blocks = []
    objectives_mode = False
    for b in lesson["blocks"]:
        if b["t"] == "p" and re.match(r"^A lecke végére Ön képes lesz", b.get("text", "")):
            objectives_mode = True
            continue
        if b["t"] == "_li":
            if objectives_mode:
                lesson["objectives"].append(b["html"])
                continue
            if blocks and blocks[-1]["t"] == "list" and blocks[-1]["ordered"] == (b["kind"] == "ordered"):
                blocks[-1]["items"].append(b["html"])
            else:
                blocks.append({"t": "list", "ordered": b["kind"] == "ordered", "items": [b["html"]]})
            continue
        objectives_mode = False
        if b["t"] == "_think_raw":
            if blocks and blocks[-1]["t"] == "think":
                blocks[-1]["items"].append(b["html"])
            else:
                title = b["text"] if len(b["text"]) < 40 else "Gondolja végig!"
                items = [] if len(b["text"]) < 40 else [b["html"]]
                blocks.append({"t": "think", "title": title, "items": items})
            continue
        blocks.append(b)

    if lesson["kind"] == "modulzaro":
        lesson["parsedQuiz"] = parse_quiz_blocks(blocks, report, lesson["id"])
        blocks = [b for b in blocks if b["t"] not in ("p", "list")]
    return blocks


def parse_quiz_blocks(blocks, report, where):
    """A dokumentumban kiírt kvízkérdések (0. modul) QuizQ formátumra."""
    # a válaszopciók listaelemként érkezhetnek — kilapítjuk a sorokat
    lines = []
    for b in blocks:
        if b["t"] == "p":
            lines.append(b.get("text", ""))
        elif b["t"] == "list":
            lines.extend(RE_TAGS.sub("", it) for it in b["items"])
    questions = []
    cur = None
    for text in lines:
        m = RE_QHEAD.match(text)
        if m:
            cur = {"q": "", "options": [], "correct": [], "multi": False, "ok": "", "no": "", "_title": m.group(2)}
            questions.append(cur)
            continue
        if cur is None:
            continue
        m = RE_QOPT.match(text)
        if m:
            key = m.group(1).lower()
            label = m.group(3).strip()
            cur["options"].append({"key": key, "label": label})
            if m.group(2):
                cur["correct"].append(key)
            continue
        # betűjel nélküli opciók: igaz/hamis, ill. ✔-pipával jelölt helyes válasz
        m = re.match(r"^(✔\s*)?(Igaz|Hamis)\.?$", text)
        if m:
            key = chr(ord("a") + len(cur["options"]))
            cur["options"].append({"key": key, "label": m.group(2)})
            if m.group(1):
                cur["correct"].append(key)
            continue
        if text.startswith("Magyarázat"):
            expl = re.sub(r"^Magyarázat:\s*", "", text)
            cur["ok"] = "Helyes! " + expl
            good = ", ".join(o["label"] for o in cur["options"] if o["key"] in cur["correct"])
            cur["no"] = f"A helyes válasz: {good}. {expl}"
            continue
        if not cur["options"]:
            cur["q"] = (cur["q"] + " " + text).strip()
    for q in questions:
        q["multi"] = len(q["correct"]) > 1
        if not q["q"]:
            q["q"] = q.pop("_title", "")
        else:
            q.pop("_title", None)
        if not q["correct"]:
            report["notes"].append(f"{where}: kvízkérdés helyes válasz nélkül: {q['q'][:60]}")
    return questions


# ------------------------------------------------------------- képek mappelése

RE_DETAILS = re.compile(r"<details[^>]*>.*?</details>", re.S)
RE_SUMMARY = re.compile(r"<summary[^>]*>(.*?)</summary>", re.S)
RE_IMG = re.compile(r"<img[^>]*src=\"([^\"]+)\"[^>]*>")
RE_TAGS = re.compile(r"<[^>]+>")


def old_lesson_image_groups(pages_data, ref):
    """Egy régi lecke képcsoportjai dokumentum-sorrendben.

    Egy csoport = egy <details> lenyíló összes képe, VAGY egy lenyílón kívüli
    önálló kép. A modul-kezdőképeket (fájlnévben "kezdo") kihagyjuk.
    """
    lesson = pages_data["lessons"].get(ref)
    if not lesson:
        return []
    html = "".join(pg["contents"] for pg in lesson["pages"])
    groups = []
    pos = 0
    for det in RE_DETAILS.finditer(html):
        # a lenyíló ELŐTTI önálló képek
        for m in RE_IMG.finditer(html, pos, det.start()):
            if "kezdo" not in m.group(1).lower():
                groups.append({"srcs": [m.group(1)], "caption": ""})
        srcs = [s for s in RE_IMG.findall(det.group(0)) if "kezdo" not in s.lower()]
        if srcs:
            summ = RE_SUMMARY.search(det.group(0))
            caption = RE_TAGS.sub("", summ.group(1)).strip() if summ else ""
            caption = re.sub(r"\s*[–\-]?\s*a?\s*(megtekintéshez|vonatkozó[^!]*)?\s*kattintson ide!?\s*$", "", caption, flags=re.I).strip(" -–")
            groups.append({"srcs": srcs, "caption": caption})
        pos = det.end()
    for m in RE_IMG.finditer(html, pos):
        if "kezdo" not in m.group(1).lower():
            groups.append({"srcs": [m.group(1)], "caption": ""})
    return groups


def map_images(modules, report):
    pages_data = json.loads(PAGES.read_text(encoding="utf-8"))
    used = {}  # régi lecke → hány csoportot fogyasztottak már el belőle
    for mod in modules:
        for lesson in mod["lessons"]:
            phs = [b for b in lesson["blocks"] if b["t"] == "imgph"]
            if not phs:
                continue
            # csak annyi csoportot veszünk el forrásonként, amennyi hely van,
            # így az ugyanarra a régi leckére hivatkozó KÖVETKEZŐ új lecke
            # a maradékot kapja (a mesterpéldány sorrendje követi a régi sorrendet)
            needed = len(phs)
            groups = []
            for ref in lesson["sourceRefs"]:
                if needed <= 0:
                    break
                g = old_lesson_image_groups(pages_data, ref)
                start = used.get(ref, 0)
                take = g[start:start + needed]
                used[ref] = start + len(take)
                groups.extend(take)
                needed -= len(take)
            for i, ph in enumerate(phs):
                if i < len(groups):
                    ph["t"] = "img"
                    ph["srcs"] = groups[i]["srcs"]
                    if not ph.get("label"):
                        ph["label"] = groups[i]["caption"]
                else:
                    report["unmapped"].append((lesson["id"], ph.get("label", "?")))

    # riport: mely régi leckék képcsoportjai maradtak felhasználatlanul
    for ref, lesson in pages_data["lessons"].items():
        total = len(old_lesson_image_groups(pages_data, ref))
        u = used.get(ref, 0)
        if total > u and u > 0:
            report["extra_groups"].append((ref, total - u))


# ---------------------------------------------------------------- kvíz-bankok

def attach_quizzes(modules, report):
    qdata = json.loads(QUIZZES.read_text(encoding="utf-8"))
    lessons_bank = qdata.get("lessons", {})

    def norm(s):
        return re.sub(r"\W+", "", s.lower())

    for mod in modules:
        mod_bank = []
        seen = set()
        for lesson in mod["lessons"]:
            lq = []
            for ref in lesson["sourceRefs"]:
                entry = lessons_bank.get(ref)
                if entry:
                    lq.extend(entry["questions"])
            if lq:
                dedup = []
                lseen = set()
                for q in lq:
                    k = norm(q["q"])
                    if k not in lseen:
                        lseen.add(k)
                        dedup.append(q)
                lesson["quiz"] = {"passPct": 50, "questions": dedup}
            for q in lq:
                k = norm(q["q"])
                if k not in seen:
                    seen.add(k)
                    mod_bank.append(q)
        for lesson in mod["lessons"]:
            if lesson["kind"] != "modulzaro":
                continue
            parsed = lesson.pop("parsedQuiz", [])
            bank = parsed if parsed else mod_bank
            if not bank:
                report["notes"].append(f"{mod['key']}: üres modulzáró kérdésbank!")
                continue
            sample = min(12, len(bank))
            lesson["quiz"] = {
                "passPct": 75 if parsed else 50,
                "sampleSize": sample,
                "questions": bank,
            }
            report["banks"].append((mod["key"], len(bank), "dokumentumból" if parsed else "régi H5P-bankból"))


# ------------------------------------------------------------- H5P-média

def resolve_h5p(modules, report):
    """A videó-/interaktív H5P-dobozok feloldása a kinyert médiával.

    A mesterpéldány dobozai a tényleges Moodle-fájlneveket hordozzák, ezért
    név szerint egyeztetünk (h5p-media.json). Ha ugyanaz a videó kétszer
    szerepel egy leckében (a régi lecke duplán ágyazta be), a második kiesik.
    """
    if not H5P_MEDIA.exists():
        report["notes"].append("h5p-media.json hiányzik — H5P-elemek placeholderként maradnak "
                               "(futtasd: python scripts/export-h5p-media.py)")
        return
    media = json.loads(H5P_MEDIA.read_text(encoding="utf-8"))["items"]
    resolved, unmatched = 0, []
    for mod in modules:
        for lesson in mod["lessons"]:
            seen_files = set()
            for b in lesson["blocks"]:
                if b.get("t") != "h5p" or b.get("kind") not in ("video", "interaktiv"):
                    continue
                it = media.get(b.get("file"))
                if not it:
                    unmatched.append(f"{lesson['id']}: {b.get('file')}")
                    continue
                if b["file"] in seen_files and it["kind"] == "video":
                    b["drop"] = True
                    continue
                seen_files.add(b["file"])
                b["kind"] = it["kind"]
                b["title"] = it["title"]
                if it["kind"] == "video":
                    b["youtubeId"] = it["youtubeId"]
                elif it["kind"] == "accordion":
                    b["panels"] = it["panels"]
                elif it["kind"] == "quiz":
                    b["quiz"] = it["quiz"]
                resolved += 1
            lesson["blocks"] = [b for b in lesson["blocks"] if not b.get("drop")]
    report["notes"].append(f"H5P-média: {resolved} elem beágyazva (videó/kvíz/accordion)")
    for u in unmatched:
        report["notes"].append(f"H5P nem található a médiában (placeholder marad): {u}")


# ---------------------------------------------------------------- fogalomtár

def extract_glossary(report):
    # Elsődleges forrás: a szerkesztett tervezet (content/fogalomtar.json) — az
    # eredeti Moodle-fogalomtár szócikkei egyik mentésben sem maradtak fenn.
    curated = ROOT / "content" / "fogalomtar.json"
    if curated.exists():
        data = json.loads(curated.read_text(encoding="utf-8"))
        entries = sorted(data["entries"], key=lambda x: x["concept"].lower())
        report["glossary_count"] = len(entries)
        report["notes"].append(f"Fogalomtár: {len(entries)} szócikk a content/fogalomtar.json tervezetből "
                               "(jogi lektorálás szükséges)")
        return entries
    entries = {}
    if not MBZ.exists():
        report["notes"].append("backups/course-3.mbz nem található — fogalomtár kihagyva")
        return []
    with tarfile.open(MBZ, "r:gz") as t:
        for name in t.getnames():
            if name.endswith("/glossary.xml"):
                xml = t.extractfile(name).read()
                root = ET.fromstring(xml)
                for e in root.iter("entry"):
                    concept = (e.findtext("concept") or "").strip()
                    definition = (e.findtext("definition") or "").strip()
                    if concept and concept.lower() not in entries:
                        entries[concept.lower()] = {"concept": concept, "definition": definition}
    result = sorted(entries.values(), key=lambda x: x["concept"].lower())
    report["glossary_count"] = len(result)
    return result


# ---------------------------------------------------------------- segédletek

def parse_segedlet(sid, module_key, path):
    blocks = []
    title = None
    for item in iter_paragraphs(path):
        if item[0] == "tbl":
            rows = item[6]
            if len(rows) == 1 and len(rows[0]) == 1:
                blocks.append({"t": "callout", "html": rows[0][0]["html"]})
            else:
                blocks.append({"t": "table", "rows": [[c["html"] for c in r] for r in rows]})
            continue
        _, style, fill, left, list_kind, text, html = item
        if not text:
            continue
        if style == "Heading1" or (style == "Title"):
            if title is None:
                title = text
            else:
                blocks.append({"t": "h", "level": 2, "text": text})
            continue
        if style in ("Heading2", "Heading3"):
            blocks.append({"t": "h", "level": 2 if style == "Heading2" else 3, "text": text})
            continue
        blocks.append({"t": "p", "html": html})
    return {"id": sid, "module": module_key, "title": title or sid, "download": f"/segedletek/{path.name}", "blocks": blocks}


# ------------------------------------------------------------------- riport

def write_report(report):
    lines = ["# Tananyag-import riport", "", f"Generálva: {datetime.now(timezone.utc).isoformat(timespec='seconds')}", ""]
    lines.append("## Modulzáró kérdésbankok")
    for key, n, src in report["banks"]:
        lines.append(f"- **{key}**: {n} kérdés ({src})")
    lines.append("")
    lines.append(f"## Fogalomtár: {report.get('glossary_count', 0)} szócikk")
    lines.append("")
    if report["unmapped"]:
        lines.append("## Nem mappelt képhelyek (placeholder marad)")
        for lid, label in report["unmapped"]:
            lines.append(f"- {lid}: {label}")
        lines.append("")
    if report["extra_groups"]:
        lines.append("## Régi képcsoportok, amelyekhez nem volt hely az új leckében")
        for lid, n in report["extra_groups"]:
            lines.append(f"- {lid}: {n} csoport kimaradt")
        lines.append("")
    lines.append("## Szerkesztői jegyzetek a mesterpéldányból (a publikált tartalomból kiszűrve)")
    for where, note in report["editorial"]:
        lines.append(f"- **[{where}]** {note}")
    lines.append("")
    if report["notes"]:
        lines.append("## Egyéb megjegyzések")
        for n in report["notes"]:
            lines.append(f"- {n}")
    OUT_REPORT.write_text("\n".join(lines), encoding="utf-8")


# ---------------------------------------------------------------------- main

def main():
    report = {"editorial": [], "notes": [], "unmapped": [], "extra_groups": [], "banks": []}

    modules = parse_master(MASTER, report)
    map_images(modules, report)
    attach_quizzes(modules, report)
    resolve_h5p(modules, report)
    glossary = extract_glossary(report)

    # takarítás: belső mezők eldobása (a "h" blokknál a text a tartalom — marad!)
    for mod in modules:
        for lesson in mod["lessons"]:
            for b in lesson["blocks"]:
                if b["t"] != "h":
                    b.pop("text", None)
            lesson.pop("parsedQuiz", None)

    tananyag = {
        "generatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "source": MASTER.name,
        "title": "Közbeszerzési szakmai tananyag",
        "modules": modules,
        "glossary": glossary,
    }
    OUT_TANANYAG.write_text(json.dumps(tananyag, ensure_ascii=False, indent=1), encoding="utf-8")

    segedletek = [parse_segedlet(sid, mk, p) for sid, mk, p in SEGEDLETEK]
    OUT_SEGEDLET.write_text(json.dumps({"items": segedletek}, ensure_ascii=False, indent=1), encoding="utf-8")

    write_report(report)

    n_lessons = sum(len(m["lessons"]) for m in modules)
    n_videos = sum(len(l["videos"]) for m in modules for l in m["lessons"])
    n_imgs = sum(1 for m in modules for l in m["lessons"] for b in l["blocks"] if b["t"] == "img")
    n_ph = sum(1 for m in modules for l in m["lessons"] for b in l["blocks"] if b["t"] == "imgph")
    print(f"OK: {len(modules)} modul, {n_lessons} lecke, {n_videos} videóterv, "
          f"{n_imgs} mappelt képcsoport, {n_ph} placeholder, {len(glossary)} szócikk")
    print(f"→ {OUT_TANANYAG.relative_to(ROOT)}")
    print(f"→ {OUT_SEGEDLET.relative_to(ROOT)}")
    print(f"→ {OUT_REPORT.relative_to(ROOT)}")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
