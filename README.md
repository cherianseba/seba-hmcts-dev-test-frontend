# HMCTS Task Manager — Frontend

A React task-management interface for HMCTS caseworkers, served by the project's Express and Nunjucks application and styled with GOV.UK Frontend.

The task list provides search, a status dropdown, task creation and editing, and confirmed deletion. The Express server proxies browser requests to the backend, keeping API calls same-origin in the browser.

## Requirements

- Node.js 18 or later
- Corepack (included with supported Node.js installations)
- The [HMCTS task backend](https://github.com/cherianseba/seba-hmcts-dev-test-backend) for task data and actions

## Run locally on Windows

Open a terminal in this repository:

```powershell
corepack yarn install
corepack yarn build
```

Start the backend separately; by default, the frontend expects it at `http://localhost:4000`.

For the HTTPS development server, run from Git Bash in the frontend repository:

```bash
corepack yarn start:dev
```

Open <https://localhost:3100>. The development server generates a self-signed certificate with `openssl` if one is not already present; accept the browser's local-certificate warning.

Alternatively, start the built app over HTTP from PowerShell:

```powershell
$env:NODE_ENV = 'production'
corepack yarn ts-node -r tsconfig-paths/register src/main/server.ts
```

Open <http://localhost:3100>. Keep both the frontend and backend terminals running.

To use a backend at a different base URL, set `TASKS_API_URL` before starting the frontend. For example:

```powershell
$env:TASKS_API_URL = 'http://localhost:4001'
```

## Backend API

The default backend base URL is `http://localhost:4000`. The frontend proxy exposes these same-origin routes and forwards them to the backend's `/api/tasks` endpoints.

| Method   | Frontend route          | Purpose                                         |
| -------- | ----------------------- | ----------------------------------------------- |
| `GET`    | `/api/tasks`            | List tasks                                      |
| `POST`   | `/api/tasks`            | Create a task                                   |
| `GET`    | `/api/tasks/:id`        | Retrieve a task                                 |
| `PUT`    | `/api/tasks/:id`        | Update title, description, status, and due date |
| `PATCH`  | `/api/tasks/:id/status` | Update a task's status                          |
| `DELETE` | `/api/tasks/:id`        | Delete a task                                   |

Create and update request bodies use the backend's JSON contract:

```json
{
  "title": "Review case documents",
  "description": "Check the latest documents",
  "status": "OPEN",
  "dueDateTime": "2026-10-15T14:30:00"
}
```

Valid statuses are `OPEN`, `IN_PROGRESS`, and `COMPLETED`. `dueDateTime` is a local date-time string (`LocalDateTime`, without a timezone suffix). Task responses include `id`, `title`, `description`, `status`, `dueDateTime`, `createdAt`, and `updatedAt`.

## Tests and checks

```powershell
corepack yarn build
corepack yarn test:routes
corepack yarn eslint src/main/assets/js/TaskManager.tsx src/main/routes/api.ts src/test/routes/api.ts
corepack yarn stylelint src/main/assets/scss/main.scss -q
```

The route tests cover list, retrieve, create, update, status change, delete, and upstream error forwarding.
