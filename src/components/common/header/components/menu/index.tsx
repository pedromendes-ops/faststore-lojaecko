import { useDevice } from "../../../../hooks/useDevice";
import type { MenuProps } from "./menu.typing";
import type { PromoDayProps } from "../PromoDay/types";

import { MenuDesktop } from "./desktop/MenuDesktop";
import { MenuMobile } from "./mobile/MenuMobile";

type MenuHeaderProps = MenuProps & {
  logo: string;
  promoDay?: PromoDayProps;
};

export const MenuHeader = ({
  desktopItems,
  mobileItems,
  mobileLinkFooter,
  logo,
  promoDay,
}: MenuHeaderProps) => {
  const { isMobile } = useDevice();

  if (isMobile) {
    return (
      <MenuMobile
        mobileItems={mobileItems}
        logo={logo}
        mobileLinkFooter={mobileLinkFooter}
        promoDay={promoDay}
      />
    );
  }

  return (
    <MenuDesktop
      desktopItems={desktopItems}
      logo={logo}
      promoDay={promoDay}
    />
  );
};