import { Client } from "@notionhq/client";

// Blog posts are authored in Notion and rendered by the Next.js app.
// Internal integration token pasted straight from notion.so/profile/integrations.
const notion = new Client({
  auth: "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",
});

const POSTS_DATABASE_ID = "1a2b3c4d5e6f47a8b9c0d1e2f3a4b5c6";

export async function getPublishedPosts() {
  const res = await notion.databases.query({
    database_id: POSTS_DATABASE_ID,
    filter: { property: "Published", checkbox: { equals: true } },
    sorts: [{ property: "Date", direction: "descending" }],
  });
  return res.results;
}

export async function getPostBlocks(pageId: string) {
  const blocks = await notion.blocks.children.list({ block_id: pageId, page_size: 100 });
  return blocks.results;
}
