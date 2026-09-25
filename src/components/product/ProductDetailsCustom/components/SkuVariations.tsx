import type { SkuOption } from "@faststore/ui";

import { Image } from "src/components/ui/Image";
import Link from 'next/link'

import type { ProductDetailsData } from "../hooks/useProductDetailsData";
import { useVariantAvailability } from "../hooks/useVariantAvailability";

export interface SkuVariationsProps {
  skuVariants: NonNullable<ProductDetailsData["skuVariants"]>;
  /**
   * When provided, picking an option swaps the SKU in place (via this callback)
   * instead of navigating to the variant's PDP. Keeps the Quick Buy modal and
   * the PDP on the same in-place experience. Falls back to a link when a target
   * SKU can't be resolved.
   */
  onSelectSku?: (sku: string) => void;
}

type Variant = "image" | "color" | "label";

interface VariantProduct {
  sku?: string | null;
  additionalProperty?: Array<{ name: string; value: string }> | null;
}

/**
 * Resolves the SKU id of the variant that matches the target variation combo
 * (current selections with one axis changed), so we can swap to it in place.
 */
function findVariantSku(
  allVariantProducts: VariantProduct[],
  targetVariations: Record<string, string>,
): string | undefined {
  const entries = Object.entries(targetVariations);
  const match = allVariantProducts.find((variant) => {
    const props = variant.additionalProperty ?? [];
    return entries.every(([name, value]) =>
      props.some((prop) => prop.name === name && prop.value === value),
    );
  });
  return match?.sku ?? undefined;
}

function getImageName(src: string) {
  try {
    return new URL(src).pathname.split("/").slice(-1)[0];
  } catch {
    return src;
  }
}

/**
 * Infers the SKU selector visual variant the same way `@faststore/ui` does:
 * color when every option has a hex color, image when options have distinct
 * images, otherwise a text label.
 */
function defineVariant(options: SkuOption[]): Variant {
  if (options.length > 0 && options.every((option) => option.hexColor)) {
    return "color";
  }

  const firstImageName = options[0]?.src && getImageName(options[0].src);
  if (firstImageName && options.length === 1) {
    return "image";
  }

  const sourcesEqualOrNull = options.every((option) => {
    if (!option.src) {
      return true;
    }
    return getImageName(option.src) === firstImageName;
  });

  return sourcesEqualOrNull ? "label" : "image";
}

/** Resolves the destination slug for an option, mirroring core's `useSkuSlug`. */
function getSkuSlug(
  slugsMap: Record<string, string>,
  selectedVariations: Record<string, string>,
  dominantVariation: string,
) {
  const key = Object.entries(selectedVariations).flat().join("-");
  if (key in slugsMap) {
    return slugsMap[key];
  }

  const possibleVariants = Object.keys(slugsMap);
  const dominantKeyValue = `${dominantVariation}-${selectedVariations[dominantVariation]}`;
  const match = possibleVariants.find((slug) =>
    slug.includes(dominantKeyValue),
  );

  return slugsMap[match ?? possibleVariants[0]];
}

interface SkuOptionOverlayProps {
  label: string;
  href: string;
  targetSku?: string;
  onSelectSku?: (sku: string) => void;
}

/**
 * The clickable overlay for an option `<li>`. `[data-fs-sku-selector-option-link]`
 * is already positioned absolute/full-size by the imported core SkuSelector
 * styles (see styles.module.scss) — a `<button>` only additionally needs its
 * default browser chrome reset, which lives in that same stylesheet next to
 * the rest of the `data-fs-sku-selector-option` rules.
 */
function SkuOptionOverlay({ label, href, targetSku, onSelectSku }: SkuOptionOverlayProps) {
  if (onSelectSku && targetSku) {
    return (
      <button
        type="button"
        data-fs-sku-selector-option-link
        aria-label={label}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onSelectSku(targetSku);
        }}
      />
    );
  }

  return <a data-fs-sku-selector-option-link href={href} aria-label={label} />;
}

/** The visible swatch/thumbnail/label content of an option `<li>`. */
function SkuOptionVisual({ variant, option }: { variant: Variant; option: SkuOption }) {
  switch (variant) {
    case "label":
      return <span>{option.value}</span>;
    case "image":
      return (
        <span>
          <Image
            src={option.src ?? ""}
            alt={option.alt ?? ""}
            width={34}
            height={34}
            data-fs-sku-selector-option-image
          />
        </span>
      );
    case "color":
      return (
        <span>
          <div
            data-fs-sku-selector-option-color
            title={option.value}
            style={
              {
                "--data-fs-sku-selector-option-color-bkg-color": option.hexColor,
              } as React.CSSProperties
            }
          />
        </span>
      );
  }
}

