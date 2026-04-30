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
```

This creates: `apps/web` (Next.js), `packages/ui`, `packages/eslint-config`, `packages/typescript-config`.

---

## Step 2 — Copy package skeletons

```
cp -r SKILL_DIR/skel/packages/. DIR/packages/
```

---

## Step 3 — Copy backend app skeleton

```
cp -r SKILL_DIR/skel/apps/backend/. DIR/apps/backend/
```

Install backend dependencies:
```
pnpm add express dotenv @supabase/supabase-js --filter @repo/backend
pnpm add -D tsx @types/node typescript @types/express tsc-alias --filter @repo/backend
```

---

## Step 4 — Install web app dependencies

```
pnpm add @supabase/ssr @supabase/supabase-js resend sass validator --filter web # @react-pdf/renderer react-calendar
pnpm add -D @repo/types @types/validator babel-plugin-react-compiler --filter web # @types/react-calendar
```

---

## Step 5 — Copy web app skeleton

Copy all skel files into the generated `apps/web` (adds new directories, overwrites config files):
```
cp -r SKILL_DIR/skel/apps/web/. DIR/apps/web/
rm DIR/apps/web/next.config.js
```

---

## Step 6 — Initialize Supabase

```
mkdir -p DIR/apps/services && cd DIR/apps/services && supabase init
```

---

## Step 7 — Create `docker-compose.yaml`

Copy and substitute the project name (`__NAME__` is the placeholder in the skel file):
```
sed 's/__NAME__/NAME/g' SKILL_DIR/skel/docker-compose.yaml > DIR/docker-compose.yaml
```

---

## Step 8 — Create `.env.example` and `README.md`

```
cp SKILL_DIR/skel/.env.example DIR/.env.example
sed 's/__NAME__/NAME/g' SKILL_DIR/skel/README.md > DIR/README.md
```

---

## Step 9 — Final install & confirm

```
cd DIR && pnpm install
```

List the top-level contents of `DIR` and summarize what was created. Remind the user to:
- Copy `.env.example` → `.env` and fill in values before running Docker
- Create a Supabase project and apply migrations from `apps/supabase/migrations/`
- Add protected routes to `PROTECTED_PATHS` in `src/middleware.ts` as needed
