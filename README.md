# Mohamed Imran H — Portfolio

A React + Vite portfolio site built around a "live training run" concept: an
animated neural network lives behind the hero, each section is framed as an
epoch in a training log, and metrics from real project work (accuracy gains,
patient records, latency) are surfaced as live counters and mini charts.

## Run locally

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
```

Output goes to `dist/`. Preview the production build with:

```bash
npm run preview
```

## Deploy

The `dist/` folder is fully static — drag it into any static host, or connect
the repo to one of these (all have generous free tiers):

- **Vercel** — `vercel deploy` after `npm i -g vercel`, or import the repo at vercel.com
- **Netlify** — drag the `dist` folder onto netlify.com/drop, or connect the repo
- **GitHub Pages** — push to a repo, run `npm run build`, deploy `dist/` via the `gh-pages` package or Pages settings

## Structure

```
src/
  components/      one component + co-located CSS module per section
  hooks/            useReveal (scroll-in animation), useCountUp (metric counters)
  App.jsx           page assembly
  index.css         design tokens (colors, type, spacing) as CSS variables
```

## Editing content

Each section's copy and data lives at the top of its component file as plain
arrays/objects — e.g. `PROJECTS` in `Projects.jsx`, `STACK` in `Skills.jsx`,
`EDUCATION`/`ACHIEVEMENTS` in `Education.jsx`. Update those, no need to touch
layout code.

## Design tokens

All colors, fonts, and radii are CSS variables defined once in `src/index.css`.
Change `--accent`, `--amber`, or the font stacks there to retheme the whole
site consistently.
