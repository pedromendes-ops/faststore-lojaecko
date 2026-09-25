import { Viewer } from "../../../../ui/viewer";
import { useFaqItem } from "../../hooks/useFaqItem";
import type { FaqItem as FaqItemType } from "../../types";

import styles from "../../faq.module.scss";

const ChevronIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 9L12 17L4 9L5.42 7.58L12 14.16L18.58 7.58L20 9Z"
      fill="#6D686A"
    />
  </svg>
);

type FaqItemProps = {
  item: FaqItemType;
};

export const FaqItem = ({ item }: FaqItemProps) => {
  const { getToggleProps, getCollapseProps, isExpanded } = useFaqItem();

  return (
    <div className={styles.item}>
      <button {...getToggleProps({ className: styles.question })}>
        <span>{item.question}</span>
        <span
          className={`${styles.icon} ${isExpanded ? styles.iconOpen : ""}`}
        >
          <ChevronIcon />
        </span>
      </button>

      <div {...getCollapseProps()}>
        <div className={styles.answer}>
          <Viewer value={item.answer} />
        </div>
      </div>
    </div>
  );
};

export default FaqItem;
