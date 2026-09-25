import Link from "next/link";
import type { DesktopItem } from "../../menu.typing";
import { CloseIcon } from "../../../../header.icons";
import { MenuDesktopDropdown } from "../MenuDesktopDropdown";
import styles from "./styles.module.scss";
import { MenuDesktopCategories } from "../MenuDesktopCategories";

type MenuDesktopDrawerProps = {
  desktopItems: DesktopItem[];
  activeIndex: number;
  logo: string;
  isClosing: boolean;
  onSelect: (index: number) => void;
  onClose: () => void;
  onTransitionEnd: () => void;
};

export const MenuDesktopDrawer = ({
  desktopItems,
  activeIndex,
  logo,
  isClosing,
  onSelect,
  onClose,
  onTransitionEnd,
}: MenuDesktopDrawerProps) => {
  const activeItem = desktopItems[activeIndex];

  return (
    <div
      className={`${styles.drawer} ${isClosing ? styles.closing : styles.open}`}
      onAnimationEnd={onTransitionEnd}
      data-fs-menu-desktop-drawer
    >
      <div className={styles.drawerHeader}>
        <img src={logo} alt="Logo" className={styles.logo} />

        <nav className={styles.drawerNav}>
          {desktopItems.map((item, index) =>
            item.columns?.length > 0 ? (
              <button
                key={index}
                className={`${styles.drawerNavItem} ${
                  index === activeIndex ? styles.drawerNavItemActive : ""
                }`}
                onClick={() => onSelect(index)}
              >
                {item.title}
              </button>
            ) : (
              <Link
                key={index}
                href={item.href || "#"}
                className={styles.drawerNavItem}
                onClick={onClose}
              >
                {item.title}
              </Link>
            ),
          )}
        </nav>

        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Fechar menu"
        >
          <CloseIcon />
        </button>
      </div>

      <div className={styles.drawerContent}>
        <MenuDesktopCategories categorias={activeItem?.categorias ?? []} />
        {activeItem?.columns?.length > 0 && (
          <MenuDesktopDropdown columns={activeItem.columns} />
        )}
      </div>
    </div>
  );
};
