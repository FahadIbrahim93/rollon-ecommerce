# Production Hardening & Deployment Checklist

## Status: Completed with evidence

| Check | Status | Evidence |
|---|---|---|
| Full frontend quality gates pass | ✅ | `cd rollon-app && npm run lint && npm test -- --run && npm run build` |
| Serverless handler contract tests pass | ✅ | `node --test api/__tests__/handlers.test.js` |
| Serverless smoke request traces | ✅ | `node scripts/smoke-serverless.mjs` |
| No hardcoded database secrets in repo | ✅ | Secrets are environment-driven (`process.env`) in `api/_lib/upstash.js` |
| Deterministic seed pipeline | ✅ | `node scripts/sync-seed-from-frontend.mjs` generates `seedData.generated.json` |
| Input validation on write endpoint | ✅ | `api/orders/index.js` uses `validateOrderPayload` |
| Pagination safeguards | ✅ | `api/products/index.js` bounds limit and defaults page/limit |
| Vercel routing supports API + SPA | ✅ | `vercel.json` rewrites `/api/*` and fallback `/index.html` |

## Rollback strategy
- Revert to previous commit and redeploy via Vercel.
- Keep `VITE_USE_REMOTE_API=false` as an emergency frontend fallback mode while backend incidents are triaged.

## Observability hooks
- Health probe endpoint available at `GET /api/health`.
- Serverless errors surfaced through shared wrapper in `api/_lib/http.js`.
