import { useCallback, useMemo } from 'react'

import { useSession } from 'src/sdk/session'
import { formatPrice } from '../utils/formatPrice'

interface PriceFormatterOptions {
  decimals?: boolean
  cents?: boolean
}

export const usePriceFormatter = ({
  decimals = true,
  cents = false,
}: PriceFormatterOptions = {}) => {
  const { currency, locale } = useSession()

  return useCallback(
    (price: number) =>
      formatPrice(price, {
        locale,
        currency: currency.code,
        decimals,
        cents,
      }),
    [currency.code, locale, decimals, cents]
  )
}

export const useFormattedPrice = (
  price: number,
  options: PriceFormatterOptions = {}
) => {
  const formatter = usePriceFormatter(options)

  return useMemo(
    () => formatter(price),
    [formatter, price]
  )
}