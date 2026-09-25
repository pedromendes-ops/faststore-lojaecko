// Backend-only proxy for the account's category SEO IO route. Kept behind
// GraphQL so the frontend never reaches the API directly. Mirrors the
// "return only what's used" approach of the ShopTheLook resolver
// (src/graphql/thirdParty/resolvers/shopTheLook.ts).

// Minimal shape of the raw API payload — only the fields we read.
// The route contract is intentionally loose: missing/extra fields are tolerated.
// Note: the raw Master Data record names the field "aboutSEO", not
// "aboutCategory" — that renaming happens below, at the GraphQL boundary.
interface RawCategorySEO {
  aboutSEO?: string | null;
  textSEO?: string | null;
}

// Shape returned by the resolver, matching the CategorySEO GraphQL type.
interface CategorySEOResult {
  aboutCategory: string | null;
  textSEO: string | null;
}

const CATEGORY_SEO_URL =
  "https://lojalevis.myvtex.com/_v/search/caregories-seo";

const EMPTY: CategorySEOResult = { aboutCategory: null, textSEO: null };

const toStringOrNull = (value: unknown) =>
  typeof value === "string" && value.trim() !== "" ? value : null;

// The StoreCollection.aboutCategory and StoreCollection.textSEO field resolvers
// both run for the same collection during a single SSR request. Memoize the
// in-flight promise per category id so the route is hit once, not twice. The
// short TTL also collapses the near-simultaneous requests that a page reload
// triggers without ever serving stale copy for long.
const CACHE_TTL_MS = 60_000;
const cache = new Map<string, { at: number; promise: Promise<CategorySEOResult> }>();

async function fetchCategorySEO(categoryId: string): Promise<CategorySEOResult> {
  const id = categoryId.trim();

  if (!id) {
    return EMPTY;
  }

  const cached = cache.get(id);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return cached.promise;
  }

  const promise = (async (): Promise<CategorySEOResult> => {
    try {
      const response = await fetch(
        `${CATEGORY_SEO_URL}?id=${encodeURIComponent(id)}`,
        { headers: { Accept: "application/json" } },
      );

      if (!response.ok) {
        throw new Error(`Category SEO request failed: ${response.status}`);
      }

      const raw = (await response.json()) as RawCategorySEO | RawCategorySEO[];

      // The API sometimes returns a single object and sometimes an array of
      // one — accept both, take the first hit.
      const entry = Array.isArray(raw) ? raw[0] : raw;

      if (!entry) {
        return EMPTY;
      }

      return {
        aboutCategory: toStringOrNull(entry.aboutSEO),
        textSEO: toStringOrNull(entry.textSEO),
      };
    } catch {
      // A failure here must never break the PLP — render nothing instead.
      return EMPTY;
    }
  })();

  cache.set(id, { at: Date.now(), promise });

  // Don't let a rejected/failed fetch stick in the cache.
  promise.catch(() => cache.delete(id));

  return promise;
}

// Root of the StoreCollection field resolvers. The raw collection node exposes
// the category id (the same value the `id` core resolver stringifies) — that's
// what the SEO route keys on.
interface StoreCollectionRoot {
  id: string | number;
}

const textSEOResolver = {
  Query: {
    categorySEO: (
      _: unknown,
      args: { categoryId: string },
    ): Promise<CategorySEOResult> =>
      fetchCategorySEO(String(args?.categoryId ?? "")),
  },
  // Server-side fields consumed by the ServerCollectionPage fragment so the SEO
  // copy is part of the initial HTML instead of a client-side fetch.
  StoreCollection: {
    aboutCategory: async (root: StoreCollectionRoot) =>
      (await fetchCategorySEO(String(root?.id ?? ""))).aboutCategory,
    textSEO: async (root: StoreCollectionRoot) =>
      (await fetchCategorySEO(String(root?.id ?? ""))).textSEO,
  },
};

export default textSEOResolver;
