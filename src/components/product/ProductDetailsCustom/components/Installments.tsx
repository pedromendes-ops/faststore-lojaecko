// Relative path (not the `src/*` alias) so it resolves to this store's
// useFormattedPrice override, which forces two decimals (e.g. "R$ 89,90"). The
// alias would resolve to the core version (minimumFractionDigits: 0).
import { useFormattedPrice } from "../../../../sdk/product/useFormattedPrice";

import type { ProductDetailsData } from "../hooks/useProductDetailsData";

export interface InstallmentsProps {
  installment: NonNullable<ProductDetailsData["maxInstallment"]>;
}

/**
 * Renders the highest interest-free installment plan, e.g.
 * "ou 10x de R$ 89,99 sem juros", just below the product price.
 */
export function Installments({ installment }: InstallmentsProps) {
  const formattedValue = useFormattedPrice(installment.installmentValue);

  return (
    <p data-fs-product-details-installments>
      ou {installment.installmentNumber}x de {formattedValue}
    </p>
  );
}
