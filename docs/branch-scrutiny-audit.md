# Branch Scrutiny Audit — `feat/scrutiny-refinements-final`

Date: 2026-03-12
Auditor posture: Principal Engineer / CTO-readout mode (brutal, evidence-driven)

## Method (evidence-first)
- Ran mandatory quality gates in `rollon-app`: lint, tests, production build.
- Ran additional checks: dependency vulnerability scan attempt (`npm audit --omit=dev`), coverage command attempt (`vitest --coverage`).
- Performed targeted static review across frontend routing/auth/data paths and serverless API auth/validation/storage layers.

## Factual Scorecard (1–10)

| Dimension | Score | Why this score (blunt) |
|---|---:|---|
| Code quality & structure | 6.5 | Reasonable separation by domain, but architectural seams are inconsistent (frontend uses dual API configs and fallback behavior that can silently mask backend failure). |
| Readability & maintainability | 6.0 | Code is readable in many places, but there is significant brand-heavy copy/noise, inconsistent route intent, and unresolved TODOs in checkout flow. |
| Performance & scalability | 5.5 | Build succeeds, but large admin analytics chunk (~392kB JS) and global fetch-all patterns from Redis sets will not scale with dataset growth. |
| Security best practices | 3.0 | Critical flaw: admin authorization trusts unsigned JWT payload decoding. Any attacker can forge `role: admin` token. |
| Test coverage & reliability | 5.5 | Unit tests pass and include basic API handler tests, but no real coverage report tooling is installed and no e2e/contract testing is present. |
| Architecture & modularity | 6.0 | Frontend and API are modularized, but auth model, routing model, and data-source model are fragmented and contradictory. |
| Standards compliance (web/a11y/ops) | 5.0 | Good intent, but WCAG claims are overstated versus code reality (contrast classes below project rules still present). |
| Team collaboration readiness | 6.0 | Repo has docs and scripts, but README quality claims are stale/inaccurate; branch discipline claims outpace enforceable reality in code. |
| Business alignment & product readiness | 5.0 | Core storefront works, but key conversion path (checkout order processing) is stubbed and production auth posture is unacceptable. |
| Operational readiness (deploy/observability/recovery) | 4.5 | Vercel config and error wrapper exist, but there is no robust monitoring/tracing strategy and security gate evidence is incomplete. |
| Data integrity & domain correctness | 5.5 | Basic validation exists, but order/customer updates rely on non-transactional assumptions and permissive payload handling. |

**Overall weighted verdict: 5.3 / 10.**

## High-priority issues (fix first)

### P0 — Critical security defect: forged admin access
- `api/_lib/auth.js` decodes JWT payload without signature verification and only checks `payload.role === 'admin'`.
- Impact: admin endpoints can be accessed by forged bearer tokens.
- Severity: **Critical**.

### P0 — Checkout path is performative, not production
- `rollon-app/src/pages/Checkout.tsx` uses timeout simulation and TODO placeholder instead of integrating with order API.
- Impact: false business readiness; customer journey is not truly transactional.
- Severity: **Critical** for go-live trust.

### P1 — Route integrity defects (broken navigation intent)
- Navbar links to `/manifesto` and search links to `/products?...`, while app routes define `/shop` and no `/manifesto` route.
- Impact: dead links, conversion leakage, trust erosion.
- Severity: **High**.

### P1 — Auth/API configuration fragmentation
- Frontend data client uses `VITE_API_BASE_URL`; auth store uses different `VITE_API_URL` defaulting to localhost.
- Impact: environment drift, login failures in deployed environments.
- Severity: **High**.

### P1 — Accessibility non-compliance against own standards
- Text contrast utility values (`text-white/40`, `text-white/30`) appear in critical UX surfaces despite project guideline restrictions.
- Impact: WCAG AA claims are not defensible.
- Severity: **High** (legal/brand risk).

### P2 — Scalability bottleneck in API list retrieval
- Product/customer/order fetch paths load full set members and then filter in memory.
- Impact: high latency/memory under growth.
- Severity: **Medium-High**.

