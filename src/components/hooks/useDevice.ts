import { useEffect, useState } from "react";

// We are using the Moto G Power device measurement as a reference (mobile), as used by PageSpeed Insights.
const MAX_MOBILE_WIDTH = 420;
const MAX_TABLET_WIDTH = 1024;
const MIN_NOTEBOOK_WIDTH = 1280;

export const useDevice = () => {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);
  const [isTablet, setIsTablet] = useState<boolean | undefined>(undefined);
  const [isDesktop, setIsDesktop] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= MAX_MOBILE_WIDTH);
      setIsTablet(
        window.innerWidth > MAX_MOBILE_WIDTH &&
          window.innerWidth <= MAX_TABLET_WIDTH,
      );
      setIsDesktop(window.innerWidth >= MIN_NOTEBOOK_WIDTH);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return {
    isMobile: isTablet || isMobile,
    isTablet,
    isDesktop,
    loading:
      isMobile === undefined ||
      isTablet === undefined ||
      isDesktop === undefined,
  };
};
