import { gql } from '@faststore/core/api'

// @ts-ignore
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
            productClusters {
              id
              name
            }

            availableInstallments {
              installmentPaymentSystemName
              installmentValue
              installmentInterest
              installmentNumber
            }
          }
        }
      }
    }
  }
`)