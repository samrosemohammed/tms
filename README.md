# Task Manager (Client + Server)

[![Demo](https://img.shields.io/badge/Demo-View-blue)](https://github.com/user-attachments/assets/d155d7a8-5a18-4c1e-b434-d311bf87385f)

## Monorepo

- Client: [client](client) (React + Vite + Tailwind)
- Server: [server](server) (NestJS + Prisma + PostgreSQL/Supabase)

## Tech Stack

- Client: React, Vite, Tailwind CSS
- Server: NestJS, Prisma, PostgreSQL/Supabase
- ORM Schema: [`prisma/schema.prisma`](server/prisma/schema.prisma)
- CORS: configured in [`server/src/main.ts`](server/src/main.ts)

## Prerequisites

- Node.js 18+
- PostgreSQL/Supabase (set `DATABASE_URL` in [server/.env](server/.env), e.g. `postgresql://user:pass@localhost:5432/tms`)

## Install

```sh
# From repo root
cd server && npm install
cd ../client && npm install
```

## Database & Prisma

```sh
# Generate Prisma client and sync schema
cd server
npx prisma generate
npx prisma db push
```

Prisma client is used via [`PrismaService`](server/src/prisma/prisma.service.ts).

## Development

```sh
# Start server (http://localhost:3000)
cd server
npm run start:dev

# In another terminal: start client (http://localhost:5173)
cd client
npm run dev
```

Client data fetching is handled by [`TaskProvider`](client/src/context/task-context.tsx).

## API

- Root: GET `/` → Hello World from [`AppController`](server/src/app.controller.ts)
- Tasks (see [`TasksController`](server/src/tasks/tasks.controller.ts)):
  - GET `/tasks`
  - POST `/tasks`
  - GET `/tasks/:id`
  - PATCH `/tasks/:id`
  - DELETE `/tasks/:id`

## Lint

```sh
# Server
cd server && npm run lint

# Client
cd client && npm run lint
```

## Production

```sh
# Server
cd server
npm run build
npm run start:prod  # uses PORT or 3000

# Client
cd client
npm run build
npm run preview
```

## Notes

- Update allowed origins in [`server/src/main.ts`](server/src/main.ts) if client runs on a different host.
- Task schema lives in [`server/prisma/schema.prisma`](server/prisma/schema.prisma). Client types: [`client/src/types/task.ts`](client/src/types/task.ts).
