# Field & Ledger — Project Context & Handoff

A multi-manufacturer organic marketplace platform. Originally a single-file React prototype in Claude.ai; this repo is the production-bound port.

## What this is

Originally a single-brand storefront for a fictional organic farm called **Azad Agro**. Restructured into a marketplace (**Field & Ledger** — placeholder name) where multiple manufacturers each run their own storefront, with a shared cart and checkout.

## Data model

- **`site`** — marketplace branding, hero, nav/footer copy, `copy: {}` microcopy
- **`manufacturers[]`** — storefronts (`pending` | `approved` | `rejected`), story, products, etc.
- **`products[]`** — per manufacturer: `{ id, name, cat, unit, price, icon, image, note, featured }`
- **`theme`** — colors, fonts, section overrides, per-text overrides
- **`cart`** — keys as `` `${manufacturerId}::${productId}` ``
- **`account`** — Clerk-signed-in user (`name`, `email`, `clerkUserId`) synced into the app for checkout prefills

## Persistence (important)

Claude's `window.storage` does **not** exist here. This repo ships a `localStorage` shim in `src/storage.js` so the UI works locally. That only persists per browser — a shared marketplace needs a real backend (Supabase / Firebase / API + Postgres).

## Demo-only (do not ship as-is)

- Edit Mode: no password
- Owner Login: hardcoded `owner123` (separate from Clerk customer auth)
- Payments / contact form: UI only
- Currency hardcoded to ₹

## Auth (Clerk)

Customer sign-in uses `@clerk/react` with `VITE_CLERK_PUBLISHABLE_KEY`. Enable **Email** and **Google** in the Clerk dashboard. Without the key, the header shows a setup hint instead of live auth.

## Recommended next steps

1. Split further / add React Router (or Next.js) for shareable URLs
2. Replace storage shim with a real database; keep Clerk for auth
3. Move images to object storage (not base64 in JSON)
4. Wire real payments if going commercial
5. Replace owner passcode with a Clerk role / organization
