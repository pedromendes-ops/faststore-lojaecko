'use client'

import {
  Children,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  Autoplay,
  Navigation,
  Pagination,
} from 'swiper/modules'

import {
  Swiper,
  SwiperSlide,
} from 'swiper/react'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import styles from './styles.module.scss'

export type SwiperAlign =
  | 'default'
  | 'center'
  | 'container-start'

type Props = {
  children: ReactNode
  slidesPerView?: number | 'auto'
  spaceBetween?: number
  showArrows?: boolean
  showDots?: boolean
  loop?: boolean
  autoPlay?: boolean
  autoPlayInterval?: number
  align?: SwiperAlign
  containerColumns?: number
  containerPeek?: number

  

  className?: string
  slideClassName?: string
}

export function SwiperCarousel({
  children,
  slidesPerView = 1,
  spaceBetween = 0,
  showArrows = true,
  showDots = false,
  loop = false,
  autoPlay = false,
  autoPlayInterval = 5000,
  align = 'default',
  containerColumns,
  containerPeek = 0,
  className = '',
  slideClassName = '',

}: Props) {
  const slides =
    Children.toArray(children)

  const hasMultipleSlides =
    slides.length > 1

  const [
    containerOffset,
    setContainerOffset,
  ] = useState(0)

  const [
    containerWidth,
    setContainerWidth,
  ] = useState(0)

  useEffect(() => {
    if (
      align !==
      'container-start'
    ) {
      setContainerOffset(0)
      setContainerWidth(0)

      return
    }

    const calculateContainer = () => {
  const container =
    document.querySelector<HTMLElement>('.container')

  if (!container) {
    setContainerOffset(0)
    setContainerWidth(0)
    return
  }

  const rect =
    container.getBoundingClientRect()

  const computedStyle =
    window.getComputedStyle(container)

  const paddingLeft =
    parseFloat(computedStyle.paddingLeft) || 0

  const paddingRight =
    parseFloat(computedStyle.paddingRight) || 0

  const contentWidth =
    rect.width -
    paddingLeft -
    paddingRight

  setContainerOffset(
    Math.max(
      rect.left + paddingLeft,
      0
    )
  )

  setContainerWidth(
    contentWidth
  )
}

    calculateContainer()

    window.addEventListener(
      'resize',
      calculateContainer
    )

    return () => {
      window.removeEventListener(
        'resize',
        calculateContainer
      )
    }
  }, [
    align,
    
  ])

  const containerSlideWidth =
  useMemo(() => {
    if (
      align !== 'container-start' ||
      !containerColumns ||
      containerColumns <= 0 ||
      containerWidth <= 0
    ) {
      return undefined
    }

    const totalGaps =
      spaceBetween *
      Math.max(
        containerColumns - 1,
        0
      )

    const peekSpace =
      containerPeek > 0
        ? containerPeek +
          spaceBetween
        : 0

    const availableWidth =
      Math.max(
        containerWidth -
          totalGaps -
          peekSpace,
        0
      )

    return (
      availableWidth /
      containerColumns
    )
  }, [
    align,
    containerColumns,
    containerWidth,
    containerPeek,
    spaceBetween,
  ])

  if (!slides.length) {
    return null
  }

  const isContainerStart =
    align ===
    'container-start'

  return (
    <div
      className={`${styles.carousel} ${styles[className]}`}
      data-align={align}
    >
      <Swiper
        modules={[
          Navigation,
          Pagination,
          Autoplay,
        ]}
        slidesPerView={
          isContainerStart
            ? 'auto'
            : slidesPerView
        }
        spaceBetween={
          spaceBetween
        }
        centeredSlides={
          align === 'center'
        }
        slidesOffsetBefore={
          isContainerStart
            ? containerOffset
            : 0
        }
        slidesOffsetAfter={
          isContainerStart
            ? containerOffset
            : 0
        }
        navigation={
          showArrows &&
          hasMultipleSlides
        }
        pagination={
          showDots &&
          hasMultipleSlides
            ? {
                clickable: true,
              }
            : false
        }
        loop={
          loop &&
          hasMultipleSlides
        }
        autoplay={
          autoPlay &&
          hasMultipleSlides
            ? {
                delay:
                  autoPlayInterval,

                disableOnInteraction:
                  false,

                pauseOnMouseEnter:
                  true,
              }
            : false
        }
      >
        {slides.map(
          (slide, index) => (
            <SwiperSlide
              key={index}
              className={
                slideClassName
              }
              style={
                containerSlideWidth
                  ? {
                      width:
                        containerSlideWidth,
                    }
                  : undefined
              }
            >
              {slide}
            </SwiperSlide>
          )
        )}
      </Swiper>
    </div>
  )
}

export default SwiperCarousel