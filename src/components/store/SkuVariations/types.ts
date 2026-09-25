import type { SkuOption } from '@faststore/ui'

export interface VariantProduct {
  name: string
  productID: string
  sku?: string

  additionalProperty?: Array<{
    name: string
    value: string
  }> | null

  offers?: {
    offers?: Array<{
      availability?: string | null
      quantity?: number | null
    }>
  } | null
}


export interface SkuVariants {
  activeVariations: Record<string, string>

  availableVariations: Record<
    string,
    SkuOption[]
  >

  slugsMap: Record<string, string>

  allVariantProducts?: VariantProduct[] | null
}

export interface SkuVariationsProps {
  skuVariants: SkuVariants

  onSelect?: (
    sku: string,
    selectedVariations: Record<string, string>
  ) => void
}