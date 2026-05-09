# Claude Instructions — Next.js + TypeScript

## Project Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript (TSX)
- **Styling:** Tailwind CSS
- **Backend:** Next.js API routes (no separate server)

---

## Folder Structure

```
src/
  app/
    layout.tsx             <- root layout
    page.tsx               <- home route (/)
    globals.css
    <route>/
      page.tsx
      loading.tsx
      error.tsx
    api/
      <route>/
        route.ts           <- API route handler (thin controller only)

  components/
    ui/                    <- generic reusable UI (Button, Modal, Spinner, etc.)
    <feature>/             <- feature-specific components

  lib/
    db.ts                  <- Drizzle client singleton
    <service>.ts           <- other third-party SDK singletons
    constants/
      <topic>.ts           <- grouped constants by topic
    validators/
      <topic>.ts           <- reusable Zod schemas

  db/
    schema.ts              <- Drizzle table definitions
    index.ts               <- re-exports db + schema

  services/
    <feature>.service.ts   <- business logic, one file per feature

  hooks/                   <- custom React hooks
  utils/                   <- pure helper functions
  context/                 <- React Context providers
  types/                   <- shared TypeScript type definitions
```

---

## Code Separation Rules

### Constants

- Never define reusable constants inline in a component or page file.
- Never hardcode nav link labels, route paths, or repeated string values directly inside components.
- All constants go in `lib/constants/<topic>.ts`.
- All data arrays (nav links, feature lists, step lists, card data, etc.) belong in `lib/constants/` — not at the top of a component file.
- If a constant has any chance of being used in more than one file, extract it immediately.
- Do not create a separate file per constant. Group related constants for the same page or feature into one file. Only split into separate files when constants are shared across multiple pages.

```ts
// ✅ Correct — page-specific constants grouped in one file
// lib/constants/homePage.ts
export const NAV_LINKS = [...];
export const FEATURE_LIST = [...];
export const TESTIMONIALS = [...];

// ❌ Wrong — one file per array, unnecessary bloat
// navLinks.ts, featureList.ts, testimonials.ts
```

- Constants shared across the whole app (status values, roles, route paths, limits) each get their own file since they are used everywhere.

### Shared Utilities / Singletons

- Third-party SDK configs used in more than one file go in `lib/<service>.ts`.
- Never instantiate a third-party client more than once — always import from the singleton.

### Components

- If a UI pattern appears in more than one place, extract it to `components/ui/`.
- Feature-specific components go in `components/<feature>/`.
- One-off page UI with zero reuse potential can stay in the page file.
- If a TSX block inside a component exceeds ~30 lines and has a clear single responsibility, extract it into its own component file.
- Extracted components receive typed props — they do not fetch their own data. Data fetching stays in Server Components or custom hooks.
- Layout sub-components (e.g. `Navbar`, `Footer`) must always be extracted into their own files inside `components/layout/` — even if currently used in only one place.

```
components/layout/
  Header.tsx    <- full top bar: logo + Navbar + buttons
  Navbar.tsx    <- navigation links only, receives no props
  Footer.tsx    <- full footer
```

### Services

- All business logic lives in `services/` — never directly in route handlers.
- Database queries go in service files, not in API route files.
- Each service file owns one responsibility.

### Types

- Shared TypeScript types and interfaces go in `types/`.
- Never duplicate a type definition across files.

### General Principle

Before writing any constant, component, or utility inline — ask: "Could this be needed elsewhere?" If yes, put it in the right shared location from the start.

### Simplicity First

Always prefer the simplest solution that works. Before reaching for an abstraction, utility, or pattern — ask: "Can this be done with plain, readable code instead?" If yes, use that.

- Prefer plain Tailwind classes over utility wrappers like `cn(buttonVariants({...}))`
- Prefer `<Link>` with a className over wrapping it in a Button component
- Only introduce complexity when simplicity genuinely cannot solve the problem

---

## API Design Rules

- Keep route handlers thin — they only read request data, call a service, and return a response.
- Never put business logic or database logic directly in route files.
- Validate all input before calling a service.
- Use consistent response shapes for success and error cases.
- Use correct HTTP status codes:
  - `200` success
  - `201` created resource
  - `400` validation error
  - `404` not found
  - `500` unexpected server error

---

## Server Components vs Client Components

- All components in `app/` are Server Components by default.
- Add `'use client'` only when the component uses:
  - React hooks (`useState`, `useEffect`, `useContext`, etc.)
  - Browser APIs (`window`, `document`, `localStorage`, etc.)
  - Event handlers or interactive behavior
- Push `'use client'` as far down the tree as possible.

---

## Validation and Error Handling

- Validate every request body, query param, and route param before processing using **Zod**.
- Define Zod schemas in the same file as the route, or in `lib/validators/<topic>.ts` if reused across multiple routes.
- Never trust frontend input.
- Return user-friendly error messages for validation failures — never raw stack traces.
- Use shared error classes for known error types (e.g. `ValidationError`, `NotFoundError`).
- Wrap async route handlers with a shared async handler instead of repeating try/catch everywhere.
- Never leak secret values in API responses.

---

## Data Modeling Rules

