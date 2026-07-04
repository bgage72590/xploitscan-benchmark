// Comment renderer that injects user-supplied HTML without sanitization.
// VC007 must fire on dangerouslySetInnerHTML with user input.

interface CommentProps {
  body: string; // from the API — user-supplied
}

export function Comment({ body }: CommentProps) {
  return (
    <div className="comment">
      <h3>Latest comment</h3>
      <div
        className="comment-body"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </div>
  );
}

export function UnsafeProfile({ bio }: { bio: string }) {
  // Direct innerHTML assignment with user input — also injection.
  const ref = (el: HTMLDivElement | null) => {
    if (el) el.innerHTML = `<strong>Bio:</strong> ${bio}`;
  };
  return <div ref={ref} />;
}
