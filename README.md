<div align="center">
  <h1>LinkMinify</h1>
  <p>Shorten URLs. Simplify sharing.</p>
</div>

## Tech Stack

| | |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **UI** | React 19, Tailwind CSS, shadcn/ui, lucide-react, Geist |
| **State** | Zustand (localStorage) |
| **Database** | MongoDB + Mongoose |
| **IDs** | nanoid (5–8 chars) |
| **Captcha** | Cloudflare Turnstile |
| **Testing** | Vitest + Testing Library |

## Getting Started

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

```env
MONGODB_URL=mongodb://localhost/nextmongo
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key
```

Optional: `RATE_LIMIT_MAX` (default 10, daily URL creations per IP), `RATE_LIMIT_BYPASS_IPS`.

## Scripts

| Command | Action |
|---|---|
| `pnpm dev` | Dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | ESLint |
| `pnpm test` | Vitest |

## How It Works

1. Paste a long URL and complete the Turnstile captcha.
2. Server generates a short code, stores the mapping in MongoDB.
3. Visiting `/{code}` permanently redirects to the original URL.
4. Your created links are saved to localStorage and displayed in a table.

Rate limiting is enforced per IP (daily cap).
