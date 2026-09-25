import { useState } from "react";

// Relative imports: ImageGallery and ProductDetailsCustom are store
// customizations, so they aren't reachable through the `src/*` alias (which only
// resolves core components).
import ImageGallery from "../../../ImageGallery";
import { ProductSettings } from "../../../ProductDetailsCustom/components/ProductSettings";
import {
  useProductDetailsData,
  type ProductDetailsProduct,
} from "../../../ProductDetailsCustom/hooks/useProductDetailsData";
import { ColorSwatches } from "../../../ColorSwatches/ColorSwatches";
import { buildSwatchItems, findSpec } from "../../../ColorSwatches/colors";
import { useColorSwap } from "../../../ColorSwatches/useColorSwap";
import type { SimilarColor } from "../../../ColorSwatches/types";

// Reuse the PDP section's stylesheet: it scopes every `data-fs-product-details-*`
// rule (and the @faststore/ui component style imports) under `.productDetails`.
// By wrapping our content in the same class and mirroring the PDP markup, the
// buy box renders identically without duplicating styles.
import pdpStyles from "../../../ProductDetailsCustom/styles.module.scss";

import styles from "./styles.module.scss";

export interface QuickBuyDetailsProps {
  product: ProductDetailsProduct;
  /** Buy button label, threaded from the shelf card ("Compra rápida"). */
  buyButtonLabel?: string;
}

// The Quick Buy box mirrors the PDP defaults. It is intentionally not
// CMS-driven — the trigger lives inside a shelf card, so the copy is fixed here.
const QUICK_BUY_PRODUCT_TITLE = {
  refNumber: false,
  discountBadge: { showDiscountBadge: true, size: "small" as const },
};

const QUICK_BUY_NOT_AVAILABLE_BUTTON = { title: "Produto indisponível" };

const QUICK_BUY_QUANTITY_SELECTOR = {
  useUnitMultiplier: false,
  invalidQuantityToastLabels: {
    title: "Quantidade inválida",
    message:
      "A quantidade deve estar entre %{min} e %{max}. Ajustamos para %{quantity}.",
  },
};

/**
 * The Quick Buy buy box: image gallery + full product settings (price,
 * installments, SKU selectors, quantity and add-to-cart).
 *
 * Composes the exact same building blocks as {@link ProductDetailsCustom} but
 * driven by a product fetched on demand (see {@link useQuickBuyProduct}) instead
 * of `usePDP()`, so it can run in the shelf context.
 */
export function QuickBuyDetails({
  product,
  buyButtonLabel = "Adicionar à sacola",
}: QuickBuyDetailsProps) {
  // Color and size selection swap the SKU in place — critical here, since a
  // link would navigate away and defeat the whole quick-buy modal.
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

  // The SKU selector data is already repaired inside useProductDetailsData (see
  // normalizeSkuVariants) so the current size stays selectable here.
  const data = useProductDetailsData(activeProduct);
  const [quantity, setQuantity] = useState(1);

  const buyButton = {
    title: buyButtonLabel,
    icon: { icon: "ShoppingCart", alt: buyButtonLabel },
  };

  return (
    <div className={`${pdpStyles.productDetails} ${styles.quickBuy}`}>
      <article data-fs-product-details>
        <div data-fs-product-context>
          <div data-fs-product-details-gallery>
            {/* Compact modal: keep the thumbnail row below the main image. */}
            <ImageGallery images={data.productImages} orientation="horizontal" />
          </div>

          <div data-fs-product-details-info>
            <ProductSettings
              data={data}
              quantity={quantity}
              setQuantity={setQuantity}
              isValidating={false}
              buyButton={buyButton}
              notAvailableButton={QUICK_BUY_NOT_AVAILABLE_BUTTON}
              quantitySelector={QUICK_BUY_QUANTITY_SELECTOR}
              productTitle={QUICK_BUY_PRODUCT_TITLE}
              onSelectSku={swapToSku}
              colorSwatches={
                // Only render the color block when there's more than the base
                // color — mirrors ColorSwatches' own "no alternatives" guard so
                // the "Selecione a cor" label never shows alone.
                swatchItems.length > 1 ? (
                  <ColorSwatches
                    items={swatchItems}
                    selectedProductId={activeProduct.isVariantOf.productGroupID}
                    onSelect={swapToSku}
                  />
                ) : null
              }
            />
          </div>
        </div>
      </article>

      {/* Fetches the selected color/size on demand and swaps the view in place. */}
      {loader}
    </div>
  );
}
