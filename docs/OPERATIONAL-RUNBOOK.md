---
title: RollON Operational Runbook
description: Deployment procedures, incident response, on-call SOP, and rollback procedures.
---

# OPERATIONAL RUNBOOK – RollON E-Commerce Platform

**Purpose**: Enable on-call engineers and platform team to deploy, monitor, and respond to incidents with confidence.

**Audience**: SRE, DevOps, On-Call Engineers, CTO  
**Last Updated**: April 7, 2026

---

## QUICK REFERENCE (TL;DR for Firefighting)

### "Production is down"
1. Check Sentry dashboard (link below)
2. Check Vercel deployment status
3. Review `#incidents` Slack channel (if configured)
4. Follow **[Incident Response](#incident-response-playbooks)** section for your error type
5. If unsure: **ESCALATE TO CTO** immediately

### "I need to deploy"
1. Create PR, get approval, merge to `master`
2. Vercel auto-deploys (or manual: `vercel deploy`)
3. Verify deployment in Vercel dashboard
4. Run health checks (see **[Health Checks](#health-checks)**)

### "I need to rollback"
1. Identify bad commit in Vercel dashboard
2. Revert to last known-good deployment
3. Verify health checks pass
4. Post-mortem in `#incidents`

---

## INFRASTRUCTURE OVERVIEW

```
Frontend: React App (Vercel)
├─ Build: .github/workflows/build.yml (npm run build)
├─ Deploy: Vercel auto-deploy on master merge
├─ CDN: Vercel Edge Network (global)
└─ Monitoring: Sentry + Vercel Analytics

API Endpoints: Vercel Serverless Functions
├─ Health: GET /api/health
├─ Products: GET/POST /api/products (with auth)
├─ Orders: GET/POST /api/orders (with auth)
├─ Customers: GET/POST /api/customers (with auth)
├─ Categories: GET /api/categories
└─ Auth: POST /api/auth/login

Database: Upstash Redis (Serverless)
├─ Connection: env.UPSTASH_REDIS_REST_URL
├─ Auth: env.UPSTASH_REDIS_REST_TOKEN
├─ Backup: Automated (Upstash)
└─ Restore: Manual via Upstash dashboard

Observability Stack:
├─ Errors: Sentry (frontend + API)
├─ Logs: Upstash Logs (API only, for now)
├─ Metrics: Vercel Analytics + Sentry
└─ Alerting: TBD (manual checks for now)
```

---

## DEPLOYMENT PROCEDURE

### Pre-Deployment Checklist
- [ ] All tests pass locally: `npm test -- --run`
- [ ] Linting passes: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] No security issues: `npm audit`
- [ ] Code review approved: +1 from tech lead
- [ ] SSOT updated: Link PR to audit/roadmap

### Automated Deployment (Primary)

**Trigger**: Merge to `master` branch

```
1. GitHub Actions CI runs (tests + linting)
   └─ If any step fails → Stop (no deploy)

2. If all pass → Vercel webhook triggered
   └─ Vercel detects master branch change

3. Vercel builds project
   ├─ Install deps: npm ci
   ├─ Type check: tsc -b
   ├─ Build app: vite build
   └─ If build fails → Deployment halted (see Sentry)

4. Vercel deploys to production
   ├─ Routes traffic to new build
   ├─ Keeps previous build as fallback (instant rollback available)
   └─ Propagates to CDN (~5 min globally)

5. Deployment complete (URL: https://rollon-premium-smoking.vercel.app)
```

**Monitoring After Deploy**:
1. Check Vercel dashboard: No errors in build log
2. Visit app URL: Page loads, no console errors
3. Check Sentry: No error spike in first 5 minutes
4. Run smoke tests (health checks below)
5. Notify team in Slack: ✅ v[VERSION] deployed

### Manual Deployment (If Needed)

```bash
# Option 1: Via Vercel CLI
vercel deploy --prod

# Option 2: Via Vercel Web Dashboard
1. Log into https://vercel.com
2. Select RollON project
3. Find recent git commit
4. Click "Redeploy" button
5. Confirm

# Verification
curl https://rollon-premium-smoking.vercel.app/api/health
# Expected: { "status": "ok", "timestamp": "2026-04-07T14:30:00Z" }
```

### Deployment Rollback

**Scenario**: New deployment has critical errors, need instant rollback

**Steps**:
```
1. Identify bad deployment
   - Check Sentry for error spike
   - Check Vercel build logs for failures
   - Check Slack reports from team

2. Find previous stable deployment
   - Go to Vercel dashboard → Deployments tab
   - Identify last successful deployment (marked green)
   - Verify timestamp (e.g., "Deployed 2 hours ago")

3. Rollback
   - Click "Promote to Production" on previous deployment
   - Wait 1-2 minutes for CDN propagation
   - Verify health checks pass

4. Post-mortem
   - Identify what caused the bad deployment
   - Add to GitHub Issues (label: "postmortem")
   - Update SSOT with incident findings
```

**Time to Rollback**: < 5 minutes (automatic after clicking)

---

## HEALTH CHECKS

### Pre-Deployment (Local)
```bash
# Run before merging PR
npm run lint          # No linting errors
npm test -- --run     # All tests pass (>80% pass rate)
npm run build         # Build succeeds (no ts errors)
npm audit --omit=dev  # No critical vulns in dependencies
```

### Post-Deployment (Production)

**Automated Health Check** (Run weekly or after deploy):
```bash
#!/bin/bash
# health-check.sh

HEALTH_URL="https://rollon-premium-smoking.vercel.app/api/health"

# Check API is responding
RESPONSE=$(curl -s -w "\n%{http_code}" "$HEALTH_URL")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" != "200" ]; then
  echo "❌ FAIL: Health check returned $HTTP_CODE"
  echo "Response: $BODY"
  exit 1
fi

if echo "$BODY" | grep -q '"status":"ok"'; then
  echo "✅ PASS: API healthy"
else
  echo "❌ FAIL: Unexpected health response"
  echo "$BODY"
  exit 1
fi
```

**Manual Health Check** (Do this after every deploy):
```
1. ✅ API Health
   curl https://rollon-premium-smoking.vercel.app/api/health
   Expected: { "status": "ok", "version": "1.1.0", ... }

2. ✅ Frontend Loads
   Open https://rollon-premium-smoking.vercel.app in browser
   Check: Page loads, no console errors (F12 DevTools)

3. ✅ Products API
   curl https://rollon-premium-smoking.vercel.app/api/products
   Expected: 200 OK, returns product array

4. ✅ Category Seed
   curl https://rollon-premium-smoking.vercel.app/api/categories
   Expected: 200 OK, returns ["Pipes", "Bongs", ...]

5. ✅ Error Tracking
   Log into Sentry dashboard
   Check: No new errors in last 5 minutes

Take screenshot of all ✅ checks → post in Slack #deployments
```

---

## MONITORING & OBSERVABILITY

### Sentry Dashboard
**URL**: https://sentry.io/organizations/rollon/issues/  
**Access**: Managed by CTO  

**What to Check**:
- **Error Rate**: Should be <1% (target <0.1%)
- **New Issues**: Any issues created in last hour?
- **Error Trend**: Is error rate increasing or stable?
- **Affected Users**: How many users experiencing errors?

**If Error Spike Detected**:
- [ ] Click largest issue → View stack trace
- [ ] Check timestamp: When did errors start?
- [ ] Identify affected endpoint/page
- [ ] Check recent deployments: Any deploy matching error start time?
- [ ] If yes: **SUSPECT DEPLOYMENT** (see Rollback section)
- [ ] Check for external factors: API down? Database slow?

### Vercel Analytics
**URL**: https://vercel.com/dashboard/rollon-premium-smoking  
**Metrics**:
- **Web Vitals**: First Contentful Paint (FCP), Largest Contentful Paint (LCP)
- **Build Time**: Should be <5 min
- **Deployments**: All recent deploys + status
- **Error Log**: Top errors from last 24 hours

### Log Aggregation (Future: Upstash Logs / ELK)
**Status**: TBD  
**Action**: Configure in Sprint 2

---

## INCIDENT RESPONSE PLAYBOOKS

### Playbook 1: "High Error Rate" (>5% of requests failing)

**Symptoms**:
- Sentry shows 100+ errors in 5 minutes
- Users report blank pages or crashes
- Vercel dashboard shows red warning

**Response Step 1 - Triage (< 2 min)**:
```
1. Open Sentry → Identify top error type
2. Check stack trace: Frontend error? API error?
3. Check Vercel deployments: Any deploy in last 30 min?
4. Check database: Is Redis responding?
   curl ${UPSTASH_REDIS_REST_URL}/set/healthcheck/ok?auth=${UPSTASH_REDIS_REST_TOKEN}
5. Determine: Deployment issue, or external factor?
```

**Response Step 2 - Decision Tree**:
```
Is it a NEW ERROR (not seen before)?
  ├─ YES → Likely caused by recent deployment
  │  └─ ROLLBACK IMMEDIATELY (see Rollback section)
  │
  └─ NO → Known issue, possibly infrastructure
     ├─ Database slow? (Check Upstash dashboard)
     │  └─ Action: Optimize queries or scale up
     │
     └─ CDN issue? (Check Vercel analytics)
        └─ Action: Clear cache or wait for propagation
```

**Response Step 3 - Notification**:
```
Message to #incidents channel (if configured):
"🚨 Incident: High Error Rate (5% reported)
- Start time: [timestamp]
- Error type: [top error from Sentry]
- Status: INVESTIGATING
- Owner: @oncall-engineer
- ETA to resolution: TBD"

Update every 5 minutes with status.
```

**Resolution**:
```
Once fixed (rollback or fix applied):
"✅ Resolved: [brief description of fix]
- Mitigation time: [duration from detection to fix]
- Post-mortem: [GitHub Issue link]"
```

---

### Playbook 2: "Database Connection Failure"

**Symptoms**:
- API returns 500 on all database calls (orders, customers, products)
- Sentry shows "UPSTASH_REDIS_REST_URL connection failed"
- Health check fails

**Response**:
```
1. Verify Upstash status
   https://status.upstash.com/
   └─ If RED: Wait for Upstash to recover (~10 min), notify team

2. Check credentials
   - Verify UPSTASH_REDIS_REST_URL is set in Vercel env
   - Verify UPSTASH_REDIS_REST_TOKEN is set and correct
   → Action: Re-deploy Vercel to refresh env vars if recently changed

3. Check network connectivity from API
   - Upstash requires HTTPS connection
   - Vercel allows outbound HTTPS by default
   → Action: Verify no firewall rules blocking Upstash IP range

4. If still failing:
   - Escalate to Upstash support (CTO owns account)
   - Roll back to previous working deployment
   - Notify team in Slack
```

---

### Playbook 3: "Auth Service Down / Login Failing"

**Symptoms**:
- Users cannot log in (401 on POST /api/auth/login)
- Sentry shows auth middleware errors
- Caused by: JWT secret missing, password validation failing

**Response**:
```
1. Check /api/auth/login endpoint
   curl -X POST https://rollon-premium-smoking.vercel.app/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@rollon.com","password":"admin123"}'
   
   └─ If 500: Check Sentry for error details

2. Verify JWT_SECRET env var in Vercel
   - Go to Vercel project settings → Environment Variables
   - Confirm JWT_SECRET is set and non-empty
   - If missing: Add it (value: some-secret-key-here-minsed-32-chars)
   - Re-deploy Vercel

3. Check seed data
   - Verify admin@rollon.com exists in database
   - If corrupted: Reseed database (see Database section)

4. If all checks pass:
   - Clear browser local storage (F12 → Application → Clear Storage)
   - Try login again
   - If still fails: Escalate to CTO
```

---

### Playbook 4: "Deployment Failed / Build Timeout"

**Symptoms**:
- Vercel dashboard shows "Build Failed" (red X)
- GitHub Actions CI fails with error
- No new code deployed

**Response**:
```
1. Check Vercel build log
   https://vercel.com → RollON project → Deployments → [latest]
   └─ Click "Build Logs" to view error

2. Common build errors and fixes:
   
   a) "Module not found: recharts"
      └─ Action: npm ci (clean dependency install)
   
   b) "TypeScript compilation failed"
      └─ Action: Check git diff, find newly introduced type error
      └─ Fix type error, re-push
   
   c) "ESLint errors"
      └─ Action: Run npm run lint locally, fix violations
   
   d) "Build timeout (>15 min)"
      └─ Action: Check for infinite loops, large file loops
      └─ Optimize build, contact Vercel support if persistent

3. After fixing:
   - Push fix commit to master (or new PR)
   - Re-trigger deploy (automatic on merge)
   - Verify build succeeds
```

---

### Playbook 5: "Performance Degradation / Slow Page Loads"

**Symptoms**:
- Page takes >5 sec to load (user reports)
- Vercel analytics shows LCP > 3s
- Users report "spinning" or lag

**Response**:
```
1. Check Vercel metrics
   https://vercel.com → Analytics
   └─ Review FCP, LCP, CLS over last hour
   └─ Is it trending up? Compare to baseline

2. Check bundle size
   npm run build
   > dist/index-*.js (check file size)
   └─ Expected: < 200KB for admin routes
   └─ If >300KB: Run bundle analyzer
      npm run build -- --analyze

3. Check database queries
   - Are product/order queries slow?
   - Check Upstash response time
   - Add caching if appropriate

4. Check client-side rendering
   - F12 DevTools → Performance tab
   - Record page load
   - Look for long blocking scripts
   - Look for excessive re-renders (React DevTools Profiler)

5. If root cause found:
   - Create GitHub Issue with performance findings
   - Add to Sprint 3 board (performance optimization task)
   - Deploy interim fix if critical
```

---

## DATABASE OPERATIONS

### Data Backup & Recovery

**Automated Backups**:
- Upstash Redis automatically backs up 1x daily
- Accessible via Upstash dashboard (Console → Backups)

**Manual Backup** (Before major changes):
```bash
# Export entire database to JSON
# (Via Upstash REST API or CLI)
curl "${UPSTASH_REDIS_REST_URL}/scan/0?auth=${UPSTASH_REDIS_REST_TOKEN}"
  # Returns all keys
  # Pipe to jq for formatting
```

**Restore from Backup**:
```
1. Go to Upstash dashboard → Database → Backups tab
2. Select backup before data loss incident
3. Click "Restore"
4. Confirm (this will overwrite current data)
5. Wait ~5 min for restore to complete
6. Test database connectivity
7. Verify data integrity (check key sample)
```

### Database Reseeding

**Scenario**: Corrupted product/category data, need to reload from source-of-truth

```bash
# 1. Stop API traffic (tell team via Slack)
# 2. Reseed database
curl -X POST https://rollon-premium-smoking.vercel.app/api/admin/seed

# 3. Verify seed completed (check logs in Sentry)
# 4. Run health checks (products API returns data)
curl https://rollon-premium-smoking.vercel.app/api/products

# 5. If data looks good: Resume traffic
```

---

## ON-CALL ROTATION

### On-Call Engineer Responsibilities

**During On-Call Shift** (Usually 1 week):
- [ ] Respond to Sentry alerts within 5 minutes
- [ ] Check Vercel deployments daily
- [ ] Review error trends weekly
- [ ] Keep incident log updated
- [ ] Escalate to CTO if blocking (no ETA >1 hour)

**Off Hours**:
- Sleep with phone nearby (Sentry configured for push alerts)
- Have VPN access ready
- Bookmark this runbook

### Handoff Procedure

**Outgoing on-call**:
```
1. Export last week's incident log
2. Document any ongoing issues
3. Flag any known flaky tests or monitoring gaps
4. Brief incoming on-call (15 min call)
5. Provide access: Vercel, Sentry, Upstash, GitHub
```

**Incoming on-call**:
```
1. Review last week's incident log
2. Ask outgoing questions about any open items
3. Verify you have access to all tools
4. Update your contact info in team wiki
5. Test alerting (ask outgoing to trigger test alert)
```

---

## COMMUNICATION TEMPLATES

### Incident Notification (to team)
```
🚨 INCIDENT: [Brief description]
- Severity: SEV-1 (Critical) | SEV-2 (High) | SEV-3 (Medium)
- Start time: [Exact time]
- Affected service: [API / Frontend / Database]
- Impact: [N users unable to X, data loss risk, etc.]
- Status: INVESTIGATING / IN PROGRESS / RESOLVED
- Owner: @on-call-engineer
- Updates: Every 15 min until resolved

---
🔧 MITIGATION: [What we did to fix it]
- Action: [Description]
- Result: [Improvement measure]

---
✅ RESOLVED at [Time]
- RCA: [Root cause analysis brief]
- Follow-up: [Post-mortem GitHub Issue link]
```

### Deployment Notification (to team)
```
🚀 DEPLOYED: v[VERSION] to production
- Deployed by: @[engineer]
- Changes: [Brief feature list or link to PR]
- Time: [UTC timestamp]
- Status: ALL CHECKS GREEN ✅

Health checks:
✅ API responding (200 OK)
✅ Frontend loads
✅ No Sentry errors spike
✅ Database connected

Questions? See deployment PR: [link]
```

---

## CHECKLIST: Before Going on Vacation

```
1. [ ] Brief backup on-call engineer
2. [ ] Ensure PagerDuty/alert routing works
3. [ ] Document any known issues in GitHub Issues
4. [ ] Leave contact info with CTO
5. [ ] Review Sentry for ongoing errors
6. [ ] Verify backups are current
```

---

## TOOLS & DASHBOARDS (Links)

| Tool | URL | Purpose | Access |
|------|-----|---------|--------|
| **Sentry** | https://sentry.io/organizations/rollon/issues | Error tracking | CTO shares link |
| **Vercel** | https://vercel.com/dashboard | Deployments + build logs | Team admins |
| **Upstash** | https://console.upstash.com/redis | Database status + backups | CTO account |
| **GitHub** | https://github.com/FahadIbrahim93/rollon-ecommerce | Code + PRs + Issues | Team @rollon |
| **RollON App** | https://rollon-premium-smoking.vercel.app | Production site | Public |

---

**Runbook Version**: 1.0  
**Last Updated**: April 7, 2026  
**Next Review**: April 21, 2026 (after Sprint 1)  
**Owner**: SRE + DevOps Team  
**Approval**: CTO

---

## Have an incident not covered here?

1. **Escalate to CTO immediately** (SMS + Slack)
2. **Document what you see** (error message, affected users, time)
3. **After resolution: Create GitHub Issue** with findings
4. **Update this runbook** with new playbook if repeatable

---

## Quick Escalation Contact

| Role | Name | Slack | Phone |
|------|------|-------|-------|
| CTO | [Name] | @cto | [Number] |
| DevOps Lead | [Name] | @devops | [Number] |
| Backend Engineer | [Name] | @dev-backend | [Number] |

*Update these with actual team info*
