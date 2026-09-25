const ESTIMATE_MESSAGES: Record<
  string,
  {
    0: string
    1: string
    other: string
  }
> = {
  bd: {
    0: 'Hoje',
    1: 'Em 1 dia útil',
    other: 'Em até # dias úteis',
  },
  d: {
    0: 'Hoje',
    1: 'Em 1 dia',
    other: 'Em até # dias',
  },
  h: {
    0: 'Agora',
    1: 'Em 1 hora',
    other: 'Em até # horas',
  },
  m: {
    0: 'Agora',
    1: 'Em 1 minuto',
    other: 'Em até # minutos',
  },
}

const WEEKDAYS = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
]

const startOfDay = (date: Date) => {
  const result = new Date(date)

  result.setHours(0, 0, 0, 0)

  return result
}

export function formatShippingEstimate(
  estimate?: string | null
) {
  if (!estimate) {
    return ''
  }

  const value =
    estimate.split(/\D+/)[0]

  const unit =
    estimate.split(/[0-9]+/)[1]

  const isValidNumber =
    value !== '' &&
    !Number.isNaN(Number(value))

  if (
    !isValidNumber ||
    !ESTIMATE_MESSAGES[unit]
  ) {
    return ''
  }

  const count = Number(value)

  const key =
    count < 2
      ? (count as 0 | 1)
      : 'other'

  return ESTIMATE_MESSAGES[unit][
    key
  ].replace('#', value)
}

export function formatDeliveryDate(
  shippingEstimateDate?: string | null,
  shippingEstimate?: string | null
) {
  if (!shippingEstimateDate) {
    return formatShippingEstimate(
      shippingEstimate
    )
  }

  const deliveryDate =
    new Date(shippingEstimateDate)

  if (
    Number.isNaN(
      deliveryDate.getTime()
    )
  ) {
    return formatShippingEstimate(
      shippingEstimate
    )
  }

  const today =
    startOfDay(new Date())

  const target =
    startOfDay(deliveryDate)

  const tomorrow =
    new Date(today)

  tomorrow.setDate(
    tomorrow.getDate() + 1
  )

  const day = String(
    deliveryDate.getDate()
  ).padStart(2, '0')

  const month = String(
    deliveryDate.getMonth() + 1
  ).padStart(2, '0')

  if (
    target.getTime() ===
    today.getTime()
  ) {
    return `Você receberá Hoje, dia ${day}/${month}`
  }

  if (
    target.getTime() ===
    tomorrow.getTime()
  ) {
    return `Você receberá até Amanhã, dia ${day}/${month}`
  }

  return `Você receberá até ${
    WEEKDAYS[
      deliveryDate.getDay()
    ]
  }, dia ${day}/${month}`
}

export function maskCep(
  value: string
) {
  const digits = value
    .replace(/\D/g, '')
    .slice(0, 8)

  if (digits.length <= 5) {
    return digits
  }

  return `${digits.slice(
    0,
    5
  )}-${digits.slice(5)}`
}

export function isCompleteCep(
  value?: string
) {
  return (
    (value ?? '')
      .replace(/\D/g, '')
      .length === 8
  )
}