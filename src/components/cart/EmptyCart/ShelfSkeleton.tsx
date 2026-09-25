import styles from "./styles.module.scss";

interface ShelfSkeletonProps {
  /** How many placeholder cards to render (enough to fill the visible track). */
  count?: number;
}

/**
 * Loading placeholder for the empty-cart Product Shelf. Mirrors a
 * {@link ProductCard}'s shape (165px image + title + price lines) so the shelf
 * keeps its layout while the products are fetched. Purely decorative.
 */
export function ShelfSkeleton({ count = 4 }: ShelfSkeletonProps) {
  return (
    <div className={styles.track} aria-hidden="true" data-fs-empty-cart-skeleton>
      {Array.from({ length: count }).map((_, index) => (
        <div className={styles.item} key={index}>
          <div className={styles.skeletonImage} />
          <div className={styles.skeletonLine} />
          <div className={`${styles.skeletonLine} ${styles.skeletonLineShort}`} />
          <div className={`${styles.skeletonLine} ${styles.skeletonPrice}`} />
        </div>
      ))}
    </div>
  );
}

export default ShelfSkeleton;
