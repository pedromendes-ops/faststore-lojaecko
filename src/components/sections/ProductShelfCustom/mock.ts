import type {
  ProductShelfCarouselConfiguration,
} from './types'

export const mockCarouselConfiguration:
  ProductShelfCarouselConfiguration = {
    columnsDesktop: 4,
    columnsTablet: 2,
    columnsPhone: 1,

    gap: 16,

    align: {
      desktop: 'container-start',
      tablet: 'default',
      phone: 'container-start',
    },

    peek: {
      desktop: 0,
      tablet: 0,
      phone: 40,
    },

    showArrows: true,
    showDots: false,

    infiniteMode: false,

    autoPlay: false,
    autoPlayInterval: 5000,
  }