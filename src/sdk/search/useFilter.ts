import {
  setFacet,
  toggleFacet,
  toggleFacets,
  useSearch,
} from '@faststore/sdk'

import {
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react'

import type {
  IStoreSelectedFacet,
} from '@faststore/api'

import type {
  Filter_FacetsFragment,
} from '@generated/graphql'

import {
  PLP_FILTER_EXPANDED,
} from '../../constants/store'

interface State {
  expanded: Set<number>
  selected: IStoreSelectedFacet[]
}

type Action =
  | {
      type: 'toggleExpanded'
      payload: number
    }
  | {
      type: 'setExpanded'
      payload: Set<number>
    }
  | {
      type: 'selectFacets'
      payload: IStoreSelectedFacet[]
    }
  | {
      type: 'toggleFacet'
      payload: IStoreSelectedFacet
    }
  | {
      type: 'toggleFacets'
      payload: {
        facets: IStoreSelectedFacet[]
        unique?: boolean
      }
    }
  | {
      type: 'setFacet'
      payload: {
        facet: IStoreSelectedFacet
        unique?: boolean
      }
    }

const reducer = (
  state: State,
  action: Action
) => {
  const {
    expanded,
    selected,
  } = state

  const {
    type,
    payload,
  } = action

  switch (type) {
    case 'toggleExpanded': {
      if (expanded.has(payload)) {
        expanded.delete(payload)
      } else {
        expanded.add(payload)
      }

      return {
        ...state,
        expanded:
          new Set(expanded),
      }
    }

    case 'setExpanded': {
      return {
        ...state,
        expanded: payload,
      }
    }

    case 'selectFacets': {
      if (payload !== selected) {
        return {
          ...state,
          selected: payload,
        }
      }

      break
    }

    case 'toggleFacet': {
      return {
        ...state,
        selected: toggleFacet(
          state.selected,
          payload
        ),
      }
    }

    case 'toggleFacets': {
      return {
        ...state,
        selected: toggleFacets(
          state.selected,
          payload.facets,
          payload.unique
        ),
      }
    }

    case 'setFacet': {
      return {
        ...state,
        selected: setFacet(
          state.selected,
          payload.facet,
          payload.unique
        ),
      }
    }

    default:
      throw new Error(
        `Action ${type} not implemented`
      )
  }

  return state
}

const getInitialExpanded = (
  facets: Filter_FacetsFragment[]
): Set<number> => {
  switch (PLP_FILTER_EXPANDED) {
    case 'all':
      return new Set(
        facets.map(
          (_, index) => index
        )
      )

    case 'first':
      return facets.length > 0
        ? new Set([0])
        : new Set<number>()

    case 'none':
    default:
      return new Set<number>()
  }
}

export const useFilter = (
  allFacets: Filter_FacetsFragment[],
  initialSelectedFacets?:
    IStoreSelectedFacet[]
) => {
  const {
    state: {
      selectedFacets,
    },
  } = useSearch()

  const [
    {
      selected,
      expanded,
    },
    dispatch,
  ] = useReducer(
    reducer,
    null,
    () => ({
      expanded:
        new Set<number>(),
      selected:
        selectedFacets,
    })
  )

  /**
   * Garante que a configuração
   * inicial dos accordions seja
   * aplicada apenas uma vez.
   */
  const hasInitializedExpanded =
    useRef(false)

  const selectedMap = useMemo(
    () =>
      selected.reduce(
        (
          acc,
          facet
        ) => {
          if (
            !acc.has(
              facet.key
            )
          ) {
            acc.set(
              facet.key,
              new Map()
            )
          }

          acc
            .get(facet.key)
            ?.set(
              facet.value,
              facet
            )

          return acc
        },
        new Map() as Map<
          string,
          Map<
            string,
            IStoreSelectedFacet
          >
        >
      ),
    [selected]
  )

  const facets = useMemo(
    () =>
      allFacets.map(
        (facet) => {
          if (
            facet.__typename ===
            'StoreFacetBoolean'
          ) {
            return {
              ...facet,

              values:
                facet.values.map(
                  ({
                    value,
                    ...rest
                  }) => ({
                    ...rest,
                    value,

                    selected:
                      Boolean(
                        selectedMap
                          .get(
                            facet.key
                          )
                          ?.has(
                            value
                          )
                      ),
                  })
                ),
            }
          }

          return facet
        }
      ),
    [
      allFacets,
      selectedMap,
    ]
  )

  /**
   * Define quais grupos começam
   * abertos assim que os facets
   * estiverem disponíveis.
   *
   * Executa apenas uma vez.
   */
  useEffect(() => {
    if (
      hasInitializedExpanded.current ||
      allFacets.length === 0
    ) {
      return
    }

    dispatch({
      type: 'setExpanded',
      payload:
        getInitialExpanded(
          allFacets
        ),
    })

    hasInitializedExpanded.current =
      true
  }, [allFacets])

  /**
   * Restore initial PLP facets
   * after clearing filters.
   */
  useEffect(() => {
    if (
      initialSelectedFacets &&
      selected.length === 0
    ) {
      dispatch({
        type: 'selectFacets',
        payload:
          initialSelectedFacets,
      })
    }
  }, [
    initialSelectedFacets,
    selected,
  ])

  /**
   * Sincroniza os filtros
   * selecionados com a busca.
   */
  useEffect(() => {
    dispatch({
      type: 'selectFacets',
      payload:
        selectedFacets,
    })
  }, [selectedFacets])

  return {
    facets,
    selected,
    expanded,
    dispatch,
  }
}