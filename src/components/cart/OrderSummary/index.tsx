import {
  OrderSummary as UIOrderSummary,
  type OrderSummaryProps as UIOrderSummaryProps,
} from "@faststore/ui";
import type { ReactNode } from "react";

// Relative path (not the `src/*` alias) so it resolves to this store's
// useFormattedPrice override, which forces two decimals (e.g. "R$ 89,90"). The
// alias would resolve to the core version (minimumFractionDigits: 0).
import { useFormattedPrice } from "../../../sdk/product/useFormattedPrice";

type OrderSummaryProps = UIOrderSummaryProps & {
  subTotal: number;
  total: number;
  numberOfItems: number;
  checkoutButton?: ReactNode;
};

/**
 * Clone of the core `@faststore/core` cart OrderSummary, registered through the
 * custom CartSidebar override so we can customize the minicart footer
 * (`data-fs-cart-sidebar-footer`) going forward.
 *
 * Customization so far: the subtotal label no longer shows the item count
 * (was `Subtotal (N products)`, now just `Subtotal`).
 */
function OrderSummary({
  subTotal,
  total,
  // Kept available for future customization even though the label no longer
  // uses it.
  numberOfItems,
  checkoutButton,
  ...otherProps
}: OrderSummaryProps) {
  const discount = subTotal - total;
  const formattedDiscount = useFormattedPrice(discount);

  return (
    <>
      <UIOrderSummary
        subtotalLabel="Subtotal"
        discountLabel="Descontos"
        subtotalValue={useFormattedPrice(subTotal)}
        discountValue={discount > 0 ? `-${formattedDiscount}` : undefined}
        totalValue={useFormattedPrice(total)}
        {...otherProps}
      />
      {checkoutButton}
    </>
  );
}

export default OrderSummary;
