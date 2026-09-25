import { Modal } from "@faststore/ui";

import { QuickBuyDetails } from "./components/QuickBuyDetails";
import { useQuickBuyProduct } from "./hooks/useQuickBuyProduct";

import styles from "./styles.module.scss";
import { CloseIcon } from "../../icons/close";

export interface QuickBuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Shelf product id, forwarded to the on-demand product query. */
  productId: string;
  /** Buy button label, threaded from the shelf card. */
  buyButtonLabel?: string;
}

/**
 * "Compra rápida" modal.
 *
 * A lightweight PDP-like quick view opened from a shelf {@link ProductCard}. It
 * fetches the full product on demand and renders the same buy box as the PDP
 * (gallery, price, SKU selectors, quantity, add-to-cart).
 *
 * The fetch (see {@link useQuickBuyProduct}) lives in {@link QuickBuyBody}, which
 * is only mounted while the modal is open — so no request fires until the
 * shopper actually asks for the quick view.
 */
export function QuickBuyModal({
  isOpen,
  onClose,
  productId,
  buyButtonLabel,
}: QuickBuyModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onClose}
      className={styles.modal}
      overlayProps={{ className: styles.overlay }}
      aria-label="Compra rápida"
    >
      <button
        type="button"
        className={styles.close}
        aria-label="Fechar"
        onClick={onClose}
      >
        <CloseIcon />
      </button>

      <div className={`${styles.body}`}>
        <QuickBuyBody productId={productId} buyButtonLabel={buyButtonLabel} />
      </div>
    </Modal>
  );
}

interface QuickBuyBodyProps {
  productId: string;
  buyButtonLabel?: string;
}

/**
 * Runs the on-demand product fetch (only mounted while the modal is open) and
 * renders the loading / not-found / ready states.
 */
function QuickBuyBody({ productId, buyButtonLabel }: QuickBuyBodyProps) {
  const { product, isLoading, isNotFound } = useQuickBuyProduct(productId);

  if (isLoading) {
    return (
      <div className={styles.status}>
        <span className={styles.spinner} aria-hidden="true" />
        <p>Carregando produto…</p>
      </div>
    );
  }

  if (isNotFound || !product) {
    return (
      <div className={styles.status}>
        <p>Não foi possível carregar este produto.</p>
      </div>
    );
  }

  return <QuickBuyDetails product={product} buyButtonLabel={buyButtonLabel} />;
}

export default QuickBuyModal;
