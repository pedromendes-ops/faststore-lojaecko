'use client'

import {
  type PLPContext,
  type SearchPageContext,
  isPLP,
  isSearchPage,
  usePage,
} from 'src/sdk/overrides/PageProvider'

import {getOverridableSection,} from 'src/sdk/overrides/getOverriddenSection'
import ProductGalleryUI from './ProductGallery'
import {ProductGalleryDefaultComponents, } from './ProductGalleryDefaultComponents'
import type {ProductGalleryProps, } from './types'

type ProductGallerySectionProps =
  Omit<
    ProductGalleryProps,
    'title' | 'searchTerm' | 'totalCount'
  >

function ProductGallerySection(props: ProductGallerySectionProps) {
  const context =
    usePage<SearchPageContext | PLPContext>()

  const [title, searchTerm] =
    isSearchPage(context)
      ? [
          context?.data?.title,
          context?.data?.searchTerm,
        ]
      : isPLP(context)
        ? [
            context?.data?.collection?.seo?.title,
            undefined,
          ]
        : ['', undefined]

  const totalCount =
    context?.data?.search?.products?.pageInfo
      ?.totalCount ?? 0

      

  return (
    <div className="wrap">
      <div className="container">
        <ProductGalleryUI
          {...props}
          title={title}
          searchTerm={searchTerm}
          totalCount={totalCount}
        />
      </div>
    </div>
  )
}

const ProductGalleryCustom =
  getOverridableSection<
    // @ts-ignore FastStore does not infer required section props
    typeof ProductGallerySection
  >(
    'ProductGallery',
    ProductGallerySection,
    ProductGalleryDefaultComponents
  )

export default ProductGalleryCustom

