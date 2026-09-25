type SkuOptionLike = {
  value: string;
  label: string;
  src?: string;
  alt?: string;
};

type VariantProductLike = {
  sku?: string;
  name?: string;
  additionalProperty?: Array<{ name: string; value: string }> | null;
  offers?: {
    offers?: Array<{ availability?: string | null; quantity?: number | null }>;
  } | null;
};

type SkuVariantsLike = {
  activeVariations?: Record<string, string> | null;
  availableVariations?: Record<string, SkuOptionLike[]> | null;
  allVariantProducts?: VariantProductLike[] | null;
  slugsMap?: Record<string, string> | null;
  [key: string]: unknown;
};

export interface NormalizeSkuVariantsArgs<T> {
  /** The raw `isVariantOf.skuVariants` from the product query. */
  skuVariants: T;
  /** The current SKU's name (used to derive the size when active is empty). */
  variantName: string;
  /** The current SKU id. */
  sku: string;
  /** Whether the current product offer is unavailable. */
  outOfStock: boolean;
}

const IN_STOCK = "https://schema.org/InStock";

/**
 * Derives the current SKU's variation label (e.g. "31X30 USA | 39 BR") from the
 * variant name, used when the platform returns an empty `activeVariations`. The
 * Levi's catalog names SKUs as "<group> - <size>", so the text after the last
 * " - " is the size.
 */
function deriveCurrentVariationLabel(variantName: string): string | null {
  const separatorIndex = variantName.lastIndexOf(" - ");
  if (separatorIndex === -1) {
    return null;
  }

  const label = variantName.slice(separatorIndex + 3).trim();
  // Guard against grabbing a long description instead of a size token.
  if (!label || label.length > 40 || label === variantName) {
    return null;
  }

  return label;
}

/**
 * Builds the current SKU's slug from any sibling slug in `slugsMap`. Variant
 * slugs follow the "<linkText>-<skuId>" shape, so swapping the trailing sku id
 * for the current one yields the current product's own PDP slug.
 */
function deriveCurrentSlug(
  slugsMap: Record<string, string> | null | undefined,
  sku: string,
): string | null {
  const anySlug = slugsMap ? Object.values(slugsMap)[0] : undefined;
  if (!anySlug || !sku) {
    return null;
  }

  const base = anySlug.replace(/-[^-]+$/, "");
  if (!base || base === anySlug) {
    return null;
  }

  return `${base}-${sku}`;
}

/**
 * Works around a catalog quirk where the SKU displayed on the shelf is an
 * "orphan": it is in stock and purchasable, but it is not consistently wired
 * into the product group's variation matrix. Depending on the locator, the
 * platform returns either an empty `activeVariations` or an active value that is
 * absent from `availableVariations`, and its sibling SKUs come back out of
 * stock. The SKU selector then shows nothing selected and every option struck
 * through — even though the size the shopper is looking at is buyable.
 *
 * For the (single-axis) size selector we make sure the current SKU:
 *  - is present in the options list,
 *  - is marked as the active selection, and
 *  - resolves as in stock (only when the loaded product is actually available).
 *
 * We do that purely by reshaping the `skuVariants` payload — no rendering
 * component is changed — so both the PDP and the Quick Buy modal (which share
 * {@link useProductDetailsData}) get a usable selector. Products whose current
 * size is already a valid in-stock option are effectively unchanged.
 */
export function normalizeSkuVariants<T>({
  skuVariants: rawSkuVariants,
  variantName,
  sku,
  outOfStock,
}: NormalizeSkuVariantsArgs<T>): T {
  const skuVariants = rawSkuVariants as SkuVariantsLike | null | undefined;
  if (!skuVariants) {
    return rawSkuVariants;
  }

  const availableVariations = skuVariants.availableVariations ?? {};
  const axes = Object.keys(availableVariations);

  // Only the single-axis size selector is handled: a multi-axis current SKU
  // can't be reconstructed from the product name alone.
  if (axes.length !== 1) {
    return rawSkuVariants;
  }

  const axis = axes[0];
  const currentValue =
    skuVariants.activeVariations?.[axis] ||
    deriveCurrentVariationLabel(variantName);

  // Nothing reliable to anchor on, or the product itself is unavailable — leave
  // the platform data untouched.
  if (!currentValue || outOfStock) {
    return rawSkuVariants;
  }

  const options = availableVariations[axis] ?? [];
  const isListed = options.some((option) => option.value === currentValue);

  // Reuse a sibling's image src so `SkuVariations.defineVariant` keeps rendering
  // the axis as text chips (it compares image file names) rather than swatches.
  const injectedOption: SkuOptionLike = {
    value: currentValue,
    label: `${axis}: ${currentValue}`,
    src: options[0]?.src,
    alt: options[0]?.alt ?? currentValue,
  };

  // Inject/override an in-stock variant for the current combo so the shared
  // availability hook resolves the active option as available.
  const currentVariant: VariantProductLike = {
    sku,
    name: variantName,
    additionalProperty: [{ name: axis, value: currentValue }],
    offers: { offers: [{ availability: IN_STOCK, quantity: 1 }] },
  };
  const otherVariants = (skuVariants.allVariantProducts ?? []).filter(
    (variant) => variant.sku !== sku,
  );

  // Point the injected option's link at the current product's own PDP instead
  // of the `slugsMap` fallback (which would send the shopper to an unrelated,
  // often out-of-stock size). Matches the key `SkuVariations.getSkuSlug` builds.
  const currentSlug = deriveCurrentSlug(skuVariants.slugsMap, sku);
  const slugsMap =
    isListed || !currentSlug
      ? skuVariants.slugsMap
      : {
          ...(skuVariants.slugsMap ?? {}),
          [`${axis}-${currentValue}`]: currentSlug,
        };

  return {
    ...skuVariants,
    slugsMap,
    activeVariations: {
      ...(skuVariants.activeVariations ?? {}),
      [axis]: currentValue,
    },
    availableVariations: {
      ...availableVariations,
      [axis]: isListed ? options : [injectedOption, ...options],
    },
    allVariantProducts: [currentVariant, ...otherVariants],
  } as T;
}
