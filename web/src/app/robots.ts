import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/belepes", "/api/"] },
    sitemap: "https://kkvkepzes.gov.hu/sitemap.xml",
  };
}
