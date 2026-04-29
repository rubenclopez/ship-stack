---
name: create-project
description: Scaffold a new full-stack project under projects/ using create-turbo (Next.js + pnpm monorepo), Supabase SSR auth, and Docker Compose. Use this skill whenever the user wants to create a new project, start a new app, bootstrap a monorepo, or set up a new full-stack web application — even if they don't say "scaffold" explicitly.
argument-hint: <project-name>
---

Scaffold a new project under `projects/` from scratch. Use `$ARGUMENTS` as the project name (kebab-case). If no argument was provided, ask the user for a project name before continuing.

Throughout these steps:
- `NAME` = `$ARGUMENTS` (e.g. `my-app`)
- `DIR` = `projects/$ARGUMENTS-docker-mono`
- `SKILL_DIR` = `.claude/skills/create-project`

---

## Step 1 — Bootstrap the monorepo

Run from the repo root:
```
cd projects && npx create-turbo@latest NAME-docker-mono --package-manager pnpm
rm -fr DIR/apps/docs
cd SKILL_DIR/skel/apps && cp -fr backend DIR/apps
```

This creates: `apps/web` (Next.js), `packages/ui`, `packages/eslint-config`, `packages/typescript-config`.
This copies: `skel/apps/backend` to `DIR/apps`

Run from the repo root:
```
pnpm add express dotenv @supabase/supabase-js --filter @repo/backend
pnpm add -D tsx typescript @types/express --filter @repo/backend
```

---

## Step 2 — Install web app dependencies

```
pnpm add @supabase/ssr @supabase/supabase-js resend sass validator --filter web # @react-pdf/renderer react-calendar 
pnpm add -D @types/validator --filter web babel-plugin-react-compiler # @types/react-calendar 
```

---

## Step 3 — Configure `next.config.ts`

```
cp SKILL_DIR/skel/apps/web/next.config.ts DIR/apps/web/next.config.ts
rm DIR/apps/web/next.config.js
```

---

## Step 4 — Initialize Supabase

```
cd DIR/apps/web && supabase init
```

---

## Step 5 — Create Supabase client library

```
mkdir -p DIR/apps/web/src/lib/supabase
cp SKILL_DIR/skel/apps/web/src/lib/supabase/browser.ts DIR/apps/web/src/lib/supabase/browser.ts
cp SKILL_DIR/skel/apps/web/src/lib/supabase/server.ts DIR/apps/web/src/lib/supabase/server.ts
cp SKILL_DIR/skel/apps/web/src/lib/supabase/middleware-client.ts DIR/apps/web/src/lib/supabase/middleware-client.ts
```

---

## Step 6 — Create `src/middleware.ts`

```
cp SKILL_DIR/skel/apps/web/src/middleware.ts DIR/apps/web/src/middleware.ts
```

---

## Step 7 — Create the Dockerfile

```
cp SKILL_DIR/skel/apps/web/Dockerfile DIR/apps/web/Dockerfile
```

---

## Step 8 — Create `docker-compose.yaml`

Copy and substitute the project name (`__NAME__` is the placeholder in the skel file):
```
sed 's/__NAME__/NAME/g' SKILL_DIR/skel/docker-compose.yaml > DIR/docker-compose.yaml
```

---

## Step 9 — Create `.env.example` and `README.md`

```
cp SKILL_DIR/skel/.env.example DIR/.env.example
sed 's/__NAME__/NAME/g' SKILL_DIR/skel/README.md > DIR/README.md
```

---

## Step 10 — Final install & confirm

```
cd DIR && pnpm install
```

List the top-level contents of `DIR` and summarize what was created. Remind the user to:
- Copy `.env.example` → `.env` and fill in values before running Docker
- Create a Supabase project and apply migrations from `apps/web/supabase/migrations/`
- Add protected routes to `PROTECTED_PATHS` in `src/middleware.ts` as needed
