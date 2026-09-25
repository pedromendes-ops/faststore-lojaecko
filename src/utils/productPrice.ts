export type ProductDiscount = {
  hasDiscount: boolean
  discountValue: number
  discountPercentage: number
}

export function getProductDiscount(
  price?: number,
  listPrice?: number
): ProductDiscount {
  const hasDiscount =
    typeof price === 'number' &&
    typeof listPrice === 'number' &&
    listPrice > price

  if (!hasDiscount) {
    return {
      hasDiscount: false,
      discountValue: 0,
      discountPercentage: 0,
    }
  }

  const discountValue =
    listPrice - price

  const discountPercentage =
    Math.round(
      (discountValue /
        listPrice) *
        100
    )

  return {
    hasDiscount: true,
    discountValue,
    discountPercentage,
  }
}

export function getPixPrice(
  price?: number,
  discountPercentage = 0
): number | undefined {
  if (
    typeof price !== 'number' ||
    discountPercentage <= 0
  ) {
    return undefined
  }

  return (
    price *
    (1 -
      discountPercentage /
        100)
  )
}