import { getOverriddenSection, ProductDetailsSection } from "@faststore/core";

// Relative imports so they resolve to this store's custom components
// (the `src/*` alias would resolve to the core components instead).
import ImageGallery from "../../product/ImageGallery";
import ProductDetailsInfo from "../../product/ProductDetailsInfo";

/**
 * Custom ProductDetails section.
 *
 * Overrides:
 * - the native PDP image gallery (`__experimentalImageGallery` slot) with a
 *   swipeable carousel-based gallery (see product/ImageGallery);
 * - the settings block (`__experimentalProductDetailsSettings` slot) with a
 *   store-owned composition of price, quantity selector, SKU selector and buy
 *   button (see product/ProductDetailsInfo).
 *
 * Every other ProductDetails behavior is left untouched.
 */
const CustomProductDetails = getOverriddenSection({
  Section: ProductDetailsSection,
  components: {
    __experimentalImageGallery: {
      Component: ImageGallery,
    },
    __experimentalProductDetailsSettings: {
      Component: ProductDetailsInfo,
    },
  },
});

export default CustomProductDetails;
