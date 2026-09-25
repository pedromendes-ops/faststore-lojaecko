import type { CurrencyCode, ViewItemEvent } from "@faststore/sdk";
import { useEffect } from "react";

import type { AnalyticsItem } from "src/sdk/analytics/types";
import { useSession } from "src/sdk/session";

import type { ProductDetailsData } from "./useProductDetailsData";

/**
 * Fires the GA4 `view_item` analytics event once per product variant view,
 * mirroring the native ProductDetails behavior.
 */
export function useViewItemEvent(data: ProductDetailsData) {
  const { currency } = useSession();

  const {
    productId,
    name,
    variantName,
    brand,
    sku,
    gtin,
    price,
    listPrice,
  } = data;

  useEffect(() => {
    import("@faststore/sdk").then(({ sendAnalyticsEvent }) => {
      sendAnalyticsEvent<ViewItemEvent<AnalyticsItem>>({
        name: "view_item",
        params: {
          currency: currency.code as CurrencyCode,
          value: price,
          items: [
            {
              item_id: productId,
              item_name: name,
              item_brand: brand.name,
              item_variant: sku,
              price,
              discount: listPrice - price,
              currency: currency.code as CurrencyCode,
              item_variant_name: variantName,
              product_reference_id: gtin,
            },
          ],
        },
      });
    });
  }, [
    productId,
    name,
    brand.name,
    sku,
    price,
    listPrice,
    currency.code,
    variantName,
    gtin,
  ]);
}
