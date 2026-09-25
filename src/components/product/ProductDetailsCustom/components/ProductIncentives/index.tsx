import styles from "./styles.module.scss";

export interface ProductIncentiveItem {
  text: string;
  /** Icon image uploaded via the CMS (media-gallery widget). */
  imageUrl: string;
  alt?: string;
}

export interface ProductIncentivesProps {
  items?: ProductIncentiveItem[];
}

/**
 * "Selos"/incentives shown below the buy button (e.g. "Frete grátis acima de
 * R$699", "40% de Cashback", "5% OFF no PIX"). Content is CMS-editable through
 * the ProductDetailsCustom section (`productIncentives`): each item has a text
 * and an uploaded icon image. Renders 1–3 items.
 */
export function ProductIncentives({ items }: ProductIncentivesProps) {
  if (!items?.length) {
    return null;
  }

  return (
    <ul data-fs-product-incentives className={styles.incentives}>
      {items.slice(0, 3).map((item, index) => (
        <li
          data-fs-product-incentive
          className={styles.incentive}
          key={`${item.text}-${index}`}
        >
          {item.imageUrl && (
            <span data-fs-product-incentive-icon className={styles.icon}>
              <img src={item.imageUrl} alt={item.alt ?? ""} loading="lazy" />
            </span>
          )}
          <span data-fs-product-incentive-text className={styles.text}>
            {item.text}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default ProductIncentives;
