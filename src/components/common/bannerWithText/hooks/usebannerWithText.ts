import type { BannerWithTextProps } from "..";
import { useDevice } from "../../../hooks/useDevice";

export const useBannerWithText = (props: BannerWithTextProps) => {
  const { desktop, mobile } = props;

  const { isDesktop } = useDevice();

  const mobileStyle = {
    "--left": mobile.left,
    "--top": mobile.centerY ? "50%" : mobile.top,
    "--right": mobile.right,
    "--bottom": mobile.bottom,
    "--flexDirection": mobile.flexDirection ?? "row",
    ...(mobile.isPositionAbsolute && { "--position": "absolute" }),
    ...(mobile.padding && { "--padding": mobile.padding }),
    "--max-width": `${mobile.maxWidth}px`,
    ...(mobile.centerY && { "--centerY": "-50%" }),
  };
  const desktopStyle = {
    "--left": desktop.left,
    "--top": desktop.centerY ? "50%" : desktop.top,
    "--right": desktop.right,
    "--bottom": desktop.bottom,
    ...(desktop.isPositionAbsolute && { "--position": "absolute" }),
    ...(desktop.padding && { "--padding": desktop.padding }),
    "--max-width": `${desktop.maxWidth}px`,
    ...(desktop.centerY && { "--centerY": "-50%" }),
  };

  const style = (isDesktop ? desktopStyle : mobileStyle) as React.CSSProperties;

  return {
    style,
  };
};
