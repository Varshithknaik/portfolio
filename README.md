# Varshith K - Engineering Portfolio

Premium engineering website for enterprise frontend architecture, technical writing, case studies, projects, and interactive demos.

## Architecture

- `app/` - App Router pages, metadata, sitemap, robots, RSS.
- `components/` - Reusable shell, motion, timeline, card, notes, and diagram components.
- `components/ui/` - shadcn-style primitives.
- `content/` - MDX-ready notes, case studies, and project source content.
- `lib/site.ts` - Typed site metadata, navigation, page content, and IA/design-system plan.
- `lib/utils.ts` - Shared utility helpers.

## Commands

```bash
npm run build
npm run dev
```

The current `lint` script inherits the removed `next lint` behavior in this Next version, so production build is the primary verification command until ESLint is configured explicitly.
