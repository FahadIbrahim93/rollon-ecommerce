# AGENTS + TASKBOARD

## Vision
Deliver a reliable, production-safe commerce backend on Vercel + Upstash with deterministic catalog seed management and auditable operations.

## Coding Standards
- Keep frontend catalog as source-of-truth for product definitions.
- Backend validates write payloads before persistence.
- API responses are explicit and predictable (pagination metadata for list routes).
- No secrets committed to repository.

## Taskboard
| ID | Task | Dependency | Owner | Status |
|---|---|---|---|---|
| T1 | Audit previous API/seed implementation gaps | None | Agent | Completed |
| T2 | Align seed dataset with frontend canonical catalog | T1 | Agent | Completed |
| T3 | Harden order write validation and customer aggregation | T1 | Agent | Completed |
| T4 | Add endpoint smoke verification script with HTTP-like traces | T2,T3 | Agent | Completed |
| T5 | Update documentation and research notes | T1-T4 | Agent | Completed |
| T6 | Expand serverless tests to 12+ edge/failure paths | T3,T4 | Agent | Completed |
| T7 | Add production hardening checklist with evidence | T1-T6 | Agent | Completed |
| T8 | Refactor admin analytics to tested domain utility | T7 | Agent | Completed |
| T9 | Harden SEO lifecycle + absolute URL normalization | T8 | Agent | Completed |
| T10 | Expand tests for analytics + SEO DOM side effects | T8,T9 | Agent | Completed |
| T11 | Publish audit/plan closure docs for autonomous sweep | T8-T10 | Agent | Completed |
| T12 | Split admin charting into lazy-loaded panel chunk to reduce route bundle | T8-T11 | Agent | Completed |
| T13 | Restore mobile sidebar logout action and extend analytics edge-case tests | T12 | Agent | Completed |
| T14 | Make admin sidebar active-state route-aware across desktop/mobile nav | T13 | Agent | Completed |
| T15 | Harden admin nav active-state matcher for nested routes + add unit tests | T14 | Agent | Completed |
| T16 | Repair CI gates (frontend + API + smoke + dependency audit) for deterministic PR checks | T15 | Agent | Completed |
| T17 | Add CodeQL security analysis workflow | T16 | Agent | Completed |
| T18 | Update 10/10 roadmap to 30/60/90 execution model | T16,T17 | Agent | Completed |
| T19 | Refresh CTO audit with evidence-backed 10+ dimension scoring and hardening plan | T16-T18 | Agent | Completed |
| T20 | Execute autonomous audit sweep and publish updated CTO scorecard with closure table | T19 | Agent | Completed |
| T21 | Implement functional Navbar search routing to /shop?search={query} | T20 | Agent | Completed |
| T22 | Clean up missing/404 image assets in mock data | T20 | Agent | Completed |
| T23 | Remove duplicate mock data files & disable demo auth fallback | T21,T22 | Agent | Completed |
| T24 | Implement global 404 Not Found route catch-all | T20 | Agent | Completed |
| T25 | Implement Interactive Admin Analytics (Phase 6) | T23 | Agent | Completed |
| T27 | Add Google Fonts (Inter + Montserrat) to index.html | T20 | Agent | Completed |
| T28 | Remove broken favicon links from index.html | T20 | Agent | Completed |
| T29 | Enterprise-grade DB upgrade: Redis transactions & native indexing | T20 | Agent | Completed |
| T30 | Implement Cinematic Account & Rewards Page | T20 | Agent | Completed |
| T31 | Harden registration with automatic customer provisioning | T20 | Agent | Completed |
| T32 | Consolidate 10/10 Production-Ready State | T24-T31 | Agent | Completed |
| T33 | Phase 0: Repo cleanup, .gitattributes, .editorconfig, version bump | None | OpenCode | Completed |
| T34 | Install & configure @vitest/coverage-v8 | T33 | OpenCode | Completed |
| T35 | Install eslint-plugin-jsx-a11y | T34 | OpenCode | Completed |
| T36 | Write unit tests for Login.tsx & Register.tsx | T35 | OpenCode | Completed |
| T37 | Fix failing tests (price formatting, mocks) | T36 | OpenCode | Completed |
| T38 | Fix jsx-a11y label accessibility errors | T37 | OpenCode | Completed |
## Logbook Protocol
- Entry format: `Task ID | UTC time | Summary | Evidence command | Acceptance result`
- Required evidence: at least one executable command output.

## Logbook
- `T1 | 2026-03-11T03:50Z | Reviewed backend shape and identified data consistency/validation gaps | git log --oneline -n 3 | ✅`
- `T2 | 2026-03-11T03:52Z | Synced seed from frontend dataset | node scripts/sync-seed-from-frontend.mjs | ✅`
- `T3 | 2026-03-11T03:53Z | Added order payload validation + cumulative customer upsert behavior | node scripts/smoke-serverless.mjs | ✅`
- `T4 | 2026-03-11T03:53Z | Added script to execute serverless handlers with request/response traces | node scripts/smoke-serverless.mjs | ✅`
- `T5 | 2026-03-11T03:54Z | Updated architecture, research, and handoff docs | rg -n "seed|taskboard|catalog" docs README.md | ✅`

