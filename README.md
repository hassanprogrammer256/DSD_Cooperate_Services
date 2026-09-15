# DSD Corporate Services

The website and admin platform for **DSD Corporate Services**, a Dubai-based advisory
firm offering UAE residency, business incorporation  regulatory compliance
services. The project is a monorepo with three independent apps that share one
Django backend:

- **Client site** (`frontend/`) — the public marketing site: service pages, pricing, lead forms, blog/insights  a client account area with paid checkout.
- **Admin panel** (`admin/`) — an internal dashboard for staff to manage site content (services, compliance areas, team, pricing, testimonials, leads) without touching code.
- **Backend API** (`backend/`) — a Django REST Framework API both frontends talk to: content, auth, orders/payments  lead capture.

## Tech stack

- **Frontend & Admin**: React 19 + TypeScript, Vite, Tailwind CSS, MUI Joy, React Router, TanStack Query, React Hook Form + Zod, Framer Motion.
- **Backend**: Django 5 + Django REST Framework, SimpleJWT auth, SQLite for local dev / PostgreSQL in production, Tap Payments for checkout.

## Prerequisites

- Node.js 20+ and npm
- Python 3.11+
- Git

## Getting started

Clone the repo, then set up each app. All three run independently and can be
started in any order, but the backend needs to be running for the frontend/admin
to load real data.

### 1. Backend (API)

```bash
cd backend
python -m venv venv
source venv/Scripts/activate   # Windows (Git Bash); use `venv/bin/activate` on macOS/Linux
pip install -r requirements.txt

cp .env.example .env           # then fill in DJANGO_SECRET_KEY at minimum
python manage.py migrate
python manage.py createsuperuser   # to log into the admin panel
python manage.py runserver 8000
```

The API is now at `http://localhost:8000`. Uploaded media (hero images, service
photos, etc.) is served from `/media/` and stored under `backend/media/`.

### 2. Client site

```bash
cd frontend
npm install
cp .env.example .env.local     # override VITE_API_BASE_URL / VITE_TAP_PUBLIC_KEY as needed
npm run dev
```

Runs at `http://localhost:5173`.

### 3. Admin panel

```bash
cd admin
npm install
cp .env.example .env.local
npm run dev
```

Runs at `http://localhost:5174`. Log in with the superuser you created above.

## Environment variables

Each app reads from its own `.env`. `.env.example` in every folder documents
what's needed — copy it to `.env` (backend) or `.env.local` (frontend/admin,
which is gitignored and always wins over the committed `.env`) and fill in real
values locally. Never commit real secrets.

- `backend/.env.example` — Django secret key, Tap Payments key, email/SMTP settings, lead notification routing.
- `frontend/.env.example` / `admin/.env.example` — the API base URL the app talks to  (frontend only) the Tap Payments publishable key.

## Project structure

```text
backend/
  config/            # Django project settings (base/dev/prod) and URL routing
  content/           # Services, compliance areas, team, pricing, testimonials — the main content API
  accounts/          # Auth (JWT login/refresh) and user accounts
  orders/            # Pricing checkout + Tap Payments integration
  leads/             # Contact/lead-form capture and notifications
  media/             # Uploaded images — tracked in git as the seed dataset for a working local demo

frontend/src/
  pages/             # One file per route
  components/
    common/          # Shared, reusable UI (cards, buttons, form fields)
    sections/        # Page-section blocks composed from common/ (Hero, Testimonials, ...)
    layout/          # Navbar, Footer, page chrome
  lib/api/           # Typed API client + one file per resource (services, pricing, ...)
  contexts/          # React context providers (auth)
  assets/            # Images and fonts bundled at build time

admin/src/           # Same shape as frontend/src, scoped to CRUD forms for each content type
```

## Contributing

1. **Branch from `master`**, name it for the change (`feature/x`, `fix/y`).
2. **Match the existing patterns** before introducing new ones — check how a
   similar page/component/endpoint already does it. `frontend/src/components/common/`
   and `backend/content/` are the best reference points for conventions.
3. **Run the checks before opening a PR**:

   ```bash
   # frontend or admin
   npm run lint
   npx tsc -b --noEmit

   # backend
   python manage.py check
   python manage.py test
   ```

4. **Keep commits focused** — one logical change per commit, with a message that
   explains *why*, not just what changed.
5. **Never commit `.env` files or `db.sqlite3`** — they're gitignored for a
   reason. New images under `media/` are fine to commit only if they're meant
   to be part of the shared seed dataset, not personal local testing.
6. Open a PR against `master` with a short description of what changed and why.
