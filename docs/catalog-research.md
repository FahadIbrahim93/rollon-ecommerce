# Catalog Research Notes (Rollon Facebook + Internal Data)

## Sources Reviewed

1. Public Facebook profile URL provided by stakeholder: `https://www.facebook.com/profile.php?id=61559641950523`
2. Canonical in-repo product dataset: `rollon-app/src/data/products.ts`

## Facebook Findings (public metadata only)

From publicly accessible Open Graph tags (without authenticated scraping):

- Page identity: **Rollon'**
- Location signal: **Dhaka**
- Category: **E-commerce website**
- Engagement snapshot in metadata at time of fetch: **130 likes**, **16 talking about this**

## Why product rows were sourced from app data

Facebook profile HTML does not expose a stable, structured product-feed API in public unauthenticated markup. To avoid hallucinated catalog entries, the database seed now uses the repository's canonical product + category dataset that the storefront already renders.

## Outcome

- Database seeding now mirrors the live storefront taxonomy and catalog (6 categories, 18 products).
- Brand metadata from Facebook can be used in marketing/profile tables later, but product truth remains application-owned.
