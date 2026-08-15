# SecondHand ET — Backend (API)

**Vintage Challenge – Round 1 | VinTech PLC**
NestJS + TypeORM + PostgreSQL REST API powering the SecondHand ET used-goods marketplace.

> Frontend repo: `secondhand-et-web` (see its own README for setup)
> This document is the **source of truth for the API contract** — the frontend repo's README links back to this file. Keep both in sync when routes change.

> **Change log:** this repo was rebuilt from a fresh `nest new` scaffold, switching from Prisma to **TypeORM**, and adopting a `modules/<feature>/{controller, usecase, persistence}` structure (following the `lms-api` reference project) instead of the earlier module-per-feature-flat layout. This README reflects the current structure — earlier Prisma-based instructions are superseded.

---

## Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [Folder Structure](#2-folder-structure)
3. [Database](#3-database)
4. [Entities (TypeORM)](#4-entities-typeorm)
5. [Environment Variables](#5-environment-variables)
6. [Local Setup](#6-local-setup)
7. [Migrations](#7-migrations)
8. [Auth & Roles](#8-auth--roles)
9. [API Documentation](#9-api-documentation)
10. [Error Response Format](#10-error-response-format)
11. [Swagger](#11-swagger)
12. [Git Workflow](#12-git-workflow)
13. [Build Status](#13-build-status)
14. [Milestones](#14-milestones)
15. [Security Checklist](#15-security-checklist)

---

## 1. Tech Stack

| Concern      | Choice                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------- |
| Framework    | NestJS (TypeScript)                                                                               |
| Database     | PostgreSQL 16 (Docker, **port 5433** — 5432 is taken by a separate local project on this machine) |
| ORM          | **TypeORM** (switched from Prisma)                                                                |
| Migrations   | TypeORM CLI, `synchronize: false` — migrations only, no auto schema sync                          |
| Auth         | JWT (access + refresh) via `@nestjs/passport` + `passport-jwt`                                    |
| Validation   | `class-validator` / `class-transformer` DTOs                                                      |
| File uploads | Multer → Cloudinary (signed upload)                                                               |
| API docs     | Swagger, live at `/api/docs`                                                                      |
| Deployment   | Render / Railway                                                                                  |

**Why TypeORM over Prisma:** the team standardized on the `lms-api` reference project's conventions (repository pattern, entity classes with decorators, usecase-layer separation of commands/queries) for consistency across projects — TypeORM's decorator-based entities fit that pattern more directly than Prisma's schema-file-plus-generated-client approach.

---

## 2. Folder Structure

Convention follows the `lms-api` reference project. Every feature module lives under `src/modules/` and is split into three layers:

- **`controller/`** — HTTP layer only (routes, request/response DTOs, calls into usecase layer)
- **`usecase/`** — business logic, split into **commands** (writes) and **queries** (reads)
- **`persistence/`** — TypeORM entity + a custom repository extending `Repository<T>`

```
src/
├── libs/
│   └── common/
│       └── entities/
│           └── base.entity.ts        # shared id, timestamps, soft-delete, audit fields
│
├── database/
│   └── data-source.ts                # TypeORM CLI migration config
│
├── modules/
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── persistence/
│   │   │   └── users/
│   │   │       ├── user.entity.ts
│   │   │       └── user.repository.ts
│   │   ├── usecase/
│   │   │   ├── commands/             # e.g. create-user, update-user
│   │   │   └── queries/              # e.g. get-user-by-id, get-user-profile
│   │   └── controller/
│   │       └── users.controller.ts
│   │
│   ├── auth/                          # next up — register/login/JWT guards
│   ├── categories/                    # not yet rebuilt
│   ├── listings/                      # not yet rebuilt
│   ├── dashboard/                     # not yet rebuilt
│   ├── saved-listings/                # not yet rebuilt
│   ├── ratings/                       # not yet rebuilt
│   ├── reports/                       # not yet rebuilt
│   └── uploads/                       # not yet rebuilt
│
├── app.module.ts
├── app.controller.ts
├── app.service.ts
└── main.ts
```

**Rule of thumb:** a controller should only ever call into its module's `usecase/` layer — never reach into `persistence/` directly. A usecase can use its own module's repository plus any other module's repository it genuinely needs (e.g. `listings` usecases will need to read from `users` persistence to attach seller info).

---

## 3. Database

- PostgreSQL 16, running in Docker, **mapped to host port 5433** (not the default 5432, which is occupied by a separate local project's native Postgres install on this machine). Keep this in mind when connecting via any GUI client (pgAdmin, TablePlus, etc.) — the connection port is 5433.
- `docker-compose.yml` defines the `postgres` service with `user` / `password` / `secondhand_et` credentials, matching `DATABASE_URL` in `.env`.
- `synchronize: false` in the TypeORM config — schema changes only happen through reviewed migrations, never silently auto-applied. This is deliberate: safer, reviewable in PRs, and matches the project's git workflow discipline.

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: secondhand_et
    ports:
      - '5433:5432'
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

---

## 4. Entities (TypeORM)

### 4.1 BaseEntity (shared, abstract)

Every entity extends this — gives every table a UUID primary key, timestamps, soft-delete, and audit fields for free.

```typescript
// src/libs/common/entities/base.entity.ts
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @Column({ nullable: true })
  createdBy?: string;

  @Column({ nullable: true })
  updatedBy?: string;
}
```

> `tsconfig.json` needs `"strictPropertyInitialization": false` — TypeORM entities don't use constructors to set fields, which otherwise conflicts with TypeScript strict mode.

### 4.2 UserEntity — built

```typescript
// src/modules/users/persistence/users/user.entity.ts
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../../libs/common/entities/base.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  nationalIdRef?: string; // reference/verification flag only, never raw ID data
}
```

### 4.3 Remaining entities — planned shape

Not yet built, but the target schema (carried over from the earlier Prisma version, adapted to TypeORM) is:

```typescript
@Entity('categories')
export class CategoryEntity extends BaseEntity {
  @Column({ unique: true }) name: string;
  @Column({ unique: true }) slug: string;
}

export enum Condition {
  BRAND_NEW = 'BRAND_NEW',
  LIGHTLY_USED = 'LIGHTLY_USED',
  FAIR_CONDITION = 'FAIR_CONDITION',
}
export enum ListingStatus {
  ACTIVE = 'ACTIVE',
  SOLD = 'SOLD',
  REMOVED = 'REMOVED',
}

@Entity('listings')
export class ListingEntity extends BaseEntity {
  @Column() title: string;
  @Column('text') description: string;
  @Column('decimal') price: number;
  @Column({ type: 'enum', enum: Condition }) condition: Condition;
  @Column({ type: 'enum', enum: ListingStatus, default: ListingStatus.ACTIVE })
  status: ListingStatus;
  @Column() city: string;
  @Column({ nullable: true }) neighborhood?: string;
  @Column({ default: 0 }) viewCount: number;

  @ManyToOne(() => UserEntity) seller: UserEntity;
  @Column() sellerId: string;
  @ManyToOne(() => CategoryEntity) category: CategoryEntity;
  @Column() categoryId: string;
  @OneToMany(() => ListingImageEntity, (img) => img.listing)
  images: ListingImageEntity[];
}

@Entity('listing_images')
export class ListingImageEntity extends BaseEntity {
  @Column() url: string;
  @ManyToOne(() => ListingEntity, (l) => l.images, { onDelete: 'CASCADE' })
  listing: ListingEntity;
  @Column() listingId: string;
  @Column({ default: 0 }) sortOrder: number;
}

@Entity('saved_listings')
@Unique(['userId', 'listingId'])
export class SavedListingEntity extends BaseEntity {
  @ManyToOne(() => UserEntity) user: UserEntity;
  @Column() userId: string;
  @ManyToOne(() => ListingEntity) listing: ListingEntity;
  @Column() listingId: string;
}

@Entity('ratings')
export class RatingEntity extends BaseEntity {
  @Column('int') score: number;
  @Column({ nullable: true }) comment?: string;
  @ManyToOne(() => UserEntity) fromUser: UserEntity;
  @Column() fromUserId: string;
  @ManyToOne(() => UserEntity) toUser: UserEntity;
  @Column() toUserId: string;
}

@Entity('reports')
export class ReportEntity extends BaseEntity {
  @Column() reason: string;
  @ManyToOne(() => ListingEntity) listing: ListingEntity;
  @Column() listingId: string;
  @ManyToOne(() => UserEntity) reportedBy: UserEntity;
  @Column() reportedById: string;
}
```

---

## 5. Environment Variables

`.env`

```
DATABASE_URL=postgresql://user:password@localhost:5433/secondhand_et
JWT_ACCESS_SECRET=change_me
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_SECRET=change_me
JWT_REFRESH_EXPIRES=7d
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
PORT=4000
CORS_ORIGIN=http://localhost:3000
```

Note the port in `DATABASE_URL` is **5433**, matching the Docker mapping above — easy to typo as 5432 out of habit.

---

## 6. Local Setup

```bash
git clone https://github.com/<org>/secondhand-et-api.git
cd secondhand-et-api
npm install
cp .env.example .env        # fill in real values, confirm port 5433

docker-compose up -d        # starts Postgres on host port 5433

npm run migration:run       # applies all committed migrations
npm run start:dev           # API on http://localhost:4000
```

---

## 7. Migrations

TypeORM CLI config lives at `src/database/data-source.ts`. npm scripts:

```json
"migration:generate": "typeorm-ts-node-commonjs migration:generate -d src/database/data-source.ts",
"migration:run": "typeorm-ts-node-commonjs migration:run -d src/database/data-source.ts",
"migration:revert": "typeorm-ts-node-commonjs migration:revert -d src/database/data-source.ts"
```

Workflow when you change an entity:

```bash
npm run migration:generate -- src/database/migrations/DescriptiveName
# review the generated SQL in the new migration file before running it
npm run migration:run
```

**Status:** the first migration (`init`) has been generated, reviewed, and run successfully — the `users` table exists in Postgres with all correct columns and constraints, confirmed end-to-end.

---

## 8. Auth & Roles

_(Design carried over from the original plan — not yet implemented, next module up.)_

- Single `User` model — any user can list items and buy items.
- Access token: JWT, 15 min expiry. Refresh token: JWT, 7 day expiry, httpOnly cookie.
- `JwtAuthGuard` applied globally; public routes marked explicitly with `@Public()`.
- Ownership enforced server-side in the usecase layer, never trusted from the frontend.

---

## 9. API Documentation

No endpoints are live yet beyond the default root route — `UsersModule`'s `controller/` and `usecase/` layers aren't built, and no other module has been rebuilt since the reset. The full planned API contract (routes, request/response shapes for auth, users, categories, listings, dashboard, saved-listings, ratings, reports) carries over unchanged from the original design — see the project's `marketplace.docx` for the complete reference. It will be re-added here endpoint-by-endpoint as each controller is actually built, so this section always reflects what's real and callable, not just planned.

---

## 10. Error Response Format

```json
{
  "statusCode": 400,
  "message": "email must be a valid email",
  "error": "Bad Request",
  "path": "/auth/register",
  "timestamp": "2026-08-14T10:00:00.000Z"
}
```

---

## 11. Swagger

Live at `http://localhost:4000/api/docs` once `npm run start:dev` is running. Currently shows only the default root route — routes appear here automatically as each module's controller is built and decorated with `@ApiTags()` / `@ApiOperation()`.

---

## 12. Git Workflow

- `main` — deployable, protected.
- `dev` — integration branch.
- Feature branches: `feat/auth-module`, `feat/listings-crud`.
- Commit convention: `feat(users): add UserEntity and initial migration`, `fix(config): correct tsconfig strictPropertyInitialization`.
- Small PRs into `dev`; merge to `main` at each milestone.

---

## 13. Build Status

| Item                                                                                     | Status                                                 |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Repo scaffold                                                                            | Rebuilt clean after removing earlier Prisma attempt    |
| Folder convention (`modules/<feature>/{controller,usecase,persistence}`)                 | Established, following `lms-api` reference             |
| Docker Postgres (port 5433)                                                              | Running                                                |
| `.env` (DB URL, JWT placeholders, PORT, CORS)                                            | Set                                                    |
| TypeORM config (`synchronize: false`, CLI data-source)                                   | Done                                                   |
| `BaseEntity`                                                                             | Built                                                  |
| `UserEntity`                                                                             | Built                                                  |
| First migration (`init`)                                                                 | Generated, reviewed, run — `users` table confirmed     |
| `tsconfig.json` strict-mode fix                                                          | Applied                                                |
| Swagger                                                                                  | Live, no module routes yet                             |
| `UsersModule` usecase/controller layers                                                  | Not built                                              |
| `auth` module                                                                            | Not built — **next up, everything else depends on it** |
| `categories`, `listings`, `dashboard`, `saved-listings`, `ratings`, `reports`, `uploads` | Not rebuilt since reset                                |

---

## 14. Milestones

Dates unchanged from the original plan — the Prisma→TypeORM rebuild happened inside the Aug 11–12 window and hasn't cost schedule yet, but `auth` is now the critical path.

| Dates     | Backend focus                                                                                                                          |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Aug 11–12 | Rebuilt on TypeORM (was Prisma): folder convention, Docker Postgres (5433), BaseEntity + UserEntity, first migration run and confirmed |
| Aug 13–15 | Finish `UsersModule` (usecase + controller), build `AuthModule` (register/login/refresh/guards) — this is the current focus            |
| Aug 16–18 | Categories + Listings modules (CRUD + search/filter) rebuilt — **Aug 18 mentor review target**                                         |
| Aug 19–21 | Image upload flow, Ratings module, Reports module, Saved-Listings module, Dashboard aggregation endpoints                              |
| Aug 22–23 | Validation pass on every DTO, rate limiting on `/auth/*`, indexes confirmed                                                            |
| Aug 24    | Freeze API contract, final deploy, seed realistic demo data                                                                            |
| Aug 25    | Support frontend team during full end-to-end dry run                                                                                   |
| Aug 26    | Buffer — fix anything broken, submit                                                                                                   |

---

## 15. Security Checklist

- [ ] Passwords hashed with bcrypt/argon2, never stored/logged in plaintext
- [ ] JWT secrets only in `.env`, never committed
- [ ] `class-validator` DTOs on every mutating endpoint
- [ ] Rate limiting on `/auth/login` and `/auth/register`
- [ ] CORS restricted to the known frontend origin(s)
- [ ] Ownership checks on every update/delete usecase
- [ ] No raw National ID numbers stored — reference/flag only
- [ ] Soft-delete (`deletedAt`) respected in all repository queries — don't accidentally return deleted rows
