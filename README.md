# ShipStack

Every new product idea starts the same way: hours wiring up the technical foundation — authentication, APIs, databases, deployment — before a single real feature gets built. ShipStack eliminates that tax. Scaffold a complete, production-ready codebase in minutes with `/create-project`, then turn any raw HTML/CSS into clean, typed React components with `/import-html`. No configuration rabbit holes. No boilerplate. Just open your editor and start building what matters.

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
    import-html/              — skill for converting HTML into React components
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

## Importing UI into a project

Once a project exists, convert raw HTML (from Claude.ai, v0, Lovable, or hand-written) into clean React/Next.js components:

```
/import-html <project-name>
```

Paste the HTML when prompted. The skill:

- Detects the project's CSS setup (Tailwind, CSS Modules, plain CSS) before writing anything
- Produces a component plan and asks for approval before creating files
- Places components in `apps/web/src/components/[route]/` — one folder per Next.js route, feature subfolders only when a section owns 2 or more related components
- Extracts hardcoded data (nav links, feature cards, testimonials) into typed `.ts` files co-located with the component that owns them — no separate `src/data/` directory
- Converts every repeated block into a typed `const` array rendered with `.map()`, wrapped in a named render function nested inside the component body
- Extracts every inline SVG into its own icon component in `components/icons/`
- Uses PascalCase for all file names and component names
- Installs and wires up Tailwind v4 if the project doesn't have it yet, including the cascade-layer fix required for spacing utilities to apply correctly
- Creates a barrel export at `components/index.ts` and shows a page wiring snippet for approval

## Requirements

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose
- Supabase CLI
- Claude Code (for `/create-project` and `/import-html` skills)

## Attribution

[ShipStack](https://github.com/rubenclopez/ship-stack) by [Rubén López](https://rubenlopez.ai)