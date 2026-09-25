import type { SelectOption } from "../../types";

/** Alvo da âncora do CTA do bloco 13 ("SEJA UM FRANQUEADO"). */
export const FORM_ANCHOR_ID = "lp-franqueado-form";

/**
 * Opções de interesse — as mesmas duas do form legado (lojalevis.store).
 * As UFs e os municípios NÃO ficam aqui: vêm do IBGE em tempo de execução
 * (`useIbgeStates` / `useIbgeCities`), como no legado.
 */
export const INTEREST_OPTIONS: SelectOption[] = [
  { value: "franquia", label: "Franquia" },
  { value: "revenda", label: "Revenda" },
];
