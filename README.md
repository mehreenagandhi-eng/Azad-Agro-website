# Field & Ledger (Azad Agro Marketplace)

Multi-manufacturer organic marketplace — ported from a Claude.ai single-file React prototype into a Vite + React app.

## Quick start

```bash
npm install
cp .env.example .env.local   # add your Clerk publishable key
npm run dev
```

Open the local URL Vite prints (default `http://localhost:5173`).

```bash
npm run build   # production build
npm run preview # preview the build
```

## Clerk auth (Google + email)

1. Create an application at [dashboard.clerk.com](https://dashboard.clerk.com)
2. Copy the **Publishable key** into `.env.local` as `VITE_CLERK_PUBLISHABLE_KEY`
3. Under **User & authentication**:
   - Keep **Email** enabled (OTP / password as you prefer)
   - Enable **Google** under Social connections
4. Add your local and production URLs in Clerk → Domains / Allowed origins
5. Restart `npm run dev`

Header shows **Sign in** / **Sign up**. After signing in, Clerk’s avatar menu manages the account (including Google-linked profile). Checkout prefills the signed-in name when available.

Owner approve/deny still uses the demo **Owner Login** passcode (separate from customer Clerk accounts).

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
- **Customer account** — Clerk (Google or email) when `VITE_CLERK_PUBLISHABLE_KEY` is set

## Next production steps

1. Real database for manufacturers/products/orders
2. Object storage for product/cover images (not base64 in JSON)
3. URL routing (React Router or Next.js)
4. Real payments if selling commercially
5. Map marketplace **Owner** role to a Clerk user/org instead of the demo passcode
