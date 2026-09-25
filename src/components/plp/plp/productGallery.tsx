import { type Facet, formatSearchState, useSearch } from "@faststore/sdk";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from "react";
import {
  Button as UIButton,
  Icon as UIIcon,
  Skeleton as UISkeleton,
} from "@faststore/ui";

import { useUI } from "@faststore/ui";
import Sort from "src/components/search/Sort";
import ProductGridSkeleton from "src/components/skeletons/ProductGridSkeleton";

// Relative import so it resolves to this store's customized ProductCard (the
// `src/*` alias resolves to the core one, which doesn't have our extra props).
import type { ProductCardProps } from "../../product/ProductCard";
import type { FilterSliderProps } from "../../search/Filter/FilterSlider";
import type { SortProps } from "src/components/search/Sort/Sort";
import {
  type PLPContext,
  type SearchPageContext,
  usePage,
} from "src/sdk/overrides/PageProvider";
import { getStoreURL } from "src/sdk/localization/useLocalizationConfig";
import { useProductsPrefetch } from "src/sdk/product/useProductsPrefetch";
import { useDelayedFacets } from "src/sdk/search/useDelayedFacets";
import { useDelayedPagination } from "src/sdk/search/useDelayedPagination";
import { useFilter } from "src/sdk/search/useFilter";
import useScreenResize from "../../common/MyScreenResize";
import FilterSlider from "../../search/Filter/FilterSlider";
import FilterDesktop from "src/components/search/Filter/FilterDesktop";
import FilterSkeleton from "src/components/skeletons/FilterSkeleton";

import Pagination from "./components/pagination";
import { ProductCardConfigProvider } from "./sections/ProductCardConfigContext";
import styles from "./styles.module.scss";
import { OptionsMap } from "./utils/constants";
import {
  type FilterOrdering,
  type HiddenFacet,
  hideFacets,
  orderFacets,
} from "./utils/orderFacets";

import type { GalleryContentCard } from "./types/GalleryContentCard"

/*
const ProductGalleryPage = lazy(
  () => import("src/components/ui/ProductGallery/ProductGalleryPage"),
);
*/
const ProductGalleryPage = lazy(
  () => import("./components/ProductGalleryPage"),
);

const GalleryPageSkeleton = <ProductGridSkeleton loading />;

export interface ProductGalleryProps {
  title?: string;
  searchTerm?: string;
  totalCount?: number;
  searchTermLabel?: string;
  totalCountLabel?: string;
  stateFilter?: boolean;
  contentCards?: GalleryContentCard[];
  filter: {
    title?: string;
    /** CMS-configurable ordering of the filter groups and their values. */
    ordering?: FilterOrdering;
    /** Filter groups removed from the list entirely (matched by label). */
    hiddenFilter?: HiddenFacet[];
    mobileOnly?: {
      filterButton?: {
        label?: string;
        icon?: {
          icon: string;
          alt: string;
        };
      };
      clearButtonLabel: FilterSliderProps["clearButtonLabel"];
      applyButtonLabel: FilterSliderProps["applyButtonLabel"];
    };
  };
  previousPageButton?: {
    label?: string;
    icon?: {
      icon: string;
      alt: string;
    };
  };
  itemsPerPage?: number;
  loadMorePageButton?: {
    label?: string;
  };
  sortBySelector?: SortProps;
  productCard?: Pick<
    ProductCardProps,
    | "showDiscountBadge"
    | "bordered"
    | "taxesConfiguration"
    | "sponsoredLabel"
    | "showProductClusters"
  >;
  itemsPerRow?: 2 | 3;
  /**
   * Facets that scope the gallery and must survive a "clear all" (e.g. the
   * collection's `productClusterIds`). Passed through to `useFilter` so clearing
   * user filters restores these instead of showing the whole catalog. Empty on
   * the PLP/Search (the URL owns the scope there).
   */
  initialSelectedFacets?: Facet[];
}

