import { ArrowUpIcon } from "../../../../header.icons";
import { CloseXIcon } from "../icons/closeX";
import styles from "./styles.module.scss";

type MenuMobileDrawerHeaderProps = {
  title: string;
  onBack: () => void;
};

export const MenuMobileDrawerHeader = ({
  title,
  onBack,
}: MenuMobileDrawerHeaderProps) => (
  <div className={styles.subHeaderContainer}>
    <div className={styles.subHeader}>
      <button className={styles.backBtn} onClick={onBack} aria-label="Voltar">
        <span className={styles.backIcon}>
          <ArrowUpIcon width={20} height={20} />
        </span>
      </button>
      <span className={styles.subHeaderTitle}>{title}</span>
    </div>
    <div>
      <button className={styles.closeBtn} onClick={onBack} aria-label="Fechar">
        <CloseXIcon />
      </button>
    </div>
  </div>
);
