# vtp-front

The web client for **VTP** (Video Tracking and Planning) — sign-in, the mirrored Steam app
catalogue, the genre/category/tag scoring that ranks it, and the admin page that drives the
backend's ingestion jobs.

React 19 + Vite 8 + TypeScript, styled with Bootstrap 5, sessions handled by the
better-auth React client. It is a pure SPA: no SSR, no server of its own, every piece of
data comes from `vtp-backend` over `fetch`.

Part of a three repository set:

| Repo | Role |
| --- | --- |
| [vtp-common](https://github.com/Noodles-Coders-Team/vtp-common) | zod schemas and DTOs shared by the API and the client |
| [vtp-backend](https://github.com/Noodles-Coders-Team/vtp-backend) | the REST API |
| **vtp-front** | this repo, the web client |

## Getting started

Prerequisites: Node.js 20+, and a running `vtp-backend`.

```bash
npm install
npm run dev     # http://localhost:5173
```

Create a `.env` in the repository root before the first run — it is git ignored, so it
never arrives with a clone:

```ini
VITE_BACKEND_URL=http://localhost:8080
```

No trailing slash: every API module appends its own (`VITE_BACKEND_URL + "/steam-apps/"`),
and the better-auth client appends `/api/auth`. Vite only exposes variables prefixed
`VITE_`. There is no fallback and no startup check — if the variable is missing, the value
is the string `"undefined"` and requests go to `/undefined/steam-apps/`, which shows up as
failed fetches rather than a clear error.

Port 5173 is not incidental: the backend's CORS allow-list and better-auth's
`trustedOrigins` both name `http://localhost:5173` explicitly, so the dev server has to
keep that port for sign-in to work. Note that the backend's CORS origin currently carries a
stray leading space, which blocks every cross-origin response until it is fixed there.

> **If `@nct/vtp-common` cannot be resolved**, the sibling package has not been built. It
> is linked with `"@nct/vtp-common": "file:../vtp-common"`, so it must sit next to this
> repo on disk, and its `dist/` is git ignored. Clone
> [vtp-common](https://github.com/Noodles-Coders-Team/vtp-common), run `npm install &&
> npm run build` there, then re-run `npm install` here. Re-run its build after any schema
> change — the `file:` link serves `dist/`, not `src/`.

You will need an account before you see anything but the sign-in card; the sign-up form on
that page creates one. Admin-only screens need the `admin` role, which the backend grants
through a hardcoded id list — see its README.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR on port 5173 |
| `npm run build` | `tsc -b` then `vite build` → `dist/` |
| `npm run preview` | Serves the built `dist/` locally |
| `npm run lint` | ESLint 10 flat config |

`npm run build` is clean. `npm run lint` reports two `react-hooks/exhaustive-deps`
warnings in `SteamAppTable.tsx` and no errors.

## Project layout

```
src/
  main.tsx        entry point, mounts BrowserRouter and imports Bootstrap CSS
  App.tsx         session gate, route table and the fixed navbar frame
  pages/          one component per route
  components/     feature components, grouped by the page that owns them
    commonComponents/   layout, input and table primitives
  api/            one module per backend resource, plus RequestApi, AuthApi and EventBus
  style/          shared inline style objects
  assets/         logo and SVG icons
```

### Path aliases

Declared **twice** — in [tsconfig.app.json](tsconfig.app.json) for the typechecker and in
[vite.config.ts](vite.config.ts) for the bundler. Adding one means editing both files, or
it will resolve in the editor and fail at build time (or the reverse).

| Alias | Resolves to |
| --- | --- |
| `@/*` | `src/*` |
| `@api/*` | `src/api/*` |
| `@assets/*` | `src/assets/*` |
| `@components/*` | `src/components/*` |
| `@commonComponents/*` | `src/components/commonComponents/*` |

## Authentication and routing

[App.tsx](src/App.tsx) is the gate. It calls `authClient.useSession()` and branches before
any route is reachable:

* **pending** — renders the shared loading state;
* **no session** — redirects to `/auth` and registers that single route, so no other page
  exists while signed out;
* **session** — renders the navbar and the route table below.

| Path | Page | Visible to |
| --- | --- | --- |
| `/` | `HomePage` — static welcome card | any signed-in user |
| `/games` | `GamesPage` — the imported-apps table and the ad-hoc tag searcher | any signed-in user |
| `/steam-global-search` | `SteamAppGlobalSearchPage` — the scoring workbench | any signed-in user |
| `/config` | `AdminPage` — job triggers and the settings table | `admin` only |
| `*` | — | redirects to `/` |

The route table itself is the authorisation check: `/config` is only registered when
`data.user.role == UserRoles.Admin`, so for everyone else the path falls through to the
catch-all and lands on the home page. The navbar hides the Configuration and API Docs links
the same way. This is a convenience, not a security boundary — the backend enforces the
same rule on `/settings` with its own `requireRole` middleware.

The API Docs link is **hardcoded to `http://localhost:8080/docs`** rather than derived from
`VITE_BACKEND_URL`.

### The scoring workbench

`/steam-global-search` is where the scoring config is assembled. It loads every reference
value from `GET /steam-app-ref-data` into a scrollable table — one row per genre, category
and tag — and lets you type a weight against each, filtering the list by substring, by type
and by "scored only". **Filter Games** posts the rows whose score is not zero to
`POST /steam-apps/apps-filtered-with-user-config` and lists the top matches beside it; app
names open their Steam store page in a new tab. **Update Reference Data** rebuilds the
dictionary from the catalogue on the backend.

The weights are page state only — nothing calls `/user-game-score`, so a config is lost on
reload. The error state of the results panel is also wired to the reference-data error
slot, so a failed search surfaces in the left-hand panel.

## The API layer

Each module under `src/api/` owns one backend resource and exports plain async functions —
there is no data-fetching library, no cache, and no global store. Pages call these directly
from `useEffect` and hold results in `useState`.

Four pieces hold it together:

* **[RequestApi.ts](src/api/RequestApi.ts)** — a small `fetch` wrapper constructed with a
  base URL, exposing `get`, `post`, `put` and `postDelete`. It builds the target with
  `new URL(point, base)`, sets the JSON content type, sends `credentials: 'include'` so the
  better-auth session cookie travels, throws
  `Error("<url> failed (<status>): <body>")` on a non-OK response, and parses the JSON
  body. Every module instantiates one at import time.
* **[AuthApi.ts](src/api/AuthApi.ts)** — the better-auth React client with the admin
  plugin, created against `VITE_BACKEND_URL`, plus thin `authClientSignUp`,
  `authClientSignIn` and `authClientSignOut` wrappers. `authClient.useSession()` is the
  session hook used by `App` and the navbar. The wrappers return a boolean and swallow the
  error object, so the sign-in form currently cannot show *why* a sign-in failed.
* **Schema validation at the boundary** — responses are passed through `ValidateSchema`
  from `@nct/vtp-common` before being returned. A response that drifts from its DTO throws
  at the API layer instead of becoming `undefined` inside a component. The scoring
  endpoints are the case to know about: the backend adds a computed `rating` to each row,
  which is not in `SteamAppSchema` and so is stripped here — ordering survives, the score
  itself does not reach the UI.
* **[EventBus.ts](src/api/EventBus.ts)** — an `EventTarget` singleton used to refresh
  sibling components without lifting state. Mutating calls dispatch an `EventName`;
  tables subscribe in a `useEffect` and refetch. `SettingsUpdated` is the only live pair
  today: the settings table refetches when a setting is created, updated or deleted.
  `SteamAppsUpdated` has two listeners and no publisher, `SortingReset` is dispatched and
  consumed only inside the unused `TableTextColumnName`, and `GamesUpdated`,
  `DropDownDataUpdated` and `UsersUpdated` are left over from the removed game-queue
  screens.

### Request cancellation

Each exported function keeps a module-level `AbortController`, aborts the previous call and
installs a fresh one before fetching, so a rapid sequence of calls leaves only the last one
standing. Callers filter the resulting rejection by checking `e.name !== "AbortError"`
before showing an error.

The controllers are shared per function, not per component, so two components calling the
same function cancel each other. A few calls opt out: the scheduler status getters pass a
throwaway `new AbortController().signal`, and `getFilteredByTagsApps` reuses
`acGetAllImportedApps`, so a search aborts the table's own load.