function ProductGalleryUI({
  title,
  totalCount,
  totalCountLabel,
  stateFilter = false,
  filter: filterCmsData,
  productCard,
  itemsPerRow = 2,
  initialSelectedFacets,
  contentCards,
}: ProductGalleryProps) {
  const ProductGalleryDefaultComponents = {
    MobileFilterButton: UIButton,
    FilterIcon: UIIcon,
    ResultsCountSkeleton: UISkeleton,
    SortSkeleton: UISkeleton,
    FilterButtonSkeleton: UISkeleton,
  } as const;
  const {
    FilterButtonSkeleton,
    FilterIcon,
    MobileFilterButton,
    ResultsCountSkeleton,
    SortSkeleton,
  } = ProductGalleryDefaultComponents;

  const { openFilter, filter: displayFilter } = useUI();
  const { pages, state, setState, resetInfiniteScroll, itemsPerPage } =
    useSearch();
  const context = usePage<SearchPageContext | PLPContext>();
  const data = context?.data;
  const facets = useDelayedFacets(data) ?? [];
  const { next, prev } = useDelayedPagination(totalCount ?? 0);
  const { isDesktop } = useScreenResize();
  const [showFilters, setShowFilters] = useState(true)
  const [collapsed, setCollapsed] = useState(stateFilter)
  const router = useRouter();

  useProductsPrefetch(prev ? prev.cursor : null);
  useProductsPrefetch(next ? next.cursor : null);

  const hasFacetsLoaded = Boolean(data?.search?.facets);
  const hasProductsLoaded = Boolean(data?.search?.products);
  const filter = useFilter(facets, initialSelectedFacets);

  // CMS-configurable visibility + ordering of the filter groups and their
  // accordion values (e.g. hide "Fit", alphabetical A-Z, price always last).
  // `hideFacets` runs first so hidden filters are never sorted, pinned or
  // rendered. Positional `expanded` indices stay valid since the filter
  // components derive the accordion index from this reordered array.
  const orderedFacets = useMemo(() => {
    const visibleFacets = hideFacets(
      filter.facets,
      filterCmsData?.hiddenFilter,
    );
    return orderFacets(visibleFacets, filterCmsData?.ordering);
  }, [filter.facets, filterCmsData?.hiddenFilter, filterCmsData?.ordering]);

  // Numeric pagination: show a single page at a time and jump between pages.
  const perPage = itemsPerPage > 0 ? itemsPerPage : 1;
  const currentPage = state?.page ?? 0;
  const totalPages = Math.ceil((totalCount ?? 0) / perPage);

  const currentContentCards =
  currentPage === 0
    ? contentCards?.filter((card) => card.active !== false)
    : []

  const goToPage = useCallback(
    (page: number) => {
      if (page < 0 || page >= totalPages || page === currentPage) return;
      // resetInfiniteScroll keeps a single page rendered; setState syncs the
      // search state and the `?page=` querystring so the new page is fetched.
      resetInfiniteScroll(page);
      setState({ ...state, page });
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [totalPages, currentPage, resetInfiniteScroll, setState, state],
  );

  // Crawlable URL for a given page (0-based), built with the same serializer
  // the SDK uses for its next/prev links. Lets the Pagination render real
  // `<a href="...?page=N">` anchors (SEO + shareable) while clicks stay SPA.
  const getPageHref = useCallback(
    (page: number) => {
      const url = formatSearchState({ ...state, page });
      return `${url.pathname}${url.search}`;
    },
    [state],
  );

  // Self-referencing canonical for paginated pages. The core PLP template
  // canonicalizes every page to the base path (it drops `?page`), which tells
  // crawlers that pages 2..N are duplicates of page 1 and shouldn't be indexed
  // on their own. Emitting a self-canonical here — next-seo keys the tag as
  // `canonical`, so this later NextSeo overrides the template's — lets each
  // page be indexed distinctly. Page 1 keeps the core's clean canonical, and
  // filter/sort params are intentionally excluded so only real pages canonicalize.
  const paginatedCanonical = useMemo(() => {
    if (currentPage <= 0) return undefined;
    const [routePathname] = router.asPath.split("?");
    // Only self-canonicalize when `?page` is actually addressable on this
    // route, i.e. the search state's base matches the real path (search page
    // and standard category PLPs). Collection landing pages scope by facet on
    // base "/", so their page number isn't part of the route URL — emitting a
    // canonical there would point at the wrong path, so skip it.
    const { pathname: statePathname } = formatSearchState(state);
    if (statePathname !== routePathname) return undefined;
    return `${getStoreURL()}${routePathname}?page=${currentPage}`;
  }, [currentPage, state, router.asPath]);

  useEffect(() => {
    document.body.classList.add("plp-view");
    return () => {
      document.body.classList.remove("plp-view");
    };
  }, []);

  // Numeric pagination renders one page at a time, so collapse any leftover
  // infinite-scroll pages (e.g. restored from session storage) on mount.
  useEffect(() => {
    resetInfiniteScroll(state?.page ?? 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ProductCardConfigProvider
      value={{
        showProductClusters: productCard?.showProductClusters ?? true,
      }}
    >
      <section
        data-testid="product-gallery"
        data-fs-product-listing
        className={styles.section_gallery}
        data-fs-container
        data-grid={itemsPerRow === 3 ? "gridThree" : "gridTwo"}
      >
        {/* Override the core's base-path canonical on paginated pages so each
          page self-references (see `paginatedCanonical`). */}
        {paginatedCanonical && <NextSeo canonical={paginatedCanonical} />}
        {isDesktop && (
          <div className={styles.desk_utils}>
            <button className={styles.btn_filter} onClick={() => setCollapsed((prev) => !prev)}>
              Filtros
            </button>
            <SortSkeleton
              data-fs-product-listing-sort-skeleton
              size={{ width: "auto", height: "1.5rem" }}
              // Dynamic props shouldn't be overridable
              // This decision can be reviewed later if needed
              loading={!hasProductsLoaded}
            >
              <Sort label={"Ordenar por:"} options={OptionsMap} />
            </SortSkeleton>
          </div>
        )}
        <div
          data-fs-product-listing-content-grid
          data-fs-content="product-gallery"
        >
          {/* Desktop: persistent filter column on the left side */}
          {isDesktop && (
            <div className={collapsed ? styles.collapsed : ""} data-fs-product-listing-filters>
              <FilterSkeleton loading={!hasFacetsLoaded}>
                {hasFacetsLoaded && orderedFacets?.length > 0 && (
                  <FilterDesktop
                    {...filter}
                    facets={orderedFacets}
                    title={filterCmsData?.title}
                  />
                )}
              </FilterSkeleton>
            </div>
          )}

          {/* Mobile: filters open inside a slide-over sidebar */}
          {!isDesktop && displayFilter && (
            <div data-fs-product-listing-filters>
              <FilterSlider
                {...filter}
                facets={orderedFacets}
                title={filterCmsData?.title}
                clearButtonLabel={filterCmsData?.mobileOnly?.clearButtonLabel}
                applyButtonLabel={filterCmsData?.mobileOnly?.applyButtonLabel}
              />
            </div>
          )}

          <div data-fs-product-listing-sort className={styles.sort_container}>
            <FilterButtonSkeleton
              data-fs-product-listing-filter-button-skeleton
              size={{ width: "100%", height: "56px" }}
              // Dynamic props shouldn't be overridable
              // This decision can be reviewed later if needed
              loading={!hasFacetsLoaded}
            >
              {hasFacetsLoaded && orderedFacets?.length > 0 && (
                <MobileFilterButton
                  variant="tertiary"
                  data-testid="open-filter-button"
                  className={styles.filter_button}
                  icon={
                    <FilterIcon
                      width={16}
                      height={16}
                      name={
                        filterCmsData?.mobileOnly?.filterButton?.icon?.icon ??
                        ""
                      }
                      aria-label={
                        filterCmsData?.mobileOnly?.filterButton?.icon?.alt ?? ""
                      }
                    />
                  }
                  iconPosition="left"
                  // Dynamic props shouldn't be overridable
                  // This decision can be reviewed later if needed
                  onClick={openFilter}
                >
                  {filterCmsData?.mobileOnly?.filterButton?.label}
                </MobileFilterButton>
              )}
            </FilterButtonSkeleton>
            {!isDesktop && (
              <SortSkeleton
                data-fs-product-listing-sort-skeleton
                size={{ width: "auto", height: "1.5rem" }}
                // Dynamic props shouldn't be overridable
                // This decision can be reviewed later if needed
                loading={!hasProductsLoaded}
              >
                <Sort label={"Ordenar por:"} options={OptionsMap} />
              </SortSkeleton>
            )}
          </div>

          <div className={collapsed ? styles.allcollapsed : ""} data-fs-product-listing-results>
            {/* SEO: keep rel=prev/next link hints for crawlers */}
            {prev !== false && (
              <NextSeo
                additionalLinkTags={[{ rel: "prev", href: prev.link }]}
              />
            )}
            {next !== false && (
              <NextSeo
                additionalLinkTags={[{ rel: "next", href: next.link }]}
              />
            )}
            {/* Render the current page of products */}
            {hasProductsLoaded ? (
              <Suspense fallback={GalleryPageSkeleton}>
                {pages.map((page) => (
                  <ProductGalleryPage
                    key={`gallery-page-${page}`}
                    page={page}
                    title={title ?? ""}
                    productCard={productCard}
                    itemsPerPage={itemsPerPage}
                    firstPage={pages[0]}
                    contentCards={currentContentCards}
                  />
                ))}
              </Suspense>
            ) : (
              GalleryPageSkeleton
            )}

            {/* Numeric pagination + total product count */}
            {hasProductsLoaded && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
                getPageHref={getPageHref}
              />
            )}
            {hasProductsLoaded && (
              <p className={styles.total_count}>
                {totalCount} {totalCountLabel}
              </p>
            )}
          </div>
        </div>
      </section>
    </ProductCardConfigProvider>
  );
}

export { ProductGalleryUI };
