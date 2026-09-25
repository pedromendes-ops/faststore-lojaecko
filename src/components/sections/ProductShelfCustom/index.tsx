import {
  getOverriddenSection,
  ProductShelfSection,
} from '@faststore/core'

import {
  type ComponentProps,
  useMemo,
} from 'react'

import {
  ProductShelfAdapter,
} from '../../ui/SwiperCarousel/ProductShelfAdapter'

import ProductCard from '../../store/ProductCard'

import {
  mockCarouselConfiguration,
} from './mock'

import type {
  ProductShelfCarouselConfiguration,
} from './types'

type ProductShelfCustomProps =
  ComponentProps<
    typeof ProductShelfSection
  > & {
    carouselConfiguration?:
      ProductShelfCarouselConfiguration
  }

function createProductShelfCarousel(
  carouselConfiguration:
    ProductShelfCarouselConfiguration
) {
  return function ProductShelfCarousel(
    props: ComponentProps<
      typeof ProductShelfAdapter
    >
  ) {
    return (
      <ProductShelfAdapter
        {...props}
        carouselConfiguration={
          carouselConfiguration
        }
      />
    )
  }
}

export function ProductShelfCustom(
  props: ProductShelfCustomProps
) {
  const carouselConfiguration =
    props.carouselConfiguration ??
    mockCarouselConfiguration

  const carouselKey =
    JSON.stringify(
      carouselConfiguration
    )

  const OverriddenProductShelf =
    useMemo(
      () =>
        getOverriddenSection({
          Section:
            ProductShelfSection,

          components: {
            __experimentalCarousel: {
              Component:
                createProductShelfCarousel(
                  carouselConfiguration
                ),
            },

            __experimentalProductCard: {
              Component:
                ProductCard,
            },
          },
        }),

      // eslint-disable-next-line react-hooks/exhaustive-deps
      [carouselKey]
    )

  return (
    <OverriddenProductShelf
      {...props}
    />
  )
}

export default ProductShelfCustom