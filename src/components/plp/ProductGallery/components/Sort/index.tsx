import {useEffect, useRef, useState} from 'react'
import {useSearch} from '@faststore/sdk'
import {SelectField, Icon} from '@faststore/ui'
import {SORT_OPTIONS} from './types'
import type {SortOptionKey, SortProps} from './types'
import styles from './Sort.module.scss'

export default function Sort({
  label = 'Ordenar por',
  layout = 'select',
  options = SORT_OPTIONS,
  value,
  onChange

}: SortProps) {

  const {state, setState} = useSearch()
  const currentSort = (value ?? state.sort) as SortOptionKey
  const [isOpen, setIsOpen] = useState(false)

  const [radioExpanded,setRadioExpanded] = useState(true)

  const ref = useRef<HTMLDivElement>(null)
  const optionsMap =
    (
      Object.keys(
        SORT_OPTIONS
      ) as SortOptionKey[]
    ).reduce(
      (acc, key) => {
        if (
          Object.hasOwn(
            options,
            key
          )
        ) {
          acc[key] =
            options[key] ??
            SORT_OPTIONS[key]
        }

        return acc
      },
      {} as Record<
        SortOptionKey,
        string
      >
    )

  const keys = Object.keys(optionsMap) as SortOptionKey[]
  const selectedLabel = optionsMap[currentSort] ?? label
  const changeSort = (sort: SortOptionKey) => {

    if (onChange) {
      onChange(sort)
      setIsOpen(false)

      return
    }
    setState({...state, sort, page: 0})
    setIsOpen(false)
  }

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown',handleClickOutside)

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      )
    }
  }, [isOpen])

  /*
   * ---------------------------------------------
   * SELECT NATIVO FASTSTORE
   * ---------------------------------------------
   */

  if (layout === 'select') {
    return (
      <div className={styles.vtexSort}>
        <SelectField
          id="sort-select"
          className={styles.select}
          label={label}
          options={optionsMap}
          onChange={(event) => {
            const sort = keys[event.target.selectedIndex]
            if (sort) {
              changeSort(sort)
            }
          }}
          value={currentSort}
          testId="search-sort"
        />
      </div>
    )
  }

  /*
   * ---------------------------------------------
   * RADIO
   * ---------------------------------------------
   */

  if (layout === 'radio') {
    return (
      <fieldset
        className={styles.radioGroup}
        data-fs-store-sort
        data-fs-store-sort-layout="radio"
        data-expanded={radioExpanded ? 'true' : 'false'}
      >
        <legend className={styles.srOnly}>
          {label}
        </legend>

        <button
          type="button"
          className={styles.radioTrigger}
          aria-expanded={radioExpanded}
          aria-controls="product-sort-options"
          onClick={() =>
            setRadioExpanded(
              (current) => !current
            )
          }
        >
          <span>{label}</span>

          <span className={styles.radioArrow} aria-hidden="true">
            <Icon name="CaretDown" weight="thin" />
          </span>
        </button>

        <div id="product-sort-options" className={styles.radioContent}>
          <div className={styles.radioContentInner}>
            {keys.map((key) => (
                <label
                  key={key}
                  className={styles.radioItem}
                >
                  <input
                    type="radio"
                    name="product-sort"
                    value={key}
                    checked={currentSort === key}
                    onChange={() =>
                      changeSort(key)
                    }
                  />
                  <span className={styles.iconItem}></span>
                  <span className={styles.textItem}>{optionsMap[key]}</span>
                </label>
              )
            )}
          </div>
        </div>
      </fieldset>
    )
  }

  /*
   * ---------------------------------------------
   * CUSTOM SELECT
   * ---------------------------------------------
   */

  return (
    <div
      ref={ref}
      className={styles.customSelect}
      data-fs-store-sort
      data-fs-store-sort-layout="custom-select"
    >
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(
            (current) =>
              !current
          )
        }
      >
        <span className={styles.label}>{label}:</span>
        <span className={styles.selected}>
          {selectedLabel}
        </span>
        <span className={styles.arrow} aria-hidden="true">
          <Icon name="CaretDown" weight="thin" />          
        </span>
      </button>

      {isOpen && (
        <div className={styles.options} role="listbox">
          {keys.map((key) => {
              const active = currentSort === key
              return (
                <button
                  key={key}
                  type="button"
                  role="option"
                  aria-selected={active}
                  className={`${styles.option} ${active ? styles.active : '' }`}
                  onClick={() =>
                    changeSort(key)
                  }
                >
                  <Icon name="Checked" weight="thin" />
                  {optionsMap[key]}
                </button>
              )
            }
          )}
        </div>
      )}
    </div>
  )
}