import dynamic from "next/dynamic";
// Relative import so it resolves to this store's customized ProductCard
// (the `src/*` alias would resolve to the core ProductCard instead).
import ProductCard, {
  type ProductCardProps,
} from "../../../product/ProductCard";
import { useProductCardConfig } from "./ProductCardConfigContext";

const EmptyGallery = dynamic(
  () =>
    /* webpackChunkName: "EmptyGallery" */
    import("src/components/sections/ProductGallery/EmptyGallery"),
);

// `ProductGrid` (core) só repassa alguns campos de `productCard` para o
// ProductCard — os que não conhece são descartados. Este wrapper lê os
// extras via context (ver ProductCardConfigContext) em vez de depender
// desse caminho.
function ProductCardWithGalleryConfig(props: ProductCardProps) {
  const { showProductClusters } = useProductCardConfig();

  return <ProductCard {...props} showProductClusters={showProductClusters} />;
}

export const ProductGalleryDefaultComponents = {
  __experimentalProductCard: ProductCardWithGalleryConfig,
  __experimentalEmptyGallery: EmptyGallery,
} as const;
