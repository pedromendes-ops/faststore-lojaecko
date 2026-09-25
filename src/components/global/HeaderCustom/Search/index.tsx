import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import SearchInput from 'src/components/search/SearchInput'
import useScreenResize from '../../../../hooks/useScreenResize'

import { SearchIcon } from '../header.icons'
import styles from './Search.module.scss'

import type { SearchProps } from '../types'

export function Search({
    searchButtonDesktop = false,
    searchButtonMobile = true,
    placeholder = 'Encontre um produto...',

}: SearchProps) {
    const [showInputSearch, setShowInputSearch] = useState(false)
    const [mounted, setMounted] = useState(false)

    const {
        isDesktop,
        loading,
    } = useScreenResize()

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!showInputSearch) {
            return
        }

        const timer = window.setTimeout(() => {
        const input = document.querySelector(
            '[data-fs-search-input-field-input="true"]'
        ) as HTMLInputElement | null

        input?.focus()
        }, 100)

        return () => {
        window.clearTimeout(timer)
        }
    }, [showInputSearch])

    if (loading) {
        return null
    }

    const useSearchButton = isDesktop
        ? searchButtonDesktop
        : searchButtonMobile

    if (!useSearchButton) {
        return (
            <div className={`${styles.globalSearch} ${styles.openingSearch}`}>
                <SearchInput placeholder={placeholder} />
            </div>
        )
    }

    return (
        <>
        
        <button            
            aria-label="Abrir busca"
            aria-expanded={showInputSearch}                      
            onClick={() => setShowInputSearch((current) => !current)}            
            className={`flex items-center justify-center pointer ${styles.searchButton}`}
        >
            <span className={`flex items-center justify-center pointer ${styles.iconSearchButton}`}><SearchIcon /></span>
            <span className={styles.textSearchButton}>Buscar</span>
        </button>
        

        {mounted &&
            showInputSearch &&
            createPortal(
            <>
                <div
                    className={styles.searchInput}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Busca"
                >
                    <div className={`flex items-center w-100 ${styles.headerSearch}`}>
                        <div className={styles.searchTitle}>Busca</div>
                        <button
                            type="button"
                            className={styles.closeSearch}
                            onClick={() => setShowInputSearch(false)}
                            aria-label="Fechar busca"
                            >
                            <svg
                                data-fs-icon="true"
                                width="24"
                                height="24"
                                strokeWidth="16"
                            >
                                <use href="/icons.svg#X" />
                            </svg>
                        </button>
                    </div>
                    <div  className={`${styles.globalSearch} ${styles.closedSearch}`}>
                        <SearchInput placeholder={placeholder} />
                    </div>
                </div>

                <button
                    type="button"
                    className={styles.overlay}
                    onClick={() => setShowInputSearch(false)}
                    aria-label="Fechar busca"
                />
            </>,
            document.body
            )}
        </>
    )
}