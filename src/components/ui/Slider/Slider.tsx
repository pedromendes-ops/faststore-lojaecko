import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

// Relative import: useDevice is a store customization, so it isn't reachable
// through the `src/*` alias (which only resolves core components).
import { useDevice } from "../../hooks/useDevice";

import styles from "./styles.module.scss";

/** When a piece of chrome (dots/arrows) should be rendered. */
export type SliderVisibility = "always" | "desktop" | "mobile" | "never";

/** Layout axis: slides laid out left-to-right or top-to-bottom. */
export type SliderOrientation = "horizontal" | "vertical";

/** A single value, or per-device values (desktop = notebook and up). */
export interface SliderResponsive<T> {
  desktop?: T;
  mobile?: T;
}

export interface SliderProps {
  /** Slides. Each child becomes one slide. */
  children: ReactNode;
  /** Slides shown per page. A number, or per-device values. Default 1. */
  itemsPerPage?: number | SliderResponsive<number>;
  /** Gap between slides, in px. Default 8. */
  gap?: number;
  /** When to render the pagination dots. Default "never". */
  showDots?: SliderVisibility;
  /** When to render the prev/next arrows. Default "always". */
  showArrows?: SliderVisibility;
  /** Minimum drag distance along the main axis (px) to change page. Default 40. */
  swipeThreshold?: number;
  /** Layout axis. Default "horizontal". */
  orientation?: SliderOrientation;
  /**
   * Fixed main-axis size (px) of a single slide, used only in vertical mode to
   * give the viewport an explicit height (perPage items tall). The horizontal
   * layout stays measurement-free and ignores this.
   */
  itemSize?: number;
  className?: string;
  slideClassName?: string;
  "aria-label"?: string;
}

function resolveVisibility(v: SliderVisibility, isDesktop: boolean) {
  switch (v) {
    case "always":
      return true;
    case "never":
      return false;
    case "desktop":
      return isDesktop;
    case "mobile":
      return !isDesktop;
  }
}

function resolvePerPage(
  value: number | SliderResponsive<number>,
  isDesktop: boolean,
) {
  if (typeof value === "number") {
    return Math.max(1, value);
  }
  const picked = isDesktop ? value.desktop : value.mobile;
  return Math.max(1, picked ?? value.desktop ?? value.mobile ?? 1);
}

/**
 * Generic, controlled carousel/slider.
 *
 * Layout is fully CSS-driven: slide width is `calc((100% - gaps) / perPage)`
 * relative to the track (which is exactly the viewport width) and each page
 * shifts the track by `translateX(calc(page * -(100% + gap)))`. Nothing depends
 * on a measured pixel width to render, so it can't collapse inside modals or on
 * first paint. The viewport width is read only during a drag (when the element
 * is on screen) to snap to the nearest page.
 *
 * Supports pointer drag with snap, smooth CSS transitions, responsive
 * items-per-page and configurable dots/arrows — loosely mirroring VTEX IO's
 * `slider-layout`.
 */
