import { SELECTOR_SKU } from '../../../constants/store'
import type { SkuOption } from '@faststore/ui'

import type {
  SkuVariationsProps,
} from './types'

import Link from 'next/link'
import { useRouter } from 'next/router'

import styles from './SkuVariations.module.scss'

import {
  findVariantSku,
  isVariantUnavailable,
} from './utils'

type Variant =
  | 'image'
  | 'color'
  | 'label'

function getImageName(
  src: string
) {
  try {
    return new URL(src)
      .pathname
      .split('/')
      .slice(-1)[0]
  } catch {
    return src
  }
}

function defineVariant(
  options: SkuOption[]
): Variant {
  if (
    options.length > 0 &&
    options.every(
      (option) => option.hexColor
    )
  ) {
    return 'color'
  }

  const firstImageName =
    options[0]?.src &&
    getImageName(
      options[0].src
    )

  if (
    firstImageName &&
    options.length === 1
  ) {
    return 'image'
  }

  const sourcesEqualOrNull =
    options.every(
      (option) => {
        if (!option.src) {
          return true
        }

        return (
          getImageName(
            option.src
          ) === firstImageName
        )
      }
    )

  return sourcesEqualOrNull
    ? 'label'
    : 'image'
}

function getSkuSlug(
  slugsMap:
    Record<string, string>,
  selectedVariations:
    Record<string, string>,
  dominantVariation: string
) {
  const key =
    Object.entries(
      selectedVariations
    )
      .flat()
      .join('-')

  if (key in slugsMap) {
    return slugsMap[key]
  }

  const possibleVariants =
    Object.keys(slugsMap)

  const dominantKeyValue =
    `${dominantVariation}-${selectedVariations[dominantVariation]}`

  const match =
    possibleVariants.find(
      (slug) =>
        slug.includes(
          dominantKeyValue
        )
    )

  return slugsMap[
    match ??
      possibleVariants[0]
  ]
}

function OptionVisual({
  variant,
  option,
}: {
  variant: Variant
  option: SkuOption
}) {
  switch (variant) {
    case 'color':
      return (
        <span
          className={
            styles.color
          }
          style={{
            backgroundColor:
              option.hexColor,
          }}
        />
      )

    case 'image':
      return option.src ? (
        <img
          src={option.src}
          alt={
            option.alt ??
            option.label
          }
          width={40}
          height={40}
        />
      ) : (
        <span>
          {option.value}
        </span>
      )

    default:
      return (
        <span>
          {option.value}
        </span>
      )
  }
}

