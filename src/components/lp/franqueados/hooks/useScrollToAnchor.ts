import { useCallback } from "react";
import type { MouseEvent } from "react";

// O header da loja é sticky e ainda esconde/aparece conforme a direção do
// scroll, então a altura é medida na hora do clique em vez de cravada aqui.
const HEADER_SELECTOR = "[data-fs-header-wrapper]";

// respiro entre o header e o topo do alvo
const GAP = 16;

/**
 * Devolve um onClick para âncoras internas (`href="#id"`) que rola suave e
 * para ABAIXO do header fixo — o pulo nativo do browser ignora o header e
 * deixa o alvo escondido atrás dele.
 *
 * Se o alvo não existir, não faz nada e deixa o `href` agir normalmente.
 */
export const useScrollToAnchor = (targetId: string) =>
  useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      const target = document.getElementById(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      const headerHeight =
        document.querySelector(HEADER_SELECTOR)?.getBoundingClientRect()
          .height ?? 0;

      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight -
        GAP;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      window.scrollTo({
        top: Math.max(top, 0),
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });

      // mantém o hash na URL, como o link nativo faria
      window.history.replaceState(null, "", `#${targetId}`);
    },
    [targetId],
  );
