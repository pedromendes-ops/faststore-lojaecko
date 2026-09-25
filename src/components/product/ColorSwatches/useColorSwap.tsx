import { useCallback, useEffect, useState, type ReactNode } from "react";

import { SwatchProductLoader } from "./SwatchProductLoader";

/**
 * Holds the product/SKU currently displayed by a card/PDP/quick-buy and swaps it
 * in place when a color swatch or size option is clicked — the FastStore
 * equivalent of VTEX IO's `dispatch(SET_PRODUCT)`, as plain local state. Both
 * colors (distinct products) and sizes (sibling SKUs) resolve to a SKU id, so a
 * single `swapToSku` drives everything.
 *
 * - Swapping to the base SKU (or `null`) is instant, no fetch.
 * - Any other SKU mounts {@link SwatchProductLoader}, which fetches the full
 *   product then swaps `activeProduct`.
 *
 * The generic `T` is the caller's product shape; the fetched product is a
 * superset of it, so the cast is safe for the fields each caller reads.
 */
export function useColorSwap<T extends { sku: string }>(baseProduct: T) {
  const baseSku = baseProduct.sku;

  const [activeProduct, setActiveProduct] = useState<T>(baseProduct);
  // null = base SKU shown; otherwise the SKU being loaded/shown.
  const [activeSku, setActiveSku] = useState<string | null>(null);

  // Reset when the underlying product identity changes (shelf re-query, PDP
  // navigation). Keyed on `baseSku`, not the object reference, so a background
  // SWR revalidation that returns a new-but-equal product doesn't wipe the
  // selection.
  useEffect(() => {
    setActiveProduct(baseProduct);
    setActiveSku(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseSku]);

  const swapToSku = useCallback(
    (sku: string | null) => {
      if (!sku || sku === baseSku) {
        setActiveSku(null);
        setActiveProduct(baseProduct);
        return;
      }
      setActiveSku(sku);
    },
    [baseSku, baseProduct],
  );

  // Mounted only while a non-base SKU is selected. Callers must render this node.
  const loader: ReactNode = activeSku ? (
    <SwatchProductLoader
      skuId={activeSku}
      onResolved={(product) => setActiveProduct(product as unknown as T)}
    />
  ) : null;

  return { activeProduct, swapToSku, loader };
}
