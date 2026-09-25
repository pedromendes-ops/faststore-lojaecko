import type { ImageElementData } from '@faststore/ui'
import useScreenResize from '../../../../hooks/useScreenResize'
import { ZoomImage } from './ZoomImage'
import styles from '../ImageGallery.module.scss'

interface ImageGridProps {
  images: ImageElementData[]  
  showMore: boolean
}

export function ImageGrid({
  images,
  showMore

}: ImageGridProps) {

    const {isDesktop} = useScreenResize()
    return (
        <div className={styles.imageGrid}>
        
            {images.map(
                (item, index) => (
                    <div
                        className={styles.itemGrid}
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
    )
}