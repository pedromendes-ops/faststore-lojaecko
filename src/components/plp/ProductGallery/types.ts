import type {
  FilterOrdering,
  HiddenFacet,
} from '../utils/orderFacets'

import type {
  GalleryContentCard,
} from './types/GalleryContentCard'

export type ProductGalleryColumns =
  | 3
  | 4

export type FilterLayout =
  | 'default'
  | 'drawer'

export type ProductGalleryConfiguration = {
  columnsDesktop?: ProductGalleryColumns
  filtersOpen?: boolean
}

export type ProductGalleryLabels = {
  filter?: string
  results?: string
}

export type ProductGalleryProps = {
  title?: string
  searchTerm?: string
  totalCount?: number

  config?: ProductGalleryConfiguration

  labels?: ProductGalleryLabels

  filter: {
    title?: string
    layout?: FilterLayout
    ordering?: FilterOrdering
    hiddenFilter?: HiddenFacet[]

    mobileOnly?: {
      filterButton?: {
        label?: string

        icon?: {
          icon: string
          alt: string
        }
      }

      clearButtonLabel?: string
      applyButtonLabel?: string
    }
  }

  contentCards?: GalleryContentCard[]
}