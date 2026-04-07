---
title: SSOT (Single Source of Truth) – RollON Codebase Authority Map
description: Central index directing to all authoritative docs for RollON e-commerce platform.
---

# SSOT – Single Source of Truth System for RollON

**Purpose**: Eliminate ambiguity about what's authoritative, current, and actionable.  
**Audience**: Developers, AI agents, tech leads, product managers  
**Last Updated**: April 7, 2026

---

## PROBLEM STATEMENT

Before SSOT, the codebase existed in multiple states:
- `docs/cto-*.md` had different findings and scores
- `docs/project_audit.md` was outdated
- No clear roadmap vs execution tracker
- Agents didn't know which doc to trust
- Team duplicated work across PRs

**SSOT Solution**: One authoritative source per topic, linked clearly, updated consistently.

---

## SSOT DOCUMENT HIERARCHY

```
RollON SSOT System
│
├─ 🟢 LIVE AUDIT (Most Active)
│  ├─ docs/CODEBASE-COMPREHENSIVE-AUDIT-2026-Q2.md
│  │  └─ 10-dimension scorecard, P0/P1/P2 issues, 30/60/90 roadmap, evidence checkpoints
│  │
│  └─ .github/AGENTS.md
│     └─ AI agent deployment guidelines, SSOT navigation, capability matrix
│
├─ 🟡 ROADMAP & EXECUTION (Weekly Updates)
│  ├─ docs/10-10-EXECUTION-ROADMAP-SPRINT-TRACKER.md (NEW)
│  │  └─ Sprint breakdown, task tracking, velocity metrics, blockers, PR links
│  │
│  └─ .github/agents/ceo-product-architect.agent.md
│     └─ Agent workflow, dimension checklist, investigation commands, execution template
│
├─ 🔴 OPERATIONS & INCIDENTS (On-Demand)
│  ├─ docs/OPERATIONAL-RUNBOOK.md (NEW)
│  │  └─ Deployment playbook, incident response, on-call SOP, rollback procedures
│  │
│  └─ docs/SECURITY-AUDIT-EVIDENCE.md (NEW)
│     └─ Penetration test findings, test proof, compliance checklist, audit trail
│
└─ 📚 REFERENCE (Evergreen)
   ├─ README.md (project overview)
   ├─ .github/CODEOWNERS (who owns what)
   ├─ .github/CONTRIBUTING.md (dev guidelines)
   ├─ .github/SECURITY.md (vulnerability reporting)
   └─ docs/database-architecture.md (schema, migrations)
```

---

## QUICK REFERENCE: WHICH DOCUMENT TO USE

### "I need to understand the codebase state"
→ **`docs/CODEBASE-COMPREHENSIVE-AUDIT-2026-Q2.md`**
- 10-dimension ratings (current vs target)
- P0/P1/P2 issues with effort estimates
- Evidence of what was tested
- Next steps

### "I need to know what to work on for Sprint 1"
→ **`docs/10-10-EXECUTION-ROADMAP-SPRINT-TRACKER.md`**
- List of tasks (owner, PR link, due date)
- Blocked issues and escalations
- Velocity tracking (planned vs actual)
- Who's working on what

### "What happens if production breaks?"
→ **`docs/OPERATIONAL-RUNBOOK.md`**
- Incident response steps (who to page, what to check)
- Deployment procedures (how to roll back)
- Health checks and monitoring
- On-call contact info

### "What security issues were found and fixed?"
→ **`docs/SECURITY-AUDIT-EVIDENCE.md`**
- Vulnerability list (CVSS score, CWE ID)
- How each was fixed (code commit, test proof)
- Compliance checklist (OWASP Top 10, WCAG AA)
- Last penetration test date