export default function SkuVariations({
  skuVariants,
  onSelect,
}: SkuVariationsProps) {
  const router = useRouter()

  const {
    slugsMap,
    activeVariations,
    availableVariations,
  } = skuVariants

  if (!availableVariations) {
    return null
  }

  /**
   * Usado pelo layout "select".
   *
   * No QuickView temos onSelect:
   * troca o SKU dentro do drawer.
   *
   * Na PDP não temos onSelect:
   * navega para a nova variante.
   */
  const handleSelect = (
    skuPropertyName: string,
    value: string
  ) => {
    const selectedVariations = {
      ...activeVariations,
      [skuPropertyName]: value,
    }

    const selectedSku =
      findVariantSku(
        skuVariants.allVariantProducts ??
          [],
        selectedVariations
      )

    const slug =
      getSkuSlug(
        slugsMap,
        selectedVariations,
        skuPropertyName
      )

    if (
      onSelect &&
      selectedSku
    ) {
      onSelect(
        selectedSku,
        selectedVariations
      )

      return
    }

    if (slug) {
      router.push(
        `/${slug}/p`
      )
    }
  }

  return (
    <section
      data-fs-product-details-selectors
    >
      {Object.keys(
        availableVariations
      ).map(
        (
          skuPropertyName
        ) => {
          const options =
            availableVariations[
              skuPropertyName
            ] ?? []

          const variant =
            defineVariant(
              options
            )

          const activeValue =
            activeVariations[
              skuPropertyName
            ]

          return (
            <div
              key={
                skuPropertyName
              }
              className={
                styles.selector
              }
              data-fs-sku-selector
              data-fs-sku-selector-variant={
                variant
              }
              data-fs-sku-selector-layout={
                SELECTOR_SKU
              }
            >
              {SELECTOR_SKU ===
              'select' ? (
                <>
                  <label
                    className={
                      styles.selectLabel
                    }
                    htmlFor={`sku-${skuPropertyName}`}
                  >
                    {
                      skuPropertyName
                    }
                  </label>

                  <div
                    className={
                      styles.selectWrapper
                    }
                  >
                    <select
                      id={`sku-${skuPropertyName}`}
                      className={
                        styles.select
                      }
                      value={
                        activeValue ??
                        ''
                      }
                      onChange={(
                        event
                      ) => {
                        handleSelect(
                          skuPropertyName,
                          event
                            .target
                            .value
                        )
                      }}
                    >
                      <option
                        value=""
                        disabled
                      >
                        Selecione{' '}
                        {skuPropertyName.toLowerCase()}
                      </option>

                      {options.map(
                        (
                          option
                        ) => {
                          const
                            selectedVariations =
                              {
                                ...activeVariations,
                                [skuPropertyName]:
                                  option.value,
                              }

                          const
                            unavailable =
                              isVariantUnavailable(
                                skuVariants.allVariantProducts ??
                                  [],
                                selectedVariations
                              )

                          return (
                            <option
                              key={
                                option.value
                              }
                              value={
                                option.value
                              }
                              data-unavailable={
                                unavailable
                              }
                            >
                              {
                                option.value
                              }
                              {unavailable
                                ? ' - Esgotado'
                                : ''}
                            </option>
                          )
                        }
                      )}
                    </select>
                    <span className={styles.selectIcon} aria-hidden="true">
                      <svg width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M16 1.42004L8 9.42004L0 1.42004L1.42 0.0000438069L8 6.58004L14.58 0.0000432317L16 1.42004Z" fill="currentColor"></path></svg>
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <span
                    className={
                      styles.title
                    }
                    data-fs-sku-selector-title
                  >
                    {
                      skuPropertyName
                    }
                    :{' '}
                    <strong>
                      {
                        activeValue
                      }
                    </strong>
                  </span>

                  <ul
                    className={
                      styles.list
                    }
                    data-fs-sku-selector-list
                  >
                    {options.map(
                      (
                        option
                      ) => {
                        const
                          selectedVariations =
                            {
                              ...activeVariations,
                              [skuPropertyName]:
                                option.value,
                            }

                        const slug =
                          getSkuSlug(
                            slugsMap,
                            selectedVariations,
                            skuPropertyName
                          )

                        const
                          selectedSku =
                            findVariantSku(
                              skuVariants.allVariantProducts ??
                                [],
                              selectedVariations
                            )

                        const
                          unavailable =
                            isVariantUnavailable(
                              skuVariants.allVariantProducts ??
                                [],
                              selectedVariations
                            )

                        const active =
                          option.value ===
                          activeValue

                        return (
                          <li
                            key={
                              option.value
                            }
                            className={`${styles.option} ${
                              unavailable
                                ? styles.unavailable
                                : ''
                            }`}
                            data-fs-sku-selector-option
                            data-fs-sku-selector-checked={
                              active
                            }
                            data-fs-sku-selector-unavailable={
                              unavailable
                            }
                          >
                            {onSelect &&
                            selectedSku ? (
                              <button
                                type="button"
                                aria-label={
                                  option.label
                                }
                                data-fs-sku-selector-option-link
                                onClick={() => {
                                  onSelect(
                                    selectedSku,
                                    selectedVariations
                                  )
                                }}
                              >
                                <OptionVisual
                                  variant={
                                    variant
                                  }
                                  option={
                                    option
                                  }
                                />
                              </button>
                            ) : (
                              <Link
                                href={`/${slug}/p`}
                                aria-label={
                                  option.label
                                }
                                data-fs-sku-selector-option-link
                              >
                                <OptionVisual
                                  variant={
                                    variant
                                  }
                                  option={
                                    option
                                  }
                                />
                              </Link>
                            )}
                          </li>
                        )
                      }
                    )}
                  </ul>
                </>
              )}
            </div>
          )
        }
      )}
    </section>
  )
}