// Relative import: Slider is a store customization, so it isn't reachable
// through the `src/*` alias (which only resolves core components).
import { Slider } from "../../ui/Slider";

import { KitCard } from "./KitCard";
import { KitCardSkeleton } from "./KitCardSkeleton";
import { useShopTheLook } from "./useShopTheLook";
import type { ShopTheLookProps } from "./types";

import styles from "./styles.module.scss";

/**
 * "Shop the look" section: renders the store's curated looks (kits) as a slider
 * of cards. Each card previews the kit's products and opens a modal to add them
 * to the cart. All data is fetched through the store's GraphQL layer
 * (see {@link useShopTheLook}) — the API is never called from the browser.
 */
export const ShopTheLook = ({
  title,
  shopButtonLabel = "Shop the look",
  modalTitle = "Selecione o seu fit",
  addToCartLabel = "Adicionar ao carrinho",
  seeMoreLabel = "Ver mais",
  marginTopSection = "0",
  sectionLabel = "",
  active = true,
}: ShopTheLookProps) => {
  const { collections, isLoading } = useShopTheLook();

  // The kits are fetched client-side, so the section would otherwise pop in with
  // no feedback (it can take a few seconds). Render a card skeleton grid until
  // the data arrives.
  if (isLoading) {
    return (
      <section
        aria-label={sectionLabel || undefined}
        aria-busy="true"
        className={styles.section}
        style={{ marginTop: `${marginTopSection}px` }}
      >
        <div className="wrap section">
          <div className="container">
            <div className={styles.collection}>
              <div className={styles.titleSkeleton} aria-hidden="true" />
              <div className={styles.skeletonRow} aria-hidden="true">
                {Array.from({ length: 4 }).map((_, index) => (
                  <KitCardSkeleton key={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!active) return null;

  if (collections.length === 0) {
    return null;
  }

  return (
    <section
      aria-label={sectionLabel || undefined}
      className={`${styles.sectionLooks} ${styles.section}`}
    >
      <div className="wrap">
        <div className="container">
          {collections.map((collection, index) => {
            if (collection.kits.length === 0) {
              return null;
            }

            return (
              <div
                key={`${collection.title}-${index}`}
                className={styles.collection}
              >
                <h2 className={styles.sectionTitle}>
                  {title || collection.title}
                </h2>

                <Slider
                  itemsPerPage={{ desktop: 4, mobile: 1 }}
                  gap={16}
                  showArrows="desktop"
                  showDots="mobile"
                  aria-label={title || collection.title}
                >
                  {collection.kits.map((kit, kitIndex) => (
                    <KitCard
                      key={`${kit.name}-${kitIndex}`}
                      kit={kit}
                      shopButtonLabel={shopButtonLabel}
                      modalTitle={modalTitle}
                      addToCartLabel={addToCartLabel}
                      seeMoreLabel={seeMoreLabel}
                    />
                  ))}
                </Slider>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ShopTheLook;
