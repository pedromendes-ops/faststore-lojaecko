import { SearchButton } from "../../../../search";
import { CloseXIcon } from "../icons/closeX";
import styles from "./styles.module.scss";

type MenuMobileHeaderProps = {
  onClose: () => void;
  logo: string;
};

export const MenuMobileHeader = ({ onClose, logo }: MenuMobileHeaderProps) => {
  return (
    <header
      className={styles.header}
      data-fs-drawer-menu-header="true"
      data-fs-drawer-menu-header-mobile="true"
    >
      <div className={styles.headerContent}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <div className={styles.headerButtons}>
          <SearchButton />
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <CloseXIcon />
          </button>
        </div>
      </div>
    </header>
  );
};
