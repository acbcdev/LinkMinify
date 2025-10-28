# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LinkMinify is a URL shortening service built with Next.js 14 (App Router), MongoDB/Mongoose, and Zustand for state management. Users can create shortened URLs, view them in a table, copy them to clipboard, and delete them. The app uses nanoid for generating short codes (5-8 characters) 

## Core Commands

```bash
# Development
pnpm dev                # Start development server on localhost:3000
pnpm build              # Build for production
pnpm start              # Start production server
pnpm lint               # Run ESLint

# Testing
pnpm test               # Run Vitest tests
```

## Architecture

### Data Flow

1. **URL Creation Flow**:
   - User submits URL via `FormUrl` component → validates with `IsValidUrl()`
   - User must complete Cloudflare Turnstile captcha verification
   - Calls `CreateUrl()` server action (src/actions/Actions.ts:44) with captcha token
   - Server action verifies captcha token with Cloudflare API
   - Server action adds https:// protocol if missing, generates nanoid code (5-8 chars)
   - Creates MongoDB record via Hash model
   - Returns result to client, which adds to Zustand store and localStorage

2. **URL Redirection Flow**:
   - User visits `/{short}` → Next.js dynamic route at src/app/[short]/page.tsx:3
   - Calls `GetUrl()` server action to fetch original URL from MongoDB
   - Performs permanent redirect (301) to original URL

3. **Client State Management**:
   - Zustand store (src/lib/store.ts) persists links to localStorage
   - Store provides: `addLink()`, `updateLink()`, `deleteLink()`
   - Client-side only - used for displaying user's created links in table

### Key Files

- **src/actions/Actions.ts**: Server actions for URL CRUD operations
  - `CreateUrl()`: Creates shortened URL with captcha and URL validation
  - `GetUrl()`: Retrieves original URL by short code

- **src/lib/mongodb.ts**: MongoDB connection using Mongoose
  - Requires `MONGODB_URL` environment variable (defaults to `mongodb://localhost/nextmongo`)

- **src/models/hash.ts**: Mongoose schema for URL documents
  - Fields: `code` (unique short ID), `url` (original URL), `clicked` (counter), `created_at`

- **src/lib/store.ts**: Zustand store with localStorage persistence
  - Storage key: `link-storage`
  - Manages local list of user-created links

- **src/lib/utils.ts**: Utility functions
  - `IsValidUrl()`: URL validation regex
  - `randomNum()`: Generates random length 5-8 for nanoid

### Components

- **FormUrl** (src/components/FormUrl.tsx): URL input form with Turnstile captcha, validation and loading states
  - Submit button is disabled until captcha is completed
  - Captcha token is reset after successful submission or expiration
- **UrlsCreated** (src/components/UrlsCreated.tsx): Table displaying created links with copy/delete actions
- UI components from shadcn/ui in src/components/ui/

## Environment Setup

Required environment variables:
- `MONGODB_URL`: MongoDB connection string (defaults to `mongodb://localhost/nextmongo`)

To get Turnstile keys:
1. Go to Cloudflare Dashboard → Turnstile
2. Create a new site
3. Copy the Site Key to `NEXT_PUBLIC_TURNSTILE_SITE_KEY`


## Testing

- Framework: Vitest with jsdom
- Test files: Located in src/test/ directory (e.g., src/test/lib/utils.test.ts)

## Path Aliases

Configure imports using:
- `@/*` → `./src/*`
- `@lib/*` → `./src/lib/*` (note: currently inconsistently used)
- `@components/*` → `./src/components/*` (note: currently inconsistently used)

Most code uses `@/` prefix for all imports.
