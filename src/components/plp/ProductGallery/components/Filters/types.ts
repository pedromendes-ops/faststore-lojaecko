import type {
  useFilter,
} from 'src/sdk/search/useFilter'

export interface ProductGalleryFiltersProps {
  filter: ReturnType<typeof useFilter>
  facets: ReturnType<typeof useFilter>['facets']
  title?: string
  clearButtonLabel?: string
  applyButtonLabel?: string
  totalCount: number
  hasFacetsLoaded: boolean
  displayFilter: boolean
  
  /*  Utilizado apenas pela implementação DesktopSidebar */
  filtersOpen?: boolean
}