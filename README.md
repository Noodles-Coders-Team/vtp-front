# vtp-front

The web client for **VTP** (Video Tracking and Planning) — the UI for the game recording
queue, the tag and genre scoring that ranks it, the CSV imports, and the channel view
chart.

React 19 + Vite 8 + TypeScript, styled with Bootstrap 5 and charted with Recharts. It is a
pure SPA: no SSR, no server of its own, every piece of data comes from `vtp-backend` over
`fetch`.

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

No trailing slash: every API module appends its own (`VITE_BACKEND_URL + "/games/"`).
Vite only exposes variables prefixed `VITE_`. There is no fallback and no startup check —
if the variable is missing, the value is the string `"undefined"` and requests go to
`/undefined/games/`, which shows up as failed fetches rather than a clear error.

> **If `@nct/vtp-common` cannot be resolved**, the sibling package has not been built. It
> is linked with `"@nct/vtp-common": "file:../vtp-common"`, so it must sit next to this
> repo on disk, and its `dist/` is git ignored. Clone
> [vtp-common](https://github.com/Noodles-Coders-Team/vtp-common), run `npm install &&
> npm run build` there, then re-run `npm install` here. Re-run its build after any schema
> change — the `file:` link serves `dist/`, not `src/`.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR on port 5173 |
| `npm run build` | `tsc -b` then `vite build` → `dist/` |
| `npm run preview` | Serves the built `dist/` locally |
| `npm run lint` | ESLint 10 flat config |

## Project layout

```
src/
  main.tsx        entry point, mounts BrowserRouter and imports Bootstrap CSS
  App.tsx         route table and the fixed navbar frame
  pages/          one component per route
  components/     feature components, grouped by the page that owns them
    commonComponents/   layout and table primitives reused across pages
  api/            one module per backend resource, plus RequestApi and EventBus
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

### Routes

| Path | Page | What it does |
| --- | --- | --- |
| `/` | `HomePage` | Static welcome card |
| `/config` | `ConfigurationPage` | Tag/genre drop-down values with their scores, and the key/value settings table |
| `/games` | `GamesPage` | Create a game, and the scored game table with `can_record` / `discussed` filters |
| `/import` | `ImportCsvPage` | Three CSV upload cards — games, channel data, YouTube table export |
| `/channel-data` | `ChannelDataPage` | Recharts area chart of channel views, with a "last N days" slider |
| `*` | — | Inline "Page not found" |

The navbar also links to the backend's Swagger UI, **hardcoded to
`http://localhost:8080/docs`** rather than derived from `VITE_BACKEND_URL`.

## The API layer

Each module under `src/api/` owns one backend resource and exports plain async functions —
there is no data-fetching library, no cache, and no global store. Pages call these
directly from `useEffect` and hold results in `useState`.

Three pieces hold it together:

* **[RequestApi.ts](src/api/RequestApi.ts)** — a small `fetch` wrapper constructed with a
  base URL, exposing `get`, `post`, `put` and `postDelete`. It sets the JSON content type,
  throws `Error("<url> failed (<status>): <body>")` on a non-OK response, and parses the
  JSON body. Every module instantiates one at import time.
* **Schema validation at the boundary** — responses are passed through `ValidateSchema`
  from `@nct/vtp-common` before being returned, and request bodies are validated on the
  way out. A response that drifts from its DTO throws at the API layer instead of becoming
  `undefined` inside a component.
* **[EventBus.ts](src/api/EventBus.ts)** — an `EventTarget` singleton used to refresh
  sibling components without lifting state. Mutating calls dispatch an `EventName`
  (`GamesUpdated`, `DropDownDataUpdated`, `SettingsUpdated`, `UsersUpdated`,
  `SortingReset`); tables subscribe in a `useEffect` and refetch. This is how creating a
  game updates the table underneath the form.

`ImportCsvComponent` is the exception: it posts `FormData` with `fetch` directly, because
`RequestApi` always sets a JSON content type and would break the multipart boundary.

Note that `RequestApi` runs its `point` argument through `encodeURIComponent`, which
escapes `/`. Single-segment paths (`'create'`, `'with-info'`, `'genre'`) are fine;
multi-segment ones are not.

## Conventions and current limitations

* **No authentication.** There is no login, and no token is attached to requests — the
  backend does not check for one. `UsersApi` and the components under
  `userPageComponent/` and `userComponent/` are **unrouted**: reachable from no page, left
  over from a half-removed feature.
* **State lives in components.** No Redux, no Context, no React Query. Cross-component
  refreshes go through `EventBus`; anything else is prop drilling.
* **Requests are not cancelled.** Pages guard against setting state after unmount with a
  local flag, but concurrent refetches are last-write-wins.
* The production bundle is a single ~666 kB chunk (~199 kB gzipped); Vite warns about it
  on every build. Nothing is code-split or lazily routed.
