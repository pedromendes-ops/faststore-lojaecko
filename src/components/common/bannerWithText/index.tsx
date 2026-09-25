import { Image } from "src/components/ui/Image";
import styles from "./styles.module.scss";
import Viewer from "../../ui/viewer";
import { useBannerWithText } from "./hooks/usebannerWithText";
import { useDevice } from "../../hooks/useDevice";

export type BannerWithTextProps = {
  href?: string;
  text: string;
  isFullWidth?: boolean;
  className?: "small" | "medium" | "large";
  classNameContainer?: string;
  desktop: {
    srcImage: string;
    height?: number;
    width?: number;
    isPositionAbsolute?: boolean;
    left?: string;
    top?: string;
    centerY?: boolean;
    right?: string;
    bottom?: string;
    padding?: string;
    maxWidth?: number;
  };
  mobile: {
    srcImage: string;
    height?: number;
    width?: number;
    isPositionAbsolute?: boolean;
    left?: string;
    top?: string;
    centerY?: boolean;
    right?: string;
    bottom?: string;
    flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
    padding?: string;
    maxWidth?: number;
  };
};

export const BannerWithText = ({
  desktop,
  mobile,
  classNameContainer = "",
  href,
  text,
  isFullWidth = true,
  className = "large",
}: BannerWithTextProps) => {
  const { isDesktop } = useDevice();
  const { style } = useBannerWithText({
    desktop,
    mobile,
    href,
    text,
    isFullWidth,
  });

  return (
    <section
      className={`${styles.bannerContainer} ${
        isFullWidth ? styles.fullWidth : ""
      } ${classNameContainer}`}
      style={style}
    >
      <div className={styles.banner}>
        <Image
          src={isDesktop ? desktop.srcImage : mobile.srcImage}
          alt={text}
          width={Number(isDesktop ? desktop.width : mobile.width) || 1920}
          height={Number(isDesktop ? desktop.height : mobile.height) || 700}
          style={{
            height: `${isDesktop ? desktop.height : mobile.height}px`,
          }}
        />
      </div>
      <div
        className={[styles.TextBox, styles[`textBox-${className}`]]
          .filter(Boolean)
          .join(" ")}
      >
        <Viewer value={text} />
      </div>
    </section>
  );
};
