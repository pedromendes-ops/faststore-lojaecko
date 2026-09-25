import Image from "next/image";
import Link from "next/link";

import { useDevice } from "../../hooks/useDevice";
import { useMemo } from "react";

import styles from "./styles.module.scss";

type ProductHighlightsItem = {
  link: string;
  imagemUrl: string;
  title: string;
  description: string;
};
type ProductHighlightsProps = {
  items: ProductHighlightsItem[];
  title: string;
  widthDesk: number;
  heightDesk: number;
  widthMobile: number;
  heightMobile: number;
  show?: boolean;
};
export const ProductHighlights = ({
  items,
  title,
  heightDesk,
  heightMobile,
  widthDesk,
  widthMobile,
  show = false,
}: ProductHighlightsProps) => {
  const { isDesktop } = useDevice();
  const size = useMemo(() => {
    if (isDesktop)
      return {
        height: heightDesk,
        width: widthDesk,
      };
    return {
      height: heightMobile,
      width: widthMobile,
    };
  }, [isDesktop]);

  if (!show) return null;
  return (
    <div className={`${styles.container}`}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.container_items}>
        {items.map((item, index) => (
          <div key={index} className={styles.item}>
            <Link href={item.link} className={styles.link}>
              <Image
                src={item.imagemUrl}
                width={size.height}
                height={size.width}
                alt={item.title}
              />
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
