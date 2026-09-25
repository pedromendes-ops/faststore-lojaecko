import Link from 'next/link'
import { Image } from 'src/components/ui/Image'
import { SwiperCarousel } from '../../ui/SwiperCarousel'
import useScreenResize from '../../../hooks/useScreenResize'
import { toCssIdentifier } from '../../../utils/toCssIdentifier'
import type {FullBannerItem, FullBannerProps} from './types'
import styles from './FullBanner.module.scss'
import MOCK_PROPS from './mock'
const USE_LOCAL_MOCK = true

export const FullBanner = (props: FullBannerProps) => {
    
    const { isDesktop } = useScreenResize()
    const data = USE_LOCAL_MOCK ? MOCK_PROPS : props    
    const config = data?.config ?? {}
    const slider = data?.slider ?? {}
    const items = data.items ?? []

    const sectionLabel = toCssIdentifier(config?.label)

    if (!items.length) {
        return null
    }

    const renderBanner = (item: FullBannerItem, index: number) => {

        const imageSrc = isDesktop ? item.image : item.imageMobile ?? item.image
        const isPriorityImage = config.priority === true && index === 0

        const image = (
            <Image
                src={imageSrc}
                alt={item.alt ?? ''}
                width={isDesktop ? 1920 : 641}
                height={config.height ?? 300}
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={isPriorityImage ? 'high' : 'auto'}
            />
        )

        if (!item.href) {
            return image
        }

        return (
            <Link
                href={item.href}
                target={item.target ?? '_self'}
                rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
            >
                {image}
            </Link>
        )
    }

  return (
    <section
        aria-label={config?.label || 'Full Banner'}
        className={styles.fullBanner} data-fs-section="full-banner" data-fs-section-label={sectionLabel || undefined}        
        style={config?.marginTop ? { marginTop: config.marginTop } : undefined}
    >
        <div className="wrap">
            <div className={config?.grid}>
                <SwiperCarousel
                    slidesPerView={1}
                    spaceBetween={0}
                    showArrows={slider.showArrows ?? true}
                    showDots={slider.showDots ?? true}
                    loop={
                        items.length > 1 &&
                        (slider.infiniteMode ?? true)
                    }
                    autoPlay={
                        items.length > 1 &&
                        (slider.autoPlay ?? false)
                    }
                    autoPlayInterval={slider.autoPlayInterval ?? 3000}
                    >
                    {items.map(
                        (item, index) => (
                        <div
                            key={`${item.image}-${index}`}
                            className={
                                styles.slide
                            }
                        >
                            {renderBanner(item, index)}
                        </div>
                        )
                    )}
                </SwiperCarousel>
            </div>
        </div>
    </section>
  )
}

export default FullBanner