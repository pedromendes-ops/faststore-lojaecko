import type { CSSProperties } from "react";

type RawSvgProps = {
  svg: string;
  className?: string;
  style?: CSSProperties;
};

// Injeta um SVG cru (sem o React processar atributos), preservando o vetor
// original byte-a-byte. Usado nas "faixas" (card-intersect) e nos ornamentos.
// Puramente estrutural: quem estiliza é o bloco que o renderiza.
export const RawSvg = ({ svg, className, style }: RawSvgProps) => (
  <span
    className={className}
    style={style}
    aria-hidden="true"
    dangerouslySetInnerHTML={{ __html: svg }}
  />
);

export default RawSvg;
