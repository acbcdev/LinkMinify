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

- [ ] **no-multi-comp** (×2) — Maintainability — multiple components declared in one file
      `src/components/ui/input-group.tsx:60,119`

- [ ] **prefer-module-scope-pure-function** (×1) — Maintainability — `removeProtocol` rebuilt every render
      `src/components/LinksList.tsx:28` — move fn above component (no local state used)

- [ ] **only-export-components** (×1) — Maintainability — non-component export breaks Fast Refresh
      `src/components/ui/button.tsx:56`

- [ ] **no-inline-bounce-easing** (×1) — Performance — dated `animate-bounce`
      `src/components/ShortenForm.tsx:15` — swap for `cubic-bezier(0.16, 1, 0.3, 1)` ease-out

- [ ] **no-prevent-default** (×1) — Bugs — `onSubmit` calls `preventDefault()`, breaks no-JS submit
      `src/components/ShortenForm.tsx:15` — use `<form action={serverAction}>`

- [ ] **click-events-have-key-events** (×1) — Accessibility — `onClick` w/ no keyboard handler
      `src/components/ui/input-group.tsx:66` — add `onKeyUp`/`onKeyDown`

### Triage order suggestion

1. unused-file check first (may kill the 14 react19 findings in card.tsx/table.tsx for free if truly dead)
2. no-react19-deprecated-apis batch (mechanical, high count)
3. rest — one-offs, low effort each
