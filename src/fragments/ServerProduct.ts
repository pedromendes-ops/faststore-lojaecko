import { gql } from "@faststore/core/api";

//@ts-ignore
export const fragment = gql(`
  fragment ServerProduct on Query {
    product(locator: $locator) {
      slug
      availableInstallments {
        installmentPaymentSystemName
        installmentValue
        installmentInterest
        installmentNumber
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
      isVariantOf {
        additionalProperty {
          name
          value
          valueReference
        }
        skuVariants {
          allVariantProducts {
            sku
            additionalProperty {
              name
              value
            }
            offers {
              offers {
                availability
                quantity
              }
            }
          }
        }
      }
    }
  }
`);
