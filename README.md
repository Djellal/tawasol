# تواصل · Tawasol

Plateforme de gestion des plaintes et des demandes d'audience pour une institution publique. Built with **SvelteKit (Svelte 5 runes)**, **Drizzle ORM (PostgreSQL)**, **better-auth**, **Paraglide** (ar / fr / en) and **Tailwind v4**.

## Features

- 📝 Citizens submit complaints (with optional file attachments) and meeting requests through public forms
- 🔢 Each request gets a tracking number — citizens can follow status & responses without an account
- 🏛️ Multiple **departments** ("هيئات") with auto-routing of every request
- 🛡️ Role-based access: `system_admin`, `department_admin`, `staff`, `citizen`
- 📊 Admin dashboard with stats, filters, response thread, status changes, archiving
- 🌐 Full i18n: Arabic (default, RTL), French and English
- 🔐 Email/password authentication (better-auth) with cookie sessions

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# edit DATABASE_URL to point to your PostgreSQL instance
# edit BETTER_AUTH_SECRET (32+ chars) and ORIGIN if needed

# 3. Push the schema to the database
npm run db:push        # uses $DATABASE_URL

# 4. Start dev server
npm run dev
```

Open <http://localhost:5173>. On first run you are redirected to **`/setup`** where you create the first **system admin** user. Default departments are seeded automatically.

## Routes

| Path                       | Audience                | Purpose                                  |
| -------------------------- | ----------------------- | ---------------------------------------- |
| `/`                        | public                  | Landing page                             |
| `/complaints/new`          | public                  | Submit a complaint                       |
| `/meetings/new`            | public                  | Request a meeting                        |
| `/track?n=CMP-2026-XXXXXX` | public                  | Track any request by tracking number     |
| `/auth/login`, `/register` | public                  | Sign in / create an account              |
| `/admin`                   | staff+                  | Dashboard (stats)                        |
| `/admin/complaints[/[id]]` | staff+ (dept-scoped)    | List, view, respond, change status       |
| `/admin/meetings[/[id]]`   | staff+ (dept-scoped)    | List, view, respond, schedule            |
| `/admin/departments`       | system_admin            | CRUD departments                         |
| `/admin/users`             | system_admin            | Set role and department for users        |
| `/setup`                   | first-run only          | Bootstrap the first system administrator |

Department-scoped staff (`department_admin`, `staff`) only see records for **their** department; `system_admin` sees everything.

## Useful scripts

```bash
npm run dev               # vite dev
npm run build             # production build
npm run check             # svelte-check (types + svelte)
npm run lint / format     # prettier + eslint
npm run db:push           # apply schema to db
npm run db:studio         # drizzle web UI
npm run auth:schema       # regenerate better-auth drizzle schema
```

## Architecture

```diagram
╭─────────────────────────╮     ╭───────────────────╮     ╭──────────────────╮
│  Citizen forms          │────▶│  SvelteKit server │────▶│  Drizzle /        │
│  /complaints, /meetings │     │  actions + load   │     │  PostgreSQL       │
╰─────────────────────────╯     ╰─────────┬─────────╯     ╰──────────────────╯
                                          │
                                          ▼
                                ╭───────────────────╮
                                │  Admin dashboard  │
                                │  /admin/*         │
                                │  role + dept scope│
                                ╰───────────────────╯
```

Status enums:

- Complaint: `pending → in_progress → responded → closed → archived`
- Meeting:   `pending → in_progress → scheduled / rejected → closed → archived`

## Translations

Messages live in `messages/{ar,fr,en}.json`. Default locale is **Arabic** (`ar`). Install the [Sherlock](https://marketplace.visualstudio.com/items?itemName=inlang.vs-code-extension) VS Code extension for inline editing.
