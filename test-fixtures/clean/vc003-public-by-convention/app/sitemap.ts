// Next.js reserved file convention: app/sitemap.ts is served at /sitemap.xml
// for search-engine crawlers. Requiring a session here would delist the site.

import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://example.com/", lastModified: new Date() },
    { url: "https://example.com/pricing", lastModified: new Date() },
  ];
}

export async function GET() {
  return new Response("<urlset></urlset>", {
    headers: { "Content-Type": "application/xml" },
  });
}
