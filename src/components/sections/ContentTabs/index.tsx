import Tabs from "../../common/Tabs";
import { Image } from "src/components/ui/Image";
import { Viewer } from "../../ui/viewer";
import useScreenResize from "src/sdk/ui/useScreenResize";

import styles from "./ContentTabs.module.scss";
import type { ContentTabsProps } from "./types";

const createTabId = (label: string, index: number) => {
  const normalizedLabel = label
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return normalizedLabel || `tab-${index}`;
};

export const ContentTabs = ({
  className,
  ariaLabel = "Abas de conteúdo",
  hasTitle = false,
  sizeTitle = "medium",
  textTitle = "",
  defaultActiveId,
  areaSection = "container",
  maxWidthSection = "1200",
  marginTopSection = "0",
  marginTopSectionPhone = "0",
  sectionLabel = "",
  tabs = [],
  desktop,
  mobile,
}: ContentTabsProps) => {
  const { isDesktop } = useScreenResize();
  const activeTabs = tabs.filter((tab) => tab.active !== false);

  const tabItems = activeTabs.map((tab, index) => {
    const label = tab.label || `Aba ${index + 1}`;
    const id = tab.id?.trim() || createTabId(label, index);
    const imageConfig = isDesktop ? tab.desktop : tab.mobile;

    return {
      id,
      label,
      content: (
        <div className={styles.content}>
          {imageConfig?.srcImage &&
            (imageConfig.width && imageConfig.height ? (
              <div className={styles.tabImage}>
                <Image
                  src={imageConfig.srcImage}
                  alt={label}
                  width={imageConfig.width}
                  height={imageConfig.height}
                  className={styles.image}
                />
              </div>
            ) : (
              <div className={styles.tabImage}>
                <Image
                  src={imageConfig.srcImage}
                  alt={label}
                  fill
                  className={styles.image}
                />
              </div>
            ))}
          {!tab.isContentImage && (
            <div className={styles.tabText}>
              <Viewer value={tab.content || ""} />
            </div>
          )}
        </div>
      ),
    };
  });

  if (!tabItems.length) return null;

  const topmargin = isDesktop
    ? marginTopSection ?? "0"
    : marginTopSectionPhone ?? "0";

  const content = (
    <div
      className={`${styles.contentTabs}`}
      style={{
        maxWidth: maxWidthSection ? `${maxWidthSection}px` : undefined,
      }}
    >
      {hasTitle && (
        <div className={`boxTitle ${sizeTitle}`}>
          <Viewer value={textTitle} />
        </div>
      )}

      <Tabs
        items={tabItems}
        ariaLabel={ariaLabel}
        defaultActiveId={defaultActiveId}
        desktop={desktop}
        mobile={mobile}
      />
    </div>
  );

  if (areaSection === "container") {
    return (
      <section
        aria-label={sectionLabel || undefined}
        className={`${styles.section} ${className}`}
        style={{ marginTop: `${topmargin}px` }}
      >
        <div className="wrap">
          <div
            className="container"
            style={{
              maxWidth: maxWidthSection ? `${maxWidthSection}px` : undefined,
            }}
          >
            {content}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section
      aria-label={sectionLabel || undefined}
      style={{ marginTop: `${topmargin}px` }}
      className={`${styles.section} ${className}`}
    >
      <div className="wrap">{content}</div>
    </section>
  );
};

export default ContentTabs;
