import { useState, useMemo, type CSSProperties } from "react";
import styles from "./guideSize.module.scss";
import Viewer from "../../ui/viewer";
import { useDevice } from "../../hooks/useDevice";

type GuideSizeProps = {
  marginTopSection?: string;
  height?: string;
  positionImage?: "left" | "right";
  images: {
    srcImage: string;
    altImage: string;
  }[];
  text: string;
};

export const GuideSize = ({
  marginTopSection,
  images,
  text,
  height,
  positionImage,
}: GuideSizeProps) => {
  const [activeImage, setActiveImage] = useState(0);

  const { isDesktop } = useDevice();

  const style = useMemo<CSSProperties | undefined>(() => {
    if (positionImage === "right" && isDesktop) {
      return {
        flexDirection: "row-reverse",
      };
    }
  }, [positionImage, isDesktop]);

  return (
    <section
      className={styles.guideSize}
      style={{ marginTop: marginTopSection }}
    >
      <div className={`${styles.guideSizeContent}`} style={style}>
        <div className={styles.guideSizeImages}>
          <img
            src={images[activeImage].srcImage}
            width={"100%"}
            height={height ?? "auto"}
            className={styles.guideSizeImageMain}
          />
          <div className={styles.guideSizeThumbnails}>
            {images.map((image, index) => (
              <button
                key={index}
                className={`${styles.guideSizeButton} ${
                  activeImage === index ? styles.active : ""
                }`}
                onClick={() => setActiveImage(index)}
              >
                <img
                  src={image.srcImage}
                  width={"64px"}
                  height={"64px"}
                  className={styles.guideSizeImageThumbnail}
                />
              </button>
            ))}
          </div>
        </div>

        <div className={styles.guideSizeText}>
          <Viewer value={text} />
        </div>
      </div>
    </section>
  );
};
