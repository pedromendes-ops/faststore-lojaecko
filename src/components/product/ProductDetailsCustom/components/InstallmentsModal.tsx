import { Icon, Modal } from "@faststore/ui";

// Relative path (not the `src/*` alias) so it resolves to this store's
// usePriceFormatter override, which forces two decimals (e.g. "R$ 89,90"). The
// alias would resolve to the core version (minimumFractionDigits: 0).
import { usePriceFormatter } from "../../../../sdk/product/useFormattedPrice";

import type { Installment } from "../hooks/useProductDetailsData";
import styles from "./InstallmentsModal.module.scss";

export interface InstallmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  installments: Installment[];
}

const ACCEPTED_CARDS = [
  {
    name: "Visa",
    src: "https://lojalevis.vtexassets.com/assets/vtex/assets-builder/lojalevis.store/2.6.11/icons/installments-modal-card-visa___a627fb76d67db45d3110f745589869b6.svg",
  },
  {
    name: "Mastercard",
    src: "https://lojalevis.vtexassets.com/assets/vtex/assets-builder/lojalevis.store/2.6.11/icons/installments-modal-card-mastercard___601c73c1d939455cb6d1bccf5942d2f9.svg",
  },
  {
    name: "Elo",
    src: "https://lojalevis.vtexassets.com/assets/vtex/assets-builder/lojalevis.store/2.6.11/icons/installments-modal-card-elo___2c738da983cee2e0fc77ca2c27f590ea.svg",
  },
  {
    name: "Pix",
    src: "https://lojalevis.vtexassets.com/assets/vtex/assets-builder/lojalevis.store/2.6.11/icons/installments-modal-card-pix___897da37a10968068c95688da11b4a87b.svg",
  },
  {
    name: "American Express",
    src: "https://lojalevis.vtexassets.com/assets/vtex/assets-builder/lojalevis.store/2.6.11/icons/installments-modal-card-amex___1c284704e9e3c339cfbaadcf2146967f.svg",
  },
];

/**
 * "Opções de Parcelamento" modal: lists every available installment plan for
 * the product (one row per installment count) and the accepted card brands.
 * Self-contained — uses the `@faststore/ui` Modal only for the portal, overlay
 * and focus trap; all visuals are styled locally.
 */
export function InstallmentsModal({
  isOpen,
  onClose,
  installments,
}: InstallmentsModalProps) {
  const formatPrice = usePriceFormatter({ decimals: true });

  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onClose}
      className={styles.modal}
      overlayProps={{ className: styles.overlay }}
      aria-label="Opções de Parcelamento"
    >
      <div className={styles.header}>
        <h2 className={styles.title}>Opções de Parcelamento</h2>
        <button
          type="button"
          className={styles.close}
          aria-label="Fechar"
          onClick={onClose}
        >
          <Icon name="X" width={24} height={24} />
        </button>
      </div>

      <div className={styles.body}>
        <div className={styles.tableHead}>
          <span>Parcelas</span>
          <span>Total:</span>
        </div>

        <ul className={styles.list}>
          {installments.map((installment) => (
            <li key={installment.installmentNumber} className={styles.row}>
              <span>
                {installment.installmentNumber} x{" "}
                {installment.installmentInterest === 0
                  ? "sem juros"
                  : "com juros"}
              </span>
              <span>{formatPrice(installment.installmentValue)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.footer}>
        <p className={styles.cardsTitle}>Cartões Aceitos:</p>
        <div className={styles.cards}>
          {ACCEPTED_CARDS.map((card) => (
            <img
              key={card.name}
              src={card.src}
              alt={card.name}
              loading="lazy"
            />
          ))}
        </div>
        <p className={styles.note}>
          As compras podem ser parceladas nos cartões de crédito em até 10 vezes
          com parcela mínima de R$ 50,00
        </p>
        <p className={styles.disclaimer}>
          *Para financiamento com juros de 2.29% a.m. + IOF a.m. - CET máximo de
          31.21% a.a.
        </p>
      </div>
    </Modal>
  );
}
