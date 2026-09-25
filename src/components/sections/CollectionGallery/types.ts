import type {
  ProductGalleryProps,
} from '../../plp/ProductGallery/types'

import type {
  GalleryContentCard,
} from '../../plp/ProductGallery/types/GalleryContentCard'

export type CollectionGalleryProps = {
  collectionId: string
  title?: string
  itemsPerPage?: number

  filter: ProductGalleryProps['filter']

  contentCards?: GalleryContentCard[]
}