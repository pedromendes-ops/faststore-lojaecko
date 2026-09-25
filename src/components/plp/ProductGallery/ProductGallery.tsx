'use client'

import {Suspense, lazy, useCallback, useEffect, useMemo, useState} from 'react'
import {formatSearchState, useSearch} from '@faststore/sdk'
import {
  Button as UIButton,
  Icon as UIIcon,
  useUI,
} from '@faststore/ui'

import {hideFacets, orderFacets} from '../utils/orderFacets'

import { PLP_NATIVE_FILTER } from '../../../constants/store'

import {
  type PLPContext,
  type SearchPageContext,
  usePage,
} from 'src/sdk/overrides/PageProvider'

import {
  useProductsPrefetch,
} from 'src/sdk/product/useProductsPrefetch'

import {
  useDelayedFacets,
} from 'src/sdk/search/useDelayedFacets'

import {
  useDelayedPagination,
} from 'src/sdk/search/useDelayedPagination'

import { useFilter} from '../../../sdk/search/useFilter'

import ProductGridSkeleton from 'src/components/skeletons/ProductGridSkeleton'

import useScreenResize from '../../../hooks/useScreenResize'

import ProductGalleryFilters from './components/Filters/ProductGalleryFilters'
import Sort from './components/Sort'
import Pagination from './components/Pagination'
import EmptyGallery from './components/EmptyGallery'

import type {
  ProductGalleryProps,
} from './types'

import {
  GridHorizontalIcon,
  GridVerticalIcon,
  FilterIcon,
} from './plp.icons'

import styles from './ProductGallery.module.scss'

const ProductGalleryPage = lazy(
  () =>
    import(
      './components/ProductGalleryPage'
    )
)

const GalleryPageSkeleton = (
  <ProductGridSkeleton loading />
)

