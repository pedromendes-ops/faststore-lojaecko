/**
 * Lightweight sibling color, merged onto the product node via the `similars`
 * field (src/graphql/vtex + src/fragments). Shared by the shelf card and the PDP.
 */
export interface SimilarColor {
  productId: string;
  sku: string;
  slug: string;
  colorName: string;
  colorHex: string;
  image: string;
}

/**
 * A single dot rendered by {@link ColorSwatches}. Selection identity is the
 * `productId` (each color is a distinct product), while `sku` is the target the
 * swap fetches — they differ once a size is picked and the active SKU changes.
 */
export interface SwatchItem {
  productId: string;
  sku: string;
  colorName: string;
  colorHex: string;
}
