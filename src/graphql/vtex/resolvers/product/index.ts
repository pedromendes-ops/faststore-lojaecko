import type { StoreProductRoot } from "@faststore/core/api";

import { getSimilars } from "./crossSellingSimilars";
import type { CrossSellingContext } from "./crossSellingSimilars";

// VTEX may return clusters either as a `{ [id]: name }` object (Intelligent
// Search) or as an `[{ id, name }]` array (Catalog). Normalize both to [{ id, name }].
const toClusterArray = (clusters?: unknown) => {
  if (!clusters) return [];

  if (Array.isArray(clusters)) {
    return clusters
      .filter((c) => c && typeof c === "object")
      .map((c: any) => ({ id: String(c.id), name: String(c.name) }));
  }

  if (typeof clusters === "object") {
    return Object.entries(clusters as Record<string, unknown>).map(
      ([id, name]) => ({ id, name: String(name) }),
    );
  }

  return [];
};

const productResolver = {
  StoreProduct: {
    availableInstallments: (root: StoreProductRoot) => {
      const installments = root.sellers?.[0]?.commertialOffer?.Installments;

      if (!installments?.length) {
        return [];
      }

      return installments.map((installment) => ({
        installmentPaymentSystemName: installment.PaymentSystemName,
        installmentValue: installment.Value,
        installmentInterest: installment.InterestRate,
        installmentNumber: installment.NumberOfInstallments,
      }));
    },
    productClusters: (root: StoreProductRoot) =>
      toClusterArray(
        root.isVariantOf?.productClusters ?? (root as any).productClusters,
      ),
    clusterHighlights: (root: StoreProductRoot) =>
      toClusterArray(
        root.isVariantOf?.clusterHighlights ?? (root as any).clusterHighlights,
      ),
    // Sibling color variants (each color is a distinct catalog product), fetched
    // from the native VTEX crossselling API through a shared, cached + rate-
    // limited loader so a listing of N products doesn't burst N Catalog calls
    // (see ./crossSellingSimilars). Color siblings are catalog-level and
    // sales-channel-independent, so caching by productId is safe.
    similars: (
      root: StoreProductRoot,
      _args: unknown,
      ctx: CrossSellingContext,
    ) => {
      // The catalog product id (2091917) lives on the raw product node, exposed
      // in GraphQL as `productGroupID` but named `productId` on the root object
      // (see the StoreProductGroup.productGroupID resolver: isVariantOf.productId).
      const productId = String(
        (root.isVariantOf as { productId?: string } | undefined)?.productId ??
          (root as { productId?: string }).productId ??
          "",
      );

      return getSimilars(productId, ctx);
    },
  },
};

export default productResolver;
