import { useEffect } from "react";

declare global {
  interface Window {
    Sizebay?: unknown;
  }
}

export const SizeBay = () => {
  useEffect(() => {
    if (!window.Sizebay) {
      return;
    }

    window.dispatchEvent(new Event("sizebay_event_pdp"));
  }, []);

  return null;
};
