import Link from "next/link";
import type { DesktopItem } from "../../menu.typing";
import styles from "./styles.module.scss";

type MenuDesktopItemProps = {
  item: DesktopItem;
  isActive: boolean;
  onToggle: () => void;
};

export const MenuDesktopItem = ({
  item,
  isActive,
  onToggle,
}: MenuDesktopItemProps) => {
  const hasDropdown = item.columns?.length > 0;

  return (
    <li
      className={styles.navItem}
      data-fs-is-red={item.isRed}
      data-fs-is-blue={item.isBlue}
    >
      {hasDropdown ? (
        <button
          className={`${styles.trigger} ${
            isActive ? styles.triggerActive : ""
          }`}
          onClick={onToggle}
          aria-expanded={isActive}
        >
          {item.title}
        </button>
      ) : (
        <Link href={item.href || "#"} className={styles.trigger}>
          {item.title}
        </Link>
      )}
    </li>
  );
};
