import React, { useEffect } from "react";
import {
  Navbar,
  NavbarHeader,
  NavbarRow,
  NavbarButtons,
  useScrollDirection,
  LinkButton,
} from "@faststore/ui";
import Link from "next/link";
import CartToggle from "src/components/cart/CartToggle";

import { SearchButton } from "./search";
import { AwinTracking } from "./AwinTracking";
// Use the store's own CartSidebar clone (customized minicart footer), not the
// core one. The bare `src/components/cart/CartSidebar` alias resolves to
// @faststore/core; the relative path points to our clone in this project.
import CartSidebar from "../../cart/CartSidebar";
import type { CartSidebarProps } from "../../cart/CartSidebar";
import { MenuHeader } from "./components/menu";
import { StarIcon, UserIcon } from "./header.icons";
// Sincroniza a política comercial (sales channel) com a price table de
// funcionário do vtex_segment; headless, montado aqui por rodar em toda página.
import { EmployeeDiscount } from "../employeeDiscount";

import type { PromoDayProps } from "./components/PromoDay/types";
import styles from "./styles.module.scss";
import type { MenuProps } from "./components/menu/menu.typing";


type HeaderCustomProps = {
  menu: MenuProps;
  logo: string;
  promoDay?: PromoDayProps;
  // Empty-cart config (message + the Product Shelf shown when the cart is
  // empty). Edited in the CMS on this Header section because VTEX has no
  // editable "cart" page; it flows Header -> CartSidebar -> EmptyCart.
  emptyCart?: CartSidebarProps["emptyCart"];
  // Minicart progress bar config (free-shipping / gift ruler). Same reason as
  // emptyCart: edited on the Header section, flows Header -> CartSidebar ->
  // RulerMinicart.
  rulerMinicart?: CartSidebarProps["rulerMinicart"];
};

export const HeaderCustom = ({
  menu,
  logo,
  promoDay,
  emptyCart,
  rulerMinicart,
}: HeaderCustomProps) => {
  const scrollDirection = useScrollDirection();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        document.body.classList.add("scroll");
      } else {
        document.body.classList.remove("scroll");
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.classList.remove("scroll");
    };
  }, []);

  return (
    <>
      <AwinTracking />
      <EmployeeDiscount />      
      <div data-fs-header-wrapper>
        <div className="wrap">
          <div className="container">
            <Navbar scrollDirection={scrollDirection}>
              <NavbarHeader data-fs-header-custom>
                <NavbarRow>
                  <div className={styles["menu-header"]}>
                    <MenuHeader
                      desktopItems={menu.desktopItems ?? []}
                      mobileItems={menu.mobileItems ?? []}
                      logo={logo}
                      promoDay={promoDay}
                      mobileLinkFooter={menu.mobileLinkFooter}
                    />                    
                  </div>
                  <Link href="/" className="fs-navbar-logo">
                    <img
                      src={logo}
                      alt="Logo"
                      width={78}
                      height={32}
                      className={styles["logo-image"]}
                    />
                  </Link>
                  <NavbarButtons searchExpanded={false}>
                    <SearchButton />

                    <LinkButton
                      href="#"
                      variant="tertiary"
                      data-fs-start-icon="true"
                    >
                      <StarIcon />
                    </LinkButton>
                    <CartToggle icon={"ShoppingCart"} alt="Cart Toggle" />
                  </NavbarButtons>
                </NavbarRow>
              </NavbarHeader>
            </Navbar>
          </div>
        </div>
      </div>
      <CartSidebar
        title="MINHA SACOLA"
        emptyCart={emptyCart}
        rulerMinicart={rulerMinicart}
        checkoutButton={{
          label: "Finalizar Compra",
          loadingLabel: "Finalizando Compra...",
          icon: {
            icon: "ArrowRight",
            alt: "Finalizar Compra",
          },
        }}
        quantitySelector={{
          useUnitMultiplier: true,
        }}
        alert={{
          icon: {
            icon: "Truck",
            alt: "Carrinho de Compras",
          },
          text: "Você tem itens no seu carrinho",
        }}
      />
    </>
  );
};
