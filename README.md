# Telepharmacy Task Dashboard

A dashboard for pharmacists to monitor and manage incoming telepharmacy consultations in real time. Built with React, TypeScript, shadcn/ui, Tailwind CSS, and Framer Motion.

## Links

- **Live demo:** [pharm-care-front-assignment.vercel.app](https://pharm-care-front-assignment.vercel.app)
- **Frontend repository:** [besterdev/pharm-care-front-assignment](https://github.com/besterdev/pharm-care-front-assignment)
- **Backend repository:** [besterdev/telepharmacy-back-end-go](https://github.com/besterdev/telepharmacy-back-end-go)

## Overview

Pharmacists can review incoming consultation requests, filter the queue, inspect task details, and progress a consultation through its workflow without leaving the dashboard.

```text
Incoming request
      ↓
New → Start review → In progress → Mark complete → Completed
      ↓
The queue, summary, and live status update automatically
```

## Features

### Queue management

- Display consultations in grid or list view.
- Open consultation details in a drawer without leaving the queue.
- Advance a task through `new` → `in_progress` → `completed`.
- Use optimistic updates so the UI responds immediately and rolls back if the API request fails.
- Clearly handle loading, empty, and error states.

### Search and filters

- Search by customer name or consultation reason.
- Filter by service type: video call, voice call, or chat.
- Filter by consultation status.
- Filter by created date: today, this week, or a custom range from a Calendar popover.
- Debounce search input by 300 ms.
- Persist search and filters in the URL, including browser back/forward navigation.

### Live queue and data quality

- Poll for queue changes every 15 seconds while the tab is active.
- Notify users when new consultations arrive without a page refresh.
- Show summary counts for New, In progress, and Completed tasks.
- Normalize imperfect API data, including duplicate IDs, invalid dates, and unknown status values.
- Prevent updates to tasks that do not have a reliable unique ID, with a clear explanation in the drawer.

### UX and responsive design

- Icon-first sidebar to preserve workspace.
- Responsive layout: profile and daily plan are a desktop side panel and move above the task list on smaller screens.
- Details drawer becomes a bottom sheet on mobile.
- Built with shadcn/ui primitives, Lucide icons, Tailwind CSS, and Framer Motion for a minimal, interactive interface.

## User workflow

1. Open the dashboard to review current summary metrics and the incoming queue.
2. Use search, service, status, or date filters to narrow the list.
3. Select a task card to inspect its details and workflow in the drawer.
4. Select **Start review** to move a `new` consultation to `in_progress`.
5. Select **Mark complete** to move an `in_progress` consultation to `completed`.
6. The app syncs the change with the API and refreshes the queue on its polling interval.

## Tech stack

- React 18 and TypeScript
- Vite
- TanStack React Query
- Axios
- Tailwind CSS and shadcn/ui primitives
- Framer Motion
- Lucide React
- json-server for the local mock API
- Vitest

## Getting started

### Prerequisites

- Node.js 18+
- npm

### Install and run locally

Install dependencies:

```bash
npm install
```

Start the mock API in the first terminal:

```bash
npm run mock:api
```

Start the dashboard in a second terminal:

```bash
npm start
```

Open [http://localhost:5173](http://localhost:5173).

## API flow

### Local development

```text
Browser → /tasks → Vite proxy → json-server:4000/tasks → db.json
```

Local development uses `json-server`. Vite proxies `/tasks` to avoid browser CORS issues.

| Method  | Endpoint     | Purpose                      |
| ------- | ------------ | ---------------------------- |
| `GET`   | `/tasks`     | Fetch all consultations      |
| `PATCH` | `/tasks/:id` | Update a consultation status |

### Production

```text
Browser → /api/v1/tasks → Production API
```

Configure the production API origin in the deployment environment:

```text
VITE_API_BASE_URL=https://api.example.com
```

Do not include `/api/v1/tasks` in this value; the client appends that path automatically.

| Method  | Endpoint            | Purpose                      |
| ------- | ------------------- | ---------------------------- |
| `GET`   | `/api/v1/tasks`     | Fetch all consultations      |
| `PATCH` | `/api/v1/tasks/:id` | Update a consultation status |

The client accepts either response shape:

```json
[{ "id": "1", "status": "new" }]
```

or:

```json
{
  "data": [{ "id": "1", "status": "new" }]
}
```

`VITE_API_BASE_URL` is public browser configuration. Never place secrets, tokens, or service keys in it.

## Task data model

```ts
type Task = {
  id: string
  customerName: string
  serviceType: "video_call" | "voice_call" | "phone_call" | "chat"
  symptom: string | null
  status: "new" | "in_progress" | "completed"
  createdAt: string // ISO 8601 date
  completedAt?: string
}
```

[db.json](./db.json) contains local seed data, including intentionally imperfect records to validate edge-case handling.

## Project structure

```text
src/
├── components/ui/                 # Shared shadcn-style UI primitives
├── features/consultation-queue/
│   ├── components/                # Task card, filters, drawer, and queue UI
│   ├── hooks/                     # React Query and URL filter state
│   ├── services/                  # API service
│   ├── types/                     # Task domain types
│   └── utils/                     # Normalization, filtering, and display helpers
├── layouts/                       # Dashboard shell, header, and sidebar
├── pages/                         # Screen-level composition
├── routes/                        # Application routes
├── shared/                        # Shared hooks, API client, and utilities
└── styles/                        # Global styles and animations
```

## Quality checks

```bash
npm run typecheck
npm run lint
npm test
npm run build

# Run every check
npm run check
```

## Trade-offs and next improvements

- A 15-second polling interval is appropriate for this small dashboard; production real-time requirements would be better served by Server-Sent Events or WebSockets.
- Filtering currently runs on the client because the mock queue is small. Larger queues should support server-side filtering and pagination.
- Authentication and authorization must be enforced by the backend; the frontend API base URL is intentionally public configuration.
