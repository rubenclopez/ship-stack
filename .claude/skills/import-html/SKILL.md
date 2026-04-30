---
name: import-html
description: Take raw HTML and convert it into well-structured, DRY, single-responsibility, typed React/Next.js components written to the target project's apps/web folder.
argument-hint: <project-name> (e.g. goalstack-ai)
---

Convert raw HTML into clean React/Next.js components inside `projects/$PROJECT/apps/web/src/components/`. Use `$ARGUMENTS` as the project name (kebab-case, without the `-docker-mono` suffix). If no argument was provided, ask the user for the project name before continuing.

Throughout these steps:
- `PROJECT` = `$ARGUMENTS`
- `DIR` = `projects/$ARGUMENTS-docker-mono`
- `COMPONENTS_DIR` = `DIR/apps/web/src/components`

### Folder structure convention

Components are organised by **route**, then by **feature** within that route:

```
src/components/
├── layout/               ← shared across all routes (header, footer, nav, brand marks)
├── [route]/              ← one folder per Next.js route (e.g. home/, dashboard/, settings/)
│   ├── [feature]/        ← only when a section owns 2+ sub-components (e.g. live-training/, logo-marquee/)
│   │   ├── FeatureSection.tsx
│   │   ├── FeatureCard.tsx
│   │   └── FeatureSubBlock.tsx
│   └── SingleSection.tsx ← sections with only one file stay flat inside the route folder
└── icons/                ← shared SVG icon components
```

**Rules:**
- The route name matches the URL segment: `/` → `home/`, `/dashboard` → `dashboard/`, etc.
- Create a feature subfolder only when a section has **2 or more** co-dependent sub-components.
- `layout/` holds components that appear on multiple routes (e.g. `SiteHeader`, `RLMark`).
- `icons/` is always at the top level of `components/` — never inside a route folder.
- **Hardcoded data lives next to the component that owns it** — do not create a separate `src/data/` directory. A typed `const` array used only by `ServicesSection` belongs in `components/home/Services.ts`, not `data/home/Services.ts`. Only extract to a shared location if the same data is imported by 3 or more unrelated components.

---

## Step 1 — Collect the HTML

If the user has not already pasted the HTML in this message, ask them to paste it now before continuing. Do not proceed until you have the raw HTML.

---

## Step 2 — Detect project conventions

Read the following files to understand the project's CSS and typing setup before writing any components:

1. `DIR/apps/web/app/globals.css` — detect whether the project uses Tailwind (`@tailwind`) or plain CSS.
2. `DIR/apps/web/app/page.tsx` (or any existing component in `COMPONENTS_DIR`) — detect whether CSS Modules (`.module.css`), Tailwind class strings, or a CSS-in-JS approach is in use.
3. `DIR/apps/web/tsconfig.json` — confirm TypeScript is enabled.
4. `DIR/apps/web/package.json` — note any UI library dependencies (shadcn, Radix, Headless UI, etc.).

Record your findings as `STYLE_APPROACH` (one of: `tailwind`, `css-modules`, `css-in-js`, or `plain-css`) and `HAS_UI_LIB` (boolean). Use these throughout the remaining steps.

---

## Step 3 — Analyse and plan the component tree

Parse the HTML mentally and produce a **component plan** — a short tree you will show the user before writing any files:

1. Identify the target route (e.g. `/` → `home`, `/dashboard` → `dashboard`) — this becomes the route folder under `src/components/`.
2. Identify every meaningful block that appears more than once, or that has a clear single responsibility — each becomes its own component.
3. Group sub-components under a feature subfolder when 2 or more components belong to the same section (e.g. `live-training/LiveTrainingSection.tsx`, `live-training/LiveTrainingCard.tsx`, `live-training/CountdownBlock.tsx`). Single-file sections stay flat inside the route folder.
4. Identify components used across routes (header, footer, brand marks) — place these in `layout/`.
5. Name every component in **PascalCase** (e.g. `HeroSection`, `FeatureCard`, `NavBar`).
6. Identify shared prop shapes that will need TypeScript interfaces (e.g. `CardProps`, `NavItemProps`).
7. List any static data arrays (nav links, feature list, testimonials, etc.) — extract as typed `const` arrays into a `.ts` file co-located with the component that owns them (e.g. `components/home/Services.ts` alongside `ServicesSection.tsx`, or `components/home/logo-marquee/AiTools.ts` alongside `LogoMarquee.tsx`).

