import { useState, useCallback, useEffect } from "react";

export const useMenuDesktop = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const onClose = useCallback(() => {
    setIsClosing((current) => (current ? current : true));
  }, []);

  const onToggle = useCallback(
    (index: number) => {
      setActiveIndex((current) => {
        if (current === index && !isClosing) {
          setIsClosing(true);
          return current;
        }
        setIsClosing(false);
        return index;
      });
    },
    [isClosing],
  );

  const onSelect = useCallback((index: number) => {
    setIsClosing(false);
    setActiveIndex(index);
  }, []);

  const onTransitionEnd = useCallback(() => {
    setIsClosing((closing) => {
      if (closing) {
        setActiveIndex(null);
      }
      return false;
    });
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, onClose]);

  return { activeIndex, isClosing, onToggle, onSelect, onClose, onTransitionEnd };
};
