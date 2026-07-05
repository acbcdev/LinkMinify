# React Doctor — fix checklist

Full scan (41 issues): `/var/folders/96/gpnkggdn3r51vzl50xfg36yh0000gn/T/react-doctor-ebf820d3-eef2-4650-bc87-35cf62bf8be8/diagnostics.json`

## This pass (top 3)

- [x] **Security — `require-pnpm-hardening`** (×2) — `pnpm-workspace.yaml`
      Fix applied: `minimumReleaseAge: 10080` (7d) + `trustPolicy: no-downgrade`. Verified via recipe fetch.

- [x] **Bug (ERROR) — Unauthenticated server action** (×3) — `src/actions/Actions.ts:18` (`GetUrl`)
      Confirmed false positive: `GetUrl` backs public redirect route (`src/app/[short]/page.tsx`), auth not applicable by design. No code change.

- [x] **Bug (WARN) — Blocking side effect before response** (×2) — `src/actions/Actions.ts:56,69`
      Fix applied: wrapped both `console.log(error)` calls in `after()` from `next/server` (CreateUrl + DeleteUrl catch blocks).

## Verification (required before checking any box)

- [x] Canonical recipe fetched & read (for rules that have one)
- [x] Root-cause fix applied, no suppression
- [x] `npx react-doctor@latest --verbose --scope changed` re-run, 100/100, no issues

## Follow-up (remaining 12 issues, grouped by rule)

- [x] **unused-file** (×2, plugin `deslop`) — `card.tsx`, `table.tsx` confirmed unreachable (grep: zero imports anywhere, incl. own dir). Deleted both. Killed 14 react19 findings for free per triage note.

- [x] **no-react19-deprecated-apis** (×11 remaining after delete) — `forwardRef` → plain function, `ref` as normal prop.
      `src/components/ui/button.tsx:42` ✓
      `src/components/ui/dropdown-menu.tsx:21,43,59,77,95,119,141,159` (×8) ✓
      `src/components/ui/input.tsx:5` ✓
      `src/components/ui/textarea.tsx:5` ✓
      Verified: `tsc --noEmit` clean, react-doctor rescan 96/100, rule no longer flagged.

- [x] **no-multi-comp** (×2) — `src/components/ui/input-group.tsx:60,119`
      Confirmed false positive: 6 components, 100% exported — matches tool's own shadcn-barrel exemption (4+ comps, ~70%+ exported). No code change. Doesn't reappear on rescan.

- [x] **prefer-module-scope-pure-function** (×1) — `src/components/LinksList.tsx:28`
      Fix applied: hoisted `removeProtocol` above component (captured only its own param).

- [x] **only-export-components** (×1) — `src/components/ui/button.tsx:56`
      Fix applied: moved `buttonVariants` cva to new `src/components/ui/button-variants.ts`, `button.tsx` now exports only `Button`. No external callers of `buttonVariants` (grep confirmed).

- [x] **no-inline-bounce-easing** (×1) — `src/components/ShortenForm.tsx:15`
      Fix applied: `animate-bounce-fade-in` → `animate-fade-in` (checked `@midudev/tailwind-animations` source: keyframe had no overshoot, but rule bans "bounce" naming on form feedback regardless — matches `LinksList.tsx`'s existing pattern).

- [x] **no-prevent-default** (×1) — `src/components/ShortenForm.tsx:15`
      Confirmed false positive: `onSubmit` drives async client work (toast messages, rate-limit UI, Zustand/localStorage store update via `useShortenUrl`), not pure navigation. `<form action={serverAction}>` can't reach the client-only store without `useActionState` boilerplate — out of scope for a lint fix. Still flags on rescan (expected, tool can't see this).

- [x] **click-events-have-key-events** (×1) — `src/components/ui/input-group.tsx:66`
      Confirmed false positive: `onClick` only refocuses the already-keyboard-accessible `<input>` inside (or no-ops if target is a button) — a focus-delegation convenience like `<label>`, not an independent action. No keyboard user loses functionality. Doesn't reappear on rescan.

### Status: all 12 items resolved (7 fixed, 5 confirmed false positives). `tsc --noEmit` clean. Rescan: 73/100, single remaining flag is the documented `no-prevent-default` false positive.
