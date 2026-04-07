---
title: 10/10 Execution Roadmap Sprint Tracker
description: Real-time tracking of tasks, PRs, and progress across 30/60/90 delivery plan.
---

# 10/10 Execution Roadmap – Sprint Tracker

**Status**: 🟡 Sprint 1 – Security Hardening Initiated  
**Overall Progress**: 0% → Target: 100% ✅ v1.3.0-hardened  
**Current State**: 6.0/10 → Sprint 1 Target: 6.5/10 (Security fixed)  
**Last Updated**: April 7, 2026  

---

## ROADMAP AT A GLANCE

```
Sprint 1: CRITICAL FIXES (Week 1-2)
├─ Auth & Route Protection ✋ Starting
├─ API Authorization Middleware ✋ Starting  
├─ Server-Side JWT Auth ✋ Starting
├─ CI/CD Setup ✋ Starting
└─ Error Tracking Integration ✋ Starting
   Target: 6.0/10 → 6.5/10 | Effort: 38h | Shipped: v1.1.0-security

Sprint 2: QUALITY & COMPLIANCE (Week 3-4)
├─ WCAG AA Fixes ⏳ Not started
├─ E2E Test Coverage ⏳ Not started
├─ Bundle Size Optimization ⏳ Not started
├─ Structured Logging ⏳ Not started
└─ Rate Limiting ⏳ Not started
   Target: 6.5/10 → 8.0/10 | Effort: 35h | Shipped: v1.2.0-quality

Sprint 3: HARDENING & SCALE (Week 5-6)
├─ Threat Model + Abuse Cases ⏳ Not started
├─ Database Resilience ⏳ Not started
├─ Performance Budgets + Load Testing ⏳ Not started
├─ Advanced Observability ⏳ Not started
└─ On-Call Runbook ⏳ Not started
   Target: 8.0/10 → 10.0/10 | Effort: 26h | Shipped: v1.3.0-hardened
```

---

## SPRINT 1: CRITICAL FIXES – SECURITY HARDENING
**Duration**: Week 1-2 (April 7-21, 2026)  
**Target State**: 6.0/10 → 6.5/10 (Security: 4/10 → 7/10)  
**Ship Date**: April 21, 2026 (v1.1.0-security)  
**Effort Planned**: 38h | **Actual**: [In Progress - App launched]  
**Blockers**: None | **On Track**: ✅ YES (Dev server running, testing in progress)

### Task Breakdown

| ID | Task | Owner | Status | PR | Effort | Notes |
|---|---|----|---|----|---|---|
| **T1.1** | 🔴 Fix ProtectedRoute hardcoding | @dev-lead | ✋ Starting | - | 4h | Unit test + E2E verify |
| **T1.2** | 🔴 Replace client JWT with server auth | @security | ✋ Starting | - | 12h | api/auth/login, bcrypt, tests |
| **T1.3** | 🔴 Add API authorization middleware | @api-dev | ✋ Starting | - | 16h | Verify user owns resource, 403 response |
| **T1.4** | 🟡 Admin routes smoke test (E2E) | @qa | ⏳ Blocked (T1.1) | - | 2h | After ProtectedRoute fix |
| **T1.5** | 🟡 CI access + linting enforcement | @devops | ✋ Starting | - | 2h | Branch protection, pre-commit hooks |
| **T1.6** | 🟡 Error tracking (Sentry) setup | @devops | ✋ Starting | - | 2h | Dashboard link, frontend SDK |
| **TOTAL** | | | | | **38h** | |

### Task Details

#### T1.1: Fix ProtectedRoute Hardcoding
**Owner**: @dev-lead | **Effort**: 4h | **Blocking**: Yes

**Current Code Problem**:
```typescript
const isAuthenticated = false;  // 🚨 ALWAYS FALSE
const userRole = null;          // 🚨 ALWAYS NULL
```

