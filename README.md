# RubenLopez.ai-method

Workspace for managing full-stack projects built with the RubenLopez.ai Method. Each project lives under `projects/` and is scaffolded as a Turborepo monorepo with Next.js, Express, Supabase, and Docker.

## Structure

```
projects/                     — individual full-stack projects
  <name>-docker-mono/         — Turborepo monorepo per project
    apps/web/                 — Next.js frontend
    apps/backend/             — Express + TypeScript API
    docker-compose.yaml
    .env.example
.claude/
  skills/
    create-project/           — skill for scaffolding new projects
  settings.json
CLAUDE.md                     — Claude Code configuration for this workspace
```

## Creating a new project

Open Claude Code and run:

```
/create-project <project-name>
```

This scaffolds a new `projects/<project-name>-docker-mono/` monorepo with:

- **Next.js** frontend with Supabase SSR auth and route protection middleware
- **Express + TypeScript** backend with Supabase client and a heartbeat endpoint
- **Shared packages** — component library, ESLint config, TypeScript config
- **Docker Compose** for production deployment
- **`.env.example`** with all required variables

After scaffolding, copy `.env.example` → `.env`, fill in your Supabase credentials and Resend API key, then run `pnpm dev` from the project root.

## Requirements

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose
- Supabase CLI
- Claude Code (for `/create-project` skill)
