export type SkuSelectorLayout  = | 'grid'  | 'select'
export type QuickViewLayout    = | 'modal' | 'slideover'
export type ShelfImageLayout   = | 'zoom'  | 'slider' | 'hover' | 'default'
export type PdpGalleryImage    = | 'grid'  | 'slider'
export type PlpFilterExpanded =  | 'all'   | 'first'  | 'none'

export const CONTAINER_MAX_WIDTH = 1360

//shelf
export const IMG_SHELF_LAYOUT: ShelfImageLayout = 'slider'
export const IMG_SHELF_WIDTH = 300
export const HAS_QUICKVIEW = true
export const LAYOUT_QUICKVIEW: QuickViewLayout = 'slideover'
export const DISCOUNT_PERCENTAGE = true
export const DISCOUNT_NOMINAL = true
export const PIX_DISCOUNT = 5


export const PRODUCT_CLUSTERS = [
  {
    id: '137',
    name: 'Lançamento',
    active: true,
    className: 'layout',
  }
]

//plp
export const PLP_NATIVE_FILTER = true
export const PLP_FILTER_EXPANDED: PlpFilterExpanded = 'all'

//product
export const SELECTOR_SKU: SkuSelectorLayout = 'grid'
export const PDP_GALLERY_IMAGE: PdpGalleryImage = 'slider'


