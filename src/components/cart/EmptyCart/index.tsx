import {
  Button as UIButton,
  Icon as UIIcon,
  EmptyState as UIEmptyState,
} from "@faststore/ui";
import { useCallback, useRef } from "react";

// Core SDK hook (resolved via the `src/*` alias to @faststore/core) used by the
// native ProductShelf to fetch a product list. Reused here so the empty-cart
// shelf takes the exact same params the admin already knows from Product Shelf.
import { useProductsQuery } from "src/sdk/product/useProductsQuery";

// Relative import so it resolves to this store's customized ProductCard (the
// `src/*` alias would resolve to the core ProductCard instead).
import ProductCard from "../../product/ProductCard";
import { ShelfSkeleton } from "./ShelfSkeleton";

import styles from "./styles.module.scss";

type Sort =
  | "discount_desc"
  | "name_asc"
  | "name_desc"
  | "orders_desc"
  | "price_asc"
  | "price_desc"
  | "release_desc"
  | "score_desc";

/**
 * Product Shelf config for the empty cart. Mirrors the native Product Shelf
 * fields (term, sort, facets, card config) so the admin configures it exactly
 * the same way. It is edited in the CMS through the HeaderCustom section and
 * flows down HeaderCustom -> CartSidebar -> EmptyCart.
 */
export interface EmptyCartShelfConfig {
  /** Shelf heading shown above the products. */
  title?: string;
  numberOfItems?: number;
  sort?: Sort;
  term?: string;
  selectedFacets?: { key: string; value: string }[];
  productCardConfiguration?: {
    showDiscountBadge?: boolean;
    bordered?: boolean;
    showPixDiscount?: boolean;
    pixDiscount?: number;
    pixDiscountLabel?: string;
  };
}

interface Props {
  /** Title text for the empty cart state. */
  title?: string;
  /** Label of the button that closes the cart. */
  buttonLabel?: string;
  /** Called when the close button is clicked. */
  onDismiss: () => void;
  /** Optional Product Shelf rendered inside the empty cart. */
  shelf?: EmptyCartShelfConfig;
}

/** Distance (px) a pointer drag must exceed to be treated as a scroll, not a click. */
const DRAG_THRESHOLD = 5;

function EmptyCart({ title, buttonLabel, onDismiss, shelf }: Props) {
  const {
    title: shelfTitle,
    numberOfItems = 10,
    sort = "score_desc",
    term = "",
    selectedFacets = [],
    productCardConfiguration,
  } = shelf ?? {};

  const {
    showDiscountBadge = true,
    bordered = false,
    showPixDiscount = true,
    pixDiscount = 10,
    pixDiscountLabel = "no Pix",
  } = productCardConfiguration ?? {};

  // `suspense: false` so this renders without a Suspense boundary — the list
  // fills in once SWR resolves (products is null on the first render).
  const data = useProductsQuery(
    {
      first: numberOfItems,
      after: "0",
      sort,
      term,
      selectedFacets,
    },
    { suspense: false },
  );

  const productEdges = data?.search?.products?.edges ?? [];
  const hasShelf = Boolean(shelf) && productEdges.length > 0;
  // `data` is null until SWR resolves. When a shelf is configured but the
  // products haven't arrived yet, show skeletons so the user sees something is
  // loading instead of an empty gap.
  const isLoadingShelf = Boolean(shelf) && !data;

  // Drag-to-scroll for mouse pointers (touch already scrolls natively). A drag
  // that moves past the threshold suppresses the click so it doesn't open a PDP.
  const scrollRef = useRef<HTMLDivElement>(null);
  const drag = useRef({
    startX: 0,
    scrollLeft: 0,
    active: false,
    moved: false,
  });

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    drag.current = {
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
      active: true,
      moved: false,
    };
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el || !drag.current.active) return;
    const delta = e.clientX - drag.current.startX;
    if (Math.abs(delta) > DRAG_THRESHOLD) {
      drag.current.moved = true;
      el.setPointerCapture?.(e.pointerId);
    }
    el.scrollLeft = drag.current.scrollLeft - delta;
  }, []);

  const onPointerUp = useCallback(() => {
    drag.current.active = false;
  }, []);

  // Cancel the click that follows a drag so it doesn't navigate to the PDP.
  const onClickCapture = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.emptyState}>
        <span>Nada no carrinho. O clássico te espera logo abaixo.</span>
      </div>
      <div className={styles.grow} />
      {isLoadingShelf && (
        <div className={styles.shelf} data-fs-empty-cart-shelf>
          {shelfTitle && <h3 className={styles.shelfTitle}>{shelfTitle}</h3>}
          <ShelfSkeleton count={Math.min(numberOfItems, 4)} />
        </div>
      )}
      {hasShelf && (
        <div className={styles.shelf} data-fs-empty-cart-shelf>
          {shelfTitle && <h3 className={styles.shelfTitle}>{shelfTitle}</h3>}
          <div
            ref={scrollRef}
            className={styles.track}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            onClickCapture={onClickCapture}
          >
            {productEdges.map((edge, idx) => (
              <div className={styles.item} key={edge.node.id}>
                <ProductCard
                  product={edge.node}
                  index={idx + 1}
                  bordered={bordered}
                  showDiscountBadge={showDiscountBadge}
                  showPixDiscount={showPixDiscount}
                  pixDiscount={pixDiscount}
                  pixDiscountLabel={pixDiscountLabel}
                  imgProps={{
                    width: 165,
                    height: 165,
                    sizes: "165px",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <UIButton
        className={styles.button}
        onClick={onDismiss}
        variant="secondary"
        data-fs-empty-cart-close-button
      >
        Fechar
      </UIButton>
    </div>
  );
}

export default EmptyCart;
