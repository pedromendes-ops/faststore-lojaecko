import type {
  StoreProductRoot,
} from '@faststore/core/api'

type ProductCluster = {
  id: string | number
  name: string
}

const toClusterArray = (
  clusters?: unknown
): ProductCluster[] => {
  if (!clusters) {
    return []
  }

  if (Array.isArray(clusters)) {
    return clusters
      .filter(
        (
          cluster
        ): cluster is Record<
          string,
          unknown
        > =>
          Boolean(cluster) &&
          typeof cluster === 'object'
      )
      .map((cluster) => ({
        id: String(
          cluster.id ?? ''
        ),
        name: String(
          cluster.name ?? ''
        ),
      }))
      .filter(
        (cluster) =>
          Boolean(cluster.id)
      )
  }

  if (
    typeof clusters === 'object'
  ) {
    return Object.entries(
      clusters as Record<
        string,
        unknown
      >
    ).map(([id, name]) => ({
      id,
      name: String(name ?? ''),
    }))
  }

  return []
}

const productResolver = {
  StoreProduct: {
    availableInstallments: (
      root: StoreProductRoot
    ) => {
      const installments =
        root.sellers?.[0]
          ?.commertialOffer
          ?.Installments

      if (!installments?.length) {
        return []
      }

      return installments.map(
        (installment) => ({
          installmentPaymentSystemName:
            installment.PaymentSystemName,

          installmentValue:
            installment.Value,

          installmentInterest:
            installment.InterestRate,

          installmentNumber:
            installment.NumberOfInstallments,
        })
      )
    },

    productClusters: (
      root: StoreProductRoot
    ) => {
      const product =
        root as StoreProductRoot & {
          productClusters?: unknown

          isVariantOf?: {
            productClusters?: unknown
          }
        }

      return toClusterArray(
        product.isVariantOf
          ?.productClusters ??
          product.productClusters
      )
    },
  },
}

export default productResolver