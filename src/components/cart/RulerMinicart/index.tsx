import { useMemo, type ReactNode } from "react";

// Relative path (not the `src/*` alias) so it resolves to this store's
// usePriceFormatter override, which forces two decimals (e.g. "R$ 699,90"). The
// alias would resolve to the core version (minimumFractionDigits: 0).
import { usePriceFormatter } from "../../../sdk/product/useFormattedPrice";

import styles from "./styles.module.scss";

/**
 * FastStore v3 port of the VTEX IO `RulerMinicart` (the minicart "promotion
 * ruler" — a progress bar that shows how much is missing to unlock free
 * shipping or a gift).
 *
 * It is rendered inside the custom CartSidebar footer, above the OrderSummary.
 * Config is edited in the CMS on the HeaderCustom section (VTEX has no editable
 * cart page) and flows down HeaderCustom -> CartSidebar -> RulerMinicart, the
 * same path already used by `emptyCart`.
 *
 * Architectural changes vs the IO original:
 * - No `useState` + `useEffect` mirroring props into state; every value
 *   (reached / remaining / percent) is derived during render from the cart
 *   total, which is the single source of truth.
 * - The three loose text fields (`text01` + <strong> + `text02`) are replaced
 *   by a single templated `progressMessage` with a `{value}` token, so the copy
 *   stays readable in the CMS and the remaining amount is injected in place.
 * - Currency formatting goes through the store's `usePriceFormatter`, so the
 *   locale/currency match the rest of the storefront.
 */

export type RulerMinicartType = "Frete" | "Brinde" | "Disable";

export interface RulerMinicartConfig {
  /**
   * Promotion type. Controls the marker icon (truck / gift) and, when set to
   * `Disable`, hides the bar entirely.
   */
  type?: RulerMinicartType;
  /** Goal to reach, in the store currency unit (reais). e.g. `699.90`. */
  goal?: number;
  /**
   * Message shown while below the goal. Use the `{value}` token where the
   * remaining amount should appear (it is rendered in bold). If the token is
   * missing, the amount is appended at the end.
   */
  progressMessage?: string;
  /** Message shown once the goal is reached. */
  successMessage?: string;
  /** Label for the start of the bar. Defaults to a formatted zero. */
  startLabel?: string;
}

interface Props extends RulerMinicartConfig {
  /** Current cart total, already tax-resolved by CartSidebar. */
  total: number;
}

const VALUE_TOKEN = "{value}";

/** Injects the (bold) remaining amount into a templated message. */
function renderMessage(template: string, value: string): ReactNode {
  const strong = <strong className={styles.value}>{value}</strong>;

  if (!template.includes(VALUE_TOKEN)) {
    return (
      <>
        {template} {strong}
      </>
    );
  }

  const [before, after] = template.split(VALUE_TOKEN);

  return (
    <>
      {before}
      {strong}
      {after}
    </>
  );
}

function RulerMinicart({
  total,
  type = "Frete",
  goal = 699.9,
  progressMessage = "Faltam {value} para ganhar frete grátis",
  successMessage = "Eba! Você ganhou frete grátis 🎉",
  startLabel,
}: Props) {
  const formatPrice = usePriceFormatter();

  const { reached, remaining, percent } = useMemo(() => {
    const safeGoal = goal > 0 ? goal : 0;

    return {
      reached: safeGoal === 0 || total >= safeGoal,
      remaining: Math.max(safeGoal - total, 0),
      percent: safeGoal > 0 ? Math.min((total / safeGoal) * 100, 100) : 100,
    };
  }, [goal, total]);

  // Hidden when disabled or when the cart has no value yet.
  if (type === "Disable" || total <= 0) {
    return null;
  }

  return (
    <div
      className={styles.rulerMinicart}
      data-fs-ruler-minicart
      data-type={type.toLowerCase()}
    >
      {reached ? (
        <p className={styles.successMessage}>{successMessage}</p>
      ) : (
        <>
          <p className={styles.progressMessage}>
            {renderMessage(progressMessage, formatPrice(remaining))}
          </p>

          <div
            className={styles.timeline}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(percent)}
          >
            <span
              className={`${styles.marker} ${
                type === "Brinde" ? styles.markerGift : styles.markerShipping
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className={styles.bar}>
            <span className={styles.valStart}>{startLabel ?? formatPrice(0)}</span>
            <span className={styles.valEnd}>{formatPrice(goal)}</span>
          </div>
        </>
      )}
    </div>
  );
}

export default RulerMinicart;
