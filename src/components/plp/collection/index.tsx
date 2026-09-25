import {
  type Facet,
  SearchProvider,
  type SearchState,
  parseSearchState,
  useSearch,
} from "@faststore/sdk";
import { useRouter } from "next/router";
import { useCallback, useMemo, useRef } from "react";

import Section from "src/components/sections/Section";
import { ITEMS_PER_PAGE } from "src/constants";
import { useProductGalleryQuery } from "src/sdk/product/useProductGalleryQuery";
import {
  UseGalleryPageContext,
  useCreateUseGalleryPage,
} from "src/sdk/product/usePageProductsQuery";
import PageProvider, { type PLPContext } from "src/sdk/overrides/PageProvider";
import { getOverridableSection } from "src/sdk/overrides/getOverriddenSection";

// Relative imports: these are store customizations, so the `src/*` alias would
// resolve to the core versions instead of these.
import {
  ProductGalleryUI,
  type ProductGalleryProps,
} from "../plp/productGallery";
// Provides `__experimentalProductCard` ({ Component, props }) to the override
// context that ProductGrid reads — without it ProductCard is undefined.
import { ProductGalleryDefaultComponents } from "../plp/sections/ProductGalleryDefaultComponents";

import type { GalleryContentCard } from "../plp/types/GalleryContentCard"

const USE_MOCK_CONTENT = false

const MOCK_CONTENT_CARDS = [
  {
    active: true,
    position: 4,
    images: [
      {
        image: "https://picsum.photos/1200/700",
        imageMobile: "https://picsum.photos/1200/700",
        imageAlt: "Banner 1",
        link: "/",
        linkLabel: "Ver ofertas",
      },
      {
        image: "https://picsum.photos/1200/700",
        imageMobile: "https://picsum.photos/1200/700",
        imageAlt: "Banner 1",
        link: "/",
        linkLabel: "Ver ofertas",
      }
    ],
    title: "BLACK FRIDAY",
    text: "Até 50% OFF",
    
    columnsDesktop: 3,
    columnsTablet: 2,
    columnsMobile: 2,
    textPosition: "below",
    textAlign: "left",
  },
  {
    active: true,
    position: 8,    
    images: [
      {
        image: "https://picsum.photos/330/440",
        imageMobile: "https://picsum.photos/330/440",
        imageAlt: "Banner 1",
        link: "/",
        linkLabel: "Ver ofertas",
      }
    ],
    title: "",
    text: "",
    columnsDesktop: 1,
    columnsTablet: 1,
    columnsMobile: 1,
    textPosition: "overlay-center",
    textAlign: "center",
  },
] satisfies GalleryContentCard[]

const DEFAULT_SORT: SearchState["sort"] = "score_desc";

/**
 * Facets that scope the gallery internally: the collection id, the availability
 * control facet and the Intelligent Search tuning flags. They're rebuilt from
 * the CMS props on every mount, so they're kept out of the URL — only the
 * shopper's own filters get serialized.
 */
const INTERNAL_FACET_KEYS = new Set([
  "productClusterIds",
  "in-stock",
  "fuzzy",
  "operator",
]);

type UrlSearchState = {
  selectedFacets: Facet[];
  sort: SearchState["sort"];
  page: number;
};

const EMPTY_URL_STATE: UrlSearchState = {
  selectedFacets: [],
  sort: DEFAULT_SORT,
  page: 0,
};

/** Reads back what `formatGalleryUrl` wrote, so a shared/reloaded URL restores. */
function parseUrlSearchState(href: string): UrlSearchState {
  try {
    const { selectedFacets, sort, page } = parseSearchState(
      new URL(href, "http://localhost"),
    );

    return {
      selectedFacets: selectedFacets.filter(
        ({ key }) => !INTERNAL_FACET_KEYS.has(key),
      ),
      sort,
      page,
    };
  } catch {
    // parseSearchState throws on an unknown `sort` value (hand-edited URL).
    return EMPTY_URL_STATE;
  }
}

/**
 * Turns the SDK's serialized search state into the URL for the host page.
 *
 * This section is embeddable on any page, so it can't just dump the SDK's URL:
 * internal scoping facets are dropped, defaults (page 0, default sort, no
 * filters) are omitted so an untouched landing page keeps a clean address, and
 * every unrelated param already on the URL (utm & friends) is preserved.
 */
