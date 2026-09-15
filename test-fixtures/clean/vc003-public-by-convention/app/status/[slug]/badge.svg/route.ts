// Embeddable status badge. The whole point is that a README <img> tag or a
// third-party landing page can fetch it with no credentials, exactly like a
// shields.io badge. Unknown slug → 404; nothing user-specific is returned.

interface RouteParams {
  params: Promise<{ slug: string }>;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { slug } = await params;
  const label = escapeXml(slug).slice(0, 24);

  return new Response(
    `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="24"><text x="8" y="16">${label}</text></svg>`,
    {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
}
