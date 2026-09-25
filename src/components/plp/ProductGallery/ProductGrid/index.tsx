import {
  ProductGrid as UIProductGrid,
  ProductGridItem as UIProductGridItem,
} from '@faststore/ui'

import type {
  ClientManyProductsQueryQuery,
} from '@generated/graphql'

import {
  memo,
  type ReactNode,
} from 'react'

import {
  useOverrideComponents,
} from 'src/sdk/overrides/OverrideContext'

import ProductGridSkeleton from 'src/components/skeletons/ProductGridSkeleton'

import useScreenResize from '../../../../hooks/useScreenResize'

import GalleryContentCard from '../components/GalleryContentCard'

import type {
  GalleryContentCard as GalleryContentCardType,
} from '../types/GalleryContentCard'

interface Props {
  products:
    ClientManyProductsQueryQuery[
      'search'
    ]['products']['edges']

  page: number
  pageSize: number
  firstPage?: number
  title?: string

  contentCards?: GalleryContentCardType[]
}

function ProductGrid({
  products,
  page,
  pageSize,
  firstPage,
  contentCards = [],
}: Props) {
  const {
    isMobile,
  } = useScreenResize()

  /**
   * Continua usando o ProductCard
   * configurado no override da ProductGallery.
   */
  const ProductCard =
    useOverrideComponents<
      'ProductGallery'
    >().__experimentalProductCard

  if (!ProductCard?.Component) {
    return null
  }

  const ProductCardComponent =
    ProductCard.Component

  const productCardProps =
    ProductCard.props ?? {}

  const aspectRatio = 1

  const isGridWithViewportObserver =
    isMobile &&
    firstPage === page

  /**
   * Renderiza um produto mantendo
   * o ProductCard do nosso override.
   */
  const renderProduct = (
    product: any,
    index: number,
    loading: 'eager' | 'lazy',
    highPriority = false
  ) => (
    <UIProductGridItem
      key={`product-${product.id}`}
    >
      <ProductCardComponent
        {...productCardProps}
        product={product}
        index={
          pageSize * page +
          index +
          1
        }
        imgProps={{
          width: 500,
          height: 500,
          sizes: '30vw',
          loading,
          fetchPriority:
            highPriority
              ? 'high'
              : undefined,
        }}
      />
    </UIProductGridItem>
  )

  /**
   * Injeta os banners nas posições
   * configuradas.
   *
   * position: 4
   * significa que o banner ocupará
   * a quarta posição visual da grid.
   */
  const injectContentCards = (
    productElements: ReactNode[],
    cards: GalleryContentCardType[]
  ) => {
    const result = [
      ...productElements,
    ]

    const activeCards =
      cards
        .filter(
          (card) =>
            card.active !== false
        )
        .sort(
          (a, b) =>
            a.position -
            b.position
        )

    activeCards.forEach(
      (card, index) => {
        const targetIndex =
          Math.max(
            0,
            Math.min(
              card.position - 1,
              result.length
            )
          )

        result.splice(
          targetIndex,
          0,
          <GalleryContentCard
            key={`gallery-content-${card.position}-${index}`}
            card={card}
          />
        )
      }
    )

    return result
  }

  let productElements:
    ReactNode[]

  /**
   * Mantemos o comportamento de
   * carregamento otimizado da referência.
   */
  if (
    isGridWithViewportObserver
  ) {
    productElements = [
      ...products
        .slice(0, 2)
        .map(
          (
            { node: product },
            index
          ) =>
            renderProduct(
              product,
              index,
              'eager',
              index === 0
            )
        ),

      ...products
        .slice(2)
        .map(
          (
            { node: product },
            index
          ) =>
            renderProduct(
              product,
              index + 2,
              'lazy'
            )
        ),
    ]
  } else {
    productElements =
      products.map(
        (
          { node: product },
          index
        ) =>
          renderProduct(
            product,
            index,
            index < 4
              ? 'eager'
              : 'lazy',
            index === 0 &&
              page === firstPage
          )
      )
  }

  /**
   * Banner somente na primeira
   * página da listagem.
   */
  const gridItems =
    page === firstPage
      ? injectContentCards(
          productElements,
          contentCards
        )
      : productElements

  return (
    <ProductGridSkeleton
      aspectRatio={aspectRatio}
      loading={
        products.length === 0
      }
    >
      <UIProductGrid>
        {gridItems}
      </UIProductGrid>
    </ProductGridSkeleton>
  )
}

export default memo(
  ProductGrid
)