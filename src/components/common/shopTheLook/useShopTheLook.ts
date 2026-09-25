import { useEffect, useState } from "react";

import { useLazyQuery_unstable as useLazyQuery } from "@faststore/core/experimental";
import { gql } from "@faststore/core/api";

import type { ShopTheLookCollection, ShopTheLookQueryData } from "./types";

// @ts-ignore — operation registered after the store's GraphQL codegen runs (dev server restart)
const SHOP_THE_LOOK_QUERY = gql(`
  query ShopTheLook {
    shopTheLook {
      title
      kits {
        name
        products {
          productId
          skuId
          productName
          linkText
          link
          image
          price
          listPrice
        }
      }
    }
  }
`);

export interface UseShopTheLookResult {
  collections: ShopTheLookCollection[];
  isLoading: boolean;
}

/**
 * Fetches the Shop The Look collections through the store's GraphQL layer (never
 * the API directly). Runs once on mount, client-side — the section renders a
 * loading state until the data arrives.
 */
export function useShopTheLook(): UseShopTheLookResult {
  const [fetchShopTheLook] = useLazyQuery<ShopTheLookQueryData, unknown>(
    SHOP_THE_LOOK_QUERY,
    {},
  );

  const [collections, setCollections] = useState<ShopTheLookCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchShopTheLook({})
      .then((data) => {
        if (active) {
          setCollections(data?.shopTheLook ?? []);
        }
      })
      .catch(() => {
        if (active) {
          setCollections([]);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { collections, isLoading };
}
