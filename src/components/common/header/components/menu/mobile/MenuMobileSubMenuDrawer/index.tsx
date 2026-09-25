import { SlideOver } from "@faststore/ui";
import Link from "next/link";
import type { MobileSubMenu } from "../../menu.typing";
import { MenuMobileDrawerHeader } from "../MenuMobileDrawerHeader";
import styles from "./styles.module.scss";

type MenuMobileSubMenuDrawerProps = {
  subMenu: MobileSubMenu | null;
  fade: "in" | "out";
  isOpen: boolean;
  onClose: () => void;
  onTransitionEnd: () => void;
};

export const MenuMobileSubMenuDrawer = ({
  subMenu,
  fade,
  isOpen,
  onClose,
  onTransitionEnd,
}: MenuMobileSubMenuDrawerProps) => {
  if (!subMenu) return null;

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
      <MenuMobileDrawerHeader title={subMenu.title} onBack={onClose} />

      <div className={styles.subMenuDrawerContent}>
        <ul className={styles.subMenuList}>
          {subMenu.items.map((item, index) =>
            item.hasTitle ? (
              <li key={index} className={styles.sectionHeader}>
                {item.text}
              </li>
            ) : (
              <li key={index}>
                <Link href={item.link || "#"} className={styles.subMenuLink}>
                  {item.text}
                </Link>
              </li>
            ),
          )}
        </ul>
      </div>
    </SlideOver>
  );
};