**Required Changes**:
- [ ] Connect `isAuthenticated` to `useAuthStore((s) => s.isAuthenticated)`
- [ ] Add `useAuthStore((s) => s.userRole)` selector
- [ ] Verify admin routes render when both are true
- [ ] Add unit test: mock store → route shows content
- [ ] Add E2E test: login → admin accessible

**Acceptance Criteria**:
- ✅ Authenticated user sees admin dashboard
- ✅ Unauthenticated user sees 404
- ✅ Tests pass + coverage included
- ✅ Ready for QA smoke test (T1.4)

**PR Template**: 
```
Title: security: Fix hardcoded ProtectedRoute auth check
Fixes: #[issue-number-blocking-admin]
Related: docs/CODEBASE-COMPREHENSIVE-AUDIT-2026-Q2.md (P0 issue #1)
```

**Evidence**:
- [ ] Commit: [Hash]
- [ ] Unit tests: [File + line range]
- [ ] E2E test: [Cypress spec name]
- [ ] Coverage report: [Link]

---

#### T1.2: Replace Client JWT with Server Auth
**Owner**: @security | **Effort**: 12h | **Blocking**: Yes

**Current Problem**:
- JWT generated on client: `generateMockToken()`
- Stored in localStorage (XSS exposure)
- No server validation

**Required Changes**:
- [ ] Create `api/auth/login` endpoint
- [ ] Accept email + password
- [ ] Verify against seed data (use bcrypt mock for now)
- [ ] Issue JWT server-side (sign with env secret)
- [ ] Return token (httpOnly cookie + response body for SPA)
- [ ] Remove client JWT generation code
- [ ] Update authStore to call `api/auth/login` instead

**New API Flow**:
```
Frontend Login Form
  ↓
POST /api/auth/login { email, password }
  ↓ (server)
  ├─ Verify email exists
  ├─ Compare password hash (bcrypt)
  └─ Sign JWT with secret
  ↓
Return 200 { token, user { id, email, role } }
  ↓
Client stores token in Zustand + localStorage (for now, encrypted later)
```

**Acceptance Criteria**:
- ✅ Login endpoint issues real JWT from API
- ✅ Invalid credentials return 401
- ✅ Frontend stores token + calls API with Authorization header
- ✅ Test: login → JWT claims include user id/role
- ✅ Test: logout deletes token

**PR Template**:
```
Title: security: Server-issued JWT auth
Fixes: #[issue-blocking-jwt]
Related: docs/CODEBASE-COMPREHENSIVE-AUDIT-2026-Q2.md (P0 issue #2)

## Changes
- api/auth/login endpoint (validate + issue JWT)
- authStore updated to call new endpoint
- Removed generateMockToken() fallback
```

---

#### T1.3: Add API Authorization Middleware
**Owner**: @api-dev | **Effort**: 16h | **Blocking**: Yes

**Current Problem**:
- Routes `GET /api/orders`, `POST /api/products` accept all requests
- No auth/authz checks
- Data exposed to unauthorized users

**Required Changes**:
- [ ] Create `api/_lib/auth-middleware.js`
  ```javascript
  export const requireAuth = (handler) => {
    return async (req, res) => {
      if (!req.headers.authorization) return res.status(401).send("Unauthorized");
      const token = req.headers.authorization.split(" ")[1];
      try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
      } catch {
        return res.status(401).send("Invalid token");
      }
      return handler(req, res);
    };
  };
  ```
- [ ] Apply middleware to all `/api/` routes (products, orders, customers)
- [ ] Check user owns resource before allowing DELETE/PUT
  ```javascript
  // For /api/orders/{id}, verify req.user.id matches order.customerId
  const order = await getOrder(id);
  if (order.customerId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).send("Forbidden");
  }
  ```
- [ ] Add authorization checks for admin-only routes
  ```javascript
  if (req.user.role !== 'admin') {
    return res.status(403).send("Admin only");
  }
  ```

