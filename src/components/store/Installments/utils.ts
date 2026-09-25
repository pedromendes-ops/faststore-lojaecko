import type {
  Installment,
} from './types'

export const getInstallmentsByNumber = (
  installments:
    | Installment[]
    | undefined
    | null
): Installment[] => {
  if (!installments?.length) {
    return []
  }

  const byNumber =
    new Map<number, Installment>()

  for (const current of installments) {
    const existing =
      byNumber.get(
        current.installmentNumber
      )

    if (
      !existing ||
      current.installmentInterest <
        existing.installmentInterest
    ) {
      byNumber.set(
        current.installmentNumber,
        current
      )
    }
  }

  return Array.from(
    byNumber.values()
  ).sort(
    (a, b) =>
      a.installmentNumber -
      b.installmentNumber
  )
}

export const getMaxInterestFreeInstallment = (
  installments:
    | Installment[]
    | undefined
    | null
): Installment | null => {
  if (!installments?.length) {
    return null
  }

  return installments.reduce<
    Installment | null
  >(
    (max, current) => {
      if (
        current.installmentInterest !== 0 ||
        current.installmentNumber <= 1
      ) {
        return max
      }

      if (
        !max ||
        current.installmentNumber >
          max.installmentNumber
      ) {
        return current
      }

      return max
    },
    null
  )
}