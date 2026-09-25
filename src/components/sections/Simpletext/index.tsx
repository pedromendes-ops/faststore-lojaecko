import styles from "./Simpletext.module.scss";
import { Viewer } from "../../ui/viewer";

type Props = {
  titleText?: string;
  showTitle: boolean;
  tagTitle: string;
  alignTitle: "left" | "center";
  storesText?: string;
  areaSection?: "container" | "full";
  maxWidthSection?: string;
  marginTopSection?: string;
  sectionLabel?: string;
  active: boolean;
  className?: string;
};

export const Simpletext = ({
  titleText = "Título aqui",
  showTitle = true,
  tagTitle = "h1",
  alignTitle = "center",
  storesText = "Seu texto aqui",
  areaSection = "container",
  className = "",
  maxWidthSection,
  sectionLabel = "",
  marginTopSection = "0",
  active,
}: Props) => {
  if (areaSection === "container") {
    return (
      <section
        aria-label={sectionLabel || undefined}
        className={`${styles.section} ${className}`}
        style={{ marginTop: `${marginTopSection}px` }}
      >
        <div className="wrap">
          <div
            className="container"
            style={{
              maxWidth: maxWidthSection ? `${maxWidthSection}px` : undefined,
            }}
          >
            {showTitle && (
              <>
                {tagTitle === "h1" && (
                  <h1
                    className={styles.title}
                    style={{ textAlign: alignTitle }}
                  >
                    {titleText}
                  </h1>
                )}

                {tagTitle === "h2" && (
                  <h2
                    className={styles.title}
                    style={{ textAlign: alignTitle }}
                  >
                    {titleText}
                  </h2>
                )}

                {tagTitle === "h3" && (
                  <h3
                    className={styles.title}
                    style={{ textAlign: alignTitle }}
                    data-fs-simpletext-title
                  >
                    {titleText}
                  </h3>
                )}
              </>
            )}
            {active && (
              <div className={styles.simpletext}>
                <Viewer value={storesText || ""} />
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label={sectionLabel || undefined}
      className={`${styles.section} ${className}`}
      style={{ marginTop: `${marginTopSection}px` }}
    >
      <div className="wrap">
        {showTitle && (
          <>
            {tagTitle === "h1" && (
              <h1 className={styles.title} style={{ textAlign: alignTitle }}>
                {titleText}
              </h1>
            )}

            {tagTitle === "h2" && (
              <h2 className={styles.title} style={{ textAlign: alignTitle }}>
                {titleText}
              </h2>
            )}

            {tagTitle === "h3" && (
              <h3
                className={styles.title}
                style={{ textAlign: alignTitle }}
                data-fs-simpletext-title
              >
                {titleText}
              </h3>
            )}
          </>
        )}
        {active && (
          <div className={styles.simpletext}>
            <Viewer value={storesText || ""} />
          </div>
        )}
      </div>
    </section>
  );
};

export default Simpletext;