Show the user the plan as a folder tree (with file paths relative to `DIR`) and ask for a thumbs-up before writing files.

---

## Step 4 — Create the component directories

```
mkdir -p COMPONENTS_DIR/layout
mkdir -p COMPONENTS_DIR/[route]
mkdir -p COMPONENTS_DIR/[route]/[feature]   # only for sections with 2+ sub-components
mkdir -p COMPONENTS_DIR/icons
```

---

## Step 5 — Write each component

For every component in the approved plan, write `COMPONENTS_DIR/<component-name>.tsx` (PascalCase component and interface names).

Follow these rules for every file:

### Code style — enforced on every file
- **Indentation:** 2 space indentation consistently throughout.
- **Semicolons:** none — no trailing semicolons on any line.
- **Trailing commas:** none — no trailing comma after the last item in arrays, objects, or parameter lists.
- **Quotes:** single quotes for all strings in JS/TS; double quotes only inside JSX attribute values.
- **Multi-argument functions:** when a function or component has more than one argument, place each argument on its own line with the opening brace/paren on the same line as the function name:
  ```ts
  function foo(
    argOne: string,
    argTwo: number
  ) {
      return argOne
  }
  ```
- **Type imports:** always use `import type` when importing only types:
  ```ts
  import type { Foo } from './types'
  import { bar } from './utils'
  ```
- **`'use client'`:** omit unless the component uses browser-only APIs, event handlers, or React hooks (`useState`, `useEffect`, etc.). Prefer Server Components by default.

### File & naming conventions
- File names: **PascalCase** — `HeroSection.tsx`, `FeatureCard.tsx`.
- Component names: **PascalCase** — `HeroSection`, `FeatureCard`.
- Interface names: **PascalCase** — `HeroSectionProps`, `FeatureCardProps`.

### Structure
```tsx
import type { ... } from '...'
import { ... } from '...'

// Types — inline interface for props; move to src/types/index.ts only if used in 3+ files
interface ComponentNameProps {
  ...
}

// Static data — extract repeated data structures as typed const arrays here, not inline JSX
const ITEMS: ItemType[] = [...]

export default function ComponentName({
  prop1,
  prop2
}: ComponentNameProps) {
    return (...)
}
```

### Repeated card/block patterns — always map, never duplicate

When the source HTML contains two or more blocks that share the same markup structure (same wrapper classes, same internal layout) and differ only in content (text, icon, colour, href), **never copy-paste the JSX**. Instead:

1. Define a typed interface for the variant data.
2. Store each variant as an object in a `const` array.
3. Render with a single `.map()` over one JSX template.
4. When a field is a React component (e.g. an icon), type it as a render function and destructure-rename it to PascalCase at the call site so JSX treats it as a component:

```tsx
interface ValueProp {
  icon: ({ className }: { className?: string }) => React.ReactNode
  iconClass: string
  title: string
  body: string
}

const valueProps: ValueProp[] = [
  {
    icon: CpuIcon,
    iconClass: 'text-cyan-300',
    title: 'Built for operators.',
    body: '...'
  },
  {
    icon: LayersIcon,
    iconClass: 'text-violet-300',
    title: 'Designed before it is automated.',
    body: '...'
  }
]

export default function ValuePropsSection() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {valueProps.map(({ icon: Icon, iconClass, title, body }) => (
        <div key={title} className="...">
          <Icon className={`h-8 w-8 ${iconClass}`} />
          <h3>{title}</h3>
          <p>{body}</p>
        </div>
      ))}
    </div>
  )
}
```

