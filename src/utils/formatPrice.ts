interface FormatPriceOptions {
  locale?: string
  currency?: string
  decimals?: boolean
  cents?: boolean
}

export const formatPrice = (
  price: number,
  {
    locale = 'pt-BR',
    currency = 'BRL',
    decimals = true,
    cents = false,
  }: FormatPriceOptions = {}
) => {
  const value = cents
    ? price / 100
    : price

  return Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits:
      decimals ? 2 : 0,
    maximumFractionDigits:
      decimals ? 2 : 0,
  }).format(value)
}