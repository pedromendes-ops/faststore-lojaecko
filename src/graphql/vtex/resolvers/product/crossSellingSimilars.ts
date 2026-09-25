/**
 * Shared loader for the product "similars" (sibling color variants), fetched
 * from the VTEX Catalog crossselling API.
 *
 * The `similars` field is requested for EVERY product in a listing (see
 * `src/fragments/ClientManyProducts.ts` — the ProductCard color swatches), so a
 * PLP/shelf with `first: 20` would otherwise fire 20 simultaneous crossselling
 * calls, tripping the Catalog rate limit (HTTP 429).
 *
 * This module runs in the long-lived FastStore Node/BFF process, so the
 * module-level state below is shared across all GraphQL requests. It reduces
 * outbound calls with four layers:
 *   1. TTL cache (color siblings are catalog data → very stable, sc-independent)
 *   2. stale-while-revalidate (serve cached instantly, refresh in background)
 *   3. in-flight de-duplication (the same productId is fetched at most once at a time)
 *   4. a concurrency limiter (cap simultaneous Catalog calls → no bursts)
 * Plus short negative caching so a failing/429 product backs off instead of
 * being hammered on every render.
 */

// -------------------------------------------------------------------------
// Types
// -------------------------------------------------------------------------
interface CrossSellingItem {
  itemId: string
  images?: Array<{ imageUrl?: string | null }>
}
interface CrossSellingProduct {
  productId: string
  linkText?: string | null
  items?: CrossSellingItem[]
  // "Cor" / "ColorHex" are dynamic specifications, present as string arrays.
  [spec: string]: unknown
}

export interface SimilarColor {
  productId: string
  sku: string
  slug: string
  colorName: string
  colorHex: string
  image: string
}

export interface CrossSellingContext {
  clients: {
    commerce: {
      catalog: {
        products: {
          crossselling: (args: {
            type: 'similars'
            productId: string
            groupByProduct?: boolean
          }) => Promise<CrossSellingProduct[]>
        }
      }
    }
  }
}

// -------------------------------------------------------------------------
// Tunables
// -------------------------------------------------------------------------
const FRESH_MS = 10 * 60 * 1000 // considered fresh (no refetch)
const SWR_MS = 20 * 60 * 1000 // stale-but-usable window after `fresh`
const ERROR_TTL_MS = 45 * 1000 // negative cache → backoff on failure/429
const MAX_ENTRIES = 5000 // bound memory (FIFO eviction)
const MAX_CONCURRENCY = 6 // cap simultaneous Catalog calls

// -------------------------------------------------------------------------
// TTL cache (module-scoped, shared across requests)
// -------------------------------------------------------------------------
interface CacheEntry {
  data: SimilarColor[]
  freshUntil: number
  expiresAt: number
}

const cache = new Map<string, CacheEntry>()
const inflight = new Map<string, Promise<SimilarColor[]>>()

function readCache(id: string): { data: SimilarColor[]; isStale: boolean } | null {
  const entry = cache.get(id)
  if (!entry) return null

  const now = Date.now()
  if (now > entry.expiresAt) {
    cache.delete(id)
    return null
  }
  return { data: entry.data, isStale: now > entry.freshUntil }
}

function writeCache(id: string, data: SimilarColor[], freshMs: number, swrMs: number): void {
  // FIFO eviction when full (only when inserting a new key).
  if (cache.size >= MAX_ENTRIES && !cache.has(id)) {
    const oldest = cache.keys().next().value
    if (oldest !== undefined) cache.delete(oldest)
  }
  const now = Date.now()
  cache.set(id, { data, freshUntil: now + freshMs, expiresAt: now + freshMs + swrMs })
}

// -------------------------------------------------------------------------
// Concurrency limiter (simple counting semaphore)
// -------------------------------------------------------------------------
let active = 0
const waiters: Array<() => void> = []

async function withLimit<T>(fn: () => Promise<T>): Promise<T> {
  if (active >= MAX_CONCURRENCY) {
    await new Promise<void>((resolve) => waiters.push(resolve))
  }
  active++
  try {
    return await fn()
  } finally {
    active--
    waiters.shift()?.()
  }
}

// -------------------------------------------------------------------------
// Fetch + transform
// -------------------------------------------------------------------------
const getSpecValue = (product: CrossSellingProduct, name: string) => {
  const value = product[name]
  return Array.isArray(value) ? String(value[0] ?? '') : ''
}

async function fetchSimilars(
  productId: string,
  ctx: CrossSellingContext,
): Promise<SimilarColor[]> {
  const related = await ctx.clients.commerce.catalog.products.crossselling({
    type: 'similars',
    productId,
  })

  return related
    // The API can echo the product itself; drop it.
    .filter((product) => String(product.productId) !== productId)
    .map((product) => {
      const item = product.items?.[0]
      return {
        productId: String(product.productId),
        sku: item?.itemId ?? '',
        slug: product.linkText ?? '',
        colorName: getSpecValue(product, 'Cor'),
        colorHex: getSpecValue(product, 'ColorHex'),
        image: item?.images?.[0]?.imageUrl ?? '',
      }
    })
    // Without a SKU we can't fetch/swap the sibling, so it's useless.
    .filter((similar) => similar.sku !== '')
}

// Revalidate through the limiter, de-duplicating concurrent calls per productId.
function revalidate(productId: string, ctx: CrossSellingContext): Promise<SimilarColor[]> {
  const existing = inflight.get(productId)
  if (existing) return existing

  const promise = withLimit(() => fetchSimilars(productId, ctx))
    .then((data) => {
      // A legit empty result is cached with the full TTL (products with no
      // siblings shouldn't be re-fetched every render).
      writeCache(productId, data, FRESH_MS, SWR_MS)
      return data
    })
    .catch(() => {
      // Keep any still-usable data on a background failure; only negative-cache
      // (short backoff) when we have nothing to serve.
      const prev = cache.get(productId)
      if (!prev) writeCache(productId, [], ERROR_TTL_MS, 0)
      return prev?.data ?? []
    })
    .finally(() => {
      inflight.delete(productId)
    })

  inflight.set(productId, promise)
  return promise
}

/**
 * Returns the sibling color variants for a catalog product id, served from
 * cache whenever possible. Never throws — a crossselling failure resolves to
 * an empty list so it can't break the shelf/PLP query.
 */
export function getSimilars(
  productId: string,
  ctx: CrossSellingContext,
): SimilarColor[] | Promise<SimilarColor[]> {
  if (!productId) return []

  const cached = readCache(productId)
  if (cached && !cached.isStale) return cached.data // HIT
  if (cached && cached.isStale) {
    void revalidate(productId, ctx) // STALE → refresh in background
    return cached.data
  }
  return revalidate(productId, ctx) // MISS
}
