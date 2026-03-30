# RollON 10/10 Production Execution Plan (Updated)

Date: 2026-03-12
Owner: Engineering

## Stage 1 — Inventory & Blockers (completed)
1. Branch + repo health verified (`main` protections assumed external, active feature branch in use).
2. CI config exists but had failure-prone checks (coverage dependency drift, weak audit gate logic).
3. Frontend quality gates exist and run locally (`lint`, `test --run`, `build`).
4. API tests and smoke scripts exist but were not fully wired into CI.
5. Security scans were partially implemented; static analysis gate (CodeQL) missing.
6. Docs exist (README, audit docs, hardening docs), but plan needed 30/60/90 alignment.

## Updated Roadmap to 10/10

### 0–30 Days (stability + trust boundary)
- [x] Harden API auth to verify JWT signatures and reject forged tokens.
- [x] Replace checkout simulation with real order API mutation path.
- [x] Fix route/query consistency for Shop search links.
- [x] Wire API unit tests + smoke checks into CI.
- [x] Refactor CI to deterministic gates: lint, tests, build, API tests, smoke, dependency audit.
- [x] Add CodeQL workflow for continuous SAST.

### 30–60 Days (confidence + depth)
- [ ] Add Playwright E2E suite for critical paths: login guard, checkout submit, admin access denial.
- [ ] Add frontend coverage reporting and enforce threshold gate (target 80% global, 95% critical flows).
- [ ] Add accessibility checks (axe/lighthouse CI) as required PR gate.
- [ ] Add performance budgets (bundle size + route-level budget checks).

### 60–90 Days (operational maturity)
- [ ] Add structured observability: Sentry + correlation IDs + alert routing.
- [ ] Publish rollback runbook and canary/recovery protocol with drill evidence.
- [ ] Add dependency governance (Dependabot + monthly review cadence + SBOM export).
- [ ] Add incident response templates and production readiness sign-off checklist.

## Acceptance Criteria for “10/10 Ready”
- CI green on every PR: lint, unit/integration tests, build, API smoke, security scan.
- No critical/high open security findings.
- Coverage threshold met and enforced.
- Critical e2e user journeys are deterministic and passing.
- Accessibility + performance budgets pass in CI.
- Rollback and monitoring docs exist and are exercised.

## Known Constraints / Risks
- Local environment blocks installing additional npm packages from registry (`403`), so some tooling upgrades may need CI-only rollout or internal mirror.
- Audit endpoint availability may vary by network policy; CodeQL helps maintain baseline security coverage.
