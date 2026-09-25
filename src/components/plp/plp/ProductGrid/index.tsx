import {
  ProductGrid as UIProductGrid,
  ProductGridItem as UIProductGridItem,
} from "@faststore/ui"

import type { ClientManyProductsQueryQuery } from "@generated/graphql"

import ProductGridSkeleton from "src/components/skeletons/ProductGridSkeleton"

import type { ProductCardProps } from "../../../product/ProductCard"

import { memo, type ReactNode } from "react"

import { useOverrideComponents } from "src/sdk/overrides/OverrideContext"
import useScreenResize from "src/sdk/ui/useScreenResize"

import GalleryContentCard from "../components/GalleryContentCard"
import type { GalleryContentCard as GalleryContentCardType } from "../types/GalleryContentCard"

interface Props {
  products: ClientManyProductsQueryQuery["search"]["products"]["edges"]

  page: number
  pageSize: number

  productCard?: Pick<
    ProductCardProps,
    | "showDiscountBadge"
    | "bordered"
    | "taxesConfiguration"
    | "sponsoredLabel"
  >

  firstPage?: number

  shouldShowComparison?: boolean
  compareLabel?: string

  title?: string
  searchId?: string

  buildExtraProductProps?: (
    product: Record<string, any>,
    index: number,
    searchId: string
  ) => Record<string, string | number | boolean>

  contentCards?: GalleryContentCardType[]
}

function ProductGrid({
  products,
  page,
  pageSize,

  productCard: {
    showDiscountBadge,
    bordered,
    taxesConfiguration,
    sponsoredLabel,
  } = {},

  firstPage,
  shouldShowComparison,
  compareLabel,
  title,
  searchId,

  buildExtraProductProps = () => ({}),

  contentCards = [],
}: Props) {
  const { isMobile } = useScreenResize()

  const ProductCard =
    useOverrideComponents<"ProductGallery">().__experimentalProductCard

  if (!ProductCard?.Component) {
    return null
  }

  const ProductCardComponent = ProductCard.Component
  const productCardProps = ProductCard.props ?? {}

  const aspectRatio = 1

  const isGridWithViewportObserver = isMobile && firstPage === page

  

  /**
   * Cria um ProductCard mantendo exatamente
   * a configuração original do ProductGrid.
   */
  const renderProduct = (
    product: any,
    idx: number,
    loading: "eager" | "lazy",
    highPriority = false
  ) => (
    <UIProductGridItem key={`product-${product.id}`}>
      
      <ProductCardComponent
        enableCompareCheckbox={shouldShowComparison}
        compareLabel={compareLabel}
        aspectRatio={aspectRatio}
        imgProps={{
            width: 150,
            height: 150,
            sizes: "30vw",
            loading,
            fetchPriority: highPriority ? "high" : undefined,
        }}
        {...productCardProps}
        bordered={bordered ?? productCardProps.bordered}
        showDiscountBadge={
            showDiscountBadge ?? productCardProps.showDiscountBadge
        }
        product={product}
        index={pageSize * page + idx + 1}
        taxesConfiguration={taxesConfiguration}
        sponsoredLabel={sponsoredLabel}
        {...buildExtraProductProps(product, idx, searchId ?? "")}
        />
    </UIProductGridItem>
  )

  /**
   * Recebe os produtos já transformados em ReactNodes
   * e injeta os cards editoriais nas posições cadastradas.
   */
  const injectContentCards = (
    productElements: ReactNode[],
    cards: GalleryContentCardType[]
  ) => {
    const result = [...productElements]

    const activeCards = cards
      .filter((card) => card.active !== false)
      .sort((a, b) => a.position - b.position)

    activeCards.forEach((card, index) => {
      const targetIndex = Math.max(
        0,
        Math.min(card.position - 1, result.length)
      )

      result.splice(
        targetIndex,
        0,
        <GalleryContentCard
          key={`gallery-content-${card.position}-${index}`}
          card={card}
        />
      )
    })

    return result
  }

  let productElements: ReactNode[]

  if (isGridWithViewportObserver) {
    /*
     * Mantemos exatamente a estratégia original:
     * 2 primeiros produtos eager, restantes lazy.
     */
    productElements = [
      ...products.slice(0, 2).map(({ node: product }, idx) =>
        renderProduct(
          product,
          idx,
          "eager",
          idx === 0
        )
      ),

      ...products.slice(2).map(({ node: product }, idx) =>
        renderProduct(
          product,
          idx + 2,
          "lazy"
        )
      ),
    ]
  } else {
    productElements = products.map(({ node: product }, idx) =>
      renderProduct(
        product,
        idx,
        idx < 4 ? "eager" : "lazy",
        idx === 0 && page === firstPage
      )
    )
  }

  /**
   * Os banners já deverão chegar somente quando estivermos
   * na primeira página, mas deixamos uma segunda proteção aqui.
   */
  const gridItems =
    page === firstPage
      ? injectContentCards(productElements, contentCards)
      : productElements

  return (
    <ProductGridSkeleton
      aspectRatio={aspectRatio}
      loading={products.length === 0}
    >
      <UIProductGrid
        data-af-element={searchId && "search-result"}
        data-af-onimpression={!!searchId}
        data-af-search-id={searchId}
      >
        {gridItems}
      </UIProductGrid>
    </ProductGridSkeleton>
  )
}

export default memo(ProductGrid)