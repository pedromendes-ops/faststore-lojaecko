import type { ClientProductQueryQuery } from "@generated/graphql";

import { useProductQuery } from "src/sdk/product/useProductQuery";

// Relative import: ProductDetailsCustom is a store customization, so it isn't
// reachable through the `src/*` alias (which only resolves core components).
import type { ProductDetailsProduct } from "../../ProductDetailsCustom/hooks/useProductDetailsData";

export interface UseQuickBuyProductResult {
  /** The full PDP-shaped product (skuVariants, gallery, installments, offers). */
  product: ProductDetailsProduct | null;
  /** True while the first fetch is in flight and there's nothing to show yet. */
  isLoading: boolean;
  /** True when the fetch resolved but returned no product. */
  isNotFound: boolean;
}

/**
 * Fetches the complete product for the Quick Buy modal from a shelf `productId`.
 *
 * The shelf product node (ProductSummary/ClientManyProducts) does NOT carry
 * `isVariantOf.skuVariants`, so it can't render the color/size selectors. This
 * hook reuses the framework's {@link useProductQuery} — the very same query the
 * PDP uses — to pull the full product (with `ProductDetailsFragment_product` +
 * the `ClientProduct` fragment) on demand.
 *
 * It only runs while it's mounted, so the caller must mount it lazily (i.e. only
 * once the modal is open) to avoid a network request per shelf card.
 */
export function useQuickBuyProduct(productId: string): UseQuickBuyProductResult {
  const { data, error } = useProductQuery(productId);

  const product = (data as ClientProductQueryQuery | undefined)?.product ?? null;

  return {
    // Cast bridges the query result to the shape `useProductDetailsData` reads —
    // both are built from `ProductDetailsFragment_product` + `ClientProduct`.
    product: product as ProductDetailsProduct | null,
    isLoading: !data && !error,
    isNotFound: Boolean((data || error) && !product),
  };
}
