# -*- coding: utf-8 -*-
"""
H5P-média export: a leckékbe ágyazott videók és interaktív elemek kinyerése.

A régi leckék (course-pages.json) iframe-jeiből letölti a videó- és interaktív
H5P-csomagokat a helyi Moodle-ból, és strukturált JSON-ba menti:
  - H5P.InteractiveVideo  → YouTube-azonosító (a videók mind YouTube-osak)
  - H5P.Accordion         → panelek (cím + HTML)
  - H5P.QuestionSet       → kvízkérdések az app formátumában

Kimenet: web/src/data/h5p-media.json
Futtatás: python scripts/export-h5p-media.py   (futó Moodle + web/.env.local kell)
"""
import io
import json
import re
import sys
import urllib.request
import zipfile
from datetime import datetime, timezone
from html import unescape
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGES = ROOT / "web" / "src" / "data" / "course-pages.json"
OUT = ROOT / "web" / "src" / "data" / "h5p-media.json"

env = {}
for line in (ROOT / "web" / ".env.local").read_text(encoding="utf-8").splitlines():
    if "=" in line and not line.strip().startswith("#"):
        k, _, v = line.partition("=")
        env[k.strip()] = v.strip()
TOKEN = env["MOODLE_WS_TOKEN"]

RE_IFRAME = re.compile(r'<iframe[^>]+src="([^"]+)"', re.I)
RE_URL = re.compile(r"url=([^&\"]+)")
RE_TAGS = re.compile(r"<[^>]+>")


def plain(html):
    return re.sub(r"\s+", " ", RE_TAGS.sub(" ", unescape(html or ""))).strip()


def parse_question(q):
    lib = (q.get("library") or "").split(" ")[0]
    if lib == "H5P.MultiChoice":
        answers = q.get("params", {}).get("answers", [])
        correct_idx = [i for i, a in enumerate(answers) if a.get("correct")]
        if not correct_idx:
            return None
        options = [{"key": chr(97 + i), "label": plain(a.get("text"))} for i, a in enumerate(answers)]
        correct = [options[i]["key"] for i in correct_idx]
        labels = " · ".join(options[i]["label"] for i in correct_idx)
        fb = answers[correct_idx[0]].get("tipsAndFeedback", {}).get("chosenFeedback")
        return {
            "q": plain(q.get("params", {}).get("question")),
            "options": options, "correct": correct, "multi": len(correct) > 1,
            "ok": plain(fb) or "Helyes válasz!",
            "no": ("A helyes válaszok: " if len(correct) > 1 else "A helyes válasz: ") + labels,
        }
    if lib == "H5P.TrueFalse":
        is_true = str(q.get("params", {}).get("correct")) == "true"
        return {
            "q": plain(q.get("params", {}).get("question")),
            "options": [{"key": "a", "label": "Igaz"}, {"key": "b", "label": "Hamis"}],
            "correct": ["a" if is_true else "b"], "multi": False,
            "ok": "Helyes válasz!", "no": f"A helyes válasz: {'Igaz' if is_true else 'Hamis'}",
        }
    return None


def main():
    pages = json.loads(PAGES.read_text(encoding="utf-8"))
    # fájl → {url, owners[]} — a leckén belüli sorrend megtartásával, duplikátum nélkül
    refs = {}
    for num, lesson in pages["lessons"].items():
        for pg in lesson["pages"]:
            for m in RE_IFRAME.finditer(pg["contents"]):
                enc = RE_URL.search(m.group(1))
                if not enc:
                    continue
                url = urllib.parse.unquote(enc.group(1))
                fm = re.search(r"/([^/]+\.h5p)", url, re.I)
                if not fm:
                    continue
                f = fm.group(1)
                if f not in refs:
                    refs[f] = {"url": url, "owners": []}
                if num not in refs[f]["owners"]:
                    refs[f]["owners"].append(num)

    wanted = {f: r for f, r in refs.items() if re.search(r"video|interaktiv", f, re.I)}
    print(f"H5P-hivatkozás: {len(refs)} egyedi, letöltendő (videó/interaktív): {len(wanted)}")

    items = {}
    for f, r in wanted.items():
        dl = r["url"].replace("/pluginfile.php/", "/webservice/pluginfile.php/").split("?")[0] + "?token=" + TOKEN
        try:
            data = urllib.request.urlopen(dl, timeout=60).read()
            z = zipfile.ZipFile(io.BytesIO(data))
            meta = json.loads(z.read("h5p.json"))
            content = json.loads(z.read("content/content.json"))
        except Exception as e:
            print(f"  KIHAGYVA {f}: {e}")
            continue
        lib = meta.get("mainLibrary")
        item = {"owners": r["owners"], "title": meta.get("title", f), "library": lib}
        if lib == "H5P.InteractiveVideo":
            vf = (content.get("interactiveVideo", {}).get("video", {}).get("files") or [{}])[0]
            path, mime = vf.get("path", ""), vf.get("mime", "")
            if mime == "video/YouTube" or "youtu" in path:
                ym = re.search(r"(?:youtu\.be/|v=)([\w-]{6,})", path)
                if ym:
                    item["kind"] = "video"
                    item["youtubeId"] = ym.group(1)
            if "youtubeId" not in item:
                print(f"  KIHAGYVA {f}: nem YouTube-videó ({mime} {path[:50]})")
                continue
        elif lib == "H5P.Accordion":
            panels = []
            for p in content.get("panels", []):
                title = plain(p.get("title"))
                html = (p.get("content", {}).get("params", {}) or {}).get("text", "")
                if title:
                    panels.append({"title": title, "html": html})
            item["kind"] = "accordion"
            item["panels"] = panels
        elif lib == "H5P.QuestionSet":
            qs = [parse_question(q) for q in content.get("questions", [])]
            qs = [q for q in qs if q]
            if not qs:
                print(f"  KIHAGYVA {f}: nincs értelmezhető kérdés")
                continue
            item["kind"] = "quiz"
            item["quiz"] = {"passPct": int(content.get("passPercentage", 50) or 50), "questions": qs}
        else:
            print(f"  KIHAGYVA {f}: nem támogatott típus ({lib})")
            continue
        items[f] = item
        extra = f"YouTube:{item.get('youtubeId')}" if item.get("kind") == "video" else \
            f"{len(item.get('panels', []))} panel" if item["kind"] == "accordion" else \
            f"{len(item['quiz']['questions'])} kérdés"
        print(f"  OK {f}: {item['kind']} ({extra}) ← {','.join(r['owners'])}")

    OUT.write_text(json.dumps({
        "generatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "source": "helyi Moodle (course-pages.json iframe-ek)",
        "items": items,
    }, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"→ {OUT.relative_to(ROOT)} ({len(items)} elem)")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    import urllib.parse  # noqa: E402  (a main-ben használt unquote miatt)
    main()
