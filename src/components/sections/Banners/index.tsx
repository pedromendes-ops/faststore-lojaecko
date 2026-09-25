import Link from 'next/link'
import { Image } from 'src/components/ui/Image'

import { toCssIdentifier } from '../../../utils/toCssIdentifier'
import { SwiperCarousel } from '../../ui/SwiperCarousel'
import useScreenResize from '../../../hooks/useScreenResize'

import type {BannersItem, BannersProps,} from './types'

import styles from './Banners.module.scss'

import MOCK_PROPS from './mock'
const USE_LOCAL_MOCK = true

export const Banners = (props: BannersProps) => {
  
    const {isDesktop, isTablet, isMobile} = useScreenResize()
    const data = USE_LOCAL_MOCK ? MOCK_PROPS : props

    const config = data.config ?? {}
    const layout = config.layout ?? {}
    const slider = config.slider ?? {}
    const bannerStyle = config.style ?? {}
    const isActive = config.active ?? true

    const sectionLabel = toCssIdentifier(config?.label)

    const items = (
        data.items ?? []
    ).filter(
        (item) =>
        item.active !== false &&
        item.image
    )

    if (!isActive || !items.length) {
        return null
    }

    const currentLayout =
        isDesktop
        ? layout.desktop ?? 'grid'
        : isTablet
            ? layout.tablet ?? 'grid'
            : layout.phone ?? 'slider'

    const currentColumns =
        isDesktop
        ? layout.columnsDesktop ?? 3
        : isTablet
            ? layout.columnsTablet ?? 2
            : layout.columnsPhone ?? 1

    const currentHeight = isDesktop
        ? layout.heightDesktop ?? 300
        : isTablet
            ? layout.heightTablet ?? 260
            : layout.heightPhone ?? 220

    const gap = layout.gap ?? 16

    const sliderAlign = isDesktop
        ? slider.align?.desktop ?? 'default'
        : isTablet
        ? slider.align?.tablet ?? 'default'
        : slider.align?.phone ?? 'default'

    const currentPeek = isDesktop
        ? slider.peek?.desktop ?? 0
        : isTablet
        ? slider.peek?.tablet ?? 0
        : slider.peek?.phone ?? 0

    const isContainerStart = currentLayout === 'slider' && sliderAlign === 'container-start'

    const renderBanner = (item: BannersItem, index: number) => {
    const imageSrc = isMobile
        ? item.imageMobile ??
          item.image
        : item.image

        if (!imageSrc) {
            return null
        }

        const isPriority = config.priority === true && index === 0

        const image = (
            <div
                className={`${styles.banner} ${
                bannerStyle.zoom
                    ? styles.zoom
                    : ''
                } ${
                bannerStyle.radius
                    ? styles.radius
                    : ''
                } ${
                bannerStyle.shadow
                    ? styles.shadow
                    : ''
                }`}
            >
                <Image
                    src={imageSrc}
                    alt={item.alt ?? ''}
                    width={isMobile ? 641 : 1920}
                    height={currentHeight}
                    loading={isPriority ? 'eager' : 'lazy'}
                    fetchPriority={isPriority ? 'high' : 'auto'}
                />
            </div>
        )

        if (!item.href) {
            return image
        }

        return (
            <Link
                href={item.href}
                target={item.target ?? '_self'}
                rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                className={styles.bannerLink}
            >
                {image}
            </Link>
        )
    }

  const sliderContent = (
    <SwiperCarousel
        slidesPerView={currentColumns}
        containerColumns={currentColumns}
        containerPeek={currentPeek}
        spaceBetween={gap}
        align={sliderAlign}
        showArrows={slider.showArrows ?? true}
        showDots={slider.showDots ?? false}
        loop={slider.infiniteMode ?? false}
        autoPlay={slider.autoPlay ?? false}
        className='bardot'
        autoPlayInterval={
            slider.autoPlayInterval ?? 5000
        }
        >
        {items.map((item, index) => (
            <div
                key={`${item.image}-${index}`}
                className={styles.slide}
            >
                {renderBanner(item, index)}
            </div>
        ))}
        </SwiperCarousel>
  )

  const gridContent = (
    <div
      className={
        styles.bannerGrid
      }
      style={{
        gridTemplateColumns:
          `repeat(${currentColumns}, minmax(0, 1fr))`,

        gap,
      }}
    >
      {items.map(
        (item, index) => (
          <div
            key={`${item.image}-${index}`}
            className={
              styles.gridItem
            }
          >
            {renderBanner(
              item,
              index
            )}
          </div>
        )
      )}
    </div>
  )

  const content =
    currentLayout ===
    'slider'
      ? sliderContent
      : gridContent

  return (
    <section
      aria-label={config?.label || 'Full Banner'}
      className={styles.banners} data-fs-section="banners" data-fs-section-label={sectionLabel || undefined}        
      style={config?.marginTop ? { marginTop: config.marginTop } : undefined}
    >
      {isContainerStart ? (
        content
      ) : (
        <div className="wrap">
          <div
            className={
              config.grid ??
              'container'
            }
          >
            {content}
          </div>
        </div>
      )}
    </section>
  )
}

export default Banners