// Backend-only proxy for the installed VTEX IO app `vtex.wish-list` (GraphQL
// layer). Keeps the IO app off the frontend and forwards the shopper's auth
// cookie server-side so credentials never reach the browser — same pattern as
// the shopTheLook/textSEO resolvers.
//
// The wish-list app exposes its operations only through GraphQL (its .NET
// service publishes just an admin export route), so we talk to the account's IO
// GraphQL gateway. A single default list per shopper is assumed (WISHLIST_NAME).

// Minimal shape of the resolver context we use. Typed locally because
// @faststore/api doesn't re-export WishlistContext from its public entrypoint
// (mirrors the local ProductResolverContext in the product resolver).
interface WishlistContext {
  headers?: Record<string, string>;
}

// Account IO GraphQL gateway. The wish-list app's queries (viewList, addToList,
// …) are federated here; it answers "Unauthorized" without the shopper cookie,
// which the resolver forwards below.
const WISHLIST_GRAPHQL_URL =
  process.env.WISHLIST_GRAPHQL_URL ??
  "https://lojalevis.myvtex.com/_v/private/graphql/v1?workspace=master";

// The wish-list app keys entries by named list. The heart toggle uses one
// canonical list per shopper.
const WISHLIST_NAME = process.env.WISHLIST_NAME ?? "Wishlist";

// Raw shapes from the IO app — only the fields we read.
interface RawListItem {
  id?: string | null;
  productId?: string | null;
  sku?: string | null;
  title?: string | null;
}

interface WishlistItem {
  id: string | null;
  productId: string | null;
  sku: string | null;
  title: string | null;
}

type IoGraphqlResponse<T> = {
  data?: T | null;
  errors?: Array<{ message?: string }> | null;
};

/**
 * Runs a GraphQL operation against the IO wish-list app, forwarding the
 * incoming request's cookies (the VtexIdclientAutCookie the app authenticates
 * with). Server-to-server call within the VTEX domain, so no CORS concerns.
 */
async function wishlistFetch<T>(
  ctx: WishlistContext,
  query: string,
  variables: Record<string, unknown>,
): Promise<T | null> {
  const cookie = ctx?.headers?.cookie ?? "";

  const response = await fetch(WISHLIST_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      // Forward the shopper session so the app resolves the right identity.
      cookie,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Wishlist request failed: ${response.status}`);
  }

  const json = (await response.json()) as IoGraphqlResponse<T>;

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }

  return json.data ?? null;
}

const VIEW_LIST_QUERY = `
  query ViewList($shopperId: String!, $name: String!) {
    viewList(shopperId: $shopperId, name: $name) {
      data {
        id
        productId
        sku
        title
      }
    }
  }
`;

const ADD_TO_LIST_MUTATION = `
  mutation AddToList(
    $listItem: ListItemInputType!
    $shopperId: String!
    $name: String!
  ) {
    addToList(listItem: $listItem, shopperId: $shopperId, name: $name)
  }
`;

const REMOVE_FROM_LIST_MUTATION = `
  mutation RemoveFromList($id: ID!, $shopperId: String!, $name: String) {
    removeFromList(id: $id, shopperId: $shopperId, name: $name)
  }
`;

const toWishlistItem = (item: RawListItem): WishlistItem => ({
  id: item.id ?? null,
  productId: item.productId ?? null,
  sku: item.sku ?? null,
  title: item.title ?? null,
});

const wishlistResolver = {
  Query: {
    wishlist: async (
      _: unknown,
      args: { shopperId: string },
      ctx: WishlistContext,
    ): Promise<WishlistItem[]> => {
      const shopperId = String(args?.shopperId ?? "").trim();

      if (!shopperId) {
        return [];
      }

      try {
        const data = await wishlistFetch<{
          viewList: { data?: RawListItem[] | null } | null;
        }>(ctx, VIEW_LIST_QUERY, { shopperId, name: WISHLIST_NAME });

        return (data?.viewList?.data ?? []).map(toWishlistItem);
      } catch {
        // Never break the product listing over a wishlist read.
        return [];
      }
    },
  },
  Mutation: {
    addToWishlist: async (
      _: unknown,
      args: {
        shopperId: string;
        productId: string;
        sku?: string | null;
        title?: string | null;
      },
      ctx: WishlistContext,
    ): Promise<string | null> => {
      const shopperId = String(args?.shopperId ?? "").trim();
      const productId = String(args?.productId ?? "").trim();

      if (!shopperId || !productId) {
        return null;
      }

      const data = await wishlistFetch<{ addToList: string | null }>(
        ctx,
        ADD_TO_LIST_MUTATION,
        {
          shopperId,
          name: WISHLIST_NAME,
          listItem: {
            productId,
            sku: args?.sku ?? null,
            title: args?.title ?? null,
          },
        },
      );

      return data?.addToList ?? null;
    },
    removeFromWishlist: async (
      _: unknown,
      args: { shopperId: string; id: string },
      ctx: WishlistContext,
    ): Promise<boolean> => {
      const shopperId = String(args?.shopperId ?? "").trim();
      const id = String(args?.id ?? "").trim();

      if (!shopperId || !id) {
        return false;
      }

      const data = await wishlistFetch<{ removeFromList: boolean | null }>(
        ctx,
        REMOVE_FROM_LIST_MUTATION,
        { id, shopperId, name: WISHLIST_NAME },
      );

      return Boolean(data?.removeFromList);
    },
  },
};

export default wishlistResolver;
