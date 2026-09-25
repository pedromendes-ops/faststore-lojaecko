import FilterSlider from 'src/components/search/Filter/FilterSlider'

import type {
  ProductGalleryFiltersProps,
} from '../types'

import styles from './MobileSlider.module.scss'

export default function MobileSlider({
  filter,
  facets,
  title,
  clearButtonLabel,
  applyButtonLabel,
  displayFilter,
}: ProductGalleryFiltersProps) {
  if (
    !displayFilter ||
    facets.length === 0
  ) {
    return null
  }

  return (
    <FilterSlider
      {...filter}
      facets={facets}
      title={title}
      clearButtonLabel={
        clearButtonLabel
      }
      applyButtonLabel={
        applyButtonLabel
      }
    />
  )
}