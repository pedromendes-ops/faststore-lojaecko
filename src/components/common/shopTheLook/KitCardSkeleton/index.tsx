import styles from "./styles.module.scss";

/**
 * Placeholder that mirrors a {@link KitCard}'s layout (2×2 image grid + button)
 * while the Shop The Look kits are being fetched. Purely decorative.
 */
export function KitCardSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.grid}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={styles.gridImage} />
        ))}
      </div>
      <div className={styles.button} />
    </div>
  );
}

export default KitCardSkeleton;
