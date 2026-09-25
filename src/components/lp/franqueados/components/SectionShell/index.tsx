import type { ReactNode } from "react";

import styles from "./styles.module.scss";

type SectionShellProps = {
  /** Número do bloco, como no handle original (`01`, `02`, ...). */
  id: string;
  /**
   * Modificador dos handles de flexRow/flexRowContent quando ele não é o
   * próprio `id` — os blocos 02 e 03 usam `with-text-02` / `with-text-03`.
   */
  modifier?: string;
  /** Classes extras no flexRow (ex.: o `--block-franqueado-with-text` genérico). */
  rowClassName?: string;
  /** Classe do CSS module do bloco, que escopa as regras dele. */
  className?: string;
  children: ReactNode;
};

/**
 * Casca repetida em todos os blocos da LP: o container do render + o flexRow +
 * a section + o flexRowContent, todos com os handles originais da VTEX IO.
 * Antes esse aninhamento de 4 níveis aparecia copiado 13 vezes.
 */
export const SectionShell = ({
  id,
  modifier,
  rowClassName,
  className,
  children,
}: SectionShellProps) => {
  const handle = modifier ?? id;

  return (
    <div
      className={[
        styles.section,
        `vtex-render__container-id-block-franqueado-${id}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "vtex-flex-layout-0-x-flexRow",
          rowClassName,
          `vtex-flex-layout-0-x-flexRow--block-franqueado-${handle}`,
          "vtex-flex-layout-0-x-flexRow--lp-franqueado",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <section className="">
          <div
            className={`vtex-flex-layout-0-x-flexRowContent vtex-flex-layout-0-x-flexRowContent--block-franqueado-${handle}`}
          >
            {children}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SectionShell;
