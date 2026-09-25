# DSD Corporate Services

The website for **DSD Corporate Services**, a Dubai-based advisory firm offering UAE
residency, business incorporation and regulatory compliance services.

It's a **static** React + TypeScript site (Vite, Tailwind CSS, MUI Joy, React Router,
TanStack Query) with no backend. All content is bundled into the build, so the output
can be hosted on any static web server.

## Getting started

Requires Node.js 20+.

```bash
npm ci
npm run dev        # local development at http://localhost:5173
npm run build      # production build -> dist/
npm run preview    # preview the production build
npm run lint
```

## How the site works without a backend

- **Content** (services, compliance areas, insights, team, founder, pricing, stats,
  testimonials) lives in `src/data/apiSnapshot.json`, captured from the former Django
  API. Images are in `public/media/`. `src/lib/api/client.ts` serves these to the same
  React Query hooks the pages always used. To change content, edit the JSON and rebuild.
- **Lead forms** send the enquiry through WhatsApp, or email if the visitor picks Email
  as their preferred contact method (`src/lib/api/leads.ts`).
- **Accounts and online checkout** need a server, so login, register and Google sign-in
  show a "contact us" message, and pricing plan buttons go to `/contact`. The pages
  themselves are kept.
- **Deep links:** `scripts/prerender-routes.mjs` runs after `vite build` and writes an
  `index.html` for every route (including every service, compliance, insight and team
  slug) plus `404.html`, so URLs like `/residency/golden-residency` load without server
  rewrite rules.

## Deployment

Pushing to `master` runs `.github/workflows/deploy.yml`, which builds the site and
copies `dist/` to `/var/www/client` on the EC2 server. It needs the `EC2_HOST` and
`EC2_SSH_KEY` repository secrets.

To deploy anywhere else, run `npm run build` and upload the contents of `dist/` to the
root of your domain (asset paths are absolute: `/assets/...`, `/media/...`).

## Contributing

1. Branch from `master` and name the branch for the change (`feature/x`, `fix/y`).
2. Match the existing patterns: check how a similar page or component already does it
   (`src/components/common/` is the best reference).
3. Run `npm run lint` and `npm run build` before opening a PR. The pre-commit hooks in
   `.pre-commit-config.yaml` run both for you.
4. Never commit `.env` files.
