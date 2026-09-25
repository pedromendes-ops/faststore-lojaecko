import type { ImageElementData } from '@faststore/ui'
import { Bullets } from './components/Bullets'
import { SliderViewer } from './components/SliderViewer'
import { ImageGrid } from './components/imageGrid'
import { Thumbnails } from './components/Thumbnails'
import { useImageSlider } from './useImageSlider'
import styles from './ImageGallery.module.scss'
import { PDP_GALLERY_IMAGE } from '../../../constants/store'

const EMPTY_IMAGES: ImageElementData[] = []

export interface ImageGalleryProps {
  images: ImageElementData[]
}

export default function ImageGallery({images = EMPTY_IMAGES, ...otherProps}: ImageGalleryProps) {

  if (!images.length) {
    return null
  }

  //grid
  if (PDP_GALLERY_IMAGE === 'grid') {
    return(
      <ImageGrid images={images} showMore={true} />
    )
  }

  //slider
  const slider = useImageSlider(images)

  return (
    <div className={styles.galleryContainer} data-fs-product-details-gallery {...otherProps}>
      <Thumbnails
        images={images}
        selectedIdx={slider.selectedIdx}
        onSelect={slider.goTo}
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
  )
}