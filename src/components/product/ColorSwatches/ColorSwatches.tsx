import { resolveSwatchColor } from "./colors";
import type { SwatchItem } from "./types";

import styles from "./ColorSwatches.module.scss";

interface ColorSwatchesProps {
  items: SwatchItem[];
  /** Product id of the color currently displayed (selection identity). */
  selectedProductId: string;
  /** Called with the target SKU to swap to. */
  onSelect: (sku: string) => void;
  className?: string;
}

/**
 * Presentational color dots. Renders nothing when there are no alternatives
 * (a lone base color). Stops click propagation so it's safe inside a wrapping
 * <Link> (shelf card) and harmless on the PDP.
 */
export function ColorSwatches({
  items,
  selectedProductId,
  onSelect,
  className,
}: ColorSwatchesProps) {
  if (items.length <= 1) {
    return null;
  }

  return (
    <div
      className={`${styles.swatches} ${className ?? ""}`}
      role="group"
      aria-label="Cores disponíveis"
    >
      {items.map((item) => {
        const active = selectedProductId === item.productId;
        return (
          <button
            key={item.productId}
            type="button"
            className={`${styles.colorDot} ${active ? styles.colorDotActive : ""}`}
            style={{
              backgroundColor: resolveSwatchColor(item.colorHex, item.colorName),
            }}
            aria-label={item.colorName || "Cor"}
            aria-pressed={active}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onSelect(item.sku);
            }}
          />
        );
      })}
    </div>
  );
}
