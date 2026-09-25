import FilterDesktop from 'src/components/search/Filter/FilterDesktop'
import FilterSkeleton from 'src/components/skeletons/FilterSkeleton'
import type {ProductGalleryFiltersProps} from '../types'

import styles from './DesktopSidebar.module.scss'

export default function DesktopSidebar({
  filter,
  facets,
  title,
  hasFacetsLoaded,
  filtersOpen,

}: ProductGalleryFiltersProps) {
  
  if (!filtersOpen) {
    return null
  }

  return (
    <aside
      className={styles.filters}
      data-fs-product-listing-filters
      data-fs-product-listing-filter-layout="sidebar"
    >
      <FilterSkeleton
        loading={!hasFacetsLoaded}
      >
        {hasFacetsLoaded && facets.length > 0 && (
          <FilterDesktop
            {...filter}
            facets={facets}
            title={title}
          />
        )}
      </FilterSkeleton>
    </aside>
  )
}