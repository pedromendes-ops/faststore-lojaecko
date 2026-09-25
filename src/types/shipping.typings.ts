export interface shippingSimulation {
  address: Address;
  logisticsInfo: LogisticsInfo[];
}

export interface Address {
  city: string;
  neighborhood: string;
  state: string;
}

export interface LogisticsInfo {
  slas: Sla[];
}

export interface Sla {
  availableDeliveryWindows: any[];
  carrier: string;
  deliveryChannel: string;
  localizedEstimates: string;
  price: number;
  shippingEstimate: string;
  /** Concrete ISO delivery date (e.g. "2026-07-08T00:01:00-03:00"). Fetched
   * via the overridden ClientShippingSimulation fragment. */
  shippingEstimateDate: string;
}
