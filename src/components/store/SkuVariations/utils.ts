import type {
  VariantProduct,
} from './types'

const OUT_OF_STOCK =
  'https://schema.org/OutOfStock'

export function findVariantSku(
  allVariantProducts: VariantProduct[],
  targetVariations: Record<string, string>
): string | undefined {
  const entries =
    Object.entries(
      targetVariations
    )

  const match =
    allVariantProducts.find(
      (variant) => {
        const props =
          variant.additionalProperty ??
          []

        return entries.every(
          ([name, value]) =>
            props.some(
              (prop) =>
                prop.name === name &&
                prop.value === value
            )
        )
      }
    )

  return match?.sku
}

export function isVariantUnavailable(
  allVariantProducts: VariantProduct[],
  targetVariations: Record<string, string>
): boolean {
  const entries =
    Object.entries(
      targetVariations
    )

  const variant =
    allVariantProducts.find(
      (variant) => {
        const props =
          variant.additionalProperty ??
          []

        return entries.every(
          ([name, value]) =>
            props.some(
              (prop) =>
                prop.name === name &&
                prop.value === value
            )
        )
      }
    )

  // Se não conseguimos identificar a variante,
  // não marcamos como indisponível.
  if (!variant) {
    return false
  }

  const offer =
    variant.offers?.offers?.[0]

  if (!offer) {
    return true
  }

  return (
    offer.availability ===
      OUT_OF_STOCK ||
    (offer.quantity ?? 0) <= 0
  )
}