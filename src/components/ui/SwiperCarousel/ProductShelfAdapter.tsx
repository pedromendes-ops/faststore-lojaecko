'use client'

import type { ReactNode } from 'react'

import useScreenResize from '../../../hooks/useScreenResize'
import SwiperCarousel from './index'

import type {
  ProductShelfCarouselConfiguration,
} from '../../sections/ProductShelfCustom/types'

type ProductShelfAdapterProps = {
  id?: string
  itemsPerPage?: number
  children: ReactNode
  carouselConfiguration?: ProductShelfCarouselConfiguration
}

export function ProductShelfAdapter({
  id,
  itemsPerPage = 3,
  children,
  carouselConfiguration = {},
}: ProductShelfAdapterProps) {
  const {
    isDesktop,
    isTablet,
  } = useScreenResize()

  const {
    columnsDesktop = itemsPerPage,
    columnsTablet = 2,
    columnsPhone = 1,
    gap = 16,

    align = {},
    peek = {},

    showArrows = true,
    showDots = false,
    infiniteMode = false,
    autoPlay = false,
    autoPlayInterval = 5000,
  } = carouselConfiguration

  const currentColumns = isDesktop
    ? columnsDesktop
    : isTablet
      ? columnsTablet
      : columnsPhone

  const currentAlign = isDesktop
    ? align.desktop ?? 'default'
    : isTablet
      ? align.tablet ?? 'default'
      : align.phone ?? 'default'

  const currentPeek = isDesktop
    ? peek.desktop ?? 0
    : isTablet
      ? peek.tablet ?? 0
      : peek.phone ?? 0

  const carousel = (
    <div id={id}>
      <SwiperCarousel
        slidesPerView={currentColumns}
        containerColumns={currentColumns}
        containerPeek={currentPeek}
        spaceBetween={gap}
        align={currentAlign}
        showArrows={showArrows}
        showDots={showDots}
        loop={infiniteMode}
        autoPlay={autoPlay}
        autoPlayInterval={autoPlayInterval}
      >
        {children}
      </SwiperCarousel>
    </div>
  )

  if (currentAlign === 'container-start') {
    return carousel
  }

  return (
    <div className="wrap">
      <div className="container">
        {carousel}
      </div>
    </div>
  )
}