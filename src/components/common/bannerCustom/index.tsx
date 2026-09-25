import Link from "next/link";
import { Image } from "src/components/ui/Image";
import useScreenResize from "src/sdk/ui/useScreenResize";

import styles from "./BannerCustom.module.scss";

type BannerItem = {
  image: string;
  useSameImageMobile?: boolean;
  imageMobile?: string;
  href?: string;
  target?: "_self" | "_blank";
};

type Props = {
  isDoubleBanner?: boolean;
  display?: "full" | "container";
  sectionLabel?: string;
  marginTopSection?: string;
  marginTopSectionPhone?: string;
  maxWidthSection?: string;
  height?: number;
  loading?: "eager" | "lazy";
  banners?: BannerItem[];
};

const defaultBanners: BannerItem[] = [
  {
    image: "/arquivos/banner-desktop.jpg",
    useSameImageMobile: false,
    imageMobile: "/arquivos/banner-mobile.jpg",
    href: "#",
    target: "_self",
  },
];

export const BannerCustom = ({
  isDoubleBanner = false,
  display = "full",
  height = 700,
  loading = "lazy",
  sectionLabel = 'video',
  marginTopSection = '',
  marginTopSectionPhone = '',
  maxWidthSection = '',
  banners = [],

}: Props) => {
  
  const { isDesktop } = useScreenResize();
  const items = (banners.length ? banners : defaultBanners).slice(
    0,
    isDoubleBanner ? 2 : 1,
  );
  const topmargin = isDesktop ? marginTopSection ?? '0' : marginTopSectionPhone ?? '0'

  const content = (
    <div
      className={styles.bannerCustom}
      style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}
    >
      {items.map((item, index) => {
        const src = item.useSameImageMobile
          ? item.image
          : isDesktop
          ? item.image
          : item.imageMobile || item.image;

        return (
          <div key={index} className={styles.bannerItem}>
            <Link
              href={item.href || "#"}
              target={item.target || "_self"}
              className={`${styles.link}`}
            >
              <Image
                src={src}
                alt={`Banner ${index + 1}`}
                width={isDesktop ? 1920 : 750}
                height={height}
                loading={index === 0 ? loading : "lazy"}
                className={styles.image}
              />
            </Link>
          </div>
        );
      })}
    </div>
  );

  if (display === "container") {
    return (
      <section
        aria-label={sectionLabel || undefined}        
        style={{ marginTop: `${topmargin}px` }}
      >
        <div className="wrap">
          <div className="container" style={{ maxWidth: maxWidthSection ? `${maxWidthSection}px` : undefined, }}>
            {content}
          </div>
        </div>  
      </section>
      
    );
  }

  return (
    <section
      aria-label={sectionLabel || undefined}
      className={styles.section}
      style={{ marginTop: `${topmargin}px` }}
    >
      <div className="wrap">{content}</div>
    </section>
  );
};

export default BannerCustom;
