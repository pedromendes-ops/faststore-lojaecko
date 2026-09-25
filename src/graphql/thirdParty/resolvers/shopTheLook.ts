// Backend-only proxy for the account's Shop The Look IO route. Keeps the API off
// the frontend and trims the (large) payload down to the fields the section and
// its modal actually render — mirroring the "return only what's used" approach
// of the similars resolver (src/graphql/vtex/resolvers/product/index.ts).

// Minimal shapes of the raw API payload — only the fields we read.
interface RawImage {
  imageUrl?: string | null;
}
interface RawSku {
  itemId?: string | null;
  images?: RawImage[] | null;
}
interface RawPriceBand {
  highPrice?: number | null;
  lowPrice?: number | null;
}
interface RawProduct {
  productId?: string | null;
  productName?: string | null;
  linkText?: string | null;
  link?: string | null;
  items?: RawSku[] | null;
  priceRange?: {
    sellingPrice?: RawPriceBand | null;
    listPrice?: RawPriceBand | null;
  } | null;
}
interface RawKit {
  nameKit?: string | null;
  itemsProduct?: RawProduct[] | null;
}
interface RawCollection {
  title?: string | null;
  items?: RawKit[] | null;
}

const SHOP_THE_LOOK_URL =
  process.env.SHOP_THE_LOOK_URL ??
  "https://lojalevis.myvtex.com/_v/search/shop-the-look";

const mapProduct = (product: RawProduct) => {
  const sku = product.items?.[0];
  const linkText = product.linkText ?? "";

  return {
    productId: String(product.productId ?? ""),
    skuId: sku?.itemId ?? "",
    productName: product.productName ?? "",
    linkText,
    // The API already ships a "/slug/p" link; fall back to building it.
    link: product.link ?? (linkText ? `/${linkText}/p` : ""),
    image: sku?.images?.[0]?.imageUrl ?? "",
    price: product.priceRange?.sellingPrice?.lowPrice ?? 0,
    listPrice: product.priceRange?.listPrice?.highPrice ?? 0,
  };
};

const shopTheLookResolver = {
  Query: {
    shopTheLook: async () => {
      let collections: RawCollection[] = [];
      try {
        const response = await fetch(SHOP_THE_LOOK_URL, {
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Shop The Look request failed: ${response.status}`);
        }

        collections = (await response.json()) as RawCollection[];
      } catch {
        // A failure here must never break the page — render nothing instead.
        return [];
      }

      return (collections ?? []).map((collection) => ({
        title: collection.title ?? "",
        kits: (collection.items ?? []).map((kit) => ({
          name: kit.nameKit ?? "",
          products: (kit.itemsProduct ?? [])
            .map(mapProduct)
            // Without a productId the modal can't fetch colors/sizes.
            .filter((product) => product.productId !== ""),
        })),
      }));
    },
  },
};

export default shopTheLookResolver;
