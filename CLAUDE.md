# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This is a Turborepo monorepo containing a single Next.js application:

- `/app-management/apps/admin-dashboard` - Main frontend application (Next.js 16 with React 19)
- Database: PostgreSQL with Drizzle ORM
- Authentication: better-auth
- Styling: Tailwind CSS v4
- Linting/Formatting: Biome.js

## Common Development Commands

### Running the Application
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### Database Operations
```bash
# Generate database migrations
pnpm exec drizzle-kit generate

# Apply migrations
pnpm exec drizzle-kit migrate

# View database studio
pnpm exec drizzle-kit studio
```

### Code Quality
```bash
# Lint code
pnpm lint

# Format code
pnpm format

# Type checking
pnpm check-types
```

## Architecture Overview

### Frontend (Next.js App Router)
- Uses App Router with route groups for organization
- API routes implemented as serverless functions in `src/app/api/`
- Database access through Drizzle ORM
- Authentication handled by better-auth with Next.js integration
- Components organized with shadcn/ui and Radix UI primitives

### Data Layer
- PostgreSQL database with Drizzle ORM
- Schema defined in `src/db/schema.ts` with tables for:
  - Users, sessions, accounts (authentication)
  - Venues (locations/buildings)
  - Floors (building levels)
  - POIs (Points of Interest with 3D coordinates)
- Database connection pooling with node-postgres

### API Routes
- RESTful API endpoints under `/api/` namespace
- CRUD operations for venues, floors, and POIs
- Authentication middleware integrated
- Zod schema validation for request bodies

## Development Workflow

1. All development happens in the `app-management/apps/admin-dashboard` directory
2. Database changes require updating schema and generating migrations
3. API routes follow Next.js App Router conventions
4. Client components use React Server Components where appropriate
5. Environment variables configured in `.env` file

## Testing

Currently, there are no established testing patterns in the codebase. When adding tests:

- Unit tests should be colocated with the modules they test
- Integration tests for API routes should test the full request/response cycle
- Database tests should use a separate test database
- End-to-end tests should cover critical user flows

## Deployment

The application is designed to be deployed as a standard Next.js application:

1. Build the application with `pnpm build`
2. Set appropriate environment variables for production database
3. Deploy using Vercel, Docker, or Node.js hosting platform
4. Ensure PostgreSQL database is accessible in production environment

Note: This appears to be an AR (Augmented Reality) navigation system with venues, floors, and 3D points of interest.