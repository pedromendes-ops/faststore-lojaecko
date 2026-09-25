//import ProductDescription from "src/components/ui/ProductDescription/ProductDescription";

import type { DescriptionProductProps } from "../../../DescriptionProduct/types";

export interface DescriptionPanelProps {
  description: string;
  config: DescriptionProductProps["productDescription"];
}

/**
 * Product description accordion. Reuses the core `ProductDescription` (which is
 * built only on `@faststore/ui` Accordion primitives, so it is safe to use
 * outside the ProductDetails OverrideContext).
 */
export function DescriptionPanel({
  description,
  config: { title },
}: DescriptionPanelProps) {
  return (
    <div>
      <strong data-fs-description-panel-title>{title}</strong>
      <div
        data-fs-product-details-description-content
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
}
