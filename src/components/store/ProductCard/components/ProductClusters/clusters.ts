import type {
  CollectionTag,
} from '../../../../../types/collectionTag'

export type ProductCluster = {
  id: string
  name: string
}

export function matchClusterBadges(
  clusters:
    | ProductCluster[]
    | null
    | undefined,

  badges:
    | CollectionTag[]
    | null
    | undefined
) {
  if (
    !clusters?.length ||
    !badges?.length
  ) {
    return []
  }

  const clustersById = new Map(
    clusters.map(
      (cluster) => [
        String(cluster.id),
        cluster,
      ]
    )
  )

  return badges.flatMap(
    (badge) => {
      const cluster =
        clustersById.get(
          badge.collectionId
        )

      if (!cluster) {
        return []
      }

      return [
        {
          badge,
          cluster,
        },
      ]
    }
  )
}