export function Slider({
  children,
  itemsPerPage = 1,
  gap = 8,
  showDots = "never",
  showArrows = "always",
  swipeThreshold = 40,
  orientation = "horizontal",
  itemSize,
  className,
  slideClassName,
  "aria-label": ariaLabel,
}: SliderProps) {
  const slides = Children.toArray(children);
  const count = slides.length;

  const isVertical = orientation === "vertical";
  // The whole drag/snap math is axis-agnostic: it works off a single "main
  // axis" coordinate (X when horizontal, Y when vertical) and the viewport's
  // main-axis size.
  const mainCoord = (event: ReactPointerEvent) =>
    isVertical ? event.clientY : event.clientX;

  const { isDesktop } = useDevice();
  const perPage = resolvePerPage(itemsPerPage, Boolean(isDesktop));
  const totalPages = Math.max(1, Math.ceil(count / perPage));
  // Largest start index that still fills the viewport, so the last page shows a
  // full set of slides instead of leaving blank slots at the end.
  const maxStart = Math.max(0, count - perPage);

  const viewportRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);

  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const pointerStartX = useRef<number | null>(null);
  // Tracks whether the current gesture moved enough to count as a drag, so a
  // swipe doesn't also fire a click on the slide underneath.
  const movedRef = useRef(false);

  // Keep the page in range when items-per-page or the slide count changes.
  useEffect(() => {
    setPage((p) => Math.min(p, totalPages - 1));
  }, [totalPages]);

  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  const goTo = useCallback(
    (next: number) => setPage(Math.max(0, Math.min(totalPages - 1, next))),
    [totalPages],
  );
  const prev = useCallback(() => goTo(page - 1), [goTo, page]);
  const next = useCallback(() => goTo(page + 1), [goTo, page]);

  const onPointerDown = (event: ReactPointerEvent) => {
    if (totalPages <= 1) {
      return;
    }
    pointerStartX.current = mainCoord(event);
    movedRef.current = false;
    setIsDragging(true);
  };

  const onPointerMove = (event: ReactPointerEvent) => {
    if (pointerStartX.current === null) {
      return;
    }
    const delta = mainCoord(event) - pointerStartX.current;
    if (Math.abs(delta) > 5) {
      // Capture only once a drag is confirmed (not on every pointerdown) —
      // capturing eagerly reroutes the eventual click to this element instead
      // of the slide underneath, so a plain tap/click on a slide (e.g. a
      // thumbnail button) never fired its onClick.
      if (!movedRef.current) {
        event.currentTarget.setPointerCapture?.(event.pointerId);
      }
      movedRef.current = true;
    }
    setDragOffset(delta);
  };

  const endDrag = (event: ReactPointerEvent) => {
    if (pointerStartX.current === null) {
      return;
    }
    const delta = mainCoord(event) - pointerStartX.current;
    // Read the viewport's main-axis size (element is on screen here) to snap to
    // the page whose clamped start index is nearest to where the drag ended.
    const viewportSize = isVertical
      ? viewportRef.current?.clientHeight ?? 0
      : viewportRef.current?.clientWidth ?? 0;
    const slideStride = (viewportSize + gap) / perPage;
    if (Math.abs(delta) > swipeThreshold && slideStride > 0) {
      const start = Math.min(page * perPage, maxStart);
      const continuous = start - delta / slideStride;
      let best = page;
      let bestDist = Infinity;
      for (let p = 0; p < totalPages; p += 1) {
        const dist = Math.abs(Math.min(p * perPage, maxStart) - continuous);
        if (dist < bestDist) {
          bestDist = dist;
          best = p;
        }
      }
      goTo(best);
    }
    pointerStartX.current = null;
    setDragOffset(0);
    setIsDragging(false);
  };

  // Swallow the click that follows a drag so slides aren't activated on swipe.
  const onClickCapture = (event: ReactMouseEvent) => {
    if (movedRef.current) {
      event.preventDefault();
      event.stopPropagation();
      movedRef.current = false;
    }
  };

  const dotsVisible =
    resolveVisibility(showDots, Boolean(isDesktop)) && totalPages > 1;
  const arrowsVisible =
    resolveVisibility(showArrows, Boolean(isDesktop)) && totalPages > 1;

  // Slide width and translate are pure CSS calc()s — no measurement. The track
  // is shifted by the clamped start index (in slide units), so it never scrolls
  // past the last slide. One slide step == (100% + gap) / perPage.
  const startIdx = Math.min(page * perPage, maxStart);
  const slideBasis = `calc((100% - ${(perPage - 1) * gap}px) / ${perPage})`;
  const axis = isVertical ? "Y" : "X";
  const trackTransform = `translate${axis}(calc(${-startIdx} * (100% + ${gap}px) / ${perPage} + ${dragOffset}px))`;

  // Vertical mode has no natural main-axis size (the column would collapse), so
  // the viewport gets an explicit height of exactly `perPage` items. With this,
  // the same percentage-based basis/transform above resolve to `itemSize` and
  // `itemSize + gap` respectively — the math stays identical to horizontal.
  const viewportStyle =
    isVertical && itemSize
      ? { height: perPage * itemSize + (perPage - 1) * gap }
      : undefined;

  return (
    <div
      className={`${styles.slider} ${isVertical ? styles.vertical : ""} ${
        className ?? ""
      }`}
      aria-roledescription="carousel"
      aria-label={ariaLabel}
    >
      <div className={styles.container}>
        {arrowsVisible && (
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowPrev}`}
            onClick={prev}
            disabled={!canPrev}
            aria-label="Anterior"
          />
        )}

        <div
          className={styles.viewport}
          ref={viewportRef}
          style={viewportStyle}
        >
          <div
            className={styles.track}
            style={{
              gap: `${gap}px`,
              transform: trackTransform,
              transition: isDragging ? "none" : undefined,
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onClickCapture={onClickCapture}
          >
            {slides.map((slide, index) => (
              <div
                // Slides are a stable, index-ordered list.
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                className={`${styles.slide} ${slideClassName ?? ""}`}
                style={
                  isVertical
                    ? { flex: `0 0 ${slideBasis}`, height: slideBasis }
                    : { flex: `0 0 ${slideBasis}`, width: slideBasis }
                }
              >
                {slide}
              </div>
            ))}
          </div>
        </div>

        {arrowsVisible && (
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowNext}`}
            onClick={next}
            disabled={!canNext}
            aria-label="Próximo"
          />
        )}
      </div>

      {dotsVisible && (
        <div className={styles.dots} role="tablist">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              // Dots map one-to-one to pages.
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              type="button"
              role="tab"
              className={styles.dot}
              data-active={i === page || undefined}
              aria-selected={i === page}
              aria-label={`Ir para página ${i + 1}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Slider;
