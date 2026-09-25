import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { Button } from "@faststore/ui";
import { useRouter } from "next/router";

import SearchInput from "src/components/search/SearchInput";

import styles from "./styles.module.scss";
import { SearchIcon } from "./header.icons";

export const SearchButton = () => {
  const [showInputSearch, setShowInputSearch] = useState(false);
  const router = useRouter();

  // Close the search overlay after the user navigates (submitting a search or
  // picking a suggestion). We must NOT close it on the submit button's onClick:
  // that button is `type="submit"`, so closing here unmounts the <form> before
  // its submit event runs `router.push`, and the search never navigates.
  useEffect(() => {
    if (!showInputSearch) return

    const timer = window.setTimeout(() => {
      const input = document.querySelector(
        '[data-fs-search-input-field-input="true"]'
      ) as HTMLInputElement | null

      console.log('Input encontrado:', input)

      input?.focus()
    }, 100)

    return () => clearTimeout(timer)
  }, [showInputSearch])  

  return (
    <>
      
      <Button
        aria-label="abir a busca"
        variant="tertiary"
        data-fs-icon-search="true"
        onClick={() => setShowInputSearch(!showInputSearch)}
        className={styles.searchButton}
      >
        <SearchIcon />
      </Button>

      {showInputSearch &&
        createPortal(
          <>
            <div className={styles.searchInput}>

              <div className={styles.headerSearch}>
                <div style={{fontSize: 18}}>Busca</div>
                <button style={{cursor: 'pointer'}} onClick={() => setShowInputSearch(false)} aria-label="fechar a busca">
                  <svg data-fs-icon="true" data-testid="fs-icon" width="24" height="24" stroke-width="16"><use href="/icons.svg#X"></use></svg>
                </button>
              </div>
              <SearchInput placeholder="Encontre um produto..." />
            </div>
            <div
              className={styles.overlay}
              onClick={() => setShowInputSearch(false)}
            />
          </>,
          document.body,
        )}
    </>
  );
};