export function ProductGalleryUI({
  title,
  totalCount = 0,
  config,
  labels,
  filter: filterCmsData,
  contentCards,

}: ProductGalleryProps) {
  
  const {
    columnsDesktop = 4,
    filtersOpen: initialFiltersOpen = true,
  } = config ?? {}
  
  const {
    filter: filterLabel = 'Filtrar', 
    results: resultsLabel = 'Resultados'
  } = labels ?? {}

  const { openFilter, filter: displayFilter} = useUI()

  // estado da busca
  const { pages, state, setState, resetInfiniteScroll, itemsPerPage } = useSearch()

  useEffect(() => {
    resetInfiniteScroll(
      state?.page ?? 0
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const context = usePage<SearchPageContext | PLPContext>()
  const data = context?.data
  const facets = useDelayedFacets(data) ?? []
  const { next, prev } = useDelayedPagination(totalCount)
  const filter = useFilter(facets)

  // Remove filtros ocultos e aplica
  const orderedFacets = useMemo(() => {

      const visibleFacets = hideFacets(filter.facets, filterCmsData?.hiddenFilter)
      return orderFacets(visibleFacets, filterCmsData?.ordering)

  }, [filter.facets, filterCmsData?.hiddenFilter, filterCmsData?.ordering])

  const {isDesktop} = useScreenResize()

  const [filtersOpen, setFiltersOpen] = useState(initialFiltersOpen)
  const hasDesktopSidebarOpen = PLP_NATIVE_FILTER && isDesktop && filtersOpen

  // COLUNAS DO GRID
  const [columns, setColumns] = useState<3 | 4>(columnsDesktop)
  const hasFacetsLoaded = Boolean(data?.search?.facets)
  const hasProductsLoaded = Boolean(data?.search?.products)

  // PREFETCH
  useProductsPrefetch(prev ? prev.cursor : null)
  useProductsPrefetch(next ? next.cursor : null)

  // PAGINAÇÃO
  const perPage = itemsPerPage > 0 ? itemsPerPage : 1
  const currentPage = state?.page ?? 0
  const totalPages = Math.ceil(totalCount / perPage)
  const goToPage = useCallback(( page: number ) => {

    if (page < 0 || page >= totalPages || page === currentPage) {
      return
    }

    resetInfiniteScroll(page)
    setState({...state, page})

    // Retorna ao topo        
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  },[currentPage, resetInfiniteScroll, setState, state, totalPages])

  // URL REAL DA PÁGINA
  const getPageHref = useCallback((page: number) => {
    const url = formatSearchState({...state, page})
    return `${url.pathname}${url.search}`
  },[state])

  return (
    <section
        className={styles.gallery}
        data-testid="product-gallery"
        data-fs-product-listing
        data-columns={columns}
        data-filters-open={
          PLP_NATIVE_FILTER
            ? hasDesktopSidebarOpen
              ? 'true'
              : 'false'
            : undefined
        }
      >

      {/*
      * ---------------------------------------------
      * HEADER
      * ---------------------------------------------
      */}
      <header className={styles.header}>
        {title && (
          <h1 className={styles.title}>
            {title}
          </h1>
        )}
      </header>

      {/*
      * ---------------------------------------------
      * TOOLBAR DESKTOP
      * ---------------------------------------------
      */}
      <div className={`flex items-center ${styles.toolbar}`} data-fs-product-listing-sort>
        <div className={styles.toolbarLeft}
        >
          
          {isDesktop && (
            <button
              type="button"
              className={styles.filterToggle}
              aria-expanded={
                PLP_NATIVE_FILTER
                  ? filtersOpen
                  : displayFilter
              }
              onClick={() => {
                if (PLP_NATIVE_FILTER) {
                  setFiltersOpen(
                    (current) => !current
                  )

                  return
                }

                openFilter()
              }}
            >
              <FilterIcon />

              <span>
                {PLP_NATIVE_FILTER
                  ? filtersOpen
                    ? `Ocultar ${filterLabel}`
                    : `Exibir ${filterLabel}`
                  : filterLabel}
              </span>
            </button>
          )}
        </div>

        <div className={styles.toolbarCenter}>
          <span className={styles.resultsCount}>
            {totalCount}{' '}
            {resultsLabel}
          </span>
        </div>
        
        <div className={`flex items-center ${styles.toolbarRight}`}>

          {/* GRID 3 / 4 PRODUTOS */}
          {isDesktop && (
            <div className={styles.gridSelector} aria-label="Produtos por linha">
              <button
                type="button"
                aria-label="Exibir 3 produtos por linha"
                aria-pressed={columns === 3}
                onClick={
                  () => setColumns(3)
                }
              >
                <GridHorizontalIcon />
              </button>

              <button
                type="button"
                aria-label="Exibir 4 produtos por linha"
                aria-pressed={columns === 4}
                onClick={() =>
                  setColumns(4)
                }
              >
                <GridVerticalIcon />
              </button>
            </div>
          )}

          {/* ORDENAÇÃO DESKTOP */}
          {isDesktop && (
            <div className={styles.orderSelector}>
              <Sort layout="custom-select" label="Ordenar por"/>
            </div>
          )}
        </div>
      </div>

      {/*
      * ---------------------------------------------
      * CONTENT
      * ---------------------------------------------
      */}
      <div
        className={`${styles.content} ${hasDesktopSidebarOpen ? styles.filtersOpen : ''}`}
        data-fs-product-listing-content-grid
        data-fs-content="product-gallery"
      >
        <ProductGalleryFilters
          filter={filter}
          facets={orderedFacets}
          title={filterCmsData?.title}
          clearButtonLabel={
            filterCmsData?.mobileOnly?.clearButtonLabel
          }
          applyButtonLabel={
            filterCmsData?.mobileOnly?.applyButtonLabel
          }
          totalCount={totalCount}
          hasFacetsLoaded={hasFacetsLoaded}
          displayFilter={displayFilter}
          filtersOpen={filtersOpen}
        />

        {/*
        * ---------------------------------------------
        * PRODUCTS
        * ---------------------------------------------
        */}
        <main className={styles.results} data-fs-product-listing-results>
          {!isDesktop && (
            /*
            * ---------------------------------------------
            * TOOBAR MOBILE
            * ---------------------------------------------
            */
            <div className={styles.mobileToolbar}>
              {/* filtro */}
              <div className={styles.filterButton}>
                <UIButton
                  variant="tertiary"
                  onClick={openFilter}
                  icon={
                    <UIIcon
                      width={16}
                      height={16}
                      name={filterCmsData?.mobileOnly?.filterButton?.icon?.icon ?? 'FadersHorizontal'}
                      aria-label={filterCmsData?.mobileOnly?.filterButton?.icon?.alt ?? 'Abrir filtros'}
                    />
                  }
                  iconPosition="left"
                >
                  {filterCmsData?.mobileOnly?.filterButton?.label ?? filterLabel}
                </UIButton>
              </div>
              
              {/* ordenar */}
              <div className={styles.orderSelector}>
                <Sort layout="select" label="Ordenar por"/>
              </div>
            </div>
          )}

          {/*
           * ---------------------------------------------
           * GRID
           * ---------------------------------------------
           */}
          {hasProductsLoaded ? (totalCount === 0 ? (
            <EmptyGallery />
          ) : (
            <Suspense fallback={GalleryPageSkeleton}>
              {pages.map((page) => (
                <ProductGalleryPage
                  key={`gallery-page-${page}`}
                  page={page}
                  title={title ?? ''}
                  itemsPerPage={itemsPerPage}
                  firstPage={pages[0]}
                  contentCards={contentCards}
                />
              )
            )}
              </Suspense>
            )
          ) : (
            GalleryPageSkeleton
          )}

          {/*
           * ---------------------------------------------
           * PAGINAÇÃO
           * ---------------------------------------------
           */}
          {hasProductsLoaded && totalCount > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                itemsPerPage={itemsPerPage}
                onPageChange={goToPage}
                getPageHref={getPageHref}
              />
            )}
        </main>
      </div>
    </section>
  )
}

export default ProductGalleryUI