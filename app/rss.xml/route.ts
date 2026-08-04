import { notes, profile } from "@/lib/site";

export function GET() {
  const baseUrl = "https://varshith.dev";
  const items = notes
    .map(
      (note) => `<item>
  <title>${note.title}</title>
  <link>${baseUrl}/notes/${note.slug}</link>
  <description>${note.summary}</description>
  <category>${note.category}</category>
</item>`,
    )
    .join("");

  const body = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>${profile.name} Engineering Notes</title>
  <link>${baseUrl}/notes</link>
  <description>Software engineering notes on React, browser internals, performance, delivery architecture, and system design.</description>
  ${items}
</channel>
</rss>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml",
    },
  });
}
