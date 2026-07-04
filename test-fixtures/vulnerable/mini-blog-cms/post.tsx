// Blog post component rendering author HTML via dangerouslySetInnerHTML.
// VC063 (unsanitized dangerouslySetInnerHTML).

import React from "react";

interface Post {
  title: string;
  authorHtml: string;
  bodyHtml: string;
}

export function BlogPost({ post }: { post: Post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <div className="author" dangerouslySetInnerHTML={{ __html: post.authorHtml }} />
      <div className="body" dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />
    </article>
  );
}
