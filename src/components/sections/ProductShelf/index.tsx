import { getOverriddenSection, ProductShelfSection } from "@faststore/core";
import { useMemo } from "react";
// Relative imports so they resolve to this store's customized components
// (the `src/*` alias would resolve to the core ones instead).
import ProductCard from "../../product/ProductCard";
import { withCarouselConfiguration } from "../../ui/SwiperCarousel";
import type { CarouselConfiguration } from "../../ui/SwiperCarousel";

/**
 * Custom ProductShelf section.
 *
 * Duas customizações sobre a section nativa, via `getOverriddenSection`:
 *
 * 1. `__experimentalProductCard` — o ProductShelf nativo só repassa `bordered`
 *    e `showDiscountBadge` para o card; aqui injetamos também o desconto do
 *    Pix, editável pelo CMS.
 * 2. `__experimentalCarousel` — troca o carrossel nativo do FastStore pelo
 *    Swiper, com a API do `slider-layout` do VTEX IO (itens por página por
 *    breakpoint, setas e dots).
 *
 * CMS schema: cms/faststore/components/cms_component__productshelf.jsonc
 */
type ProductShelfProps = React.ComponentProps<typeof ProductShelfSection> & {
  productCardConfiguration?: {
    showDiscountBadge?: boolean;
    bordered?: boolean;
    showPixDiscount?: boolean;
    pixDiscount?: number;
    pixDiscountLabel?: string;
    showProductClusters?: boolean;
  };
  carouselConfiguration?: CarouselConfiguration;
};

export function ProductShelf(props: ProductShelfProps) {
  const {
    showPixDiscount = true,
    pixDiscount = 10,
    pixDiscountLabel = "no Pix",
    showProductClusters = true,
  } = props.productCardConfiguration ?? {};

  const carouselConfiguration = props.carouselConfiguration ?? {};
  // o CMS entrega um objeto novo a cada render; serializar dá uma dep estável
  // sem precisar listar campo a campo
  const carouselKey = JSON.stringify(carouselConfiguration);

  const OverriddenProductShelf = useMemo(
    () =>
      getOverriddenSection({
        Section: ProductShelfSection,
        components: {
          __experimentalCarousel: {
            Component: withCarouselConfiguration(carouselConfiguration),
          },
          __experimentalProductCard: {
            Component: (
              cardProps: React.ComponentProps<typeof ProductCard>,
            ) => (
              <ProductCard
                {...cardProps}
                showPixDiscount={showPixDiscount}
                pixDiscount={pixDiscount}
                pixDiscountLabel={pixDiscountLabel}
                showProductClusters={showProductClusters}
              />
            ),
          },
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- carouselKey cobre o objeto do CMS
    [
      showPixDiscount,
      pixDiscount,
      pixDiscountLabel,
      showProductClusters,
      carouselKey,
    ],
  );

  return <OverriddenProductShelf {...props} />;
}

export default ProductShelf;
