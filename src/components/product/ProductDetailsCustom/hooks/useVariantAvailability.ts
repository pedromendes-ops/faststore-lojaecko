import { useMemo } from "react";

const OUT_OF_STOCK = "https://schema.org/OutOfStock";

// Shape of each variant once the PDP query is enriched (see
// src/fragments/ServerProduct.ts + ClientProduct.ts). Typed locally because the
// generated types only pick this up after a dev/build regeneration.
interface VariantProduct {
  sku: string;
  additionalProperty?: Array<{ name: string; value: string }> | null;
  offers?: {
    offers?: Array<{ availability?: string | null; quantity?: number | null }>;
  } | null;
}

interface SkuVariantsLike {
  activeVariations: Record<string, string>;
  availableVariations: Record<string, unknown>;
  allVariantProducts?: VariantProduct[] | null;
}

/**
 * Builds the canonical combo key used by `slugsMap` (e.g. "Cor-Azul-Tamanho-40").
 *
 * The key is assembled following a fixed `order` (the variation names) so the
 * same combo always produces the same string regardless of the insertion order
 * of the source object — otherwise the map set/get would silently miss.
 */
function comboKey(
  selectedVariations: Record<string, string>,
  order: string[],
) {
  return order.map((name) => `${name}-${selectedVariations[name]}`).join("-");
}

function isVariantInStock(variant: VariantProduct) {
  const offer = variant.offers?.offers?.[0];
  if (!offer) {
    return false;
  }
  return offer.availability !== OUT_OF_STOCK && (offer.quantity ?? 0) > 0;
}

/**
 * Computes a per-option availability lookup for the SKU selector.
 *
 * Each variant carries its variation values in `additionalProperty`; we index
 * the in-stock state by the same combo key `slugsMap` uses. For an option we
 * take the current selection, swap in the option's value and look the combo up.
 *
 * The result is intentionally conservative: an option is only flagged
 * unavailable when the matching variant is positively out of stock. If a combo
 * can't be matched (data gap), it is left as available so the UI never
 * over-disables.
 */
export function useVariantAvailability(skuVariants: SkuVariantsLike) {
  return useMemo(() => {
    const { activeVariations, availableVariations, allVariantProducts } =
      skuVariants;

    const variationNames = Object.keys(availableVariations ?? {});

    const inStockByCombo = new Map<string, boolean>();

    for (const variant of allVariantProducts ?? []) {
      const props = variant.additionalProperty ?? [];
      const selected: Record<string, string> = {};

      for (const name of variationNames) {
        const match = props.find((p) => p.name === name);
        if (match) {
          selected[name] = match.value;
        }
      }

      // Skip variants we can't fully position on the variation axes.
      if (Object.keys(selected).length !== variationNames.length) {
        continue;
      }

      inStockByCombo.set(
        comboKey(selected, variationNames),
        isVariantInStock(variant),
      );
    }

    const isUnavailable = (propertyName: string, value: string) => {
      const target = { ...activeVariations, [propertyName]: value };
      const inStock = inStockByCombo.get(comboKey(target, variationNames));
      // Only mark unavailable when we positively know it is out of stock.
      return inStock === false;
    };

    return { isUnavailable };
  }, [skuVariants]);
}
