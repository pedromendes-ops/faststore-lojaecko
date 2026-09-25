import {
  useLazyQuery_unstable as useLazyQuery,
  useQuery_unstable as useQuery,
} from "@faststore/core/experimental";
import { gql } from "@faststore/core/api";
import type {
  AddToWishlistMutation,
  AddToWishlistMutationVariables,
  RemoveFromWishlistMutation,
  RemoveFromWishlistMutationVariables,
  WishlistQuery,
  WishlistQueryVariables,
} from "@generated/graphql";
import { useCallback, useMemo } from "react";
import storeConfig from "discovery.config";
import { useSession } from "src/sdk/session";

const WISHLIST_QUERY = gql(`
  query Wishlist($shopperId: String!) {
    wishlist(shopperId: $shopperId) {
      id
      productId
      sku
      title
    }
  }
`);

const ADD_TO_WISHLIST_MUTATION = gql(`
  mutation AddToWishlist(
    $shopperId: String!
    $productId: String!
    $sku: String
    $title: String
  ) {
    addToWishlist(
      shopperId: $shopperId
      productId: $productId
      sku: $sku
      title: $title
    )
  }
`);

const REMOVE_FROM_WISHLIST_MUTATION = gql(`
  mutation RemoveFromWishlist($shopperId: String!, $id: ID!) {
    removeFromWishlist(shopperId: $shopperId, id: $id)
  }
`);

type WishlistItem = NonNullable<WishlistQuery["wishlist"]>[number];

export interface ToggleProduct {
  productId: string;
  sku?: string | null;
  title?: string | null;
}

export interface UseWishlistResult {
  /** True once the shopper is authenticated (a shopperId is available). */
  isAuthenticated: boolean;
  /** Whether a given catalog product id is currently in the wishlist. */
  isInWishlist: (productId: string) => boolean;
  /**
   * Adds/removes the product. Logged-out shoppers are redirected to login.
   * Optimistic: updates the shared cache immediately and rolls back on error.
   * Resolves to the final "is in wishlist" state (or `null` when it redirected).
   */
  toggle: (product: ToggleProduct) => Promise<boolean | null>;
}

const redirectToLogin = () => {
  if (typeof window === "undefined") {
    return;
  }

  const returnUrl = encodeURIComponent(window.location.href);
  // storeConfig.loginUrl is the account's VTEX ID login entrypoint; it returns
  // the shopper to `returnUrl` after authenticating.
  window.location.href = `${storeConfig.loginUrl}?returnUrl=${returnUrl}`;
};

/**
 * Reads and mutates the shopper's default wishlist through the store BFF
 * (src/graphql/thirdParty/resolvers/wishlist.ts), which proxies the installed
 * `vtex.wish-list` IO app.
 *
 * The wishlist is fetched once and shared across every ProductCard: `useQuery`
 * is SWR-backed, so all cards using the same `shopperId` key hit the network a
 * single time and read from the same cache. `shopperId` is the shopper's
 * profile id (VtexId), falling back to email.
 */
export function useWishlist(): UseWishlistResult {
  const { person } = useSession();
  const shopperId = person?.id ?? person?.email ?? "";
  const isAuthenticated = Boolean(shopperId);

  const {
    data,
    mutate,
  } = useQuery<WishlistQuery, WishlistQueryVariables>(
    WISHLIST_QUERY,
    { shopperId },
    // Don't run until we actually have a shopper — keeps logged-out sessions
    // from firing an Unauthorized request.
    { doNotRun: !isAuthenticated },
  );

  const [addExecute] = useLazyQuery<
    AddToWishlistMutation,
    AddToWishlistMutationVariables
  >(ADD_TO_WISHLIST_MUTATION, {
    shopperId,
    productId: "",
    sku: null,
    title: null,
  });

  const [removeExecute] = useLazyQuery<
    RemoveFromWishlistMutation,
    RemoveFromWishlistMutationVariables
  >(REMOVE_FROM_WISHLIST_MUTATION, { shopperId, id: "" });

  // productId -> item, for O(1) lookups across every card.
  const byProductId = useMemo(() => {
    const map = new Map<string, WishlistItem>();

    for (const item of data?.wishlist ?? []) {
      if (item?.productId) {
        map.set(item.productId, item);
      }
    }

    return map;
  }, [data]);

  const isInWishlist = useCallback(
    (productId: string) => byProductId.has(productId),
    [byProductId],
  );

  const toggle = useCallback(
    async (product: ToggleProduct): Promise<boolean | null> => {
      if (!isAuthenticated) {
        redirectToLogin();
        return null;
      }

      const current = data?.wishlist ?? [];
      const existing = byProductId.get(product.productId);

      if (existing) {
        // ---- Optimistic remove ----
        const next = current.filter(
          (item) => item?.productId !== product.productId,
        );
        await mutate({ wishlist: next }, false);

        try {
          const result = await removeExecute({
            shopperId,
            id: String(existing.id ?? ""),
          });

          // App reported it couldn't remove — re-sync with the server.
          if (!result?.removeFromWishlist) {
            await mutate();
            return isInWishlist(product.productId);
          }

          return false;
        } catch {
          // Roll back to server truth.
          await mutate();
          return isInWishlist(product.productId);
        }
      }

      // ---- Optimistic add ----
      const optimisticItem: WishlistItem = {
        id: null,
        productId: product.productId,
        sku: product.sku ?? null,
        title: product.title ?? null,
      };
      await mutate({ wishlist: [...current, optimisticItem] }, false);

      try {
        const result = await addExecute({
          shopperId,
          productId: product.productId,
          sku: product.sku ?? null,
          title: product.title ?? null,
        });

        // Revalidate so the optimistic item picks up its real id (needed for a
        // later removal).
        await mutate();
        return result?.addToWishlist ? true : isInWishlist(product.productId);
      } catch {
        await mutate();
        return isInWishlist(product.productId);
      }
    },
    [
      isAuthenticated,
      data,
      byProductId,
      mutate,
      removeExecute,
      addExecute,
      shopperId,
      isInWishlist,
    ],
  );

  return { isAuthenticated, isInWishlist, toggle };
}