This applies to: feature cards, stat grids, process steps, testimonials, pricing tiers, nav links, before/after comparisons — any set of visually identical blocks.

**Always** extract every `.map()` into a named render helper function nested **inside** the component body (not at module scope). Never inline a `.map()` directly in the `return`. This keeps the `return` readable as pure layout and scopes the helpers to the component:

```tsx
export default function SafetyHighlightSection() {
  function renderGuardrails() {
    return guardrails.map((item) => (
      <div key={item} className="...">
        {item}
      </div>
    ))
  }

  function renderComparisonCards() {
    return comparisonCards.map(({ label, labelClass, borderClass, bgClass, heading, points }) => (
      <div key={label} className={`... ${borderClass} ${bgClass}`}>
        <div className={labelClass}>{label}</div>
        <h3>{heading}</h3>
        <ul>
          {points.map((point) => <li key={point}>• {point}</li>)}
        </ul>
      </div>
    ))
  }

  return (
    <section>
      <div className="grid gap-4 sm:grid-cols-2">
        {renderGuardrails()}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {renderComparisonCards()}
      </div>
    </section>
  )
}
```

This is a hard rule — no exceptions for "short" maps or single-map components.

### Typing rules
- Always type props with an explicit interface; never use `any` or untyped props.
- Use `React.ReactNode` for children props.
- Use native HTML attribute spreading (`React.HTMLAttributes<HTMLElement>`) when a wrapper component passes arbitrary attributes through.
- Avoid redundant types (`React.FC`, `JSX.Element` return annotations) — TypeScript infers these.

