import { BuyButton, Icon } from "@faststore/ui";
import type { ClientProductQueryQuery } from "@generated/graphql";

import { useProductQuery } from "src/sdk/product/useProductQuery";
import { useBuyButton } from "src/sdk/cart/useBuyButton";
// Relative path (not the `src/*` alias) so it resolves to this store's
// useFormattedPrice override, which forces two decimals (e.g. "R$ 89,90"). The
// alias would resolve to the core version (minimumFractionDigits: 0).
import { useFormattedPrice } from "../../../../sdk/product/useFormattedPrice";

// Relative imports: these are store customizations, so they aren't reachable
// through the `src/*` alias (which only resolves core components).
import { ColorSwatches } from "../../../product/ColorSwatches/ColorSwatches";
import {
  buildSwatchItems,
  findSpec,
} from "../../../product/ColorSwatches/colors";
import { useColorSwap } from "../../../product/ColorSwatches/useColorSwap";
import type { SimilarColor } from "../../../product/ColorSwatches/types";
import { SkuVariations } from "../../../product/ProductDetailsCustom/components/SkuVariations";
import {
  useProductDetailsData,
  type ProductDetailsProduct,
} from "../../../product/ProductDetailsCustom/hooks/useProductDetailsData";
// Core component: reachable through the `src/*` alias (unlike the customizations
// above, which must be relative).
import NotAvailableButton from "src/components/product/NotAvailableButton";
// Reuse the PDP stylesheet so the `data-fs-*` sku/color selectors render
// identically (same trick the Quick Buy modal uses).
import pdpStyles from "../../../product/ProductDetailsCustom/styles.module.scss";

import type { ShopTheLookProduct } from "../types";

import styles from "./styles.module.scss";

interface ModalProductProps {
  /** Kit product — the header is rendered from this static data. */
  product: ShopTheLookProduct;
  /** Whether this accordion item is open (mounts the on-demand product query). */
  isExpanded: boolean;
  /** Toggles this accordion item open/closed. */
  onToggle: () => void;
  addToCartLabel: string;
  seeMoreLabel: string;
}

/**
 * The expanded body of an accordion item: color + size selectors, add-to-cart
 * and a "see more" PDP link. It reuses the exact same building blocks as the
 * Quick Buy modal, so colors (from `product.similars`), sizes and cart all
 * behave like the PDP.
 */
function ModalProductBox({
  product,
  addToCartLabel,
  seeMoreLabel,
}: {
  product: ProductDetailsProduct;
  addToCartLabel: string;
  seeMoreLabel: string;
}) {
  // Color/size selection swaps the SKU in place (a link would defeat the modal).
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

  const buyProps = useBuyButton({
    id: data.id,
    price: data.price,
    priceWithTaxes: data.priceWithTaxes,
    listPrice: data.listPrice,
    listPriceWithTaxes: data.listPriceWithTaxes,
    seller: data.seller,
    quantity: 1,
    itemOffered: {
      sku: data.sku,
      name: data.variantName,
      gtin: data.gtin,
      image: data.productImages,
      brand: data.brand,
      isVariantOf: data.isVariantOf,
      additionalProperty: data.additionalProperty,
      unitMultiplier: data.unitMultiplier,
    },
  });

  // `slug` is queried by the ClientProduct fragment but isn't part of the
  // ProductDetailsProduct type — read it through a narrow cast for the PDP link.
  const slug =
    (activeProduct as ProductDetailsProduct & { slug?: string }).slug ?? "";

  const hasColors = swatchItems.length > 1;

  return (
    <div className={`${pdpStyles.productDetails} ${styles.box}`}>
      {hasColors && (
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Selecione a cor</span>
          <ColorSwatches
            items={swatchItems}
            selectedProductId={activeProduct.isVariantOf.productGroupID}
            onSelect={swapToSku}
          />
        </div>
      )}

      {data.skuVariants && (
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Selecione o tamanho</span>
          <SkuVariations
            skuVariants={data.skuVariants}
            onSelectSku={swapToSku}
          />
        </div>
      )}

      {data.outOfStock ? (
        <NotAvailableButton>Produto indisponível</NotAvailableButton>
      ) : (
        <BuyButton
          icon={<Icon name="ShoppingCart" aria-label={addToCartLabel} />}
          {...buyProps}
        >
          {addToCartLabel}
        </BuyButton>
      )}

      <a className={styles.seeMore} href={`/${slug}/p`}>
        {seeMoreLabel}
      </a>

      {/* Fetches the selected color/size on demand and swaps the view in place. */}
      {loader}
    </div>
  );
}

/** Placeholder shown while the expanded product's details are fetched. */
function ModalProductSkeleton() {
  return (
    <div className={styles.box} aria-hidden="true">
      <div className={styles.field}>
        <span className={styles.fieldLabel}>Selecione a cor</span>
        <div className={styles.skeletonDots}>
          {Array.from({ length: 4 }).map((_, index) => (
            <span key={index} className={styles.skeletonDot} />
          ))}
        </div>
      </div>

      <div className={styles.field}>
        <span className={styles.fieldLabel}>Selecione o tamanho</span>
        <div className={styles.skeletonSizes}>
          {Array.from({ length: 6 }).map((_, index) => (
            <span key={index} className={styles.skeletonSize} />
          ))}
        </div>
      </div>

      <span className={styles.skeletonButton} />
    </div>
  );
}

/**
 * Runs the on-demand product fetch (only mounted while the item is expanded) and
 * renders loading / not-found / ready states.
 */
function ModalProductBody({
  skuId,
  addToCartLabel,
  seeMoreLabel,
}: {
  skuId: string;
  addToCartLabel: string;
  seeMoreLabel: string;
}) {
  // The product query resolves by SKU id (findSkuId → skuLoader), so we pass the
  // kit's `skuId` (items[0].itemId), never the catalog `productId`.
  const { data, error } = useProductQuery(skuId);
  const product =
    (data as ClientProductQueryQuery | undefined)?.product ?? null;

  if (!data && !error) {
    return <ModalProductSkeleton />;
  }

  if (!product) {
    return (
      <div className={styles.status}>
        <p>Não foi possível carregar este produto.</p>
      </div>
    );
  }

  return (
    <ModalProductBox
      product={product as ProductDetailsProduct}
      addToCartLabel={addToCartLabel}
      seeMoreLabel={seeMoreLabel}
    />
  );
}

/**
 * One accordion item inside the Shop The Look modal. The header (image, name,
 * price) renders from static kit data; the body only mounts — and only then
 * fetches the full product — while the item is expanded.
 */
export function ModalProduct({
  product,
  isExpanded,
  onToggle,
  addToCartLabel,
  seeMoreLabel,
}: ModalProductProps) {
  const formattedPrice = useFormattedPrice(product.price);

  return (
    <div className={styles.item} data-expanded={isExpanded || undefined}>
      <button
        type="button"
        className={styles.itemHeader}
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        {product.image && (
          <img
            className={styles.thumb}
            src={product.image}
            alt={product.productName}
            loading="lazy"
          />
        )}

        <span className={styles.name}>{product.productName}</span>

        <span className={styles.price}>{formattedPrice}</span>

        <span className={styles.caret} aria-hidden="true">
          <Icon name="CaretDown" width={20} height={20} />
        </span>
      </button>

      {isExpanded && (
        <ModalProductBody
          skuId={product.skuId}
          addToCartLabel={addToCartLabel}
          seeMoreLabel={seeMoreLabel}
        />
      )}
    </div>
  );
}

export default ModalProduct;
