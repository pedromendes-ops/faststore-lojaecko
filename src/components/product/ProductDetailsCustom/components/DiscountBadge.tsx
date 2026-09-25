import { Badge } from "@faststore/ui";
import type { BadgeProps } from "@faststore/ui";

export interface DiscountBadgeProps
  extends Omit<BadgeProps, "variant" | "counter" | "aria-label"> {
  testId?: string;
  /** Price without discount applied. */
  listPrice: number;
  /** Current price with discount applied. */
  spotPrice: number;
  /** Limit percentage to consider a low discount. */
  thresholdLow?: number;
  /** Limit percentage to consider a high discount. */
  thresholdHigh?: number;
}

/**
 * Local clone of `@faststore/ui`'s `DiscountBadge`. That component hardcodes an
 * "% off" suffix; this copy renders just the percentage ("{discountPercent}%").
 *
 * `DiscountBadge` is only an overridable slot inside the *native* ProductDetails
 * section (via `getOverriddenSection`) — ProductDetailsCustom composes
 * `@faststore/ui` primitives directly and isn't wrapped in that override
 * context, so there's no override hook to change this text. Cloning is the only
 * way to edit the copy for this custom section.
 */
export function DiscountBadge({
  listPrice,
  spotPrice,
  thresholdLow = 15,
  thresholdHigh = 40,
  size,
  testId = "fs-discount-badge",
}: DiscountBadgeProps) {
  const discountPercent = Math.round(
    ((listPrice - spotPrice) * 100) / listPrice,
  );

  if (discountPercent === 0) {
    return null;
  }
  if (spotPrice === listPrice || !spotPrice) {
    return null;
  }

  const discountVariant =
    discountPercent <= thresholdLow
      ? "low"
      : discountPercent <= thresholdHigh
      ? "medium"
      : "high";

  return (
    <Badge
      data-fs-discount-badge
      data-fs-discount-badge-variant={discountVariant}
      size={size}
      data-testid={testId}
    >
      {discountPercent}%
    </Badge>
  );
}

export default DiscountBadge;
