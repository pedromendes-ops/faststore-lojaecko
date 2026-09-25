import { useEffect, useState } from "react";
import { useFadeEffect, Button, Icon } from "@faststore/ui";
import { SlideOver, SlideOverHeader } from "@faststore/ui";
import styles from "./styles.module.scss";

type DrawerProps = {
  children: React.ReactNode;
  isButton?: boolean;
  text?: string;
};

export const Drawer = ({ children, isButton = true, text }: DrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { fade, fadeOut, fadeIn } = useFadeEffect();

  const onClose = () => {
    fadeOut();
  };
  const onOpen = () => {
    setIsOpen(true);
    fadeIn();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [isOpen]);

  return (
    <>
      {isButton && (
        <Button
          variant="secondary"
          onClick={() => onOpen()}
          data-fs-drawer-menu="true"
          icon={<Icon name="List" color="#000" />}
        />
      )}
      {!isButton && (
        <button onClick={() => onOpen()} className={styles["open-modal"]}>
          {text}
        </button>
      )}

      <SlideOver
        data-fs-organization-drawer
        fade={fade}
        onDismiss={fadeOut}
        onTransitionEnd={() => fade === "out" && setIsOpen(false)}
        isOpen={isOpen}
        size="partial"
        direction="leftSide"
        overlayProps={{
          className: `section section-organization-drawer`,
        }}
      >
        <SlideOverHeader
          onClose={() => onClose()}
          closeBtnProps={{
            size: "small",
          }}
        />
        {children}
      </SlideOver>
    </>
  );
};
