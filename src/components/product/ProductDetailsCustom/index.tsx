import { useEffect, useRef, useState } from "react";

import storeConfig from "discovery.config";
import { usePDP } from "src/sdk/overrides/PageProvider";
import { useLink } from "src/sdk/ui/useLink";

import ImageGallery from "../ImageGallery";
import ModelSize from "../ModelSize";
import { ColorSwatches } from "../ColorSwatches/ColorSwatches";
import { buildSwatchItems, findSpec } from "../ColorSwatches/colors";
import { useColorSwap } from "../ColorSwatches/useColorSwap";
import type { SimilarColor } from "../ColorSwatches/types";
import { ProductHeader } from "./components/ProductHeader";
import { ProductSettings } from "./components/ProductSettings";
import {
  useProductDetailsData,
  type ProductDetailsProduct,
} from "./hooks/useProductDetailsData";
import { useViewItemEvent } from "./hooks/useViewItemEvent";
import type { ProductDetailsCustomProps } from "./types";

import styles from "./styles.module.scss";

type StoreConfig = typeof storeConfig & {
  experimental: {
    enableClientOffer?: boolean;
  };
};

// When the client-offer experimental feature is OFF (the default), the offer
// (price/availability) is delivered fully by SSR, so `isValidating` from the
// background SWR revalidation must NOT gate the UI behind a loading state.
const isClientOfferEnabled = (storeConfig as StoreConfig).experimental
  .enableClientOffer;

/**
 * Fully custom ProductDetails section.
 *
 * Unlike CustomProductDetails (which overrides the native section's inner
 * slots), this is a standalone CMS-backed section that reads the product from
 * `usePDP()` and composes its own building blocks:
 *
 * - {@link ProductHeader} — title + discount badge
 * - {@link ImageGallery}  — the store's swipeable gallery
 * - {@link ProductSettings} — price, quantity, SKU variations, buy button
 *
 * The short description (specs) and the description accordion now live in the
 * standalone DescriptionProduct section.
 *
 * It is intentionally independent of the ProductDetails OverrideContext, so all
 * children compose `@faststore/ui` primitives directly. The product fields it
 * reads are already part of the PDP GraphQL query via the native
 * `ProductDetailsFragment_product` fragment, so no extra GraphQL is required.
 */
function ProductDetailsCustom({
  productTitle,
  buyButton,
  notAvailableButton,
  quantitySelector,
  taxesConfiguration,
  loadingLabel,
  productIncentives,
}: ProductDetailsCustomProps) {
  const context = usePDP();
  const product = context?.data?.product;
  // Only meaningful while the client offer is being fetched; with SSR offer
  // data (client offer disabled) this stays false and we render immediately.
  const isValidating = Boolean(
    isClientOfferEnabled && context?.data?.isValidating,
  );
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    throw new Error("NotFound");
  }

  // Color (distinct products) and size (sibling SKUs) both swap the whole PDP
  // in place — gallery, price and the size selector all follow `activeProduct`.
  // The swatch list stays anchored to the base product.
  const { activeProduct, swapToSku, loader } =
    useColorSwap<ProductDetailsProduct>(product);

  const similars =
    (product as ProductDetailsProduct & { similars?: SimilarColor[] })
      .similars ?? [];

  const swatchItems = buildSwatchItems({
    baseProductId: product.isVariantOf.productGroupID,
    baseSku: product.sku,
    baseColorName: findSpec(product.additionalProperty, "Cor"),
    baseColorHex: findSpec(product.additionalProperty, "ColorHex"),
    similars,
  });

  const data = useProductDetailsData(activeProduct);

  useViewItemEvent(data);

  // Keep the address bar in sync with the variant shown by the in-place swap so
  // the URL stays shareable/canonical — each color and size has its own PDP URL.
  // We use history.replaceState (there's no FastStore hook for a shallow URL
  // sync) to avoid a navigation that would refetch and reset the swap; the URL
  // itself is built with the framework's `useLink` so i18n prefixes are honored.
  // The original landing URL is preserved for the base product and restored when
  // the shopper returns to it.
  const { resolveLink } = useLink();
  const originalPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (originalPathRef.current === null) {
      originalPathRef.current = window.location.pathname;
    }

    const isBase = activeProduct.sku === product.sku;
    const slug = (activeProduct as { slug?: string }).slug;
    const target = isBase
      ? originalPathRef.current
      : slug
        ? resolveLink(`/${slug}/p`) ?? `/${slug}/p`
        : null;

    if (target && target !== window.location.pathname) {
      window.history.replaceState(window.history.state, "", target);
    }
  }, [activeProduct, product.sku, resolveLink]);

  return (
    <section className={`section ${styles.productDetails}`}>
      <div className="wrap">
        <div className="container">
          <div className="layout__content">
            <article data-fs-product-details>
              <div data-fs-product-context>
                <div data-fs-product-details-gallery>
                  <ImageGallery images={data.productImages} />
                  <ModelSize />
                </div>

                <div data-fs-product-details-info>
                  {isValidating ? (
                    <p>{loadingLabel}</p>
                  ) : (
                    <ProductSettings
                      data={data}
                      quantity={quantity}
                      setQuantity={setQuantity}
                      isValidating={isValidating}
                      buyButton={buyButton}
                      notAvailableButton={notAvailableButton}
                      quantitySelector={quantitySelector}
                      taxesConfiguration={taxesConfiguration}
                      loadingLabel={loadingLabel}
                      productTitle={productTitle}
                      productIncentives={productIncentives}
                      onSelectSku={swapToSku}
                      colorSwatches={
                        // Only render the color block when there's more than the
                        // base color — mirrors ColorSwatches' own "no alternatives"
                        // guard so the "Selecione a cor" label never shows alone.
                        swatchItems.length > 1 ? (
                          <ColorSwatches
                            items={swatchItems}
                            selectedProductId={
                              activeProduct.isVariantOf.productGroupID
                            }
                            onSelect={swapToSku}
                          />
                        ) : null
                      }
                    />
                  )}
                </div>
              </div>
            </article>
          </div>

          {/* Fetches the selected sibling on demand and swaps the PDP in place. */}
          {loader}
        </div>
      </div>
    </section>
  );
}

export default ProductDetailsCustom;
