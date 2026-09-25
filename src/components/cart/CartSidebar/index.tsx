import dynamic from "next/dynamic";

import type {
  ButtonProps,
  CartSidebarProps as UICartSidebarProps,
} from "@faststore/ui";

import type { CurrencyCode, ViewCartEvent } from "@faststore/sdk";
import { Icon, useFadeEffect, useUI } from "@faststore/ui";
import { type ReactNode, useCallback, useEffect, useMemo } from "react";
import { useCart } from "src/sdk/cart";
import { useCheckoutButton } from "src/sdk/cart/useCheckoutButton";
import { useSession } from "src/sdk/session";

import type { EmptyCartShelfConfig } from "../EmptyCart";
import type { RulerMinicartConfig } from "../RulerMinicart";

// Core scss (loads the @faststore/ui CartSidebar styles + the `.section`
// wrapper). Re-used as-is; the global `section-cart-sidebar` class is kept so
// the theme overrides in src/themes/template/minicart.scss keep applying.
import styles from "src/components/cart/CartSidebar/section.module.scss";

const UIButton = dynamic<ButtonProps>(
  () =>
    import(/* webpackChunkName: "UIButton" */ "@faststore/ui").then(
      (mod) => mod.Button,
    ),
  { ssr: false },
);
const UICartSidebarFooter = dynamic<{ children: ReactNode }>(
  () =>
    import(/* webpackChunkName: "UICartSidebarFooter" */ "@faststore/ui").then(
      (mod) => mod.CartSidebarFooter,
    ),
  { ssr: false },
);
const UICartSidebarList = dynamic<{ children: ReactNode }>(
  () =>
    import(/* webpackChunkName: "UICartSidebarList" */ "@faststore/ui").then(
      (mod) => mod.CartSidebarList,
    ),
  { ssr: false },
);
const UICartSidebar = dynamic<UICartSidebarProps>(
  () =>
    import(/* webpackChunkName: "UICartSidebar" */ "@faststore/ui").then(
      (mod) => mod.CartSidebar,
    ),
  { ssr: false },
);
const EmptyCart = dynamic(
  () => import(/* webpackChunkName: "EmptyCart" */ "../EmptyCart"),
  { ssr: false },
);
const Gift = dynamic(
  () => import(/* webpackChunkName: "Gift" */ "src/components/ui/Gift"),
  { ssr: false },
);
// Local clone of the core CartItem (relative import, so it resolves to the
// customization instead of core) — this is where the line-item customizations
// live (name, SKU selector, etc.).
const CartItem = dynamic(
  () => import(/* webpackChunkName: "CustomCartItem" */ "../CartItem"),
  { ssr: false },
);
// Local clone of the OrderSummary (footer) — this is where the customizations
// live (e.g. subtotal label without the item count).
const OrderSummary = dynamic(
  () => import(/* webpackChunkName: "CustomOrderSummary" */ "../OrderSummary"),
  { ssr: false },
);
// Free-shipping / gift progress bar shown in the footer, above the summary.
// Config flows HeaderCustom -> CartSidebar -> RulerMinicart (same as emptyCart).
const RulerMinicart = dynamic(
  () => import(/* webpackChunkName: "RulerMinicart" */ "../RulerMinicart"),
  { ssr: false },
);

