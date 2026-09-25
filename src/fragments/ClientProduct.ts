import { gql } from '@faststore/core/api'

// @ts-ignore
export const fragment = gql(`
  fragment ClientProduct on Query {
    product(locator: $locator) {
      slug

      availableInstallments {
        installmentPaymentSystemName
        installmentValue
        installmentInterest
        installmentNumber
      }

      isVariantOf {
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
`)