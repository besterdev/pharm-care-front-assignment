# Frontend Take-Home: Telepharmacy Task Dashboard

Thanks for taking the time to work on this! It should take a few hours — around 3 at
most, but feel free to spend longer if you'd like, no pressure. There's no need to
finish every stretch goal. What we care about most is how you structure and reason
about your code, and how you use AI tools along the way — not how much you build.

---

## Overview

Build a small dashboard pharmacists use to manage incoming telepharmacy consultation
requests: review the queue, open a request to see its details, and move it through its
workflow. The design is entirely up to you.

```
┌──────────────────────────────────────────────────────────────────┐
│  Telepharmacy Task Dashboard                                       │
├──────────────────────────────────────────────────────────────────┤
│  [ Search customer... ]    Service: [ All ▾ ]   Status: [ All ▾ ]  │
├──────────────────────────────────────────────────────────────────┤
│   ┌────────────────────────┐   ┌────────────────────────┐         │
│   │ Somchai P.      ● New   │   │ Anong W.    ◐ In prog.  │         │
│   │ 📹 Video call           │   │ 📹 Video call           │        │
│   │ "Persistent dry cough"  │   │ "Chest pain, short..."  │        │
│   │ 09:12                   │   │ 08:45                   │        │
│   └────────────────────────┘   └────────────────────────┘         │
└──────────────────────────────────────────────────────────────────┘
      ↑ click a card → open details + advance the status
```

### Data model

```ts
type Task = {
  id: string;
  customerName: string;
  serviceType: 'video_call' | 'voice_call' | 'chat';
  symptom: string;      // reason for the consultation
  status: 'new' | 'in_progress' | 'completed';
  createdAt: string;    // ISO date string
};
```

A seed file (`db.json`) is included — see [Running the mock API](#running-the-mock-api).

---

## Requirements

### Core (required)

1. **List view** — fetch and display the tasks.
2. **Detail view** — clicking a task opens a drawer, modal, or route (`/task/:id`).
3. **Status update** — advance a task `new → in_progress → completed`, reflected in the UI.

### Stretch goals (optional)

- **Request states** — handle loading, empty, and error states clearly.
- **Filter & search** — by `serviceType`, `status`, and customer name.
- **Date-range filter** — by `createdAt` (today, this week, custom range).
- **Live queue** — poll or simulate incoming requests so new tasks appear without a refresh.
- **Summary bar** — counts per status (e.g. New: 4 · In progress: 2 · Completed: 3).
- Persist filters and search in the URL.
- Debounce the search input.
- Add at least one meaningful unit test.
- Support a responsive layout.

### 💡 Have an improvement idea of your own?

> **We'd genuinely love to see it.** If you spot something you'd add or do differently —
> a feature, a UX tweak, a better approach — feel free to build it or jot it down. Sharing
> your own ideas is a big plus, and we'd be very pleased to hear them.

---

## Debugging the seed data

Real APIs return imperfect data. `db.json` contains some **intentional issues** that
break the data model. Your app shouldn't crash, render `undefined`/`Invalid Date`, or
silently drop them — handle them deliberately (fallback, filter, or flag; your call).

---

## Ground Rules

- **React and TypeScript required.**
- Any CSS framework or UI library you like (MUI, Tailwind, Chakra, plain CSS, etc.).
- Write code as if it were going into a real, growing codebase.
- **UX/UI is up to you** — aim for something clean and pleasant.
- **Use AI tools freely** — just understand your own code; we'll discuss it afterward.

---

## Running the mock API

We recommend [`json-server`](https://github.com/typicode/json-server):

```bash
npx json-server --watch db.json --port 4000
```

This gives you `http://localhost:4000/tasks` with filtering (`?status=new`), search
(`?q=john`), and `PATCH`/`PUT`. Another mock service (MockAPI.io, MSW, etc.) is fine —
just document it.

### Run this project

Install dependencies once:

```bash
npm install
```

Start the task API in one terminal:

```bash
npm run mock:api
```

Then start the dashboard in a second terminal:

```bash
npm start
```

The dashboard requests `/tasks`, which Vite proxies to `http://localhost:4000`.
With the API running, status updates use `PATCH /tasks/:id` and persist in `db.json`.
If the API is unavailable, the dashboard displays an error state with a retry action.

The frontend data layer uses Axios for HTTP and TanStack React Query for task caching,
refreshing, and optimistic status updates with rollback on a failed request.
Responses are treated as `unknown` at the network boundary and normalized before they
reach UI components, so unsupported IDs, statuses, service types, and dates render safe
fallbacks instead of crashing the queue.

Run all current quality checks with:

```bash
npm run check
```

This runs TypeScript, ESLint, the existing unit tests, and a production build.

### Shareable queue filters

Search and filters are reflected in the URL (`q`, `service`, `status`, `range`, `from`,
and `to`). Search is debounced before it creates a browser-history entry, so reloading,
sharing a link, or using browser Back/Forward restores the committed queue state.

### Live queue

The queue polls `/tasks` every 15 seconds, including while the tab is in the background.
When another process adds tasks to the mock API, new cards appear automatically and a
notification reports the number of incoming consultations and takes the pharmacist to
the New queue.

### Data integrity

The mock intentionally includes invalid data. The dashboard flags invalid timestamps,
IDs, statuses, and service types instead of silently dropping them. A missing or duplicate
ID disables status updates because the mock API cannot safely identify which record to
patch.

### Trade-offs and next steps

- The mock API uses polling rather than WebSocket/SSE so the project stays easy to run.
- The drawer and calendar are loaded only when opened to keep the initial bundle smaller.
- Component and hook integration tests are the next priority; they are intentionally not
  included in the current scope.

---

## Deliverables

A **GitHub repo** (or zip) with:

1. Your source code.
2. A short `README` — how to run it, what you'd improve with more time, trade-offs, and
   any improvement ideas of your own.
3. Runs with `npm install && npm start` (plus the mock API command above).

**Bonus:** deploy it live (Vercel, Netlify, GitHub Pages, etc.), include the URL, and
note how you made the mock API reachable.

---

## Evaluation

- **Correctness** — the core features work.
- **Code structure** — clear separation of concerns.
- **Maintainability** — clear naming, reusable components, easy to extend.
- **TypeScript quality** — well-typed, readable code.
- **State handling** — async, loading, and error states.
- **UX polish** — a clean, pleasant interface.

We'll discuss your decisions afterward, so build it the way you'd want to defend it. Good
luck, and have fun!
