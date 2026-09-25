import Link from "next/link"
import { Carousel, Icon } from "@faststore/ui"
import { Image } from "src/components/ui/Image";
import useScreenResize from "../../../../../components/common/MyScreenResize";

import type {
  GalleryContentCard as GalleryContentCardType,
  GalleryContentImage,
} from "../../types/GalleryContentCard"

import styles from "./styles.module.scss"

interface Props {
  card: GalleryContentCardType
}

function GalleryImage({
  item,
}: {
  item: GalleryContentImage
}) {
  const {
    image = "",
    imageMobile = "",
    link = "",
    target = "_self",
    imageAlt = "",
  } = item
  const { isDesktop } = useScreenResize();

  if (!image && !imageMobile) {
    return null
  }

  return (
    <Link target={target} href={link || "#"}>
    <Image
      src={isDesktop ? image : imageMobile}
      alt={imageAlt}
      width={641}
      height={400}
      style={{
        width: "100%",
        height: "auto",
      }}
    />
    </Link>
  )
}

function GalleryContentCard({ card }: Props) {
  const {
    images = [],
    title,
    text,
    columnsDesktop = 1,
    columnsTablet = 1,
    columnsMobile = 2,
    textPosition = "below",
    textAlign = "left",
  } = card

  const content = (
    <article
      className={styles.card}
      data-columns-desktop={columnsDesktop}
      data-columns-tablet={columnsTablet}
      data-columns-mobile={columnsMobile}
      data-text-position={textPosition}
      data-text-align={textAlign}
    >
      
      {images.length > 1 ? (
        <div className={styles.fullBannerCard}>
          <Carousel
            itemsPerPage={1}
            variant="slide"
            infiniteMode
            controls="complete"
            className={styles.carousel}
            
          >
            {images.map((item, index) => (
              <GalleryImage
                key={`${item.image}-${index}`}
                item={item}
              />
            ))}
          </Carousel>
          </div>
      ) : (
        images[0] && (
          <GalleryImage item={images[0]} />
        )
      )}

      {(title || text) && (
        <div className={styles.content}>
          {title && (
            <h3 className={styles.title}>
              {title}
            </h3>
          )}

          {text && (
            <p className={styles.text}>
              {text}
            </p>
          )}
        </div>
      )}
    </article>
  )

  return content
}

export default GalleryContentCard