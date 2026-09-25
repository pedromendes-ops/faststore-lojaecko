export type FullBannerItem = {
    image: string
    imageMobile?: string
    alt?: string
    href?: string
    target?: '_blank' | '_self'
}

export type FullBannerProps = {
    config?: {
        label?: string
        grid?: 'container' | 'full'
        marginTop?: number    
        height?: number
        priority?: boolean
    }
    slider?: {
        showDots?: boolean
        showArrows?: boolean
        infiniteMode?: boolean
        autoPlay?: boolean
        autoPlayInterval?: number
    }
    items?: FullBannerItem[]
}