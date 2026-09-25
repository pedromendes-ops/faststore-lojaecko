// Name→hex fallback used only when the catalog has no `ColorHex` specification.
// Case-insensitive; extend as new colors show up in the catalog.
const COLOR_MAP: Record<string, string> = {
  preto: "#000000",
  branco: "#ffffff",
  cinza: "#d9d9d9",
  bege: "#e8dcc4",
  marrom: "#5b3a29",
  azul: "#1f4e8c",
  "azul marinho": "#0b1f3a",
  vermelho: "#c41230",
  verde: "#3b7a57",
  esmeralda: "#2e8b7a",
  amarelo: "#f2c200",
  rosa: "#e79cc2",
  dourado: "#c9a227",
  prata: "#c0c0c0",
  nude: "#e3bc9a",
  vinho: "#722f37",
  laranja: "#e2711d",
  roxo: "#6a3d9a",
};

/**
 * The catalog's `ColorHex` specification is authoritative; use it when present.
 * Fall back to a name→hex lookup, then a neutral grey.
 */
export function resolveSwatchColor(
  colorHex?: string | null,
  colorName?: string | null,
): string {
  const hex = (colorHex ?? "").trim();
  if (hex) {
    return hex;
  }
  return COLOR_MAP[(colorName ?? "").trim().toLowerCase()] || "#d9d9d9";
}

/** Reads a specification value from a product's `additionalProperty` list. */
export function findSpec(
  additionalProperty:
    | Array<{ name?: string | null; value?: unknown }>
    | null
    | undefined,
  name: string,
): string | undefined {
  const value = additionalProperty?.find(
    (item) => item.name?.toLowerCase() === name.toLowerCase(),
  )?.value;
  return value == null ? undefined : String(value);
}

/**
 * Builds the swatch list for a product: its own color first, then each sibling.
 * `baseProductId` is the product group id of the base color (selection identity);
 * `baseSku` is the SKU the swap fetches when the base color is picked.
 */
export function buildSwatchItems({
  baseProductId,
  baseSku,
  baseColorName,
  baseColorHex,
  similars,
}: {
  baseProductId: string;
  baseSku: string;
  baseColorName?: string | null;
  baseColorHex?: string | null;
  similars: Array<{
    productId: string;
    sku: string;
    colorName: string;
    colorHex: string;
  }>;
}) {
  return [
    {
      productId: baseProductId,
      sku: baseSku,
      colorName: baseColorName ?? "",
      colorHex: baseColorHex ?? "",
    },
    ...similars.map((similar) => ({
      productId: similar.productId,
      sku: similar.sku,
      colorName: similar.colorName,
      colorHex: similar.colorHex,
    })),
  ];
}
