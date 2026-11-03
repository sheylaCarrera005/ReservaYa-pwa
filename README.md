# ReservaYa

ReservaYa is a Spanish-language web prototype for discovering hotels, restaurants, and experiences and simulating a reservation. It uses Next.js App Router, React, Tailwind CSS, and lucide-react.

## Run locally

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Production commands are `npm run build` and `npm start`.

## Current scope

- `/` provides category discovery and a search form.
- `/reservar` displays sample listings and a local-only simulated confirmation.
- Supabase email/password registration and sign-in are available at `/auth/register` and `/auth/signin` when configured. There is still no real availability, payment, or reservation persistence.
- The manifest exists, but the referenced icon files, service worker, and offline behavior are not implemented. Do not describe the current application as offline-capable or fully installable.

## Supabase authentication setup

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `NEXT_PUBLIC_SITE_URL` from your Supabase project and local/deployed app URL. Enable Email authentication in Supabase Auth and add `http://localhost:3000/auth/callback` (and the deployed equivalent) to its allowed redirect URLs. If email confirmation is enabled, users must confirm their address; if disabled, registration signs them in immediately. Restart the development server after changing environment variables.

## Project guidance

See [AGENTS.md](AGENTS.md) for contribution and architecture guidance, [DESIGN.md](DESIGN.md) for the design proposal, and [docs/TECHNICAL-AUDIT.md](docs/TECHNICAL-AUDIT.md) for the repository audit that informed this structure.
