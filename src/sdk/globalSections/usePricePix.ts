import { useGlobalSection } from "./useGlobalSections";

/**
 * Props da seção "PricePix" como o lojista preenche no CMS. `disconter` está
 * com o erro de digitação de origem — o nome está preso ao schema já publicado.
 */
type PricePixSection = {
  disconter?: number | string;
  text?: string;
};

export interface PricePix {
  /** Percentual do desconto. Ex.: 10. */
  percentage: number;
  /** Texto exibido depois do percentual. Ex.: "OFF no Pix". */
  text: string;
  /** Linha pronta para renderizar. Ex.: "10% OFF no Pix". */
  label: string;
}

/**
 * Desconto no Pix cadastrado na seção "PricePix" das Global Sections.
 *
 * Cai no `fallback` enquanto o SWR carrega — ou quando a seção não está
 * publicada / o Content Platform falhou. Sem esse fallback o selo sumiria no
 * primeiro paint e voltaria depois.
 */
export function usePricePix(
  fallback: Partial<Omit<PricePix, "label">> = {},
): PricePix {
  const section = useGlobalSection<PricePixSection>("PricePix");

  // O schema declara `disconter` como number, mas o CMS pode devolver string se
  // alguém editar o JSON na mão — normaliza e descarta o que não for válido.
  const parsed = Number(section?.disconter);
  const percentage = Number.isFinite(parsed)
    ? parsed
    : (fallback.percentage ?? 0);

  const text =
    typeof section?.text === "string" && section.text.trim() !== ""
      ? section.text.trim()
      : (fallback.text ?? "");

  return {
    percentage,
    text,
    label: `${percentage}% ${text}`.trim(),
  };
}
