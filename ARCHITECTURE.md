# HighScore Web — Architecture

A clean, layered architecture so the codebase scales without turning into a
ball of mud. Data flows **one direction**: UI → service → http client → backend.
Nothing below knows about the layer above it.

## Layers

```
app/                         Presentation (Next.js App Router)
  (routes)/page.tsx          Screens — render state, dispatch to services
  dashboard/*Tab.tsx         Co-located feature components

components/                  Shared, presentation-only widgets
  LottieIcon, Reveal, PwaRegister …

lib/
  api/                       Infrastructure (transport)
    config.ts                API_BASE / WS_BASE (env-driven)
    endpoints.ts             Endpoint registry — no magic strings
    session.ts               Token persistence (the ONLY storage toucher)
    http.ts                  Request client: bearer + envelope + 401 refresh
    realtime.ts              WebSocket URL builders
  domain/
    models.ts                Pure domain types (User, LeaderboardEntry, …)
  services/                  Application layer — one module per feature
    auth.service.ts          /auth/* + session side effects
    profile.service.ts       user read/update, avatar
    dashboard.service.ts     leaderboard + rank
    game.service.ts          matchmaking (online, friends, challenge)
    quiz.service.ts          point crediting
    payment.service.ts       Paystack initialize/verify
    performance.service.ts   analytics (+ graceful fallback)
    referral.service.ts      code + stats (+ graceful fallback)
    materials.service.ts     downloadable materials
  providers/AuthProvider.tsx Cross-cutting auth state (React context)
  api.ts                     Backward-compatible facade (barrel) over the above
```

## Dependency rule

```
app / components  ──▶  lib/services  ──▶  lib/api/http  ──▶  backend
        │                   │                  │
        └────────────▶ lib/domain/models ◀─────┘   (types only, no behaviour)
```

- **Screens** never call `fetch` and never build URLs. They call a service.
- **Services** never persist tokens or parse envelopes — they call `api()`.
- **`api/http`** is the single place that talks to the network.
- **`api/session`** is the single place that touches `localStorage`/cookies.
- **`domain/models`** holds pure types shared by all layers (no imports).

## Why this scales

- **Separation of concerns** — transport, persistence, business logic and UI
  are isolated; each has one reason to change.
- **Low coupling** — features depend on small service interfaces, not a global
  client. Swapping the backend or auth scheme touches `api/` only.
- **Modularity** — adding a feature = add `services/x.service.ts` + a screen.
- **Testability** — services are plain functions over `api()`, trivially
  mockable; the client is the only thing that needs network stubbing.
- **No magic strings** — every path lives in `endpoints.ts`.

## Migration note

`lib/api.ts` is a **facade** that re-exports the layers, so existing
`@/lib/api` imports keep working with zero behaviour change. New code should
import the specific module it needs, e.g.:

```ts
import { authApi } from "@/lib/services/auth.service";
import { performanceApi } from "@/lib/services/performance.service";
```
