import Link from 'next/link'
import { Image } from 'src/components/ui/Image'
import { Viewer } from '../../ui/viewer'

import { toCssIdentifier } from '../../../utils/toCssIdentifier'
import { SwiperCarousel } from '../../ui/SwiperCarousel'
import useScreenResize from '../../../hooks/useScreenResize'

import CardVideo from './components/CardVideo'

import type {CardsItem, CardsProps,} from './types'

import styles from './Cards.module.scss'

import MOCK_PROPS from './mock'
const USE_LOCAL_MOCK = true

export const Cards = (props: CardsProps) => {
    
    const {isDesktop, isTablet, isMobile} = useScreenResize()
    const data = USE_LOCAL_MOCK ? MOCK_PROPS : props

    const config = data.config ?? {}
    const layout = config.layout ?? {}
    const slider = config.slider ?? {}
    const sectionLabel = toCssIdentifier(config?.label)
    const isActive = config.active ?? true

    const items = (data.items ?? []).filter((item) => item.active !== false)

    if (!isActive || !items.length) {
        return null
    }

    const currentLayout = isDesktop ? layout.desktop ?? 'grid' : isTablet ? layout.tablet ?? 'grid' : layout.phone ?? 'slider'
    const currentColumns = isDesktop ? layout.columnsDesktop ?? 3 : isTablet ? layout.columnsTablet ?? 2 : layout.columnsPhone ?? 1
    const currentHeight = isDesktop ? layout.heightDesktop ?? 300 : isTablet ? layout.heightTablet ?? 260 : layout.heightPhone ?? 220
    const gap = layout.gap ?? 16
    const background = styles.background ?? 'transparent'
    const radius = styles.radius ?? '0'
    const sliderAlign = isDesktop ? slider.align?.desktop ?? 'default' : isTablet ? slider.align?.tablet ?? 'default' : slider.align?.phone ?? 'default'

    const currentPeek = isDesktop ? slider.peek?.desktop ?? 0 : isTablet ? slider.peek?.tablet ?? 0 : slider.peek?.phone ?? 0
    const isContainerStart = currentLayout === 'slider' && sliderAlign === 'container-start'

    const renderBanner = (item: CardsItem, index: number ) => {

        const mediaType = item.mediaType ?? 'image'
        const imageSrc = isMobile ? item.imageMobile ?? item.image : item.image
        const videoSrc = isMobile ? item.videoMobile ?? item.video : item.video
        const hasText = Boolean(item.text)

        console.log('mediaType', mediaType)

        if (mediaType === 'image' && !imageSrc) {
            return null
        }

        if (mediaType === 'video' && !videoSrc) {
            return null
        }

        if (!hasText) {
            return null
        }

        const isPriority = config.priority === true && index === 0

        

        const media = (
            <div
                className={styles.banner}
                style={{height:currentHeight}}
                data-media-type={mediaType}
            >
                {mediaType === 'video' ? (
                    <CardVideo src={videoSrc!}/>
                ) : (
                    <Image
                        src={imageSrc!}
                        alt={item.alt ?? ''}
                        width={isMobile ? 641 : 1920}
                        height={currentHeight}
                        loading={isPriority ? 'eager' : 'lazy'}
                        fetchPriority={isPriority ? 'high' : 'auto'}
                    />
                )}
            </div>
        )

        if (!item.href ) {
            return media
        }

        return (
            <Link
                href={item.href}
                target={item.target ?? '_self'}
                rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                className={styles.bannerLink}
            >
                {media}
            </Link>
        )
    }

    const renderText = (item: CardsItem, index: number) => {

        const hasText = Boolean(item.text)
        const links = item.link ?? []

        if (!hasText || !links.length) {
            return null
        }

        const text = (
            <div className={`${styles.text}`}>
                {hasText && 
                    <Viewer value={item?.text ?? ''} />
                }
                {links.length && 
                    <div className={`flex items-center ${styles.cardLinks}`} style={{'justifyContent': item?.alignLinks ?? 'flex-start'}}>
                    {links.map((val, index) => (
                        <Link
                            key={`link-${index}`}
                            href={val?.value ?? '/'}
                            target={item.target ?? '_self'}
                            rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                            className={styles.textLink}
                        >
                            {val?.name ?? 'Veja mais'}
                        </Link>
                    ))}
                    </div>
                }
            </div>
        )

        
        return (
            <div className={`${styles[layout?.position ?? 'out']}`}>
                {text}
            </div>
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
                    style={{borderRadius: radius, backgroundColor: background}}
                >
                    {renderBanner(item, index)}
                    {renderText(item, index)}
                </div>
            ))}
        </SwiperCarousel>
    )

    const gridContent = (
        <div
            className={styles.bannerGrid}
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
                        className={styles.gridItem}
                        style={{borderRadius: radius, backgroundColor: background}}
                    >
                        {renderBanner(item, index)}
                        {renderText(item, index)}
                    </div>
                )
            )}
        </div>
    )

    const content = currentLayout === 'slider' ? sliderContent : gridContent

    return (
        <section
            aria-label="Cards"            
            className={styles.Cards} data-fs-section="cards" data-fs-section-label={sectionLabel || undefined}
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

export default Cards