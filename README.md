# Field & Ledger (Azad Agro Marketplace)

Multi-manufacturer organic marketplace — ported from a Claude.ai single-file React prototype into a Vite + React app.

## Quick start

```bash
npm install
npm run dev
```

Open the local URL Vite prints (default `http://localhost:5173`).

```bash
npm run build   # production build
npm run preview # preview the build
```

## What's in this repo

| Area | Location |
|------|----------|
| App shell / state | `src/AzadAgroStore.jsx` |
| Pages | `src/pages/` |
| Shared UI | `src/components/` |
| Defaults / seed data | `src/data/` |
| Theme styles | `src/styles.js` |
| Persistence shim | `src/storage.js` |
| Handoff notes | `docs/HANDOFF.md` |

## Persistence note

The original prototype used Claude's `window.storage` (shared across visitors). This repo includes a **localStorage shim** so the UI works offline/local. That only persists **per browser** — a real shared marketplace needs a backend (see `docs/HANDOFF.md`).

## Demo controls

- **Edit Mode** — open, no password (demo only)
- **Owner Login** — passcode `owner123` (approve/deny manufacturers)
- **Account** — name + email convenience only, not real auth

## Next production steps

1. Real database + auth (Supabase / Firebase / custom API)
2. Object storage for product/cover images (not base64 in JSON)
3. URL routing (React Router or Next.js)
4. Real payments if selling commercially
