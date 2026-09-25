import {
  CrossSellingShelfSection,
  getOverriddenSection,
} from "@faststore/core";
import { useMemo } from "react";
// Relative import so it resolves to this store's customized ProductCard
// (the `src/*` alias would resolve to the core ProductCard instead).
import ProductCard from "../../product/ProductCard";
import { withCarouselConfiguration } from "../../ui/SwiperCarousel";
import type { CarouselConfiguration } from "../../ui/SwiperCarousel";

/**
 * Custom CrossSellingShelf section (the "Buy together"/"Who viewed also viewed"
 * shelf on the PDP).
 *
 * Mesmas duas customizações da ProductShelf, via `getOverriddenSection`:
 * nosso ProductCard (com o desconto do Pix) no `__experimentalProductCard` e o
 * carrossel do Swiper no `__experimentalCarousel`, para toda shelf da loja
 * navegar igual.
 */
type CrossSellingShelfProps = React.ComponentProps<
  typeof CrossSellingShelfSection
> & {
  productCardConfiguration?: {
    showDiscountBadge?: boolean;
    bordered?: boolean;
    showPixDiscount?: boolean;
    pixDiscount?: number;
    pixDiscountLabel?: string;
  };
  carouselConfiguration?: CarouselConfiguration;
};

export function CrossSellingShelf(props: CrossSellingShelfProps) {
  const {
    showPixDiscount = true,
    pixDiscount = 10,
    pixDiscountLabel = "no Pix",
  } = props.productCardConfiguration ?? {};

  const carouselConfiguration = props.carouselConfiguration ?? {};
  // o CMS entrega um objeto novo a cada render; serializar dá uma dep estável
  const carouselKey = JSON.stringify(carouselConfiguration);

  const OverriddenCrossSellingShelf = useMemo(
    () =>
      getOverriddenSection({
        Section: CrossSellingShelfSection,
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
              />
            ),
          },
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- carouselKey cobre carouselConfiguration
    [showPixDiscount, pixDiscount, pixDiscountLabel, carouselKey],
  );

  return <OverriddenCrossSellingShelf {...props} />;
}

export default CrossSellingShelf;
