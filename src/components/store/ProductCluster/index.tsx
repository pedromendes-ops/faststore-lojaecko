import {
  PRODUCT_CLUSTERS,
} from '../../../constants/store'

import type {
  ProductClusterProps,
} from './types'

import styles from './ProductCluster.module.scss'

export default function ProductCluster({
  clusters
}: ProductClusterProps) {
  if (!clusters?.length) {
    return null
  }

  const visibleClusters =
    PRODUCT_CLUSTERS.filter(
      (configuredCluster) =>
        configuredCluster.active &&
        clusters.some(
          (productCluster) =>
            String(
              productCluster.id
            ) ===
            String(
              configuredCluster.id
            )
        )
    )

  if (!visibleClusters.length) {
    return null
  }

  return (
    <div
      className={styles.productCluster}
      data-fs-store-product-cluster
    >
      {visibleClusters.map(
        (cluster) => (
          <span
            key={cluster.id}
            className={`
                ${styles.item}
                ${
                cluster.className
                    ? styles[cluster.className]
                    : ''
                }
            `}
            data-fs-store-product-cluster-item
            data-cluster-id={cluster.id}
            >
            {cluster.name}
        </span>
        )
      )}
    </div>
  )
}