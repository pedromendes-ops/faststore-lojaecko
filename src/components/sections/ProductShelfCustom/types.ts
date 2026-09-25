import type {
  SwiperAlign,
} from '../../ui/SwiperCarousel'

export type ProductShelfCarouselConfiguration = {
  columnsDesktop?: number
  columnsTablet?: number
  columnsPhone?: number

  gap?: number

  align?: {
    desktop?: SwiperAlign
    tablet?: SwiperAlign
    phone?: SwiperAlign
  }

  peek?: {
    desktop?: number
    tablet?: number
    phone?: number
  }

  showArrows?: boolean
  showDots?: boolean

  infiniteMode?: boolean

  autoPlay?: boolean
  autoPlayInterval?: number
}