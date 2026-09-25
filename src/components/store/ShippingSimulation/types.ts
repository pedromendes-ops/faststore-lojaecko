export interface ProductShippingInfo {
  id: string
  quantity: number
  seller: string
}

export interface ShippingSimulationProps {
  productShippingInfo: ProductShippingInfo

  title?: string
  inputLabel?: string

  idkPostalCodeLabel?: string
  idkPostalCodeHref?: string

  buttonLabel?: string
  invalidPostalCodeErrorMessage?: string
}