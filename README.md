# Taskr Backend — Express + lowdb

REST API for the Taskr todo app. Uses **lowdb** to persist data in a local `db.json` file — no external database needed.

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `GET` | `/api/todos?filter=all\|active\|completed` | List todos + stats |
| `POST` | `/api/todos` | Create a todo |
| `PATCH` | `/api/todos/:id` | Update text / completed / priority |
| `DELETE` | `/api/todos/:id` | Delete a todo |
| `DELETE` | `/api/todos/completed/clear` | Delete all completed todos |

### Todo shape

```json
{
  "id": "uuid",
  "text": "Buy milk",
  "completed": false,
  "priority": "normal",
  "createdAt": 1712345678901,
  "updatedAt": 1712345699000
}
```

`priority` is one of `normal` | `medium` | `high`

---

## Local Development

```bash
npm install
npm run dev      # uses node --watch for hot reload
```

Server runs on http://localhost:3001

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Server port |
| `NODE_ENV` | `development` | Environment |
| `DB_PATH` | `./data/db.json` | Path to JSON database file |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed frontend origin |

---

## Docker

The Dockerfile has three stages: `deps`, `development`, `production`.

```bash
# Build production image
docker build --target production -t taskr-api .

# Run it
docker run -p 3001:3001 -v taskr-data:/data taskr-api
```

The `/data` volume is where `db.json` lives — mount it to persist data across restarts.
