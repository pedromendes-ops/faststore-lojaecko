import type { DesktopItem } from "../menu.typing";
import type { PromoDayProps } from "../../PromoDay/types";

import { useMenuDesktop } from "../hooks/useMenuDesktop";
import { MenuDesktopItem } from "./MenuDesktopItem";
import { MenuDesktopDrawer } from "./MenuDesktopDrawer";
import { PromoDay } from "../../PromoDay";

import styles from "./MenuDesktop.module.scss";

type MenuDesktopProps = {
  desktopItems: DesktopItem[];
  logo: string;
  promoDay?: PromoDayProps;
};

export const MenuDesktop = ({
  desktopItems,
  logo,
  promoDay,
}: MenuDesktopProps) => {
  const {
    activeIndex,
    isClosing,
    onToggle,
    onSelect,
    onClose,
    onTransitionEnd,
  } = useMenuDesktop();

  return (
    <nav className={styles.nav} aria-label="Menu principal">
      <ul className={styles.navList}>
        {desktopItems.map((item, index) => (
          <MenuDesktopItem
            key={index}
            item={item}
            isActive={activeIndex === index}
            onToggle={() => onToggle(index)}
          />
        ))}
      </ul>

      {promoDay && (
        <PromoDay {...promoDay} />
      )}

      {activeIndex !== null && (
        <>
          <div
            className={styles.backdrop}
            onClick={onClose}
            aria-hidden="true"
            data-fs-menu-desktop-backdrop
          />

          <MenuDesktopDrawer
            desktopItems={desktopItems}
            activeIndex={activeIndex}
            logo={logo}
            isClosing={isClosing}
            onSelect={onSelect}
            onClose={onClose}
            onTransitionEnd={onTransitionEnd}
          />
        </>
      )}
    </nav>
  );
};