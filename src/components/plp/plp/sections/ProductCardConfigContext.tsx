import { createContext, useContext } from "react";

import type { ProductCardProps } from "../../../product/ProductCard";

type ProductCardConfig = Pick<ProductCardProps, "showProductClusters">;

const DEFAULT_CONFIG: ProductCardConfig = {
  showProductClusters: true,
};

// `ProductGrid` (o core, não sobrescrito) só repassa `bordered`/`showDiscountBadge`/
// `taxesConfiguration`/`sponsoredLabel` de `productCard` para o ProductCard — o
// resto do objeto é descartado no meio do caminho. Esse context deixa o
// `ProductCardConfigContext` (que ProductGalleryDefaultComponents lê) alimentar
// campos extras do ProductCard que o core não conhece.
const ProductCardConfigContext =
  createContext<ProductCardConfig>(DEFAULT_CONFIG);

export const ProductCardConfigProvider = ProductCardConfigContext.Provider;

export const useProductCardConfig = () => useContext(ProductCardConfigContext);
