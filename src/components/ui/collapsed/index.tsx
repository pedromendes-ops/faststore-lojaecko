import { useCollapse } from "react-collapsed";

import React from "react";

import styles from "./styles.module.scss";
import IconArrowDown from "../../icons/arrow-down";

type CollapsedProps = {
  title: React.ReactNode;
  children: React.ReactNode;
};
export const Collapsed = ({ title, children }: CollapsedProps) => {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();

  return (
    <div>
      <button
        {...getToggleProps()}
        className={`${styles.collapsedButton} button-collapsed`}
        data-isExpanded={isExpanded}
      >
        <span className="title--collapesed">{title}</span>
        <span>
          <IconArrowDown className={styles.icon} data-isExpanded={isExpanded} />
        </span>
      </button>
      <div {...getCollapseProps()} className="collapsed-content">
        {children}
      </div>
    </div>
  );
};
