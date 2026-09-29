# Evidence Manager Web

Next.js client for the evidence manager. Analysts create cases, attach a file to each and
change its status. The interface is in Spanish; everything else in this repository is in
English.

| | |
|---|---|
| **Application** | `<PRODUCTION URL>` |
| **API** | `<API PRODUCTION URL>` · [repository](https://github.com/VaneeRivass/evidence-manager-api) |
| **Demo account** | `<EMAIL>` / `<PASSWORD>` |

---

## Stack

| | |
|---|---|
| Framework | Next.js, App Router · TypeScript, strict |
| Server state | TanStack Query |
| Forms | React Hook Form with Zod |
| Styling | Tailwind · lucide-react — components are written by hand from the mockup |
| Notices | sonner |
| Tests | Vitest · Testing Library |
| Deployment | Vercel |

---

## Architecture decisions

This application's own decision:

| # | Decision | Why, in one line |
|---|---|---|
| [0007](docs/adr/0007-front-architecture-client-components.md) | Client components, no BFF | The idiomatic Next approach — Server Components fetching data — fights the `httpOnly` cookie for no return in an application behind a login |

Decisions that shape the system and live in the API repository:

| # | Decision | Why it matters here |
|---|---|---|
| [0003](https://github.com/VaneeRivass/evidence-manager-api/blob/main/docs/adr/0003-session-cookie-behind-a-proxy.md) | `httpOnly` cookie behind a proxy | **The proxy is implemented in this repository**, in `next.config.js`. It is what makes the cookie first-party and removes CORS |
| [0004](https://github.com/VaneeRivass/evidence-manager-api/blob/main/docs/adr/0004-r2-storage-with-upload-verification.md) | Presigned URLs, verified on confirmation | The upload goes from this browser straight to storage, in three steps |

Interface requirements: [`docs/requirements.md`](docs/requirements.md).
System requirements and the endpoint map:
[API repository](https://github.com/VaneeRivass/evidence-manager-api/blob/main/docs/requirements.md).

---

## Running locally

**Prerequisites:** Node.js 22, and the API running on port 3001.

```bash
git clone https://github.com/VaneeRivass/evidence-manager-web.git
cd evidence-manager-web
npm install

cp .env.example .env.local
npm run dev                   # http://localhost:3000
```

To exercise a full flow, three terminals:

```
docker compose up -d      (in the API repository)   PostgreSQL
npm run dev               (in the API repository)   port 3001
npm run dev               (here)                    port 3000
```

### Environment variables

| Variable | What it is |
|---|---|
| `API_URL` | Where the proxy forwards to. `http://localhost:3001` in development |

**One variable, and deliberately without the `NEXT_PUBLIC_` prefix.** Anything carrying
that prefix is inlined into the bundle the browser downloads, where anyone can read it. The
rewrite runs on Next's server, so the value stays server-side — publishing the API's origin
in the client bundle is exactly what the proxy exists to prevent.

---

## Testing the evidence flow

The upload is three calls behind one bar. To see it end to end:

1. Sign in and open a case (create one from **Mis casos → Nuevo caso** if needed).
2. In the case's **Evidencia** panel, drop a PDF, JPG or PNG under 5 MB — or use
   *elígelo desde tu equipo*. Pick the file and press **Adjuntar**.
3. The bar runs to 100 % and the server verifies the file; it then shows **Verificada**.
4. Press **Descargar**: a fresh, short-lived link is signed on the spot and the browser
   saves the file. The link is never shown.

To see the two failures: drop a `.mp4` or a file over 5 MB — both are rejected in the
browser, with no request at all. A case that already holds a file has no drop zone, so the
`409` on the API is for callers that skip the interface.

---

## How the session works

There is no `saveToken()` and no `readToken()` in this codebase, and that is not an
omission.

```
The API responds   Set-Cookie: session=…; HttpOnly; Secure; SameSite=Lax
The browser        stores it. JavaScript CANNOT read it
This application   fetch('/api/cases')  → the browser attaches it by itself
```

Every call is relative and goes through the rewrite in `next.config.js`, so the browser
only ever talks to its own origin. That is what makes the cookie first-party — a cross-site
cookie would need `SameSite=None` and Safari blocks it — and it removes CORS entirely,
since the same-origin policy is a browser rule and the hop between domains happens server
to server.

The upload is the exception: it goes straight to storage, and deliberately **without**
credentials, so the session cookie never travels to Cloudflare.

---

## Structure

```
app/
  (auth)/login · register
  (app)/cases · cases/[id]
components/
  ui/            shadcn, copied in. Not linted, not reformatted
  cases/         domain components
hooks/
  useCases · useFileUpload · useSession
lib/
  api.ts         the only place that calls fetch
  schemas.ts     Zod, mirroring the API
  messages.es.ts error code → Spanish text
middleware.ts    route guard. At the root, a sibling of app/
```

`middleware.ts` belongs at the project root. Placed inside `app/`, Next does not run it:
the page loads, everything appears to work, and the guard protects nothing.

---

## Interface language

Everything in this repository is English except the text a person reads, which is composed
here from the codes the API emits:

```ts
// lib/messages.es.ts
export const messages = {
  TOO_SHORT: ({ min }) => `Mínimo ${min} caracteres`,
  TOO_LARGE: ({ max }) => `El archivo supera ${max} MB`,
}
```

No internationalisation library and no locale switcher. Adding a second language would be
adding one more file: an open door, not a built room.

---

## Scripts

```bash
npm run dev
npm run build          # a build that fails here would fail on Vercel
npm start
npm test
npm run lint
npx tsc --noEmit

npx shadcn@latest add button dialog input   # copies the component into components/ui/
```

---

## Known limitations

- **Pagination controls are not exposed.** The listing is bounded on the server, which is
  where the risk was; the response envelope already accepts the fields.
- **Tests substitute the API client** rather than intercepting network requests. Mock
  Service Worker would be the canonical choice and is the next increment.
- **Types are duplicated, not generated.** The schemas mirror the API's by hand, because
  the repositories are independent. The proper resolution is to generate them from the
  OpenAPI document the API already produces.

---

## Use of AI

**Tools:** Claude Code (Claude Opus) and OpenCode (DeepSeek).

**What the AI produced:**
- First drafts of the documentation and the architecture decision — Claude Code
- Scaffolding: `create-next-app`, configuration, dependencies, the CI workflow — OpenCode
- The client — `lib/api.ts`, the Zod schemas, `lib/messages.es.ts`, the hooks, the
  components, the route guard and the tests — OpenCode, explained and reviewed as it was
  written, not accepted blind

**What I wrote or rewrote:**
- `<COMPLETE: your own words — the parts you typed, corrected or rewrote>`

**An error the AI introduced, and how it was corrected:**
- The route guard was written as `middleware.ts`, the pre-16 convention. Next 16 renamed it
  to `proxy.ts`; the dev server printed *"The middleware file convention is deprecated"*. The
  file and its function were renamed to `proxy` and the warning disappeared.

Two caught during design, both of which would have failed silently rather than loudly:

| What it claimed | Why it was wrong |
|---|---|
| `NEXT_PUBLIC_API_URL` as the proxy destination | That prefix publishes the value in the browser bundle. The rewrite runs on the server; the variable must not be public |
| `middleware.ts` inside `app/` | Next does not run it there. No error is raised — the route guard simply never executes |

`<KEEP ADDING as they appear during development>`
