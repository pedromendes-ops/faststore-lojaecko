import { useEffect } from "react";

import type { ClientProductQueryQuery } from "@generated/graphql";
import { useProductQuery } from "src/sdk/product/useProductQuery";

/** Full product returned by the PDP-shaped `useProductQuery`. */
export type LoadedProduct = NonNullable<ClientProductQueryQuery["product"]>;

interface SwatchProductLoaderProps {
  /** SKU id of the sibling color to load (items[0].itemId from `similars`). */
  skuId: string;
  /** Called once the full, session-priced sibling product is available. */
  onResolved: (product: LoadedProduct) => void;
}

/**
 * Renders nothing. Mounted only while a sibling swatch is selected, so the full
 * sibling product is fetched on demand — one request per clicked color, never
 * one per card. Reuses the very same query the PDP uses, so the swapped view
 * shows the correct price for the current session channel.
 *
 * The result shape (`ProductDetailsFragment_product` + `ClientProduct`) is a
 * superset of what the shelf card reads, so both callers can consume it.
 */
export function SwatchProductLoader({
  skuId,
  onResolved,
}: SwatchProductLoaderProps) {
  const { data } = useProductQuery(skuId);
  const product =
    (data as ClientProductQueryQuery | undefined)?.product ?? null;

  useEffect(() => {
    if (product) {
      onResolved(product);
    }
  }, [product, onResolved]);

  return null;
}
