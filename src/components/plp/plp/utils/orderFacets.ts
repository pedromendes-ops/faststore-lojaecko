/**
 * CMS-configurable ordering + visibility for the PLP/collection filter list.
 *
 * Two independent, composable concerns:
 *   - `hideFacets` (CMS field `filter.hiddenFilter`): removes filter groups
 *     entirely, never rendered (e.g. `Fit`). A visibility concern, not an
 *     ordering one — kept as a sibling of `ordering` in the CMS schema.
 *   - `orderFacets` (CMS field `filter.ordering`): transforms the remaining
 *     filter groups (the accordions in `data-fs-product-listing-filters`) and
 *     the values inside each group (`data-fs-filter-list`) in this order:
 *       - `values`:   sort the values inside each accordion (A-Z / Z-A).
 *       - `groups`:   sort the filter groups (A-Z / Z-A).
 *       - `lastKeys`: filters always pushed to the end (e.g. `Preço`).
 *       - `pinned`:   filters placed at explicit 1-based positions (e.g. put
 *                     `Departamento` 1st and `Cor` 3rd). Applied last, so it
 *                     overrides the alphabetical order and `lastKeys` for
 *                     those.
 *
 * Filters are matched by their **label** (what the merchant sees in the
 * storefront/CMS, e.g. "Departamento", "Preço", "Cor"), case- and
 * accent-insensitive. The technical facet `key` (e.g. "category-1", "price")
 * also matches as a fallback, so older key-based config keeps working.
 *
 * Non-pinned groups keep their (sorted) relative order and fill the gaps left
 * between the pinned positions.
 */

export type FacetOrder = "default" | "asc" | "desc";

/** Places a specific filter group at an explicit 1-based position. */
export interface PinnedFacet {
  /**
   * Filter label as shown in the storefront/CMS (e.g. "Departamento", "Cor",
   * "Preço"). Case- and accent-insensitive; the facet key also matches as a
   * fallback.
   */
  label: string;
  /** 1-based slot in the final list (1 = first). */
  position: number;
}

/** Hides a specific filter group from the list. */
export interface HiddenFacet {
  /**
   * Filter label to hide (e.g. "Fit", "productClusterNames"). Case- and
   * accent-insensitive; the facet key also matches as a fallback.
   */
  label: string;
}

export interface FilterOrdering {
  /** Order of the filter groups (accordions). */
  groups?: FacetOrder;
  /** Order of the values inside each group's accordion. */
  values?: FacetOrder;
  /**
   * Comma-separated filter labels (or keys) that must always stay at the end
   * regardless of ordering (e.g. `Preço`). Case- and accent-insensitive.
   */
  lastKeys?: string;
  /**
   * Explicit positions for specific filter groups. Each entry pins a filter
   * (by label) to a 1-based slot; the remaining groups fill the gaps in their
   * sorted order. Overrides `groups`/`lastKeys` for the listed filters.
   */
  pinned?: PinnedFacet[];
}

type FacetLike = {
  key: string;
  label?: string | null;
  __typename?: string;
  values?: Array<{ label?: string | null } & Record<string, unknown>>;
};

