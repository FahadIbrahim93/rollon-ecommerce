---
name: AGENTS
description: Guidelines for AI agent deployment and context management for RollON autonomous development.
---

# AGENTS.md – AI Autonomy & Context Framework for RollON

**Purpose**: Define how AI agents work autonomously on RollON, access codebase context, and maintain continuity across sessions.

**Audience**: AI agents, developers integrating AI into CI/CD, technical leads

---

## OVERVIEW: THE AI AUTONOMY STACK

```
┌─────────────────────────────────────────────────┐
│  Agent Request (e.g., "/CEO audit codebase")    │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│  Agent Selector (which agent to use?)           │
│  - CEO-Product-Architect → audit, roadmap      │
│  - Code-Reviewer → PR review, quality gates     │
│  - Security-Auditor → vuln scan, threat model   │
│  - Performance-Optimizer → bundle, latency      │
│  - DevOps-Reliability → deploy, observability   │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│  Load SSOT (Single Source of Truth) Context     │
│  - docs/CODEBASE-COMPREHENSIVE-AUDIT-*.md       │
│  - .github/AGENTS.md (this file)                │
│  - .github/copilot-instructions.md              │
│  - Architecture docs, runbooks, checklists      │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│  Agent Execution (code analysis, changes, tests)│
│  - Search codebase (semantic_search, grep)      │
│  - Read/write files (create_file, edit files)   │
│  - Run commands (build, test, lint, git)        │
│  - Subagent calls (Explore for research)        │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│  Output & Attestation                           │
│  - Code changes with test proof                 │
│  - Updated SSOT docs with findings              │
│  - PR description linking to roadmap            │
│  - Evidence logs for audit trail                │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│  Continuous Context Loop                        │
│  - Update SSOT after completion                 │
│  - Next agent starts with full context          │
│  - Prevents duplicate work, enables parallelism │
└─────────────────────────────────────────────────┘
```

---

## AGENT INVENTORY

### 1. CEO-Product-Architect ⭐
**File**: `.github/agents/ceo-product-architect.agent.md`  
**Invoke**: "Act as CEO", "audit codebase", "create 10/10 roadmap"

**Responsibilities**:
- Deep codebase analysis (all 10 dimensions)
- Strategic roadmap creation (30/60/90 breakdown)
- Critical issue triage and prioritization
- Security vulnerability assessment
- Business-technical alignment

**Input**: User request (e.g., "analyze codebase state")  
**Output**: Audit report + roadmap + P0/P1/P2 issue list  
**Effort**: 2-4 hours per pass  
**Success**: 10-dimension ratings + backlog with effort estimates

---

### 2. Code-Reviewer (Planned)
**Invoke**: "Review PR", "quality gate check", "code quality"

**Responsibilities**:
- Lint/type checking on all files
- Test coverage validation
- Security pattern detection
- Performance anti-pattern discovery
- Architecture compliance

**Input**: Pull request or file set  
**Output**: Detailed review comments + fixes  
**Tool Restrictions**: Read-only (no code changes without approval)

---

### 3. Security-Auditor (Planned)
**Invoke**: "Security audit", "vulnerability scan", "threat modeling"

**Responsibilities**:
- Identify auth/token leaks
- Find API authorization gaps
- Check compliance (WCAG, OWASP)
- Threat model + abuse case analysis
- Penetration test validation

**Input**: Codebase or specific module  
**Output**: Vulnerability list + remediation steps  
**Evidence**: Test cases proving fixes

---

### 4. Performance-Optimizer (Planned)
**Invoke**: "Optimize bundle", "reduce latency", "profiling analysis"

**Responsibilities**:
- Bundle size analysis + tree-shaking
- Render performance profiling (React DevTools)
- Database query optimization
- Caching strategy design
- Lighthouse CI integration

**Input**: Performance metrics or user complaint  
**Output**: Optimization PRs + benchmark proofs

---

### 5. DevOps-Reliability (Planned)
**Invoke**: "Deploy to production", "setup observability", "incident playbook"

**Responsibilities**:
- CI/CD pipeline management
- Observability/monitoring setup
- Runbook documentation
- Disaster recovery testing
- Canary/rollback automation

**Input**: Release request or infrastructure change  
**Output**: Deployed code + SLI dashboard + runbook

---

## AGENT INTERACTION WITH SSOT

### How Agents Reference Authoritative Docs

**Before Acting**: Load context
```markdown
1. Read SSOT audit → Understand current state
2. Check roadmap → Know which sprint/milestone
3. Review checklist → Avoid duplicate work
4. Examine PR list → Don't conflict with in-flight changes
```