- Define all tables in `src/db/schema.ts` using Drizzle's TypeScript schema syntax.
- Table definitions must be normalized unless there is a clear performance reason not to.
- Add indexes on fields frequently used in lookups and filters.
- Use `pgEnum` for restricted values (e.g. `Role`, `Status`) — define them in `src/db/schema.ts`.
- Include `createdAt` and `updatedAt` on all core tables.
- Define relations using Drizzle's `relations()` helper — never duplicate related data.
- Name fields clearly and consistently across DB schema, services, and API responses.
- Never store derived data unless it is intentionally cached.
- Use `drizzle-kit push` to sync schema changes to the DB during development.

---

## Code Comments

### Imports

- Do not add comments above import statements. Leave all imports clean.

### Functions and Hooks

- Every non-trivial function (more than 2-3 lines or non-obvious logic) must have a comment above it explaining what it does and what it returns:

```ts
// Fetches paginated results from the DB filtered by userId.
// Returns an array of records and the total count.
async function getUserItems(userId: string, page: number): Promise<{ items: Item[]; total: number }> { ... }
```

### Logic Blocks inside Functions

- Non-obvious steps inside a function must be prefixed with a numbered comment:

```ts
// 1. Validate input
// 2. Check resource exists
// 3. Apply business rule
// 4. Persist to DB
// 5. Return response
```

### TSX Sections

- Label major TSX blocks with `{/* -- Section Name -- */}` style comments:

```tsx
{/* -- Header -- */}
{/* -- Main content -- */}
{/* -- Footer -- */}
```

### What NOT to comment

- Self-evident one-liners (`useState`, simple assignments).
- Never restate the code in plain English — explain the _why_, not the _what_.
- No comments above import statements.

---

## Naming Conventions

- Files: `camelCase.ts` for utils/services/hooks/lib, `PascalCase.tsx` for components.
- Next.js special files (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts`) are always lowercase.
- Hooks: always prefix with `use` (e.g. `useAuth`, `usePagination`).
- Constants: `UPPER_SNAKE_CASE`.
- CSS classes: `kebab-case`.
- Types and interfaces: `PascalCase` (e.g. `UserProfile`, `ApiResponse`).
- Use consistent naming across DB models, API response shapes, service functions, and frontend types — the same concept should have the same name at every layer. Avoid ambiguous names like `data`, `info`, or `result` when a clearer domain name is possible.

---

## Styling

- Tailwind CSS for all styling.
- No inline `style={{}}` props unless the value is truly dynamic.
- Global styles in `app/globals.css`.
- Use class names, not IDs, for styling.

---

## Routing

- File-based routing via the `app/` directory — no routing library needed.
- Use `redirect()` from `next/navigation` for programmatic redirects in Server Components.
- Use `useRouter()` from `next/navigation` for programmatic navigation in Client Components.

---

## Navigation — Link vs a

| Use case | Element | Reason |
|---|---|---|
| Internal links | `<Link>` | Client-side navigation, no page reload |
| Navbar with active state | `<Link>` + `usePathname()` | Compare pathname to detect active route |
| External URLs (`https://`) | `<a>` | `<Link>` is for internal routes only |
| Email / mailto links | `<a>` | `<Link>` cannot handle mailto protocol |

- Never use `<a href="...">` for internal routes — causes full page reload, breaks client-side navigation.
- For active highlighting, use `usePathname()` from `next/navigation` and compare against `href`.

```tsx
'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

const pathname = usePathname();

<Link
  href={link.href}
  className={pathname === link.href ? "text-white" : "text-white/60"}
>
  {link.label}
</Link>

// External — always use <a>
<a href="https://example.com" target="_blank" rel="noreferrer">
  example.com
</a>
```

---

## Logging

- Never use `console.log` in production code.
- Use a structured logger (e.g. `pino`) so logs are searchable and machine-readable.
- Log at the service layer — not inside route handlers or components.
- Never log sensitive data (passwords, tokens, personal user data).

---

## Caching

- Do not add caching unless the data explicitly benefits from it — Next.js 15+ does not cache by default.
- When caching is needed, choose the right strategy:

| Strategy | When to use |
|---|---|
| `fetch(url, { next: { revalidate: N } })` | Content that changes occasionally (ISR) |
| `fetch(url, { cache: 'no-store' })` | User-specific or real-time data |
| `unstable_cache()` from `next/cache` | Repeated DB queries safe to cache |

---

## Security Rules

- Never hardcode secrets or API keys in source code.
- All secrets come from environment variables in `.env.local`.
- `NEXT_PUBLIC_` prefix only for values that are safe to expose to the browser.
- Sanitize and validate all input before use.
- Apply rate limiting to public API routes using Next.js middleware or a library like `@upstash/ratelimit`.
- Return generic error messages for sensitive failures — never expose internals.

---

## Testing Rules

- Keep pure logic (calculations, transformations, validations) separate from Next.js request/response objects so they can be unit tested in isolation.
- Prefer unit-testable service functions over large route handler functions.

---

## Environment Variables

- Define all required variables in `.env.local`.
- Document every variable with a comment explaining its purpose.
- Never commit `.env.local` to version control.

```
# Example
DATABASE_URL=         <- primary database connection string
NEXT_PUBLIC_API_URL=  <- public base URL for client-side fetches
```
