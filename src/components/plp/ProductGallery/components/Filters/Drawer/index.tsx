import {useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useSearch } from '@faststore/sdk'

import {  
  regionSliderTypes,
  useUI,
  type ButtonProps as UIButtonProps,
  type FilterFacetBooleanItemProps as UIFilterFacetBooleanItemProps,
  type FilterFacetRangeProps as UIFilterFacetRangeProps,
  type FilterFacetsProps as UIFilterFacetsProps,
  type FilterProps as UIFilterProps,
  type FilterSliderProps as UIFilterSliderProps,
  type IconProps as UIIconProps,
} from '@faststore/ui'

import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import type { useFilter } from 'src/sdk/search/useFilter'
import { DELIVERY_OPTIONS_FACET_KEY, PICKUP_ALL_FACET_VALUE, SHIPPING_FACET_KEY, useDeliveryPromise } from 'src/sdk/deliveryPromise'
import { getGlobalSettings } from 'src/utils/globalSettings'
import FilterDeliveryMethodFacet from 'src/components/search/Filter/FilterDeliveryMethodFacet'
import type { FilterSliderProps } from 'src/components/search/Filter/FilterSlider'
import Sort from '../../Sort'
import type { SortOptionKey } from '../../Sort/types'
import styles from './Drawer.module.scss'

/**
 * Componentes nativos do FastStore carregados
 * dinamicamente, seguindo a mesma estratégia
 * utilizada pelo FilterSlider nativo.
 */
const UIFilter =
  dynamic<
    {
      children: React.ReactNode
    } & UIFilterProps
  >(() =>
    import(
      '@faststore/ui'
    ).then(
      (mod) => mod.Filter
    )
  )

const UIFilterFacetBoolean = dynamic<{children: React.ReactNode}>(() =>
  import('@faststore/ui').then((mod) => mod.FilterFacetBoolean)
)
const UIFilterFacetBooleanItem = dynamic<UIFilterFacetBooleanItemProps>(() =>
  import('@faststore/ui').then((mod) => mod.FilterFacetBooleanItem)
)

const UIFilterFacetRange = dynamic<UIFilterFacetRangeProps>(() =>
  import('@faststore/ui').then((mod) => mod.FilterFacetRange)
)

const UIFilterFacets =
  dynamic<
    {
      children: React.ReactNode
    } & UIFilterFacetsProps
  >(() =>
    import(
      '@faststore/ui'
    ).then(
      (mod) =>
        mod.FilterFacets
    )
  )

const UIFilterSlider =
  dynamic<
    UIFilterSliderProps
  >(() =>
    import(
      '@faststore/ui'
    ).then(
      (mod) =>
        mod.FilterSlider
    )
  )

const UIButton =
  dynamic<
    UIButtonProps
  >(() =>
    import(
      '@faststore/ui'
    ).then(
      (mod) => mod.Button
    )
  )

const UIIcon =
  dynamic<
    UIIconProps
  >(() =>
    import(
      '@faststore/ui'
    ).then(
      (mod) => mod.Icon
    )
  )

interface FilterDrawerProps
  extends FilterSliderProps {
  totalCount?: number
}

