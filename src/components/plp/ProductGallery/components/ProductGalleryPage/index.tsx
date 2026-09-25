import { memo } from 'react'

import {
  useGalleryPage,
} from 'src/sdk/product/usePageProductsQuery'

import ProductGrid from '../../ProductGrid'

import type {
  GalleryContentCard,
} from '../../types/GalleryContentCard'

interface Props {
  page: number
  title: string
  itemsPerPage: number
  firstPage: number
  contentCards?: GalleryContentCard[]
}

function ProductGalleryPage({
  page,
  title,
  itemsPerPage,
  firstPage,
  contentCards,
}: Props) {
  const {
    data,
  } = useGalleryPage(page)

  const products =
    data
      ?.search
      ?.products
      ?.edges ?? []

  return (
    <ProductGrid
      products={products}
      page={page}
      pageSize={itemsPerPage}
      firstPage={firstPage}
      title={title}
      contentCards={contentCards}
    />
  )
}

export default memo(
  ProductGalleryPage
)