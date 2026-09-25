// ─── Desktop ──────────────────────────────────────────────────────────────────

export type SubCategoria = {
  link: string;
  text: string;
  openNewTab: boolean;
  destaque?: boolean;
};

export type Department = {
  title: string;
  subCategoria: SubCategoria[];
};

export type Column = {
  departments: Department[];
  image?: {
    imageUrl: string;
    alt: string;
    href: string;
  };
};

export type DesktopItem = {
  title: string;
  href?: string;
  columns: Column[];
  /** Icon categories shown in this item's own mega-menu drawer, alongside its columns. */
  categorias?: Categoria[];
  isRed: boolean;
  isBlue: boolean;
};

// ─── Mobile ───────────────────────────────────────────────────────────────────

export type MobileSubMenuItem = {
  hasTitle: boolean;
  text: string;
  link?: string;
};

export type MobileSubMenu = {
  title: string;
  items: MobileSubMenuItem[];
};

export type MobileDirectItem = {
  text: string;
  link: string;
  newTab: boolean;
};

export type MobileTopItem = {
  title: string;
  href?: string;
  subMenus?: MobileSubMenu[];
  items: MobileDirectItem[];
  isRed: boolean;
  isBlue: boolean;
  /** Icon categories shown in this item's own category drawer. */
  categorias?: Categoria[];
};

export type MobileLinkFooter = {
  text: string;
  link: string;
  iconUrl: string;
  alt: string;
};

// ─── Shared ───────────────────────────────────────────────────────────────────

export type Categoria = {
  icon: string;
  text: string;
  link: string;
};

export type MenuProps = {
  desktopItems: DesktopItem[];
  mobileItems: MobileTopItem[];
  mobileLinkFooter?: MobileLinkFooter[];
};