function useViewCartEvent() {
  const {
    currency: { code },
  } = useSession();
  const { items: itemsFromCart, gifts: giftsFromCart, total } = useCart();

  // We need to stringify the items and gifts to avoid circular references
  // when sending the event to the analytics
  const gifts = JSON.stringify(giftsFromCart);
  const items = JSON.stringify(itemsFromCart);

  const sendViewCartEvent = useCallback(() => {
    import("@faststore/sdk").then(({ sendAnalyticsEvent }) => {
      return sendAnalyticsEvent<ViewCartEvent>({
        name: "view_cart",
        params: {
          currency: code as CurrencyCode,
          value: total,
          items: itemsFromCart.concat(giftsFromCart).map((item) => ({
            item_id: item.itemOffered.isVariantOf.productGroupID,
            item_name: item.itemOffered.isVariantOf.name,
            item_brand: item.itemOffered.brand.name,
            item_variant: item.itemOffered.sku,
            quantity: item.quantity,
            price: item.price,
            discount: item.listPrice - item.price,
            currency: code as CurrencyCode,
            item_variant_name: item.itemOffered.name,
            product_reference_id: item.itemOffered.gtin,
          })),
        },
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, gifts, items, total]);

  return useMemo(() => ({ sendViewCartEvent }), [sendViewCartEvent]);
}

export interface CartSidebarProps {
  title: UICartSidebarProps["title"];
  // Required in practice — the CMS CartSidebar config always provides them.
  // (The core types these as optional yet destructures eagerly.)
  alert: {
    icon: {
      icon: string;
      alt: string;
    };
    text: UICartSidebarProps["alertText"];
  };
  emptyCart?: {
    title?: string;
    buttonLabel?: string;
    // Product Shelf shown inside the empty cart. Same config as the native
    // Product Shelf; edited in the CMS via the HeaderCustom section and passed
    // down through HeaderCustom -> CartSidebar -> EmptyCart.
    shelf?: EmptyCartShelfConfig;
  };
  checkoutButton: {
    label: string;
    loadingLabel: string;
    icon: {
      icon: string;
      alt: string;
    };
  };
  quantitySelector: {
    useUnitMultiplier?: boolean;
  };
  taxesConfiguration?: {
    usePriceWithTaxes?: boolean;
    taxesLabel?: string;
  };
  // Free-shipping / gift progress bar (minicart ruler). Optional: when omitted
  // or with `type: "Disable"` the bar is not rendered.
  rulerMinicart?: RulerMinicartConfig;
}

function CartSidebar({
  title,
  alert: {
    icon: { icon: alertIcon, alt: alertIconAlt },
    text: alertText,
  },
  emptyCart,
  checkoutButton: {
    label: checkoutLabel,
    loadingLabel: checkoutLoadingLabel,
    icon: { icon: checkoutButtonIcon, alt: checkoutButtonIconAlt },
  },
  quantitySelector,
  taxesConfiguration,
  rulerMinicart,
}: CartSidebarProps) {
  const btnProps = useCheckoutButton();
  const {
    items,
    gifts,
    totalItems,
    isValidating,
    subTotal,
    total,
    subTotalWithTaxes,
    totalWithTaxes,
  } = useCart({
    useUnitMultiplier: quantitySelector?.useUnitMultiplier ?? false,
  });
  const { cart: displayCart, closeCart } = useUI();
  const { fadeOut } = useFadeEffect();
  const { sendViewCartEvent } = useViewCartEvent();

  const isEmpty = useMemo(() => items.length === 0, [items]);

  useEffect(() => {
    if (!displayCart) {
      return;
    }

    sendViewCartEvent();
  }, [displayCart, sendViewCartEvent]);

  return (
    <>
      {displayCart && (
        <UICartSidebar
          overlayProps={{
            className: `section ${styles.section} section-cart-sidebar`,
          }}
          title={title}
          totalItems={totalItems}
          alertIcon={<Icon name={alertIcon} aria-label={alertIconAlt} />}
          alertText={alertText}
          onClose={fadeOut}
        >
          {/* AQUI */}
          {isEmpty ? (
            <EmptyCart
              title={emptyCart?.title}
              buttonLabel={emptyCart?.buttonLabel}
              shelf={emptyCart?.shelf}
              onDismiss={closeCart}
            />
          ) : (
            <>
              <UICartSidebarList>
                {items.map((item) => (
                  <li key={item.id} data-fs-item-cart>
                    <CartItem
                      item={item}
                      taxesConfiguration={taxesConfiguration}
                      useUnitMultiplier={
                        quantitySelector?.useUnitMultiplier ?? false
                      }
                    />
                  </li>
                ))}
                {gifts.length > 0 && (
                  <>
                    {gifts.map((item) => (
                      <li key={item.id}>
                        <Gift item={item} />
                      </li>
                    ))}
                  </>
                )}
              </UICartSidebarList>

              <UICartSidebarFooter>
                <RulerMinicart
                  total={
                    taxesConfiguration?.usePriceWithTaxes
                      ? totalWithTaxes
                      : total
                  }
                  {...rulerMinicart}
                />
                <OrderSummary
                  subTotal={
                    taxesConfiguration?.usePriceWithTaxes
                      ? subTotalWithTaxes
                      : subTotal
                  }
                  total={
                    taxesConfiguration?.usePriceWithTaxes
                      ? totalWithTaxes
                      : total
                  }
                  includeTaxes={taxesConfiguration?.usePriceWithTaxes}
                  includeTaxesLabel={taxesConfiguration?.taxesLabel}
                  numberOfItems={totalItems}
                  checkoutButton={
                    <UIButton
                      variant="primary"
                      icon={
                        !isValidating && (
                          <Icon
                            name={checkoutButtonIcon}
                            aria-label={checkoutButtonIconAlt}
                            width={18}
                            height={18}
                          />
                        )
                      }
                      iconPosition="right"
                      {...btnProps}
                    >
                      {isValidating ? checkoutLoadingLabel : checkoutLabel}
                    </UIButton>
                  }
                />
              </UICartSidebarFooter>
            </>
          )}
        </UICartSidebar>
      )}
    </>
  );
}

export default CartSidebar;
