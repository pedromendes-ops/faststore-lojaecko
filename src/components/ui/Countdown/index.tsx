'use client'

import {useEffect, useMemo, useState } from 'react'
import type { CountdownProps } from './types'
import styles from './styles.module.scss'

const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24

const pad = (value: number) => String(value).padStart(2, '0')

export function Countdown({
  endDate,
  label = 'Termina em',
  showDays = true,
}: CountdownProps) {
  const targetTime =
    useMemo(
      () =>
        new Date(
          endDate
        ).getTime(),
      [endDate]
    )

  const [
    remaining,
    setRemaining,
  ] = useState(() =>
    Math.max(
      targetTime -
        Date.now(),
      0
    )
  )

  useEffect(() => {
    const updateRemaining =
      () => {
        setRemaining(
          Math.max(
            targetTime -
              Date.now(),
            0
          )
        )
      }

    updateRemaining()

    const interval =
      window.setInterval(
        updateRemaining,
        1000
      )

    return () =>
      window.clearInterval(
        interval
      )
  }, [targetTime])

  const days =
    Math.floor(
      remaining / DAY
    )

  const hours =
    Math.floor(
      (remaining % DAY) /
        HOUR
    )

  const minutes =
    Math.floor(
      (remaining % HOUR) /
        MINUTE
    )

  const seconds =
    Math.floor(
      (remaining % MINUTE) /
        SECOND
    )

  return (
    <div
      className={
        styles.countdown
      }
    >
      <span
        className={
          styles.icon
        }
        aria-hidden="true"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="1.5"
          />

          <path
            d="M12 7v5l3 2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </span>

      {label && (
        <span
          className={
            styles.label
          }
        >
          {label}
        </span>
      )}

      <strong
        className={
          styles.time
        }
      >
        {showDays && (
          <>
            {days}D{' '}
          </>
        )}

        {pad(hours)}:
        {pad(minutes)}:
        {pad(seconds)}
      </strong>
    </div>
  )
}

export default Countdown