import { useCallback, useMemo } from 'react'

import { useSession } from 'src/sdk/session'

interface PriceFormatterOptions {
  decimals?: boolean
}

export const usePriceFormatter = ({ decimals }: PriceFormatterOptions = {}) => {
  const { currency, locale } = useSession()

  return useCallback(
    (price: number) =>
      Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency.code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price),
    [currency.code, locale, decimals]
  )
}

export const useFormattedPrice = (price: number) => {
  const formatter = usePriceFormatter()

  return useMemo(() => formatter(price), [formatter, price])
}