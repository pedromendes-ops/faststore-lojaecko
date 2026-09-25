import { SlideOver, Button, Icon } from "@faststore/ui";
import type { MenuProps } from "../menu.typing";
import type { PromoDayProps } from "../../PromoDay/types";

import { useMenuMobile } from "../hooks/useMenuMobile";
import { MenuMobileItem } from "./MenuMobileItem";
import { MenuMobileCategoryDrawer } from "./MenuMobileCategoryDrawer";
import { MenuMobileSubMenuDrawer } from "./MenuMobileSubMenuDrawer";
import { MenuMobileHeader } from "./MenuMobileIHeader";
import { MenuMobileFooter } from "./MenuMobileFooter";
import { PromoDay } from "../../PromoDay";

import styles from "./MenuMobile.module.scss";

type MenuMobileProps = Pick<MenuProps, "mobileItems"> & {
  logo: string;
  mobileLinkFooter: MenuProps["mobileLinkFooter"];
  promoDay?: PromoDayProps;
};

export const MenuMobile = ({
  mobileItems,
  logo,
  mobileLinkFooter,
  promoDay,
}: MenuMobileProps) => {
  const {
    isMainOpen,
    mainFade,
    openMain,
    closeMain,
    onMainTransitionEnd,
    isCategoryOpen,
    categoryFade,
    activeItem,
    openCategory,
    closeCategory,
    onCategoryTransitionEnd,
    isSubMenuOpen,
    subMenuFade,
    activeSubMenu,
    openSubMenu,
    closeSubMenu,
    onSubMenuTransitionEnd,
  } = useMenuMobile();

  return (
    <>
      <Button
        variant="secondary"
        onClick={openMain}
        data-fs-drawer-menu="true"
        icon={<Icon name="List" color="#000" />}
      />

      <SlideOver
        fade={mainFade}
        onDismiss={closeMain}
        onTransitionEnd={onMainTransitionEnd}
        isOpen={isMainOpen}
        size="partial"
        direction="leftSide"
        overlayProps={{
          className: "section section-organization-drawer",
        }}
      >
        <MenuMobileHeader
          onClose={closeMain}
          logo={logo}
        />

        <div className={styles.drawerBody}>
          <div className={styles.drawerContentMenu}>
            <nav className={styles.navList}>
              {mobileItems.map((item, i) => (
                <MenuMobileItem
                  key={i}
                  item={item}
                  onOpenCategory={openCategory}
                />
              ))}

              {promoDay && (
                <PromoDay {...promoDay} />
              )}
            </nav>
          </div>

          <MenuMobileFooter
            mobileLinkFooter={mobileLinkFooter}
          />
        </div>
      </SlideOver>

      <MenuMobileCategoryDrawer
        item={activeItem}
        fade={categoryFade}
        isOpen={isCategoryOpen}
        onClose={closeCategory}
        onTransitionEnd={onCategoryTransitionEnd}
        onOpenSubMenu={openSubMenu}
      />

      <MenuMobileSubMenuDrawer
        subMenu={activeSubMenu}
        fade={subMenuFade}
        isOpen={isSubMenuOpen}
        onClose={closeSubMenu}
        onTransitionEnd={onSubMenuTransitionEnd}
      />
    </>
  );
};