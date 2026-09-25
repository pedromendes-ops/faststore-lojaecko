import { useState, useCallback, useEffect } from "react";
import { useFadeEffect } from "@faststore/ui";
import type { MobileSubMenu, MobileTopItem } from "../menu.typing";

export const useMenuMobile = () => {
  // ─── Main drawer (level 1) ───────────────────────────────────────────────
  const [isMainOpen, setIsMainOpen] = useState(false);
  const { fade: mainFade, fadeIn: mainFadeIn, fadeOut: mainFadeOut } = useFadeEffect();

  const openMain = useCallback(() => {
    setIsMainOpen(true);
    mainFadeIn();
  }, [mainFadeIn]);

  const closeMain = useCallback(() => {
    mainFadeOut();
  }, [mainFadeOut]);

  const onMainTransitionEnd = useCallback(() => {
    if (mainFade === "out") {
      setIsMainOpen(false);
      // Closing the whole menu resets any deeper navigation underneath it.
      setIsCategoryOpen(false);
      setActiveItem(null);
      setIsSubMenuOpen(false);
      setActiveSubMenu(null);
    }
  }, [mainFade]);

  // ─── Category drawer (level 2) ───────────────────────────────────────────
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<MobileTopItem | null>(null);
  const {
    fade: categoryFade,
    fadeIn: categoryFadeIn,
    fadeOut: categoryFadeOut,
  } = useFadeEffect();

  const openCategory = useCallback(
    (item: MobileTopItem) => {
      if (!item.subMenus?.length && !item.items?.length) return;
      setActiveItem(item);
      setIsCategoryOpen(true);
      categoryFadeIn();
    },
    [categoryFadeIn],
  );

  const closeCategory = useCallback(() => {
    categoryFadeOut();
  }, [categoryFadeOut]);

  const onCategoryTransitionEnd = useCallback(() => {
    if (categoryFade === "out") {
      setIsCategoryOpen(false);
      setActiveItem(null);
    }
  }, [categoryFade]);

  // ─── Submenu drawer (level 3) ────────────────────────────────────────────
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<MobileSubMenu | null>(null);
  const {
    fade: subMenuFade,
    fadeIn: subMenuFadeIn,
    fadeOut: subMenuFadeOut,
  } = useFadeEffect();

  const openSubMenu = useCallback(
    (subMenu: MobileSubMenu) => {
      setActiveSubMenu(subMenu);
      setIsSubMenuOpen(true);
      subMenuFadeIn();
    },
    [subMenuFadeIn],
  );

  const closeSubMenu = useCallback(() => {
    subMenuFadeOut();
  }, [subMenuFadeOut]);

  const onSubMenuTransitionEnd = useCallback(() => {
    if (subMenuFade === "out") {
      setIsSubMenuOpen(false);
      setActiveSubMenu(null);
    }
  }, [subMenuFade]);

  // ─── Body scroll lock ─────────────────────────────────────────────────────
  useEffect(() => {
    if (isMainOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [isMainOpen]);

  return {
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
  };
};
