import {PLP_NATIVE_FILTER } from '../../../../../constants/store'
import useScreenResize from '../../../../../hooks/useScreenResize'
import DesktopSidebar from './DesktopSidebar'
import MobileSlider from './MobileSlider'
import Drawer from './Drawer'
import type {ProductGalleryFiltersProps,} from './types'

export default function ProductGalleryFilters(
  props: ProductGalleryFiltersProps
) {

  const {isDesktop} = useScreenResize()

  /**
   * ---------------------------------------------
   * FILTRO NATIVO
   * ---------------------------------------------
   *
   * Desktop → Sidebar
   * Mobile  → Slider
   */
  if (PLP_NATIVE_FILTER) {
    if (isDesktop) {
      return (
        <DesktopSidebar
          {...props}
        />
      )
    }

    return (
      <MobileSlider
        {...props}
      />
    )
  }

  /**
   * ---------------------------------------------
   * DRAWER CUSTOM
   * ---------------------------------------------
   *
   * Desktop → Drawer
   * Mobile  → Drawer
   */

  if (!props.displayFilter || !props.hasFacetsLoaded || props.facets.length === 0) {
    return null
  }

  return (
    <Drawer
      {...props.filter}
      facets={props.facets}
      title={props.title}
      clearButtonLabel={props.clearButtonLabel}
      applyButtonLabel={props.applyButtonLabel}
      totalCount={props.totalCount}
    />
  )
}