### Component rules
- One component per file.
- No component does more than one thing.
- Identify shared sub-elements (e.g. a card used in a list) and split them out into their own file rather than inlining.
- Replace `<img>` with Next.js `<Image>` (import from `'next/image'`); add `width` and `height` or `fill` as appropriate.
- Replace `<a href="...">` for internal paths with Next.js `<Link>` (import from `'next/link'`).
- Preserve all `aria-*`, `role`, and semantic HTML from the source.
- Do NOT add business logic, state, or data-fetching unless it was already present in the HTML (e.g. a form's `onSubmit`).

### AI-generated HTML patterns

AI tools (Claude.ai, ChatGPT, Lovable, v0) produce predictable patterns that need special handling:

#### HTML→JSX normalization
- `class` → `className`, `for` → `htmlFor`
- `onclick`, `onchange`, etc. → camelCase React props (`onClick`, `onChange`)
- Void elements must be self-closed: `<br />`, `<input />`, `<hr />`
- Boolean attributes use JSX form: `disabled` not `disabled="disabled"`

#### Outer shell stripping
- Remove `<html>`, `<head>`, and `<body>` wrappers — Next.js manages these in `layout.tsx`.
- Move any `<title>`, `<meta>`, or `<link rel="canonical">` found in `<head>` into a `metadata` export on the relevant page file and tell the user.

#### `<style>` block extraction
- Never leave `<style>...</style>` blocks in JSX. Extract all rules to the component's companion `.scss` file.

#### `<script>` block conversion
- Convert vanilla JS in `<script>` blocks to React: DOM queries → refs, imperative mutations → state/effects, event listeners → JSX event props.
- If a script is too complex to convert safely, remove it, stub the behaviour with a `// TODO` comment, and tell the user.

#### SVG handling
- Every inline `<svg>` becomes its own component in `COMPONENTS_DIR/icons/<icon-name>.tsx`, regardless of whether it appears once or many times.
- Accept optional `className` and standard SVG props via `React.SVGProps<SVGSVGElement>` spread.
- Replace hardcoded `fill`/`stroke` colours with `currentColor` where appropriate so the icon inherits CSS colour.

#### CDN & external dependency detection
- Flag any `<link>` or `<script>` that loads Bootstrap, Tailwind CDN, FontAwesome, or similar. Suggest the npm package equivalent and do not replicate the CDN reference in JSX.
- Convert Google Fonts `<link>` imports to `next/font/google` in `layout.tsx`; show the user the snippet but do not edit `layout.tsx` automatically.

#### Placeholder images
- Flag any `src` pointing to `via.placeholder.com`, `placehold.co`, `picsum.photos`, or similar. Replace with a `// TODO: replace with real asset` comment on the `<Image />` and list them in the Step 8 report.

#### Hardcoded design tokens
- When the same hex colour, font size, or spacing value appears three or more times, extract it as a SCSS variable at the top of the relevant `.scss` file (e.g. `$color-brand: #3b82f6`).

#### Existing UI library reuse
- If `HAS_UI_LIB` is true, prefer the project's existing components (shadcn `<Button>`, Radix `<Dialog>`, etc.) over writing raw HTML equivalents. Map source elements to the closest available component.

### Style rules — follow `STYLE_APPROACH`
- **tailwind**: Use Tailwind utility classes directly; no extra CSS files per component.
- **css-modules**: Create a companion `COMPONENTS_DIR/ComponentName.module.scss` and import it as `styles`; do not use inline styles.
- **css-in-js**: Follow the existing pattern in the project.
- **plain-css**: Convert to SCSS and add to `globals.scss`; do not invent new class names unless you also add the rule there.

#### Adding Tailwind v4 to a project that does not have it

When `STYLE_APPROACH` is `tailwind` but Tailwind is not yet installed:

1. Install via pnpm from the monorepo root:
   ```
   pnpm --filter web add tailwindcss @tailwindcss/postcss
   ```
2. Create `DIR/apps/web/postcss.config.mjs`:
   ```js
   export default {
     plugins: { '@tailwindcss/postcss': {} }
   }
   ```
3. Add `@import "tailwindcss"` as the **first line** of `globals.css`.
4. **CRITICAL — remove unlayered CSS resets.** Any rule in `globals.css` that is not inside a `@layer` block delete them. Keep only project-specific rules that are genuinely additive (custom properties, `.imgDark`/`.imgLight` helpers, etc.).
5. Also install any animation/motion library the source depends on (e.g. `pnpm --filter web add framer-motion`).
6. If the source uses external image URLs (e.g. CDN icons), add the hostname to `next.config.ts` under `images.remotePatterns`.

#### SCSS conversion
- All CSS files extracted or created for components must be written as `.scss`, never `.css`.
- Use SCSS nesting, variables, and `&` selectors where they reduce repetition.
- Never write inline `style={{...}}` props unless the value is purely dynamic (e.g. a runtime pixel value); if you must, tell the user explicitly which prop is inline and why.
- Never embed base64-encoded assets (images, fonts, SVGs) in SCSS or TSX. If the source HTML contains a base64 `src` or `url(data:...)`, extract it to a file in `public/`, reference it by path, and tell the user: _"Base64 asset extracted to `public/<name>.<ext>` — verify and commit it."_

In all cases: preserve the visual structure of the source HTML faithfully. Do not redesign.

---

## Step 6 — Create a barrel export

Write or update `COMPONENTS_DIR/index.ts` with sections grouped by folder. Use single quotes, no semicolons, no trailing commas:

```ts
// layout
export { default as SiteHeader } from './layout/SiteHeader'

// [route]
export { default as HeroSection } from './[route]/hero/HeroSection'
export { default as SingleSection } from './[route]/SingleSection'

// [route]/[feature]
export { default as FeatureSection } from './[route]/[feature]/FeatureSection'
export { default as FeatureCard } from './[route]/[feature]/FeatureCard'
```

If any component also exports named types that callers will need, re-export them with `export type`:

```ts
export type { FeatureCardProps } from './[route]/[feature]/FeatureCard'
```

---

## Step 7 — Wire up in the page (optional)

If the HTML represents a full page or a major page section, show the user a diff or code snippet of how to import and use the new components in the relevant `app/.../page.tsx`. Do not edit the page file automatically — present the snippet and ask first.

---

## Step 8 — Report

List every file created with its relative path from `DIR`. Note any `<img>`, `<a>`, or inline styles that could not be automatically converted and require manual follow-up.