function formatGalleryUrl(pathname: string, state: URL, currentSearch: string) {
  const serialized = new URLSearchParams(state.search);
  const facetKeys = (serialized.get("facets")?.split(",") ?? []).filter(
    (key) => key && !INTERNAL_FACET_KEYS.has(key),
  );

  const params = new URLSearchParams(currentSearch);
  // Drop every param this gallery owns — including the facet keys written by
  // the previous state, which would otherwise linger after being unselected.
  const previousFacetKeys = params.get("facets")?.split(",") ?? [];
  for (const key of [
    "facets",
    "sort",
    "page",
    ...previousFacetKeys,
    ...facetKeys,
  ]) {
    params.delete(key);
  }

  for (const key of facetKeys) {
    for (const value of serialized.getAll(key)) {
      params.append(key, value);
    }
  }

  if (facetKeys.length > 0) {
    params.set("facets", facetKeys.join(","));
  }

  const sort = serialized.get("sort");
  if (sort && sort !== DEFAULT_SORT) {
    params.set("sort", sort);
  }

  const page = Number(serialized.get("page") ?? "0");
  if (page > 0) {
    params.set("page", String(page));
  }

  const search = params.toString();

  return search ? `${pathname}?${search}` : pathname;
}

export interface CollectionGalleryProps {
  /**
   * VTEX collection (product cluster) id, e.g. "140". Find it under
   * Catalog > Collections in the Admin.
   */
  collectionId: string;
  title?: string;
  totalCountLabel?: ProductGalleryProps["totalCountLabel"];
  itemsPerPage?: number;
  itemsPerRow?: ProductGalleryProps["itemsPerRow"];
  /**
   * @deprecated No-op since @faststore/api 4.5.0 — see `collectionFacets`
   * below. The gallery always follows the store's global
   * `api.hideUnavailableItems`. Kept so the CMS content keeps validating.
   */
  
  filter: ProductGalleryProps["filter"];
  productCard?: ProductGalleryProps["productCard"];
  contentCards?: GalleryContentCard[];
}

type InnerProps = {
  title?: string;
  totalCountLabel?: ProductGalleryProps["totalCountLabel"];
  itemsPerPage: number;
  itemsPerRow?: ProductGalleryProps["itemsPerRow"];
  filter: ProductGalleryProps["filter"];
  productCard?: ProductGalleryProps["productCard"];
  collectionFacets: Facet[];
  contentCards?: GalleryContentCard[]
};

/**
 * Fetches the collection's products/facets client-side from the search state
 * seeded by the parent SearchProvider, then feeds ProductGalleryUI the same
 * context shape the PLP builds (PageProvider data + UseGalleryPageContext), so
 * it renders identically to the PLP gallery.
 */
function CollectionGalleryInner({
  title,
  totalCountLabel,
  itemsPerPage,
  itemsPerRow,
  filter,
  productCard,
  collectionFacets,
  contentCards,
}: InnerProps) {
  const {
    state: { sort, term, selectedFacets },
  } = useSearch();

  const { data: galleryData } = useProductGalleryQuery({
    term: term ?? "",
    sort,
    selectedFacets,
    itemsPerPage,
  });

  const { pages, useGalleryPage } = useCreateUseGalleryPage();

  const totalCount = galleryData?.search?.products?.pageInfo?.totalCount ?? 0;

  // Same context shape ProductListing feeds the PLP: facets + product count
  // for the gallery chrome, `pages` consumed via UseGalleryPageContext.
  const context = useMemo(
    () => ({ data: { ...galleryData, pages } }) as unknown as PLPContext,
    [galleryData, pages],
  );

  return (
    <PageProvider context={context}>
      <UseGalleryPageContext.Provider value={useGalleryPage}>
        <ProductGalleryUI
          title={title ?? ""}
          totalCount={totalCount}
          totalCountLabel={totalCountLabel}
          filter={filter}
          productCard={productCard}
          itemsPerRow={itemsPerRow}
          initialSelectedFacets={collectionFacets}
          contentCards={contentCards}
        />
      </UseGalleryPageContext.Provider>
    </PageProvider>
  );
}

/**
 * Standalone CMS section that renders a VTEX collection as a full PLP-style
 * gallery (grid + filters + sort + numeric pagination). The merchant supplies
 * the collection id; products are fetched client-side scoped to that collection
 * via the `productClusterIds` Intelligent Search facet — the same mechanism used
 * to bind shelves/search to a collection in VTEX IO.
 */
