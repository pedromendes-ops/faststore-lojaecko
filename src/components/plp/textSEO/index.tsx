import { useLayoutEffect, useRef, useState } from "react";
import { useTextSEO } from "./useTextSEO";
import styles from "./styles.module.scss";
import { ChevronUp } from "lucide-react";

export type TextSEOSectionType = "textSEO" | "aboutSEO";

export interface TextSEOProps {
  /**
   * Which SEO block to render. The category SEO API returns both
   * `aboutCategory` and `textSEO`; one CMS section renders one of them so the
   * operator can place each block independently on the PLP.
   */
  type: TextSEOSectionType;
  /** Optional section heading. Falls back to the default label when omitted. */
  title?: string;
}

const COLLAPSED_LINES = 5;

/**
 * SEO text block for the PLP. Reads the server-rendered `aboutCategory` and
 * `textSEO` for the current category from the PLP context (resolved via the
 * ServerCollectionPage fragment + StoreCollection resolver in
 * src/graphql/thirdParty/resolvers/textSEO.ts) and renders the requested one.
 *
 * The copy is in the initial HTML — indexable and visible with JS disabled.
 * Only the collapse ("Mostrar mais/menos") is client-side. Operates entirely
 * off the PLP context — no manual category id wiring in the CMS. When the API
 * has no copy for the requested block, the section renders nothing, so dropping
 * it on a category that doesn't support the API is safe.
 */
export function TextSEO({ type }: TextSEOProps) {
  const { data } = useTextSEO();

  const body = type === "aboutSEO" ? data?.aboutCategory : data?.textSEO;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const [heights, setHeights] = useState<{
    collapsed: number;
    full: number;
  } | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // The inner div is never clamped by CSS — it's always laid out at its
  // natural full height. Clipping happens on the wrapper via `max-height`,
  // which (unlike `-webkit-line-clamp`) can be transitioned smoothly between
  // the collapsed and full heights.
  useLayoutEffect(() => {
    const node = bodyRef.current;

    if (!node) {
      return;
    }

    const measure = () => {
      const lineHeight = parseFloat(getComputedStyle(node).lineHeight) || 0;
      const full = node.scrollHeight;
      const collapsed = Math.min(lineHeight * COLLAPSED_LINES, full);

      setHeights({ collapsed, full });
      setIsClamped(full > collapsed + 1);
    };

    measure();

    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [body]);

  if (!body) {
    return null;
  }

  return (
    <section
      data-fs-text-seo
      data-fs-text-seo-type={type}
      className={`${styles.sectionseo} ${styles[type]}`}
    >
      <div className="wrap">
        <div className="container">
          <div
            className={styles.bodyWrapper}
            style={
              type !== "textSEO"
                ? { height: "auto" }
                : heights
                ? { maxHeight: isExpanded ? heights.full : '88px' }
                : undefined
            }
          >
            <div
              ref={bodyRef}
              className={styles.body}
              dangerouslySetInnerHTML={{ __html: body }}
            />
          </div>

          {isClamped && type === "textSEO" && (
            <div className={styles["toggleButton--div"]}>
              <button
                type="button"
                className={`${styles.toggleButton} ${styles["icon"]}`}
                onClick={() => setIsExpanded((current) => !current)}
                aria-expanded={isExpanded}
                data-fs-isExpanded={isExpanded}
              >
                {isExpanded ? "Mostrar menos" : "Mostrar mais"}
                <ChevronUp />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default TextSEO;
