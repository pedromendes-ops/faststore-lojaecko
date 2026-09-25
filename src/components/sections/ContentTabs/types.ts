import type { TabsStyleConfig } from "../../common/Tabs/types";

export type ContentTabImage = {
  srcImage: string;
  height?: number;
  width?: number;
};

export type ContentTabItem = {
  id?: string;
  label?: string;
  content?: string;
  isContentImage?: boolean;
  desktop?: ContentTabImage;
  mobile?: ContentTabImage;
  active?: boolean;
};

export type ContentTabsProps = {
  className?: string;
  ariaLabel?: string;
  defaultActiveId?: string;
  areaSection?: "container" | "full";
  maxWidthSection?: string;
  marginTopSection?: string;
  marginTopSectionPhone?: string;
  sectionLabel?: string;
  hasTitle?: boolean;
  textTitle?: string;
  sizeTitle?: "large" | "medium" | "small";
  tabs?: ContentTabItem[];
  desktop?: TabsStyleConfig;
  mobile?: TabsStyleConfig;
};
