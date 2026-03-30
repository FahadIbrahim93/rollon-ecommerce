# RollON Database Architecture (Vercel + Upstash Redis)

## Environment Variables Analysis

The Vercel integration created **Upstash Redis** credentials:

- `RollON_Database_KV_REST_API_READ_ONLY_TOKEN`: Read-only REST token for safe analytics/query usage.
- `RollON_Database_KV_REST_API_TOKEN`: Read-write REST token for backend mutations.
- `RollON_Database_KV_REST_API_URL`: HTTPS endpoint used by serverless functions to execute Redis commands.
- `RollON_Database_KV_URL` / `RollON_Database_REDIS_URL`: Redis connection strings (TLS) for SDK clients.

## Data Model

Key namespace and indexing strategy:

- `rollon:product:{id}` + set index `rollon:idx:products`
- `rollon:category:{id}` + set index `rollon:idx:categories`
- `rollon:order:{id}` + set index `rollon:idx:orders`
- `rollon:customer:{id}` + set index `rollon:idx:customers`

All entities are stored as JSON documents (`JSON.SET`) for schema flexibility.

Seed source of truth:
- `api/_lib/seedData.generated.json` (generated from `rollon-app/src/data/products.ts`)
- Current baseline size: 6 categories, 18 products.

## API Endpoints

- `GET /api/health` → health + Redis ping
- `GET /api/products` with filters (`id`, `slug`, `categoryId`, `featured`, `search`) and pagination (`page`, `limit`)
- `GET /api/categories`
- `GET /api/orders`, `GET /api/orders?id=...`, `POST /api/orders` (validated payload with strict item rules)
- `GET /api/customers`
- `POST /api/admin/seed` (requires `x-admin-token` header and `ROLLON_ADMIN_SEED_TOKEN`)

## Frontend Integration

`rollon-app/src/lib/api.ts` now supports two modes:

- `VITE_USE_REMOTE_API=true` → fetches from `/api/*` (serverless + Upstash)
- fallback mode → current local mock dataset to keep development and tests stable

## Production Notes

- Keep token values only in Vercel Environment Variables.
- Use read-only token for dashboards where writes are not needed.
- Rotate tokens regularly.
- Seed endpoint is protected by a separate admin token.
