import { Image } from "src/components/ui/Image";
import styles from "./styles.module.scss";
import Viewer from "../../ui/viewer";
import {
  getOverlayStyle,
  getTextBoxStyle,
  useBannerLayers,
} from "./hooks/usebannerWithText";

const DEFAULT_IMAGE_WIDTH = 1920;
const DEFAULT_IMAGE_HEIGHT = 700;

/** One banner image plus the placement of its text box, per breakpoint. */
export type BannerLayer = {
  srcImage: string;
  text?: string;
  height?: number;
  width?: number;
  left?: string;
  top?: string;
  right?: string;
  bottom?: string;
  center?: boolean;
  padding?: string;
  maxWidth?: number;
};

export type BannerWithTextProps = {
  href?: string;
  text: string;
  isFullWidth?: boolean;
  className?: "small" | "medium" | "large";
  classNameContainer?: string;
  display: "full" | "container";
  /** When true the copy is a single box below the banners, not one per layer. */
  isTextUnique: boolean;
  desktop: BannerLayer[];
  mobile: BannerLayer[];
};

export const BannerWithText = ({
  desktop,
  mobile,
  classNameContainer = "",
  display = "full",
  href,
  text,
  isFullWidth = true,
  className = "large",
  isTextUnique = false,
}: BannerWithTextProps) => {
  const layers = useBannerLayers(desktop, mobile);

  return (
    <section
      className={`${styles.bannerContainer} ${
        isFullWidth ? styles.fullWidth : ""
      } ${classNameContainer}`}
      style={{ position: "relative" }}
    >
      <div className={styles.banner}>
        {layers.map((layer, index) => (
          <div key={`${layer.srcImage}-${index}`}>
            <Image
              src={layer.srcImage}
              alt={text}
              width={Number(layer.width) || DEFAULT_IMAGE_WIDTH}
              height={Number(layer.height) || DEFAULT_IMAGE_HEIGHT}
              style={{
                height: layer.height ? `${layer.height}px` : undefined,
              }}
            />
            {!isTextUnique && (
              <div
                className={styles["text--view"]}
                style={getOverlayStyle(layer)}
              >
                <Viewer value={layer.text} />
              </div>
            )}
          </div>
        ))}
      </div>
      {isTextUnique && (
        <div
          className={[styles.TextBox, styles[`textBox-${className}`]]
            .filter(Boolean)
            .join(" ")}
          style={getTextBoxStyle(layers[0])}
        >
          <Viewer value={text} />
        </div>
      )}
    </section>
  );
};
