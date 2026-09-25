import type {
  AddToCartEvent,
  CurrencyCode,
  RemoveFromCartEvent,
} from "@faststore/sdk";
import {
  CartItemImage as UICartItemImage,
  CartItemSummary as UICartItemSummary,
  IconButton,
  ProductPrice,
} from "@faststore/ui";
import { useCallback, useMemo } from "react";

import { Image } from "src/components/ui/Image";
import type { AnalyticsItem } from "src/sdk/analytics/types";
import type { CartItem as ICartItem } from "src/sdk/cart";
import { cartStore } from "src/sdk/cart";
import { useRemoveButton } from "src/sdk/cart/useRemoveButton";
// Relative path (not the `src/*` alias) so it resolves to this store's
// useFormattedPrice override, which forces two decimals (e.g. "R$ 89,90"). The
// alias would resolve to the core version (minimumFractionDigits: 0).
import { useFormattedPrice } from "../../../sdk/product/useFormattedPrice";
import { useSession } from "src/sdk/session";

import styles from "./styles.module.scss";

/**
 * Local clone of the `@faststore/core` cart CartItem, wired into the custom
 * CartSidebar override (imported relatively as `../CartItem`).
 *
 * Unlike core, the markup of the `@faststore/ui` `CartItem` molecule is
 * reproduced inline here (same `data-fs-cart-item-*` hooks, so the theme SCSS
 * in `src/themes/template/minicart.scss` + the core cart-item layout keep
 * applying) so we can swap the `- 1 +` QuantitySelector stepper for a native
 * `<select>` quantity dropdown.
 */

// The cart item (StoreOffer) does not carry available stock, so the dropdown
// caps at a fixed number of options. If the current quantity is already higher
// (e.g. added elsewhere), the range is extended so it stays selectable.
const MAX_QUANTITY_OPTIONS = 10;

function useCartItemEvent() {
  const {
    currency: { code },
  } = useSession();

  const sendCartItemEvent = useCallback(
    (item: Props["item"], quantity: number) => {
      const quantityDelta = quantity - item.quantity;

      import("@faststore/sdk").then(({ sendAnalyticsEvent }) => {
        return sendAnalyticsEvent<
          AddToCartEvent<AnalyticsItem> | RemoveFromCartEvent<AnalyticsItem>
        >({
          name: quantityDelta > 0 ? "add_to_cart" : "remove_from_cart",
          params: {
            currency: code as CurrencyCode,
            // TODO: In the future, we can explore more robust ways of
            // calculating the value (gift items, discounts, etc.).
            value: item.price * Math.abs(quantityDelta),
            items: [
              {
                item_id: item.itemOffered.isVariantOf.productGroupID,
                item_name: item.itemOffered.isVariantOf.name,
                item_brand: item.itemOffered.brand.name,
                item_variant: item.itemOffered.sku,
                quantity: Math.abs(quantityDelta),
                price: item.price,
                discount: item.listPrice - item.price,
                currency: code as CurrencyCode,
                item_variant_name: item.itemOffered.name,
                product_reference_id: item.itemOffered.gtin,
              },
            ],
          },
        });
      });
    },
    [code],
  );

  return useMemo(() => ({ sendCartItemEvent }), [sendCartItemEvent]);
}

interface Props {
  item: ICartItem;
  useUnitMultiplier?: boolean;
  taxesConfiguration?: {
    usePriceWithTaxes?: boolean;
    taxesLabel?: string;
  };
}

function CartItem({
  item,
  useUnitMultiplier = false,
  taxesConfiguration,
}: Props) {
  const btnProps = useRemoveButton(item);

  const { sendCartItemEvent } = useCartItemEvent();

  const onQuantityChange = useCallback(
    (quantity: number) => {
      sendCartItemEvent(item, quantity);

      cartStore.updateItemQuantity(item.id, quantity);
    },
    [item, sendCartItemEvent],
  );

  const skuActiveVariants =
    item?.itemOffered?.isVariantOf?.skuVariants?.activeVariations ?? {};
  const activeVariations = Object.keys(skuActiveVariants).map((key) => ({
    label: key,
    option: skuActiveVariants[key],
  }));

  const price = taxesConfiguration?.usePriceWithTaxes
    ? item.priceWithTaxes
    : item.price;

  const listPrice = taxesConfiguration?.usePriceWithTaxes
    ? item.listPriceWithTaxes
    : item.listPrice;

  const unitMultiplier = item.itemOffered.unitMultiplier ?? 1;

  // Quantity options in units. `item.quantity` is always stored in units, so
  // the option value stays in units; only the label is multiplied when
  // `useUnitMultiplier` is on (mirroring the core QuantitySelector display).
  const maxQuantity = Math.max(MAX_QUANTITY_OPTIONS, item.quantity);
  const quantityOptions = useMemo(
    () => Array.from({ length: maxQuantity }, (_, i) => i + 1),
    [maxQuantity],
  );

  return (
    <article
      className={styles.cartItem}
      data-fs-cart-item="true"
      data-sku={item.itemOffered.sku}
      data-seller={item.seller.identifier}
    >
      <div data-fs-cart-item-content>
        <UICartItemImage>
          <Image
            src={item.itemOffered.image[0].url}
            alt={item.itemOffered.image[0].alternateName}
            width={56}
            height={56}
          />
        </UICartItemImage>
        <div>
          <UICartItemSummary
            title={item.itemOffered.isVariantOf.name}
            activeVariations={activeVariations}
          />
          <div data-fs-cart-item-actions>
            <select
              data-fs-cart-item-quantity
              aria-label="Quantity"
              value={item.quantity}
              onChange={(event) => onQuantityChange(Number(event.target.value))}
            >
              {quantityOptions.map((quantity) => (
                <option key={quantity} value={quantity}>
                  {useUnitMultiplier ? quantity * unitMultiplier : quantity}
                </option>
              ))}
            </select>

            <ProductPrice
              data-fs-cart-item-prices
              listPrice={
                useUnitMultiplier ? listPrice * unitMultiplier : listPrice
              }
              value={price}
              formatter={useFormattedPrice}
            />
          </div>
        </div>
      </div>

      <IconButton
        data-fs-cart-item-remove-button
        icon={
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 4h12M6.5 4V2.5h3V4M12.5 4l-.6 9a1 1 0 0 1-1 1H5.1a1 1 0 0 1-1-1L3.5 4M6.5 7v4M9.5 7v4"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        aria-label="Remove"
        {...btnProps}
      />
    </article>
  );
}

export default CartItem;
