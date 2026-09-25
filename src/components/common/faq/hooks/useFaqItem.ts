import { useCollapse } from "react-collapsed";

export const useFaqItem = () => {
  const { getToggleProps, getCollapseProps, isExpanded } = useCollapse();

  return { getToggleProps, getCollapseProps, isExpanded };
};
