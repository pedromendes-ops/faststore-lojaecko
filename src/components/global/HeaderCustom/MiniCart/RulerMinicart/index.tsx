import {
  useMemo,
  type ReactNode,
} from 'react'

import { usePriceFormatter } from '../../../../../hooks/usePriceFormatter'
import { FreteIcon } from '../../header.icons'

import type {
  RulerMinicartConfig,
} from '../../types'

import styles from './RulerMinicart.module.scss'

type Props = RulerMinicartConfig & {
  total: number
}

const VALUE_TOKEN = '{value}'

function renderMessage(
  template: string,
  value: string
): ReactNode {
  const valueElement = (
    <strong className={styles.value}>
      {value}
    </strong>
  )

  if (!template.includes(VALUE_TOKEN)) {
    return (
      <>
        {template} {valueElement}
      </>
    )
  }

  const [before, after] =
    template.split(VALUE_TOKEN)

  return (
    <>
      {before}
      {valueElement}
      {after}
    </>
  )
}

export function RulerMinicart({
  total,
  enabled = false,
  type = 'shipping',
  goal = 299,
  goalInCents = false,
  progressMessage = 'Faltam {value} para ganhar frete grátis',
  successMessage = 'Você ganhou frete grátis!',
  startLabel,
}: Props) {
  const formatPrice = usePriceFormatter()

  const normalizedGoal = useMemo(() => {
    return goalInCents ? goal / 100 : goal
  }, [goal, goalInCents])

  const {
    reached,
    remaining,
    percent,
  } = useMemo(() => {
    const safeGoal = Math.max(
      normalizedGoal,
      0
    )

    if (safeGoal === 0) {
      return {
        reached: true,
        remaining: 0,
        percent: 100,
      }
    }

    return {
      reached:
        total >= safeGoal,

      remaining:
        Math.max(
          safeGoal - total,
          0
        ),

      percent:
        Math.min(
          (total / safeGoal) * 100,
          100
        ),
    }
  }, [normalizedGoal, total])

  if (!enabled || total <= 0) {
    return null
  }

  return (
    <div
      className={styles.rulerMinicart}
      data-fs-ruler-minicart
      data-type={type}
    >
      {reached ? (
        <div className={`flex center ${styles.wrapMessage}`}>
          <FreteIcon />
          <p className={styles.successMessage}>{successMessage}</p>
        </div>
      ) : (
        <>
          <div className={`flex center ${styles.wrapMessage}`}>
            <FreteIcon />
            <p className={styles.progressMessage}>
              {renderMessage(
                progressMessage,
                formatPrice(remaining)
              )}
            </p>
          </div>
          <div
            className={styles.timeline}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(percent)}
          >
            <span
              className={`${styles.marker} ${
                type === 'gift'
                  ? styles.markerGift
                  : styles.markerShipping
              }`}
              style={{
                width: `${percent}%`,
              }}
            />
          </div>

          <div className={styles.bar}>
            <span className={styles.valStart}>
              {startLabel ?? formatPrice(0)}
            </span>

            <span className={styles.valEnd}>
              {formatPrice(normalizedGoal)}
            </span>
          </div>
        </>
      )}
    </div>
  )
}

export default RulerMinicart