**Example Agent Startup**:
```
🤖 CEO-Architect Starting Audit Pass #3

📖 Loading SSOT context:
  - Previous audit: v1.0 (10-dim scores, P0-P2 issues)
  - Roadmap status: Sprint 1 complete, 4 PRs merged
  - Current blockers: None (unblocked)
  - Last update: 2026-04-06

🔍 Discovering changes since last pass:
  - New commits: 12 (auth fixes, API hardening)
  - Merged PRs: 4 (security, tests)
  - New SSOT updates: docs/10-10-EXECUTOR-TRACKER.md

📊 Re-running audits on changed files:
  - auth store → ✅ FIXED (now reads from store)
  - API routes → ✅ FIXED (added middleware checks)
  - Tests → 📊 +23% coverage

✅ Audit Pass #3 Complete: 6.0/10 → 7.1/10 (+1.1)
📝 Updated: docs/CODEBASE-COMPREHENSIVE-AUDIT-2026-Q2.md
```

### What Gets Committed to Docs After Each Agent Run

**SSOT Update Template** (append to audit file):

```markdown
## Audit Pass #N – [Date]
**Agent**: [Agent Name] | **Duration**: [Hours] | **Blockers**: [None/[list]]

### Changes Detected Since Last Pass
- Merged PRs: [count] with fixes for [dimension list]
- New files: [list]
- Deprecated code: [list]

### Re-scoring (Before vs After)
| Dimension | Before | After | Delta | Notes |
|-----------|--------|-------|-------|-------|
| Security | 4/10 | 7/10 | +3 | Auth fixes, API middleware |
| ... | ... | ... | ... | ... |
| **Avg** | 6.0/10 | 7.1/10 | +1.1 | On track for Sprint 2 exit |

### Issues Updated
- 5 P0 issues → 3 closed, 2 in-progress
- 8 P1 issues → 2 closed, 6 ready for Sprint 2
- All P2 issues deferred to Sprint 3

### Next Actions (For Next Agent)
1. Focus on [P1 issue] → [owner] (@team)
2. Validate [fix] before merge
3. Update [doc] with new findings

**Evidence**: Commit hash [abc123], PR [#123]
```

---

## CONTEXT BOUNDARIES & TOOL RESTRICTIONS

### Agents SHOULD NOT Do
❌ Directly modify CI/CD workflows (GitHub Actions) without ticket  
❌ Change secrets/env vars (deploy via Vercel console)  
❌ Delete branches or force-push (coordinate with team)  
❌ Merge PRs without human approval  
❌ Make infrastructure changes without runbook review  
❌ Contact external APIs (Slack, Jira, etc.) directly  
❌ Override team decisions without explicit escalation