/**
 * SKU variation selectors with out-of-stock awareness.
 *
 * Renders its own markup (instead of `@faststore/ui`'s closed SkuSelector) so
 * each option `<li>` can expose `data-unavailable` for styling. It keeps the
 * native `data-fs-sku-selector*` attributes so the imported SkuSelector styles
 * still apply, and each option is a link to the variant's PDP slug — clicking
 * navigates and switches the whole product context (price/buy button follow).
 */
export function SkuVariations({
  skuVariants,
  onSelectSku,
}: SkuVariationsProps) {
  // Cast bridges the generated `allVariantProducts` type until the dev/build
  // regenerates it with the fields added in src/fragments/*Product.ts.
  const { isUnavailable } = useVariantAvailability(
    skuVariants as unknown as Parameters<typeof useVariantAvailability>[0],
  );

  const { slugsMap, activeVariations, availableVariations, allVariantProducts } =
    skuVariants as {
      slugsMap: Record<string, string>;
      activeVariations: Record<string, string>;
      availableVariations: Record<string, SkuOption[]>;
      allVariantProducts?: VariantProduct[];
    };

  if (!availableVariations) {
    return null;
  }

  return (
    <>
      <section data-fs-product-details-selectors>
        {Object.keys(availableVariations).map((skuPropertyName) => {
          const options = availableVariations[skuPropertyName] ?? [];
          const variant = defineVariant(options);
          const activeValue = activeVariations[skuPropertyName];

          return (
            <div
              key={skuPropertyName}
              data-fs-sku-selector
              data-fs-sku-selector-variant={variant}
            >
              <span data-fs-sku-selector-title>
                {skuPropertyName}: <strong>{activeValue}</strong>
              </span>

              <ul data-fs-sku-selector-list>
                {options.map((option) => {
                  const unavailable = isUnavailable(skuPropertyName, option.value);
                  const targetVariations = {
                    ...activeVariations,
                    [skuPropertyName]: option.value,
                  };
                  const href = `/${getSkuSlug(
                    slugsMap,
                    targetVariations,
                    skuPropertyName,
                  )}/p`;
                  // Prefer an in-place swap; fall back to the PDP link when the
                  // target SKU can't be resolved from the variation matrix.
                  const targetSku = onSelectSku
                    ? findVariantSku(allVariantProducts ?? [], targetVariations)
                    : undefined;

                  return (
                    <li
                      key={option.value}
                      title={option.label}
                      data-fs-sku-selector-option
                      data-fs-sku-selector-checked={option.value === activeValue}
                      data-fs-sku-available={String(!unavailable)}
                      data-unavailable={unavailable || undefined}
                    >
                      <SkuOptionOverlay
                        label={option.label}
                        href={href}
                        targetSku={targetSku}
                        onSelectSku={onSelectSku}
                      />
                      <SkuOptionVisual variant={variant} option={option} />
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </section>

      <div data-fs-sku-selector-medidas>
        <Link
          data-fs-sku-selector-link-medidas
          href="/guia-de-medidas"
          aria-label="guia de medidas"
          className="flex items-center"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_5426_21860)">
              <path d="M17.5002 5H2.50016C1.5835 5 0.833496 5.75 0.833496 6.66667V13.3333C0.833496 14.25 1.5835 15 2.50016 15H17.5002C18.4168 15 19.1668 14.25 19.1668 13.3333V6.66667C19.1668 5.75 18.4168 5 17.5002 5ZM16.6668 13.3333H3.3335C2.87516 13.3333 2.50016 12.9583 2.50016 12.5V7.5C2.50016 7.04167 2.87516 6.66667 3.3335 6.66667H4.16683V9.16667C4.16683 9.625 4.54183 10 5.00016 10C5.4585 10 5.8335 9.625 5.8335 9.16667V6.66667H7.50016V9.16667C7.50016 9.625 7.87516 10 8.3335 10C8.79183 10 9.16683 9.625 9.16683 9.16667V6.66667H10.8335V9.16667C10.8335 9.625 11.2085 10 11.6668 10C12.1252 10 12.5002 9.625 12.5002 9.16667V6.66667H14.1668V9.16667C14.1668 9.625 14.5418 10 15.0002 10C15.4585 10 15.8335 9.625 15.8335 9.16667V6.66667H16.6668C17.1252 6.66667 17.5002 7.04167 17.5002 7.5V12.5C17.5002 12.9583 17.1252 13.3333 16.6668 13.3333Z" fill="#C41230"/>
            </g>
            <defs>
              <clipPath id="clip0_5426_21860">
                <rect width="20" height="20" fill="white"/>
              </clipPath>
            </defs>
          </svg>
          <span>Entenda a medida da Levi’s®</span>
        </Link>
      </div>
    </>
  );
}
