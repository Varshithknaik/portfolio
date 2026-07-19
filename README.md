# Varshith K — Portfolio

Dark, developer-styled portfolio built with Next.js 14 (App Router) and TypeScript.
No CSS framework — plain CSS with design tokens in `app/globals.css`, matching the
approved mockup exactly.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Edit content

Everything you'd want to change — copy, experience, projects, skills, links — lives
in one file: `data/content.ts`. Components just render whatever is there, so you
rarely need to touch component code to update the site.

A few things marked `TODO` in that file that are still placeholders:

- **GitHub / LinkedIn URLs** in `profile` — confirm these are correct.
- **`projects` array** — the "Masonry feed UI" and "Open-source experiments" entries
  are placeholders for your Pinterest-style feed page and other GitHub repos.
  Swap in real names, descriptions, tech stacks, and links once those are ready.
  Add more entries to the array for additional repos; the grid will wrap automatically.

Note: Global Trade Management is intentionally listed under **Experience**, not
**Projects** — since it's company IP, the site describes your role and impact there
rather than showcasing it as a demo-able project.

## Deploy

Push to a GitHub repo and import it at https://vercel.com/new — zero config needed,
Vercel detects Next.js automatically. Or run `npm run build && npm run start` to
serve it yourself.

## Structure

```
app/            route, layout, global styles
components/     one component per section
data/content.ts all editable copy
```
