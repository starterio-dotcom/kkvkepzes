// Moodle pluginfile proxy: a képet a WS tokennel, SZERVER-oldalról tölti,
// így a token nem kerül a kliensbe. Csak pluginfile-útvonalakat enged.
const MOODLE_URL = process.env.MOODLE_URL;
const TOKEN = process.env.MOODLE_WS_TOKEN;

export async function GET(req: Request) {
  const p = new URL(req.url).searchParams.get("p");
  if (!MOODLE_URL || !TOKEN) return new Response("Nincs Moodle kapcsolat", { status: 503 });
  if (!p || p.includes("..") || p.startsWith("/")) return new Response("Hibás kérés", { status: 400 });

  // A képnevek szóközt/ékezetet tartalmazhatnak -> szegmensenként újrakódolunk.
  const encoded = p.split("/").map((s) => encodeURIComponent(s)).join("/");
  const target = `${MOODLE_URL}/webservice/pluginfile.php/${encoded}?token=${TOKEN}`;
  const upstream = await fetch(target, { next: { revalidate: 3600 } });
  if (!upstream.ok) return new Response("Nem található", { status: upstream.status });

  const body = await upstream.arrayBuffer();
  return new Response(body, {
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "application/octet-stream",
      "cache-control": "public, max-age=3600",
    },
  });
}
