import { useState } from "react";

import { Icon, Modal } from "@faststore/ui";

import { ModalProduct } from "../ModalProduct";
import type { ShopTheLookKit } from "../types";

import styles from "./styles.module.scss";

interface ShopTheLookModalProps {
  isOpen: boolean;
  onClose: () => void;
  kit: ShopTheLookKit;
  modalTitle: string;
  addToCartLabel: string;
  seeMoreLabel: string;
}

/**
 * Opened from a kit's "Shop the look" button. Lists every product in the kit as
 * an accordion of compact buy boxes (see {@link ModalProduct}).
 *
 * Each product's header (image, name, price) comes straight from the kit data,
 * so the list renders instantly. Only the expanded product mounts its on-demand
 * product query (for colors/sizes/cart) — so opening the modal never fires a
 * request per product. The first product starts expanded.
 */
export function ShopTheLookModal({
  isOpen,
  onClose,
  kit,
  modalTitle,
  addToCartLabel,
  seeMoreLabel,
}: ShopTheLookModalProps) {
  // Index of the expanded product. First one open by default; -1 = all closed.
  const [openIndex, setOpenIndex] = useState(0);

  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onClose}
      className={styles.modal}
      overlayProps={{ className: styles.overlay }}
      aria-label={`${modalTitle}: ${kit.name}`}
    >
      <header className={styles.header}>
        <h2 className={styles.title}>{modalTitle}</h2>
        <button
          type="button"
          className={styles.close}
          aria-label="Fechar"
          onClick={onClose}
        >
          <Icon name="X" width={24} height={24} />
        </button>
      </header>

      <div className={styles.products}>
        {kit.products.map((product, index) => (
          <ModalProduct
            key={product.productId}
            product={product}
            isExpanded={openIndex === index}
            onToggle={() =>
              setOpenIndex((current) => (current === index ? -1 : index))
            }
            addToCartLabel={addToCartLabel}
            seeMoreLabel={seeMoreLabel}
          />
        ))}
      </div>
    </Modal>
  );
}

export default ShopTheLookModal;
