import {
  DEFAULT_SALES_CHANNEL,
  EMPLOYEE_PRICE_TABLE,
  EMPLOYEE_SALES_CHANNEL,
} from "./constants";

/**
 * Helpers puros de canal + regras de decisão (strategy). Funções puras para
 * serem testáveis e reutilizáveis sem depender de React/cookies.
 */

export interface EmployeeDiscountContext {
  isAuthenticated: boolean;
  priceTables: string[];
  salesChannel: string | null;
}

/** Extrai o salesChannel do JSON `session.channel` do FastStore. */
export function getSalesChannel(channel: string | null): string | null {
  if (!channel) {
    return null;
  }

  try {
    const { salesChannel } = JSON.parse(channel);
    return salesChannel != null ? String(salesChannel) : null;
  } catch {
    return null;
  }
}

/**
 * Reescreve apenas o salesChannel preservando o resto do canal (regionId,
 * hasOnlyDefaultSalesChannel, etc.).
 */
export function patchSalesChannel(
  channel: string | null,
  salesChannel: string,
): string {
  let parsedChannel: Record<string, unknown> = {};

  try {
    parsedChannel = channel ? JSON.parse(channel) : {};
  } catch {
    parsedChannel = {};
  }

  return JSON.stringify({ ...parsedChannel, salesChannel });
}

type SalesChannelRule = (ctx: EmployeeDiscountContext) => string | null;

/** Logado com price table de funcionário e fora da política 6 → vai para a 6. */
const upgradeToEmployeeChannel: SalesChannelRule = (ctx) =>
  ctx.isAuthenticated &&
  ctx.priceTables.includes(EMPLOYEE_PRICE_TABLE) &&
  ctx.salesChannel !== EMPLOYEE_SALES_CHANNEL
    ? EMPLOYEE_SALES_CHANNEL
    : null;

/**
 * Na política 6 sem direito a ela (deslogou, ou logou sem a price table de
 * funcionário) → volta para a política padrão.
 */
const restoreDefaultChannel: SalesChannelRule = (ctx) =>
  ctx.salesChannel === EMPLOYEE_SALES_CHANNEL &&
  !(ctx.isAuthenticated && ctx.priceTables.includes(EMPLOYEE_PRICE_TABLE))
    ? DEFAULT_SALES_CHANNEL
    : null;

const rules: SalesChannelRule[] = [
  upgradeToEmployeeChannel,
  restoreDefaultChannel,
];

/**
 * Decide o canal alvo para o contexto atual. `null` significa "não faz nada"
 * (já está na política correta).
 */
export function resolveTargetSalesChannel(
  ctx: EmployeeDiscountContext,
): string | null {
  for (const rule of rules) {
    const target = rule(ctx);

    if (target) {
      return target;
    }
  }

  return null;
}
