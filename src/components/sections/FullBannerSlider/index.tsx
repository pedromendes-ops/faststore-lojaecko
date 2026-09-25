import { Carousel, Icon } from "@faststore/ui";
import styles from "./styles.module.scss";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Image } from "src/components/ui/Image";
//import { useDevice } from "../../hooks/useDevice";
import useScreenResize from "../../common/MyScreenResize";

type Item = {
  image: string;
  imageMobile: string;
  href?: string;
  target: "_blank" | "_self";
};
type FullBannerSliderProps = {
  items: Item[];
  height: number;
  loading?: "eager" | "lazy";
  autoPlay?: boolean;
  autoPlayInterval?: number;
  infiniteMode?: boolean;
};

export const FullBannerSlider = ({
  items = [
    {
      image:
        "https://lojalevis.vteximg.com.br/arquivos/banner-des-01-teste.jpg",
      imageMobile: "/arquivos/banner-phone-01-teste.jpg",
      href: "/",
      target: "_self",
    },
    {
      image:
        "https://lojalevis.vteximg.com.br/arquivos/banner-des-01-teste.jpg",
      imageMobile: "/arquivos/banner-phone-02-teste.jpg",
      href: "/colecao",
      target: "_self",
    },
  ],
  height = 720,
  loading = "lazy",
  autoPlay = false,
  autoPlayInterval = 5000,
  infiniteMode = true,
}: FullBannerSliderProps) => {
  const { isDesktop } = useScreenResize();
  //const mobile = isMobile;
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!autoPlay || items.length <= 1) {
      return;
    }

    const intervalId = setInterval(() => {
      sectionRef.current
        ?.querySelector<HTMLButtonElement>('button[aria-label="next"]')
        ?.click();
    }, autoPlayInterval);

    return () => clearInterval(intervalId);
  }, [autoPlay, autoPlayInterval, items.length]);

  return (
    <section className={styles.fullBanner} ref={sectionRef}>
      <Carousel
        itemsPerPage={1}
        variant="slide"
        infiniteMode={infiniteMode}
        controls={"navigationArrows"}
        className={"fullbanners"}
        navigationIcons={{
          left: <Icon name="CaretLeft" color="#fff" fontSize={32} />,
          right: <Icon name="CaretRight" color="#fff" fontSize={32} />,
        }}
      >
        {items?.map((item, index) => (
          <div key={index} className={styles.carouselItem}>
            <Link href={item?.href || "#"} target={item.target}>
              <Image
                src={isDesktop ? item.image : item.imageMobile}
                alt={`Banner ${index + 1}`}
                width={isDesktop ? 1920 : 641}
                height={height}
                style={{
                  width: "100%",
                  height: `${isDesktop ? "46.51vw" : "125.581vw"}`,
                }}
                loading={index === 0 ? loading : "lazy"}
                fetchPriority={index === 0 ? "high" : "low"}
              />
            </Link>
          </div>
        ))}
      </Carousel>
    </section>
  );
};
