# __NAME__

Full-stack monorepo for __NAME__. Built with Turborepo, Next.js, Express, Supabase, and Docker.

## Structure

```
apps/
  web/      — Next.js frontend with Supabase SSR auth (port 3000)
  backend/  — Express + TypeScript API (port 8000)
packages/
  ui/                 — Shared React component library
  eslint-config/      — Shared ESLint configuration
  typescript-config/  — Shared TypeScript configuration
```

## Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose
- Supabase CLI
- A Supabase project

## Local development

**1. Install dependencies**

```sh
pnpm install
```

**2. Set up environment variables**

```sh
cp .env.example .env
```

Fill in the values in `.env`:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Supabase anon/publishable key |
| `NEXT_PUBLIC_BASE_URL` | App base URL (e.g. `http://localhost:3000`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `EMAIL_API_KEY` | Resend API key |
| `EMAIL_FROM` | Sender address (e.g. `noreply@yourdomain.com`) |

**3. Apply Supabase migrations**

```sh
cd apps/web
supabase link --project-ref <your-project-ref>
supabase db push
```

**4. Start all apps**

```sh
pnpm dev
```

Or run a single app:

```sh
pnpm dev --filter=web
pnpm dev --filter=@repo/backend
```

## Auth & protected routes

Authentication is handled by Supabase SSR via `apps/web/src/middleware.ts`. To protect a route, add its path prefix to `PROTECTED_PATHS`:

```ts
const PROTECTED_PATHS = ['/dashboard', '/settings'];
```

Unauthenticated users are redirected to `/auth/sign-in?redirect=<original-path>`.

## Docker

Build and run the web app in production mode:

```sh
docker compose up --build
```

The `web` service expects all variables from `.env` at build time (`NEXT_PUBLIC_*`) and at runtime (secrets). The container joins the external `shared-network` — create it once if it doesn't exist:

```sh
docker network create shared-network
```

## Useful commands

| Command | Description |
|---|---|
| `pnpm build` | Build all apps and packages |
| `pnpm lint` | Lint all apps and packages |
| `pnpm dev --filter=web` | Start only the Next.js app |
| `pnpm dev --filter=@repo/backend` | Start only the Express API |
| `docker compose up --build` | Build and run via Docker |
