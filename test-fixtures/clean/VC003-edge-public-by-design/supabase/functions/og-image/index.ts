// Social preview image. Rendered for crawlers that will never hold a token.
Deno.serve(async (req) => {
  const url = new URL(req.url);
  const title = url.searchParams.get("title") ?? "Untitled";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><text x="60" y="320">${title}</text></svg>`;
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml" } });
});
