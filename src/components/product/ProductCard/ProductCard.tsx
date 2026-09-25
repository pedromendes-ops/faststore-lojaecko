import {
  BuyButton as UIBuyButton,
  Icon as UIIcon,
  ProductCard as UIProductCard,
  ProductCardImage as UIProductCardImage,
  ProductComparisonTrigger as UIProductComparisonTrigger,
  useUI,
} from "@faststore/ui";
import { memo, useEffect, useMemo, useState } from "react";

import { gql } from "@generated";
import type { ProductSummary_ProductFragment } from "@generated/graphql";
import type { ImageProps } from "next/image";
import NextLink from "next/link";
import { Image } from "src/components/ui/Image";
import { useBuyButton } from "src/sdk/cart/useBuyButton";
// Relative path (not the `src/*` alias) so it resolves to this store's
// useFormattedPrice override, which forces two decimals (e.g. "R$ 89,90"). The
// alias would resolve to the core version (minimumFractionDigits: 0).
import { useFormattedPrice } from "../../../sdk/product/useFormattedPrice";
// Também relativo: é um hook só desta loja (não existe no core), mesmo caminho
// que o useWishlist usa.
import { usePricePix } from "../../../sdk/globalSections/usePricePix";
import { useProductLink } from "src/sdk/product/useProductLink";

import { QuickBuyModal } from "../QuickBuyModal";

import styles from "./ProductCard.module.scss";
import { useDevice } from "../../hooks/useDevice";
import useScreenResize from "../../common/MyScreenResize";
import { ImageListMobile } from "./compoments/ImageList";
import {
  ProductClusters,
  type ProductCluster,
} from "./compoments/productClusters";
import { ColorSwatches } from "../ColorSwatches/ColorSwatches";
import { buildSwatchItems } from "../ColorSwatches/colors";
import { useColorSwap } from "../ColorSwatches/useColorSwap";
import type { SimilarColor } from "../ColorSwatches/types";
import { WishlistButton } from "../WishlistButton/WishlistButton";

type Variant = "wide" | "default";

/**
 * Mirrors the `Installments` type added to `StoreProduct` in
 * src/graphql/vtex/typeDefs/product.graphql.
 */
interface Installment {
  installmentNumber: number;
  installmentValue: number;
  installmentInterest: number;
  installmentPaymentSystemName: string;
}

export interface ProductCardProps {
  product: ProductSummary_ProductFragment;
  index: number;
  bordered?: boolean;
  variant?: Variant;
  aspectRatio?: number;
  imgProps?: Partial<ImageProps>;
  ratingValue?: number;
  onButtonClick?: () => void;
  buttonLabel?: string;
  showDiscountBadge?: boolean;
  taxesConfiguration?: {
    usePriceWithTaxes?: boolean;
    taxesLabel?: string;
  };
  sponsoredLabel?: string;
  enableCompareCheckbox?: boolean;
  compareLabel?: string;
  /** Whether to show the Pix discount line below the installments. */
  showPixDiscount?: boolean;
  /**
   * Fallback do percentual do desconto no Pix. A fonte de verdade é a seção
   * "PricePix" das Global Sections (ver sdk/globalSections/usePricePix); estes props
   * só valem enquanto a query carrega ou se a seção não estiver publicada.
   */
  pixDiscount?: number;
  /** Fallback do texto exibido depois do percentual (e.g. "no pix"). */
  pixDiscountLabel?: string;
  /** Whether to show the add-to-cart button. */
  showBuyButton?: boolean;
  /** Label of the add-to-cart button. */
  buyButtonLabel?: string;
  /**
   * Whether to show the product cluster tags over the image. Quais tags exibir
   * é cadastro único das Global Sections → CollectionTag, lido pelo
   * ProductClusters (ver sdk/globalSections/useCollectionTags).
   */
  showProductClusters?: boolean;
}

function getProperty(product: ProductSummary_ProductFragment, name: string) {
  return product.additionalProperty?.find(
    (item) => item.name?.toLowerCase() === name.toLowerCase(),
  )?.value;
}

