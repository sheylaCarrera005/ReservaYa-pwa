# Agent and contributor guidance

## Project context

ReservaYa is a Spanish-language Next.js 15 / React 19 prototype using JavaScript, the App Router, Tailwind CSS 3, lucide-react, and Supabase Auth. Email/password sign-in is configured via SSR cookies; reservation confirmation remains a visual simulation, with no real availability, booking persistence, or payment.

## Working conventions

- Keep route entry points and layouts in `src/app/`; keep route-specific UI close to its feature and extract shared UI only when it has a clear reuse/responsibility boundary.
- Keep sample catalog data out of large JSX components as the feature is incrementally modularized. Centralize category identifiers and metadata rather than repeating category-specific conditionals.
- Preserve the existing visual behavior and URL contract (`category`, and `destination` when supported) during refactors. Validate unknown categories and make unsupported search behavior explicit; never imply filtering that is not actually performed.
- Use Server Components by default; add `'use client'` only to components requiring state, browser APIs, or client navigation hooks.
- Keep user-facing copy in Spanish and ensure controls have labels, keyboard operation, visible focus, and meaningful accessible names.
- Do not add backend/service abstractions until there is a real data contract. When introduced, services must handle loading, empty, and error states.
- PWA claims must match implementation. The manifest currently references missing icons; no service worker, cache strategy, offline fallback, or push notification exists. Do not claim these capabilities or add a service worker without an agreed caching/offline design and production validation.
- Inert actions (login, install, placeholder links) should be implemented, clearly marked as unavailable, or omitted—not presented as working features.
- Avoid unrelated rewrites and preserve existing user changes. Prefer incremental extraction over arbitrary file-size limits or speculative architecture.

## Validation

Use the project scripts available in `package.json`:

```bash
npm run dev
npm run build
npm start
```

There is currently no configured lint or automated test script. Do not claim tests or lint passed unless tooling has been added and run. For UI changes, verify both desktop and mobile layouts and the search-to-simulated-reservation flow.

## Structure direction

The intended incremental direction is `src/components/layout`, `src/components/home`, `src/components/booking`, `src/data`, and `src/lib`. Keep `src/app` focused on route composition. Add only directories needed by implemented code; the full proposed structure is not a requirement to create empty folders.
