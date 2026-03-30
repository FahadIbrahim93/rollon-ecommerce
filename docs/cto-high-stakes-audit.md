# CTO High-Stakes Codebase Audit (RollON)

## Scope and Evidence
This audit reviewed both the storefront (`rollon-app`) and serverless API (`api`) with direct code inspection and executable checks.

### Commands Executed
- `node --test api/__tests__/handlers.test.js`
- `cd rollon-app && npm run lint`
- `cd rollon-app && npm test -- --run`
- `cd rollon-app && npm run build` (failed before dependency reinstall)
- `cd rollon-app && npm ci`
- `cd rollon-app && npm run build` (passed after reinstall)
- `cd rollon-app && npm audit --omit=dev`

## Executive Summary
The codebase is **functional but not production-hardened**. The largest risks are in **auth correctness**, **client-side token handling**, and **process maturity** around release gating. If this were a high-stakes launch gate, I would classify readiness as **conditional**: acceptable for controlled release, not acceptable for regulated/high-trust operations.

---

## Scorecard (1–10)

| Dimension | Score | Rationale |
|---|---:|---|
| Code quality & structure | 7 | Clear module separation exists in API helpers and React feature folders, but temporary logic and TODO-critical code paths are still in active runtime components. |
| Readability & maintainability | 7 | Naming is mostly coherent; however, mock/demo auth and placeholder flows are mixed into production paths, increasing cognitive load and future defect risk. |
| Performance & scalability | 6 | Frontend build succeeded, but admin analytics bundle is large (~392 kB chunk) and there is no explicit backend rate limiting/caching strategy at API edge. |
| Security best practices | 4 | Client stores auth token in persisted Zustand state and uses mock JWT generation fallback; API routes shown do not enforce auth/authorization at handler boundary. |
| Test coverage & reliability | 7 | Existing tests are solid for core utility/store logic and API handlers; no demonstrated coverage metrics, no end-to-end flow verification, and no load/security tests. |
| Architecture & modularity | 7 | API utility extraction and frontend feature grouping are decent, but route protection is currently hardcoded and disconnected from real auth state. |
| Standards/compliance (WCAG, secure coding, deploy) | 6 | ARIA labels are present in key controls, SPA rewrites are configured, but low-contrast text variants and placeholder auth behavior undermine strict compliance posture. |
| Team collaboration readiness | 6 | Helpful docs exist, but quality gates are not consistently enforceable from one command at repo root and placeholder comments remain in business-critical paths. |
| Business alignment & product requirements | 5 | Admin routes are protected by constants set to always-unauthenticated, effectively blocking admin user journeys while API auth model remains incomplete. |
| Operational readiness (observability, rollback, incident response) | 5 | Error tracking abstraction exists, but no proven structured logs, SLO metrics, canary/rollback runbook, or production drill evidence in code/tests. |

### Overall weighted posture: **6.0/10**

---

## Critical Findings (High Priority)

1. **Auth guard is hardcoded, not state-driven (business + security correctness risk).**
   - `ProtectedRoute` always uses `isAuthenticated = false` and `userRole = null`, which blocks all admin access and decouples route protection from actual auth state.
   - Impact: core admin functionality is effectively disabled; future emergency fixes likely become ad hoc. 

2. **Client-side auth fallback issues (security integrity risk).**
   - Auth store falls back to client-generated mock JWT tokens and persists token/user data in local storage through Zustand persist middleware.
   - Impact: trust boundary confusion and elevated token theft risk (XSS/local compromise).

3. **API handlers shown are authorization-agnostic (exposure risk).**
   - `orders` route supports GET/POST without any visible auth/role checks at entrypoint.
   - Impact: unauthorized data access/write risk if endpoint is publicly reachable.

4. **Build reproducibility fragility (release reliability risk).**
   - Build initially failed due to missing `recharts` module until `npm ci` was executed.
   - Impact: CI/CD reproducibility depends on strict clean install discipline not clearly enforced across all workflows.

5. **A11y contrast debt in multiple views (compliance risk).**
   - Small body/support text uses `text-white/40` in places, conflicting with strict WCAG AA guidance for normal-size text.
   - Impact: legal and accessibility quality risk on key pages.

---

## Technical Debt Register

### P0 (Immediate)
- Replace constant-based `ProtectedRoute` with selector-driven auth from store/session boundary.
- Remove/strictly isolate demo JWT fallback from non-development builds.
- Add API middleware to enforce authN/authZ for sensitive routes (`orders`, admin, customer endpoints).

### P1 (Next sprint)
- Add centralized error envelope and request correlation ID in API layer.
- Introduce dependency health + lockfile freshness checks in CI.
- Add route-level chunk strategy for analytics-heavy admin modules.

### P2 (Planned hardening)
- Threat model + abuse cases for auth and order submission.
- Performance budgets in CI (bundle size threshold, lighthouse CI).
- Formal operational runbook (rollback and on-call diagnostics).

---

## Concrete Improvements

### Code-level
- Implement `requireAuth` and `requireRole('admin')` middleware wrappers for serverless handlers.
- Migrate auth tokens to HTTP-only secure cookies for production auth mode.
- Replace placeholder login/register simulated delays and console logs with API-driven flows + typed error mapping.
- Create a single `AuthContextBoundary` that coordinates token refresh and route guard state.

### Architectural
- Split admin analytics into lazy nested routes and evaluate chart virtualization/downsampling for large datasets.
- Introduce backend service layer for order/customer rules (validation + policy + persistence separation).
- Add typed shared contracts (OpenAPI or Zod schema sharing) between frontend and API.

### Process-wise
- Add a root-level `npm run verify` (or `make verify`) to run lint + tests + build across frontend/backend.
- Require CI status checks for lint/test/build/audit before merge.
- Adopt ADRs for major decisions (auth model, persistence model, deployment topology).
- Enforce commit hygiene: Conventional Commits + issue/PR templates with risk and rollback sections.

---

## Recommended Tooling/Practices

- **Security:** `semgrep`, `eslint-plugin-security`, `npm audit` in CI, dependency review bot.
- **Testing:** Playwright E2E for checkout + admin auth; API contract tests; mutation testing on critical business logic.
- **Performance:** `vite-bundle-visualizer`, Lighthouse CI budgets, React Profiler for admin dashboard hotspots.
- **Reliability:** Sentry (or equivalent) with release tracking, structured logging (pino), and synthetic health probes.
- **Governance:** CODEOWNERS, mandatory PR checklist, and branch protection requiring up-to-date status checks.

---

## Risks & Unknowns
- No direct evidence of production auth backend contract (`/auth/login`, `/auth/me`, `/auth/register`) implementation in this repository.
- No demonstrated load test evidence for API throughput limits.
- No demonstrated penetration or DAST run in this audit pass.

---

## 10/10 Target State Plan (Time-Boxed)

1. **Week 1 (Security baseline):** auth middleware, route guard rewrite, remove demo auth from production bundles.
2. **Week 2 (Reliability):** CI verify pipeline, typed API contracts, error observability with correlation IDs.
3. **Week 3 (Quality scale-up):** E2E critical-path tests, coverage thresholds, performance budgets.
4. **Week 4 (Operational maturity):** rollback playbook, canary release strategy, incident drill + postmortem template.

Success criteria: no unauthenticated sensitive route access, deterministic build in clean CI, passing E2E on release branch, and audited accessibility/performance/security gates.
