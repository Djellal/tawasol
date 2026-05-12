# Tawasol Project Context

Tawasol is a professional web platform designed for an institution to manage citizen complaints and meeting requests. It focuses on accessibility, transparency, and efficient internal routing through a multi-department structure.

## Technical Stack

- **Framework:** [SvelteKit](https://kit.svelte.dev/) (Svelte 5 Runes)
- **Language:** TypeScript
- **Database & ORM:** [Drizzle ORM](https://orm.drizzle.team/) with [libSQL/SQLite](https://turso.tech/libsql)
- **Authentication:** [Better Auth](https://www.better-auth.com/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Internationalization (i18n):** [Paraglide JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) (supporting Arabic, French, and English)
- **Validation:** Standard HTML5 validation + SvelteKit server-side actions

## Core Concepts & Architecture

### Entities
- **Departments (`هيئات`):** Internal units (e.g., General Secretariat, HR, Legal). Every complaint or meeting request must be assigned to exactly one department.
- **Complaints:** Issues submitted by citizens. Lifecycle: `pending` → `in_progress` → `responded` → `closed` → `archived`. Supports file attachments.
- **Meeting Requests:** Appointments requested by citizens. Lifecycle: `pending` → `in_progress` → `scheduled`/`rejected` → `closed` → `archived`.
- **Tracking Number:** A unique alphanumeric ID (e.g., `CMP-2026-XXXXXX`) generated for every submission, allowing citizens to track progress without necessarily creating an account.

### Roles & Permissions
- `system_admin`: Full access to all departments, users, and system settings.
- `department_admin`: Administrative access restricted to their assigned department. Can manage staff within the department.
- `staff`: Operational access restricted to their assigned department. Can respond to complaints and manage meetings.
- `citizen`: Default role for registered users. Can view their own history and track submissions.

### i18n Strategy
- **Arabic** is the primary and default language (RTL).
- Translations are managed in `messages/{ar,fr,en}.json`.
- The `paraglide` runtime is used for type-safe translations and routing.

## Development Workflow

### Key Commands
- `npm run dev`: Start the development server.
- `npm run build`: Build for production.
- `npm run check`: Type-check and Svelte-check.
- `npm run format`: Format code with Prettier.
- `npm run lint`: Lint with ESLint.
- `npm run db:push`: Push local schema changes to the SQLite database.
- `npm run db:studio`: Open Drizzle Studio for data exploration.
- `npm run auth:schema`: Update the authentication schema if `better-auth` config changes.

### Coding Conventions
- **Svelte 5 Runes:** Always use `$state`, `$derived`, `$effect`, and `$props`. Avoid legacy Svelte 4 syntax.
- **Database Access:** Use the `db` instance from `$lib/server/db`. Prefer Drizzle's relational query API when appropriate.
- **Form Actions:** Use SvelteKit actions for all data mutations. Implement proper error handling and progressive enhancement.
- **Type Safety:** Ensure all database schemas, form data, and component props are strictly typed.
- **RTL Support:** Use Tailwind's logical properties or `dir="rtl"` aware classes.

### Project Structure
- `src/lib/server/db/schema.ts`: Primary database schema definitions.
- `src/lib/server/auth.ts`: Authentication configuration and plugins.
- `src/lib/paraglide/`: Generated i18n runtime.
- `src/routes/admin/`: Protected admin dashboard area.
- `messages/`: Translation source files.

## Initial Setup
On a fresh installation, navigate to `/setup` to create the first `system_admin` user. This route is only available if no users exist in the database.
