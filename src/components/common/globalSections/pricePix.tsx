/**
 * Seção "PricePix" das Global Sections.
 *
 * Ela existe só para dar ao lojista um formulário no CMS onde editar o desconto
 * no Pix — não desenha nada na página. O RenderSections monta as global
 * sections como IRMÃS do `Children`, então esta seção não envolve a árvore da
 * página e não teria como repassar os dados por contexto até um ProductCard.
 * Quem consome o valor é o hook `usePricePix`
 * (src/sdk/globalSections/usePricePix.ts), que lê a mesma entry do Content
 * Platform pelo BFF.
 *
 * O componente segue registrado em src/components/index.tsx porque toda seção
 * presente no conteúdo do CMS precisa de um componente correspondente — sem
 * ele o RenderSections loga "PricePix not found" no console.
 */
type PricePixProps = {
  /** Percentual do desconto. Ex.: 10. */
  disconter: number;
  /** Texto exibido depois do percentual. Ex.: "OFF no Pix". */
  text: string;
};

export const PricePix = (_props: PricePixProps) => null;
