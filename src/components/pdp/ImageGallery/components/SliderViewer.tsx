import type { ImageElementData } from '@faststore/ui'
import type { PointerHandlers } from '../useImageSlider'
import useScreenResize from '../../../../hooks/useScreenResize'
import { ZoomImage } from './ZoomImage'
import styles from '../ImageGallery.module.scss'

interface SliderViewerProps {
  images: ImageElementData[]
  selectedIdx: number
  isDragging: boolean
  visualDelta: number
  hasMultiple: boolean
  atStart: boolean
  atEnd: boolean
  pointerHandlers: PointerHandlers
  onPrev: () => void
  onNext: () => void
}

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
  onNext

}: SliderViewerProps) {
  
  const {isDesktop} = useScreenResize()
  const sliderPointerHandlers = isDesktop ? {} : pointerHandlers

  return (
    <div className={styles.viewer} {...sliderPointerHandlers}>
      <div
        className={styles.track}
        style={{
          transform: `translateX(calc(${
            -selectedIdx * 100
          }% + ${
            isDesktop
              ? 0
              : visualDelta
          }px))`,

          transition:
            !isDesktop &&
            isDragging
              ? 'none'
              : undefined,
        }}
      >
        {images.map(
          (item, index) => (
            <div
              className={styles.slide}
              key={`${item.url}-${index}`}
            >
              <ZoomImage
                image={item}
                priority={index === 0}
                enabled={isDesktop}
              />
            </div>
          )
        )}
      </div>

      {hasMultiple && (
        <>
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowPrev}`}
            aria-label="Imagem anterior"
            disabled={atStart}
            onPointerDown={(event) =>
              event.stopPropagation()
            }
            onClick={onPrev}
          >
            ‹
          </button>

          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowNext}`}
            aria-label="Próxima imagem"
            disabled={atEnd}
            onPointerDown={(event) =>
              event.stopPropagation()
            }
            onClick={onNext}
          >
            ›
          </button>
        </>
      )}
    </div>
  )
}