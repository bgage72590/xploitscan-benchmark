// A component that renders a user comment's sanitized .text via
// dangerouslySetInnerHTML, in a file that happens to import an LLM SDK.
// `post.text` has nothing to do with model output, so VC200 (LLM-output XSS)
// must NOT fire on a bare `.text` property. The value is DOMPurify-sanitized
// so VC007/VC063 stay quiet too — this is clean code. (Real LLM-output shapes
// like delta.text / output_text still flag under VC200.)
import OpenAI from "openai";
import DOMPurify from "dompurify";

const client = new OpenAI();

export function Comment({ post }: { post: { text: string } }) {
  return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.text) }} />;
}
