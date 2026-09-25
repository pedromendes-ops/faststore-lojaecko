import { SROnly } from "@faststore/ui";

import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import type { ProductDetailsCustomProps } from "../types";
import type { ProductDetailsData } from "../hooks/useProductDetailsData";
import { DiscountBadge } from "./DiscountBadge";

export type PriceVariant =
  | "selling"
  | "listing"
  | "spot"
  | "savings"
  | "installment";

export type PriceFormatter = (
  price: number,
  variant: PriceVariant,
) => ReactNode;

interface PriceProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  testId?: string;
  as?: ElementType;
  value: number;
  formatter?: PriceFormatter;
  variant?: PriceVariant;
  SRText?: string;
}

/**
 * Local copy of the `@faststore/ui` Price atom. Kept inline so the whole price
 * markup of {@link CustomProductPrice} is editable from inside this section.
 * Preserves the `data-fs-price*` hooks so the theme's Price styles still apply.
 */
function Price({
  value,
  as: Component = "span",
  variant = "selling",
  testId = "fs-price",
  formatter = (price) => price,
  SRText,
  ...otherProps
}: PriceProps) {
  const formattedPrice = formatter(value, variant);

  return (
    <Component
      data-fs-price
      data-fs-price-variant={variant}
      data-testid={testId}
      {...otherProps}
    >
      {SRText && <SROnly text={SRText} />}
      {formattedPrice}
    </Component>
  );
}

export interface CustomProductPriceProps
  extends HTMLAttributes<HTMLDivElement> {
  data: ProductDetailsData;
  /** Product's raw (selling) price value. */
  value: number;
  /** Product's listing (original) price. */
  listPrice: number;
  /** Formatter that transforms the raw price value before rendering. */
  formatter?: PriceFormatter;
  /** ID for testing tools. */
  testId?: string;
  taxesConfiguration?: ProductDetailsCustomProps["taxesConfiguration"];
}

/**
 * Local, fully editable copy of the `@faststore/ui` ProductPrice molecule,
 * scoped to ProductDetailsCustom. Renders the listing price (struck through)
 * plus the selling price, or just the selling price when there's no discount.
 * Behaves identically to the original — edit the markup/classes freely here.
 */
const CustomProductPrice = forwardRef<HTMLDivElement, CustomProductPriceProps>(
  function CustomProductPrice(
    {
      testId = "fs-product-price",
      value,
      listPrice,
      formatter,
      data,
      taxesConfiguration,
      ...otherProps
    },
    ref,
  ) {
    const listingPrice = listPrice ?? 0;
    const sellingPrice = value ?? 0;
    const hasDiscount = sellingPrice !== listingPrice && listingPrice !== 0;
    const { listPriceWithTaxes, lowPrice, lowPriceWithTaxes } = data;

    const usePriceWithTaxes = taxesConfiguration?.usePriceWithTaxes;

    return (
      <div ref={ref} data-fs-product-price data-testid={testId} {...otherProps}>
        {hasDiscount && (
          <div data-product-list-price>
            <Price
              value={listingPrice}
              formatter={formatter}
              testId="list-price"
              data-value={listingPrice}
              variant="listing"
              SRText="Original price:"
            />
          </div>
        )}

        <div data-product-spot-price>
          <Price
            value={sellingPrice}
            formatter={formatter}
            testId="price"
            data-value={sellingPrice}
            variant="spot"
            SRText="Price:"
          />
          <DiscountBadge
            size={"small"}
            listPrice={usePriceWithTaxes ? listPriceWithTaxes : listPrice}
            spotPrice={usePriceWithTaxes ? lowPriceWithTaxes : lowPrice}
          />
        </div>
      </div>
    );
  },
);

export default CustomProductPrice;
