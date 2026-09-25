import { ProductTitle } from "@faststore/ui";

import type { ProductDetailsData } from "../hooks/useProductDetailsData";
import type { ProductDetailsCustomProps } from "../types";

export interface ProductHeaderProps {
  data: ProductDetailsData;
  productTitle: ProductDetailsCustomProps["productTitle"];
  taxesConfiguration?: ProductDetailsCustomProps["taxesConfiguration"];
}

/**
 * PDP heading: product name (h1), an optional discount badge and the optional
 * reference number. Pure presentation driven by CMS flags.
 */
export function ProductHeader({
  data,
  productTitle: { refNumber: showRefNumber },
}: ProductHeaderProps) {
  const { name, productId } = data;

  return (
    <header data-fs-product-details-title data-fs-product-details-section>
      <ProductTitle
        title={<h1>{name}</h1>}
        refNumber={showRefNumber ? productId : undefined}
      />
    </header>
  );
}
