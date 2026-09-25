import type { ProductIncentiveItem } from "./components/ProductIncentives";

/**
 * CMS-editable props for the fully custom ProductDetails section.
 *
 * Mirrors the subset of the native ProductDetails schema this section supports
 * (title/discount badge, buy button, quantity selector and taxes). Each field
 * maps 1:1 to a property in
 * `cms/faststore/components/cms_component__productdetailscustom.jsonc`.
 *
 * The product description config moved to the standalone DescriptionProduct
 * section.
 */
export interface ProductDetailsCustomProps {
  productTitle: {
    refNumber: boolean;
    discountBadge: {
      showDiscountBadge: boolean;
      size: "big" | "small";
    };
  };
  buyButton: {
    title: string;
    icon: {
      icon: string;
      alt: string;
    };
  };
  notAvailableButton: {
    title: string;
  };
  quantitySelector: {
    useUnitMultiplier?: boolean;
    invalidQuantityToastLabels?: {
      title?: string;
      message?: string;
    };
  };
  taxesConfiguration?: {
    usePriceWithTaxes?: boolean;
    taxesLabel?: string;
  };
  loadingLabel: string;
  /** "Selos"/incentives shown below the buy button (1–3 items). */
  productIncentives?: ProductIncentiveItem[];
}
