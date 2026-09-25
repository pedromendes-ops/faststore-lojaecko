import type { ImageElementData } from "@faststore/ui";

import { Image } from "src/components/ui/Image";
// Relative import: useDevice and Slider are store customizations, so they
// aren't reachable through the `src/*` alias (which only resolves core).
import { useDevice } from "../../../hooks/useDevice";
import { Slider, type SliderOrientation } from "../../../ui/Slider";

import styles from "../styles.module.scss";

// Thumbnail edge in px; also the vertical slide size, so the column shows whole
// thumbnails per page (see Slider's `itemSize`).
const THUMB_SIZE = 96;

export interface ThumbnailsProps {
  images: ImageElementData[];
  selectedIdx: number;
  onSelect: (index: number) => void;
  /**
   * Gallery orientation. "vertical" (the PDP default) becomes a vertical
   * thumbnail column with up/down arrows on the left of the main image;
   * "horizontal" keeps the row-of-thumbnails slider below the main image.
   */
  orientation?: SliderOrientation;
}

/** Thumbnail column that selects a slide and highlights the active image. */
export function Thumbnails({
  images,
  selectedIdx,
  onSelect,
  orientation = "vertical",
}: ThumbnailsProps) {
  const total = images.length;
  // `isMobile` is true up to 1024px, matching the CSS breakpoint that stacks
  // the thumbnails below the main image. The vertical column only makes sense
  // on the wider layout, so below it we always fall back to the horizontal row.
  const { isMobile, isDesktop } = useDevice();
  const effectiveOrientation: SliderOrientation =
    orientation === "vertical" && !isMobile ? "vertical" : "horizontal";
  const isVertical = effectiveOrientation === "vertical";

  const renderThumb = (item: ImageElementData, index: number) => (
    <button
      type="button"
      key={`${item.url}-${index}`}
      className={styles.thumb}
      data-active={index === selectedIdx || undefined}
      aria-label={`Imagem ${index + 1} de ${total}`}
      aria-current={index === selectedIdx}
      onClick={() => onSelect(index)}
      data-fs-product-details-thumbnail
    >
      <Image
        src={item.url}
        alt={item.alternateName}
        height={96}
        width={96}
        loading={index === 0 ? "eager" : "lazy"}
        data-fs-product-details-thumbnail-image
      />
    </button>
  );

  return (
    <div
      className={styles.gallery_thumbnnail_slider}
      data-orientation={effectiveOrientation}
      data-fs-product-details-thumbnails
    >
      <Slider
        orientation={effectiveOrientation}
        itemSize={THUMB_SIZE}
        // Vertical rail: up to 5 tall, but never taller than the images we have
        // (keeps the column from leaving an empty gap below).
        itemsPerPage={isVertical ? Math.min(5, total) : !isDesktop ? 3 : 4}
        gap={8}
        showArrows="always"
        showDots="never"
        slideClassName={
          isVertical ? styles.thumb_slide_vertical : styles.thumb_slide
        }
        aria-label="Miniaturas do produto"
      >
        {images.map((item, index) => renderThumb(item, index))}
      </Slider>
    </div>
  );
}
