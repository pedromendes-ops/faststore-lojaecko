import type { ImageElementData } from "@faststore/ui";
import type { PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";

// Minimum horizontal drag distance (px) to advance to the next/previous slide.
const SWIPE_THRESHOLD = 50;

// Divisor used to dampen the drag when pulling beyond the first/last slide.
const EDGE_RESISTANCE = 3;

export interface PointerHandlers {
  onPointerDown: (event: PointerEvent) => void;
  onPointerMove: (event: PointerEvent) => void;
  onPointerUp: (event: PointerEvent) => void;
  onPointerCancel: (event: PointerEvent) => void;
}

export interface ImageSlider {
  selectedIdx: number;
  isDragging: boolean;
  /** Drag offset (px) to apply to the track, already damped at the edges. */
  visualDelta: number;
  hasMultiple: boolean;
  atStart: boolean;
  atEnd: boolean;
  goTo: (idx: number) => void;
  prev: () => void;
  next: () => void;
  /** Spread these onto the element that should capture the swipe gesture. */
  pointerHandlers: PointerHandlers;
}

/**
 * Controlled slider state for the PDP image gallery.
 *
 * Owns the selected index, the pointer/drag gesture and the derived
 * navigation flags, so the gallery components stay purely presentational and
 * the track, thumbnails, arrows and bullets all read from a single source of
 * truth.
 *
 * @param images Images in the gallery (drives total and the reset-on-change).
 */
export function useImageSlider(images: ImageElementData[]): ImageSlider {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [dragDelta, setDragDelta] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const pointerStartX = useRef<number | null>(null);

  // Reset to the first image when the product (images) changes.
  useEffect(() => {
    setSelectedIdx(0);
  }, [images]);

  const total = images.length;
  const hasMultiple = total > 1;
  const atStart = selectedIdx === 0;
  const atEnd = selectedIdx === total - 1;

  // Clamp navigation so the track never slides past the first/last image.
  const goTo = (idx: number) =>
    setSelectedIdx(Math.max(0, Math.min(total - 1, idx)));
  const prev = () => goTo(selectedIdx - 1);
  const next = () => goTo(selectedIdx + 1);

  const onPointerDown = (event: PointerEvent) => {
    if (!hasMultiple) {
      return;
    }
    pointerStartX.current = event.clientX;
    setIsDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (pointerStartX.current === null) {
      return;
    }
    setDragDelta(event.clientX - pointerStartX.current);
  };

  const onPointerUp = (event: PointerEvent) => {
    if (pointerStartX.current === null) {
      return;
    }
    const delta = event.clientX - pointerStartX.current;
    if (delta > SWIPE_THRESHOLD) {
      prev();
    } else if (delta < -SWIPE_THRESHOLD) {
      next();
    }
    pointerStartX.current = null;
    setDragDelta(0);
    setIsDragging(false);
  };

  // Add edge resistance: dampen the drag when pulling beyond the first/last.
  const visualDelta =
    (atStart && dragDelta > 0) || (atEnd && dragDelta < 0)
      ? dragDelta / EDGE_RESISTANCE
      : dragDelta;

  return {
    selectedIdx,
    isDragging,
    visualDelta,
    hasMultiple,
    atStart,
    atEnd,
    goTo,
    prev,
    next,
    pointerHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
    },
  };
}
