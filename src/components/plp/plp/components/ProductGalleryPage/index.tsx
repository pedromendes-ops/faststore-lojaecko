import { memo } from "react"

import type { ProductCardProps } from "../../../../product/ProductCard"

import { useGalleryPage } from "src/sdk/product/usePageProductsQuery"

import ProductGrid from "../../ProductGrid"

import type { GalleryContentCard } from "../../types/GalleryContentCard"

interface Props {
  page: number
  title: string

  productCard?: Pick<
    ProductCardProps,
    | "showDiscountBadge"
    | "bordered"
    | "taxesConfiguration"
    | "sponsoredLabel"
  >

  itemsPerPage: number
  firstPage: number

  shouldShowComparison?: boolean
  compareLabel?: string

  contentCards?: GalleryContentCard[]
}

function buildExtraProductProps(
  product: Record<string, string>,
  index: number,
  searchId: string
) {
  return {
    "data-af-element": "search-result",
    "data-af-onclick": product && !!product.productId,
    "data-af-search-id": searchId,
    "data-af-product-position": Number(index ?? 0) + 1,
    "data-af-product-id": product && product.productId,
  }
}

function ProductGalleryPage({
  page,
  title,
  productCard,
  itemsPerPage,
  firstPage,
  shouldShowComparison,
  compareLabel,
  contentCards,
}: Props) {
  const { data } = useGalleryPage(page)

  const products = data?.search?.products?.edges ?? []

  const searchId = data?.search?.searchId

  return (
    <ProductGrid
      shouldShowComparison={shouldShowComparison}
      compareLabel={compareLabel}
      products={products}
      page={page}
      pageSize={itemsPerPage}
      productCard={productCard}
      firstPage={firstPage}
      title={title}
      searchId={searchId}
      buildExtraProductProps={
        searchId ? buildExtraProductProps : undefined
      }
      contentCards={contentCards}
    />
  )
}

export default memo(ProductGalleryPage)