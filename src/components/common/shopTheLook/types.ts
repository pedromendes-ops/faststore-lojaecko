/** A single product inside a kit — the trimmed shape returned by the resolver. */
export interface ShopTheLookProduct {
  productId: string;
  skuId: string;
  productName: string;
  linkText: string;
  link: string;
  image: string;
  price: number;
  listPrice: number;
}

/** A "look" (kit) — a set of products meant to be worn/bought together. */
export interface ShopTheLookKit {
  name: string;
  products: ShopTheLookProduct[];
}

/** A titled collection of kits (the API returns an array of these). */
export interface ShopTheLookCollection {
  title: string;
  kits: ShopTheLookKit[];
}

export interface ShopTheLookQueryData {
  shopTheLook: ShopTheLookCollection[];
}

/** CMS-editable copy for the section (data itself comes from the API). */
export interface ShopTheLookProps {
  /** Optional title override; falls back to the API's collection title. */
  title?: string;
  /** Card CTA label. */
  shopButtonLabel?: string;
  /** Modal heading ("Selecione o seu fit"). */
  modalTitle?: string;
  /** Modal add-to-cart label. */
  addToCartLabel?: string;
  /** Modal "go to PDP" link label. */
  seeMoreLabel?: string;
  marginTopSection?: string;
  sectionLabel?: string;
  active?: boolean;
}
