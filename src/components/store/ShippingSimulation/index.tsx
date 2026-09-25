import type {
  ChangeEvent,
} from 'react'
import { useState } from 'react'
import { Link } from '@faststore/ui'

import { formatPrice } from '../../../utils/formatPrice'
import { useShippingSimulation } from 'src/sdk/shipping/useShippingSimulation'



import type {
  ShippingSimulationProps,
} from './types'

import {
  formatDeliveryDate,
  isCompleteCep,
  maskCep,
} from './utils'

import styles from './ShippingSimulation.module.scss'

export default function ShippingSimulation({
  productShippingInfo,
  title = 'Calcule o frete',
  inputLabel = 'CEP',
  idkPostalCodeLabel = 'Não sei o meu CEP',
  idkPostalCodeHref = 'https://buscacepinter.correios.com.br/app/endereco/index.php',
  buttonLabel = 'Calcular',
  invalidPostalCodeErrorMessage = 'CEP inválido. Verifique o número e tente novamente.',
}: ShippingSimulationProps) {
  

  const [isLoading, setIsLoading] =
    useState(false)

  const {
  input,
  shippingSimulation,
  handleSubmit,
  handleOnInput,
} = useShippingSimulation({
  shippingItem: productShippingInfo,
  invalidPostalCodeErrorMessage,
})

  const {
    postalCode,
    errorMessage,
  } = input

  const canCalculate =
    isCompleteCep(postalCode)

  const options =
    shippingSimulation
      ?.logisticsInfo?.[0]
      ?.slas ?? []

  const handleInput = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    event.currentTarget.value =
      maskCep(
        event.currentTarget.value
      )

    handleOnInput(event)
  }

  const handleCalculate =
    async () => {
      if (
        !canCalculate ||
        isLoading
      ) {
        return
      }

      setIsLoading(true)

      try {
        await handleSubmit()
      } finally {
        setIsLoading(false)
      }
    }

  return (
    <section
      className={
        styles.shippingSimulation
      }
      data-fs-shipping-simulation
    >
      <h3>{title}</h3>

      <div
        className={
          styles.cepContainer
        }
      >
        <div
          className={
            styles.cepField
          }
          data-error={
            Boolean(errorMessage)
          }
        >
          <input
            id="shipping-postal-code"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            aria-label={inputLabel}
            placeholder="00000-000"
            value={postalCode ?? ''}
            onChange={handleInput}
            onKeyDown={(event) => {
              if (
                event.key ===
                'Enter'
              ) {
                handleCalculate()
              }
            }}
          />

          <button
            type="button"
            onClick={
              handleCalculate
            }
            disabled={
              !canCalculate ||
              isLoading
            }
          >
            {isLoading
              ? 'Calculando...'
              : buttonLabel}
          </button>
        </div>

        <Link
          href={
            idkPostalCodeHref
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          {idkPostalCodeLabel}
        </Link>
      </div>

      {errorMessage && (
        <p
          className={
            styles.error
          }
        >
          {errorMessage}
        </p>
      )}

      {options.length > 0 && (
        <div
          className={
            styles.result
          }
        >
          <table>
            <thead>
              <tr>
                <th>Entrega</th>
                <th>Prazo</th>
                <th>Valor</th>
              </tr>
            </thead>

            <tbody>
              {options.map(
                (
                  option: any,
                  index: number
                ) => (
                  <tr
                    key={`${option?.carrier}-${index}`}
                  >
                    <td>
                      {
                        option?.carrier
                      }
                    </td>

                    <td>
                      {formatDeliveryDate(
                        option?.shippingEstimateDate ?? '',
                        option?.shippingEstimate
                      )}
                    </td>

                    <td>
                      {option?.price ===
                      0
                        ? 'Grátis'
                        : formatPrice(
                            option?.price ??
                              0
                          )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>

          <p
            className={
              styles.note
            }
          >
            O prazo indicado
            para entrega começa
            a contar somente
            após a confirmação
            de pagamento.
          </p>
        </div>
      )}
    </section>
  )
}