### P2 — Testing confidence gap
- Coverage command fails due to missing `@vitest/coverage-v8`; no e2e coverage for routing/auth/checkout.
- Impact: regressions will slip past CI.
- Severity: **Medium-High**.

## Technical debt inventory
- Simulated JWT + demo auth behavior overlapping with real API paths.
- Inconsistent env variable contract for API endpoints.
- Stale claims in README (`63+ tests`, security claims) not tied to enforceable CI evidence.
- Non-paginated customer/order list patterns and weak query/index strategy at API layer.
- UI copy/style complexity causing maintainability drag and potential accessibility regressions.

## Concrete improvements

### Code-level (next 1–2 sprints)
1. Replace ad-hoc JWT parsing with proper signature verification (`jose` or `jsonwebtoken`) and strict issuer/audience/expiry checks.
2. Unify API base config (single source in `src/lib/config.ts`) and make auth/data clients consume same origin contract.
3. Wire checkout `processOrder` to `api.orders.create` with resilient failure UX and idempotency guard.
4. Fix route map mismatches (`/manifesto`, `/products`) or add corresponding route handlers and pages.
5. Enforce a11y contrast via lint/test guardrails and replace low-contrast classes in user-critical text.

### Architectural (quarterly hardening)
1. Add BFF/service boundary for auth and admin authorization; remove any client-trust role source.
2. Introduce indexed query strategy in Upstash layer (e.g., category/featured/search indices) to avoid full scans.
3. Add API schema contracts (OpenAPI + runtime validation) and contract tests between frontend and serverless handlers.
4. Establish observability baseline: request tracing IDs propagated frontend→API, structured logs + alert thresholds.

### Process improvements
1. CI must block on: lint, tests, build, coverage threshold, and security scan.
2. Add PR template requiring “evidence links” for performance, accessibility, and security claims.
3. Introduce release checklist with rollback runbook and smoke tests on preview deployments.
4. Perform monthly dependency and threat-model review; maintain SBOM.

## Recommended tools/patterns
- **Security**: `jose`, `npm audit` (or Snyk/Dependabot), secret scanning (gitleaks).
- **Testing**: Vitest coverage provider, Playwright e2e, contract testing (Pact or schema assertions).
- **Quality**: `eslint-plugin-jsx-a11y`, TypeScript strictness ratchet, bundle budget checks (e.g., `vite-bundle-visualizer`).
- **Operations**: Sentry (frontend + API), structured logging middleware, uptime checks.

## Risks / unknowns / assumptions
- Could not obtain vulnerability advisory details due npm audit endpoint 403 in this environment.
- Full line/branch coverage is unknown because coverage dependency is missing.
- No production traffic profile available, so performance scalability risk is based on code path analysis and build artifacts.

## Best possible plan to reach 10/10 (time-boxed)

### Week 1 (stability + critical risk burn-down)
- [P0] Implement verified JWT auth and rotate any demo-auth defaults off production paths.
- [P0] Replace checkout stub with real API mutation, success/failure telemetry, and regression tests.
- [P1] Resolve route mismatches and add route integrity test.

### Week 2 (quality gates + test confidence)
- Add coverage tooling + thresholds (≥85% initially, ratchet to 95% for core flows).
- Add Playwright happy-path + auth-denied + checkout failure scenarios.
- Introduce a11y linting and axe checks in CI.

### Week 3–4 (scalability + operability)
- Refactor API data access away from full scans; add query indices and pagination invariants.
- Add observability instrumentation + error budgets + alerting.
- Enforce bundle budgets and split oversized admin chunk.

### Ownership model (multi-agent in practice)
- **Security Agent**: auth hardening + secret handling + scanner integration.
- **App Reliability Agent**: checkout transactional flow, error handling, observability.
- **Frontend Quality Agent**: route/a11y correctness + bundle optimization.
- **QA Agent**: e2e and contract test matrix + CI gate enforcement.

If this were a real go/no-go gate today: **No-go** until P0s are closed and re-validated.
