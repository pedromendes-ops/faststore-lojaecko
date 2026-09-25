import { useMemo } from "react";
import type { CSSProperties } from "react";

import type { BannerLayer } from "..";
import { useDevice } from "../../../hooks/useDevice";

/**
 * Each banner is authored twice — one entry per breakpoint — so the component
 * only ever deals with the layers of the current device. Mismatched lengths mean
 * the CMS content is inconsistent (a layer missing on one side), so nothing is
 * rendered instead of reading `undefined` positions.
 */
export const useBannerLayers = (
  desktop: BannerLayer[],
  mobile: BannerLayer[],
) => {
  const { isDesktop } = useDevice();

  return useMemo(
    () =>
      desktop.length === mobile.length ? (isDesktop ? desktop : mobile) : [],
    [desktop, mobile, isDesktop],
  );
};

const PLACEMENT_KEYS = ["center", "left", "top", "right", "bottom"] as const;

/** Whether the layer authors any placement at all for its text box. */
const hasPlacement = (layer: BannerLayer) =>
  PLACEMENT_KEYS.some((key) => layer[key]);

/**
 * Places the text box over the image. `center` pins it to the middle of the
 * banner (the layer's own `top`/`left` are ignored); otherwise each edge is
 * applied as authored, and the ones left empty simply aren't set.
 */
export const getOverlayStyle = ({
  center,
  left,
  top,
  right,
  bottom,
  padding,
  maxWidth,
}: BannerLayer): CSSProperties => ({
  position: "absolute",
  left: center ? "50%" : left,
  top: center ? "50%" : top,
  right,
  bottom,
  transform: center ? "translate(-50%, -50%)" : undefined,
  padding,
  maxWidth: maxWidth ? `${maxWidth}px` : undefined,
});

/**
 * Placement for the single text box (`isTextUnique`), taken from the first layer
 * of the current breakpoint — it's one box for the whole section, so there's no
 * per-layer position to read. It stays in the normal flow unless that layer
 * actually authors a placement, so an unpositioned box keeps sitting below the
 * banners instead of being yanked on top of them.
 */
export const getTextBoxStyle = (
  layer?: BannerLayer,
): CSSProperties | undefined =>
  layer && hasPlacement(layer) ? getOverlayStyle(layer) : undefined;
