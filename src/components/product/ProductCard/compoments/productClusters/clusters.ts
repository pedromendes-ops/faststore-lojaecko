export type ProductClusterBadge = {
  /**
   * Id do cluster (collection) da VTEX. Chamado de `collectionId`, e não
   * `id`, porque o admin do CMS Headless usa a chave "id" internamente para
   * o item da lista — um schema com essa chave tem seu valor sobrescrito
   * por um timestamp ao salvar.
   */
  collectionId: string;
  label?: string;
  color?: string;
};

export const CLUSTER_BADGE_BACKGROUND = "#110B0D";

export const CLUSTER_BADGE_COLOR = "#000000";

export type ProductCluster = {
  id: string;
  name: string;
};

export function matchClusterBadges(
  clusters: ProductCluster[] | null | undefined,
  badges: ProductClusterBadge[] | null | undefined,
) {
  if (!clusters?.length || !badges?.length) {
    return [];
  }

  const byId = new Map(
    clusters.map((cluster) => [String(cluster.id), cluster]),
  );

  return badges.flatMap((badge) => {
    const cluster = byId.get(String(badge.collectionId));

    return cluster ? [{ badge, cluster }] : [];
  });
}
