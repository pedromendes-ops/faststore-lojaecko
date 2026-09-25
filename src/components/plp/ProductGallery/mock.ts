import type {
  ProductGalleryConfiguration,
  ProductGalleryLabels,
  ProductGalleryProps,
} from './types'

export const mockProductGalleryConfig:
  ProductGalleryConfiguration = {
    columnsDesktop: 4,
    filtersOpen: true,
  }

export const mockProductGalleryLabels:
  ProductGalleryLabels = {
    filter: 'Filtrar',
    results: 'Resultados',
  }

export const mockProductGalleryFilter:
  ProductGalleryProps['filter'] = {
    title: 'Filtros',

    ordering: {
      groups: 'default',
      values: 'default',
      lastKeys: 'Preço',
      pinned: [
        {
          label: 'Marca',
          position: 1,
        },
      ],
    },

    hiddenFilter: [
      {
        label: 'Departamento',
      },
    ],

    mobileOnly: {
      filterButton: {
        label: 'Filtrar',
        icon: {
          icon: 'FadersHorizontal',
          alt: 'Abrir filtros',
        },
      },

      clearButtonLabel:
        'Limpar filtros',

      applyButtonLabel:
        'Aplicar',
    },
  }