import Link from 'next/link'
import { Image } from 'src/components/ui/Image'
import useScreenResize from 'src/sdk/ui/useScreenResize'

import styles from './SimpleBanner.module.scss'

type BannerItem = {
    image?: string
    imageMobile?: string
    href?: string
    target?: '_blank' | '_self'
    hastext?: boolean
    aligntextvertical?: 'top' | 'center' | 'bottom'
    aligntexthorizontal?: 'left' | 'center' | 'right'
    textbanner?: string
    textcolor?: string
}

type Props = {
    items?: BannerItem[]
    height?: number
    loading?: 'eager' | 'lazy'
    columndesktop?: number
    columnmobile?: number
    paddingbanner?: number
    bannerposition?: 'container' | 'full'
}

const defaultItems: BannerItem[] = [
    {
        image: '/arquivos/banner-desktop.jpg',
        imageMobile: '/arquivos/banner-mobile.jpg',
        href: '/',
        target: '_self',
        hastext: true,
        textbanner: '<h2>Banner teste</h2>',
        textcolor: '#ffffff',
    },
]

export const SimpleBanner = ({
    items = [],
    height = 700,
    loading = 'lazy',
    columndesktop = 1,
    columnmobile = 1,
    paddingbanner = 8,
    bannerposition = 'full',
}: Props) => {
    const { isDesktop } = useScreenResize()
    const banners = items.length ? items : defaultItems
    const content = (
        <section
        className={styles.ctBanner}
        style={{
            gap: `${paddingbanner}px`,
            gridTemplateColumns: isDesktop
            ? `repeat(${columndesktop}, 1fr)`
            : `repeat(${columnmobile}, 1fr)`,
        }}
        >
        {banners.map((item, index) => (
            <div
            key={index}
            className={styles.bannerItem}
            style={{ height }}
            >
            <Link
                href={item.href || '#'}
                target={item.target || '_self'}
            >
                <>
                <Image
                    src={
                        (isDesktop
                        ? item.image
                        : item.imageMobile) || ''
                    }
                    alt={`Banner ${index + 1}`}
                    width={1920}
                    height={height}
                    loading={
                    index === 0
                        ? loading
                        : 'lazy'
                    }
                    className={styles.image}
                />

                {item.hastext && (
                    <div
                    className={`
                        ${styles.bannerContent}
                        ${styles[
                        `vertical-${item.aligntextvertical}`
                        ]}
                        ${styles[
                        `horizontal-${item.aligntexthorizontal}`
                        ]}
                    `}
                    style={{
                        color:
                        item.textcolor ||
                        '#fff',
                    }}
                    dangerouslySetInnerHTML={{
                        __html:
                        item.textbanner || '',
                    }}
                    />
                )}
                </>
            </Link>
            </div>
        ))}
        </section>
    )

    if (bannerposition === 'container') {
        return (
            <div className="wrap section">
                <div className="container">
                {content}
                </div>
            </div>
        )
    }

    return <div className="wrap section">{content}</div>
}

export default SimpleBanner