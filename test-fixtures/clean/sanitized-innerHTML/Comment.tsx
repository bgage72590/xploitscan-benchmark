// dangerouslySetInnerHTML with DOMPurify.sanitize — safe.
// VC007 and VC063 must NOT fire.

import DOMPurify from "dompurify";

interface CommentProps {
  body: string;
}

export function Comment({ body }: CommentProps) {
  const sanitized = DOMPurify.sanitize(body);
  return (
    <div className="comment">
      <div
        className="comment-body"
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    </div>
  );
}

// JSON-LD structured data (standard SEO) — also safe.
const JSON_LD_SCRIPT = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Example",
});

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON_LD_SCRIPT }}
    />
  );
}