### "I'm an AI agent, where do I load context?"
→ **`.github/AGENTS.md`** (this section, then `AUDIT`)
1. Read `.github/AGENTS.md` (agent overview + tool restrictions)
2. Load `docs/CODEBASE-COMPREHENSIVE-AUDIT-2026-Q2.md` (current state)
3. Check `docs/10-10-EXECUTION-ROADMAP-SPRINT-TRACKER.md` (what's running)
4. Then execute your task and append findings back to AUDIT

### "How do I deploy this?"
→ **`OPERATIONAL-RUNBOOK.md`** (deployment section) + `README.md` (environment setup)

### "Is there a config I should know about?"
→ **`docs/database-architecture.md`** or `/api/_lib/` code comments

---

## SSOT UPDATE PROTOCOL

### Weekly Audit Review (Every Monday)
**Owner**: CTO / Tech Lead  
**Action**: CEO-Architect agent runs audit pass

1. Load current audit from SSOT
2. Check for merged PRs since last pass
3. Re-score dimensions where changes occurred
4. Update scores + close completed P0 issues
5. **Append** new audit pass entry (don't rewrite, add versioning)
6. Create PR with audit update → team reviews + merges

**Template for Audit Append**:
```markdown
## Audit Pass #N – [Date]
**Agent**: CEO-Product-Architect | **Sprint**: [Sprint name] | **Issues Reviewed**: [count]

### Score Changes
| Dimension | Before | After | Reason |
|-----------|--------|-------|--------|
| Security | 4/10 | 7/10 | Auth fixes + API middleware ✅ |
| ...

### P0 Issues Update
- [X] Auth hardcoded (CLOSED) → PR #124
- [ ] Admin routes blocked → IN PROGRESS (PR #125)
- [ ] API unauth → IN PROGRESS (PR #126)

### Next Agent Priorities
1. Validate WCAG fixes (scheduled Sprint 2)
2. Merge pending security PRs
3. Plan performance optimization task

**Updated**: 2026-04-14 (Next review: 2026-04-21)
```

---

### Sprint Completion (End of each sprint)
**Owner**: Dev Lead / PM  
**Action**: Update roadmap tracker + run audit pass

1. List all merged PRs for the sprint
2. Update task tracking (✅ completed, moved to production)
3. Calculate actual effort vs planned
4. Flag any p-1 or p-2 work that rolled over
5. **Append** sprint summary to roadmap tracker
6. Run audit agent to get new scores

**Template for Roadmap Update**:
```markdown
## Sprint 1 Complete – [End Date]
**Status**: ✅ SHIPPED v1.1.0-security

### Task Summary
- Tasks planned: 5 | Completed: 5 | Rolled over: 0
- Effort: 38h planned, 40h actual (95% variance)
- Blockers resolved: 2
- Quality: All tests pass + CTO sign-off

### Merged PRs
- #124: security: Fix hardcoded ProtectedRoute
- #125: security: Server-issued JWT auth
- #126: security: API authz middleware
- #127: test: Expand security test coverage

### Audit Results After Sprint 1
- Overall: 6.0/10 → 6.5/10
- Security: 4/10 → 7/10 ✅
- Admin access: Unblocked ✅
- Next: Sprint 2 quality gates (WCAG, e2e tests)

**Owner**: @[dev-lead] | **Sign-off**: @[cto]
```

### Major Findings (Ad-Hoc)
**Owner**: Agent or discoverer  
**Action**: Escalate via GitHub Issue + update SSOT immediately

Example: "Found XSS vulnerability in product search"
1. Create GitHub Issue (security label, P0)
2. Add to `docs/SECURITY-AUDIT-EVIDENCE.md` as "NEW"
3. Link from audit document (`docs/CODEBASE-COMPREHENSIVE-AUDIT-2026-Q2.md`)
4. Notify team in Slack (if available) with link

**Do not delay SSOT updates for major findings.**

---

## OWNERSHIP & GOVERNANCE

### Document Ownership Matrix

| Document | Primary Owner | Secondary | Update Frequency | Review Approval |
|----------|---------------|-----------|------------------|-----------------|
| Audit | CTO | CEO-Agent | Weekly | Tech Lead |
| Roadmap Tracker | PM / Dev Lead | Team | Daily | PM |
| Runbook | SRE / DevOps | CTO | Per incident | CTO |
| Security Evidence | Security Lead | Security-Agent | Monthly | CTO |
| AGENTS.md | CTO | AI Platform team | As needed | CTO + PM |

### Update Workflow
```
Write change → Create PR → Add SSOT tag → Request review 
→ +1 approval → Merge → Update SSOT immediately → Notify team
```

**SSOT PR Template**:
```markdown
## PR Title
docs: Update SSOT after Sprint 1 completion

## Type of Update
- [x] Audit pass (dimension re-scoring)
- [ ] Roadmap tracker (tasks added/closed)
- [ ] Runbook (new incident procedure)
- [ ] Security evidence (new findings)

## Changes
- Added Audit Pass #5 findings
- Updated 3 dimension scores based on merged PRs
- Closed 2 P0 issues

## Links
- Relates to sprint: Sprint 1 - Security
- Related PRs: #124, #125, #126
- Incident/finding: [GitHub Issue link if applicable]

## Checklist
- [ ] Links are accurate
- [ ] Data matches merged PRs
- [ ] No outdated information removed (append only)
- [ ] Table formatting checks (if applicable)
```

---

## INTEGRATION EXAMPLES

### Developer Onboarding
New dev joins → reads SSOT quickly:

```bash
# 1. Understand codebase state
less docs/CODEBASE-COMPREHENSIVE-AUDIT-2026-Q2.md

# 2. See current sprint
less docs/10-10-EXECUTION-ROADMAP-SPRINT-TRACKER.md

# 3. Learn how to deploy
less docs/OPERATIONAL-RUNBOOK.md

# 4. Check security posture
less docs/SECURITY-AUDIT-EVIDENCE.md

# Total time: 30 min → Full context about project state
```

### AI Agent Startup
Agent receives request → loads context:

```
Agent: "Audit codebase for me"

1. Check .github/AGENTS.md (understand my role)
2. Load docs/CODEBASE-COMPREHENSIVE-AUDIT-2026-Q2.md (current state: 6.0/10)
3. Check docs/10-10-EXECUTION-ROADMAP-SPRINT-TRACKER.md (running Sprint 1)
4. Discover 4 PRs merged (#124-#127) since last audit
5. Re-score affected dimensions
6. Update docs/CODEBASE-COMPREHENSIVE-AUDIT-2026-Q2.md with new results
7. Return: "Audit complete: 6.0/10 → 6.5/10. See [link to SSOT]"
```

### Incident Response
Prod issue occurs → check runbook:

```
SRE: Production error spike detected

1. Open docs/OPERATIONAL-RUNBOOK.md
2. Find "High Error Rate Incident" section
3. Follow playbook:
   - Check health endpoint
   - Review error logs in Sentry
   - Identify affected service
   - Trigger rollback if needed
   - Document in incident log

Total: 5 min from alert to mitigation
```

---

## ANTI-PATTERNS (What NOT to Do)

❌ **Multiple Audits**: Don't create new audit files constantly. Update the existing one.  
❌ **Outdated Docs**: If docs are >2 weeks old, they're suspect. Ask when last updated.  
❌ **Scattered Changes**: Don't make roadmap changes without updating tracker.  
❌ **Silent Rollbacks**: If you deploy a fix, update SSOT + notify team.  
❌ **New Standards**: Don't invent new document types; use existing SSOT structure.  
❌ **Lost Evidence**: Always link PR #, commit hash, test results to SSOT entries.  

---

## ROLLOUT PLAN FOR SSOT

### Phase 1 (This Sprint): Core SSOT in Place
- ✅ Audit: `docs/CODEBASE-COMPREHENSIVE-AUDIT-2026-Q2.md` (already live)
- ✅ Agents: `.github/AGENTS.md` (already live)
- ✅ Agents Framework: `.github/agents/ceo-product-architect.agent.md` (already live)
- 🟡 Roadmap: `docs/10-10-EXECUTION-ROADMAP-SPRINT-TRACKER.md` (Starting Sprint 1)

### Phase 2 (Sprint 2): Operational Docs
- 🟡 Runbook: `docs/OPERATIONAL-RUNBOOK.md` (First deployment / incident)
- 🟡 Security Evidence: `docs/SECURITY-AUDIT-EVIDENCE.md` (Post-security audit)

### Phase 3 (Sprint 3+): AI Agent Autonomy
- Multi-agent runs (Reviewer, Security, Performance)
- Automated SSOT updates on PR merge
- Agent decision log in SSOT

---

## SSOT QUICK HEALTH CHECK

**Every week, verify your SSOT is healthy**:

```bash
# Check all SSOT files exist
[ -f docs/CODEBASE-COMPREHENSIVE-AUDIT-2026-Q2.md ] && echo "✅ Audit" || echo "❌ Audit missing"
[ -f docs/10-10-EXECUTION-ROADMAP-SPRINT-TRACKER.md ] && echo "✅ Roadmap" || echo "❌ Roadmap missing"
[ -f docs/OPERATIONAL-RUNBOOK.md ] && echo "✅ Runbook" || echo "❌ Runbook missing"
[ -f docs/SECURITY-AUDIT-EVIDENCE.md ] && echo "✅ Security" || echo "❌ Security missing"
[ -f .github/AGENTS.md ] && echo "✅ Agents" || echo "❌ Agents missing"

# Check timestamps (last modified <14 days ago for active docs)
find docs -name "*AUDIT*" -o -name "*ROADMAP*" -o -name "*RUNBOOK*" | xargs ls -lt
```

---

## NEXT STEPS

1. **Bookmark SSOT files** in your editor/wiki
2. **Subscribe to notification** when SSOT files are updated (GitHub watch)
3. **Add to PR template**: "Does this affect SSOT docs? Link them."
4. **Run first audit pass** (CEO-Agent, this week)
5. **Update roadmap tracker** as Sprint 1 tasks complete
6. **Monthly review**: Verify all SSOT docs are current and accurate

---

**Status**: 🟢 LIVE (Active use starting Sprint 1)  
**Version**: 1.0  
**Last Updated**: April 7, 2026  
**Next Update**: April 14, 2026 (end of week 1)

---

## CONTACT & ESCALATION

**SSOT Questions?** → Ask @cto or @tech-lead  
**Found outdated SSOT?** → Create GitHub Issue with "ssot" label  
**Need a new SSOT doc?** → Propose to CTO, document in `.github/AGENTS.md` first  
