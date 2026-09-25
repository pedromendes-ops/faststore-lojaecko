import type { SectionOverride } from 'src/typings/overrides'
import ProductCard from '../product/ProductCard'
import SwiperCarousel from '../ui/SwiperCarousel'

const SECTION = 'ProductShelf' as const

// Overrides 1.0: valem para a section ProductShelf nativa do CMS, quando ela
// não passa pelo wrapper de `sections/ProductShelf` (que é quem lê a
// configuração do carrossel no CMS). Aqui o Swiper entra com os defaults, para
// nenhuma shelf da loja cair no carrossel do FastStore.
const override: SectionOverride = {
  section: SECTION,
  components: {
    __experimentalCarousel: {
      Component: SwiperCarousel,
    },
    __experimentalProductCard: {
      Component: ProductCard,
    },
  },
}

export { override }