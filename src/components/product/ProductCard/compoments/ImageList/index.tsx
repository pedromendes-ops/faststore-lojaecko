import {
  ProductCardImage as UIProductCardImage,
  Carousel,
  BuyButton as UIBuyButton,
  Icon as UIIcon,
} from "@faststore/ui";
import type { ImageProps } from "next/image";

import { Image } from "src/components/ui/Image";

import styles from "./styles.module.scss";
import DiscountBadge from "../../../ProductDetailsCustom/components/DiscountBadge";
import type { ProductCluster } from "../productClusters";

type ImageListMobileProps = {
  image: {
    url: string;
    alternateName: string;
  }[];
  aspectRatio: number;
  imgProps: Partial<ImageProps> | undefined;
  outOfStock: boolean;
  showBuyButton: boolean;
  isDesktop: boolean | undefined;
  buyProps: {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    "data-testid": string;
    "data-sku": string | undefined;
    "data-seller": string | undefined;
  };
  /** Opens the quick-buy modal instead of adding straight to cart. */
  onQuickBuy?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  buyButtonLabel: string;
  listPrice: number;
  spotPrice: number;
  /** Extra node overlaid on the image (positioned by the caller), e.g. the wishlist heart. */
  overlay?: React.ReactNode;
  /** Clusters do produto; viram tags ao lado do badge de desconto. */
  clusters?: ProductCluster[] | null;
  /** Se falso, não renderiza as tags de cluster (ProductClusters). */
  showProductClusters?: boolean;
};

export const ImageListMobile = ({
  image,
  aspectRatio = 1,
  imgProps,
  outOfStock,
  isDesktop,
  showBuyButton,
  buyButtonLabel,
  buyProps,
  onQuickBuy,
  listPrice,
  spotPrice,
  overlay,
}: ImageListMobileProps) => {
  const images = image.slice(0, 2);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("[data-fs-carousel-control]")) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <div
      className={styles["image-list-shelf-carousel"]}
      onClick={handleClick}
      data-fs-image-list-shelf-carousel
    >
      <div className={styles["flags"]}>
        <DiscountBadge
          size={"small"}
          listPrice={listPrice}
          spotPrice={spotPrice}
        />
      </div>
      {overlay}
      <Carousel itemsPerPage={1} variant="scroll" controls="navigationArrows">
        {images.map((item) => (
          <UIProductCardImage aspectRatio={1}>
            <Image
              src={item.url}
              alt={item.alternateName}
              sizes={`${"(max-width: 768px) 40vw, 30vw"}`}
              width={250}
              height={Math.round(250 / aspectRatio)}
              loading={imgProps?.loading}
            />
          </UIProductCardImage>
        ))}
      </Carousel>
      {showBuyButton && isDesktop && (
        <UIBuyButton
          {...buyProps}
          onClick={onQuickBuy ?? buyProps.onClick}
          className={styles.buyButton}
          icon={<UIIcon name="ShoppingCart" width={18} height={18} />}
          data-fs-buy-button
        >
          {outOfStock ? "Indisponível" : buyButtonLabel}
        </UIBuyButton>
      )}
    </div>
  );
};
