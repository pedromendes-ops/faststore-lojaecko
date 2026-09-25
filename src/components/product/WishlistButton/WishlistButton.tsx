import { Heart } from "lucide-react";
import { useState } from "react";

import { useWishlist, type ToggleProduct } from "../../../sdk/wishlist/useWishlist";

import styles from "./WishlistButton.module.scss";

export interface WishlistButtonProps extends ToggleProduct {
  /** Optional extra class for positioning within a specific card layout. */
  className?: string;
}

/**
 * Heart toggle overlaid on the product image. Reflects the saved wishlist state
 * and adds/removes the product on click (logged-out shoppers are redirected to
 * login by the hook). Lives inside the card's <NextLink>, so the click is kept
 * from navigating to the PDP.
 */
export function WishlistButton({
  productId,
  sku,
  title,
  className,
}: WishlistButtonProps) {
  const { isInWishlist, toggle } = useWishlist();
  const [isToggling, setIsToggling] = useState(false);

  const active = isInWishlist(productId);
  const label = active ? "Remover dos favoritos" : "Adicionar aos favoritos";

  const onClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    // The card is wrapped in a <NextLink>; keep the click from navigating.
    event.preventDefault();
    event.stopPropagation();

    // Block double submits while a request is in flight.
    if (isToggling) {
      return;
    }

    setIsToggling(true);
    try {
      await toggle({ productId, sku, title });
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <button
      type="button"
      className={`${styles.wishlistButton} ${className ?? ""}`}
      onClick={onClick}
      disabled={isToggling}
      aria-label={label}
      aria-pressed={active}
      title={label}
      data-fs-wishlist-button
      data-fs-wishlist-active={active}
    >
      <Heart
        className={styles.icon}
        aria-hidden
        fill={active ? "currentColor" : "none"}
      />
    </button>
  );
}

export default WishlistButton;