/** Lowercases, trims and strips accents so merchant input matches loosely. */
const normalize = (value?: string | null) =>
  (value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const parseTerms = (raw?: string): Set<string> =>
  new Set(
    (raw ?? "")
      .split(",")
      .map(normalize)
      .filter(Boolean),
  );

/** Builds a normalized term set from an array of `{ label }` entries. */
const parseLabels = (items?: Array<{ label?: string | null }>): Set<string> =>
  new Set((items ?? []).map((item) => normalize(item?.label)).filter(Boolean));

/** A facet matches a term set when its label OR its key is listed. */
const facetMatches = (facet: FacetLike, terms: Set<string>) =>
  terms.has(normalize(facet.label)) || terms.has(normalize(facet.key));

const byLabel =
  (direction: Exclude<FacetOrder, "default">) =>
  (a: { label?: string | null }, b: { label?: string | null }) => {
    const cmp = (a.label ?? "").localeCompare(b.label ?? "", undefined, {
      numeric: true,
      sensitivity: "base",
    });
    return direction === "desc" ? -cmp : cmp;
  };

/**
 * Returns a new facets array (input is never mutated) with the filter groups
 * listed in `hiddenFilter` removed entirely, matched by label (or key as a
 * fallback). Independent from `orderFacets` — call this first so hidden
 * filters are never sorted, pinned or rendered.
 */
export function hideFacets<T extends FacetLike>(
  facets: T[],
  hiddenFilter?: HiddenFacet[],
): T[] {
  const hiddenTerms = parseLabels(hiddenFilter);
  if (!facets?.length || hiddenTerms.size === 0) {
    return facets;
  }

  return facets.filter((facet) => !facetMatches(facet, hiddenTerms));
}

/**
 * Reorders `facets` so the filters listed in `pinned` land on their requested
 * 1-based positions, while every other facet keeps its incoming (already
 * sorted) order and fills the remaining slots.
 *
 * Edge cases are handled gracefully: unknown labels (not in `facets`) are
 * ignored, duplicate/colliding positions are placed consecutively in position
 * order, and positions beyond the list length fall to the end.
 */
function applyPinnedPositions<T extends FacetLike>(
  facets: T[],
  pinned?: PinnedFacet[],
): T[] {
  if (!pinned?.length) {
    return facets;
  }

  // normalized label -> desired 1-based position; keep only valid entries.
  const wanted = new Map<string, number>();
  for (const entry of pinned) {
    const term = normalize(entry?.label);
    const position = Math.trunc(Number(entry?.position));
    if (term && Number.isFinite(position) && position >= 1) {
      wanted.set(term, position);
    }
  }
  if (wanted.size === 0) {
    return facets;
  }

  // Match by label first, then fall back to the facet key.
  const positionFor = (facet: T) =>
    wanted.get(normalize(facet.label)) ?? wanted.get(normalize(facet.key));

  // Split into the facets to pin (present in the list) and the rest, preserving
  // the incoming order of the rest.
  const pinnedFacets: Array<{ facet: T; position: number }> = [];
  const rest: T[] = [];
  for (const facet of facets) {
    const position = positionFor(facet);
    if (position !== undefined) {
      pinnedFacets.push({ facet, position });
    } else {
      rest.push(facet);
    }
  }
  if (pinnedFacets.length === 0) {
    return facets;
  }

  // Lowest position first; ties keep the original facet order (stable sort).
  pinnedFacets.sort((a, b) => a.position - b.position);

  const output: T[] = [];
  let pinnedIndex = 0;
  let restIndex = 0;
  let slot = 1;

  while (pinnedIndex < pinnedFacets.length || restIndex < rest.length) {
    const nextPinned = pinnedFacets[pinnedIndex];

    // Place a pinned facet once its slot is reached (or already passed, which
    // happens on collisions / positions <= current slot).
    if (nextPinned && nextPinned.position <= slot) {
      output.push(nextPinned.facet);
      pinnedIndex++;
      slot++;
      continue;
    }

    // Otherwise fill the slot with the next non-pinned facet.
    if (restIndex < rest.length) {
      output.push(rest[restIndex]);
      restIndex++;
      slot++;
      continue;
    }

    // No non-pinned facets left, but pinned entries with far-off positions
    // remain — append them in position order.
    if (nextPinned) {
      output.push(nextPinned.facet);
      pinnedIndex++;
      slot++;
    }
  }

  return output;
}

/**
 * Returns a new, reordered facets array (input is never mutated). Positional
 * `expanded` indices stay consistent because the filter components derive the
 * accordion index from this same array's order.
 */
export function orderFacets<T extends FacetLike>(
  facets: T[],
  ordering?: FilterOrdering,
): T[] {
  if (!facets?.length || !ordering) {
    return facets;
  }

  const { groups = "default", values = "default", lastKeys, pinned } =
    ordering;
  const lastTerms = parseTerms(lastKeys);

  const hasGroupSort = groups !== "default";
  const hasValueSort = values !== "default";
  const hasPinned = Boolean(pinned?.length);

  if (!hasGroupSort && !hasValueSort && lastTerms.size === 0 && !hasPinned) {
    return facets;
  }

  // 1) Sort values inside each boolean facet (accordion content).
  let result = hasValueSort
    ? facets.map((facet) =>
        facet.__typename === "StoreFacetBoolean" && Array.isArray(facet.values)
          ? ({ ...facet, values: [...facet.values].sort(byLabel(values)) } as T)
          : facet,
      )
    : facets;

  // 2) Sort the groups, keeping the "always last" filters pinned to the end.
  if (hasGroupSort || lastTerms.size > 0) {
    const isLast = (facet: T) => facetMatches(facet, lastTerms);
    const head = result.filter((facet) => !isLast(facet));
    const tail = result.filter((facet) => isLast(facet));

    if (hasGroupSort) {
      head.sort(byLabel(groups));
      tail.sort(byLabel(groups));
    }

    result = [...head, ...tail];
  }

  // 3) Pin specific groups to explicit 1-based positions (overrides the above
  // for the listed filters).
  if (hasPinned) {
    result = applyPinnedPositions(result, pinned);
  }

  return result;
}