function CollectionGallerySection({
  collectionId,
  title,
  totalCountLabel,
  itemsPerPage,
  itemsPerRow,  
  filter,
  productCard,
  contentCards,
}: CollectionGalleryProps) {
  const perPage =
    itemsPerPage && itemsPerPage > 0 ? itemsPerPage : ITEMS_PER_PAGE;

  const { asPath } = useRouter();

  // Read the URL once. From here on the gallery owns it: `applySearchState`
  // rewrites it with `history.replaceState`, which doesn't re-render and doesn't
  // update `asPath`, so re-parsing later could only clobber the shopper's state.
  // `window.location` is the source of truth on the client — on statically
  // generated pages `asPath` may not carry the query string on the first render.
  const initialUrl = useRef<{ pathname: string; state: UrlSearchState }>();
  if (!initialUrl.current) {
    const href =
      typeof window === "undefined"
        ? asPath
        : `${window.location.pathname}${window.location.search}`;
    const [pathname] = href.split("?");

    initialUrl.current = { pathname, state: parseUrlSearchState(href) };
  }
  const { pathname: basePath, state: urlState } = initialUrl.current;

  // Writes the shopper's filters/sort/page back to the host page URL so it can
  // be shared and survives a reload. `replaceState` (instead of a router push)
  // keeps it out of the history stack and avoids re-rendering the whole page —
  // same approach the core PLP takes in `useApplySearchState`.
  const applySearchState = useCallback((url: URL) => {
    if (typeof window === "undefined") {
      return;
    }

    const { pathname, search } = window.location;
    const next = formatGalleryUrl(pathname, url, search);

    if (next === `${pathname}${search}`) {
      return;
    }

    window.history.replaceState(
      { ...window.history.state, as: next, url: next },
      "",
      next,
    );
  }, []);

  // Scopes the whole gallery to the collection. Kept in a memo so the
  // SearchProvider's initial-state effect doesn't reset user filters on every
  // render (it re-seeds only when this reference changes).
  //
  // `showUnavailableProducts` is disabled: it used to add the `in-stock`
  // control facet (value "false"), which @faststore/api translated into
  // `hideUnavailableItems=false` and then stripped from the Intelligent Search
  // path. Since @faststore/api 4.5.0 the strip list dropped `in-stock`
  // (`shipping`/`delivery-options` were removed on purpose for delivery
  // promise, `in-stock` came along by mistake), so it now leaks into the path
  // as `productClusterIds/560/in-stock/false/` — which matches nothing and
  // returns totalCount 0, leaving the grid stuck on the skeleton forever.
  // Until the strip list is fixed upstream, the gallery falls back to the
  // store's global `api.hideUnavailableItems`.
  const collectionFacets = useMemo<Facet[]>(
    () => [{ key: "productClusterIds", value: String(collectionId ?? "") }],
    [collectionId],
  );

  // `fuzzy`/`operator` mirror the PLP seed so useProductGalleryQuery returns
  // data on the first pass instead of discarding it and refetching.
  // `base` is the host page's path so the SDK serializes state onto this URL
  // (and the gallery's pagination anchors point at real, crawlable addresses).
  // Facets/sort/page found on the URL are restored on top of the scoping facets.
  const searchState = useMemo<Partial<SearchState>>(
    () => ({
      base: basePath,
      term: null,
      page: urlState.page,
      sort: urlState.sort,
      selectedFacets: [
        ...collectionFacets,
        { key: "fuzzy", value: "auto" },
        { key: "operator", value: "and" },
        ...urlState.selectedFacets,
      ],
    }),
    [collectionFacets, basePath, urlState],
  );

  if (!collectionId) {
    return null;
  }

  return (
    <Section className="section-product-gallery layout__section">
      {/* `shouldResetInfiniteScroll` syncs the rendered page with the one seeded
          from the URL — the gallery's own mount effect runs before this provider
          seeds the state, so without it a `?page=2` link would render page 1. */}
      <SearchProvider
        itemsPerPage={perPage}
        onChange={applySearchState}
        shouldResetInfiniteScroll
        {...searchState}
      >
        <CollectionGalleryInner
          title={title}
          totalCountLabel={totalCountLabel}
          itemsPerPage={perPage}
          itemsPerRow={itemsPerRow}
          filter={filter}
          productCard={productCard}
          collectionFacets={collectionFacets}
          
          contentCards={
            USE_MOCK_CONTENT
              ? MOCK_CONTENT_CARDS
              : contentCards
          }
        />
      </SearchProvider>
    </Section>
  );
}

// Wrap in the override context (like the PLP's ProductGalleryCustom) so
// ProductGrid can resolve `__experimentalProductCard` from `useOverrideComponents`.
// Reuses the "ProductGallery" overrides/default components on purpose.
const CollectionGallery = getOverridableSection<
  //@ts-ignore
  typeof CollectionGallerySection
>("ProductGallery", CollectionGallerySection, ProductGalleryDefaultComponents);

export { CollectionGallery };
export default CollectionGallery;