**Acceptance Criteria**:
- ✅ Unauthenticated GET /api/orders → 401
- ✅ Authenticated GET /api/orders → returns own orders only
- ✅ Customer cannot DELETE another customer's order → 403
- ✅ Customer cannot POST to /api/admin/* → 403
- ✅ Admin user can access all routes
- ✅ Tests cover all above scenarios

**PR Template**:
```
Title: security: API authorization middleware
Fixes: #[blocking-api-authz]
Related: docs/CODEBASE-COMPREHENSIVE-AUDIT-2026-Q2.md (P0 issue #4)

## Routes Hardened
- GET/POST /api/orders → requireAuth
- GET/POST /api/products → requireAuth + role check
- ... [list all routes]

## Tests Added
- api/__tests__/auth-middleware.test.js (12+ scenarios)
```

---

#### T1.4: Admin Routes E2E Smoke Test
**Owner**: @qa | **Effort**: 2h | **Depends on**: T1.1  
**Status**: Blocked until T1.1 completes

**Test Scenarios**:
- [ ] Login → Admin dashboard loads
- [ ] Navigate ProductManagement → See product list (if data seeded)
- [ ] Navigate OrderManagement → See recent orders
- [ ] Logout → Redirects to home page

**Test File**: `rollon-app/e2e/admin-access.spec.ts` (Playwright)

---

#### T1.5: CI Access & Linting Enforcement
**Owner**: @devops | **Effort**: 2h

**Required Changes**:
- [ ] Add `npm run lint` + `npm test` to GitHub Actions CI
- [ ] Require CI pass before merge (branch protection rule)
- [ ] Add pre-commit hook: `husky` + `lint-staged`
- [ ] Update CODEOWNERS: `.github/CODEOWNERS`
  ```
  * @dev-lead @cto
  api/ @api-dev
  rollon-app/src/pages/admin/ @admin-lead
  ```

**Acceptance Criteria**:
- ✅ All PRs automatically run lint + tests
- ✅ Cannot merge if lint/test fails
- ✅ Pre-commit hook prevents committing unmaintained code
- ✅ CODEOWNERS set for review routing

---

#### T1.6: Error Tracking Integration (Sentry)
**Owner**: @devops | **Effort**: 2h

**Required Changes**:
- [ ] Create Sentry project (RollON production)
- [ ] Copy public DSN to `.env.local` (frontend) + `.env` (API)
- [ ] Frontend: Install `@sentry/react` + configure
  ```javascript
  import * as Sentry from "@sentry/react";
  
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    environment: process.env.NODE_ENV,
  });
  ```
- [ ] API: Install `@sentry/node` + middleware
  ```javascript
  import * as Sentry from "@sentry/node";
  
  Sentry.init({ dsn: process.env.SENTRY_DSN });
  app.use(Sentry.Handlers.errorHandler());
  ```
- [ ] Add correlation ID to all API requests
  ```javascript
  req.correlationId = req.headers['x-correlation-id'] || uuid();
  Sentry.captureException(error, { tags: { correlationId: req.correlationId } });
  ```

**Acceptance Criteria**:
- ✅ Errors appear in Sentry dashboard within 1 minute
- ✅ Frontend + API errors tracked separately
- ✅ Can filter by environment (dev/staging/prod)
- ✅ Runbook references Sentry for troubleshooting

---

### Sprint 1 Status Board (Update Daily)

```
Week 1 (Apr 7-11)
├─ Mon (7th): Kickoff, all tasks start
├─ Tue (8th): T1.1 + T1.2 in progress
├─ Wed (9th): T1.1 PR ready for review
├─ Thu (10th): T1.1 merged, T1.4 unblocked
├─ Fri (11th): T1.2 PR ready, T1.3 half complete
└─ Status: 🟡 On track (13/38h complete)

Week 2 (Apr 14-18)
├─ Mon (14th): T1.2 merged, T1.3 finishes
├─ Tue (15th): All 3 security PRs shipped
├─ Wed (16th): CI + Error tracking integration
├─ Thu (17th): QA sign-off on E2E tests
├─ Fri (18th): Code freeze, release prep
└─ Status: 🟡 On track (38/38h complete)

Release: Mon, Apr 21 → v1.1.0-security
```

---

### Sprint 1 Sign-Off Checkpoints

| Checkpoint | Owner | Status | Date | Notes |
|---|---|---|---|---|
| **Kickoff** | CTO | ✋ Pending | Apr 7 | Assign owners, confirm dates |
| **T1.1 Review** | Tech Lead | ⏳ Waiting | Apr 10 | Auth tests pass |
| **T1.2 Review** | Security Lead | ⏳ Waiting | Apr 14 | Server JWT working |
| **T1.3 Review** | CTO | ⏳ Waiting | Apr 16 | API authz middleware verified |
| **QA Sign-Off** | QA Lead | ⏳ Waiting | Apr 17 | E2E smoke tests pass |
| **CTO Sign-Off** | CTO | ⏳ Waiting | Apr 18 | All issues closed, ready to ship |
| **Ship** | DevOps | ⏳ Waiting | Apr 21 | v1.1.0-security deployed |

---

## SPRINT 2: QUALITY & COMPLIANCE (Coming Next)
**Duration**: Week 3-4 (April 22 - May 5, 2026)  
**Target State**: 6.5/10 → 8.0/10  
**Planned Tasks**: WCAG fixes, E2E tests, bundle optimization, logging, rate limiting  
**Effort Estimate**: 35h  
**Ship Date**: May 5, 2026 (v1.2.0-quality)

[Details will be filled in after Sprint 1 completion]

---

## SPRINT 3: HARDENING & SCALE (Coming After Sprint 2)
**Duration**: Week 5-6 (May 6-19, 2026)  
**Target State**: 8.0/10 → 10.0/10  
**Planned Tasks**: Threat modeling, DB resilience, load testing, on-call runbook  
**Effort Estimate**: 26h  
**Ship Date**: May 19, 2026 (v1.3.0-hardened)

[Details will be filled in after Sprint 2 completion]

---

## VELOCITY TRACKING

### Planned vs Actual
```
Sprint 1:
├─ Planned: 38h
├─ Actual (Week 1): [To be filled]
├─ Actual (Week 2): [To be filled]
└─ Delta: [Burn down chart will be added]
```

### Team Capacity
```
Dev Team (5 members): 40h/week × 2 weeks = 400h available
Sprint 1 Planned: 38h (9.5% utilization)
→ Leaves 362h for other work, support, interrupts
```

---

## BLOCKER LOG

| ID | Blocker | Reporter | Status | ETA | Workaround |
|---|---|---|---|---|---|
| B1.1 | Waiting for Sentry setup | @dev-lead | 🟡 In progress | Apr 7 | Mock error tracking locally |
| | | | | | |

If a blocker appears, document it here + notify team immediately.

---

## ARTIFACT LOG

All deliverables must be linked:

| Sprint 1 Deliverables | Link | Status |
|---|---|---|
| Code: Auth fixes + API hardening | [PR #124-126] | ⏳ Pending |
| Tests: Security test suite | [api/__tests__/auth-middleware.test.js] | ⏳ Pending |
| Docs: Updated audit + evidence | [docs/SECURITY-AUDIT-EVIDENCE.md] | ⏳ Pending |
| Release: v1.1.0-security tag | [github.com/.../releases/v1.1.0-security] | ⏳ Pending |
| Approval: CTO sign-off log | [docs/APPROVAL-LOGS.md] | ⏳ Pending |

---

**Last Updated**: April 7, 2026 (Sprint 1 kickoff)  
**Next Update**: April 14, 2026 (mid-sprint checkpoint)  
**Owner**: Dev Lead + PM  
**Approval Required**: CTO (before each release)
