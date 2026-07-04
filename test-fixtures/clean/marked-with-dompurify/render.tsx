// Markdown renderer that sanitizes the parsed HTML via DOMPurify before
// handing it to dangerouslySetInnerHTML. User input IS rendered, but the
// dangerous tokens are stripped first. VC007 and VC063 must not fire.

import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

interface Props {
  markdown: string;
}

export function MarkdownView({ markdown }: Props) {
  const rawHtml = marked.parse(markdown, { async: false }) as string;
  const sanitized = DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: ["p", "a", "strong", "em", "ul", "ol", "li", "code", "pre", "h1", "h2", "h3"],
    ALLOWED_ATTR: ["href", "title"],
  });

  // Safe because sanitized has been through DOMPurify with a strict allowlist.
  return <div className="prose" dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
