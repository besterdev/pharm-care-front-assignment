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

### Local development

Run the API and dashboard in separate terminals:

```bash
npm run mock:api
npm start
```

Without environment configuration, the dashboard requests `/tasks` and Vite proxies it
to `http://localhost:4000`.

### Vercel deployment with MockAPI.io

`json-server` cannot run as a persistent process on a static Vercel deployment. Use a
MockAPI.io project so `GET /tasks`, polling, and `PATCH /tasks/:id` remain available.

1. Create a MockAPI.io project and an empty `tasks` resource.
2. Seed it once from `db.json`:

   ```bash
   npm run seed:mock -- https://<project>.mockapi.io/api/v1
   ```

3. In Vercel → Project Settings → Environment Variables, add this value to Production
   and Preview:

   ```text
   VITE_API_BASE_URL=https://<project>.mockapi.io/api/v1
   ```

   Use the project base URL without `/tasks`. This is a public browser configuration,
   so do not store secrets in it.

4. Redeploy the project after adding or changing the environment variable. Vercel should
   detect Vite automatically; the build command is `npm run build` and output is `dist`.

To test the remote API locally, copy `.env.example` to `.env.local`, set the same URL,
and restart `npm start`.

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
