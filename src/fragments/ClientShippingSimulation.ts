import { gql } from "@faststore/core/api";

/**
 * Overrides the native `ClientShippingSimulation` fragment (spread into the
 * core `ClientShippingSimulationQuery`) so the shipping simulation also returns
 * the concrete delivery date (`shippingEstimateDate`) and neighborhood/city.
 *
 * The native query only exposes the relative estimate ("9bd" / English
 * `localizedEstimates`); pulling `shippingEstimateDate` lets the custom PDP
 * render an exact PT-BR date ("Você receberá até Quarta-feira, dia 08/07")
 * instead of computing business days on the client. Fields merge with the
 * query's existing `shipping { logisticsInfo { slas { ... } } }` selection.
 */
//@ts-ignore
export const fragment = gql(`
  fragment ClientShippingSimulation on Query {
    shipping(items: $items, postalCode: $postalCode, country: $country) {
      logisticsInfo {
        slas {
          shippingEstimateDate
        }
      }
      address {
        city
        neighborhood
        state
      }
    }
  }
`)
