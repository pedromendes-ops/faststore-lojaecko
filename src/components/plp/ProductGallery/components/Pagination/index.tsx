'use client'

import type {
  MouseEvent,
} from 'react'

import useScreenResize from '../../../../../hooks/useScreenResize'

import styles from './Pagination.module.scss'

type PageItem =
  | number
  | 'ellipsis-start'
  | 'ellipsis-end'

type PaginationProps = {
  currentPage: number
  totalPages: number
  totalCount: number
  itemsPerPage: number

  onPageChange: (
    page: number
  ) => void

  getPageHref: (
    page: number
  ) => string
}

function getPageItems(
  currentPage: number,
  totalPages: number,
  visiblePages: number
): PageItem[] {
  /*
   * Não precisa de ellipsis quando
   * todas as páginas cabem.
   *
   * +2 considera primeira e última página.
   */
  if (
    totalPages <=
    visiblePages + 2
  ) {
    return Array.from(
      { length: totalPages },
      (_, index) => index
    )
  }

  const items: PageItem[] = []

  /*
   * Quantidade de páginas ao redor
   * da página atual.
   *
   * Desktop:
   * visiblePages = 5
   * current ± 2
   *
   * Mobile:
   * visiblePages = 3
   * current ± 1
   */
  const sidePages =
    Math.floor(
      visiblePages / 2
    )

  let start =
    currentPage - sidePages

  let end =
    currentPage + sidePages

  /*
   * A primeira página já será
   * adicionada separadamente.
   */
  if (start < 1) {
    start = 1
    end = visiblePages
  }

  /*
   * A última página também será
   * adicionada separadamente.
   */
  if (
    end >
    totalPages - 2
  ) {
    end =
      totalPages - 2

    start =
      Math.max(
        1,
        end -
          visiblePages +
          1
      )
  }

  /*
   * Primeira página.
   */
  items.push(0)

  /*
   * Ellipsis inicial.
   */
  if (start > 1) {
    items.push(
      'ellipsis-start'
    )
  }

  /*
   * Páginas centrais.
   */
  for (
    let page = start;
    page <= end;
    page++
  ) {
    items.push(page)
  }

  /*
   * Ellipsis final.
   */
  if (
    end <
    totalPages - 2
  ) {
    items.push(
      'ellipsis-end'
    )
  }

  /*
   * Última página.
   */
  items.push(
    totalPages - 1
  )

  return items
}

export function Pagination({
  currentPage,
  totalPages,
  totalCount,
  itemsPerPage,
  onPageChange,
  getPageHref,
}: PaginationProps) {
  const {
    isMobile,
  } = useScreenResize()

  /*
   * Desktop:
   * 5 páginas na janela.
   *
   * Mobile:
   * 3 páginas na janela.
   */
  const visiblePages =
    isMobile ? 3 : 5

  const pages =
    getPageItems(
      currentPage,
      totalPages,
      visiblePages
    )

  /*
   * Quantidade de produtos exibidos
   * até a página atual.
   *
   * Exemplo:
   *
   * 12 por página
   *
   * página 1 = 12 de 64
   * página 2 = 24 de 64
   * página 6 = 64 de 64
   */
  const displayedProducts =
    Math.min(
      (currentPage + 1) *
        itemsPerPage,
      totalCount
    )

  const handleClick = (
    event:
      MouseEvent<HTMLAnchorElement>,
    page: number
  ) => {
    /*
     * Mantém:
     * - Ctrl/Cmd + clique
     * - Shift + clique
     * - Alt + clique
     * - botão diferente do esquerdo
     *
     * funcionando como link normal.
     */
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    event.preventDefault()

    onPageChange(page)
  }

  /*
   * Mesmo existindo apenas uma página,
   * ainda podemos mostrar:
   *
   * 5 de 5 produtos
   */
  if (totalCount <= 0) {
    return null
  }

  return (
    <div
      className={
        styles.paginationWrapper
      }
    >
      {totalPages > 1 && (
        <nav
          className={
            styles.pagination
          }
          aria-label="Paginação de produtos"
        >
          {currentPage > 0 && (
            <a
              href={getPageHref(
                currentPage - 1
              )}
              className={
                styles.arrow
              }
              aria-label="Página anterior"
              onClick={(event) =>
                handleClick(
                  event,
                  currentPage - 1
                )
              }
            >
              ‹
            </a>
          )}

          <div
            className={
              styles.pages
            }
          >
            {pages.map(
              (item) => {
                if (
                  item ===
                    'ellipsis-start' ||
                  item ===
                    'ellipsis-end'
                ) {
                  return (
                    <span
                      key={item}
                      className={
                        styles.ellipsis
                      }
                      aria-hidden="true"
                    >
                      …
                    </span>
                  )
                }

                const isCurrent =
                  item ===
                  currentPage

                if (isCurrent) {
                  return (
                    <span
                      key={item}
                      className={`${styles.page} ${styles.active}`}
                      aria-current="page"
                    >
                      {item + 1}
                    </span>
                  )
                }

                return (
                  <a
                    key={item}
                    href={
                      getPageHref(
                        item
                      )
                    }
                    className={
                      styles.page
                    }
                    onClick={(
                      event
                    ) =>
                      handleClick(
                        event,
                        item
                      )
                    }
                  >
                    {item + 1}
                  </a>
                )
              }
            )}
          </div>

          {currentPage <
            totalPages - 1 && (
            <a
              href={getPageHref(
                currentPage + 1
              )}
              className={
                styles.arrow
              }
              aria-label="Próxima página"
              onClick={(event) =>
                handleClick(
                  event,
                  currentPage + 1
                )
              }
            >
              ›
            </a>
          )}
        </nav>
      )}

      <div
        className={
          styles.productCount
        }
        aria-live="polite"
      >
        {displayedProducts} de{' '}
        {totalCount} produtos
      </div>
    </div>
  )
}

export default Pagination