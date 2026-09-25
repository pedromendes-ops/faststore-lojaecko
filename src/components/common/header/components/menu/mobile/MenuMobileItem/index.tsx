import Link from "next/link";
import type { MobileTopItem } from "../../menu.typing";
import { ArrowUpIcon } from "../../../../header.icons";
import styles from "./styles.module.scss";

type MenuMobileItemProps = {
  item: MobileTopItem;
  onOpenCategory: (item: MobileTopItem) => void;
};

export const MenuMobileItem = ({
  item,
  onOpenCategory,
}: MenuMobileItemProps) => {
  const hasDrawer =
    (item.subMenus?.length ?? 0) > 0 || (item.items?.length ?? 0) > 0;
  const isLink = !hasDrawer && !!item.href;

  const renderTitle = () => {
    if (hasDrawer) {
      return (
        <button
          className={styles.itemTrigger}
          onClick={() => onOpenCategory(item)}
          aria-haspopup="true"
        >
          <span
            className={styles.itemLabelLevel1}
            data-fs-is-red={item.isRed}
            data-fs-is-blue={item.isBlue}
          >
            {item.title}
          </span>
          <span className={styles.chevron}>
            <ArrowUpIcon width={16} height={16} />
          </span>
        </button>
      );
    }
    if (isLink) {
      return (
        <Link href={item.href!} className={styles.itemLink}>
          {item.title}
        </Link>
      );
    }
    return <span className={styles.itemLabel}>{item.title}</span>;
  };

  return (
    <div className={styles.itemWrapper}>
      <div
        className={styles.itemHeader}
        data-fs-is-red={item.isRed}
        data-fs-is-blue={item.isBlue}
      >
        {renderTitle()}
      </div>
    </div>
  );
};