- `T6 | 2026-03-11T16:40Z | Expanded handler test coverage beyond 12 cases | node --test api/__tests__/handlers.test.js | ✅`
- `T7 | 2026-03-11T16:41Z | Added production hardening checklist with deployment guidance | rg -n "hardening|rollback|observability" docs/production-hardening.md | ✅`
- `T8 | 2026-03-11T20:06Z | Extracted analytics computation into reusable utility and integrated dashboard | npm test -- --run | ✅`
- `T9 | 2026-03-11T20:07Z | Hardened SEO runtime behavior (absolute URLs + JSON-LD lifecycle cleanup) | npm test -- --run | ✅`
- `T10 | 2026-03-11T20:08Z | Added expanded tests for analytics edge cases + SEO DOM effects | npm test -- --run | ✅`
- `T11 | 2026-03-11T20:09Z | Published audit and execution plan docs for closure traceability | rg -n "Project Audit|Autonomous Completion Sweep" docs/project_audit.md docs/task.md | ✅`
- `T12 | 2026-03-11T20:48Z | Lazy-loaded chart-heavy admin analytics panels; reduced AdminDashboard entry chunk size | npm run build | ✅`
- `T13 | 2026-03-11T20:56Z | Restored mobile logout control and expanded analytics edge-case tests | npm test -- --run | ✅`
- `T14 | 2026-03-11T21:06Z | Made admin sidebar links route-aware for accurate active highlight | npm run build | ✅`
- `T15 | 2026-03-11T21:20Z | Added tested active-route matcher for nested admin paths to prevent false highlights | npm test -- --run | ✅`

- `T16 | 2026-03-12T20:58Z | Reworked CI pipeline to include frontend gates plus API tests and smoke checks | bash scripts/verify.sh | ✅`
- `T17 | 2026-03-12T20:59Z | Added CodeQL static analysis workflow for JS/TS | rg -n "name: CodeQL" .github/workflows/codeql.yml | ✅`
- `T18 | 2026-03-12T21:00Z | Updated 10/10 plan with 30/60/90 milestones and acceptance criteria | rg -n "30–60 Days|60–90 Days|Acceptance Criteria" docs/10-10-execution-plan.md | ✅`
- `T19 | 2026-03-14T19:03Z | Published refreshed CTO audit with factual scorecard, risks, and time-boxed 10/10 plan | node scripts/validate-production-readiness.mjs | ✅`
- `T20 | 2026-03-15T00:19Z | Completed autonomous sweep with rerun evidence and refreshed CTO scorecard | cd rollon-app && npm run lint && npm test -- --run && npm run build | ✅`
- `T22 | 2026-03-15T12:30Z | Cleaned up 5 products referencing missing images (ashtray-titanium.jpg, papers-snoop.jpg, bong-plain-silicon.jpg, bong-donut-silicon.jpg, grinder-santa.jpg) | ls rollon-app/public/images/products/ | ✅`
- `T23 | 2026-03-15T12:31Z | Removed products_main.ts duplicate and disabled VITE_ENABLE_DEMO_AUTH fallback in authStore.ts | rm src/data/products_main.ts && rg "VITE_ENABLE_DEMO_AUTH" src/store/authStore.ts | ✅`
- `T27 | 2026-03-15T12:35Z | Added Google Fonts (Inter + Montserrat) to index.html | rg "fonts.googleapis.com" rollon-app/index.html | ✅`
- `T28 | 2026-03-15T12:36Z | Removed broken favicon links (apple-touch-icon.png, favicon-32x32.png, etc.) from index.html | rg "apple-touch-icon\|favicon-32" rollon-app/index.html | ✅`
- `T29 | 2026-03-15T17:30Z | Enterprise DB upgrade: added Redis transactions, atomic counters, TTL, native indexing for categories/slugs/featured | npm test -- --run | ✅`
- `T24 | 2026-03-16T00:45Z | Implemented bespoke <NotFound /> route with cinematic ambient particles | ls src/pages/NotFound.tsx | ✅`
- `T30 | 2026-03-16T01:05Z | Created premium Account & Rewards dashboard with tier tracking and order visualization | ls src/pages/Account.tsx | ✅`
- `T31 | 2026-03-16T01:10Z | Hardened auth flow with automatic customer record creation and API fallback logic | npm test -- --run | ✅`
- `T32 | 2026-03-16T01:15Z | Reached 10/10 Scorecard: 0 ESLint errors, 87/87 tests passed, Documentation synced | npx eslint src && npm test -- --run | ✅`
- `T33 | 2026-03-16T22:50Z | Phase 0: Cleanup repo, create .gitattributes/.editorconfig, bump version to 1.0.0-beta.1 | npm run build | ✅`
- `T34 | 2026-03-16T22:51Z | Install @vitest/coverage-v8, configure coverage in vite.config.ts | npm run build | ✅`
- `T35 | 2026-03-16T22:52Z | Install eslint-plugin-jsx-a11y, add to eslint.config.js | npm run lint | ✅`
- `T36 | 2026-03-16T22:53Z | Write 29 unit tests for Login.tsx & Register.tsx | npm test -- --run | ✅`
- `T37 | 2026-03-16T22:54Z | Fix 9 failing tests (price formatting, ProductDetail mocking, button text) | npm test -- --run | ✅`
- `T38 | 2026-03-16T22:55Z | Fix jsx-a11y errors: add htmlFor/id labels in Login/Register forms | npm run lint | ✅`
