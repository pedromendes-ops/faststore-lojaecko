export type FacetOrder =
  | 'default'
  | 'asc'
  | 'desc'

export interface PinnedFacet {
  label: string
  position: number
}

export interface HiddenFacet {
  label: string
}

export interface FilterOrdering {
  /**
   * Ordenação dos grupos de filtros.
   */
  groups?: FacetOrder

  /**
   * Ordenação dos valores dentro
   * de cada filtro.
   */
  values?: FacetOrder

  /**
   * Labels ou keys separados por vírgula
   * que devem permanecer no final.
   *
   * Exemplo:
   * "Preço,Disponibilidade"
   */
  lastKeys?: string

  /**
   * Filtros fixados em posições específicas.
   */
  pinned?: PinnedFacet[]
}

type FacetLike = {
  key: string
  label?: string | null
  __typename?: string

  values?: Array<
    {
      label?: string | null
    } & Record<string, unknown>
  >
}

/**
 * Normaliza strings para comparação.
 *
 * "Preço" -> "preco"
 * "MARCA" -> "marca"
 */
const normalize = (
  value?: string | null
) =>
  (value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )

const parseTerms = (
  raw?: string
): Set<string> =>
  new Set(
    (raw ?? '')
      .split(',')
      .map(normalize)
      .filter(Boolean)
  )

const parseLabels = (
  items?: Array<{
    label?: string | null
  }>
): Set<string> =>
  new Set(
    (items ?? [])
      .map((item) =>
        normalize(item?.label)
      )
      .filter(Boolean)
  )

/**
 * Procura tanto pelo label quanto
 * pela key técnica da facet.
 */
const facetMatches = (
  facet: FacetLike,
  terms: Set<string>
) =>
  terms.has(
    normalize(facet.label)
  ) ||
  terms.has(
    normalize(facet.key)
  )

const byLabel =
  (
    direction:
      Exclude<
        FacetOrder,
        'default'
      >
  ) =>
  (
    a: {
      label?: string | null
    },
    b: {
      label?: string | null
    }
  ) => {
    const comparison =
      (a.label ?? '')
        .localeCompare(
          b.label ?? '',
          undefined,
          {
            numeric: true,
            sensitivity: 'base',
          }
        )

    return direction === 'desc'
      ? -comparison
      : comparison
  }

/**
 * Remove filtros configurados
 * como ocultos.
 */
export function hideFacets<
  T extends FacetLike
>(
  facets: T[],
  hiddenFilter?: HiddenFacet[]
): T[] {
  const hiddenTerms =
    parseLabels(hiddenFilter)

  if (
    !facets?.length ||
    hiddenTerms.size === 0
  ) {
    return facets
  }

  return facets.filter(
    (facet) =>
      !facetMatches(
        facet,
        hiddenTerms
      )
  )
}

/**
 * Posiciona filtros em posições
 * específicas.
 */
function applyPinnedPositions<
  T extends FacetLike
>(
  facets: T[],
  pinned?: PinnedFacet[]
): T[] {
  if (!pinned?.length) {
    return facets
  }

  const wanted =
    new Map<string, number>()

  for (const entry of pinned) {
    const term =
      normalize(entry?.label)

    const position =
      Math.trunc(
        Number(entry?.position)
      )

    if (
      term &&
      Number.isFinite(position) &&
      position >= 1
    ) {
      wanted.set(
        term,
        position
      )
    }
  }

  if (wanted.size === 0) {
    return facets
  }

  const positionFor = (
    facet: T
  ) =>
    wanted.get(
      normalize(facet.label)
    ) ??
    wanted.get(
      normalize(facet.key)
    )

  const pinnedFacets: Array<{
    facet: T
    position: number
  }> = []

  const rest: T[] = []

  for (const facet of facets) {
    const position =
      positionFor(facet)

    if (
      position !== undefined
    ) {
      pinnedFacets.push({
        facet,
        position,
      })
    } else {
      rest.push(facet)
    }
  }

  if (
    pinnedFacets.length === 0
  ) {
    return facets
  }

  pinnedFacets.sort(
    (a, b) =>
      a.position - b.position
  )

  const output: T[] = []

  let pinnedIndex = 0
  let restIndex = 0
  let slot = 1

  while (
    pinnedIndex <
      pinnedFacets.length ||
    restIndex < rest.length
  ) {
    const nextPinned =
      pinnedFacets[pinnedIndex]

    if (
      nextPinned &&
      nextPinned.position <= slot
    ) {
      output.push(
        nextPinned.facet
      )

      pinnedIndex++
      slot++

      continue
    }

    if (
      restIndex < rest.length
    ) {
      output.push(
        rest[restIndex]
      )

      restIndex++
      slot++

      continue
    }

    if (nextPinned) {
      output.push(
        nextPinned.facet
      )

      pinnedIndex++
      slot++
    }
  }

  return output
}

/**
 * Ordena grupos e valores das facets.
 */
export function orderFacets<
  T extends FacetLike
>(
  facets: T[],
  ordering?: FilterOrdering
): T[] {
  if (
    !facets?.length ||
    !ordering
  ) {
    return facets
  }

  const {
    groups = 'default',
    values = 'default',
    lastKeys,
    pinned,
  } = ordering

  const lastTerms =
    parseTerms(lastKeys)

  const hasGroupSort =
    groups !== 'default'

  const hasValueSort =
    values !== 'default'

  const hasPinned =
    Boolean(pinned?.length)

  if (
    !hasGroupSort &&
    !hasValueSort &&
    lastTerms.size === 0 &&
    !hasPinned
  ) {
    return facets
  }

  /**
   * 1. Ordena os valores internos.
   */
  let result =
    hasValueSort
      ? facets.map(
          (facet) =>
            facet.__typename ===
              'StoreFacetBoolean' &&
            Array.isArray(
              facet.values
            )
              ? ({
                  ...facet,
                  values: [
                    ...facet.values,
                  ].sort(
                    byLabel(
                      values
                    )
                  ),
                } as T)
              : facet
        )
      : facets

  /**
   * 2. Ordena os grupos.
   */
  if (
    hasGroupSort ||
    lastTerms.size > 0
  ) {
    const isLast = (
      facet: T
    ) =>
      facetMatches(
        facet,
        lastTerms
      )

    const head =
      result.filter(
        (facet) =>
          !isLast(facet)
      )

    const tail =
      result.filter(
        (facet) =>
          isLast(facet)
      )

    if (hasGroupSort) {
      head.sort(
        byLabel(groups)
      )

      tail.sort(
        byLabel(groups)
      )
    }

    result = [
      ...head,
      ...tail,
    ]
  }

  /**
   * 3. Aplica posições fixas.
   */
  if (hasPinned) {
    result =
      applyPinnedPositions(
        result,
        pinned
      )
  }

  return result
}