export default function FilterDrawer({
  facets,
  testId,
  dispatch,
  expanded,
  selected,
  title,
  clearButtonLabel,
  applyButtonLabel,
  totalCount,
}: FilterDrawerProps &
  ReturnType<typeof useFilter>) {
  /**
   * Estado real da busca.
   */
  const {resetInfiniteScroll, setState, state } = useSearch()
  const [pendingSort, setPendingSort] = useState<SortOptionKey>(state.sort as SortOptionKey)
  
  useEffect(() => {
    setPendingSort(
      state.sort as SortOptionKey
    )
  }, [state.sort])

  const {closeFilter, openRegionSlider} = useUI()
  const cmsData = getGlobalSettings()
  const {deliveryPromise: deliveryPromiseSettings, filters: filtersSettings } = cmsData ?? {}
  const filterFacetRangeSettings = filtersSettings?.filterFacetRange
  const drawerTestId = testId ?? 'filter-drawer'
  const {
    facets: filteredFacets,
    labelsMap,
    isPickupAllEnabled,
    shouldDisplayDeliveryButton,
    onDeliveryFacetChange
  } = useDeliveryPromise({
    selectedFilterFacets:selected,
    allFacets:facets,
    deliveryPromiseSettings
  })

  const handleApply = () => {
    resetInfiniteScroll(0)
    const isOtherShippingFacetSelected = selected.some(({key,value,}) => key === 'shipping' && value !== 'pickup-in-point')
    const removePickupPointFacet = selected.filter(({ key }) => key !== 'pickupPoint')

    setState({
      ...state,
      selectedFacets: isOtherShippingFacetSelected ? removePickupPointFacet : selected,
      sort: pendingSort,
      page: 0,
    })

    closeFilter()
  }

  const handleClose = () => {
    dispatch({
      type: 'selectFacets',
      payload: state.selectedFacets
    })

    setPendingSort(state.sort as SortOptionKey)
    closeFilter()
  }

  return (
    <UIFilterSlider
      overlayProps={{className: styles.drawer}}
      title={title}
      size="partial"
      direction="leftSide"
      clearBtnProps={{
        variant: 'secondary',
        onClick: () => dispatch({
          type: 'selectFacets',
          payload: [],
        }),
        children:clearButtonLabel,
      }}
      applyBtnProps={{
        variant: 'primary',
        onClick: handleApply,
        children: totalCount ? `Ver todos ${totalCount} produtos` : applyButtonLabel
      }}
      onClose={handleClose}
    >
      <div className={styles.content} data-fs-filter-drawer>
        <div className={styles.sort} data-fs-filter-drawer-sort>
          <Sort
            layout="radio"
            label="Ordenar por"
            value={pendingSort}
            onChange={setPendingSort}
          />
        </div>
        <UIFilter
          testId={`drawer-${drawerTestId}`}
          indicesExpanded={expanded}
          onAccordionChange={(index: number) =>
            dispatch({
              type: 'toggleExpanded',
              payload: index
            })
          }
        >
          {shouldDisplayDeliveryButton && (
            <UIFilterFacets
              key={`${drawerTestId}-delivery-0`}
              testId={drawerTestId}
              index={0}
              type=""
              label={labelsMap[SHIPPING_FACET_KEY] ?? 'Entrega'}
              description={deliveryPromiseSettings?.deliveryMethods?.description}
            >
              <UIButton
                data-fs-filter-list-delivery-button
                variant="secondary"
                onClick={() =>
                  openRegionSlider(regionSliderTypes.setLocation)
                }
                icon={<UIIcon name="MapPin"/>}
              >
                {deliveryPromiseSettings?.deliveryMethods?.setLocationButtonLabel}
              </UIButton>
            </UIFilterFacets>
          )}

          {filteredFacets.map((facet,idx) => {

            const index = shouldDisplayDeliveryButton ? idx + 1 : idx
            const {__typename: type, label,} = facet
            const isExpanded = expanded.has(index)
            const isDeliveryMethodFacet = facet.key === SHIPPING_FACET_KEY
            const isDeliveryOptionFacet = facet.key === DELIVERY_OPTIONS_FACET_KEY
            const sectionLabel = labelsMap[facet.key as keyof typeof labelsMap] ?? label

            return (
                <div
                  key={`${drawerTestId}-${sectionLabel}-${index}`}
                  data-fs-filter-drawer-facet
                  data-facet-key={facet.key}
                >
                  <UIFilterFacets
                    testId={`drawer-${drawerTestId}`}
                    index={index}
                    type={type}
                    label={sectionLabel}
                    description={isDeliveryMethodFacet ? deliveryPromiseSettings?.deliveryMethods?.description : undefined}
                  >
                    {type === 'StoreFacetBoolean' && isExpanded && (
                      <UIFilterFacetBoolean>
                        {facet.values.map((item) =>
                          (item.value !== PICKUP_ALL_FACET_VALUE || isPickupAllEnabled) && (
                            <UIFilterFacetBooleanItem
                              key={`${drawerTestId}-${facet.label}-${item.value}`}
                              id={`${drawerTestId}-${facet.label}-${item.value}`}
                              testId={`drawer-${drawerTestId}`}
                              onFacetChange={(changedFacet) => {
                                onDeliveryFacetChange({
                                  facet: changedFacet,
                                  filterDispatch: dispatch
                                })
                              }}
                              selected={item.selected}
                              value={item.value}
                              quantity={item.quantity ?? 0}
                              facetKey={facet.key}
                              label={
                                isDeliveryMethodFacet ? (
                                  <FilterDeliveryMethodFacet
                                    item={item}
                                    deliveryMethods={deliveryPromiseSettings?.deliveryMethods}
                                  />
                                ) : (
                                  item.label
                                )
                              }
                              type={isDeliveryMethodFacet || isDeliveryOptionFacet ? 'radio' : 'checkbox'}
                            />
                          )
                      )}
                      </UIFilterFacetBoolean>
                    )}

                    
                    {type === 'StoreFacetRange' && isExpanded && (
                        <UIFilterFacetRange
                          facetKey={facet.key}
                          min={facet.min}
                          max={facet.max}
                          formatter={facet.key.toLowerCase() === 'price' ? useFormattedPrice : (value) => String(value)}
                          minLabel={filterFacetRangeSettings?.minLabel}
                          maxLabel={filterFacetRangeSettings?.maxLabel}
                          minPriceErrorMessage={filterFacetRangeSettings?.minPriceErrorMessage}
                          maxPriceErrorMessage={filterFacetRangeSettings?.maxPriceErrorMessage}
                          onFacetChange={(changedFacet) =>
                            dispatch({
                              type:'setFacet',
                              payload: {
                                facet: changedFacet,
                                unique:true
                              }
                            })
                          }
                        />
                      )}
                  </UIFilterFacets>
                </div>
              )
            }
          )}
        </UIFilter>
      </div>
    </UIFilterSlider>
  )
}