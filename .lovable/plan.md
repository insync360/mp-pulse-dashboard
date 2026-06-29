
# Citizen Pulse — Shared Data Layer + Cases Consolidation

This is a structural refactor. We keep navy/saffron styling and existing premium look. No pages are deleted — pages that are being retired become thin wrappers that redirect into the new unified Cases views, so nothing 404s and no duplicate mock data lingers.

## Part A — Shared Data Layer

New folder `src/data/` with one source of truth:

```text
src/data/
  types.ts        // all 11 record types + reference types
  seed.ts         // consistent Bengaluru mock seed
  store.tsx       // React context + provider + typed hooks
  selectors.ts    // resolveCitizen(caseRow), openCasesByWard(), etc.
```

Highlights:
- Records hold only ids (e.g. `Case.citizenId`, `Letter.caseId`), never embedded copies.
- Shared wards: Whitefield, KR Puram, Mahadevapura, Marathahalli, Bellandur.
- ~15 Citizens, ~12 Officers, ~20 Cases, ~14 Letters, ~10 Commitments, ~8 Events, ~10 Demands, ~8 Projects, ~10 DeptFiles, plus Departments/Schemes/Staff/Templates reference tables.
- `<DataProvider>` is mounted in `src/routes/__root.tsx` so every page can read via `useData()` / typed selectors.
- Mutations (`updateCase`, `addLetter`, etc.) operate in-memory via `useState` so existing optimistic UI keeps working; no persistence yet.

## Part B — Cases Consolidation

`Case.recordType ∈ { Grievance | SchemeRequest | RecommendationRequest | Emergency | GeneralEnquiry }`.

### New / changed routes

| Route | Purpose |
|---|---|
| `src/routes/cases.tsx` (new) | Unified Cases page. Tabs are filters over the same Case list: All Open · Grievances · Scheme Requests · Emergencies (red skin) · Awaiting Closure · My Cases. Reuses existing rich detail drawer (stages, resolution, citizen/officer links, timeline) sourced from the shared store. |
| `src/routes/inbox.tsx` (new) | `status = New`, grouped by channel (Walk-in / WhatsApp / Call / Email / Social), AI-classification chips, suggested-action buttons that create a typed Case and route to the right tab. |
| `src/routes/grievances.tsx` | Becomes a thin wrapper that renders the Cases view pre-filtered to Grievances (keeps URL, kills duplicate seed data). |
| `src/routes/scheme-assistance.tsx` | Wrapper → Cases filtered to Scheme Requests; keeps the scheme catalog section above the case list. |
| `src/routes/emergency-desk.tsx` | Wrapper → Cases filtered to Emergencies with red urgent skin; keeps the quick-log type grid as a "New emergency" entry point that creates a Case. |
| `src/routes/closure-verification.tsx` | Wrapper → Cases "Awaiting Closure". |
| `src/routes/visitors.tsx` | Keeps visitor queue UI but writes outcomes into the shared Case store instead of its own array; no more parallel object. |
| `src/routes/unified-inbox.tsx` | Redirects to `/inbox` (the new channel-grouped view replaces it). |

### Sidebar

`src/components/app-sidebar.tsx` updated:
- "Cases" replaces individual Grievances/Scheme/Emergency entries in the Citizen Service group (old routes stay reachable as sub-filters but are de-emphasised).
- "Inbox" added near the top of Daily Ops, replacing the Unified Inbox link.

### Cross-cutting reads

- `src/routes/index.tsx` (Command Center) KPI counts (open cases, sentiment, etc.) read from `useData()` selectors.
- `src/routes/daily-briefing.tsx` Office Pulse + Action Queue read counts from the shared store (open emergencies, awaiting-closure, today's letters).
- Letters / Commitments / Officer Directory continue to work; where they reference cases/citizens/officers they now resolve via shared ids.

## Technical notes

- Pure client state; no Cloud / Supabase changes.
- Strict TS, no `any` in the public store API; record unions discriminated by `recordType` / `status`.
- All existing routes remain registered so `routeTree.gen.ts` stays stable; only their bodies change for the retired pages.
- Visual language unchanged: navy `#0A1F44`, saffron `#FF9933`, Inter, card-based layout, red accent reserved for Emergencies tab.

## Out of scope (call out, do later)

- Persistence (localStorage / Supabase) for the shared store.
- Real AI classification in the Inbox (kept as deterministic mock).
- Migrating Stakeholder CRM Citizens tab onto the shared Citizen records (next pass — current CRM keeps its own list to avoid scope creep).
