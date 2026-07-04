// JSON-LD structured data rendered via dangerouslySetInnerHTML — the
// standard Next.js SEO pattern. The payload is developer-controlled and
// serialized with JSON.stringify, NOT user HTML. Crucially this file does
// NOT import DOMPurify or any sanitizer, so it exercises the real-world
// case (cf. components/BlogJsonLd.tsx). VC007 and VC063 must NOT fire.

interface BlogJsonLdProps {
  title: string;
  url: string;
  nonce: string;
}

export function BlogJsonLd({ title, url, nonce }: BlogJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    url,
  };

  // Single-line form
  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function MultiLineJsonLd({ nonce }: { nonce: string }) {
  // Multi-line form — the __html value wraps onto the next line. The skip
  // must look at a small window, not just the match line.
  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Example",
        }),
      }}
    />
  );
}
