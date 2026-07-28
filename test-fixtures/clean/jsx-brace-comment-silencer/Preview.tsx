// In JSX a comment is written `{/* ... */}` — the line starts with a brace,
// not with the comment opener. A silencer walk that tests "does this line
// look like a comment" before testing for the marker will stop here and never
// see it, silently breaking a suppression that previously worked.
//
// This is a regression fixture, not a hypothetical: it is exactly what broke
// on our own dashboard when the contiguous-comment-block walk was added.
export function Preview({ previewHtml }: { previewHtml: string }) {
  return (
    <div>
      {/* scanner-OK: previewHtml is server-built from our own templates, not user input */}
      <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
    </div>
  );
}
