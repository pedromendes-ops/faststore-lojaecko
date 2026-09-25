import { gql } from "@faststore/core/api";

//@ts-ignore
export const fragment = gql(`
  fragment ClientManyProducts on Query {
    search(
      first: $first
      after: $after
      sort: $sort
      term: $term
      selectedFacets: $selectedFacets
      sponsoredCount: $sponsoredCount
    ) {
      products {
        pageInfo {
          totalCount
        }
        edges {
          node {
            availableInstallments {
              installmentNumber
              installmentValue
              installmentInterest
              installmentPaymentSystemName
            }
            productClusters {
              id
              name
            }
            clusterHighlights {
              id
              name
            }
            similars {
              productId
              sku
              slug
              colorName
              colorHex
              image
            }
          }
        }
      }
    }
  }
`);
