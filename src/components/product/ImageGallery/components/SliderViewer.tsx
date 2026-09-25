import type { ImageElementData } from "@faststore/ui";

import { Image } from "src/components/ui/Image";

import type { PointerHandlers } from "../useImageSlider";
import styles from "../styles.module.scss";

export interface SliderViewerProps {
  images: ImageElementData[];
  selectedIdx: number;
  isDragging: boolean;
  visualDelta: number;
  hasMultiple: boolean;
  atStart: boolean;
  atEnd: boolean;
  pointerHandlers: PointerHandlers;
  onPrev: () => void;
  onNext: () => void;
}

/**
 * Main image viewport: the sliding track of full-size images plus the
 * prev/next arrows. The track is moved with `translateX` and follows the
 * pointer while dragging (transition disabled mid-drag).
 */
export function SliderViewer({
  images,
  selectedIdx,
  isDragging,
  visualDelta,
  hasMultiple,
  atStart,
  atEnd,
  pointerHandlers,
  onPrev,
  onNext,
}: SliderViewerProps) {
  return (
    <div className={styles.viewer} {...pointerHandlers}>
      <div
        className={styles.track}
        style={{
          transform: `translateX(calc(${-selectedIdx * 100}% + ${visualDelta}px))`,
          transition: isDragging ? "none" : undefined,
        }}
      >
        {images.map((item, index) => (
          <div className={styles.slide} key={`${item.url}-${index}`}>
            <Image
              src={item.url}
              alt={item.alternateName}
              width={691}
              height={Math.round(691 * (3 / 4))}
              sizes="(max-width: 360px) 50vw, (max-width: 768px) 90vw, 50vw"
              loading={index === 0 ? "eager" : "lazy"}
              draggable={false}
            />
          </div>
        ))}
      </div>

      {hasMultiple && (
        <>
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowPrev}`}
            aria-label="Imagem anterior"
            disabled={atStart}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={onPrev}
          />
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowNext}`}
            aria-label="Próxima imagem"
            disabled={atEnd}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={onNext}
          />
        </>
      )}
    </div>
  );
}
