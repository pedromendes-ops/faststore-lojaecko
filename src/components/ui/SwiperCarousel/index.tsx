import { Children, useId, useState } from "react";
import type { ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper/types";
import { A11y, Autoplay, Pagination } from "swiper/modules";

// CSS do Swiper. Importar CSS de node_modules é permitido em qualquer
// componente pelo Next (a restrição de "global CSS só no _app" não vale para
// pacotes). O visual fica ajustado em styles.module.scss.
import "swiper/css";
import "swiper/css/pagination";

import styles from "./styles.module.scss";

/**
 * Mesma semântica do `slider-layout` do VTEX IO: em quais telas o controle
 * aparece.
 */
export type ShowControl = "always" | "mobileOnly" | "desktopOnly" | "never";

export type SwiperCarouselProps = {
  id?: string;
  children: ReactNode;

  /**
   * Fallback vindo da section nativa (`itemsPerPage` do CMS). Vale para o
   * desktop quando `itemsPerPageDesktop` não for preenchido.
   */
  itemsPerPage?: number;
  itemsPerPageDesktop?: number;
  itemsPerPageTablet?: number;
  itemsPerPageMobile?: number;

  showNavigationArrows?: ShowControl;
  showPaginationDots?: ShowControl;

  infinite?: boolean;
  autoplay?: boolean;
  /** Intervalo do autoplay em ms. */
  autoplayTimeout?: number;
  /** Espaço entre os itens, em px. */
  gap?: number;
  /**
   * Quanto cada clique nas setas avança:
   * - `overlap` (padrão): um a menos que o visível — mostrando 5 anda 4, no
   *   mobile (2 visíveis) anda 1. O card que sobra serve de referência de
   *   onde o usuário estava.
   * - `page`: o bloco inteiro (como o `slider-layout` do VTEX IO).
   * - `item`: de um em um, em qualquer tela.
   */
  navigationStep?: "overlap" | "page" | "item";
};

/**
 * O que o CMS controla numa shelf. `id` e `itemsPerPage` ficam de fora porque
 * quem manda neles é a section nativa.
 */
export type CarouselConfiguration = Omit<
  SwiperCarouselProps,
  "children" | "id" | "itemsPerPage"
>;

// Os mesmos cortes que o CSS da loja já usa (641px / 1024px).
const TABLET_BREAKPOINT = 640;
const DESKTOP_BREAKPOINT = 1024;

const Chevron = ({ direction }: { direction: "prev" | "next" }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d={direction === "prev" ? "M15 4 7 12l8 8" : "M9 4l8 8-8 8"}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Carrossel baseado em Swiper, com a API do `slider-layout` do VTEX IO
 * (itens por página por breakpoint, setas e dots configuráveis).
 *
 * Entra no lugar do carrossel nativo do FastStore pelo slot
 * `__experimentalCarousel` da section ProductShelf.
 *
 * As setas são nossas (e não as do módulo Navigation) porque o layout as
 * coloca FORA do trilho, e o container do Swiper é `overflow: hidden` — setas
 * injetadas por ele seriam cortadas.
 */
export const SwiperCarousel = ({
  id,
  children,
  itemsPerPage = 5,
  itemsPerPageDesktop,
  itemsPerPageTablet = 3,
  itemsPerPageMobile = 2,
  showNavigationArrows = "always",
  showPaginationDots = "mobileOnly",
  infinite = false,
  autoplay = false,
  autoplayTimeout = 5000,
  gap = 16,
  navigationStep = "overlap",
}: SwiperCarouselProps) => {
  const generatedId = useId();
  const carouselId = id ?? generatedId;

  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  // `locked` = todos os slides cabem na tela; não há o que navegar
  const [isLocked, setIsLocked] = useState(false);

  // cada filho (ProductCard) precisa virar um slide
  const slides = Children.toArray(children);

  const perDesktop = itemsPerPageDesktop ?? itemsPerPage;

  // o loop do Swiper precisa de slides suficientes para clonar; abaixo disso
  // ele se desliga sozinho e deixa o estado de setas inconsistente
  const loop = infinite && slides.length > perDesktop;

  const modules = autoplay ? [Pagination, A11y, Autoplay] : [Pagination, A11y];

  // `perView` pode ser fracionário (ex.: 1.6 para espiar o próximo card), por
  // isso o floor antes de contar quantos itens andam por clique
  const groupFor = (perView: number) => {
    const visible = Math.max(1, Math.floor(perView));

    switch (navigationStep) {
      case "page":
        return visible;
      case "item":
        return 1;
      default:
        return Math.max(1, visible - 1);
    }
  };

  const syncState = (instance: SwiperClass) => {
    setIsBeginning(instance.isBeginning);
    setIsEnd(instance.isEnd);
    setIsLocked(instance.isLocked);
  };

  return (
    <div
      className={styles.carousel}
      data-arrows={showNavigationArrows}
      data-dots={showPaginationDots}
      data-locked={isLocked || undefined}
    >
      <button
        type="button"
        className={styles.arrow}
        data-direction="prev"
        aria-label="previous"
        aria-controls={carouselId}
        // no modo infinito nunca há começo/fim
        disabled={!loop && isBeginning}
        onClick={() => swiper?.slidePrev()}
      >
        <Chevron direction="prev" />
      </button>

      <Swiper
        id={carouselId}
        modules={modules}
        spaceBetween={gap}
        loop={loop}
        autoplay={
          autoplay
            ? {
                delay: autoplayTimeout,
                disableOnInteraction: true,
                pauseOnMouseEnter: true,
              }
            : false
        }
        pagination={{ clickable: true }}
        // sem slides suficientes o Swiper trava o trilho em vez de deixar
        // arrastar um carrossel que não sai do lugar
        watchOverflow
        a11y={{ enabled: true }}
        slidesPerView={itemsPerPageMobile}
        slidesPerGroup={groupFor(itemsPerPageMobile)}
        breakpoints={{
          [TABLET_BREAKPOINT]: {
            slidesPerView: itemsPerPageTablet,
            slidesPerGroup: groupFor(itemsPerPageTablet),
          },
          [DESKTOP_BREAKPOINT]: {
            slidesPerView: perDesktop,
            slidesPerGroup: groupFor(perDesktop),
          },
        }}
        onSwiper={(instance) => {
          setSwiper(instance);
          syncState(instance);
        }}
        onSlideChange={syncState}
        // o número de slides visíveis muda no resize, e com ele o "fim"
        onBreakpoint={syncState}
        onResize={syncState}
        onLock={syncState}
        onUnlock={syncState}
      >
        {slides.map((slide, index) => (
          // Children.toArray já gera uma key estável por produto; o índice é
          // só o fallback para filhos que não são elementos
          <SwiperSlide
            key={(slide as { key?: string | null })?.key ?? index}
          >
            {slide}
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        type="button"
        className={styles.arrow}
        data-direction="next"
        aria-label="next"
        aria-controls={carouselId}
        disabled={!loop && isEnd}
        onClick={() => swiper?.slideNext()}
      >
        <Chevron direction="next" />
      </button>
    </div>
  );
};

/**
 * Componente pronto para o slot `__experimentalCarousel` de uma shelf.
 *
 * Precisa ser um wrapper, e não `{ Component, props }`: o core ignora `props`
 * (e avisa no console) sempre que um `Component` também é informado — ver
 * `getSectionOverrides` em @faststore/core. Então a config do CMS entra por
 * dentro do componente.
 *
 * A config vem DEPOIS dos props da section para que `itemsPerPageDesktop` do
 * CMS vença o `itemsPerPage` genérico; chaves não preenchidas são descartadas
 * para não sobrescrever os defaults com `undefined`.
 */
export const withCarouselConfiguration = (
  configuration: CarouselConfiguration = {},
) => {
  const defined = Object.fromEntries(
    Object.entries(configuration).filter(([, value]) => value !== undefined),
  );

  return function ConfiguredSwiperCarousel(props: SwiperCarouselProps) {
    return <SwiperCarousel {...props} {...defined} />;
  };
};

export default SwiperCarousel;
