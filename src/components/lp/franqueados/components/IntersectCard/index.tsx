import type { ReactNode } from "react";

import { RawSvg } from "../RawSvg";
import styles from "./styles.module.scss";

type IntersectCardProps = {
  /** SVG cru da faixa angular (varia por bloco e por breakpoint). */
  svg: string;
  /** Handle original do bloco (`...-04-card-intersect`, `...-06-...`, etc.). */
  className: string;
  children: ReactNode;
};

/**
 * "Faixa" angular com texto sobreposto, repetida nos blocos 04, 06 e 07.
 * O desenho (largura, posição, tipografia) continua vindo do CSS do bloco,
 * via o handle passado em `className` — aqui fica só o que os três dividem.
 */
export const IntersectCard = ({
  svg,
  className,
  children,
}: IntersectCardProps) => (
  <div className={`${styles.card} ${className}`}>
    <RawSvg svg={svg} className="franqShape" />

    <div className="vtex-rich-text-0-x-container vtex-rich-text-0-x-container--card-intersect">
      <p className="lh-copy vtex-rich-text-0-x-paragraph vtex-rich-text-0-x-paragraph--card-intersect">
        {children}
      </p>
    </div>
  </div>
);

export default IntersectCard;
