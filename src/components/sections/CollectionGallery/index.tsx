'use client'

import {
  type Facet,
  SearchProvider,
  useSearch,
} from '@faststore/sdk'

import {
  useMemo,
} from 'react'

import {
  useProductGalleryQuery,
} from 'src/sdk/product/useProductGalleryQuery'

import {
  UseGalleryPageContext,
  useCreateUseGalleryPage,
} from 'src/sdk/product/usePageProductsQuery'

import PageProvider, {
  type PLPContext,
} from 'src/sdk/overrides/PageProvider'

import {
  getOverridableSection,
} from 'src/sdk/overrides/getOverriddenSection'

import ProductGalleryUI from '../../plp/ProductGallery/ProductGallery'

import {
  ProductGalleryDefaultComponents,
} from '../../plp/ProductGallery/ProductGalleryDefaultComponents'

import type {
  CollectionGalleryProps,
} from './types'

const DEFAULT_ITEMS_PER_PAGE = 12

type CollectionGalleryInnerProps = {
  title?: string
  filter: CollectionGalleryProps['filter']
  itemsPerPage: number
  contentCards?: CollectionGalleryProps['contentCards']
}

function CollectionGalleryInner({
  title,
  filter,
  itemsPerPage,
  contentCards
}: CollectionGalleryInnerProps) {
  const {
    state: {
      sort,
      term,
      selectedFacets,
    },
  } = useSearch()

  const {
    data: galleryData,
  } = useProductGalleryQuery({
    term: term ?? '',
    sort,
    selectedFacets,
    itemsPerPage,
  })

  const {
    pages,
    useGalleryPage,
  } = useCreateUseGalleryPage()

  const totalCount =
    galleryData
      ?.search
      ?.products
      ?.pageInfo
      ?.totalCount ?? 0

  const context =
    useMemo(
      () =>
        ({
          data: {
            ...galleryData,
            pages,
          },
        }) as unknown as PLPContext,
      [
        galleryData,
        pages,
      ]
    )

  return (
    <PageProvider
      context={context}
    >
      <UseGalleryPageContext.Provider
        value={useGalleryPage}
      >
        <ProductGalleryUI
          title={title ?? ''}
          totalCount={totalCount}
          filter={filter}
          contentCards={contentCards}
        />
      </UseGalleryPageContext.Provider>
    </PageProvider>
  )
}

function CollectionGallerySection({
  collectionId,
  title,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
  filter,
  contentCards,
}: CollectionGalleryProps) {
  const perPage =
    itemsPerPage > 0
      ? itemsPerPage
      : DEFAULT_ITEMS_PER_PAGE

    /*MOCK TEMPORÁRIO BANNERS */
    /*
    const mockContentCards: CollectionGalleryProps['contentCards'] = [
    {
        active: true,
        position: 5,

        images: [
        {
            image:
            'https://picsum.photos/1200/700',
            imageMobile:
            'https://picsum.photos/800/800',
            imageAlt:
            'Banner teste',
            link: '/',
            linkLabel:
            'Ver ofertas',
        },
        ],

        title: 'BLACK FRIDAY',
        text: 'Até 50% OFF',

        columnsDesktop: 2,
        columnsTablet: 1,
        columnsMobile: 1,

        textPosition: 'below',
        textAlign: 'left',
    },
    ]
    */

  const collectionFacets =
    useMemo<Facet[]>(
      () => [
        {
          key: 'productClusterIds',
          value: String(
            collectionId ?? ''
          ),
        },
      ],
      [
        collectionId,
      ]
    )

  const searchState =
    useMemo(
      () => ({
        term: null,

        selectedFacets: [
          ...collectionFacets,

          {
            key: 'fuzzy',
            value: 'auto',
          },

          {
            key: 'operator',
            value: 'and',
          },
        ],
      }),
      [
        collectionFacets,
      ]
    )

  if (!collectionId) {
    return null
  }

  return (
    <div className="wrap">
      <div className="container">
        <SearchProvider
          itemsPerPage={perPage}
          {...searchState}
        >
          <CollectionGalleryInner
            title={title}
            filter={filter}
            itemsPerPage={perPage}
            contentCards={contentCards}
            //contentCards={mockContentCards} mocks temporário
          />
        </SearchProvider>
      </div>
    </div>
  )
}

const CollectionGallery =
  getOverridableSection<
    // @ts-ignore FastStore section typing
    typeof CollectionGallerySection
  >(
    'ProductGallery',
    CollectionGallerySection,
    ProductGalleryDefaultComponents
  )

export {
  CollectionGallery,
}

export default CollectionGallery