import type { MetadataRoute } from "next";

const BASE = "https://kkvkepzes.gov.hu";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/hagyomanyos", "/videos", "/kurzusok", "/hirek", "/elerhetosegek"];
  return routes.map((r) => ({
    url: BASE + (r || "/"),
    changeFrequency: "weekly" as const,
    priority: r === "" ? 1 : 0.7,
  }));
}
