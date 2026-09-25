'use client'

import NextLink from 'next/link'
import useScreenResize from '../../../../../hooks/useScreenResize'
import type {GalleryContentCard as GalleryContentCardType,} from '../../types/GalleryContentCard'
import styles from './GalleryContentCard.module.scss'

type GalleryContentCardProps = {
  card: GalleryContentCardType
}

export function GalleryContentCard({
  card,
}: GalleryContentCardProps) {
  const {
    images = [],
    title,
    text,
    columnsDesktop = 1,
    columnsTablet = 1,
    columnsMobile = 1,
    textPosition = 'below',
    textAlign = 'left',
  } = card

  const {isDesktop, isTablet} = useScreenResize()
  const columns = isDesktop ? columnsDesktop : isTablet ? columnsTablet : columnsMobile

  if (card.active === false || images.length === 0) {
    return null
  }

  return (
    <article
      className={styles.card}
      data-gallery-content-card
      data-columns={columns}
      data-text-position={textPosition}
      data-text-align={textAlign}
      style={{
        gridColumn: `span ${columns}`,
      }}
    >
      <div className={styles.images}>
        {images.map(
          (item, index) => {
            const imageSrc =
              !isDesktop &&
              item.imageMobile
                ? item.imageMobile
                : item.image

            if (!imageSrc) {
              return null
            }

            const image = (
              <img
                src={imageSrc}
                alt={
                  item.imageAlt ??
                  title ??
                  ''
                }
                loading="lazy"
                decoding="async"
                className={
                  styles.image
                }
              />
            )

            return (
              <div
                key={`${imageSrc}-${index}`}
                className={
                  styles.imageItem
                }
              >
                {item.link ? (
                  <NextLink
                    href={item.link}
                    target={item.target ?? '_self'}
                    aria-label={item.linkLabel ?? item.imageAlt ?? title}
                  >
                    {image}
                  </NextLink>
                ) : (
                  image
                )}
              </div>
            )
          }
        )}
      </div>

      {(title || text) && (
        <div className={styles.content}>
          {title && (
            <h3 className={styles.title}>
              {title}
            </h3>
          )}

          {text && (
            <div className={styles.text}>
              {text}
            </div>
          )}
        </div>
      )}
    </article>
  )
}

export default GalleryContentCard