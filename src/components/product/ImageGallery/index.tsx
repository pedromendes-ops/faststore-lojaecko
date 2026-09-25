import type { ImageElementData } from "@faststore/ui";

import type { SliderOrientation } from "../../ui/Slider";
import { Bullets } from "./components/Bullets";
import { SliderViewer } from "./components/SliderViewer";
import { Thumbnails } from "./components/Thumbnails";
import { useImageSlider } from "./useImageSlider";
import styles from "./styles.module.scss";

// Stable empty fallback so a missing `images` prop doesn't create a new array
// reference on every render (which would retrigger the slider reset effect).
const EMPTY_IMAGES: ImageElementData[] = [];

export interface ImageGalleryProps {
  /**
   * List of product images to display in the gallery.
   * Comes from the `__experimentalImageGallery` slot of the ProductDetails
   * section (see CustomProductDetails override).
   */
  images: ImageElementData[];
  /**
   * Thumbnail placement:
   * - "vertical" (default, PDP): thumbnail column with up/down arrows to the
   *   left of the main image (falls back to a bottom row on narrow screens).
   * - "horizontal" (Quick Buy modal): thumbnail row with prev/next arrows
   *   below the main image, at every breakpoint.
   */
  orientation?: SliderOrientation;
}

/**
 * Custom PDP image gallery.
 *
 * A single controlled slider (see {@link useImageSlider}) drives the main
 * image track, the thumbnail column, the prev/next arrows and the bullets —
 * all kept in sync. The slider state lives in the hook; this component just
 * wires it to the presentational pieces.
 *
 * We intentionally do NOT use the `@faststore/ui` Carousel here because it is
 * uncontrolled (no `selectedIndex`/`onChange`), so it can't be synced with the
 * thumbnails.
 */
export default function ImageGallery({
  images,
  orientation = "vertical",
  ...otherProps
}: ImageGalleryProps) {
  const slider = useImageSlider(images ?? EMPTY_IMAGES);

  if (!images?.length) {
    return null;
  }

  return (
    <div
      className={styles.gallery_container}
      data-orientation={orientation}
      data-fs-product-details-gallery
      {...otherProps}
    >
      <Thumbnails
        images={images}
        selectedIdx={slider.selectedIdx}
        onSelect={slider.goTo}
        orientation={orientation}
      />

      <div className={styles.gallery}>
        <SliderViewer
          images={images}
          selectedIdx={slider.selectedIdx}
          isDragging={slider.isDragging}
          visualDelta={slider.visualDelta}
          hasMultiple={slider.hasMultiple}
          atStart={slider.atStart}
          atEnd={slider.atEnd}
          pointerHandlers={slider.pointerHandlers}
          onPrev={slider.prev}
          onNext={slider.next}
        />

        {slider.hasMultiple && (
          <Bullets
            images={images}
            selectedIdx={slider.selectedIdx}
            onSelect={slider.goTo}
          />
        )}
      </div>
    </div>
  );
}
