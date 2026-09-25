import type { SectionOverride } from 'src/typings/overrides'
import ProductCard from '../product/ProductCard'

const SECTION = 'ProductGallery' as const

const override: SectionOverride = {
  section: SECTION,
  components: {
    __experimentalProductCard: {
      Component: ProductCard,
    },
  },
}

export { override }