function ProductCard({
  product,
  index,
  bordered = true,
  variant = "default",
  aspectRatio = 1,
  imgProps,
  taxesConfiguration,
  enableCompareCheckbox = false,
  compareLabel,
  showPixDiscount = true,
  pixDiscount = 10,
  pixDiscountLabel = "no Pix",
  showBuyButton = true,
  buyButtonLabel = "Compra rápida",
  showProductClusters = true,
  ...otherProps
}: ProductCardProps) {
  const baseColor = getProperty(product, "Cor");
  const baseColorHex = getProperty(product, "ColorHex");

  // Desconto no Pix editado no CMS (Global Sections → PricePix). Os props
  // continuam valendo como fallback do primeiro paint. O SWR deduplica a
  // query, então uma vitrine inteira faz uma requisição só.
  const { percentage: pixPercentage, label: pixLabel } = usePricePix({
    percentage: pixDiscount,
    text: `OFF ${pixDiscountLabel}`,
  });

  // Sibling colors come from the base `product` (stable list). `similars` is
  // merged via the ClientManyProducts fragment, so it isn't on the
  // ProductSummary type — read it through a narrow cast, like availableInstallments.
  const similars =
    (product as ProductSummary_ProductFragment & { similars?: SimilarColor[] })
      .similars ?? [];

  const { isDesktop } = useScreenResize();

  const [isQuickBuyOpen, setIsQuickBuyOpen] = useState(false);
  const { cart: isCartOpen } = useUI();

  // Swaps the displayed color in place when a swatch is clicked (shared with the
  // PDP). `activeProduct` starts as the shelf product; the loader fetches a
  // sibling on demand and swaps it in.
  const { activeProduct, swapToSku, loader } = useColorSwap(product);

  const swatchItems = buildSwatchItems({
    baseProductId: product.isVariantOf.productGroupID,
    baseSku: product.sku,
    baseColorName: baseColor,
    baseColorHex: baseColorHex,
    similars,
  });

  const openQuickBuy = (event: React.MouseEvent<HTMLButtonElement>) => {
    // The card is wrapped in a <NextLink>; stop the click from navigating to
    // the PDP so it opens the quick-buy modal instead.
    event.preventDefault();
    event.stopPropagation();
    setIsQuickBuyOpen(true);
  };

  useEffect(() => {
    if (isQuickBuyOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isQuickBuyOpen]);

  // The buy button inside the modal adds the item to the cart and opens the
  // minicart (useBuyButton -> openCart) without ever closing QuickBuyModal.
  // Left "open" in state, its scroll lock above never released, so scrolling
  // stayed stuck even after the minicart was closed. Close it as soon as the
  // minicart opens.
  useEffect(() => {
    if (isCartOpen) {
      setIsQuickBuyOpen(false);
    }
  }, [isCartOpen]);

  const {
    sku,
    brand,
    isVariantOf: { name },
    image: [img],
    advertisement,
    offers: {
      lowPrice,
      lowPriceWithTaxes,
      offers: [
        {
          listPrice: listPriceBase,
          availability,
          listPriceWithTaxes,
          price,
          priceWithTaxes,
          seller,
        },
      ],
    },
  } = activeProduct;

  // `availableInstallments` is merged into the shelf product node via the
  // ClientManyProducts fragment (src/fragments), so it isn't part of the
  // ProductSummary_product type — read it through a narrow cast.
  const availableInstallments = (
    activeProduct as ProductSummary_ProductFragment & {
      availableInstallments?: Installment[];
    }
  ).availableInstallments;

  // `productClusters` também vem dos fragments (src/fragments) e não faz parte
  // do tipo ProductSummary — mesmo cast estreito do availableInstallments.
  const productClusters = (
    activeProduct as ProductSummary_ProductFragment & {
      productClusters?: ProductCluster[];
    }
  ).productClusters;

  const { href: productHref, onClick: onProductClick } = useProductLink({
    product: activeProduct,
    selectedOffer: 0,
    index,
  });

  const outOfStock = useMemo(
    () => availability !== "https://schema.org/InStock",
    [availability],
  );

  const spotPrice = taxesConfiguration?.usePriceWithTaxes
    ? lowPriceWithTaxes
    : lowPrice;
  const listPrice = taxesConfiguration?.usePriceWithTaxes
    ? listPriceWithTaxes
    : listPriceBase;

  const hasDiscount = spotPrice < listPrice;

  // Pick best installment: highest number of installments with no interest;
  // fallback to highest number overall
  const bestInstallment = availableInstallments?.length
    ? (() => {
        const noInterest = availableInstallments.filter(
          (i) => i.installmentInterest === 0,
        );
        const pool = noInterest.length > 0 ? noInterest : availableInstallments;
        return pool.reduce(
          (best, curr) =>
            curr.installmentNumber > best.installmentNumber ? curr : best,
          pool[0],
        );
      })()
    : null;

  const formattedSpotPrice = useFormattedPrice(spotPrice);
  const formattedListPrice = useFormattedPrice(listPrice);
  const formattedInstallmentValue = useFormattedPrice(
    bestInstallment?.installmentValue ?? 0,
  );

  const buyProps = useBuyButton({
    id: activeProduct.id,
    price,
    priceWithTaxes,
    listPrice: listPriceBase,
    listPriceWithTaxes,
    seller,
    quantity: 1,
    itemOffered: {
      sku,
      name: activeProduct.name,
      gtin: activeProduct.gtin,
      image: activeProduct.image,
      brand,
      isVariantOf: activeProduct.isVariantOf,
      additionalProperty: activeProduct.additionalProperty,
      unitMultiplier: activeProduct.unitMultiplier,
    },
  });

  const advertisementDataAttributes = advertisement
    ? {
        "data-van-res-id": advertisement.adResponseId,
        "data-van-aid": advertisement.adId,
        "data-van-prod-name": name,
      }
    : {};

  return (
    <>
      {enableCompareCheckbox && (
        <UIProductComparisonTrigger
          label={compareLabel ?? "Comparar"}
          product={product as any}
          id={product.id}
        />
      )}
      <NextLink
        href={productHref}
        onClick={onProductClick}
        prefetch={false}
        className={styles.cardContent}
      >
        <UIProductCard
          className={styles.card}
          outOfStock={outOfStock}
          bordered={bordered}
          variant={variant}
          data-fs-product-card-sku={sku}
          {...advertisementDataAttributes}
          {...otherProps}
        >
          <ImageListMobile
            buyProps={buyProps}
            onQuickBuy={openQuickBuy}
            image={activeProduct.image}
            aspectRatio={1}
            imgProps={imgProps}
            isDesktop={isDesktop}
            outOfStock={outOfStock}
            buyButtonLabel={buyButtonLabel}
            showBuyButton={showBuyButton}
            listPrice={listPrice}
            spotPrice={spotPrice}
            clusters={productClusters}
            showProductClusters={showProductClusters}
            overlay={
              <WishlistButton
                productId={activeProduct.isVariantOf.productGroupID}
                sku={sku}
                title={activeProduct.name}
              />
            }
          />
          {/* <UIProductCardImage aspectRatio={aspectRatio}>
            <Image
              src={img.url}
              alt={img.alternateName}
              sizes={`${"(max-width: 768px) 40vw, 30vw"}`}
              width={250}
              height={Math.round(250 / aspectRatio)}
              loading={imgProps?.loading}
            />
          </UIProductCardImage> */}

          <div className={styles.colors}>
            <ColorSwatches
              items={swatchItems}
              selectedProductId={activeProduct.isVariantOf.productGroupID}
              onSelect={swapToSku}
            />

            {showBuyButton && !isDesktop && (
              <UIBuyButton
                {...buyProps}
                onClick={openQuickBuy}
                className={styles.buyButton}
                icon={<UIIcon name="ShoppingCart" width={18} height={18} />}
              >
                {outOfStock ? "Indisponível" : buyButtonLabel}
              </UIBuyButton>
            )}
          </div>
          <div className={styles["content-product"]}>
            {brand?.name && (
              <span data-fs-brand className={styles.brand}>
                {brand.name}
              </span>
            )}
            <h3 className={styles.title}>{name}</h3>
            {!outOfStock && (
              <div className={styles.prices}>
                <div className="flex items-center">
                  <span className={styles.spotPrice}>{formattedSpotPrice}</span>
                  {hasDiscount && (
                    <span
                      style={{ marginLeft: 8 }}
                      className={styles.listPrice}
                    >
                      {formattedListPrice}
                    </span>
                  )}
                </div>
                {bestInstallment && (
                  <span className={styles.installments}>
                    ou {bestInstallment.installmentNumber}x de{" "}
                    {formattedInstallmentValue}
                  </span>
                )}

                <ProductClusters clusters={productClusters} />

                {showPixDiscount && pixPercentage > 0 && (
                  <span data-fs-discounter className={styles.pixDiscount}>
                    {pixLabel}
                  </span>
                )}
              </div>
            )}
          </div>
        </UIProductCard>
      </NextLink>

      <QuickBuyModal
        isOpen={isQuickBuyOpen}
        onClose={() => setIsQuickBuyOpen(false)}
        productId={activeProduct.id}
        buyButtonLabel={"Adicionar ao carrinho"}
      />

      {/* Fetches the selected sibling on demand and swaps the card in place. */}
      {loader}
    </>
  );
}

export default memo(ProductCard);
