import type { MouseEvent } from "react";
import { Icon } from "@faststore/ui";

import styles from "./styles.module.scss";

interface PaginationProps {
  /** Current page, 0-based (matches the search state `page`). */
  currentPage: number;
  /** Total number of pages. */
  totalPages: number;
  /** Called with the target page, 0-based (client-side navigation). */
  onPageChange: (page: number) => void;
  /**
   * Builds the crawlable URL for a target page (0-based). Renders each control
   * as a real `<a href>` so search engines can discover every page and users
   * can share/open-in-new-tab, while a normal click stays a client-side (SPA)
   * navigation via `onPageChange`.
   */
  getPageHref: (page: number) => string;
}

// How many consecutive page numbers to show in the sliding window.
const WINDOW_SIZE = 5;

/**
 * Builds the page numbers to display (1-based), collapsing long ranges with
 * ellipsis. Shows a contiguous window of `WINDOW_SIZE` pages that slides with
 * the current page, always keeping the first and last page reachable.
 * Examples (total 20): current 1 → 1 2 3 4 5 … 20; current 10 → 1 … 8 9 10 11
 * 12 … 20; current 20 → 1 … 16 17 18 19 20
 */
function getPageItems(current: number, total: number): (number | "ellipsis")[] {
  // Few enough pages to list them all without ellipsis.
  if (total <= WINDOW_SIZE + 2) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  // Window of WINDOW_SIZE pages centered on the current page, clamped so it
  // stays in range (1..5 near the start, (total-4)..total near the end).
  let start = Math.max(1, current - Math.floor(WINDOW_SIZE / 2));
  let end = start + WINDOW_SIZE - 1;
  if (end > total) {
    end = total;
    start = end - WINDOW_SIZE + 1;
  }

  const items: (number | "ellipsis")[] = [];

  // Leading first page (+ ellipsis when the window doesn't already touch it).
  if (start > 1) {
    items.push(1);
    if (start > 2) items.push("ellipsis");
  }

  for (let page = start; page <= end; page++) items.push(page);

  // Trailing last page (+ ellipsis when the window doesn't already touch it).
  if (end < total) {
    if (end < total - 1) items.push("ellipsis");
    items.push(total);
  }

  return items;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  getPageHref,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const current = currentPage + 1; // 1-based for display
  const items = getPageItems(current, totalPages);
  const hasPrev = currentPage > 0;
  const hasNext = current < totalPages;

  // Intercept plain left-clicks for SPA navigation, but let modified clicks
  // (new tab/window) and non-primary buttons follow the real href.
  const handleClick = (event: MouseEvent<HTMLAnchorElement>, page: number) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    event.currentTarget.blur();
    onPageChange(page);
  };

  return (
    <nav className={styles.pagination} aria-label="Paginação de produtos">
      {hasPrev ? (
        <a
          className={styles.arrow}
          href={getPageHref(currentPage - 1)}
          rel="prev"
          aria-label="Página anterior"
          onClick={(event) => handleClick(event, currentPage - 1)}
        >
          <Icon name="CaretLeft" width={18} height={18} weight="bold" />
        </a>
      ) : (
        <span
          className={`${styles.arrow} ${styles.disabled}`}
          aria-label="Página anterior"
          aria-disabled="true"
        >
          <Icon name="CaretLeft" width={18} height={18} weight="bold" />
        </span>
      )}

      {items.map((item, index) =>
        item === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className={styles.ellipsis}>
            …
          </span>
        ) : (
          <a
            key={item}
            className={`${styles.page} ${
              item === current ? styles.active : ""
            }`}
            href={getPageHref(item - 1)}
            aria-label={`Página ${item}`}
            aria-current={item === current ? "page" : undefined}
            onClick={(event) => handleClick(event, item - 1)}
          >
            {item}
          </a>
        ),
      )}

      {hasNext ? (
        <a
          className={styles.arrow}
          href={getPageHref(currentPage + 1)}
          rel="next"
          aria-label="Próxima página"
          onClick={(event) => handleClick(event, currentPage + 1)}
        >
          <Icon name="CaretRight" width={18} height={18} weight="bold" />
        </a>
      ) : (
        <span
          className={`${styles.arrow} ${styles.disabled}`}
          aria-label="Próxima página"
          aria-disabled="true"
        >
          <Icon name="CaretRight" width={18} height={18} weight="bold" />
        </span>
      )}
    </nav>
  );
}

export default Pagination;
