import { SlideOver } from "@faststore/ui";
import Link from "next/link";
import type { MobileSubMenu, MobileTopItem } from "../../menu.typing";
import { ArrowUpIcon } from "../../../../header.icons";
import { MenuMobileDrawerHeader } from "../MenuMobileDrawerHeader";
import styles from "./styles.module.scss";

type MenuMobileCategoryDrawerProps = {
  item: MobileTopItem | null;
  fade: "in" | "out";
  isOpen: boolean;
  onClose: () => void;
  onTransitionEnd: () => void;
  onOpenSubMenu: (subMenu: MobileSubMenu) => void;
};

export const MenuMobileCategoryDrawer = ({
  item,
  fade,
  isOpen,
  onClose,
  onTransitionEnd,
  onOpenSubMenu,
}: MenuMobileCategoryDrawerProps) => {
  if (!item) return null;

  return (
    <SlideOver
      fade={fade}
      onDismiss={onClose}
      onTransitionEnd={onTransitionEnd}
      isOpen={isOpen}
      size="partial"
      direction="leftSide"
      overlayProps={{ className: "section section-organization-drawer" }}
    >
      <MenuMobileDrawerHeader title={item.title} onBack={onClose} />

      <div className={styles.categoryDrawerContent}>
        {item.categorias && item.categorias.length > 0 && (
          <div className={styles.categorias}>
            {item.categorias.map((cat, i) => (
              <Link
                key={i}
                href={cat.link || "#"}
                className={styles.categoriaItem}
              >
                {cat.icon && (
                  <img
                    src={cat.icon}
                    alt={cat.text}
                    width={20}
                    height={20}
                    loading="lazy"
                  />
                )}
                <span>{cat.text}</span>
              </Link>
            ))}
          </div>
        )}

        {item.subMenus && item.subMenus.length > 0 && (
          <ul className={styles.subMenuTriggerList}>
            {item.subMenus.map((subMenu, i) => (
              <li key={i}>
                <button
                  className={styles.subMenuTrigger}
                  onClick={() => onOpenSubMenu(subMenu)}
                  aria-haspopup="true"
                >
                  <span className={styles.subMenuTriggerText}>
                    {subMenu.title}
                  </span>
                  <span className={styles.chevron}>
                    <ArrowUpIcon width={16} height={16} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {item.items.length > 0 && (
          <ul className={styles.directLinksList}>
            {item.items.map((direct, i) => (
              <li key={i}>
                <Link
                  href={direct.link || "#"}
                  target={direct.newTab ? "_blank" : "_self"}
                  rel={direct.newTab ? "noopener noreferrer" : undefined}
                  className={styles.directLink}
                >
                  {direct.text}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </SlideOver>
  );
};
