import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

// Relative path (not the `src/*` alias) so it resolves to this store's
// useFormattedPrice override, which forces two decimals (e.g. "R$ 89,90"). The
// alias would resolve to the core version (minimumFractionDigits: 0).
import { useFormattedPrice } from "../../../../sdk/product/useFormattedPrice";

import { ShopTheLookModal } from "../ShopTheLookModal";
import type { ShopTheLookKit } from "../types";

import styles from "./styles.module.scss";

interface KitCardProps {
  kit: ShopTheLookKit;
  shopButtonLabel: string;
  modalTitle: string;
  addToCartLabel: string;
  seeMoreLabel: string;
}

/** Libera o scroll do body — o estado "modal aberto" trava em três lugares. */
function unlockBodyScroll() {
  document.body.classList.remove("no-scroll");
  document.body.classList.add("scroll");
  document.body.style.removeProperty("overflow");
}

/** Small price label under each product image in the card grid. */
function ProductPrice({ value }: { value: number }) {
  return <span className={styles.gridPrice}>{useFormattedPrice(value)}</span>;
}

/**
 * A single "look" card: a grid preview of the kit's product images (with price)
 * plus a "Shop the look" button that opens the {@link ShopTheLookModal}.
 */
export function KitCard({
  kit,
  shopButtonLabel,
  modalTitle,
  addToCartLabel,
  seeMoreLabel,
}: KitCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const closeModal = useCallback(() => setIsModalOpen(false), []);

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    document.body.classList.add("no-scroll");
    document.body.classList.remove("scroll");
    document.body.style.overflow = "hidden";

    return unlockBodyScroll;
  }, [isModalOpen]);

  // O modal tem links que navegam para fora (o "guia de medidas" dentro do
  // SkuVariations, o "ver mais"). Só confiar na limpeza do unmount não basta:
  // durante a troca de rota o card pode ser desmontado depois da nova página
  // pintar, e o body chega em /guia-de-medidas ainda com `overflow: hidden`.
  // `routeChangeStart` dispara antes da navegação, então liberamos o scroll na
  // mão ali e fechamos o modal para o estado não voltar aberto no back.
  useEffect(() => {
    const handleRouteChange = () => {
      unlockBodyScroll();
      closeModal();
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => router.events.off("routeChangeStart", handleRouteChange);
  }, [router.events, closeModal]);

  return (
    <div className={styles.card}>
      <div className={styles.grid}>
        {kit.products.map((product) => (
          <div key={product.productId} className={styles.gridItem}>
            <img
              className={styles.gridImage}
              src={product.image}
              alt={product.productName}
              loading="lazy"
            />

            {/* <ProductPrice value={product.price} /> */}
          </div>
        ))}
      </div>

      <button
        type="button"
        className={styles.shopButton}
        onClick={() => setIsModalOpen(true)}
      >
        {shopButtonLabel}
      </button>

      <ShopTheLookModal
        isOpen={isModalOpen}
        onClose={closeModal}
        kit={kit}
        modalTitle={modalTitle}
        addToCartLabel={addToCartLabel}
        seeMoreLabel={seeMoreLabel}
      />
    </div>
  );
}

export default KitCard;
