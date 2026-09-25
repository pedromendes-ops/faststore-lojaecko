import type { ImageElementData } from '@faststore/ui'
import styles from '../ImageGallery.module.scss'

interface BulletsProps {
  images: ImageElementData[]
  selectedIdx: number
  onSelect: (
    index: number
  ) => void
}

export function Bullets({
  images,
  selectedIdx,
  onSelect

}: BulletsProps) {

  return (
    <div className={styles.bullets} data-fs-product-details-bullets>
      {images.map(
        (item, index) => (
          <button
            type="button"
            key={`bullet-${item.url}-${index}`}
            className={styles.bullet}
            data-active={index === selectedIdx || undefined}
            aria-label={`Ir para a imagem ${index + 1}`}
            aria-current={index === selectedIdx}
            onClick={() =>
              onSelect(index)
            }
          />
        )
      )}
    </div>
  )
}