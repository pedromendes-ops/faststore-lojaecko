import type {
  ProductDetailsFragment_ProductFragment,
  ServerProductQueryQuery,
} from "@generated/graphql";
import { useMemo } from "react";

// Caminho relativo: o componente só existe nesta loja, então o alias `src/*`
// (que resolve para o core) não o alcança.
import type { ProductCluster } from "../../ProductCard/compoments/productClusters";
import { normalizeSkuVariants } from "./normalizeSkuVariants";

// The native PDP fragment doesn't type `availableInstallments` nor the
// productGroup-level `isVariantOf.additionalProperty`, but the custom
// ServerProduct/ClientProduct fragments merge both into the same product query,
// so they're present at runtime. Re-add them to the type the hook consumes.
export type ProductDetailsProduct = ProductDetailsFragment_ProductFragment &
  Pick<ServerProductQueryQuery["product"], "availableInstallments" | "isVariantOf">;

export type Installment = ServerProductQueryQuery["product"]["availableInstallments"][number];

/**
 * Dedupes the raw installments by `installmentNumber` (keeping the plan with
 * the lowest interest for each number) and sorts them ascending, so the
 * "Opções de Parcelamento" modal renders one clean row per installment count.
 */
function getInstallmentsByNumber(
  installments: Installment[] | undefined | null,
): Installment[] {
  if (!installments?.length) {
    return [];
  }

  const byNumber = new Map<number, Installment>();
  for (const current of installments) {
    const existing = byNumber.get(current.installmentNumber);
    if (!existing || current.installmentInterest < existing.installmentInterest) {
      byNumber.set(current.installmentNumber, current);
    }
  }

  return Array.from(byNumber.values()).sort(
    (a, b) => a.installmentNumber - b.installmentNumber,
  );
}

/**
 * Picks the installment plan with the highest number of installments that has
 * no interest (`installmentInterest === 0`). Returns `null` when there's no
 * interest-free plan with more than one installment.
 */
function getMaxInterestFreeInstallment(
  installments: Installment[] | undefined | null,
): Installment | null {
  if (!installments?.length) {
    return null;
  }

  return installments.reduce<Installment | null>((max, current) => {
    if (current.installmentInterest !== 0 || current.installmentNumber <= 1) {
      return max;
    }
    if (!max || current.installmentNumber > max.installmentNumber) {
      return current;
    }
    return max;
  }, null);
}

/**
 * Normalizes the raw PDP product (from `usePDP`) into the flat set of fields
 * this section and its children consume, plus the derived `outOfStock` flag.
 *
 * Keeping the (deeply nested) destructuring in one place keeps the section and
 * the presentational sub-components readable.
 */
export function useProductDetailsData(product: ProductDetailsProduct) {
  return useMemo(() => {
    const {
      id,
      sku,
      gtin,
      name: variantName,
      brand,
      description,
      unitMultiplier,
      isVariantOf,
      isVariantOf: {
        name,
        productGroupID: productId,
        skuVariants,
        // Product-group specifications (all of them, e.g. "Composição",
        // "Corte"), the FastStore equivalent of VTEX IO `product.properties`.
        additionalProperty: properties,
      },
      image: productImages,
      additionalProperty,
      availableInstallments,
      offers: {
        offers: [
          {
            availability,
            price,
            priceWithTaxes,
            listPrice,
            listPriceWithTaxes,
            seller,
          },
        ],
        lowPrice,
        lowPriceWithTaxes,
      },
    } = product;

    // `productClusters` vem do fragment ServerProduct (src/fragments) e não faz
    // parte do tipo do fragment nativo da PDP — leitura por cast estreito,
    // mesma abordagem do ProductCard.
    const productClusters = (
      product as ProductDetailsProduct & {
        productClusters?: ProductCluster[];
      }
    ).productClusters;

    const outOfStock = availability === "https://schema.org/OutOfStock";

    const maxInstallment = getMaxInterestFreeInstallment(availableInstallments);
    const installments = getInstallmentsByNumber(availableInstallments);

    // Repairs the SKU selector for "orphan" SKUs whose current size isn't wired
    // into the variation matrix (empty/mismatched activeVariations + all-OOS
    // siblings). See normalizeSkuVariants. No-op for well-formed products.
    const normalizedSkuVariants = normalizeSkuVariants({
      skuVariants,
      variantName,
      sku,
      outOfStock,
    });

    return {
      id,
      sku,
      gtin,
      name,
      variantName,
      productId,
      brand,
      description,
      unitMultiplier,
      isVariantOf,
      skuVariants: normalizedSkuVariants,
      productImages,
      additionalProperty,
      properties,
      availability,
      price,
      priceWithTaxes,
      listPrice,
      listPriceWithTaxes,
      lowPrice,
      lowPriceWithTaxes,
      seller,
      outOfStock,
      maxInstallment,
      installments,
      productClusters,
    };
  }, [product]);
}

export type ProductDetailsData = ReturnType<typeof useProductDetailsData>;
