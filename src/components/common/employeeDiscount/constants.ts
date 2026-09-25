import storeConfig from "discovery.config";

/** Price table que identifica um funcionário no vtex_segment. */
export const EMPLOYEE_PRICE_TABLE = "funcionarios";

/** Política comercial (sales channel) aplicada a funcionários. */
export const EMPLOYEE_SALES_CHANNEL = "6";

/**
 * Política comercial padrão da loja, lida do discovery.config para não
 * duplicar o valor. Fallback "1" caso o config mude de formato.
 */
export const DEFAULT_SALES_CHANNEL = (() => {
  try {
    const { salesChannel } = JSON.parse(storeConfig.session.channel);
    return String(salesChannel ?? "1");
  } catch {
    return "1";
  }
})();
