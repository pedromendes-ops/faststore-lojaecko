import {
  BuyButton,
  Icon,
  Label as UILabel,
  QuantitySelector,
  useUI,
} from "@faststore/ui";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useState } from "react";

import NotAvailableButton from "src/components/product/NotAvailableButton";
// Caminho relativo: só existem nesta loja, então o alias `src/*` (que resolve
// para o core) não os alcança.
import { ProductClusters } from "../../ProductCard/compoments/productClusters";
import { usePricePix } from "../../../../sdk/globalSections/usePricePix";
import NotifyMe from "../../NotifyMe";
import AddToCartLoadingSkeleton from "src/components/ui/ProductDetails/AddToCartLoadingSkeleton";
import { useBuyButton } from "src/sdk/cart/useBuyButton";
import { useFormattedPrice } from "../../../../sdk/product/useFormattedPrice";

import type { ProductDetailsData } from "../hooks/useProductDetailsData";
import type { ProductDetailsCustomProps } from "../types";
import { SkuVariations } from "./SkuVariations";
import { ProductHeader } from "./ProductHeader";
import { Installments } from "./Installments";
import { InstallmentsModal } from "./InstallmentsModal";
import CustomProductPrice from "./CustomProductPrice";
import { ShippingSimulation } from "./ShippingSimulation";
import { ProductIncentives } from "./ProductIncentives";
import styles from "../styles.module.scss";

import { WishlistButton } from "../../WishlistButton/WishlistButton";

export interface ProductSettingsProps {
  data: ProductDetailsData;
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
  isValidating: boolean;
  buyButton: ProductDetailsCustomProps["buyButton"];
  notAvailableButton: ProductDetailsCustomProps["notAvailableButton"];
  quantitySelector: ProductDetailsCustomProps["quantitySelector"];
  taxesConfiguration?: ProductDetailsCustomProps["taxesConfiguration"];
  loadingLabel?: string;
  productTitle: {
    refNumber: boolean;
    discountBadge: {
      showDiscountBadge: boolean;
      size: "big" | "small";
    };
  };
  productIncentives?: ProductDetailsCustomProps["productIncentives"];
  /** Color swatches rendered above the size (TAMANHOS) selector. */
  colorSwatches?: ReactNode;
  /** Swaps the SKU in place when a size is picked (instead of navigating). */
  onSelectSku?: (sku: string) => void;
}

/**
 * Buy box: price, quantity selector, SKU variations and the add-to-cart /
 * unavailable button. Fully self-contained — composes `@faststore/ui`
 * primitives directly (no ProductDetails OverrideContext), so it can live in a
 * brand-new section.
 */
export function ProductSettings({
  data,
  quantity,
  setQuantity,
  isValidating,
  buyButton: { title: buyButtonTitle, icon: buyButtonIcon },
  notAvailableButton: { title: notAvailableButtonTitle },
  quantitySelector: { useUnitMultiplier = false, invalidQuantityToastLabels },
  taxesConfiguration,
  loadingLabel,
  productTitle,
  productIncentives,
  colorSwatches,
  onSelectSku,
}: ProductSettingsProps) {
  const { pushToast } = useUI();
  const [isInstallmentsModalOpen, setIsInstallmentsModalOpen] = useState(false);

  // Desconto no Pix: cadastro único em Global Sections → PricePix, a mesma
  // fonte que o ProductCard usa — antes era um texto livre digitado no CMS
  // desta seção, que podia divergir do valor global.
  const { percentage: pixPercentage, label: pixLabel } = usePricePix();

  const {
    id,
    sku,
    gtin,
    unitMultiplier,
    variantName,
    brand,
    isVariantOf,
    skuVariants,
    productImages,
    additionalProperty,
    price,
    priceWithTaxes,
    listPrice,
    listPriceWithTaxes,
    seller,
    outOfStock,
    maxInstallment,
    installments,
    productClusters,
  } = data;

  const usePriceWithTaxes = taxesConfiguration?.usePriceWithTaxes;

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

  return (
    <div>
      <ProductHeader data={data} productTitle={productTitle} />
      <div
        className="yv-review-quickreview"
        //@ts-ignore
        value={isVariantOf.productGroupID}
      />
      <WishlistButton productId={id} sku={sku} title={variantName} />
      {!outOfStock && (
        <section data-fs-product-details-values>
          <div data-fs-product-details-values-wrapper>
            <CustomProductPrice
              data-fs-product-details-prices
              taxesConfiguration={taxesConfiguration}
              data={data}
              value={
                (usePriceWithTaxes ? priceWithTaxes : price) *
                (unitMultiplier ?? 1)
              }
              listPrice={
                (usePriceWithTaxes ? listPriceWithTaxes : listPrice) *
                (unitMultiplier ?? 1)
              }
              formatter={useFormattedPrice}
            />

            {usePriceWithTaxes && (
              <UILabel data-fs-product-details-taxes-label>
                {taxesConfiguration?.taxesLabel}
              </UILabel>
            )}

            {maxInstallment && <Installments installment={maxInstallment} />}

            {/* Tags das coleções do produto. O cadastro é único, em
                Global Sections → CollectionTag (ver sdk/globalSections/
                useCollectionTags); aqui só entram as coleções que este produto
                realmente tem. Sem match, não renderiza nada. */}
            <ProductClusters clusters={productClusters} />

            {pixPercentage > 0 && (
              <div data-fs-price-disconter-pix>
                <span>{pixLabel}</span>
              </div>
            )}

            {installments.length > 0 && (
              <button
                type="button"
                className={styles["installments-modal-trigger"]}
                onClick={() => setIsInstallmentsModalOpen(true)}
              >
                Ver opções de parcelamento
              </button>
            )}
          </div>
        </section>
      )}

      <InstallmentsModal
        isOpen={isInstallmentsModalOpen}
        onClose={() => setIsInstallmentsModalOpen(false)}
        installments={installments}
      />

      {colorSwatches && (
        <div
          data-fs-product-details-sku-variations
          className={styles["product-details-sku-variations"]}
        >
          <label className={styles["label-color"]}>Selecione a cor </label>
          <div className={styles["dots-color"]}>{colorSwatches}</div>
        </div>
      )}

      {skuVariants && (
        <SkuVariations skuVariants={skuVariants} onSelectSku={onSelectSku} />
      )}

      {isValidating ? (
        <AddToCartLoadingSkeleton loadingLabel={loadingLabel} />
      ) : outOfStock ? (
        <NotifyMe productId={id} skuId={sku} productName={variantName} />
      ) : (
        <div data-fs-product-actions>
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
                icon: <Icon name="CircleWavyWarning" width={30} height={30} />,
              });
            }}
          />
          <BuyButton
            icon={
              <Icon name={buyButtonIcon.icon} aria-label={buyButtonIcon.alt} />
            }
            {...buyProps}
          >
            {buyButtonTitle}
          </BuyButton>
        </div>
      )}

      {!outOfStock && <ProductIncentives items={productIncentives} />}

      <ShippingSimulation
        productShippingInfo={{
          id,
          quantity,
          seller: seller.identifier,
        }}
      />
    </div>
  );
}