### Agents SHOULD Do
✅ Create detailed PR descriptions with audit trail  
✅ Leave comments on PRs linking to SSOT rationale  
✅ Update SSOT docs after each pass (append-only)  
✅ Flag blockers as GitHub Issues (not silent failures)  
✅ Provide evidence (test results, audit reports) for all claims  
✅ Escalate unknowns early (don't guess)  
✅ Request human review for critical changes (auth, security)

---

## AGENT REQUEST PATTERNS

### Pattern 1: Autonomous Audit Pass
```
Input: "Agent, run full audit pass on codebase. Update SSOT with findings."

Execution:
1. Load latest SSOT audit
2. Check for merged PRs since last pass
3. Re-run all rating checks (code quality, security, performance, etc.)
4. Detect regressions or improvements
5. Calculate new average score
6. Append findings to SSOT

Output: Updated audit + evidence of changes
```

### Pattern 2: Sprint Execution
```
Input: "Execute Sprint 1: Security fixes. Target: auth + API hardening."

Execution:
1. Load Sprint 1 tasks from SSOT roadmap
2. Create feature branch (e.g., sprint-1-security-hardening)
3. For each task:
   a. Code changes (auth.js, ProtectedRoute, etc.)
   b. Add tests (security unit tests, integration tests)
   c. Run CI checks (linting, type checking, tests)
   d. Create PR with SSOT link
   e. Request team review
4. Track PR merge status
5. Update SSOT roadmap with completion % and blockers

Output: 3-4 PRs merged, roadmap tracking updated
```

### Pattern 3: Guided E2E Delivery
```
Input: "Complete the admin dashboard unblock. Verify all routes accessible."

Execution:
1. Analyze current ProtectedRoute implementation
2. Identify why admin routes blocked
3. Fix code + add tests
4. Verify with Playwright e2e
5. Document fix in SSOT
6. Mark P0 issue as complete

Output: Admin routes accessible + test proof
```

---

## SSOT (SINGLE SOURCE OF TRUTH) DOCUMENT SYSTEM

### Master SSOT Files

**Primary**: `docs/CODEBASE-COMPREHENSIVE-AUDIT-2026-Q2.md`
- 10-dimension scorecard (current state, gaps, target)
- P0/P1/P2 issue registry with effort estimates
- 30/60/90 roadmap (broken into sprints)
- Risk mitigation matrix
- Evidence checkpoints for sign-offs
- **Updated by**: CEO-Product-Architect after each audit pass
- **Frequency**: Weekly (after agent runs)

**Secondary**: `docs/10-10-EXECUTION-ROADMAP-SPRINT-TRACKER.md` (NEW)
- Sprint milestone breakdown (Week 1, Week 2, etc.)
- Task tracking (assigned owner, PR link, status)
- Blocker log with resolution evidence
- Velocity metrics (planned vs actual)
- **Updated by**: Agent + team (async)
- **Frequency**: Daily (on PR merge)

**Tertiary**: `docs/OPERATIONAL-RUNBOOK.md` (NEW)
- Deployment procedures (Vercel, env vars, migrations)
- Incident response playbooks (auth outage, data loss, etc.)
- On-call handoff checklist
- Rollback procedures with evidence
- **Updated by**: DevOps-Reliability agent + SRE team
- **Frequency**: After each production incident or deployment

**Quaternary**: `docs/SECURITY-AUDIT-EVIDENCE.md` (NEW)
- Findings from penetration test
- Fixes applied (with commit hashes)
- Test proof (unit tests, integration tests)
- Compliance checklist (OWASP, WCAG, secure coding)
- **Updated by**: Security-Auditor agent
- **Frequency**: Monthly (security review cycle)

### SSOT Governance

| Doc | Owner | R/W Access | Update Frequency |
|-----|-------|-----------|------------------|
| Audit | CTO + CEO-Agent | Full | Weekly |
| Roadmap | PM + Dev Team | Full | Daily |
| Runbook | SRE + DevOps-Agent | Full | Per incident |
| Security | Sec Lead + Security-Agent | Full | Monthly |

**Review Gate**: All SSOT updates require +1 from team lead (async, 24h)

---

## AGENT COORDINATION (Multi-Agent Mode)

### Handoff Pattern
```
Agent 1 (Audit) → Creates roadmap + SSOT
                    ↓
Agent 2 (Reviewer) → Reviews planned changes, flags risks
                    ↓
Agent 3 (Security) → Validates security aspect of roadmap
                    ↓
Agent 4 (Executor) → Implements Sprint 1 tasks
                    ↓
Agent 5 (DevOps)   → Deploys, creates runbook, validates SLOs
                    ↓
[Back to Agent 1]  → Re-audit → New scores → Repeat
```

### Parallel Execution
Some agents can run in parallel if independent:
- **Security-Auditor** scans codebase (read-only)
- **Performance-Optimizer** profiles bundle (read-only)
- → Both output findings to same SSOT file (merge safely)

### Conflict Resolution
If agents disagree on priority:
1. CEO-Architect owns final decision (makes the call)
2. Document disagreement in SSOT with rationale
3. Move forward with decision (no re-litigating)

---

## AGENT CAPABILITY MATRIX

| Agent | Read Code | Write Code | Run Tests | Merge PR | Update Docs | Make Decisions | Escalate |
|-------|-----------|-----------|-----------|----------|------------|---------------|----------|
| CEO-Architect | ✅ | ✅ | ✅ | ⚠️ Draft | ✅ | ✅ | ✅ |
| Code-Reviewer | ✅ | ❌ | ✅ | ❌ | ⚠️ Comment | ⚠️ Suggest | ✅ |
| Security-Auditor | ✅ | ✅ | ✅ | ⚠️ Draft | ✅ | ✅ | ✅ |
| Performance-Optimizer | ✅ | ✅ | ✅ | ⚠️ Draft | ✅ | ⚠️ Data-driven | ✅ |
| DevOps-Reliability | ✅ | ⚠️ Limited | ✅ | ⚠️ With approval | ✅ | ⚠️ Runbook only | ✅ |

**Legend**: ✅ Full authority | ⚠️ With approval | ❌ Not permitted

---

## EXAMPLE: AGENT SESSION LOG

```
=== Agent Session: Sprint 1 Security Hardening ===
Timestamp: 2026-04-07 14:00 UTC
Agent: CEO-Product-Architect
Request: "Execute Sprint 1 security fixes. Auth + API hardening."

[PHASE 1: CONTEXT LOADING]
✅ Loaded SSOT: docs/CODEBASE-COMPREHENSIVE-AUDIT-2026-Q2.md
✅ Previous state: 6.0/10 (P0 issues: auth hardcoded, JWT client-side, API unauth)
✅ Sprint 1 tasks: 5 items, 38h planned, 1 blocker (none currently)

[PHASE 2: DISCOVERY]
✅ Scanned codebase for auth flows
   → Found: ProtectedRoute.tsx (hardcoded false)
   → Found: authStore.ts (JWT fallback generator)
   → Found: api/orders/index.js (no middleware)
✅ No conflicting PRs in flight

[PHASE 3: EXECUTION]
📝 Task 1: Fix ProtectedRoute.tsx
   → Reading current impl
   → Connect isAuthenticated to authStore selector
   → Add useEffect to check store state
   → Create unit test + coverage check
   PR #124: "security: Fix hardcoded ProtectedRoute auth check"

📝 Task 2: Replace JWT client generation
   → Reading authStore logic
   → Remove generateMockToken function
   → Add api/auth/login endpoint (server-side JWT)
   → Hash password verification (bcrypt)
   → Add test: login flow validates server JWT
   PR #125: "security: Server-issued JWT auth"

📝 Task 3: Add API authorization middleware
   → Create lib/auth-middleware.js
   → Check JWT on all /api/* routes
   → Verify user owns resource (orders, profile)
   → Add 401/403 error responses
   PR #126: "security: API authz middleware"

[PHASE 4: VALIDATION]
✅ All PRs pass CI (linting, type checking, tests)
✅ E2E: Admin login → dashboard accessible
✅ E2E: API unauthorized → 401 returned
✅ No regressions in existing tests

[PHASE 5: SSOT UPDATE]
📝 Updated: docs/CODEBASE-COMPREHENSIVE-AUDIT-2026-Q2.md
   - Security: 4/10 → 7/10 (auth fixed, API hardened)
   - Overall: 6.0/10 → 6.5/10
   - P0 issues: 3 closed, 2 remaining (API roles, WCAG)
   - Next: Sprint 2 quality gates

📝 Updated: docs/10-10-EXECUTION-ROADMAP-SPRINT-TRACKER.md
   - Sprint 1: 3/5 tasks complete
   - Velocity: 18h actual vs 38h planned (on track)

[RESULT]
🎯 Sprint 1 Security Phase: 60% complete
📊 Scores: Security 4/10 → 7/10 (+3)
🚀 Ready for team review + sprint 2 kickoff
🔗 Audit trail: [github.com/.../pulls/124-126]
```

---

## INTEGRATION POINTS

### GitHub Actions CI/CD
```yaml
name: Agent-Audit-Pass
on:
  schedule:
    - cron: '0 9 * * MON'  # Weekly Monday audit
  workflow_dispatch:

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: CEO-Architect Audit Pass
        run: |
          # Invoke agent programmatically (TBD - API integration)
          # Agent reads SSOT, finds changes, updates doc
          # Creates PR with updated audit
```

### VS Code Integration
```markdown
Command Palette: `GitHub Copilot: Agents`
→ Select Agent: "CEO-Product-Architect"
→ Request: "Audit codebase"
→ Agent runs in sidebar, updates docs, offers PR
```

### Slack Integration (Future)
```
/agent audit            → CEO-Agent audits, posts summary
/agent deploy sprint-1  → DevOps-Agent deploys, creates runbook
/agent pr-review #123   → Code-Reviewer reviews PR, posts feedback
```

---

## SUCCESS METRICS FOR AGENT OPERATIONS

✅ **Consistency**: Same agent, same request → same high-quality result  
✅ **Continuity**: Each agent run builds on previous (no re-analyzing old issues)  
✅ **Speed**: Audit pass < 4 hours, fix validation < 2 hours  
✅ **Accuracy**: 99% of agent recommendations passed team review without changes  
✅ **Autonomy**: Agent can execute full sprint without ad-hoc human interaction  
✅ **Transparency**: All decisions documented in SSOT with links to evidence  
✅ **Trust**: Team confident shipping code agent has reviewed/approved  

---

## NEXT STEPS FOR AGENT IMPLEMENTATION

1. **This Sprint**: Deploy CEO-Architect agent, run first audit pass
2. **Sprint 2**: Add Code-Reviewer + Security-Auditor agents
3. **Sprint 3**: Add Performance-Optimizer + DevOps-Reliability agents
4. **Post-Sprint**: Enable multi-agent mode + automated scheduling

---

**Version**: 1.0  
**Last Updated**: April 7, 2026  
**Maintained By**: CTO + AI Platform Team  
**Status**: Active (adopting for 30/60/90 roadmap)
