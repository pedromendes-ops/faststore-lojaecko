import type {ImageElementData} from '@faststore/ui'
import styles from '../ImageGallery.module.scss'
import { resizeVtexImage } from '../../../../utils/productImage'

interface ThumbnailsProps {
  images: ImageElementData[]
  selectedIdx: number
  onSelect: (
    index: number
  ) => void
}

export function Thumbnails({
  images,
  selectedIdx,
  onSelect

}: ThumbnailsProps) {

  if (images.length <= 1) {
    return null
  }

  return (
    <div className={styles.thumbnails} data-fs-product-details-thumbnails>
      {images.map(
        (item, index) => (
          <button
            type="button"
            key={`${item.url}-${index}`}
            className={styles.thumbnail}
            data-active={index === selectedIdx || undefined}
            aria-label={`Imagem ${index + 1} de ${images.length}`}
            aria-current={index === selectedIdx}
            onClick={() =>
              onSelect(index)
            }
          >
            <img
              src={resizeVtexImage(item.url,80)}
              alt={item.alternateName ?? ''}
              width={96}
              height={96}
              loading={index === 0 ? 'eager' : 'lazy'}
              draggable={false}
            />
          </button>
        )
      )}
    </div>
  )
}