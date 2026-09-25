import {
  BuyButton,
  Icon,
  Label as UILabel,
  ProductPrice,
  QuantitySelector,
  Skeleton as UISkeleton,
  useUI,
} from "@faststore/ui";
import type { ProductDetailsFragment_ProductFragment } from "@generated/graphql";
import type { Dispatch, SetStateAction } from "react";
import { useMemo } from "react";

// `src/*` resolves to the FastStore core sources, so these reuse the
// framework's own building blocks (no store-local copies exist).
import NotifyMe from "../NotifyMe";
import NotAvailableButton from "src/components/product/NotAvailableButton";
import SkuSelector from "src/components/ui/SkuSelector";
import AddToCartLoadingSkeleton from "src/components/ui/ProductDetails/AddToCartLoadingSkeleton";
import { useBuyButton } from "src/sdk/cart/useBuyButton";
// Relative path (not the `src/*` alias) so it resolves to this store's
// useFormattedPrice override, which forces two decimals (e.g. "R$ 89,90"). The
// alias would resolve to the core version (minimumFractionDigits: 0).
import { useFormattedPrice } from "../../../sdk/product/useFormattedPrice";

export interface ProductDetailsInfoProps {
  product: ProductDetailsFragment_ProductFragment;
  buyButtonTitle: string;
  buyButtonIcon: {
    alt: string;
    icon: string;
  };
  isValidating: boolean;
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
  notAvailableButtonTitle: string;
  useUnitMultiplier?: boolean;
  taxesConfiguration?: {
    usePriceWithTaxes?: boolean;
    taxesLabel?: string;
  };
  invalidQuantityToastLabels?: {
    title?: string;
    message?: string;
  };
  loadingLabel?: string;
}

/**
 * Custom PDP settings block (overrides the `__experimentalProductDetailsSettings`
 * slot of the ProductDetails section — see CustomProductDetails).
 *
 * Composes the price, quantity selector, SKU selector and buy button using
 * `@faststore/ui` primitives. Keeping the native `data-fs-*` attributes
 * preserves the existing theme styling.
 */
export default function ProductDetailsInfo({
  product,
  buyButtonTitle,
  isValidating,
  quantity,
  setQuantity,
  buyButtonIcon: { icon: buyButtonIconName, alt: buyButtonIconAlt },
  notAvailableButtonTitle,
  useUnitMultiplier = false,
  taxesConfiguration,
  invalidQuantityToastLabels,
  loadingLabel,
}: ProductDetailsInfoProps) {
  const { pushToast } = useUI();

  const {
    id,
    sku,
    gtin,
    unitMultiplier,
    name: variantName,
    brand,
    isVariantOf,
    isVariantOf: { skuVariants },
    image: productImages,
    additionalProperty,
    offers: {
      offers: [
        {
          availability,
          price,
          priceWithTaxes,
          listPrice,
          seller,
          listPriceWithTaxes,
        },
      ],
    },
  } = product;

  const buyProps = useBuyButton({
    id,
    price,
    priceWithTaxes,
    listPrice,
    listPriceWithTaxes,
    seller,
    quantity,
    itemOffered: {
      sku,
      name: variantName,
      gtin,
      image: productImages,
      brand,
      isVariantOf,
      additionalProperty,
      unitMultiplier,
    },
  });

  const outOfStock = useMemo(
    () => availability === "https://schema.org/OutOfStock",
    [availability],
  );

  return (
    <div className="productDetails">
      {!outOfStock &&
        (isValidating ? (
          <UISkeleton size={{ width: "100%", height: "50px" }} />
        ) : (
          <section data-fs-product-details-values>
            <div data-fs-product-details-values-wrapper>
              <ProductPrice
                data-fs-product-details-prices
                value={
                  (taxesConfiguration?.usePriceWithTaxes
                    ? priceWithTaxes
                    : price) * (unitMultiplier ?? 1)
                }
                listPrice={
                  (taxesConfiguration?.usePriceWithTaxes
                    ? listPriceWithTaxes
                    : listPrice) * (unitMultiplier ?? 1)
                }
                formatter={useFormattedPrice}
              />

              {taxesConfiguration?.usePriceWithTaxes && (
                <UILabel data-fs-product-details-taxes-label>
                  {taxesConfiguration?.taxesLabel}
                </UILabel>
              )}
            </div>

            <QuantitySelector
              min={1}
              max={10}
              unitMultiplier={useUnitMultiplier ? unitMultiplier ?? 1 : 1}
              useUnitMultiplier={useUnitMultiplier}
              onChange={setQuantity}
              onValidateBlur={(min: number, maxValue: number, qty: number) => {
                pushToast({
                  title: invalidQuantityToastLabels?.title,
                  message:
                    invalidQuantityToastLabels?.message
                      ?.replace("%{min}", min.toString())
                      ?.replace("%{max}", maxValue.toString())
                      ?.replace("%{quantity}", qty.toString()) || "",
                  status: "INFO",
                  icon: (
                    <Icon name="CircleWavyWarning" width={30} height={30} />
                  ),
                });
              }}
            />
          </section>
        ))}

      {skuVariants && (
        <SkuSelector
          slugsMap={skuVariants.slugsMap}
          availableVariations={skuVariants.availableVariations}
          activeVariations={skuVariants.activeVariations}
          data-fs-product-details-selectors
        />
      )}

      {isValidating ? (
        <AddToCartLoadingSkeleton loadingLabel={loadingLabel} />
      ) : outOfStock ? (
        <>
          {/*<NotAvailableButton>{notAvailableButtonTitle}</NotAvailableButton>*/}
          <NotifyMe
            productId={id}
            skuId={sku}
            productName={variantName}
          />
        </>
      ) : (
        <BuyButton
          icon={<Icon name={buyButtonIconName} aria-label={buyButtonIconAlt} />}
          {...buyProps}
          data-fs-buy-button
        >
          {buyButtonTitle}
        </BuyButton>
      )}
    </div>
  );
}
