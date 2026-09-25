// Caminho relativo: é um hook só desta loja (não existe no core), mesmo caminho
// que o useWishlist usa.
import { useCollectionTags } from "../../../../../sdk/globalSections/useCollectionTags";

import {
  CLUSTER_BADGE_BACKGROUND,
  CLUSTER_BADGE_COLOR,
  matchClusterBadges,
  type ProductCluster,
  type ProductClusterBadge,
} from "./clusters";

import styles from "./styles.module.scss";

export type { ProductCluster, ProductClusterBadge };

type ProductClustersProps = {
  /** `productClusters` do produto, como vem da Intelligent Search. */
  clusters?: ProductCluster[] | null;
  /**
   * Quantas tags exibir no máximo. O padrão é 1: um produto costuma estar em
   * dezenas de clusters, e a ordem cadastrada no CMS é a prioridade.
   */
  limit?: number;
};

/**
 * Tags de cluster sobre a foto do ProductCard, ao lado do badge de desconto.
 *
 * Renderiza apenas os clusters cadastrados no CMS que o produto realmente tem.
 * Sem match, não renderiza nada (nem um wrapper vazio).
 */
export function ProductClusters({ clusters, limit = 1 }: ProductClustersProps) {
  // Cadastro único em Global Sections → CollectionTag, uma seção por coleção.
  // O SWR deduplica a query, então uma vitrine inteira faz uma requisição só.
  const badges = useCollectionTags();

  const matches = matchClusterBadges(clusters, badges).slice(0, limit);

  if (!matches.length) {
    return null;
  }

  return (
    <>
      {matches.map(({ badge, cluster }) => (
        <span
          key={badge.collectionId}
          className={styles.clusterBadge}
          data-fs-product-cluster-badge
          data-cluster-id={badge.collectionId}
          // as cores são dado de configuração, não estilo de tema: cada tag tem
          // a sua cor de texto (vinda do CMS), então vão inline mesmo
          style={{
            color: badge.color ?? CLUSTER_BADGE_COLOR,
          }}
        >
          {badge.label ?? cluster.name}
        </span>
      ))}
    </>
  );
}

export default ProductClusters;
